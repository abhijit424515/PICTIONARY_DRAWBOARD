import React from "react";
import "../styles/Leaderboard.css";

const nameHeader =
	"h-1/5 w-[12vw] text-[2rem] font-bold align-center flex justify-center items-center";
const rankHeader =
	"h-[8vh] text-[2rem] font-bold align-center flex justify-center items-end";

export default function Leaderboard({ winners }) {
	return (
		<>
			{/* <div className="absolute h-[100vh] w-full flex flex-row justify-center items-center">
				<div className="absolute h-4/5 w-1/2 rounded-[50px] overflow-hidden">
					<div className="wave h-screen w-[300vw]"></div>
					<div className="wave h-screen w-[300vw]"></div>
					<div className="wave h-screen w-[300vw]"></div>
				</div>
			</div> */}
			<div className="absolute w-full h-full flex justify-between items-center">
				<img src="./assets/popper.png" className="my-auto w-1/4" />
				<img src="./assets/popper.png" className="my-auto w-1/4 scale-x-[-1]" />
			</div>
			<div className="h-[100vh] w-full break-words text-center flex flex-row justify-center items-center bg-violet-600">
				<div className="h-4/5 w-1/2 flex flex-row justify-evenly bg-gradient-to-b from-gray-50 to-gray-300 rounded-[50px] border-[4px] border-black">
					<div className="flex flex-col w-[12vw] items-center justify-end pb-[2rem]">
						<div className={`second ${nameHeader}`}>{winners[1][0]}</div>
						<div
							className={`h-2/5 w-[6vw] neu border-[3px] border-black`}
						></div>
						<div className={`${rankHeader}`}>{Math.round(winners[1][1])}</div>
					</div>
					<div className="flex flex-col w-[12vw] items-center justify-end pb-[2rem]">
						<div className={`first ${nameHeader}`}>{winners[0][0]}</div>
						<div
							className={`h-3/5 w-[6vw] neu border-[3px] border-black`}
						></div>
						<div className={`${rankHeader}`}>{Math.round(winners[0][1])}</div>
					</div>
					<div className="flex flex-col w-[12vw] items-center justify-end pb-[2rem]">
						<div className={`third ${nameHeader}`}>{winners[2][0]}</div>
						<div
							className={`h-1/5 w-[6vw] neu border-[3px] border-black`}
						></div>
						<div className={`${rankHeader}`}>{Math.round(winners[2][1])}</div>
					</div>
				</div>
			</div>
		</>
	);
}
