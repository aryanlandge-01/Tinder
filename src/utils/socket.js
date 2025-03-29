const socket = require("socket.io");


const initiazeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection",(socket) => {
        // Handle user connection
        socket.on("joinChat",({userId,targetUserId}) => {
            const roomId = [userId,targetUserId].sort().join("_");
            console.log("joining room" + roomId);
            
            socket.join(roomId);
        })

        socket.on("sendMessage",({
            firstName,
            userId,
            targetUserId,
            text
          }) => {
            const roomId = [userId,targetUserId].sort().join("_");
            console.log("sending message to room: " + firstName +  ": " + text);
            io.to(roomId).emit("receiveMessage",{firstName,text})
        })

        socket.on("disconnect",() => {

        })
    })

}

module.exports = initiazeSocket;