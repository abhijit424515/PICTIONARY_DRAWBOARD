import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cors from "cors";

import connectDB from "./config/config.js";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from "dotenv";
dotenv.config();

import Authenticate from "./middleware/authenticate.js";
import authRoutes from "./routes/authRoutes.js";

connectDB();
const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(methodOverride("_method"));
app.use(cors());

app.use("/", authRoutes);
app.use(Authenticate);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running at port ${port}`));
