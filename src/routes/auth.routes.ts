import { Router } from "express";
import { loginHandler, logoutHandler, refreshHandler, registerHandler } from "../controllers/auth.controller";

const authRouter = Router()

// prefix /auth
authRouter.post("/register",registerHandler)
authRouter.post("/login",loginHandler)
authRouter.post("/logout",logoutHandler)
authRouter.post("/refresh",refreshHandler)
export default authRouter