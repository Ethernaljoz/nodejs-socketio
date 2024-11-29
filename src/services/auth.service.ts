import VerificationCodeModel from "../models/verificationCode.model";
import { CONFLICT, UNAUTHORIZED } from "../constants/httpCode";
import UserModel from "../models/user.model";
import { appAssert } from "../utils/AppError";
import { verificationCodeType } from "../utils/types";
import { oneYearFromNow } from "../utils/helpers";
import SessionModel from "../models/session.model";
import { signToken, refreshTokenOptions } from "../utils/jwt";


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


