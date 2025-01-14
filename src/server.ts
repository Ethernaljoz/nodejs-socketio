import express,{Response, Request} from "express"
import "dotenv/config"
import { PORT } from "./constants/env"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes"
import errorHandler from "./middlewares/errorHandler"
import connectDB from "./utils/db"
import userRoutes from "./routes/user.routes"
import authenticate from "./middlewares/authenticate"
import sessionRoutes from "./routes/session.routes"
import messageRoutes from "./routes/message.routes"
import { app, server } from "./utils/socket"





const port = PORT
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get("/", (req: Request, res: Response) => {
  res.send('<h1>Welcome to Socketio ts</h1>');
});



app.use("/api/auth", authRoutes)
app.use("/api/user", authenticate, userRoutes)
app.use("/api/session", authenticate, sessionRoutes)
app.use("/api/message", authenticate, messageRoutes)


app.use((req: Request, res: Response) => {
  res.status(404).json({message: "Route not found"})
})


app.use(errorHandler)

server.listen(port, ()=>{
  connectDB()
    console.log(`server running on http://localhost:${port}`)
})