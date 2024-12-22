import { Router } from "express";
import { getUserHandler } from "../controllers/user.controller";

const userRoutes = Router()

// prefix /user
userRoutes.post("/",getUserHandler)



export default userRoutes