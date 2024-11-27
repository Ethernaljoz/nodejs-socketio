import { createAccount } from "../services/auth.service";
import { registerSchema } from "../schemas/auth.schema";
import catchErrors from "../utils/catchErrors";
import { setAuthCookie } from "../utils/cookie";
import { CREATED } from "../constants/httpCode";

 export const registerHandler = catchErrors( 
    async(req, res)=>{
        const request = registerSchema.parse({...req.body, userAgent:req.headers["user-agent"]})

        const {user, accessToken, refreshToken} = await createAccount(request)

        return setAuthCookie({res, accessToken, refreshToken}).status(CREATED).json(user);
})