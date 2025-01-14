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
exports.getMessages = exports.sendMessage = void 0;
const zod_1 = require("zod");
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const httpCode_1 = require("../constants/httpCode");
const socket_1 = require("../utils/socket");
exports.sendMessage = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = zod_1.z.string().parse(req.body);
    const receiverId = zod_1.z.string().parse(req.params.id);
    const senderId = req.userId;
    let conversation = yield conversation_model_1.default.findOne({
        participantIds: { $all: [senderId, receiverId] }
    });
    if (!conversation) {
        conversation = yield conversation_model_1.default.create({
            participantIds: [senderId, receiverId]
        });
    }
    const newMessage = yield message_model_1.default.create({
        senderId,
        content: message,
        conversationId: conversation._id
    });
    if (newMessage) {
        conversation = yield conversation_model_1.default.findByIdAndUpdate({ _id: conversation._id }, { $push: { "messageIds": newMessage._id } });
    }
    const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
    if (receiverSocketId) {
        socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(httpCode_1.OK).json(newMessage);
}));
exports.getMessages = (0, catchErrors_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userToChatId = zod_1.z.string().parse(req.params.id);
    const senderId = req.userId;
    const conversation = yield conversation_model_1.default.findOne({
        participantIds: { $all: [senderId, userToChatId] }
    }).populate("messageIds");
    return res.status(httpCode_1.OK).json(conversation === null || conversation === void 0 ? void 0 : conversation.messageIds);
}));
//# sourceMappingURL=messsage.controller.js.map