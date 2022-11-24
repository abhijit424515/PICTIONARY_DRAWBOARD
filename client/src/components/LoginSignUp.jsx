import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { v4 as uuidv4 } from "uuid";

import "../styles/LoginSignUp.css";

export default function LoginSignUp(props) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSignUpSubmit = (e) => {
		e.preventDefault();
		if (!email) return toast.dark("Please enter your email!");
		if (!password) return toast.dark("Please enter your password!");

		// props.setUser({
		// 	...props.user,
		// 	name: playerName,
		// 	roomID: props.roomID,
		// 	host: props.turn,
		// 	presenter: props.turn,
		// });
		// props.setRoomJoined(true);
		// props.setTurn(true);
	};
	const handleLoginSubmit = (e) => {
		e.preventDefault();
		if (!email) return toast.dark("Please enter your email!");
		if (!password) return toast.dark("Please enter your password!");

		// props.setRoomID(joinRoomID);
		// props.setUser({
		// 	...props.user,
		// 	name: playerName,
		// 	roomID: joinRoomID,
		// 	host: props.turn,
		// 	presenter: props.turn,
		// });
		// props.setRoomJoined(true);
	};

	return (
		<div className="mx-3 text-center flex flex-col">
			<div>
				<h1 className="h1 pt-[1rem] pb-[0.5rem] text-[5rem]">skribbl.io ✎</h1>
			</div>
			<div className="flex flex-row">
				<div className="w-full">
					<div className="flex flex-col items-center h-full">
						<h2 className="w-2/5 h2 my-4 p-[1rem]">Login / Sign Up</h2>
						<input
							type="text"
							placeholder="Email ID"
							className="w-2/5 p-[1rem] border-2 border-slate-700 my-2"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							type="password"
							placeholder="Password"
							className="w-2/5 p-[1rem] border-2 border-slate-700"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<div className="w-2/5 flex flex-row justify-between">
							<button
								className="w-2/5 mt-5 mb-4 p-[1rem] rounded-[12px] border-2 border-slate-700 text-white bg-black"
								onClick={handleLoginSubmit}
							>
								Login
							</button>
							<button
								className="w-2/5 mt-5 mb-4 p-[1rem] rounded-[12px] border-2 border-slate-700 text-white bg-black"
								onClick={handleSignUpSubmit}
							>
								Sign Up
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
