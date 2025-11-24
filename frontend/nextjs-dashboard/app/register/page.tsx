"use client";
import { useRouter } from "next/navigation";
import "./register.css";
import { useState } from "react";
import CustomButton from "../components/CustomButton/CustomButton";


export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();


  const register = async () => {
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        setError(errorBody || "register failed.");
        return;
      }

      setSuccess(true);

        alert("Successfully logged in!")
        router.push('/login')

    

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
        <CustomButton buttonText={"Register"} onClick={register} />

      </form>
    </main>
  );
}
