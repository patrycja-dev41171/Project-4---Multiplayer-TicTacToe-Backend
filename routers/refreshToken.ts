import { Router } from "express";
import { LoginRecord } from "../records/login.record";
import jwt from "jsonwebtoken";
import { ValidationError } from "../utils/handleErrors";
import { UserRecord } from "../records/user.record";

export const refreshTokenRouter = Router().get("/", async (req, res) => {
  const refreshToken: string = req.cookies.refreshToken;

  if (!refreshToken) {
    res.json("");
  } else {
    const result = await LoginRecord.getOneByRefreshToken(refreshToken);
    if (!result) {
      res.clearCookie("refreshToken");
      throw new ValidationError("No login information in the database!");
    }

    const user = await UserRecord.getOneByUserId(result.user_id);
    jwt.verify(refreshToken, process.env.ACCESS_REFRESH_TOKEN_KEY, (err) => {
      if (err) {
        res.clearCookie("refreshToken");
        throw new ValidationError("RefreshToken verification incorrect!");
      }

      try {
        const accessToken = jwt.sign(
          { user_id: result.user_id },
          process.env.ACCESS_TOKEN_KEY,
          { expiresIn: "10sec" }
        );

        res.json({
          accessToken: accessToken,
          user_id: user.id,
          username: user.username,
        });
      } catch (err) {
        throw new ValidationError(
          "An error occurred while refreshing the access token."
        );
      }
    });
  }
});
