import express from "express"
import { createServer } from "http"
import cors from "cors"
import "dotenv/config"
import { APP_ORIGIN, PORT } from "./constants/env"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes"
import errorHandler from "./middlewares/errorHandler"
import connectDB from "./utils/db"
import userRoutes from "./routes/user.routes"
import authenticate from "./middlewares/authenticate"
import sessionRoutes from "./routes/session.routes"


const app = express()
const server = createServer(app)




const port = PORT
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);


app.use("/auth", authRoutes)
app.use("/user",authenticate ,userRoutes)
app.use("/session",authenticate ,sessionRoutes)


app.use(errorHandler)

server.listen(port,()=>{
  connectDB()
    console.log(`server running on http://localhost:${port}`)
})