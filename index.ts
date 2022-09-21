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
import { config } from "./config/config";

const app = express();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: config.corsOrigin,
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

app.use("/api/sign-up", signUpRouter);
app.use("/api/login", loginRouter);
app.use("/api/refreshToken", refreshTokenRouter);
app.use("/api/game", auth, gameRouter);
app.use("/api/home", auth, homeDataRouter);

app.use(handleError);

server.listen(3001, "0.0.0.0", () => {
  console.log("Listening on http://localhost:3001");
});
