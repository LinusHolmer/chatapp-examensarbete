"use client";

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client: Client | null = null;

export function connectWebSocket() {
  if (client && client.active) {
    console.log("WebSocket already connected");
    return;
  }

  console.log("Connecting WebSocket...");

  client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    debug: (str) => console.log(str),

    onConnect: () => {
      console.log("WebSocket connected");

      // Optional: subscribe to something
      client?.subscribe("/user/queue/messages", (message) => {
        console.log("Received:", message.body);
      });
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame.headers["message"]);
      console.error(frame.body);
    },

    onWebSocketClose: () => {
      console.log("WebSocket closed");
    },
  });

  client.activate();
}

export function sendMessage(body: string, receiver: string) {
  if (!client || !client.connected) {
    console.warn("WebSocket not connected");
    return;
  }

  console.log("Sending message");

  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({
      body,
      receiver,
    }),
  });
}

export function disconnectWebSocket() {
  if (client) {
    console.log("Disconnecting WebSocket");
    client.deactivate();
    client = null;
  }
}
