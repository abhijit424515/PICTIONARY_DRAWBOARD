import { React, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import soundMap from "./SoundMap";

const ChatBubble = (props) => {
	useEffect(() => {
		const sound = new Audio(soundMap["messageSent"]);
		sound.play();
	}, []);

	return (
		<div
			className={
				props.bgColor +
				" " +
				props.textColor +
				" h-[4vh] w-fit my-1 border-2 border-black px-[0.4rem] rounded-[4px] break-all"
			}
		>
			<span className="font-bold">{props.name}</span>: {props.msg}
		</div>
	);
};

export default ChatBubble;
