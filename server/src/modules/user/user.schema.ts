import { object, string, TypeOf } from "zod";

export const registerUserSchema = {
    body: object({
        username: string({
            required_error: "username is required!"
        }),
        email: string({
            required_error: "email is required!"
        }),
        password: string({
            required_error: "password is required!"
        }).min(6, "Password must be atleast six characters logn").max(64,
            "password should not be longer than 64 characters"),
        comfirmPassword: string({
            required_error: "username is required!"
        })
    }).refine((data) => data.password === data.comfirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    })
}