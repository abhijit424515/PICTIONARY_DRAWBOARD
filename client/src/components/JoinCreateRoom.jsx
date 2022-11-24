import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import "../styles/JoinCreateRoom.css";

export default function JoinCreateRoom(props) {
	const [playerName, setPlayerName] = useState(props.user.name);
	const [joinRoomID, setJoinRoomID] = useState("");

	useEffect(() => {
		props.setRoomID(uuidv4());
	}, []);

	const handleCreateSubmit = (e) => {
		e.preventDefault();
		if (!playerName) return toast.dark("Please enter your name!");

		props.setUser({
			...props.user,
			name: playerName,
			roomID: props.roomID,
			host: props.turn,
			presenter: props.turn,
			number: 1,
			points: 0,
			answered: false,
		});
		props.setRoomJoined(true);
		props.setTurn(true);
	};
	const handleJoinSubmit = (e) => {
		e.preventDefault();
		if (!playerName) return toast.dark("Please enter your name!");
		if (!joinRoomID) return toast.dark("Please enter Room ID");

		props.setRoomID(joinRoomID);
		props.setUser({
			...props.user,
			name: playerName,
			roomID: joinRoomID,
			host: props.turn,
			presenter: props.turn,
			points: 0,
			answered: false,
			// number: id_count,
		});
		props.setRoomJoined(true);
	};

	return (
		<div className="mx-3 text-center flex flex-col">
			<div>
				<h1 className="h1 pt-[1r	] pb-[0.5rem] text-[5rem]">skribbl.io ✎</h1>
			</div>
			<div className="flex flex-row">
				<div className="w-full">
					<div className="flex flex-col items-center h-full">
						<h2 className="w-2/3 h2 my-4 p-[1rem]">Create Room</h2>
						<input
							type="text"
							placeholder="Name"
							className="w-2/3 p-[1rem] border-2 border-slate-700 my-2"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
						/>
						<div className="w-2/3 align-items-center flex flex-row divide-x-2 divide-slate-700">
							<p className="truncate w-1/2 text-center p-[1rem] h-full pr-[0.5rem] rounded-l-[12px] border-2 border-r-0 border-slate-700">
								{props.roomID}
							</p>
							<button
								className="w-1/4 h-full text-center p-[1rem] border-t-2 border-b-2 border-slate-700"
								onClick={() => props.setRoomID(uuidv4())}
							>
								Generate
							</button>
							<CopyToClipboard
								text={props.roomID}
								onCopy={() => toast.success("Room ID Copied To Clipboard!")}
							>
								<button className="text-white bg-black w-1/4 h-full text-center p-[1rem] rounded-r-[12px]">
									Copy
								</button>
							</CopyToClipboard>
						</div>

						<button
							className="w-2/3 mt-5 mb-4 p-[1rem] rounded-[12px] border-2 border-slate-700 text-white bg-black"
							onClick={handleCreateSubmit}
						>
							Play
						</button>
					</div>
				</div>
				<div className="w-full">
					<div className="flex flex-col items-center h-full">
						<h2 className="w-2/3 h2 my-4 p-[1rem]">Join Room</h2>
						<input
							type="text"
							placeholder="Name"
							className="w-2/3 p-[1rem] border-2 border-slate-700 my-2"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Room ID"
							className="w-2/3 p-[1rem] border-2 border-slate-700"
							value={joinRoomID}
							onChange={(e) => setJoinRoomID(e.target.value)}
						/>
						<button
							className="w-2/3 mt-5 mb-4 p-[1rem] rounded-[12px] border-2 border-slate-700 text-white bg-black"
							onClick={handleJoinSubmit}
						>
							Play
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
