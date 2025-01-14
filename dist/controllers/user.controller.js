"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersForSidebar = exports.getUserHandler = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const AppError_1 = require("../utils/AppError");
const httpCode_1 = require("../constants/httpCode");
const httpCode_2 = require("../constants/httpCode");
exports.getUserHandler = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.userId);
    (0, AppError_1.appAssert)(user, httpCode_1.NOT_FOUND, "User not found");
    return res.status(httpCode_2.OK).json(user.omitPassword());
}));
exports.getUsersForSidebar = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const usersFind = yield user_model_1.default.find({
        where: {
            _id: { $not: userId }
        }
    });
    const users = usersFind.map(user => user.omitPassword());
    return res.status(httpCode_2.OK).json(users);
}));
//# sourceMappingURL=user.controller.js.map