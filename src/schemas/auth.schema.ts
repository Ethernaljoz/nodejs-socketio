// import { z } from "zod";

// export const registerSchema = z.object({
//     username: z.string().min(3).max(50),
//     email: z.string().email().min(3).max(225),
//     password: z.string().min(8).max(50),
//     confirmPassword: z.string().min(8).max(50),
//     userAgent: z.string().optional()
// }).refine( (data)=> data.password === data.confirmPassword,{
//     message:"password do not match"
// })

// export const loginSchema = z.object({
//   email: z.string().email().min(3).max(225),
//   password: z.string().min(8).max(50),
//   userAgent: z.string().optional()
// });

// export const  verificationCodeSchema = z.string().min(1).max(26)

// export const  emailSchema = z.string().max(255)

// export const resetPasswordSchema = z.object({
//   verificationCode: z.string().min(1).max(26),
//   password: z.string().min(8).max(50),
// });


import { z } from "zod";

export const emailSchema = z.string().email().min(1).max(255);

const passwordSchema = z.string().min(6).max(255);

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    username: z.string().min(3).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.string().min(1).max(24);

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});


































