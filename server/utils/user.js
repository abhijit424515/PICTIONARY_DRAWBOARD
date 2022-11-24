const users = [];
const rooms = [];

// Join user to chat
const userJoin = (id, number, name, room, host, presenter) => {
	const user = { id, number, name, room, host, presenter };
	users.push(user);

	const roomIndex = rooms.findIndex((thisroom) => thisroom.id.toString() === room.toString());
	console.log("room inserting " + room.toString());
	console.log(roomIndex);
	if (roomIndex === -1) {
		const room_entry = {'id' : room, 'count' : 1, 'ans': 'NULL', 'answeredCount':0};
		rooms.push(room_entry);
	}
	else {
		rooms[roomIndex]['count'] += 1;
	}
	return user;
};

// User leaves chat
const userLeave = (id) => {

	const index = users.findIndex((user) => user.id === id);

	if (index !== -1) {
		const roomIndex = rooms.findIndex((thisroom) => thisroom.id === users[index].room);

		if(roomIndex != -1){
			rooms[roomIndex]['count'] -= 1;
		}
		let x = users.splice(index, 1)[0];
		console.log(x)
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

// Get number of users present in room
const getCount = (room) => {
	const ind = rooms.findIndex((thisroom) => thisroom['id']===room);
	if (ind===-1){
		return 0;
	}
	else {
		return rooms[ind]['count'];
	}
}

const updateNumbers = (roomID, num) => {
	users.forEach(n => {
		if( n.room.toString() === roomID.toString() && n.number > num){
			n.number = n.number - 1;
		}
	})
}

const getRooms = () => {
	return rooms;
}

const getAnswer = (room) => {
	console.log(room);
	return rooms[rooms.findIndex((thisroom) => thisroom['id'] === room)]['ans'];
}

export { userJoin, userLeave, getUsers, getCount, updateNumbers, getRooms, getAnswer};
