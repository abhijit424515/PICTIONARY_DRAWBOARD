import React, { useState, useRef, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

import PlayerCards from "./PlayerCards";
import ChatBubble from "./ChatBubble";
import { Swatches, Tools } from "./SwatchesAndTools";
import Canvas from "./Canvas";
import * as db from "../../../server/utils/user.js";

function timeout(delay) {
	return new Promise((res) => setTimeout(res, delay));
}

export default function Room(props) {
	const canvasRef = useRef(null);
	const ctx = useRef(null);
	const [color, setColor] = useState("#000000");
	const [elements, setElements] = useState([]);
	const [history, setHistory] = useState([]);
	// const [myuser, setMyUser] = useState(props.user);
	// const [listofusers, setListOfUsers] = useState([]);

	const [rounds, setRounds] = useState(1);
	const [chats, setChats] = useState([]);
	const [msg, setMsg] = useState("");
	const [canChat, setCanChat] = useState(true);

	const [copied, setCopied] = useState(false);

	useEffect(() => {
		props.socket.on("message", (data) => {
			toast.info(data.message);
		});

		/*props.socket.on("check-answer", (data) => {
			if(data.userID === props.user.userID && data.boolean === true){
				console.log("right answer");
			}
		})*/

		props.socket.on("users", (data) => {
			// setListOfUsers(db.getUsers(props.user.room));
			props.setUsers(data);
			props.setUserNo(data.length);
			console.log(props.users);
			console.log(data);
			console.log("user is ");
			console.log(props.user);
			console.log("================================================================");
		});

		props.socket.on("correct", (data) => {
			console.log("correct answer by");
			if (props.user.userID === data.fromID) {
				setCanChat(false);
				toast.success("You got the right answer!");
			}
			else {
				console.log("correct answer received from here");
				console.log(data);
				guess (data);
			}
		});
	}, []);

	function guess (data) {
		toast.success(data.from + " got the right answer!");
	}

	useEffect(() => {
		if (!props.turn) {
			props.socket.on("canvasImage", (data) => {
				props.imgRef.current.src = data;
			});
		}
	}, [props.turn]);

	useEffect(() => {
		console.log("users has been changed to ");
		console.log(props.users);
	}, [props.users])

	function sendMessage(msg) {
		if (msg && canChat) {
			setChats([...chats, [props.user.name, msg]]);
			props.socket.emit("chat", { "from":props.user.name, "msg" : msg, "roomID": props.roomID, "fromID" : props.user.userID});
		}
		setMsg("");
	}

	props.socket.on("chat", (msg) => {
		console.log(msg.from);
		console.log(msg.msg);
		setChats([...chats, [msg.from, msg.msg]]);
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
					{props.users.map((item, index) => {
						return (
							<PlayerCards
								name={item.name}
								rank={index+1}
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
						room={props.user.roomID}
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
								room={props.user.roomID}
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
									roomID={props.roomID}
									user={props.user}
									socket={props.socket}
									key={index}
									name={item[0]}
									msg={item[1]}
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
