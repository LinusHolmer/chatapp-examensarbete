"use client";

import { useState } from "react";
import "../ui/global.css";

export default function AddFriendsPage() {
  //usestate hookar för att spara data
  const [username, setUsername] = useState(""); // lagrar det som användaren skriver i fältet
  const [msg, setMsg] = useState<string | null>(null); // används för att visa att användare har lagts till

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault(); // inte ladda om sidan när formulärt skickas
    setMsg(`Vän '${username}' har lagts till!`);
    setUsername(""); // tömmer fältet efter att man lagt till
  };

  return (
    <main className="add-friends-page">
      <h1>Lägg till vänner</h1>

      <form onSubmit={handleAdd} className="addfriend-form">
        <label>
          Användarnamn
          <input
            type="text"
            placeholder="användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // uppdaterar state varje gång användaren skriver något
            required
          />
        </label>

        <button type="submit" className="btn-add">
          Lägg till
        </button>
      </form>

      {msg && <p className="status">{msg}</p>}
    </main>
  );
}
