import React from "react";

const ChatBubble = (props) => {
	return (
		<div
			className={
				props.bgColor +
				" " +
				props.textColor +
				" w-fit my-1 border-2 border-black px-[0.4rem] rounded-[4px] break-all"
			}
		>
			<span className="font-bold">{props.name}</span>: {props.msg}
		</div>
	);
};

export default ChatBubble;
