import { ValidationError } from "../utils/handleErrors";
import { pool } from "../utils/db/db";
import jwt from "jsonwebtoken";
import { LoginDataCreated, LoginEntity } from "../types";
import { FieldPacket } from "mysql2";

type LoginRecordResults = [LoginEntity[], FieldPacket[]];

export class LoginRecord implements LoginEntity {
  user_id: string;
  refreshToken: string;

  constructor(obj: LoginEntity) {
    if (!obj.user_id || obj.user_id.length !== 36) {
      throw new ValidationError("Id should have 36 characters.");
    }
    if (typeof obj.user_id !== "string") {
      throw new ValidationError("The 'id' data format is invalid!");
    }
    if (!obj.refreshToken || obj.refreshToken.length > 255) {
      throw new ValidationError(
        "The 'refreshToken' cannot be longer than 255 characters."
      );
    }
    if (typeof obj.refreshToken !== "string") {
      throw new ValidationError("The 'refreshToken' data format is invalid!");
    }

    this.user_id = obj.user_id;
    this.refreshToken = obj.refreshToken;
  }

  async insert() {
    await pool.execute(
      "INSERT INTO `login`(`user_id`,`refreshToken`)VALUES(:user_id,:refreshToken)",
      this
    );
  }

  static async getOneByRefreshToken(
    refreshToken: string
  ): Promise<LoginEntity> {
    const [results] = (await pool.execute(
      "SELECT * FROM `login` WHERE `refreshToken` = :refreshToken",
      {
        refreshToken,
      }
    )) as LoginRecordResults;
    return results.length === 0 ? null : new LoginRecord(results[0]);
  }

  static async deleteOneByToken(refreshToken: string): Promise<void> {
    await pool.execute(
      "DELETE FROM `login` WHERE `refreshToken` = :refreshToken",
      {
        refreshToken: refreshToken,
      }
    );
  }

  static createTokens(payload: string): LoginDataCreated {
    const token = jwt.sign({ id: payload }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "10sec",
    });
    const refreshToken = jwt.sign(
      { id: payload },
      process.env.ACCESS_REFRESH_TOKEN_KEY,
      { expiresIn: "24h" }
    );
    return {
      user_id: payload,
      token,
      refreshToken,
    };
  }
}
