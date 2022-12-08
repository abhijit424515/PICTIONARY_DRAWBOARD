import expressAsyncHandler from "express-async-handler";
import bcryptjs from "bcryptjs";
import User from "../models/users.js";

const isUserExists = expressAsyncHandler(async (email) => {
	const user = await User.findOne({ email: email });
	if (user) return true;
	else return false;
});

const UserLogin = expressAsyncHandler(async (email, password) => {
	const user = await User.findOne({ email: email });
	if (user) {
		if (await bcryptjs.compare(password, user.password)) return [user, 2];
		else return [user, 1];
	} else return [user, 0];
});

export { isUserExists, UserLogin };
