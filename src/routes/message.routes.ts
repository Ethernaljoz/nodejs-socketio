import { Router } from "express";
import { sendMessage } from "../controllers/messsage.controller";

const messageRoutes = Router()

// prefix /message
messageRoutes.post("/send/:id",sendMessage)



export default messageRoutes