//import { broadcastMessage } from "@/lib/actions/broadcast.actions";
import { broadcastMessage } from "@/lib/actions/broadcast.actions";
import React, { useState } from "react";

function BroadcastMessage() {
  const [type, setType] = useState("email"); // 'email' or 'sms'
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSend = async () => {
    if (!message) {
      alert("Please enter a message.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const data = await broadcastMessage(type, message);
      if (data) {
        setResponse(data.message);
        setMessage('');
      } else {
        setResponse("Failed to send messages.");
      }
    } catch (error) {
      setResponse("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-1 lg:p-4 rounded shadow">
      <div className="mb-4">
        <label className="block text-xs mb-2 font-medium">Message Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="dark:text-gray-100 dark:bg-[#2D3236] text-xs bg-white w-full p-2 border rounded"
        >
          <option value="email">Email</option>
          <option value="sms">Notification</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-xs font-medium">Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 text-sm dark:bg-[#2D3236] bg-white border rounded"
        />
      </div>
      <button
        onClick={handleSend}
        className="bg-black text-xs text-white hover:bg-gray-600 
    hover:dark:bg-emerald-700 dark:bg-emerald-800 px-4 py-2 rounded hover:bg-gray-700"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
      {response && <div className="mt-4 text-xs text-green-600">{response}</div>}
    </div>
  );
}

export default BroadcastMessage;
