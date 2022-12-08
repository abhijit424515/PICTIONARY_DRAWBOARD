import dotenv from "dotenv";
dotenv.config();
import * as nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import expressAsyncHandler from "express-async-handler";

const sendOTPMail = expressAsyncHandler(async (email) => {
	var OTP = otpGenerator.generate(6, {
		digits: true,
		lowerCaseAlphabets: false,
		upperCaseAlphabets: false,
		specialChars: false,
	});

	const mailTransporter = nodemailer.createTransport({
		host: "smtp.zoho.in",
		port: 465,
		secure: true,
		auth: {
			user: process.env.ZOHO_MAIL,
			pass: process.env.ZOHO_PASSWORD,
		},
	});

	let mailDetails = {
		from: process.env.ZOHO_MAIL,
		to: email,
		subject: "Sign Up OTP from skribbl.io",
		text: "Your OTP is : " + OTP,
	};

	try {
		await mailTransporter.sendMail(mailDetails);
		// console.log("Email sent successfully");
		return OTP;
	} catch (err) {
		console.log("Error : ", err);
		return false;
	}
});

export default sendOTPMail;
