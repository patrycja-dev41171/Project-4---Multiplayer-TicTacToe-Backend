import express from "express";
import "express-async-errors";
const http = require("http");
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import {Server, Socket} from "socket.io";
import { auth } from "./utils/auth";
import { handleError } from "./utils/handleErrors";
import { homeDataRouter } from "./routers/homeData";
import { gameRouter } from "./routers/game";
import { refreshTokenRouter } from "./routers/refreshToken";
import { signUpRouter } from "./routers/signUp";
import { loginRouter } from "./routers/login";
import { config } from "./config/config";
import {GameMove, GameResults} from "./types";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
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


io.on("connection", (socket: Socket) => {
    socket.on("join_room", (room_id:string) => {
        socket.join(room_id);
        socket.to(room_id).emit("player_join");
    });

    socket.on("game-move", (data: GameMove) => {
        socket.to(data.room).emit("other_user_move", data);
    });

    socket.on("game-results", (data: GameResults) => {
        socket.to(data.room).emit("game-results", data);
    });

    socket.on("disconnecting", function () {
        const id = socket.id;
        socket.rooms.forEach(function (room:string) {
            if (room != id) {
                socket.to(room).emit("user-disconnect", { room: room });
            }
        });
    });

    socket.on("user-disconnect", function () {
        const id = socket.id;
        socket.rooms.forEach(function (room: string) {
            if (room != id) {
                socket.to(room).emit("user-disconnect", { room: room });
            }
        });
    });
});

server.listen(3001, "0.0.0.0", () => {
    console.log("Listening on http://localhost:3001");
});