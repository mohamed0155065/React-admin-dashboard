
import { z } from "zod";

export const RegisterSchema = z.object({
    fullName: z.string().min(3, "Name must be at least 3 letters"),
    email: z.string().trim().toLowerCase().email("Incorrect Email").refine(val => val.endsWith("@gmail.com"), {
        message: "Must be gmail address"
    }),
    password: z.string().min(8, "password must atleast 8 letters"),
    confirmPassword: z.string(),


})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })
export type RegisterInput = z.infer<typeof RegisterSchema>;

