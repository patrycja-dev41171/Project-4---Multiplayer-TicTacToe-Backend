import { ValidationError } from "../utils/handleErrors";
import { pool } from "../utils/db/db";
import { PlayEntity } from "../types";

export class PlayRecord implements PlayEntity {
  user_id: string;
  points: number;
  date?: Date;

  constructor(obj: PlayEntity) {
    if (!obj.user_id || obj.user_id.length !== 36) {
      throw new ValidationError("The 'user id' should contain 36 characters.");
    }
    if (typeof obj.user_id !== "string") {
      throw new ValidationError("The 'user_id' data format is invalid!");
    }

    if (typeof obj.points !== "number") {
      throw new ValidationError("The 'points' data format must be number!");
    }

    this.user_id = obj.user_id;
    this.points = obj.points;
    this.date = obj.date ?? new Date();
  }

  async insert(): Promise<void> {
    await pool.execute(
      "INSERT INTO `play`(`user_id`,`points`, `date`)VALUES(:user_id,:points,:date)", this);
  }
}
