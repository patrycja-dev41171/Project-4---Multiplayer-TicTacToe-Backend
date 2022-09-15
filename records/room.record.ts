import { ValidationError } from "../utils/handleErrors";
import { pool } from "../utils/db/db";
import { v4 as uuid } from "uuid";
import { RoomEntity } from "../types";

export class RoomRecord implements RoomEntity {
  room_id?: string;
  first_user_id: string;
  second_user_id?: string | null;

  constructor(obj: RoomEntity) {
    if (!obj.first_user_id || obj.first_user_id.length !== 36) {
      throw new ValidationError("The 'user id' should contain 36 characters.");
    }
    if (typeof obj.first_user_id !== "string") {
      throw new ValidationError("The 'user_id' data format is invalid!");
    }

    this.room_id = obj.room_id ?? uuid();
    this.first_user_id = obj.first_user_id;
    this.second_user_id = obj.second_user_id ?? null;
  }

  async insert(): Promise<string> {
    console.log(this)
    await pool.execute(
      "INSERT INTO `room`(`room_id`,`first_user_id`)VALUES(:room_id,:first_user_id)",
      this
    );
    return this.room_id;
  }
}
