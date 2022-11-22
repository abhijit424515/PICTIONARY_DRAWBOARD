import React, { useState, useRef, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

import PlayerCards from "./PlayerCards";
import ChatBubble from "./ChatBubble";
import { Swatches, Tools } from "./SwatchesAndTools";
import Canvas from "./Canvas";

function timeout(delay) {
	return new Promise((res) => setTimeout(res, delay));
}

export default function Room(props) {
	const canvasRef = useRef(null);
	const ctx = useRef(null);
	const [color, setColor] = useState("#000000");
	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([]);

	const [rounds, setRounds] = useState(1);
	const [chats, setChats] = useState([]);
	const [msg, setMsg] = useState("");

	const [copied, setCopied] = useState(false);

	useEffect(() => {
		props.socket.on("message", (data) => {
			toast.info(data.message);
		});

		props.socket.on("users", (data) => {
			props.setUsers(data);
			props.setUserNo(data.length);
		});
	}, []);

	useEffect(() => {
		if (!props.turn) {
			props.socket.on("canvasImage", (data) => {
				props.imgRef.current.src = data;
			});
		}
	}, [props.turn]);

	function sendMessage(msg) {
		if (msg) {
			setChats([...chats, msg]);
			props.socket.emit("chat", msg);
			setMsg("");
		}
	}

	// TF IS THIS DOING ?
	// props.socket.on("chat", (msg) => {
	// 	setChats(chats.concat(msg));
	// });

	return (
		<>
			<div className="h-[10vh] p-3 flex flex-row justify-between bg-red-500 text-white border-b-2 border-black">
				<div className="h1 flex justify-center items-center">skribbl.io ✎</div>
				<div className="h-[3rem] flex flex-row">
					<div className="p-[0.5rem] h5 h-full">ROOM ID:</div>
					<div className="p-[0.5rem] h5 h-full text-black">{props.roomID}</div>
					<CopyToClipboard
						text={props.roomID}
						className="cursor-pointer py-[0.5rem] px-3 h5 h-full"
						onCopy={async () => {
							setCopied(true);
							await timeout(3000);
							setCopied(false);
						}}
					>
						<div style={{ display: "grid" }}>
							<div style={{ gridColumn: 1, gridRow: 1 }}>
								<FontAwesomeIcon
									icon={faCopy}
									className={copied ? "opacity-0" : "opacity-100"}
								/>
							</div>
							<div style={{ gridColumn: 1, gridRow: 1, color: "#22c55e" }}>
								<FontAwesomeIcon
									icon={faCheck}
									className={copied ? "opacity-100" : "opacity-0"}
								/>
							</div>
						</div>
					</CopyToClipboard>
				</div>
				<div className="h3 flex justify-center items-center">
					Rounds: {rounds} / {props.rounds}
				</div>
			</div>
			<div className="flex flex-row">
				<div className="h-[90vh] w-1/6 bg-blue-500 flex flex-col py-1 border-r-2 border-black">
					<PlayerCards
						name="Alpha"
						rank={1}
						textColor="text-black"
						bgColor="bg-yellow-400"
					/>
					<PlayerCards
						name="Beta"
						rank={2}
						textColor="text-black"
						bgColor="bg-green-400"
					/>
				</div>
				<div className="h-[90vh] w-2/3 flex flex-col py-1 justify-center items-center">
					{props.turn ? (
						<>
							<Tools
								canvasRef={canvasRef}
								elements={elements}
								setElements={setElements}
								history={history}
								setHistory={setHistory}
							/>
							<Canvas
								canvasRef={canvasRef}
								ctx={ctx}
								color={color}
								setElements={setElements}
								elements={elements}
								tool={"pencil"}
								socket={props.socket}
							/>
							<Swatches color={color} setColor={setColor} />
						</>
					) : (
						<>
							<img
								className="w-[500px] h-[500px] border-2 border-black pointer-events-none"
								ref={props.imgRef}
								src=""
								alt="image"
							/>
						</>
					)}
				</div>
				<div className="h-[90vh] w-1/6 bg-green-400 flex flex-col p-1 border-l-2 border-black">
					<div className="h-full">
						{chats.map((item, index) => {
							return (
								<ChatBubble
									key={index}
									name={props.user.name}
									msg={item}
									bgColor="bg-yellow-200"
									textColor="text-black"
								/>
							);
						})}
					</div>
					<input
						value={msg}
						onChange={(event) => setMsg(event.target.value)}
						placeholder="Type here"
						className="p-3 h-[2rem] w-full border-2 border-black"
						onKeyPress={(event) => {
							if (event.key === "Enter") {
								sendMessage(msg);
							}
						}}
					/>
				</div>
			</div>
		</>
	);
}
