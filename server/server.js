import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import * as db from "./utils/user.js";

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
		const { roomID, userID, name, host, presenter, number, points, answered } =
			data; // received data
		userRoom = roomID;
		const count_in_room = db.getCount(roomID);
		const user = db.userJoin(
			userID,
			socket.id,
			count_in_room + 1,
			name,
			roomID,
			host,
			presenter,
			points,
			answered
		); // add user to chat
		const roomUsers = db.getUsers(user.room); // get all users present in this room
		socket.join(user.room); // user joins the room
		socket.emit("message", {
			message: "Welcome to ChatRoom",
		}); // welcome message for room
		socket.broadcast.to(user.room).emit("message", {
			message: `${user.name} has joined`,
		}); // chatBot message for new users (not to the user)

		io.to(user.room).emit("users", roomUsers); // Broadcast players list to ALL users
		io.to(user.room).emit("canvasImage", imageUrl); // Broadcast drawboard to ALL users
		if (count_in_room > 1) {
			socket.emit("game-started");
		}
	});

	// DRAWING socket function called by client
	socket.on("drawing", (data) => {
		imageUrl = data["image"];
		socket.broadcast.to(data["from"]).emit("canvasImage", imageUrl);
	});

	// DISCONNECT socket function called by client
	socket.on("disconnect", () => {
		const userLeaves = db.userLeave(socket.id);

		if (userLeaves) {
			const roomUsers = db.getUsers(userLeaves.room);

			io.to(userLeaves.room).emit("message", {
				message: `${userLeaves.name} left the chat`,
			});
			io.to(userLeaves.room).emit("users", roomUsers);

			db.updateNumbers(userLeaves.room, userLeaves.number);
		}
	});

	// Receive Chat from clients
	socket.on("chat", (data) => {
		// Check for correct answer
		const answer = db.getAnswer(data.roomID);
		if (
			data.msg.toString().trim().toLowerCase() ===
			answer.toString().trim().toLowerCase()
		) {
			db.updatePoints(data.fromID, data.roomID);
			//io.to(data.roomID).emit("change-points", db.getPointArray(data.roomID));
			io.to(data.roomID).emit("change-points", db.getUsers(data.roomID));


			if (
				db.fetchUser(data.fromID) &&
				db.fetchUser(data.fromID)["answered"] === false
			) {

				io.in(data.roomID).emit("correct", {
					from: data.from,
					fromID: data.fromID,
				});
				db.updateAnswered(data.fromID);
				// db.increaseAnswered(data.roomID);

				if (db.checkAllAnswered(data.roomID) === true) {

					if (db.isRoundOver(data.roomID)) {
						db.resetAfterTurn(data.roomID);
						const rnd = db.getRound(data.roomID);
						const winners = db.getWinners(data.roomID);
						io.in(data.roomID).emit("roundOver", {
							round: rnd,
							winners: winners,
						});
					} else {

						const newDrawer = db.getDrawer(data.roomID);
						const newPrompts = db.getNewPrompts(data.roomID);
						db.resetAfterTurn(data.roomID);
						db.updateAnswered(newDrawer);


						io.in(data.roomID).emit("prompt", {
							drawerID: newDrawer,
							words: newPrompts.words,
							indices: newPrompts.indices,
							// isFirst: false,
						});
					}
				}
			}
		} else {
			socket.broadcast
				.to(data.roomID)
				.emit("chat", { from: data.from, msg: data.msg });
		}
	});

	// Receive change of turn and send changes to clients
	socket.on("turn", (room) => {
		// Send out change of turn
		socket.broadcast.to(room).emit("change-turn");
	});

	// Send Prompts to clients
	socket.on("request-prompt", ({ room, userID }) => {
		if (db.getCount(room) > 0) {
			if (db.checkIfRound(room)) {
				const drawer = db.retFirstUserinRoom(room);
				const prompts = db.getNewPrompts(room);

				socket.in(room).emit("prompt", {
					drawerID: drawer,
					words: prompts.words,
					indices: prompts["indices"],
				});
			}
		}
	});

	socket.on("ready", (roomID) => {
		socket.broadcast.to(roomID).emit("game-started");
	});

	socket.on("setAns", (data) => {
		db.setAns(data.roomID, data.ans);
		db.takenPrompt(data.index, data.roomID);
		io.to(data.roomID).emit("set-timers");
		io.to(data.roomID).emit("reset-mfs");
	});

	// Game starts here
	socket.on("startGame", (data) => {
		console.log("//// GAME STARTED ////");
	});

	socket.on("time-over", (room) => {

		if (db.isRoundOver(room)) {
			db.resetAfterTurn(room);
			const rnd = db.getRound(room);
			const winners = db.getWinners(room);
			io.in(room).emit("roundOver", {
				round: rnd,
				winners: winners,
			});
		} else {

			const newDrawer = db.getDrawer(room);
			const newPrompts = db.getNewPrompts(room);
			db.resetAfterTurn(room);
			db.updateAnswered(newDrawer);

			io.in(room).emit("prompt", {
				drawerID: newDrawer,
				words: newPrompts.words,
				indices: newPrompts.indices,
				// isFirst: false,
			});
		}
	});

});

// SERVE on port and start listening for API calls
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
	console.log(`server is listening on http://localhost:${PORT}`)
);
