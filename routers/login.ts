import { Router } from "express";
import { ValidationError } from "../utils/handleErrors";
import { UserRecord } from "../records/user.record";
import { isPasswordCorrect } from "../utils/bcrypt-functions";
import { LoginRecord } from "../records/login.record";

export const loginRouter = Router();

loginRouter
  .post("/", async (req, res) => {
    const { email, password } = req.body;

    if (
      req.cookies.refreshToken !== undefined &&
      (await LoginRecord.getOneByRefreshToken(req.cookies.refreshToken))
    ) {
      throw new ValidationError("User is already logged in.");
    }

    const user = await UserRecord.getOneByEmail(email);

    if (user === null) {
      throw new ValidationError("The user with this email is not registered.");
    }

    if (!isPasswordCorrect(password, user.password)) {
      throw new ValidationError("Password is incorrect.");
    }

    const loginDataCreated = await LoginRecord.createTokens(user.id);

    const loginRecord = new LoginRecord({
      user_id: user.id,
      refreshToken: loginDataCreated.refreshToken,
    });

    await loginRecord.insert();

    res
      .cookie("refreshToken", loginDataCreated.refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        user_id: user.id,
        accessToken: loginDataCreated.token,
      });
  })

  .delete("/", async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ValidationError("User cannot be logged out!");
    }

    try {
      await LoginRecord.getOneByRefreshToken(refreshToken);
      await LoginRecord.deleteOneByToken(refreshToken);
      res.clearCookie("refreshToken").json("The user has been logged out.");
    } catch (err) {
      throw new ValidationError("There was an error logging out the user!");
    }
  });
