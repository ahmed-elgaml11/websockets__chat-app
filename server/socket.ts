import { Server } from "socket.io";
import { sendMsg, getUser, activateTheUser, getUsersInRoom, getAllActiveRooms, userLeaveApp } from "./userService";
import { server } from "./index";
import { log } from "console";




const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});


io.on('connection', (socket) => {
    socket.on('error', console.error);

    console.log(`User ${socket.id.substring(0, 5)} connected`)
    socket.emit(`message`, sendMsg('ADMIN', 'Welcome to the Chat App!.')) // the connected user


    // when th user enter a room
    socket.on('enterRoom', async ({ name, room }) => {
        // leave the prev room 
        const user = await getUser(socket.id)
        const prevRoom = user?.room
        if (prevRoom) {
            socket.leave(prevRoom)
            io.to(prevRoom).emit('message', sendMsg('ADMIN', `${name} has left the room`))
        }
        // activeTheUser 
        const newUser = await activateTheUser(socket.id, name, room)
        // update the userList prevroom
        if (prevRoom) {
            const users = await getUsersInRoom(prevRoom)
            io.to(prevRoom).emit('userList', {
                users
            })
        }
        // join the new room 
        socket.join(room)

        socket.emit('message', sendMsg('ADMIN', `You have joined the ${newUser.room} chat room`))
        socket.broadcast.to(room).emit('message', sendMsg('ADMIN', `${newUser.name} has joined the room`))

        // update the userList newRoom
        const users = await getUsersInRoom(room)
        io.to(room).emit('userList', {
            users
        })
        // roomList
        io.emit('roomList', {
            rooms: await getAllActiveRooms()
        })
    })


    // when the user diconnect 
    socket.on('disconnect', async () => {
        console.log(`User ${socket.id} disconnected`)
        userLeaveApp(socket.id)
        const user = await getUser(socket.id)
        if (user) {
            socket.leave(user?.room)
            io.to(user.room).emit('message', sendMsg('ADMIN', `${user.name} has left the room`))
            const users = await getUsersInRoom(user.room)
            io.to(user.room).emit('userList', { users })
            io.emit('roomList', {
                rooms: await getAllActiveRooms()
            })
        }

    })






    // lestining on message
    socket.on('message', async ({ name, text }) => {
        const user = await getUser(socket.id)
        log(user)
        if (user) {
            io.to(user?.room).emit('message', sendMsg(name, text))
        }
    })


    socket.on('activity', async (name) => {
        const user = await getUser(socket.id)
        if (user) {
            socket.broadcast.to(user?.room).emit('activity', name)
        }

    })
});