import {io} from "./index";

io.on("connection", (socket: any) => {
    socket.on("join_room", (data: any) => {
        socket.join(data);
        socket.to(data).emit("player_join", socket.id);
    });

    socket.on("game-move", (data: any) => {
        socket.to(data.room).emit("other_user_move", data);
    });

    socket.on("game-results", (data: any) => {
        socket.to(data.room).emit("game-results", data);
    });

    socket.on("disconnecting", function (reason: any) {
        const id = socket.id;
        socket.rooms.forEach(function (room: any) {
            if (room != id) {
                socket.to(room).emit("user-disconnect", { room: room });
            }
        });
    });

    socket.on("user-disconnect", function (reason: any) {
        const id = socket.id;
        socket.rooms.forEach(function (room: any) {
            if (room != id) {
                socket.to(room).emit("user-disconnect", { room: room });
            }
        });
    });
});