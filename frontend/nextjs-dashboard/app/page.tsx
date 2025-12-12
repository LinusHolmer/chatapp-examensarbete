"use client";

import "./ui/global.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "./components/modal/modal";
import CustomButton from "./components/CustomButton/CustomButton";

type ModalType = "add-friends" | "discover-friends" | null;

type Friend = {
  id: number;
  name: string;
};

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [discFriends, setDiscFriends] = useState<any[]>([]);

  const openModal = (type: ModalType) => {
    setActiveModal(type);
    setModalOpen(true);
  };

  const discoverFriends = async () => {
    const response = await fetch("/api/discoverFriends", {
      credentials: "include",
    });
    const data = await response.json();
    setDiscFriends(data);
  };

  // exempel på vänner för att kolla så det funkar
  const [friends] = useState<Friend[]>([
    { id: 1, name: "Anna" },
    { id: 2, name: "Kalle" },
    { id: 3, name: "Sara" },
    { id: 4, name: "Oskar" },
    { id: 5, name: "Maja" },
  ]);

  // Den vän som är vald just nu
  // När man klickar i listan ändras state
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(
    friends[0] ?? null
  );

  // Vad användaren håller på att skriva i chatt-rutan
  const [message, setMessage] = useState("");

  // Alla chattmeddelanden, uppdelade per vän
  const [chatLog, setChatLog] = useState<Record<number, string[]>>({});

  // Funktion som körs när man trycker på skicka knappen
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault(); // stoppar att sidan laddas om

    if (!selectedFriend || !message.trim()) return;

    // Lägg till meddelande i chatLog för rätt vän
    setChatLog((prev) => {
      const prevMessages = prev[selectedFriend.id] ?? []; // hämta gamla meddelanden
      return {
        ...prev,
        [selectedFriend.id]: [...prevMessages, message], // lägg till nytt meddelande
      };
    });

    setMessage(""); // töm inputfältet
  };

  return (
    <>
      <nav className="navbar">
        <Link href="/" className="nav-logo">
          <Image src="/logo.png" alt="Logo" width={200} height={200} priority />
        </Link>

        {/* Hamburgar meny-knapp */}
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <div className={`line ${isOpen ? "open" : ""}`}></div>
          <div className={`line ${isOpen ? "open" : ""}`}></div>
          <div className={`line ${isOpen ? "open" : ""}`}></div>
        </button>

        {/* Menyn som fälls ut */}
        {isOpen && (
          <ul className="mobile-menu">
            <li>
              {" "}
              <CustomButton
                buttonText={"Add Friends"}
                onClick={() => openModal("add-friends")}
              />
            </li>
            <li>
              {" "}
              <CustomButton
                buttonText={"Discover Friends"}
                onClick={() => openModal("discover-friends")}
              />
            </li>
          </ul>
        )}

        {/* gör modal dynamisk sen */}
        {modalOpen && (
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
            {activeModal === "add-friends" && (
              <div>
                <h2>Add Friends</h2>
                <p>Here you can add friends.</p>
              </div>
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
                    <li key={index}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
          </Modal>
        )}
      </nav>

      <main className="chat-layout">
        {/* vänster: vänner + scroll */}

        <aside className="friends-panel">
          <h2>Vänner</h2>

          {/* Listan som visas med scroll om den blir lång */}
          <ul className="friends-list">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className={
                  selectedFriend?.id === friend.id
                    ? "friend-item active"
                    : "friend-item"
                }
                onClick={() => setSelectedFriend(friend)}
              >
                {friend.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Höger chatt meed vald vän */}

        <section className="chat-panel">
          {/* Om en vän är vald, visa chatten */}
          {selectedFriend ? (
            <>
              <header className="chat-header">
                <h2>Chatt med {selectedFriend.name}</h2>
              </header>

              {/* Meddelandebubbla som visas i chatt med vän*/}
              <div className="chat-messages">
                {(chatLog[selectedFriend.id] ?? []).map((m, i) => (
                  <div key={i} className="chat-bubble">
                    {m}
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
