import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import "../styles/JoinCreateRoom.css";

export default function JoinCreateRoom({
	uuid,
	setUser,
	setRoomJoined,
	turn,
	setTurn,
}) {
	const [roomId, setRoomId] = useState(uuidv4());
	const [name, setName] = useState("");
	const [joinRoomId, setJoinRoomId] = useState("");

	const handleCreateSubmit = (e) => {
		e.preventDefault();
		// make sure name is
		if (!name) return toast.dark("Please enter your name!");

		setUser({
			roomId,
			userId: uuidv4(),
			userName: name,
			host: turn, // allowed only if your turn
			presenter: turn, // allowed only if your turn
		});
		setRoomJoined(true);
	};
	const handleJoinSubmit = (e) => {
		e.preventDefault();
		if (!name) return toast.dark("Please enter your name!");

		setUser({
			roomId: joinRoomId,
			userId: uuidv4(),
			userName: name,
			host: turn, // not allowed if not your turn
			presenter: turn, // not allowed if not your turn
		});
		setRoomJoined(true);
	};

	return (
		<div className="mx-3 text-center flex flex-col">
			<div>
				<h1 className="h1 pt-[1rem] pb-[0.5rem] text-[5rem]">Skribbl.io ✎</h1>
			</div>
			<div className="flex flex-row">
				<div className="w-full">
					<div className="flex flex-col items-center h-full">
						<h2 className="w-2/3 h2 my-4 p-[1rem]">Create Room</h2>
						<input
							type="text"
							placeholder="Name"
							className="w-2/3 p-[1rem] border-2 border-slate-700 my-2"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<div className="w-2/3 align-items-center flex flex-row divide-x-2 divide-slate-700">
							<p className="truncate w-1/2 text-center p-[1rem] h-full pr-[0.5rem] rounded-l-[12px] border-2 border-r-0 border-slate-700">
								{roomId}
							</p>
							<button
								className="w-1/4 h-full text-center p-[1rem] border-t-2 border-b-2 border-slate-700"
								onClick={() => setRoomId(uuidv4())}
							>
								Generate
							</button>
							<CopyToClipboard
								text={roomId}
								onCopy={() => toast.success("Room Id Copied To Clipboard!")}
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
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<input
							type="text"
							placeholder="Room ID"
							className="w-2/3 p-[1rem] border-2 border-slate-700"
							value={joinRoomId}
							onChange={(e) => setJoinRoomId(e.target.value)}
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
