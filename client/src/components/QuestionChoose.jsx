import React from "react";

export default function QuestionChoose({ words, setQuestionChosen, setPrompts, setIndices }) {
	const question = (x, i1, i2) => {
		console.log(x);
		setQuestionChosen(true);
		setPrompts(x);
		setIndices([i1, i2]);
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
						Choose a word
					</div>
					<div className="h-[12.5%] w-2/3 flex flex-row justify-between items-center">
						<button
							className="w-1/4 h-full border-2 border-black"
							onClick={() => question(words[0], 1, 2)}
						>
							{words[0]}
						</button>
						<button
							className="w-1/4 h-full border-2 border-black"
							onClick={() => question(words[1], 0, 2)}
						>
							{words[1]}
						</button>
						<button
							className="w-1/4 h-full border-2 border-black"
							onClick={() => question(words[2], 0, 1)}
						>
							{words[2]}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
