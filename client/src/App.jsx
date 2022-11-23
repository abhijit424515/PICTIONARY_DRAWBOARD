import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { ToastContainer } from "react-toastify";
import Room from "./components/Room";
import JoinCreateRoom from "./components/JoinCreateRoom";
import { v4 as uuidv4 } from "uuid";

import "./styles/style.css";

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

	const [roomID, setRoomID] = useState("");
	const [prompts, setPrompts] = useState({'Windmill': false, 'Calendar': false, 'Boat': false, 'Dog': false, 'Umbrella': false, 'Bottle': false});

	useEffect(() => {
		if (roomJoined) {
			// clients cannot emit to other clients, only to the servers
			socket.emit("user-joined", user);
		}
	}, [roomJoined]);

	return (
		<>
			<ToastContainer />
			{roomJoined ? (
				<>
					{turn ? (
						<Room
							roomID={roomID}
							userNo={userNo}
							user={user}
							socket={socket}
							setUsers={setUsers}
							setUserNo={setUserNo}
							turn={turn}
							setTurn={setTurn}
							rounds={rounds}
							prompts={prompts}
							setPrompts={setPrompts}
						/>
					) : (
						<Room
							roomID={roomID}
							userNo={userNo}
							user={user}
							socket={socket}
							setUsers={setUsers}
							setUserNo={setUserNo}
							turn={turn}
							setTurn={setTurn}
							rounds={rounds}
							imgRef={imgRef}
							prompts={prompts}
							setPrompts={setPrompts}
						/>
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
