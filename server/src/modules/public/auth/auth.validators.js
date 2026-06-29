import { body } from "express-validator";

const signupValidator = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage(
      "Username is required"
    )
    .isLength({ min: 3 })
    .withMessage(
      "Username must be at least 3 characters long"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage(
      "Invalid email format"
    ),

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required"
    )
    .isLength({ min: 8 })
    .withMessage(
      "Password must be at least 8 characters long"
    ),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage(
      "Invalid email format"
    ),

  body("password")
    .notEmpty()
    .withMessage(
      "Password is required"
    ),
];

export {
  signupValidator,
  loginValidator,
};