import mongoose from "mongoose"

export interface ConversationDocument extends mongoose.Document {
    participantIds: mongoose.Types.ObjectId[];
    messageIds:mongoose.Types.ObjectId[];
    createdAt:Date;
    updatedAt:Date;
}

const conversationSchema = new mongoose.Schema<ConversationDocument>({
    participantIds:{type: [mongoose.Schema.Types.ObjectId], required:true, ref:"User", index:true},
    messageIds:{type: [mongoose.Schema.Types.ObjectId], required:true, ref:"Message", index:true},
},{timestamps:true})

const ConversationModel = mongoose.model<ConversationDocument>("Conversation", conversationSchema)
export default  ConversationModel