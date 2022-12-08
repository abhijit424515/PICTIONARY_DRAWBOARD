import mongoose from "mongoose";

const userSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

const User = mongoose.model("User", userSchema, "Users");
export default User;
