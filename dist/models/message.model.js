"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    senderId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "User", index: true },
    conversationId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: "Message", index: true },
    content: { type: String, required: true },
}, { timestamps: true });
const MessageModel = mongoose_1.default.model("Message", messageSchema);
exports.default = MessageModel;
//# sourceMappingURL=message.model.js.map