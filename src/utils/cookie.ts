import { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, ThirtyDaysFromNow } from "./helpers";

interface SetAuthCookieParams {
    res: Response;
    accessToken: string;
    refreshToken: string;
}


const secure = process.env.NODE_ENV === "development";

export const REFRESH_PATH = "/auth/refresh"
const defaultCookieOptions: CookieOptions= {
    sameSite: 'strict',
    httpOnly: true,
    secure,
}

export const getAccessTokenCookieOptions = ()=>({
    ...defaultCookieOptions,
    expires: fifteenMinutesFromNow()
})

export const getRefreshTokenCookieOptions = ()=>({
    ...defaultCookieOptions,
    expires: ThirtyDaysFromNow(),
    path: REFRESH_PATH
})

export const setAuthCookie = ({res, accessToken, refreshToken}:SetAuthCookieParams) =>{
    return res.cookie("accessToken", accessToken,getAccessTokenCookieOptions()).cookie("refreshToekn",refreshToken,getRefreshTokenCookieOptions())
}

export const clearAuthCookie = (res:Response)=>{
     return res.clearCookie("accessToken").clearCookie("refreshToken",{...defaultCookieOptions, path: REFRESH_PATH})
}





















