"use client";
import "./logout.css";
import { useState } from "react";

export default function LogoutPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);


  const logout = async () => {
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        setError(errorBody || "logout failed.");
        return;
      }

      setSuccess(true);

      

    } catch (error) {
      setError("Network error: backend unreachable");
    }
  };

  return (
    <main>
        <button onClick={logout} type="button">
          logout
        </button>
 
    </main>
  );
}
