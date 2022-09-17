import express from "express";
import "express-async-errors";
const http = require("http");
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import { handleError } from "./utils/handleErrors";
import { signUpRouter } from "./routers/signUp";
import { Server } from "socket.io";
import { loginRouter } from "./routers/login";
import { refreshTokenRouter } from "./routers/refreshToken";
import { gameRouter } from "./routers/game";
import { auth } from "./utils/auth";
import {homeDataRouter} from "./routers/homeData";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
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

io.on("connection", (socket: any) => {
  console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", (data: any) => {
    socket.join(data);
    console.log(`User ${socket.id} join the room: ${data}`);
    socket.to(data).emit("player_join", socket.id);
  });

  socket.on("send_message", (data: any) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconect", socket.id);
  });
});
