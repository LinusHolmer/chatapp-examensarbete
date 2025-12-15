export const addFriend = async (friendUsername: string) => {
  try {
    const res = await fetch("/api/chatUser/addFriend", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendUsername }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

  } catch (error) {
    console.error("Add friend failed:", error);
  }
};
