import { pool } from "../utils/db/db";
import { HomeData } from "../types";
import { FieldPacket } from "mysql2";

type HomeDataResults = [HomeData[], FieldPacket[]];

export class HomeDataRecord implements HomeData {
  user_id: string;
  username: string;
  points: number;

  constructor(obj: HomeData) {
    this.user_id = obj.user_id;
    this.username = obj.username;
    this.points = obj.points;
  }

  static async getAll(): Promise<HomeData[]> {
    const [results] = (await pool.execute(
      "SELECT `play`.`user_id`, `user`.`username`, `play`.`points` FROM `play` JOIN `user` ON" +
        " `play`.`user_id` = `user`.`id`"
    )) as HomeDataResults;
    return results.length === 0 ? null : results.map((obj) => obj);
  }

  static async getNumberOfGames(user_id: string): Promise<number> {
    const [results] = (await pool.execute(
      "SELECT * FROM `play` WHERE `user_id` = :user_id", {
          user_id,
        }
    )) as HomeDataResults;
    return results.length;
  }
}
