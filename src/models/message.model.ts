import mongoose from "mongoose"



export interface MessageDocument extends mongoose.Document {
    senderId: mongoose.Types.ObjectId;
    conversationId:mongoose.Types.ObjectId;
    content: string;
    createdAt:Date;
    updatedAt:Date;
}

const messageSchema = new mongoose.Schema<MessageDocument>({
    senderId:{type: mongoose.Schema.Types.ObjectId, required:true, ref:"User", index:true},
    conversationId:{type: mongoose.Schema.Types.ObjectId, required:true, ref:"Message", index:true},
    content: {type:String, required:true},
},{timestamps:true})

const MessageModel = mongoose.model<MessageDocument>("Message", messageSchema)
export default  MessageModel