import VerificationCodeModel from "../models/verificationCode.model";
import { CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND, TOO_MANY_REQUESTS, UNAUTHORIZED } from "../constants/httpCode";
import UserModel from "../models/user.model";
import { appAssert } from "../utils/AppError";
import { verificationCodeType } from "../utils/types";
import { fiveMinutesAgo, oneDays, oneHourFromNow, oneYearFromNow, ThirtyDaysFromNow } from "../utils/helpers";
import SessionModel from "../models/session.model";
import { signToken, refreshTokenOptions, verifyToken, refreshTokenPayload } from "../utils/jwt";
import { APP_ORIGIN } from "../constants/env";
import bcrypt from "bcrypt"

interface CreateAccountParams{
    username: string,
    email: string,
    password: string,
    userAgent?: string,
}


export const createAccount =async ( data: CreateAccountParams)=>{
    const existingUser = await UserModel.exists({email: data.email})
    appAssert(!existingUser, CONFLICT,"Email already in use")

    const user = await UserModel.create({username: data.username, email:data.email, password: data.password})

    const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type: verificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    })

    //send email
    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`

    const { error } = await sendMail({
      to: user.email,
      ...getVerifyEmailTemplate(url),
    });

    if(error){
        return console.error({ error });
    } 

    const session = await SessionModel.create({
        userId:user._id,
        userAgent : data.userAgent,
    })

    const accessToken = signToken({userId:user._id, sessionId:session._id})
    const refreshToken = signToken({sessionId:session._id }, refreshTokenOptions)

    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    }
}

interface LoginParams {
    email: string,
    password: string,
    userAgent?: string,
}

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
    const user = await UserModel.findOne({email})
    appAssert(user,NOT_FOUND,"User not found")

    const count = await VerificationCodeModel.countDocuments({
        userId:user._id,
        type:verificationCodeType.PasswordReset,
        createdAt:{$gt:fiveMinutesAgo()}
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

}

type ResetParams = {
    verificationCode: string,
    password: string
}

export const resetPassword= async({verificationCode,password}: ResetParams) => {
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

































































