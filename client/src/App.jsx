import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { ToastContainer } from "react-toastify";
import Room from "./components/Room";
import JoinCreateRoom from "./components/JoinCreateRoom";
import { v4 as uuidv4 } from "uuid";

import "./styles/style.css";
import LoginSignUp from "./components/LoginSignUp";
import Leaderboard from "./components/Leaderboard";

const name = "Abhijit";
const userID = uuidv4();
const rounds = 5;

const server = "http://localhost:5000";
const connectionOptions = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
	const [userNo, setUserNo] = useState(0);
	const [roomJoined, setRoomJoined] = useState(false);
	const [user, setUser] = useState({
		userID: userID,
		name: name,
	});
	const [users, setUsers] = useState([]);
	const [turn, setTurn] = useState(false);
	const imgRef = useRef(null);

	const [gameOver, setGameOver] = useState(false);
	const [winners, setWinners] = useState([]);

	const [roomID, setRoomID] = useState("");
	const [prompts, setPrompts] = useState();
	const [gameStarted, setGameStarted] = useState(false);

	const [roundStartTime, setRoundStartTime] = useState(new Date());
	const [roundOver, setRoundOver] = useState(false);

	const startRound = () => {
		setRoundStartTime(new Date());
	};

	useEffect(() => {
		setRoundOver(false);
		if (roundOver == true && turn == true && gameStarted == true) {
			socket.emit("time-over", roomID);
		}
	}, [roundOver]);

	useEffect(() => {
		socket.on("game-started", () => {
			setGameStarted(true);
			// setRoundOver(false);
			// startRound();
			// setGameStarted(true);
		});
	}, []);

	useEffect(() => {
		if (roomJoined) {
			// clients cannot emit to other clients, only to the servers
			socket.emit("user-joined", user);
		}
		/*
		socket.on('update-number', (num) => {

		}
		);*/
	}, [roomJoined]);

	return (
		<>
			<ToastContainer />
			{/* <LoginSignUp /> */}
			{roomJoined ? (
				<>
					{gameOver ? (
						<Leaderboard winners={winners} />
					) : (
						<>
							{turn ? (
								<Room
									roomID={roomID}
									userNo={userNo}
									user={user}
									setUser={setUser}
									socket={socket}
									users={users}
									setUsers={setUsers}
									setUserNo={setUserNo}
									turn={turn}
									setTurn={setTurn}
									rounds={rounds}
									prompts={prompts}
									setPrompts={setPrompts}
									setGameOver={setGameOver}
									setWinners={setWinners}
									gameStarted={gameStarted}
									setGameStarted={setGameStarted}
									roundStartTime={roundStartTime}
									setRoundStartTime={setRoundStartTime}
									roundOver={roundOver}
									setRoundOver={setRoundOver}
									startRound={startRound}
								/>
							) : (
								<Room
									roomID={roomID}
									userNo={userNo}
									user={user}
									setUser={setUser}
									socket={socket}
									users={users}
									setUsers={setUsers}
									setUserNo={setUserNo}
									turn={turn}
									setTurn={setTurn}
									rounds={rounds}
									imgRef={imgRef}
									prompts={prompts}
									setPrompts={setPrompts}
									setGameOver={setGameOver}
									setWinners={setWinners}
									gameStarted={gameStarted}
									setGameStarted={setGameStarted}
									roundStartTime={roundStartTime}
									setRoundStartTime={setRoundStartTime}
									roundOver={roundOver}
									setRoundOver={setRoundOver}
									startRound={startRound}
								/>
							)}
						</>
					)}
				</>
			) : (
				<JoinCreateRoom
					setRoomJoined={setRoomJoined}
					user={user}
					setUser={setUser}
					turn={turn}
					setTurn={setTurn}
					roomID={roomID}
					setRoomID={setRoomID}
				/>
			)}
		</>
	);
};
export default App;
