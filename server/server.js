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
		const { roomID, userID, name, host, presenter, number, points, answered } = data; // received data
		// console.log(data);
		userRoom = roomID;
		console.log(roomID);
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
		console.log("answer is " + answer);
		console.log("received answer is " + data.msg + ", given by " + data.from);
		if (data.msg.toString().trim().toLowerCase() === answer.toString().trim().toLowerCase()) {

			console.log("match correct");

			console.log(db.fetchUser(data.fromID));


			if (db.fetchUser(data.fromID) && db.fetchUser(data.fromID)["answered"] === false) {

				console.log("in if statement");

				io.in(data.roomID).emit("correct", {
					from: data.from,
					fromID: data.fromID,
				});
				db.updateAnswered(data.fromID);

				if(db.checkAllAnswered(data.roomID) === true){
					
					db.updatePoints(data.fromID, 100);

					if(db.isRoundOver(data.roomID)){
						console.log("###### round over");
						db.resetAfterTurn(data.roomID);
						const rnd = db.getRound(data.roomID);
						const winners = db.getWinners(data.roomID);
						io.in(data.roomID).emit("roundOver", {'round':rnd, 'winners': winners});
					}
					else{
					console.log("turn over");

					const newDrawer = db.getDrawer(data.roomID);
					console.log("newDrawer is " + newDrawer);
					console.log("over here");
					const newPrompts = db.getNewPrompts(data.roomID);
					console.log("after getting prompts");
					console.log("newPrompts are ");
					console.log(newPrompts);
					console.log("data.roomID " + data.roomID);
					db.resetAfterTurn(data.roomID);
					db.updateAnswered(newDrawer);

					console.log("about to emit");
				
					io.in(data.roomID).emit("prompt", {'drawerID': newDrawer, 'words': newPrompts.words, 'indices': newPrompts.indices });
					}
				}
			}
		} 
		else {
			socket.broadcast.to(data.roomID).emit("chat", { from: data.from, msg: data.msg });
		}
	});

	// Receive change of turn and send changes to clients
	socket.on("turn", (room) => {
		// console.log("received turn change message from " + room);
		/*const { turn, roomId } = data; // received data
        io.in(roomId).emit("turn", {
            turn
        });*/

		// Send out change of turn
		socket.broadcast.to(room).emit("change-turn");
	});

	// Send Prompts to clients
	socket.on("request-prompt", (room)=>{
		if (db.getCount(room) > 0) {
			if (db.checkIfRound(room)){
				const drawer = db.retFirstUserinRoom(room);
				const prompts = db.getNewPrompts(room);
				console.log("new drawer is " + drawer);
				console.log(prompts);
				console.log("prompts requested at " + room);
				socket.in(room).emit("prompt", {'drawerID' : drawer, 'words' : prompts.words, 'indices' : prompts['indices']});
			}
		}
	});

	socket.on("setAns", (data) =>{
		db.setAns(data.roomID, data.ans);
		db.takenPrompt(data.index, data.roomID);
	});

	/*socket.on("answer", (data) => {
		console.log("in answer");

		const rooms = db.getRooms();

		rooms.forEach((n) => {
			if (n.id === data.roomID) {
				if (n.ans === data.msg) {
					socket.broadcast
						.to(data.roomID)
						.emit("check-answer", { userID: data.userID, boolean: true });

					n.answeredCount = n.answeredCount + 1;

					if (n.answeredCount == n.count - 1) {
						socket.broadcast.to(data.roomID);
					}
				} else {
					socket.emit("check-answer", { userID: data.userID, boolean: false });
				}
			}
		});
	});*/
});

// SERVE on port and start listening for API calls
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
	console.log(`server is listening on http://localhost:${PORT}`)
);
