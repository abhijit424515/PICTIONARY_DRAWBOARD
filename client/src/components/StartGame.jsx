import React from "react";

export default function StartGame({ socket, setGameStarted, roomID }) {
	const start = () => {
		setGameStarted(true);
		socket.emit("request-prompt", roomID);
		socket.emit("ready", roomID);
	};

	return (
		<>
			<div
				className="bg-gray-300 col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3 flex justify-center items-center"
				style={{
					height: `${window.innerHeight / 1.5}px`,
					width: `${window.innerWidth / 2}px`,
				}}
			>
				<div className="h-3/5 w-full flex flex-col justify-evenly items-center">
					<div className="text-[2rem] text-center h-1/6 w-2/3 font-bold">
						Ready ?
					</div>
					<div className="h-[12.5%] w-2/3 flex flex-row justify-center items-center">
						<button
							className="w-1/4 h-full border-2 border-black"
							onClick={() => start()}
						>
							Start the Game
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
