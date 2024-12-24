import { Router } from "express";
import { getUserHandler, getUsersForSidebar } from "../controllers/user.controller";

const userRoutes = Router()

// prefix /user
userRoutes.get("/",getUserHandler)
userRoutes.get("/conversation",getUsersForSidebar)


export default userRoutes