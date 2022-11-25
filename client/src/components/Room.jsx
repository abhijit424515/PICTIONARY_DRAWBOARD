import React, { useState, useRef, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

import PlayerCards from "./PlayerCards";
import ChatBubble from "./ChatBubble";
import { Swatches, Tools } from "./SwatchesAndTools";
import Canvas from "./Canvas";
import QuestionChoose from "./QuestionChoose";
import StartGame from "./StartGame";
import soundMap from "./SoundMap";

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
	const [questionChosen, setQuestionChosen] = useState(false);
	const [words, setWords] = useState([]);
	const [indices, setIndices] = useState([]);

	const [bogus, setBogus] = useState(0);

	// const [roundStartTime, setRoundStartTime] = useState(new Date());
	// const [roundOver, setRoundOver] = useState(false);

	// const startRound = () => {
	// 	setRoundStartTime(new Date());
	// };

	useEffect(() => {
		if (chats.length > 17) {
			chats.shift();
		}
	}, [chats]);

	const Toggle = () => {
		props.setTurn(true);
		props.socket.emit("turn", props.roomID);
	};

	useEffect(() => {
		props.socket.on("message", (data) => {
			toast.info(data.message);
		});

		props.socket.on("change-turn", () => {
			props.setTurn(false);
			props.setGameStarted(true);
		});


		props.socket.on("users", (data) => {
			// setListOfUsers(db.getUsers(props.user.room));
			props.setUsers(data);
			props.setUserNo(data.length);
		});

		props.socket.on("change-points", (data) => {
			props.setUsers(data);
		});

		props.socket.on("prompt", (data) => {
			props.setRoundOver(false);

			if (data.drawerID === props.user.userID) {
				Toggle();
				setWords(data.words);
				setIndices(data.indices);
			}

			setCanChat(true);
		});

		props.socket.on("correct", (data) => {
			if (props.user.userID === data.fromID) {
				setCanChat(false);
				toast.success("You got the right answer!");
			} else {
				guess(data);
			}
			const sound = new Audio(soundMap["correctAnswer"]);
			sound.play();
		});

		props.socket.on("roundOver", (data) => {

			props.socket.emit("request-prompt", {
				room: props.roomID,
				userID: props.user.userID,
			});
			setQuestionChosen(false);
			setRounds(data.round);
			setCanChat(true);

			if (data.round == 6) {
				props.setGameOver(true);
				props.setWinners(data.winners);
			}
		});

		props.socket.on("set-timers", () => {
			props.startRound();
		});
	}, []);

	function guess(data) {
		toast.success(data.from + " got the right answer!");
	}

	useEffect(() => {
		props.socket.emit("request-prompt", {
			room: props.roomID,
			userID: props.user.userID,
		});
	}, []);

	useEffect(() => {
		if (!props.turn) {
			props.socket.on("canvasImage", (data) => {
				props.imgRef.current.src = data;
			});
		}
	}, [props.turn]);

	useEffect(() => {
	}, [props.users]);

	useEffect(() => {
		props.socket.emit("reclaim-prompt", indices);
	}, [props.prompts]);

	function sendMessage(msg) {
		if (msg && canChat) {
			setChats([...chats, [props.user.name, msg]]);
			props.socket.emit("chat", {
				from: props.user.name,
				msg: msg,
				roomID: props.roomID,
				fromID: props.user.userID,
			});
		}
		setMsg("");
	}

	// useEffect(() => {
	props.socket.on("chat", (msg) => {
		setChats([...chats, [msg.from, msg.msg]]);
	});
	// }, []);

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
							const sound = new Audio(soundMap["buttonClick"]);
							sound.play();
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
								key={index}
								name={item.name}
								rank={index + 1}
								score={Math.round(item.points)}
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
						roundStartTime={props.roundStartTime}
						setRoundStartTime={props.setRoundStartTime}
						roundOver={props.roundOver}
						setRoundOver={props.setRoundOver}
					/>
					{props.turn ? (
						<>
							{props.gameStarted ? (
								<>
									{questionChosen ? (
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
									) : (
										<QuestionChoose
											words={words}
											indices={indices}
											setQuestionChosen={setQuestionChosen}
											setPrompts={props.setPrompts}
											setIndices={setIndices}
											socket={props.socket}
											roomID={props.roomID}
										/>
									)}
								</>
							) : (
								<StartGame
									setGameStarted={props.setGameStarted}
									socket={props.socket}
									roomID={props.roomID}
								/>
							)}
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
									roomID={props.roomID}
									user={props.user}
									socket={props.socket}
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
