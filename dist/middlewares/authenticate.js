"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpCode_1 = require("../constants/httpCode");
const AppError_1 = require("../utils/AppError");
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    const accesToken = req.cookies.accessToken || undefined;
    (0, AppError_1.appAssert)(accesToken, httpCode_1.UNAUTHORIZED, "not authorized- invalid access token");
    const { error, payload } = (0, jwt_1.verifyToken)(accesToken);
    (0, AppError_1.appAssert)(payload, httpCode_1.UNAUTHORIZED, error === "jwt expired" ? "token expired" : "invalid token");
    req.userId = payload.userId,
        req.sessionId = payload.sessionId;
    next();
};
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map