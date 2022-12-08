import { UserLogin } from "./userAuth.js";
import { default as jwt } from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";

const login = expressAsyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	if (email && password) {
		var [user, status] = await UserLogin(email, password);

		if (status === 2) {
			const token = await jwt.sign(
				{ id: user._id.toString() },
				process.env.SECRET_KEY
			);

			res.json({ token: token });
		} else if (status === 1) {
			res.status(500).json({ msg: "Password is wrong." });
		} else if (status === 0) {
			res.status(500).json({ msg: "No user found." });
		}
	} else {
		res.status(500).json({ msg: "Incorrect input format." });
	}
});

export default login;
