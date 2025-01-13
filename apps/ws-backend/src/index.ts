import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8081 });

wss.on("connection",(socket) => {

    socket.on("message",(data) => {
        // console.log(data.toString());
        socket.send("Hii");
    })

})