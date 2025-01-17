import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { middleware } from "./middleware.js";
import { JWT_SECRET } from "@repo/backend-common/config";
import {
  CreateRoomSchema,
  CreateUserSchema,
  SigninSchema,
} from "@repo/common/types";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
  const userData = CreateUserSchema.safeParse(req.body);
  if (!userData.success) {
    res.status(403).json({
      error: "Incorrect inputs.",
    });

    return;
  }

  // db calls
  try {
    const user = await prismaClient.user.create({
      data: {
        name: userData.data.name,
        password: userData.data.password,
        email: userData.data.email,
      },
    });

    res.json({
      userId: user.id,
    });
  } catch (error) {
    res.status(411).json({
      error: "User already exists.",
    });
  }

  res.json({
    userId: "123",
  });
});

app.post("/signin", async (req, res) => {
  const userData = SigninSchema.safeParse(req.body);
  if (!userData.success) {
    res.status(403).json({
      error: "Incorrect inputs.",
    });

    return;
  }

  try {
    const existingUser = await prismaClient.user.findFirst({
      where: {
        email: userData.data.email,
      },
    });

    if (userData.data.password !== existingUser?.password) {
      res.json({
        message: "Incorrect Password.",
      });
      return
    }

    const token = jwt.sign(
      {
        userId: existingUser?.id,
      },
      JWT_SECRET
    );

    res.json({
      token,
    });
  } catch (error) {
    res.status(411).json({
      message: "user does not exists with provided email.",
    });
  }
});

app.post("/room", middleware, async (req: Request, res: Response) => {
  const roomData = CreateRoomSchema.safeParse(req.body);
  if (!roomData.success) {
    res.status(403).json({
      error: "Incorrect inputs.",
    });

    return;
  }

  const userId = req.userId;
  if(!userId){
    return
  }

  try {
    const room = await prismaClient.room.create({
        data: {
            slug: roomData.data.name,
            adminId: userId
        }
    })

    res.json({
        roomId: room.id
    })
  } catch (error) {
    res.json({
        message: "Room with this name already exists."
    })
  }
});

app.get("/chats/:roomId", async (req, res) => {
  const roomId = Number(req.params.roomId);
  const messages = await prismaClient.chat.findMany({
    where: {
      roomId
    },
    orderBy: {
      id: "desc"
    },
    take: 20
  })

  res.json(messages)
})

app.listen(3002);
