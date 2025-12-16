"use client";

import "./ui/global.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "./components/modal/modal";
import CustomButton from "./components/CustomButton/CustomButton";
import AddFriendContent from "./components/AddFriendContent/AddFriendContent";
import { addFriend } from "./components/AddFriend/AddFriend";


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
  const [discFriends, setDiscFriends] = useState<any[]>([]);


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

  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  useEffect(() => {
    setSelectedFriend((prev) => {
      if (friends.length === 0) return null;
      if (!prev) return friends[0];
      const stillExists = friends.find((f) => f.name === prev.name);
      return stillExists ?? friends[0];
    });
  }, [friends]);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const loadChat = async (friendName: string) => {
    const receivedRes = await fetch("/api/messages/viewMessages", {
      cache: "no-store",
    });
    const sentRes = await fetch("/api/messages/viewSentMessages", {
      cache: "no-store",
    });

    const received = await receivedRes.json();
    const sent = await sentRes.json();

    const combined: ChatMessage[] = [
      ...received
        .filter((m: any) => m.sender === friendName)
        .map((m: any) => ({
          body: m.body,
          timestamp: m.timestamp,
          direction: "in",
        })),

      ...sent
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
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFriend || !message.trim()) return;

    await fetch("/api/messages/sendNew", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        receiver: selectedFriend.name,
        body: message,
      }),
    });

    setMessage("");
    await loadChat(selectedFriend.name);
  };

  useEffect(() => {
    if (!selectedFriend) return;

    loadChat(selectedFriend.name);
    const interval = setInterval(() => loadChat(selectedFriend.name), 3000);

    return () => clearInterval(interval);
  }, [selectedFriend]);

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
          </ul>
        )}

         {modalOpen && (
          <Modal isOpen={modalOpen} onClose={closeModal}>
            {activeModal === "add-friends" && (
              <AddFriendContent
                onAdded={async () => {
                  try{
                  await fetchFriends();
                }catch(e: any){
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
                key={friend.id}
                className={
                  selectedFriend?.id === friend.id
                    ? "friend-item active"
                    : "friend-item"
                }
                onClick={() => {
                  setSelectedFriend(friend);
                  loadChat(friend.name);
                }}
              >
                {friend.name}
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
    // varje meddelande som ser ut som en chat bubble
    // key={i} för att react ska hålla koll på listan
    <div
      key={i}
      
      className={`chat-bubble ${m.direction === "out" ? "sent" : "received"}`}
    >
      <strong>
        {
          // om "out" = vi skickad så står det "du"
          // om vän skickade = vännens namn
          m.direction === "out" ? "Du" : selectedFriend?.name
        }
        :
      </strong>{" "}
      {
    
        m.body
      }
    </div>
  ))}
</div>

              <form onSubmit={handleSend} className="chat-input-row">
                <input
                  type="text"
                  placeholder={`Skriv till ${selectedFriend.name}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">Skicka</button>
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

