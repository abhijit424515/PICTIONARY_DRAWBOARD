import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

export default function Canvas({
	canvasRef,
	ctx,
	color,
	setElements,
	elements,
	tool,
	socket,
}) {
	const [isDrawing, setIsDrawing] = useState(false);

	// console.log("window.innerHeight: " + window.innerHeight);
	// console.log("window.innerWidth: " + window.innerWidth);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.height = window.innerHeight / 1.5;
		canvas.width = window.innerWidth / 2;
		canvas.style.height = `${window.innerHeight / 1.5}px`;
		canvas.style.width = `${window.innerWidth / 2}px`;
		const context = canvas.getContext("2d");

		// console.log("canvas.height: " + canvas.height);
		// console.log("canvas.width: " + canvas.width);
		// console.log("canvas.style.height: " + canvas.style.height);
		// console.log("canvas.style.width: " + canvas.style.width);

		context.strokeWidth = 5;
		context.scale(1, 1);
		context.lineCap = "round";
		context.strokeStyle = color;
		context.lineWidth = 5;
		ctx.current = context;
	}, []);

	useEffect(() => {
		ctx.current.strokeStyle = color;
	}, [color]);

	const handleMouseDown = (e) => {
		const { offsetX, offsetY } = e.nativeEvent;

		setElements((prevElements) => [
			...prevElements,
			{
				offsetX,
				offsetY,
				path: [[offsetX, offsetY]],
				stroke: color,
				element: tool,
			},
		]);

		setIsDrawing(true);
	};

	useLayoutEffect(() => {
		const roughCanvas = rough.canvas(canvasRef.current);
		if (elements.length > 0) {
			ctx.current.clearRect(
				0,
				0,
				canvasRef.current.width,
				canvasRef.current.height
			);
		}
		elements.forEach((ele, i) => {
			// if (ele.element === "rect") {
			// 	roughCanvas.draw(
			// 		generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
			// 			stroke: ele.stroke,
			// 			roughness: 0,
			// 			strokeWidth: 5,
			// 		})
			// 	);
			// } else if (ele.element === "line") {
			// 	roughCanvas.draw(
			// 		generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
			// 			stroke: ele.stroke,
			// 			roughness: 0,
			// 			strokeWidth: 5,
			// 		})
			// 	);
			// } else if (ele.element === "pencil") {
			roughCanvas.linearPath(ele.path, {
				stroke: ele.stroke,
				roughness: 0,
				strokeWidth: 5,
			});
			// }
		});
		const canvasImage = canvasRef.current.toDataURL();
		socket.emit("drawing", canvasImage);
	}, [elements]);

	const handleMouseMove = (e) => {
		if (!isDrawing) {
			return;
		}
		const { offsetX, offsetY } = e.nativeEvent;

		// if (tool === "rect") {
		// 	setElements((prevElements) =>
		// 		prevElements.map((ele, index) =>
		// 			index === elements.length - 1
		// 				? {
		// 						offsetX: ele.offsetX,
		// 						offsetY: ele.offsetY,
		// 						width: offsetX - ele.offsetX,
		// 						height: offsetY - ele.offsetY,
		// 						stroke: ele.stroke,
		// 						element: ele.element,
		// 				  }
		// 				: ele
		// 		)
		// 	);
		// } else if (tool === "line") {
		// 	setElements((prevElements) =>
		// 		prevElements.map((ele, index) =>
		// 			index === elements.length - 1
		// 				? {
		// 						offsetX: ele.offsetX,
		// 						offsetY: ele.offsetY,
		// 						width: offsetX,
		// 						height: offsetY,
		// 						stroke: ele.stroke,
		// 						element: ele.element,
		// 				  }
		// 				: ele
		// 		)
		// 	);
		// } else
		// if (tool === "pencil") {
		setElements((prevElements) =>
			prevElements.map((ele, index) =>
				index === elements.length - 1
					? {
							offsetX: ele.offsetX,
							offsetY: ele.offsetY,
							path: [...ele.path, [offsetX, offsetY]],
							stroke: ele.stroke,
							element: ele.element,
					  }
					: ele
			)
		);
		// }
	};
	const handleMouseUp = () => {
		setIsDrawing(false);
	};

	return (
		<div
			className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
			style={{
				height: `${window.innerHeight / 1.5}px`,
				width: `${window.innerWidth / 2}px`,
			}}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
		>
			<canvas ref={canvasRef} />
		</div>
	);
}
