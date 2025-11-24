"use client";
import { useState } from "react";
import "./login.css";
import { useRouter } from "next/navigation";
import CustomButton from "../components/CustomButton/CustomButton";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(false);
  const router = useRouter();

  const login = async () => {
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        setError(errorBody || "Login failed.");
        return;
      }

      setSuccess(true);
      
        alert("Successfully logged in!")
        router.push('/')
      
    } catch (error) {
      setError("Network error: backend unreachable");
    }
  };

  return (
    <main>
      <form>
        <label>Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="checkbox-container">
          <input
            id="remember"
            type="checkbox"
            name="remember"
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label>Remember Me</label>
        </div>

        <CustomButton buttonText={"Login"} onClick={login} />

      </form>
    </main>
  );
}
