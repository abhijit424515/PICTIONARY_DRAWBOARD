import React, { useState } from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PlayerCards(props) {
	return (
		<div
			className={
				props.bgColor +
				" " +
				props.textColor +
				" my-0.5 mx-1 flex flow-row justify-between border-2 border-black p-[1rem] rounded-[12px]"
			}
		>
			<div>${props.score}</div>
			<div>{props.name}</div>
			<FontAwesomeIcon icon={faUser} />
		</div>
	);
}
