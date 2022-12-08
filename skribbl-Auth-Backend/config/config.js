import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const DB = await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: process.env.DB_NAME,
		});
		console.log(`MongoDB connected at ${DB.connection.host}`);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

export default connectDB;
