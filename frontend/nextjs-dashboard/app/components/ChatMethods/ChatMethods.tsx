import { sendMessage } from "@/app/websocket";
import { useRouter } from "next/navigation";
import { useState } from "react";







export function useChatMethods(){
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const router = useRouter();

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

     // kanske inte behövs
    router.push("/login") 
    
    router.refresh()
    

    } catch (error) {
        console.log(error)
        setError("Network error: backend unreachable");
    }
  };
  return {logout}
}

export const handleSubmit =
(body: string, receiver: string) =>
(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(body, receiver)
};
