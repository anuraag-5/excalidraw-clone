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

app.post("/room", middleware, (req: Request, res: Response) => {
  const roomData = CreateRoomSchema.safeParse(req.body);
  if (!roomData.success) {
    res.status(403).json({
      error: "Incorrect inputs.",
    });

    return;
  }

  const userId = req.userId

  res.json({
    roomId: "123",
  });
});

app.listen(3002);
