import { z } from "zod"

export const CreateUserSchema = z.object({
    username: z.string()
    .min(1, "Username must be at least 1 character long.")
    .max(30, "Username must be at most 30 characters long.")
    .regex(
      /^[a-zA-Z0-9._]+$/,
      "Username can only contain letters, numbers, underscores, and dots."
    )
    .regex(
      /^(?!.*\.\.).*$/,
      "Username cannot have consecutive dots."
    )
    .regex(
      /^(?!\.).*$/,
      "Username cannot start with a dots."
    )
    .regex(
      /.*[^.]$/,
      "Username cannot end with a dots."
    ),
    password: z.string().min(6,"Password must be at least 6 character long.")
    .max(30,"Password cannot exceed 30 character."),

    name: z.string()
    .min(2,"Name should atleast have 2 charcters.")
    .max(50,"Name cannot exceed 50 charcter.")
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const CreateRoomSchema = z.object({
    name: z.string()
    .min(2,"Room name should be atleast 2 character long.")
    .max(30,"Room name cannot exceed 30 character.")
})