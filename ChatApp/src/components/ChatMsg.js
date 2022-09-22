import React from "react";
import "./App.css";

const ChatMsg = (props) => {
  let msg = props.msg;
  return (
    <>
      <div
        style={{
          backgroundColor: msg.colour,
          color: "#fff",
          left: props.client === props.msg.from ? "20%" : "-5%",
        }}
        className="chatBubble"
      >
        <div style={{ display: "flex" }}>
          <p
            style={{
              fontSize: 12,
              marginRight: props.client === props.msg.from ? "55%" : "45%",
            }}
          >
            {msg.from} says:
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "-2.5vh",
            }}
          >
            <p style={{ fontSize: 12, marginBottom: "-1.5vh" }}>
              Room: {props.msg.room}
            </p>
            <p style={{ fontSize: 12 }}>@{msg.time}</p>
          </div>
        </div>
        <p style={{ fontSize: 14, fontWeight: "700" }}>{msg.text}</p>
      </div>
      <div
        style={{
          content: "" /* triangle */,
          position: "absolute",
          bottom:
            "-2.5vh" /* value = - border-top-width - border-bottom-width */,
          // left: `${props.alignTriangle}` /* controls horizontal position */,
          borderWidth:
            "15px 15px 0" /* vary these values to change the angle of the vertex */,
          borderStyle: "solid",
          borderColor: `${msg.colour} transparent`,
          left: props.client === props.msg.from ? "80%" : "5%",
        }}
      />
    </>
  );
};
export default ChatMsg;
