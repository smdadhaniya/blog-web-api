import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/custom-error";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
};
