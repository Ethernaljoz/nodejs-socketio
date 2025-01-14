"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthCookie = exports.setAuthCookie = exports.getRefreshTokenCookieOptions = exports.getAccessTokenCookieOptions = exports.REFRESH_PATH = void 0;
const helpers_1 = require("./helpers");
const secure = process.env.NODE_ENV === "development";
exports.REFRESH_PATH = "/auth/refresh";
const defaultCookieOptions = {
    sameSite: 'strict',
    httpOnly: true,
    secure,
};
const getAccessTokenCookieOptions = () => (Object.assign(Object.assign({}, defaultCookieOptions), { expires: (0, helpers_1.fifteenMinutesFromNow)() }));
exports.getAccessTokenCookieOptions = getAccessTokenCookieOptions;
const getRefreshTokenCookieOptions = () => (Object.assign(Object.assign({}, defaultCookieOptions), { expires: (0, helpers_1.ThirtyDaysFromNow)(), path: exports.REFRESH_PATH }));
exports.getRefreshTokenCookieOptions = getRefreshTokenCookieOptions;
const setAuthCookie = ({ res, accessToken, refreshToken }) => {
    return res.cookie("accessToken", accessToken, (0, exports.getAccessTokenCookieOptions)()).cookie("refreshToekn", refreshToken, (0, exports.getRefreshTokenCookieOptions)());
};
exports.setAuthCookie = setAuthCookie;
const clearAuthCookie = (res) => {
    return res.clearCookie("accessToken").clearCookie("refreshToken", { path: exports.REFRESH_PATH });
};
exports.clearAuthCookie = clearAuthCookie;
//# sourceMappingURL=cookie.js.map