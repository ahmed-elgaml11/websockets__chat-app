import mongoose from "mongoose"
import env from "./env"


export const main = async () => {
        await mongoose.connect(env.DB_URL)
        console.log(`connected successfully to DB`)
}

