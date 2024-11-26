import mongoose from "mongoose"
import { ThirtyDaysFromNow } from "../utils/helpers"


export interface SessionDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId
    userAgent:string,
    createdAt:Date
    expiresAt:Date
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
    userId:{type: mongoose.Schema.Types.ObjectId, required:true, ref:"User", index:true},
    userAgent:{type: String, required:true},
    createdAt:{type:Date, required:true, default: Date.now()},
    expiresAt:{type:Date, required:true, default: ThirtyDaysFromNow()}

},{timestamps:true})

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema)
export default  SessionModel