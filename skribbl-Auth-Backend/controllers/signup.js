import expressAsyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
const HASH_SALT = 10;

import { isUserExists } from "./userAuth.js";
import sendotpmail from "./sendOTPMail.js";
import SignUp from "../models/signUp.js";
import User from "../models/users.js";

const signupSendOtp = expressAsyncHandler(async (req, res, next) => {
	let email = req.body.email;

	if (await isUserExists(email)) {
		return res
			.status(500)
			.send({ error: "You are already signed up, try login." });
	}

	let OTP = await sendotpmail(email);
	if (OTP) {
		await SignUp.updateOne(
			{ email: email },
			{
				$set: { otp: OTP, datetime: new Date() },
			},
			{ upsert: true }
		);
		res.json({ status: true });
	} else {
		res.status(500).send({ error: "Couldn't send OTP." });
	}
});

const signupVerifyOtp = expressAsyncHandler(async (req, res, next) => {
	var { email: email, otp: OTP, password: password } = req.body;

	if (await isUserExists(email)) {
		return res
			.status(500)
			.send({ error: "You are already signed up, try login." });
	}

	var otp_data = await SignUp.findOne({
		email: email,
	});

	if (!otp_data) {
		return res
			.status(500)
			.send({ error: "No OTP generated for the given email ID." });
	}

	if (otp_data.otp === OTP) {
		await SignUp.deleteOne({ user: email });

		if (new Date() - otp_data.datetime > process.env.OTP_EXPIRY_TIME) {
			return res.status(500).send({ error: "OTP expired, try again." });
		} else {
			await User.create(
				{
					email: email,
					password: await bcryptjs.hash(password, 10),
				},
				(err, _) => {
					if (err) next(new Error(err));
				}
			);

			res.status(200).json({ msg: "OTP verified, user created" });
		}
	} else {
		res.status(500).json({ msg: "Wrong OTP, try again." });
	}
});

export { signupSendOtp, signupVerifyOtp };
