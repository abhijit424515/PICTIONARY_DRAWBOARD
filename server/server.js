import express from "express";
import http from "http";
import cors from "cors";
import { userJoin, getUsers, userLeave } from "./utils/user.js";
import { Server } from "socket.io";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);
// var id_count = 0;
// const io = require('socket.io')(server)

app.use((req, res, next) => {
	try {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
	} catch (err) {
		next(err);
	}
});

app.get("/", (req, res) => {
	res.send("server");
});

let imageUrl, userRoom;

// Start listening for socket events from Sails with the specified eventName
io.on("connection", (socket) => {
	// USER JOIN socket function called by client
	socket.on("user-joined", (data) => {
		//id_count++;
		const { roomId, userId, name, host, presenter } = data; // received data
		userRoom = roomId;
		const user = userJoin(socket.id, id_count, name, roomId, host, presenter); // add user to chat
		const roomUsers = getUsers(user.room); // get all users present in this room
		socket.join(user.room); // user joins the room
		socket.emit("message", {
			message: "Welcome to ChatRoom",
		}); // welcome message for room
		socket.broadcast.to(user.room).emit("message", {
			message: `${user.name} has joined`,
		}); // chatBot message for new users (not to the user)

		io.to(user.room).emit("users", roomUsers); // Broadcast players list to ALL users
		io.to(user.room).emit("canvasImage", imageUrl); // Broadcast drawboard to ALL users
	});

	// DRAWING socket function called by client
	socket.on("drawing", (data) => {
		imageUrl = data;
		socket.broadcast.to(userRoom).emit("canvasImage", imageUrl);
	});

	// DISCONNECT socket function called by client
	socket.on("disconnect", () => {
		const userLeaves = userLeave(socket.id);
		const roomUsers = getUsers(userRoom);

		if (userLeaves) {
			io.to(userLeaves.room).emit("message", {
				message: `${userLeaves.name} left the chat`,
			});
			io.to(userLeaves.room).emit("users", roomUsers);
		}
	});

	// Receive Chat from clients
	socket.on("chat", (data) => {
		// const { message, roomId } = data; // received data
		socket.broadcast.to(userRoom).emit("chat", data);
	});

	// Receive change of turn and send changes to clients
	socket.on("turn", () => {
		console.log("received turn change message ");
		/*const { turn, roomId } = data; // received data
        io.in(roomId).emit("turn", {
            turn
        });*/

		// Send out change of turn
		socket.broadcast.emit("change-turn");
	});
});

// SERVE on port and start listening for API calls
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
	console.log(`server is listening on http://localhost:${PORT}`)
);
