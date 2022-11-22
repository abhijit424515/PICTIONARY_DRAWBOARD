import React from "react";
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

function Tools({ canvasRef, elements, setElements, history, setHistory }) {
	const clearCanvas = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);
		setElements([]);
		setHistory([]);
	};

	const undo = () => {
		if (elements.length > 0) {
			setHistory((prevHistory) => [
				...prevHistory,
				elements[elements.length - 1],
			]);

			if (elements.length === 1) {
				const canvas = canvasRef.current;
				const context = canvas.getContext("2d");
				context.fillStyle = "white";
				context.fillRect(0, 0, canvas.width, canvas.height);
				setElements([]);
			} else {
				setElements((prevElements) =>
					prevElements.filter((ele, index) => index !== elements.length - 1)
				);
			}
		}
	};

	const redo = () => {
		if (history.length > 0) {
			setElements((prevElements) => [
				...prevElements,
				history[history.length - 1],
			]);
			if (history.length === 1) {
				setHistory([]);
			} else {
				setHistory((prevHistory) =>
					prevHistory.filter((ele, index) => index !== history.length - 1)
				);
			}
		}
	};

	return (
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
		</div>
	);
}

function Swatches({ color, setColor }) {
	return (
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
						onClick={() => setColor(x)}
					></div>
				);
			})}
		</div>
	);
}

export { Swatches, Tools };
