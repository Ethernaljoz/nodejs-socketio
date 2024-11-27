import { ErrorRequestHandler,Response } from "express";
import AppError from "../utils/AppError";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/httpCode";
import { z } from "zod";
import { REFRESH_PATH,clearAuthCookie } from "../utils/cookie";


const handleAppError = (res:Response, error:AppError) => {
    return res.status(error.statusCode).json({message: error.message});
}

const handleZodError = (res: Response, error:z.ZodError) => {
    const errors = error.issues.map( error =>{
        path: error.path.join(".")
        error: error.message
    })
    return res.status(BAD_REQUEST).json({errors, message: error.message});
}


const errorHandler:ErrorRequestHandler = async (error,req,res,next)=>{
    if(req.path === REFRESH_PATH){
        clearAuthCookie(res)
    }
    
    if(error instanceof AppError) {
        return handleAppError(res, error)
    }
    if(error instanceof z.ZodError) {
        return handleZodError(res, error)
    }

    console.log(error)
    return res.status(INTERNAL_SERVER_ERROR).send('Internal server error')
}
export default errorHandler