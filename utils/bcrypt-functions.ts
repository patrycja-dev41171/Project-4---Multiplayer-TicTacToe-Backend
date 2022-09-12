import * as bcrypt from "bcrypt";
import { ValidationError } from "./handleErrors";

export const hashPassword = (password: string): string => {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  } catch (error) {
    console.log("An error occurred while hashing the password.", error);
    throw new ValidationError("An error occurred while registering a user.");
  }
};

export const isPasswordCorrect = (
  passwordEntered: string,
  hashedPassword: string
): boolean => {
  try {
    return bcrypt.compareSync(passwordEntered, hashedPassword);
  } catch (error) {
    console.log("An error occurred while comparing passwords.", error);
    throw new ValidationError("An error occurred while login a user.");
  }
};
