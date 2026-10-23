import { z } from 'zod'

export const authSchema = z.object ({
    email: z.string().email('please enter a valid email'),
    password: z.string().min(6, "password must be atleast 6 characters")
})