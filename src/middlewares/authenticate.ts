import { RequestHandler } from "express";
import mongoose from "mongoose";
import { UNAUTHORIZED } from "../constants/httpCode";
import { appAssert } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";


const authenticate: RequestHandler = (req,res,next)=> {
    const accesToken = req.cookies.accessToken as string || undefined

    appAssert(accesToken, UNAUTHORIZED,"not authorized- invalid access token")

    const { error, payload } = verifyToken(accesToken)
    appAssert(payload, UNAUTHORIZED,error ==="jwt expired"?"token expired":"invalid token")

    req.userId = payload.userId as mongoose.Types.ObjectId,
    req.sessionId = payload.sessionId as mongoose.Types.ObjectId

    next()

}

export default authenticate