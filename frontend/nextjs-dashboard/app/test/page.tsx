"use client";

import { useEffect } from "react";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
} from "../websocket";

export default function ChatPage() {
  console.log("ChatPage rendered");

  useEffect(() => {
    console.log("useEffect ran");

    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  const handleSend = () => {
    console.log("Button clicked");
    sendMessage("Hello from WebSocket!", "superdupertest");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>WebSocket Test</h1>

      <button onClick={handleSend}>
        Send message
      </button>
    </div>
  );
}
