import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection",(socket) => {

    socket.on("message",(data) => {
        // console.log(data.toString());
        socket.send("Hii");
    })

})