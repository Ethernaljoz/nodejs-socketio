import VerificationCodeModel from "../models/verificationCode.model";
import SessionModel from "../models/session.model";
import bcrypt from "bcrypt"
import UserModel from "../models/user.model";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/httpCode";
import { appAssert } from "../utils/AppError";
import { verificationCodeType } from "../utils/types";
import { fiveMinutesAgo, oneDays, oneHourFromNow, oneYearFromNow, ThirtyDaysFromNow } from "../utils/helpers";
import { signToken, refreshTokenOptions, verifyToken, refreshTokenPayload } from "../utils/jwt";
import { APP_ORIGIN } from "../constants/env";
import { getPasswordResetTemplate } from "../constants/emailTemplate";
import { sendMail } from "../utils/sendMail";
import { getVerifyEmailTemplate } from "../constants/emailTemplate";

type CreateAccountParams = {
    username:string;
    email: string;
    password: string;
    userAgent?: string;
  };


  export const createAccount = async (data: CreateAccountParams) => {
    // verify email is not taken
    const existingUser = await UserModel.exists({
      email: data.email,
    });
    appAssert(!existingUser, CONFLICT, "Email already in use");
  
    const user = await UserModel.create({
      email: data.email,
      password: data.password,
    });
    const userId = user._id;
    const verificationCode = await VerificationCodeModel.create({
      userId,
      type: verificationCodeType.EmailVerification,
      expiresAt: oneYearFromNow(),
    });
  
    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
  
    const { error } = await sendMail({
      to: user.email,
      ...getVerifyEmailTemplate(url),
    });
    if (error) console.error(error);
  
    const session = await SessionModel.create({
      userId,
      userAgent: data.userAgent,
    });
  
    const refreshToken = signToken(
      {
        sessionId: session._id,
      },
      refreshTokenOptions
    );
    const accessToken = signToken({
      userId,
      sessionId: session._id,
    });
    return {
      user: user.omitPassword(),
      accessToken,
      refreshToken,
    };
  };

type LoginParams = {
    email: string;
    password: string;
    userAgent?: string;
};

export const login = async (data: LoginParams)=>{
    const user = await UserModel.findOne({email:data.email})
    appAssert(user,UNAUTHORIZED,"Invalid email or password")

    const passwordMatch =user.comparePassword(data.password)
    appAssert(passwordMatch,UNAUTHORIZED,"Invalid email or password")

    const session = await SessionModel.create({
        userId:user._id,
        userAgent:data.userAgent,
    })

    const accessToken = signToken({userId:user._id, sessionId:session._id})
    const refreshToken = signToken({sessionId:session._id}, refreshTokenOptions)

    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    }
}

export const refreshUserAccessToken =async(refreshToken:string)=>{
    const { payload } = verifyToken<refreshTokenPayload>(refreshToken, {secret: refreshTokenOptions.secret})
    appAssert(payload,UNAUTHORIZED,"Invalid refresh token")

    const session = await SessionModel.findById(payload.sessionId)
    const now = Date.now()
    appAssert(session && session.expiresAt.getTime() > now,UNAUTHORIZED,"Session expired")

    const sessionNeedsRefresh = session.expiresAt.getTime() - now < oneDays

    if (sessionNeedsRefresh) {
       session.expiresAt = ThirtyDaysFromNow()
        await session.save()
    }

    const accessToken = signToken({userId:session.userId,
        sessionId:session._id
    })

    const newRefreshToken = sessionNeedsRefresh ? signToken({sessionId:session._id},refreshTokenOptions) : undefined

    return {
        accessToken,
        newRefreshToken
    }
}

export const verifyEmail = async(code:string)=>{
    const validCode = await VerificationCodeModel.findOne({
    _id:code,
    type:verificationCodeType.EmailVerification,
    expiresAt:{$gte: new Date()}
    })

    appAssert(validCode,NOT_FOUND,"Invalid or expired verification code")

    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId,{verified:true}, {new:true}
    )

    appAssert(updatedUser,INTERNAL_SERVER_ERROR,"failed to verify email")
    
    await validCode.deleteOne()
    return{user: updatedUser.omitPassword()}
}

export const sendPasswordResetEmail = async(email: string)=>{
    try {
    const user = await UserModel.findOne({email})
    appAssert(user,NOT_FOUND,"User not found")

    const fiveMinAgo = fiveMinutesAgo()
    const count = await VerificationCodeModel.countDocuments({
        userId:user._id,
        type:verificationCodeType.PasswordReset,
        createdAt:{$gt:fiveMinAgo}
    })
    appAssert(count <=1,TOO_MANY_REQUESTS,"Too many request,please try again later")

    const expiresAt = oneHourFromNow()
    const verificationCode = await VerificationCodeModel.create({
        userId:user._id,
        type:verificationCodeType.PasswordReset,
        expiresAt,
    })

    const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`

    const { data, error } = await sendMail({
      to: email,
      ...getPasswordResetTemplate(url),
    });

    appAssert(data?.id, INTERNAL_SERVER_ERROR,`${error?.name} - ${error?.message}`)

    return {
        url,
        emailId : data.id
    }
        
    } catch (error:any) {
        console.log("SendPasswordResetEmail :",error.message)
    }
    
}

type ResetPasswordParams = {
    password: string;
    verificationCode: string;
};

export const resetPassword= async({verificationCode,password}: ResetPasswordParams) => {
    const validCode = await VerificationCodeModel.findOne({
        _id:verificationCode,
        type:verificationCodeType.PasswordReset,
        expiresAt:{$gt:new Date()}
    })

    appAssert(validCode,NOT_FOUND,"Invalid or expired verification code")

    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId,
        {password : await bcrypt.hash(password, 12)}
    )

    appAssert(updatedUser,INTERNAL_SERVER_ERROR,"failed to reset the user password")

    await validCode.deleteOne()

    await SessionModel.deleteMany({userId:validCode.userId})

    return {
        user: updatedUser.omitPassword()
    }

}

































































