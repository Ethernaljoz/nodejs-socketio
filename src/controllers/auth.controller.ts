import { createAccount, login } from "../services/auth.service";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import catchErrors from "../utils/catchErrors";
import { setAuthCookie } from "../utils/cookie";
import { CREATED, OK } from "../constants/httpCode";

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