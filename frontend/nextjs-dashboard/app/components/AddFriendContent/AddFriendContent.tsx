import { useState } from "react";


export default function AddFriendContent({ onAdded }: { onAdded: () => void | Promise<void> }) {
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


      setMsg(`Friend '${friendUsername}' has been added!`);
      setFriendUsername("");
      await onAdded();
    } catch (e: any) {
      console.error("Add friend error:", e);
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Friends</h2>

      <form onSubmit={handleAdd} className="addfriend-form">
        <label>
          Username
          <input
            type="text"
            placeholder="username"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn-add" disabled={loading}>
          {loading ? "adding..." : "add"}
        </button>
      </form>

      {msg && <p className="status">{msg}</p>}
      {error && <p className="status">{error}</p>}
    </div>
  );
}