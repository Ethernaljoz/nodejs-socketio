"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const conversationSchema = new mongoose_1.default.Schema({
    participantIds: { type: [mongoose_1.default.Schema.Types.ObjectId], required: true, ref: "User", index: true },
    messageIds: { type: [mongoose_1.default.Schema.Types.ObjectId], required: true, ref: "Message", index: true },
}, { timestamps: true });
const ConversationModel = mongoose_1.default.model("Conversation", conversationSchema);
exports.default = ConversationModel;
//# sourceMappingURL=conversation.model.js.map