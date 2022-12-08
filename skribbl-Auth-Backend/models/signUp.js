import mongoose from "mongoose";

const signUpSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	datetime: {
		type: Date,
		required: true,
	},
});

const SignUp = mongoose.model("SignUp", signUpSchema, "SignUp");
export default SignUp;
