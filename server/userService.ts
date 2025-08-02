import User from './userModel'
export const sendMsg = (who: string, msg: string) => {
    return {
        name: who,
        text: msg,
        time: new Intl.DateTimeFormat('default', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }).format(new Date())
    }
}


export const getUser = async (id: string) => {
    return User.findOne({socketId: id})
}


export const activateTheUser = async (id: string, name: string, room: string) => {
    return User.findOneAndUpdate({socketId: id}, {
        socketId: id, 
        name, 
        room
    }, {
        upsert: true,
        new: true
    })
}


export const getUsersInRoom = async (room: string) => {
    return User.find({room})
}

export const getAllActiveRooms = async () => {
    const users = await User.find()
    const rooms = users.map(user => user.room)
    return [...new Set(rooms)]
}

export const userLeaveApp = async (id: string) => {
    return User.findOneAndDelete({socketId: id})
}


