import express from "express";
import "express-async-errors";
const http = require("http");
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import { Server } from "socket.io";
import { auth } from "./utils/auth";
import { handleError } from "./utils/handleErrors";

import { homeDataRouter } from "./routers/homeData";
import { gameRouter } from "./routers/game";
import { refreshTokenRouter } from "./routers/refreshToken";
import { signUpRouter } from "./routers/signUp";
import { loginRouter } from "./routers/login";

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

dotenv.config({ path: ".env" });

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/sign-up", signUpRouter);
app.use("/login", loginRouter);
app.use("/refreshToken", refreshTokenRouter);
app.use("/game", auth, gameRouter);
app.use("/home", auth, homeDataRouter);

app.use(handleError);

server.listen(8080, (localhost: any) => {
  console.log("Listening on http://localhost:8080");
});
