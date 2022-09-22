const moment = require("moment");
const matColours = require("./colours.json");

// users array and room
let users = ["Admin"];
let rooms = ["main"];
let colours = { Admin: "#311b92" };
let onlineList = [];

const handleJoin = (socket, clientData) => {
  if (users.includes(clientData.chatName)) {
    // notify the user if the name is already taken
    socket.emit("nameexists", {
      text: `${clientData.chatName} already taken, try a different name.`,
    });
  } else {
    // add the user to the array and set the room
    users.push(clientData.chatName);
    let colour =
      matColours.colours[
        Math.floor(Math.random() * matColours.colours.length) + 1
      ];
    colours[clientData.chatName] =
      colour == colours[users[0]]
        ? matColours.colours[
            Math.floor(Math.random() * matColours.colours.length) + 1
          ]
        : colour;
    if (!rooms.includes(clientData.roomName)) rooms.push(clientData.roomName);

    // set the socket name and room
    socket.name = clientData.chatName;
    socket.room = clientData.roomName;
    socket.join(clientData.roomName);

    let data = {
      name: clientData.chatName,
      colour: colours[clientData.chatName],
      room: clientData.roomName,
    };
    if (!onlineList.includes(data)) onlineList.push(data);

    // show the welcome message
    socket.emit("welcome", {
      time: moment().utcOffset(-4).format("h:mm:ss a"),
      from: users[0],
      room: socket.room,
      colour: colours[users[0]],
      text: `Welcome ${socket.name}`,
    });
    console.log(`${socket.name} joined at ${moment().format("h:mm:ss a")}`);
    // notify the client a user joined the room
    socket.to(socket.room).emit("someonejoined", {
      time: moment().utcOffset(-4).format("h:mm:ss a"),
      from: users[0],
      room: socket.room,
      colour: colours[users[0]],
      text: `${socket.name} has joined the ${socket.room} room!`,
    });
  }
};

const handleDisconnect = (socket) => {
  if (socket.name !== undefined) {
    let name = socket.name;
    let room = socket.room;
    let index = users.indexOf(name);
    if (index > -1) {
      users.splice(index, 1);
      console.log(`${name} left ${room} at ${moment().format("h:mm:ss a")}`);
      socket.to(room).emit("someoneleft", {
        time: moment().utcOffset(-4).format("h:mm:ss a"),
        from: users[0],
        room: room,
        colour: colours[users[0]],
        text: `${name} has left room ${room}`,
      });
    }

    let onlineIndex = onlineList.findIndex((u) => u.name === name);
    if (onlineIndex > -1) {
      console.log(`${name} went offline`);
      onlineList.splice(onlineIndex, 1);
    }
  }
};

const handleTyping = (socket, clientData) => {
  if (socket.name !== undefined) {
    socket.to(socket.room).emit("someoneistyping", {
      text: `...${clientData.from} is typing`,
    });
  }
};

const handleMessage = (socket, clientData) => {
  if (socket.name !== undefined) {
    socket.emit("newmessage", {
      time: moment().utcOffset(-4).format("h:mm:ss a"),
      room: socket.room,
      from: socket.name,
      colour: colours[socket.name],
      text: clientData.text,
    });
    socket.to(socket.room).emit("newmessage", {
      time: moment().utcOffset(-4).format("h:mm:ss a"),
      room: socket.room,
      from: socket.name,
      colour: colours[socket.name],
      text: `${clientData.text}`,
    });
  }
};

const displayRooms = () => {
  return rooms;
};

const handleGetRoomsAndUsers = (io) => {
  io.emit("displayonlineusers", onlineList);
};

module.exports = {
  handleJoin,
  handleDisconnect,
  handleTyping,
  handleMessage,
  displayRooms,
  handleGetRoomsAndUsers,
};
