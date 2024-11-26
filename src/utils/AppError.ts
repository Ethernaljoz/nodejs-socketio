import { HttpStatusCode } from "../constants/httpCode";
import assert from "node:assert"

export default class AppError extends Error {
    constructor(
        public statusCode : HttpStatusCode,
        public message: string) {
        super(message);
    }
}

type AppAssert = (
    condition:any,
    httpStatusCode: HttpStatusCode,
    message: string
) => asserts condition

export const appAssert :AppAssert = (conditon, httpStatusCode, message) => assert(conditon, new AppError(httpStatusCode, message))