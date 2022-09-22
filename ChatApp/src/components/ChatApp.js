import { useReducer, useEffect } from "react";
import io from "socket.io-client";
import { ThemeProvider } from "@mui/material/styles";
import {
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import theme from "../theme";
import ChatBubbleList from "./ChatBubbleList";
import TopBar from "./TopBar";
import "./App.css";

const ChatApp = () => {
  const initialState = {
    messages: [],
    status: "",
    showjoinfields: true,
    alreadyexists: false,
    chatName: "",
    roomName: "",
    users: [],
    typingMsg: "",
    isTyping: false,
    message: "",
    open: false,
    joined: false,
    rooms: [],
    onlineUsers: [],
  };
  const reducer = (state, newState) => ({ ...state, ...newState });
  const [state, setState] = useReducer(reducer, initialState);
  useEffect(() => {
    serverConnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const serverConnect = () => {
    // connect to server
    // const socket = io.connect("localhost:5000", {
    //   forceNew: true,
    //   transports: ["websocket"],
    //   autoConnect: true,
    //   reconnection: false,
    //   timeout: 5000,
    // });

    // connect to server on Heroku
    const socket = io.connect();

    socket.on("nameexists", onExists);
    socket.on("welcome", addMessage);
    socket.on("someonejoined", addMessage);
    socket.on("someoneleft", addMessage);
    socket.on("someoneistyping", onTyping);
    socket.on("newmessage", onNewMessage);
    socket.on("displayrooms", onDisplayRooms);
    socket.on("displayonlineusers", onDisplayOnlineUser);
    setState({ socket: socket });
  };

  const onDisplayRooms = (dataFromServer) => {
    setState({ rooms: dataFromServer });
  };

  const onDisplayOnlineUser = (dataFromServer) => {
    if (dataFromServer !== null) setState({ onlineUsers: dataFromServer });
    console.log(dataFromServer);
  };

  const onNewMessage = (dataFromServer) => {
    addMessage(dataFromServer);
    setState({ typingMsg: "" });
  };

  const onTyping = (dataFromServer) => {
    if (dataFromServer.from !== state.chatName) {
      setState({
        typingMsg: dataFromServer.text,
      });
    }
  };

  const onExists = (dataFromServer) => {
    setState({ status: dataFromServer.text, joined: false });
  };

  // generic handler for all other messages:
  const addMessage = (dataFromServer) => {
    let messages = state.messages;
    messages.push(dataFromServer);
    setState({
      messages: messages,
      users: dataFromServer.users,
      showjoinfields: false,
      alreadyexists: false,
    });
  };

  // handler for join button click
  const handleJoin = () => {
    state.socket.emit("join", {
      chatName: state.chatName,
      roomName: state.roomName,
    });
    setState({ joined: true });
  };
  // handler for name TextField entry
  const onNameChange = (e) => {
    setState({ chatName: e.target.value, status: "" });
  };
  // handler for room TextField entry
  const onRoomChange = (e) => {
    setState({
      roomName: e.target.value,
    });
  };

  // keypress handler for message TextField
  const onMessageChange = (e) => {
    setState({ message: e.target.value });
    if (state.isTyping === false) {
      state.socket.emit("typing", { from: state.chatName }, (err) => {});
      setState({ isTyping: true }); // flag first byte only
    }
  };

  // enter key handler to send message
  const handleSendMessage = (e) => {
    if (state.message !== "") {
      state.socket.emit(
        "message",
        { from: state.chatName, text: state.message },
        (err) => {}
      );
      setState({ isTyping: false, message: "" });
    }
  };

  const handleOpenDialog = () => setState({ open: true });
  const handleCloseDialog = () => setState({ open: false });

  return (
    <ThemeProvider theme={theme}>
      <TopBar viewDialog={handleOpenDialog} showIcon={state.joined} />
      <Dialog
        open={state.open}
        onClose={handleCloseDialog}
        style={{ margin: 20 }}
      >
        <DialogTitle style={{ textAlign: "center" }}>Who's On?</DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              {state.onlineUsers.map((user, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <img
                      src={`${process.env.PUBLIC_URL}/contactimage.png`}
                      alt={`${user.name}`}
                      style={{
                        background: user.colour,
                        borderRadius: 100,
                        width: 35,
                        height: 35,
                        marginTop: "10px",
                        marginRight: "25px",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <p>
                      {user.name} is in {user.room}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {state.showjoinfields ? (
        <>
          <div
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              marginTop: "5%",
              marginBottom: "5%",
              marginInline: "35%",
              borderRadius: 100,
              backgroundColor: "#fff",
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/p2logo.png`}
              alt="logo"
              style={{
                height: 75,
                width: 75,
                backgroundColor: "#fff",
                borderRadius: 100,
              }}
            />
            <Typography
              style={{
                fontWeight: 600,
              }}
              color="primary"
            >
              Sign In
            </Typography>
          </div>

          <Card style={{ marginInline: "5%" }}>
            <CardContent>
              <TextField
                onChange={onNameChange}
                placeholder="Chat Name"
                autoFocus={true}
                required
                value={state.chatName}
                error={state.status !== "" || state.chatName === ""}
                helperText={
                  state.status !== ""
                    ? state.status
                    : state.chatName !== ""
                    ? ""
                    : "enter a chat name"
                }
              />
            </CardContent>
          </Card>
          <Card style={{ marginInline: "5%" }}>
            <CardContent>
              <Typography color="primary">
                Join Exisiting or Enter Room Name
              </Typography>
              <FormControl>
                {state.rooms.map((room, i) => (
                  <RadioGroup
                    key={i}
                    name="radio-button-group"
                    aria-labelledby="radio-button-group-label"
                    onChange={(e) => {
                      setState({ roomName: e.target.value });
                    }}
                  >
                    <FormControlLabel
                      value={`${room}`}
                      control={<Radio />}
                      label={`${room}`}
                    />
                  </RadioGroup>
                ))}
              </FormControl>
              <br />
              <TextField
                onChange={onRoomChange}
                placeholder="Room Name"
                required
                value={state.roomName}
                error={state.roomName === ""}
                helperText={state.roomName === "" ? "enter a room name" : ""}
              />
            </CardContent>
          </Card>
          <Button
            variant="contained"
            data-testid="submit"
            color="primary"
            style={{
              marginLeft: "5%",
              marginTop: "5%",
              color: "#fff",
            }}
            onClick={() => handleJoin()}
            disabled={state.chatName === "" || state.roomName === ""}
          >
            Join
          </Button>
        </>
      ) : null}
      {!state.showjoinfields ? (
        <>
          <Card style={{ backgroundColor: "#232423" }}>
            <CardContent>
              <div className="chatList">
                <ChatBubbleList msg={state.messages} client={state.chatName} />
              </div>
              <br />
              <div style={{ display: "flex", backgroundColor: "#fff" }}>
                <TextField
                  onChange={onMessageChange}
                  style={{ marginRight: "5%", backgroundColor: "#fff" }}
                  placeholder="type something here"
                  autoFocus={true}
                  value={state.message}
                  onKeyPress={(e) =>
                    e.key === "Enter" ? handleSendMessage() : null
                  }
                />
                <Typography color="primary" style={{ marginTop: "8%" }}>
                  {state.typingMsg}
                </Typography>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </ThemeProvider>
  );
};
export default ChatApp;
