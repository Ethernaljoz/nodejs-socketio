import { createAccount, login } from "../services/auth.service";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import catchErrors from "../utils/catchErrors";
import { clearAuthCookie, setAuthCookie } from "../utils/cookie";
import { CREATED, OK } from "../constants/httpCode";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../models/session.model";

 export const registerHandler = catchErrors( 
    async(req, res)=>{
        const request = registerSchema.parse({...req.body, userAgent:req.headers["user-agent"]})

        const {user, accessToken, refreshToken} = await createAccount(request)

        return setAuthCookie({res, accessToken, refreshToken}).status(CREATED).json(user);
})

export const loginHandler = catchErrors( 
    async(req, res)=>{
        const request = loginSchema.parse({...req.body, userAgent:req.headers["user-agent"]})

        const {user, accessToken, refreshToken} = await login(request)
        

        return setAuthCookie({res, accessToken, refreshToken}).status(OK).json({message: "login successfully"});
})


export const logoutHandler = catchErrors( 
    async(req, res)=>{
        const token = req.cookies.accessToken as string | undefined

        const { payload } = verifyToken(token || "")

        if(payload) {
            await SessionModel.findByIdAndDelete(payload.sessionId)
        }

        return clearAuthCookie(res).status(OK).json({message: "logout successfully"});
})