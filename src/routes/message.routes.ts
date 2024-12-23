import { Router } from "express";
import { getMessages, sendMessage } from "../controllers/messsage.controller";

const messageRoutes = Router()

// prefix /message
messageRoutes.post("/send/:id",sendMessage)
messageRoutes.get("/:id",getMessages)



export default messageRoutes