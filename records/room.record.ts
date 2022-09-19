import { ValidationError } from "../utils/handleErrors";
import { pool } from "../utils/db/db";
import { v4 as uuid } from "uuid";
import { RoomEntity, Room } from "../types";
import { FieldPacket } from "mysql2";

type RoomResults = [RoomEntity[], FieldPacket[]];

export class RoomRecord implements RoomEntity {
  room_id?: string;
  first_user_id: string;
  second_user_id?: string | null;
  room_type: Room;

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
    this.room_type = obj.room_type;
  }

  async insert(): Promise<string> {
    await pool.execute(
      "INSERT INTO `room`(`room_id`,`first_user_id`," +
        " `room_type`)VALUES(:room_id,:first_user_id,:room_type)",
      this
    );
    return this.room_id;
  }

  static async getOneByRoom_id(room_id: string): Promise<RoomEntity> {
    const [results] = (await pool.execute(
      "SELECT * FROM `room` WHERE `room_id` =" + " :room_id",
      {
        room_id,
      }
    )) as RoomResults;
    return results.length === 0 ? null : results[0];
  }

  static async deleteRoomByUser(first_user_id: string): Promise<void> {
    await pool.execute(
      "DELETE FROM `room` WHERE `first_user_id` = :first_user_id",
      {
        first_user_id: first_user_id,
      }
    );
  }

  static async joinRoom(second_user_id: string): Promise<void> {
    await pool.execute("UPDATE `room` SET `second_user_id` = :second_user_id", {
      ...this,
      second_user_id: second_user_id,
    });
  }

  static async getFreeRandomRoom(): Promise<RoomEntity> {
    const [results] = (await pool.execute(
      "SELECT * FROM `room` WHERE `room_type` = :room_type" +
        " AND  `second_user_id` IS NULL",
      {
        room_type: Room.random,
      }
    )) as RoomResults;
    return results.length === 0 ? null : results[0];
  }

  static async deleteRoom(room_id: string): Promise<void> {
    await pool.execute(
      "DELETE FROM `room` WHERE `room_id` = :room_id AND  `second_user_id` IS NULL",
      {
        room_id: room_id,
      }
    );
  }
}
