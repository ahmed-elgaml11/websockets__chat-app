import z from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
    PORT: z.string().min(1, "PORT is required"),
    DB_URL: z.string().min(1, "URL is required"),
})

export default envSchema.parse(process.env)