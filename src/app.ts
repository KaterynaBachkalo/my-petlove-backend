import express from "express";
import dotenv from "dotenv";
import logger from "morgan";
import cors from "cors";
import { NextFunction, Request, Response } from "express";
import path from "path";

import {
  noticesRouter,
  friendsRouter,
  newsRouter,
  authRouter,
} from "./routes/api";
import { proxyController } from "./controllers";

dotenv.config();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://katerynabachkalo.github.io",
  "https://my-petlove-backend.vercel.app",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/api/users", authRouter);
app.use("/api/notices", noticesRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/news", newsRouter);

app.get("/api/proxy", proxyController);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
