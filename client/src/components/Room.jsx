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
			console.log(props.users);
			console.log(data);
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
			setChats([...chats, [props.user.name, msg]]);
			props.socket.emit("chat", [props.user.name, msg]);
			setMsg("");
		}
	}

	props.socket.on("chat", (msg) => {
		// alert("hi bebi");
		console.log(msg[0]);
		console.log(msg[1]);
		setChats([...chats, msg]);
	});

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
					{props.users.map((item) => {
						return (
							<PlayerCards
								name={item.name}
								rank={item.number
								}
								textColor="text-black"
								bgColor="bg-yellow-400"
							/>
						);
					})}
				</div>
				<div
					className={
						"h-[90vh] w-2/3 flex flex-col justify-between items-center " +
						(props.turn ? "py-[1rem]" : "py-[2.5rem]")
					}
				>
					<Tools
						canvasRef={canvasRef}
						elements={elements}
						setElements={setElements}
						history={history}
						setHistory={setHistory}
						turn={props.turn}
						setTurn={props.setTurn}
						socket={props.socket}
					/>
					{props.turn ? (
						<>
							<Canvas
								canvasRef={canvasRef}
								ctx={ctx}
								color={color}
								setElements={setElements}
								elements={elements}
								tool={"pencil"}
								socket={props.socket}
							/>
						</>
					) : (
						<>
							<img
								className="border-2 border-black pointer-events-none"
								style={{
									height: `${window.innerHeight / 1.5}px`,
									width: `${window.innerWidth / 2}px`,
								}}
								ref={props.imgRef}
								src=""
								alt="image"
							/>
						</>
					)}
					<Swatches color={color} setColor={setColor} turn={props.turn} />
				</div>
				<div className="h-[90vh] w-1/6 bg-green-400 flex flex-col p-1 border-l-2 border-black">
					<div className="h-full">
						{chats.map((item, index) => {
							return (
								<ChatBubble
									key={index}
									name={item[0]}
									msg={item[1][1]}
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
								sendMessage([props.user.name, msg]);
							}
						}}
					/>
				</div>
			</div>
		</>
	);
}
