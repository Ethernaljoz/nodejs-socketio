import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"
import "dotenv/config"
import { APP_ORIGIN, PORT } from "./constants/env"


const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors:{
        origin:APP_ORIGIN,
        credentials: true
    }
})
const port = PORT



server.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})