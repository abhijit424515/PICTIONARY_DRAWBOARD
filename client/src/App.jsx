import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import io from "socket.io-client";
import ClientRoom from "./components/ClientRoom";
import JoinCreateRoom from "./components/JoinCreateRoom";
import Room from "./components/Room";
import Sidebar from "./components/Sidebar";

import "./styles/style.css";

const server = "http://localhost:5001";
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
	const [user, setUser] = useState({});
	const [users, setUsers] = useState([]);
	const [turn, setTurn] = useState(false);

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
					<Sidebar users={users} user={user} socket={socket} turn={turn} setTurn={setTurn} />
					{turn ? (
						<Room
							userNo={userNo}
							user={user}
							socket={socket}
							setUsers={setUsers}
							setUserNo={setUserNo}
						/>
					) : (
						<ClientRoom
							userNo={userNo}
							user={user}
							socket={socket}
							setUsers={setUsers}
							setUserNo={setUserNo}
						/>
					)}
				</>
			) : (
				<JoinCreateRoom
					setRoomJoined={setRoomJoined}
					setUser={setUser}
					turn={turn}
					setTurn={setTurn}
				/>
			)}
		</>
	);
};
export default App;
