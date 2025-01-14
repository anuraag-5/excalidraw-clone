import express from "express"
import jwt from "jsonwebtoken"
import { middleware } from "./middleware";

const app = express();

app.post("/signup",(req,res) => {
    res.json({
        userId: "123"
    })
})

app.post("/signin",(req,res) => {
    const userId = "1";
    jwt.sign({
        userId
    },process.env.JWT_SECRET!);
    console.log(process.env.JWT_SECRET! || "Undefined logged")
})

app.post("/room", middleware, (req,res) => {
    res.json({
        roomId: "123"
    })
})

app.listen(3001)
