import { Request, Response, NextFunction } from "express";
import { Log } from "logging_middleware";

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  void Log("backend", "INFO", "http", `${req.method} ${req.path} incoming request`);
  next();
};
