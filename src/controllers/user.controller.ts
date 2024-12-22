import UserModel from "../models/user.model";
import catchErrors from "../utils/catchErrors";
import { appAssert } from "../utils/AppError";
import { NOT_FOUND } from "../constants/httpCode";
import { OK } from "../constants/httpCode";

export const getUserHandler = catchErrors( 
    async(req, res)=>{
       const user = await UserModel.findById(req.userId)
       appAssert(user,NOT_FOUND,"User not found")
       return res.status(OK).json(user.omitPassword())
})