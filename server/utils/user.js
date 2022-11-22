const users = [];

// Join user to chat
const userJoin = (id, name, room, host, presenter) => {
	const user = { id, name, room, host, presenter };
	users.push(user);
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

export { userJoin, userLeave, getUsers };
