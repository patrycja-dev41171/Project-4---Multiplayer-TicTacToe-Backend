import { Router } from "express";
import { Room } from "../types";
import { RoomRecord } from "../records/room.record";
import { ValidationError } from "../utils/handleErrors";
import { UserRecord } from "../records/user.record";
import { PlayRecord } from "../records/play.record";

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
  })

  .get("/get-opponent/:room_id/:user_id", async (req, res) => {
    const room = await RoomRecord.getOneByRoom_id(req.params.room_id);

    if (room === null) {
      throw new ValidationError("Game error. No such game room.");
    }

    if (room.first_user_id === req.params.user_id) {
      const user = await UserRecord.getOneByUserId(room.second_user_id);
      if (user === null) {
        throw new ValidationError("There is no specific user in the database.");
      }
      res.json({
        opponentName: user.username,
      });
    } else {
      const user = await UserRecord.getOneByUserId(room.first_user_id);
      if (user === null) {
        throw new ValidationError("There is no specific user in the database.");
      }
      res.json({
        opponentName: user.username,
      });
    }
  })

  .post("/save-result", async (req, res) => {
    const { user_id, points } = req.body;

    const play = await new PlayRecord({
      user_id: user_id,
      points: points,
    });

    try {
      await play.insert();
      res.json("Results saved.");
    } catch (err) {
      throw new ValidationError(
        "An error occurred while saving results in database."
      );
    }
  });
