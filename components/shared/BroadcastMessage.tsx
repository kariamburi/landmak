//import { broadcastMessage } from "@/lib/actions/broadcast.actions";
import { broadcastMessage } from "@/lib/actions/broadcast.actions";
import Select from "react-select";
import React, { useState } from "react";

function BroadcastMessage({
  contacts,
}: {
  contacts: any;
}) {
  const [type, setType] = useState("email"); // 'email' or 'sms'
  const [message, setMessage] = useState("");
  const [recipientId, setRecipientId] = useState("all"); // 'all' or user._id
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const options = contacts.data.map((user: any) => ({
    value: user._id,
    label: `${user.firstName} ${user.lastName} ${user.phone} (${user.email})`,
  }));

  const handleSend = async () => {
    if (!message) {
      alert("Please enter a message.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      // Find the selected user if not sending to all
      const recipient =
        recipientId !== "all" ? contacts.data.find((c:any) => c._id === recipientId) : null;
    
      const data:any = await broadcastMessage(type, message, recipient); // pass user or null for all
      setResponse(data?.message || "Failed to send messages.");
      setMessage("");
    } catch (error) {
      setResponse("An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: 'white',
      color: 'black',
      borderColor: '#ccc',
      fontSize: '0.75rem',
      padding: '0.25rem',
      ...(state.selectProps.menuIsOpen && {
        borderColor: '#666',
      }),
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#fff',
      fontSize: '0.75rem',
      zIndex: 20,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
      color: 'black',
      padding: '8px 12px',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'black',
    }),
  };
  
  // Dark mode support (Tailwind-compatible)
  const darkModeStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: '#2D3236',
      color: '#f3f4f6',
      borderColor: '#555',
      fontSize: '0.75rem',
      padding: '0.25rem',
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#2D3236',
      fontSize: '0.75rem',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? '#3B4044' : '#2D3236',
      color: '#f3f4f6',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#f3f4f6',
    }),
      input: (base: any) => ({
    ...base,
    color: '#f3f4f6',
  }),
  };
  
  //const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('light');
  return (
    <div className="p-1 lg:p-4 rounded shadow">
    <div className="mb-4">
      <label className="block text-xs mb-2 font-medium">Send To:</label>
      <Select
   // styles={isDark ? darkModeStyles : customStyles}
    className="text-xs"
    classNamePrefix="react-select"
  options={[{ value: "all", label: "All Users" }, ...options]}
  onChange={(selectedOption) => setRecipientId(selectedOption?.value || "")}
  placeholder="Select a user..."
  isSearchable
/>
    </div>

    <div className="mb-4">
      <label className="block text-xs mb-2 font-medium">Message Type:</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="text-xs w-full p-2 border rounded dark:text-gray-100 dark:bg-[#2D3236] bg-white"
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
    hover:dark:bg-emerald-700 dark:bg-emerald-800 px-4 py-2 rounded"
      disabled={loading}
    >
      {loading ? "Sending..." : "Send"}
    </button>

    {response && <div className="mt-4 text-xs text-green-600">{response}</div>}
  </div>
  );
}

export default BroadcastMessage;
