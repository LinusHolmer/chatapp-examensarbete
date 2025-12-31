"use client";

import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

export type WSMessage = {
  sender: string;
  receiver: string;
  body: string;
  timestamp: string;
};

let messageHandler: ((msg: WSMessage) => void) | null = null;

export const client = new Client({
  webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
  //bara för dev
  debug: (str) => console.log(str),
  reconnectDelay: 5000,
});

export function connectWebSocket() {
  if (client.active) return;

  client.onConnect = () => {
    console.log("WebSocket connected");

    client.subscribe("/user/queue/messages", (message: IMessage) => {
      const payload: WSMessage = JSON.parse(message.body);
      messageHandler?.(payload);
    });
  };

  client.onStompError = (frame) => {
    console.error("STOMP error:", frame.headers["message"]);
    console.error(frame.body);
  };

  client.activate();
}

export function onMessage(handler: (msg: WSMessage) => void) {
  messageHandler = handler;
}

export function sendMessage(body: string, receiver: string) {
  if (!client.connected) {
    console.warn("WebSocket not connected");
    return;
  }

  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({ body, receiver }),
  });
}

export function disconnectWebSocket() {
  if (client.active) {
    client.deactivate();
  }
}
