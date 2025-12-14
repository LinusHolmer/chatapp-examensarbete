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
  const discoverFriends = async () => {
    const response = await fetch("/api/chatUser/discover", {
      credentials: "include",
    });
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

  //vänner från backend
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

  // Den vän som är vald just nu
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  // om friends ändras måste selectfriend finnas
  useEffect(() => {
    setSelectedFriend((prev) => {
      if (friends.length === 0) return null;
      if (!prev) return friends[0];
      const stillExists = friends.find((f) => f.name === prev.name);
      return stillExists ?? friends[0];
    });
  }, [friends]);

  // Vad användaren skriver skriva i chattrutan
  const [message, setMessage] = useState("");

  // Alla chattmeddelanden uppdelade per vän
  const [chatLog, setChatLog] = useState<Record<number, string[]>>({});

  // Funktion som körs när man trycker på skicka knappen
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFriend || !message.trim()) return;

    setChatLog((prev) => {
      const prevMessages = prev[selectedFriend.id] ?? [];
      return {
        ...prev,
        [selectedFriend.id]: [...prevMessages, message],
      };
    });

    setMessage("");
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
          </ul>
        )}

        {modalOpen && (
          <Modal isOpen={modalOpen} onClose={closeModal}>
            {activeModal === "add-friends" && (
              <AddFriendContent
                onAdded={async () => {
                  await fetchFriends().catch((e: any) =>
                    setFriendsError(e.message || "Kunde inte uppdatera vänner")
                  );
                  closeModal();
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
                    <li key={index}>{name}</li>
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
                onClick={() => setSelectedFriend(friend)}
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

// add friend modal innehåll som anropar din next route /api/chatUser/addFriend
function AddFriendContent({ onAdded }: { onAdded: () => void | Promise<void> }) {
  const [friendUsername, setFriendUsername] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chatUser/addFriend", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendUsername }),
      });

      if (!res.ok) {
  const text = await res.text();
  console.log("addFriend failed:", res.status, text);
  throw new Error(`HTTP ${res.status}: ${text}`);
}


      setMsg(`Vän '${friendUsername}' har lagts till!`);
      setFriendUsername("");
      await onAdded();
    } catch (e: any) {
      console.error("Add friend error:", e);
      setError(e?.message || "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Friends</h2>

      <form onSubmit={handleAdd} className="addfriend-form">
        <label>
          Användarnamn
          <input
            type="text"
            placeholder="användarnamn"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn-add" disabled={loading}>
          {loading ? "Lägger till..." : "Lägg till"}
        </button>
      </form>

      {msg && <p className="status">{msg}</p>}
      {error && <p className="status">{error}</p>}
    </div>
  );
}