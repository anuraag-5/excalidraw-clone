import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"

const wss = new WebSocketServer({ port: 8081 });

wss.on("connection", (socket, request) => {

  if (!request.url) {
    console.error("Request URL is undefined");
    socket.close(1008, "Invalid request");
    return;
  }

  const url = new URL(request.url);
  const queryParams = url.searchParams;
  const token = queryParams.get("token") || "";

  const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload;
  if(!decoded || !decoded.userId){
    socket.close();
    return;
  }

  socket.on("message", (data) => {
    // console.log(data.toString());
    socket.send("pong");
  });
});
