import { z } from "zod";
import catchErrors from "../utils/catchErrors";
import ConversationModel from "../models/conversation.model";
import { appAssert } from "../utils/AppError";
import MessageModel from "../models/message.model";
import { OK } from "../constants/httpCode";

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
        conversation.messageIds.push(newMessage._id!)  
    }

    //socket io will go here
    return res.status(OK).json(newMessage)
})