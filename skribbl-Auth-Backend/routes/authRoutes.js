import express from "express";
const router = express.Router();

import { signupSendOtp, signupVerifyOtp } from "../controllers/signup.js";
import login from "../controllers/login.js";

router.route("/auth/signup/sendotp").post(signupSendOtp);
router.route("/auth/signup/verifyotp").post(signupVerifyOtp);
router.route("/auth/login").post(login);

export default router;
