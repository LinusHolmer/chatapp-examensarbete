"use client";

import "./ui/global.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "./components/modal/modal";
import CustomButton from "./components/CustomButton/CustomButton";
import { addFriend } from "./components/AddFriend/AddFriend";
import AddFriendContent from "./components/AddFriendContent/AddFriendContent";
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
  client,
  onMessage
} from "../app/websocket";
import { useChatMethods } from "./components/ChatMethods/ChatMethods";


type ModalType = "add-friends" | "discover-friends" | null;

type Friend = {
  id: number;
  name: string;
};

type ChatMessage = {
  body: string;
  timestamp: string;
  direction: "in" | "out";
};

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const [unread, setUnread] = useState<Record<string, number>>({});
  const [lastSeen, setLastSeen] = useState<Record<string, string>>({});
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const [discFriends, setDiscFriends] = useState<any[]>([]);

  const { logout } = useChatMethods();

  const discoverFriends = async () => {
    const response = await fetch("/api/chatUser/discover");
    const data = await response.json();
    setDiscFriends(data);
  };

  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActiveModal(null);
  };

  // vänner från backend
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsError, setFriendsError] = useState<string | null>(null);


  useEffect(() => {
  connectWebSocket();

  onMessage((msg) => {
    moveFriendToTop(msg.sender);

    if (selectedFriend?.name === msg.sender) {
      setMessages((prev) => [
        ...prev,
        {
          body: msg.body,
          timestamp: msg.timestamp,
          direction: "in",
        },
      ]);

      setLastSeen((prev) => ({
        ...prev,
        [msg.sender]: msg.timestamp,
      }));
    } else {
      setUnread((prev) => ({
        ...prev,
        [msg.sender]: (prev[msg.sender] ?? 0) + 1,
      }));
    }
  });

  return disconnectWebSocket;
}, [selectedFriend]);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!message.trim() || !selectedFriend) return;

  const outgoing = {
    body: message,
    timestamp: new Date().toISOString(),
    direction: "out" as const,
  };

  setMessages((prev) => [...prev, outgoing]);

  sendMessage(message, selectedFriend.name);

  setMessage("");
  moveFriendToTop(selectedFriend.name);
};


  const moveFriendToTop = (friendName: string) => {
    setFriends((prev) => {
      const friend = prev.find((f) => f.name === friendName);
      if (!friend) return prev;

      // ta bort vännen och lägg den först
      return [friend, ...prev.filter((f) => f.name !== friendName)];
    });
  };

  const fetchFriends = async () => {
    setFriendsError(null);

    const res = await fetch("/api/chatUser/getFriends", {
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    const usernames: string[] = await res.json();
    setFriends(usernames.map((u, i) => ({ id: i + 1, name: u })));
  };

  useEffect(() => {
    fetchFriends().catch((e: any) =>
      setFriendsError(e.message || "Kunde inte hämta vänner")
    );
  }, []);

  

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);


  const loadChat = async (friendName: string) => {
    const response = await fetch("/api/messages/viewMessagesV2", {
      cache: "no-store",
    });
    const data = await response.json()

    const {receivedMessages, sentMessages} = data

    const combined: ChatMessage[] = [
      ...receivedMessages
        .filter((m: any) => m.sender === friendName)
        .map((m: any) => ({
          body: m.body,
          timestamp: m.timestamp,
          direction: "in",
        })),

      ...sentMessages
        .filter((m: any) => m.receiver === friendName)
        .map((m: any) => ({
          body: m.body,
          timestamp: m.timestamp,
          direction: "out",
        })),
    ];

    combined.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    setMessages(combined);
    const latestIncoming = combined
      .filter((m) => m.direction === "in")
      .slice(-1)[0]?.timestamp;

    if (latestIncoming) {
      setLastSeen((prev) => ({ ...prev, [friendName]: latestIncoming }));
    }
  };


  const handleRemove = async () => {
    if (!selectedFriend) return;

    const res = await fetch("/api/messages/deleteLatest", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiver: selectedFriend.name }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.log("deleteLatest failed:", res.status, text);
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    await loadChat(selectedFriend.name);
  };




  return (
    <>
      <nav className="navbar">
        <Link href="/" className="nav-logo">
          <Image src="/logo.png" alt="Logo" width={200} height={200} priority />
        </Link>

        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <div className={`line ${isOpen ? "open" : ""}`}></div>
          <div className={`line ${isOpen ? "open" : ""}`}></div>
          <div className={`line ${isOpen ? "open" : ""}`}></div>
        </button>

        {isOpen && (
          <ul className="mobile-menu">
            <li>
              <CustomButton
                buttonText={"Add Friends"}
                onClick={() => openModal("add-friends")}
              />
            </li>
            <li>
              <CustomButton
                buttonText={"Discover Friends"}
                onClick={() => openModal("discover-friends")}
              />
            </li>
             <li>
              <CustomButton
                buttonText={"Logout"}
                onClick={logout}
              />
            </li>
          </ul>
        )}

        {modalOpen && (
          <Modal isOpen={modalOpen} onClose={closeModal}>
            {activeModal === "add-friends" && (
              <AddFriendContent
                onAdded={async () => {
                  try {
                    await fetchFriends();
                  } catch (e: any) {
                    setFriendsError(e.message || "Kunde inte uppdatera vänner");
                  }
                }}
              />
            )}

            {activeModal === "discover-friends" && (
              <div>
                <h2>Discover new friends</h2>
                <CustomButton
                  buttonText={"Discover Friends"}
                  onClick={discoverFriends}
                />
                <ul>
                  {discFriends.map((name, index) => (
                    <li key={index} className="discover-friends">
                    <span>{name}</span>
                    <CustomButton 
                    buttonText={"Add"} 
                    onClick={async () =>{
                      await addFriend(name)
                      await fetchFriends()
                      await discoverFriends()
                      }
                    }
                    /> 

                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Modal>
        )}
      </nav>

      <main className="chat-layout">
        <aside className="friends-panel">
          <h2>Vänner</h2>
          {friendsError && <p className="status">{friendsError}</p>}
          <ul className="friends-list">
            {friends.map((friend) => (
              <li
                key={friend.name}
                className={
                  selectedFriend?.name === friend.name
                    ? "friend-item active"
                    : "friend-item"
                }
                onClick={() => {
                  setSelectedFriend(friend);
                  loadChat(friend.name);

                  // nollställ unread när man öppnar chatten
                  setUnread((prev) => ({ ...prev, [friend.name]: 0 }));
                  setLastSeen((prev) => ({
                    ...prev,
                    [friend.name]: new Date().toISOString(),
                  }));
                }}
              >
                <span className="friend-name">{friend.name}</span>

                {unread[friend.name] > 0 && (
                  <span className="badge">{unread[friend.name]}</span>
                )}
              </li>
            ))}
          </ul>
        </aside>

        <section className="chat-panel">
          {selectedFriend ? (
            <>
              <header className="chat-header">
                <h2>Chatt med {selectedFriend.name}</h2>
              </header>

              <div className="chat-messages">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`chat-bubble ${
                      m.direction === "out" ? "sent" : "received"
                    }`}
                  >
                    <strong>
                      {m.direction === "out" ? "Du" : selectedFriend?.name}:
                    </strong>{" "}
                    {m.body}
                    {/* Visa Remove bara på dina egna (out) */}
                    {m.direction === "out" && (
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove()}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

                <form onSubmit={handleSubmit} 
                  className="chat-input-row">
                <input
                  type="text"
                  placeholder={`Skriv till ${selectedFriend.name}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" onClick={() => {moveFriendToTop(selectedFriend.name)}}>Skicka</button>
                
              </form>

            </>
          ) : (
            <div className="chat-empty">
              <p>Välj en vän till vänster för att börja chatta</p>
            </div>
          )}
        </section>
        <div id="modal-root"></div>
      </main>
    </>
  );
}


