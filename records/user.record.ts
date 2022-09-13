import { ValidationError } from "../utils/handleErrors";
import { v4 as uuid } from "uuid";
import { pool } from "../utils/db/db";
import { UserEntity } from "../types";
import {FieldPacket} from "mysql2";

type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
  id?: string;
  username: string;
  email: string;
  password: string;

  constructor(obj: UserEntity) {
    if (!obj.email || obj.email.length > 255) {
      throw new ValidationError(
        "Email cannot be empty or longer than 255 characters"
      );
    }
    if (typeof obj.email !== "string") {
      throw new ValidationError("The 'email' data format is invalid!");
    }
    if (!obj.password || obj.password.length < 8 || obj.password.length > 255) {
      throw new ValidationError(
        "The 'password' cannot be empty, shorter than 8, and longer than 255 characters."
      );
    }
    if (typeof obj.password !== "string") {
      throw new ValidationError("The 'password' data format is invalid!");
    }
    if (!obj.username || obj.username.length < 5 || obj.username.length > 30) {
      throw new ValidationError(
        "The 'username' cannot be empty, shorter than 5, and longer than 30 characters."
      );
    }
    if (typeof obj.username !== "string") {
      throw new ValidationError("The 'username' data format is invalid!");
    }

    this.id = obj.id ?? uuid();
    this.username = obj.username;
    this.email = obj.email;
    this.password = obj.password;
  }

  async insert() {
    await pool.execute(
      "INSERT INTO `user` (`id`,`username`, `email`, `password`)VALUES(:id,:username,:email,:password)",
      this
    );
  }

  static async getOneByEmail(email: string): Promise<UserEntity> {
    const [results] = (await pool.execute('SELECT * FROM `user` WHERE `email` = :email', {
      email,
    })) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  static async getOneByUsername(username: string): Promise<UserEntity> {
    const [results] = (await pool.execute('SELECT * FROM `user` WHERE `username` = :username', {
      username,
    })) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }

  static async getOneByUserId(user_id: string): Promise<UserEntity> {
    const [results] = (await pool.execute('SELECT * FROM `user` WHERE `user_id` = :user_id', {
      user_id,
    })) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0]);
  }
}
