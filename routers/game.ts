import { Router } from "express";
import { RoomRecord } from "../records/room.record";
import { ValidationError } from "../utils/handleErrors";
import { Room } from "../types";

export const gameRouter = Router();

gameRouter

  .get("/start/friend/:user_id", async (req, res) => {
    try {
      const room = await new RoomRecord({
        first_user_id: req.params.user_id,
        room_type: Room.friend,
      });
      const room_id = await room.insert();
      res.json({
        room_id: room_id,
      });
    } catch (err) {
      throw new ValidationError("An error occurred while starting the game.");
    }
  })

  .post("/join/friend/:user_id", async (req, res) => {
    const room = await RoomRecord.getOneByRoom_id(req.body.code);

    if (room === null) {
      throw new ValidationError("Invalid code.");
    }

    if (room.second_user_id !== null) {
      throw new ValidationError("Too many game participants.");
    }

    try {
      await RoomRecord.joinRoom(req.params.user_id);
      res.json({
        room_id: room.room_id,
      });
    } catch (err) {
      throw new ValidationError("An error occurred while joining the game.");
    }
  })

  .get("/start/random/:user_id", async (req, res) => {
    await RoomRecord.deleteRoomByUser(req.params.user_id);

    const room = await RoomRecord.getFreeRandomRoom();

    if (room === null) {
      try {
        const room = await new RoomRecord({
          first_user_id: req.params.user_id,
          room_type: Room.random,
        });
        const room_id = await room.insert();
        res.json({
          room_id: room_id,
          startGame: false,
        });
      } catch (err) {
        throw new ValidationError("An error occurred while starting the game.");
      }
    } else {
      try {
        await RoomRecord.joinRoom(req.params.user_id);
        res.json({
          room_id: room.room_id,
          startGame: true,
        });
      } catch (err) {
        throw new ValidationError("An error occurred while joining the game.");
      }
    }
  });
