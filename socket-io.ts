import {Socket} from "socket.io";
import {GameMove, GameResults} from "./types";
import {io} from "./index";

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