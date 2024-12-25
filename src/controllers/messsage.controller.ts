import { z } from "zod";
import catchErrors from "../utils/catchErrors";
import ConversationModel from "../models/conversation.model";
import MessageModel from "../models/message.model";
import { OK } from "../constants/httpCode";
import { getReceiverSocketId, io } from "../utils/socket";

export const sendMessage = catchErrors( 
    async(req, res)=>{
       const  message  = z.string().parse(req.body)
       const receiverId = z.string().parse(req.params.id)
       const senderId = req.userId

       let conversation = await ConversationModel.findOne({
            participantIds :{$all :[senderId, receiverId]}
       })

    if(!conversation){
        conversation = await ConversationModel.create({
            participantIds: [senderId, receiverId]
        })
    }

    const newMessage = await MessageModel.create({
        senderId,
        content: message,
        conversationId: conversation._id
    })

    if(newMessage){
        conversation = await ConversationModel.findByIdAndUpdate(
            {_id: conversation._id},
            {$push:{"messageIds":newMessage._id}},
        )
    }

    const receiverSocketId = getReceiverSocketId(receiverId)
    if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage)
    }
    
    return res.status(OK).json(newMessage)
})




export const getMessages = catchErrors( 
    async(req, res)=>{
        const userToChatId = z.string().parse(req.params.id)
        const senderId = req.userId

        const conversation = await ConversationModel.findOne({
            participantIds :{$all :[senderId, userToChatId]}
        }).populate("messageIds")

        return res.status(OK).json(conversation?.messageIds)
})


















