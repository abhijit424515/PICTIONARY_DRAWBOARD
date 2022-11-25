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
	"pen",
	"caterpillar",
	"rocket",
	"alligator",
	"pizza",
	"shirt",
	"kite",
	"eyes",
	"chair",
	"cup",
	"jacket",
	"hippo",
	"bird",
	"monster",
	"bracelet",
	"coat",
	"balloon",
	"dinosaur",
	"head",
	"book",
	"mouse",
	"smile",
	"bridge",
	"blocks",
	"milk",
	"eye",
	"oval",
	"snowflake",
	"broom",
	"cheese",
	"lion",
	"lips",
	"beach",
	"cloud",
	"bus",
	"elephant",
	"sunglasses",
	"lemon",
	"star",
	"spoon",
	"boat",
	"turtle",
	"drum",
	"doll",
	"ant",
	"motorcycle",
	"bike",
	"pencil",
	"bunk bed",
	"moon",
	"inchworm",
	"slide",
	"hat",
	"cat",
	"tail",
	"helicopter",
	"square",
	"Mickey Mouse",
	"octopus",
	"door",
	"table",
	"egg",
	"bell",
	"nose",
	"spider",
	"horse",
	"finger",
	"glasses",
	"jar",
	"girl",
	"ear",
	"lizard",
	"flower",
	"snowman",
	"baby",
	"car",
	"bread",
	"blanket",
	"apple",
	"bench",
	"skateboard",
	"pig",
	"ice cream cone",
	"frog",
	"feet",
	"lollipop",
	"heart",
	"ears",
	"bed",
	"carrot",
	"person",
	"boy",
	"train",
	"truck",
	"bug",
	"legs",
	"bowl",
	"lamp",
	"desk",
	"purse",
	"light",
	"mountain",
	"snail",
	"basketball",
	"orange",
	"bear",
	"chicken",
	"grass",
	"cookie",
	"clock",
	"ghost",
	"spider web",
	"ocean",
	"monkey",
	"shoe",
	"dog",
	"face",
	"circle",
	"water",
	"butterfly",
	"house",
	"robot",
	"mouth",
	"branch",
	"worm",
	"socks",
	"grapes",
	"crab",
	"banana",
	"computer",
	"bee",
	"whale",
	"seashell",
	"snake",
	"sun",
	"swing",
	"bat",
	"pie",
	"wheel",
	"bunny",
	"hand",
	"cherry",
	"jellyfish",
	"tree",
	"stairs",
	"duck",
	"leaf",
	"dragon",
	"giraffe",
	"ball",
	"pants",
	"ring",
	"airplane",
	"candle",
	"cow",
	"cupcake",
	"football",
	"hamburger",
	"bone",
	"corn",
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
	return rooms[rooms.findIndex((thisroom) => thisroom["id"] === room)]["ans"];
};

export const setCorrect = (userID) => {
	const index = users.findIndex((user) => user.userID === userID);

	if (index !== -1) {
		users[index].answered = true;
	}
};

export const updatePoints = (userID, roomID) => {
	const index = users.findIndex((user) => user.userID === userID);
	const roomIndex = rooms.findIndex((r) => r.id === roomID);
	const myusers = getUsers(roomID);

	let count = 0;

	myusers.forEach(u => {
		if(u.answered === true){
			count++;
		}
	});

	const points = 100*(1 - (count - 1)/(rooms[roomIndex].count));
	if (index !== -1) {
		users[index]["points"] += points;
	}
};

export const getPointArray = (room) => {
    return getUsers(room).map((user) => user.points);
};

export const resetAfterRound = (room) => {
	users.forEach((user) => {
		if (user.room === room) {
			user["answered"] = false;
		}
	});
	const index = rooms.findIndex((r) => r.id === room);
	if (index!== -1) {
		rooms[index]['answeredCount'] = 0;
	}
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
	const index = rooms.findIndex((thisroom) => thisroom.id === room);
	if (index == -1) {
		return;
	}
	let prompts = { words: [], indices: [] };
	let count = 0;
	let boolPrompt = [...rooms[index]["prompts"]];
	boolPrompt.forEach((b, index) => {
		if (b) {
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
	const roomIndex = rooms.findIndex((r) => r.id === users[index].room);

	if (index !== -1) {
		users[index].answered = true;
	}
};

export const increaseAnswered = (room) => {
	const roomIndex = rooms.findIndex((r) => r.id === room);

	if(roomIndex !== -1){
		rooms[roomIndex].answeredCount += 1;
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
		if (thisuser.answered === false) {
			flag = false;
		}
	});

	return flag;
};

export const resetAfterTurn = (room) => {
	users.forEach((user) => {
		if (user.room.toString() === room.toString()) {
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
	myusers.sort((u1, u2) => u2.points - u1.points);
	const winners = myusers.slice(0, 3).map((u) => [u.name, u.points]);
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
