import { z } from "zod";

export const registerSchema = z.object({
    username: z.string().min(3).max(50),
    email : z.string().email().max(225),
    password: z.string().min(8).max(20),
    confirmPassword: z.string().min(8).max(20),
    userAgent: z.string().optional()
}).refine( (data)=> data.password === data.confirmPassword, {
    message: "password do not match"
})