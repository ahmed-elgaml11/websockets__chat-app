import mongoose from 'mongoose'; 

interface IUser {
    socketId: string,
    name: string,
    room: string
}
const userSchema = new mongoose.Schema<IUser>({
    socketId: String,
    name: String,
    room: String
})
export default mongoose.model<IUser>('User', userSchema)