import { Router } from "express";
import { RoomRecord } from "../records/room.record";
import { ValidationError } from "../utils/handleErrors";

export const gameRouter = Router();

gameRouter.get("/start/:user_id", async (req, res) => {
  console.log(req.params.user_id.length);

  try {
    const room = await new RoomRecord({
      first_user_id: req.params.user_id,
    });
    const room_id = await room.insert();
    res.json({
      room_id: room_id,
    });
  } catch (err) {
    throw new ValidationError("An error occurred while starting the game.");
  }
});
