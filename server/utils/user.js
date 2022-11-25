const users = [];
const rooms = [];
const globalPrompts = [
	"Windmill",
	"Calendar",
	"Boat",
	"Dog",
	"Umbrella",
	"Bottle",
	"Lamp",
	"Sun",
	"Mountain",
	"River",
];

// Join user to chat
const userJoin = (
	userID,
	id,
	number,
	name,
	room,
	host,
	presenter,
	points,
	answered
) => {
	const user = {
		userID,
		id,
		number,
		name,
		room,
		host,
		presenter,
		points,
		answered,
	};
	users.push(user);

	const roomIndex = rooms.findIndex(
		(thisroom) => thisroom.id.toString() === room.toString()
	);
	console.log("room inserting " + room.toString());
	console.log(roomIndex);
	if (roomIndex === -1) {
		const room_entry = {
			id: room,
			count: 1,
			ans: "NULL",
			answeredCount: 0,
			prompts: new Array(globalPrompts.length).fill(0),
			promptsDone: 1,
			drawer: 1,
			rounds: 1,
		};
		rooms.push(room_entry);
	} else {
		rooms[roomIndex]["count"] += 1;
	}
	return user;
};

// User leaves chat
const userLeave = (id) => {
	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		const roomIndex = rooms.findIndex(
			(thisroom) => thisroom.id === users[index].room
		);

		if (roomIndex != -1) {
			rooms[roomIndex]["count"] -= 1;
		}
		let x = users.splice(index, 1)[0];
		console.log(x);
		return x;
	}
};

// Get users present in room
const getUsers = (room) => {
	const RoomUsers = [];

	users.map((user) => {
		if (user.room == room) {
			RoomUsers.push(user);
		}
	});

	return RoomUsers;
};

export const getDrawer = (room) => {
	const rIndex = rooms.findIndex((r) => r.id === room);
	const drawIndex = rooms[rIndex].drawer;
	console.log("drawindex " + drawIndex);
	// if (drawIndex!== -1) {
	// 	console.log(getUsers(room));
	//     const userIndex = getUsers(room).findIndex((u) => u.number === drawIndex);
	// 	if (userIndex!== -1) {
	// 		return users[userIndex].userID;
	// 	}
	// }

	// const myusers = getUsers(room);

	// if(drawIndex >= myusers.length){
	// 	return myusers[0].userID;
	// }
	// else{
	// 	return myusers[drawIndex].userID;
	// }

	rooms[rIndex].drawer += 1;

	return getUsers(room)[drawIndex].userID;
};

export const fetchUser = (id) => {
	const index = users.findIndex((user) => user.userID === id);

	if (index !== -1) {
		const user = users[index];
		return user;
	}
};

// Get number of users present in room
const getCount = (room) => {
	const ind = rooms.findIndex((thisroom) => thisroom["id"] === room);
	if (ind === -1) {
		return 0;
	} else {
		return rooms[ind]["count"];
	}
};

const updateNumbers = (roomID, num) => {
	users.forEach((n) => {
		if (n.room.toString() === roomID.toString() && n.number > num) {
			n.number = n.number - 1;
		}
	});
};

const getRooms = () => {
	return rooms;
};

const getAnswer = (room) => {
	console.log(room);
	return rooms[rooms.findIndex((thisroom) => thisroom["id"] === room)]["ans"];
};

export const setCorrect = (userID) => {
	const index = users.findIndex((user) => user.userID === userID);

	if (index !== -1) {
		users[index].answered = true;
	}
};

export const updatePoints = (userID, points) => {
	const index = users.findIndex((user) => user.userID === userID);

	if (index !== -1) {
		users[index]["points"] += points;
	}
};

export const resetAfterRound = (room) => {
	users.forEach((user) => {
		if (user.room === room) {
			user["answered"] = false;
		}
	});
};

export const checkIfRound = (room) => {
	const myusers = getUsers(room);
	myusers.forEach((thisuser) => {
		if (thisuser.answered == true) {
			return false;
		}
	});
	return true;
};

export const getNewPrompts = (room) => {
	console.log("in getNewPrompts");
	const index = rooms.findIndex((thisroom) => thisroom.id === room);
	console.log("index" + index);
	console.log(rooms);
	if (index == -1) {
		console.log("returning null");
		return;
	}
	let prompts = { words: [], indices: [] };
	let count = 0;
	let boolPrompt = [...rooms[index]["prompts"]];
	console.log(boolPrompt);
	boolPrompt.forEach((b, index) => {
		if (b) {
			console.log("already done " + globalPrompts[index]);
		}
	});
	if (index !== -1) {
		while (count < 3) {
			const num = Math.floor(Math.random() * globalPrompts.length);
			if (boolPrompt[num] === 0) {
				boolPrompt[num] = 1;
				prompts["indices"].push(num);
				prompts["words"].push(globalPrompts[num]);
				count++;
			}
		}
		console.log("returning prompts");
		return prompts;
	}
};

export const takenPrompt = (promptIndex, room) => {
	const index = rooms.findIndex((thisroom) => thisroom.id === room);
	if (index !== -1) {
		rooms[index]["promptsDone"] += 1;
		rooms[index]["prompts"][promptIndex] = 1;
	}
};

export const updateRoomAnswer = (room, answer) => {
	const index = rooms.findIndex((thisroom) => thisroom.id === room);

	if (index !== -1) {
		rooms[index]["ans"] = answer;
	}
};

export const updateAnswered = (userID) => {
	const index = users.findIndex((user) => user.userID === userID);

	if (index !== -1) {
		users[index].answered = true;
	}
};

export const setAns = (roomID, ans) => {
	const index = rooms.findIndex((r) => r.id === roomID);

	if (index !== -1) {
		rooms[index].ans = ans;
	}
};

export const checkAllAnswered = (roomID) => {
	const myusers = getUsers(roomID);

	let flag = true;

	myusers.forEach((thisuser) => {
		console.log("is true/false --- " + thisuser.answered);
		if (thisuser.answered === false) {
			console.log("returning false");
			flag = false;
		}
	});

	return flag;
};

export const resetAfterTurn = (room) => {
	console.log("in resetAFterTurn  " + room);
	users.forEach((user) => {
		console.log(user);
		if (user.room.toString() === room.toString()) {
			console.log("resetting user answered " + user.userID);
			user["answered"] = false;
		}
	});
};

export const retFirstUserinRoom = (room) => {
	const myusers = getUsers(room);
	myusers[0].answered = true;
	return myusers[0].userID;
};

export const isRoundOver = (room) => {
	const index = rooms.findIndex((thisroom) => thisroom.id === room);

	let flag =
		rooms[index].count == rooms[index].drawer && rooms[index].drawer != 1;

	if (flag) {
		rooms[index].drawer = 1;
		rooms[index].rounds += 1;
	}

	return flag;
};

export const getRound = (room) => {
	const index = rooms.findIndex((thisroom) => thisroom.id === room);

	return rooms[index].rounds;
};

export const getWinners = (room) => {
	const myusers = [...getUsers(room)];
	myusers.sort((u1, u2) => u1.points - u2.points);
	const winners = myusers.slice(0, 3).map((u) => u.name);
	console.log(winners);
	return winners;
};

export const elementaryCheck = (userID, room) => {
	const myusers = getUsers(room);

	const indx = myusers.findIndex((u) => u.userID == userID);

	if (indx == 0) {
		return true;
	} else {
		return false;
	}
};

export {
	userJoin,
	userLeave,
	getUsers,
	getCount,
	updateNumbers,
	getRooms,
	getAnswer,
};
