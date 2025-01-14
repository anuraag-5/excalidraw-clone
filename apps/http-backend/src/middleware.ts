import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] || "";

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

  if (decodedToken) {
    req.userId = decodedToken.userId;
    next();
  } else {
    res.status(403).json({
      message: "unauthorized",
    });
  }
}
