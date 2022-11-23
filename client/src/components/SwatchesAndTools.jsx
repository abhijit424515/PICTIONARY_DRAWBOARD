import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faRedo } from "@fortawesome/free-solid-svg-icons";

const colors = [
	"#800000",
	"#9A6324",
	"#e6194B",
	"#f58231",
	"#ffe119",
	"#fabed4",
	"#ffd8b1",
	"#fffac8",
	"#bfef45",
	"#3cb44b",
	"#aaffc3",
	"#42d4f4",
	"#000075",
	"#4363d8",
	"#911eb4",
	"#dcbeff",
	"#f032e6",
	"#a9a9a9",
	"#ffffff",
	"#000000",
];

function Tools(props) {
	useEffect(() => {
		props.socket.on("change-turn", () => {
			props.setTurn(false);
		});
	}, []);

	const Toggle = () => {
		props.setTurn(true);
		props.socket.emit("turn");
	};

	const clearCanvas = () => {
		const canvas = props.canvasRef.current;
		const context = canvas.getContext("2d");
		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);
		props.setElements([]);
		props.setHistory([]);
	};

	const undo = () => {
		if (props.elements.length > 0) {
			props.setHistory((prevHistory) => [
				...prevHistory,
				props.elements[props.elements.length - 1],
			]);

			if (props.elements.length === 1) {
				const canvas = props.canvasRef.current;
				const context = canvas.getContext("2d");
				context.fillStyle = "white";
				context.fillRect(0, 0, canvas.width, canvas.height);
				props.setElements([]);
			} else {
				props.setElements((prevElements) =>
					prevElements.filter(
						(ele, index) => index !== props.elements.length - 1
					)
				);
			}
		}
	};

	const redo = () => {
		if (props.history.length > 0) {
			props.setElements((prevElements) => [
				...prevElements,
				props.history[props.history.length - 1],
			]);
			if (props.history.length === 1) {
				props.setHistory([]);
			} else {
				props.setHistory((prevHistory) =>
					prevHistory.filter((ele, index) => index !== props.history.length - 1)
				);
			}
		}
	};

	return (
		<>
			{props.turn ? (
				<div className="flex flex-row justify-evenly w-[50vw]">
					<button
						className="btn btn-outline-primary text-[1.5rem] w-[8rem]"
						onClick={undo}
					>
						<FontAwesomeIcon icon={faUndo} />
					</button>
					<button
						className="btn btn-outline-secondary text-[1.5rem] w-[8rem]"
						onClick={redo}
					>
						<FontAwesomeIcon icon={faRedo} />
					</button>
					<button
						className="btn btn-outline-danger text-[1.5rem] w-[8rem]"
						onClick={clearCanvas}
					>
						Clear
					</button>
					<button
						className="btn btn-outline-warning text-[1.5rem] w-[8rem]"
						onClick={Toggle}
					>
						MyTurn
					</button>
				</div>
			) : (
				<>
					<div className="flex flex-row justify-evenly w-[50vw]">
						<button
							className="btn btn-outline-warning text-[1.5rem] w-[8rem]"
							onClick={Toggle}
						>
							MyTurn
						</button>
					</div>
				</>
			)}
		</>
	);
}

function Swatches(props) {
	return (
		<>
			{props.turn ? (
				<div className="flex flex-row my-4 divide-x-2 divide-black">
					{colors.map((x) => {
						return (
							<div
								key={x}
								className="border-2 border-black"
								style={{
									backgroundColor: x,
									height: "2.5vw",
									width: "2.5vw",
								}}
								onClick={() => props.setColor(x)}
							></div>
						);
					})}
				</div>
			) : (
				<></>
			)}
		</>
	);
}

export { Swatches, Tools };
