import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["authorization"] || "";

  const decodedToken = jwt.verify(token, JWT_SECRET) as JwtPayload

  if (decodedToken.userId) {
    req.userId = decodedToken.userId;
    next();
  } else {
    res.status(403).json({
      message: "unauthorized",
    });
  }
}
