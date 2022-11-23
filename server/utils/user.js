const users = [];
const rooms = [];

// Join user to chat
const userJoin = (id, number, name, room, host, presenter) => {
	const user = { id, number, name, room, host, presenter };
	users.push(user);

	const roomIndex = rooms.findIndex((thisroom) => thisroom.id === room);
	if (roomIndex === -1) {
		const room_entry = {'id' : room, 'count' : 1};
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
		return users.splice(index, 1)[0];
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

export { userJoin, userLeave, getUsers, getCount};
