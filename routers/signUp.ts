import { Router } from "express";
import { ValidationError } from "../utils/handleErrors";
import { UserRecord } from "../records/user.record";
import { hashPassword } from "../utils/bcrypt-functions";

export const signUpRouter = Router();

signUpRouter.post("/", async (req, res) => {
  const { username, password, confirmPassword, email, confirmEmail } = req.body;

  if (password !== confirmPassword) {
    throw new ValidationError("Passwords are incorrect.");
  }
  if (email !== confirmEmail) {
    throw new ValidationError("Emails are incorrect.");
  }

  if ((await UserRecord.getOneByEmail(email)) !== null) {
    throw new ValidationError("The user with this email is already registered.");
  }
  if ((await UserRecord.getOneByUsername(username)) !== null) {
    throw new ValidationError("The user with this username is already registered.");
  }

  const User = await new UserRecord({
    username: username,
    password: hashPassword(password),
    email: email,
  });

  try {
    await User.insert();
  } catch (er) {
    throw new ValidationError(
      "An error occurred while registering a new user."
    );
  }

  res.json("User registered.");
});
