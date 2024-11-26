import { SignOptions } from "jsonwebtoken"
import { SessionDocument } from "../models/session.model"
import { UserDocument } from "../models/user.model"
import { JWT_SECRET,JWT_REFRESH_SECRET } from "../constants/env"



// -----------------------------------@types----------------------------------------
export type accessTokenPayload = {
    sessionId: SessionDocument["_id"]
    userId:UserDocument["_id"]
}
export type refreshTokenPayload ={
    sessionId: SessionDocument["_id"]
}

type signOptionsAndSecret = SignOptions & { secret: string}
type verifyOptionsAndSecret = SignOptions & { secret?: string}


// -----------------------------------@Sign options----------------------------------------

const defaultOptions: SignOptions = {
    audience:["user"]
}

const accessTokenOptions :signOptionsAndSecret = {
    secret: JWT_SECRET,
    expiresIn:"15m"
}

const refreshTokenOptions :signOptionsAndSecret = {
    secret: JWT_REFRESH_SECRET,
    expiresIn:"30d"
}


 //------------------------------------------@function------------------------------



























