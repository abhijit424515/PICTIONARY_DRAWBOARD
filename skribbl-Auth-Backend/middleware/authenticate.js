import { default as jwt } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

let Authenticate = async (req, res, next) => {
	const token = req.headers["x-access-token"];
	try {
		const decoded = await jwt.verify(token, process.env.SECRET_KEY);
		console.log(decoded);
		req.user = decoded.id;
		next();
	} catch (_) {
		res.status(501).json({ msg: "Invalid JSON webtoken" });
	}
};
export default Authenticate;
