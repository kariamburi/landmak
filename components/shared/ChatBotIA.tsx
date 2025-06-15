import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AdminId, REGIONS_WITH_AREA } from "@/constants";
import { getAlldynamicAd } from "@/lib/actions/dynamicAd.actions";
import { useMediaQuery } from "react-responsive"; // Detect mobile screens
type SidebarProps = {
  displayName: string;
  uid: string;
  recipientUid: string;
  photoURL: string;
  handleAdEdit: (id: string) => void;
  handleAdView: (id: string) => void;
  handleCategory: (category: string) => void;
  handleOpenSell: () => void;
  handleOpenPlan: () => void;
   onClose: () => void;
};

type Message = {
  id?: string;
  uid?: string;
  recipientUid?: string;
  content: string;
  createdAt?: any;
  role: "user" | "assistant" | "system";
  read?: number;
};
const humanHelpPhrases = [
  "need further assistance",
  "i want to talk to a human",
  "can i speak to an agent",
  "can i talk to someone",
  "i need to contact support",
  "talk to a real person",
  "connect me to a person",
  "i need human help",
  "get help from human",
  "speak to customer care",
  "need customer support",
  "how can i contact you",
  "give me your contact",
  "can i call you",
  "can i email you",
  "i want to reach out",
  "i want to talk to someone",
];
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://mapa.co.ke";
export default function ChatBotIA({
  uid,
  photoURL,
  displayName,
  recipientUid,
  handleAdEdit,
  handleAdView,
  handleCategory,
  handleOpenSell,
  handleOpenPlan,
  onClose,
}: SidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content:
        "You are a helpful assistant for mapa.co.ke. Help users find land, houses, or products for sale in Kenya. Be brief and clear.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastSent, setLastSent] = useState(0);
  const isMobile = useMediaQuery({ maxWidth: 768 }); // Detect mobile screens
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);




const handleListingIntegration = async (userInput: string): Promise<string | null> => {
 // If humanInput provided instead of structured queryObject
   const systemPrompt = `
You are a parser that converts user search queries into a JSON object of filters.
Fields available:
- query: property type or subcategory (e.g. "maisonette", "studio apartment")
- transaction: "rent" or "sale"
- price: string in format min-max (numbers only)
- bedrooms: integer number of bedrooms
- features: array of keywords (e.g. ["tarmac"])
- amenities: array of keywords (e.g. ["wifi", "pool"])
- facilities: array of keywords (e.g. ["gym", "parking"])
- address: area or region name
Return only valid JSON.`;
  const userPrompt = userInput;
 const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: userPrompt }
    ] }),
    });

    const data = await res.json();
  let aiFilters: Record<string, any>;
  try {
    aiFilters = JSON.parse(data.reply);
  } catch {
    return null;
  }

  // Must have these two at a minimum
  if (!aiFilters.query || !aiFilters.address) return null;

  // 👉 Remove all null/undefined/empty-array fields
  const queryObject = Object.fromEntries(
    Object.entries(aiFilters).filter(([_, v]) => {
      if (v == null) return false;                    // removes null or undefined
      if (Array.isArray(v) && v.length === 0) return false;  // removes empty arrays
      return true;
    })
  );
 
  try {
    const ads = await getAlldynamicAd({
      page: 1,
      limit: 5,
      queryObject,
    });

    const results = ads?.data || [];

    if (results.length === 0) {
      return `No ${aiFilters.query}s found in that area with the filters provided. Try modifying your request.`;
    }

    const formatted = results
  .map((ad: any, index: number) => {
    const title = ad.data?.title || "Untitled";
    const id = ad._id;
    const price = ad.data?.price ? ` - Price: KES ${ad.data.price}` : "";
    const size = ad.data?.size ? ` - Size: ${ad.data.size}` : "";

    return `${index + 1}- [${title}](${DOMAIN_URL + "?Ad=" + id})${price}${size}`;
  })
  .join("\n");

    return `Here are some ${aiFilters.query}s:\n\n${formatted}`;
  } catch (error) {
    console.error("Error fetching ads:", error);
    return "Something went wrong while fetching listings.";
  }
};
const sendMessage = async () => {
  if (!input.trim()) return;

  if (input.length > 300) {
    alert("Message too long (limit: 300 characters)");
    return;
  }

  const now = Date.now();
  if (now - lastSent < 5000) {
    alert("Please wait a few seconds before sending another message.");
    return;
  }

  setLastSent(now);

  const newUserMessage: Message = { role: "user", content: input };
  const newMessages: Message[] = [...messages, newUserMessage];
  setMessages(newMessages);

  // Save user's message to Firestore
  await addDoc(collection(db, "messages"), {
    uid,
    recipientUid: AdminId,
    content: input,
    createdAt: serverTimestamp(),
    role: "user",
    read: 1,
  });

  setInput("");
  setLoading(true);

  // Check if user is asking for human help
  const needsHuman = humanHelpPhrases.some(phrase =>
    input.toLowerCase().includes(phrase)
  );

  if (needsHuman) {
    const humanResponse: Message = {
      role: "assistant",
      content: `Sure! You can reach a mapa human agent at:\n📞 Phone: [+254 769 722932](tel:+254769722932)\n📧 Email: [support@mapa.co.ke](mailto:support@mapa.co.ke)`,
    };

    setMessages([...newMessages, humanResponse]);
    setLoading(false);
    return;
  }

  // 🧠 Try dynamic listing integration logic
  try {
  const integrationResponse = await handleListingIntegration(input);
if (integrationResponse) {
  const assistantMsg: Message = { role: "assistant", content: integrationResponse };
  setMessages([...newMessages, assistantMsg]);
  setLoading(false);
  return;
}
  } catch (error) {
    console.error("Listing integration error:", error);
  }

  // 🤖 Fall back to normal AI response
  try {
    const systemMessage = messages.find((m) => m.role === "system");
const recentMessages = [
  systemMessage!,
  ...newMessages
    .filter((m) => m.role !== "system")
    .slice(-6), // Keep only the last 6 (you can tune this number)
];
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: recentMessages }),
    });

    const data = await res.json();
    const replyContent = data.reply || "I couldn't respond.";

    await addDoc(collection(db, "messages"), {
      uid: AdminId,
      recipientUid: uid,
      content: replyContent,
      createdAt: serverTimestamp(),
      role: "assistant",
      read: 1,
    });

    setMessages([...newMessages, { role: "assistant", content: replyContent }]);
  } catch (err) {
    console.error("Chat API error:", err);
    setMessages([
      ...newMessages,
      { role: "assistant", content: "Something went wrong. Please try again." },
    ]);
  }

  setLoading(false);
};


 // const getAvatar = (role: string) => (role === "user" ? "🧑" : "🤖");
 const getAvatar = (role: string) => (role === "user" ? "🧑" : "🤖");
const combineMessages = (a: Message[], b: Message[]) => {
  const combined = [...a, ...b];
  const unique = new Map<string, Message>();
  for (const msg of combined) {
    if (msg.id) unique.set(msg.id, msg);
  }
  return Array.from(unique.values()).sort((a, b) =>
  (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0)
);
 // return [...unique.values()].sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
};
  useEffect(() => {
  const senderMessagesQuery = query(
    collection(db, "messages"),
    where("uid", "==", uid),
    where("recipientUid", "==", recipientUid),
    orderBy("createdAt", "asc"),
    limit(50)
  );

  const recipientMessagesQuery = query(
    collection(db, "messages"),
    where("uid", "==", recipientUid),
    where("recipientUid", "==", uid),
    orderBy("createdAt", "asc"),
    limit(50)
  );

  const unsubscribeSender = onSnapshot(senderMessagesQuery, (snapshot) => {
    const senderMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Message),
    }));
    setMessages((prev) => combineMessages(prev, senderMessages));
  });

  const unsubscribeRecipient = onSnapshot(recipientMessagesQuery, (snapshot) => {
    const recipientMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Message),
    }));
    setMessages((prev) => combineMessages(prev, recipientMessages));
  });

  return () => {
    unsubscribeSender();
    unsubscribeRecipient();
  };
}, [uid, recipientUid]);

  return (<> {isMobile  ? (
              // Fullscreen Popover for Mobile
      <div className="fixed h-screen inset-0 z-50 bg-white dark:bg-[#222528] dark:text-gray-100 p-0 flex flex-col">
        <div className="h-screen flex flex-col">
           <div className="bg-green-700 text-white text-sm px-4 py-2 font-medium flex justify-between items-center">
        <span>Mapa Chat Assistant</span>
        <button
          onClick={() => onClose()}
          className="text-white hover:text-gray-300 text-lg"
        >
          &times;
        </button>
      </div>


        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages
            .filter((m) => m.role !== "system")
            .map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="text-xl">{getAvatar(msg.role)}</div>
                )}
                <div
                  className={`max-w-[80%] text-sm px-4 py-2 rounded-2xl whitespace-pre-wrap prose prose-sm ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.role === "user" && (
                  <div className="text-xl">{getAvatar(msg.role)}</div>
                )}
              </div>
            ))}

          {loading && (
            <div className="text-gray-500 text-xs italic">Assistant is typing...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2 border-t px-3 py-2">
          <input
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Ask about listings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-full disabled:opacity-50"
          >
            Send
          </button>
        </div>
        </div>
          </div>
  ):(<div className="fixed bottom-4 right-4 max-w-sm w-full z-50">
      <div className="bg-white rounded-xl shadow-lg flex flex-col h-[500px] border border-gray-200">
         <div className="bg-green-700 text-white text-sm px-4 py-2 rounded-t-xl font-medium flex justify-between items-center">
        <span>Mapa Chat Assistant</span>
        <button
          onClick={() => onClose()}
          className="text-white hover:text-gray-300 text-lg"
        >
          &times;
        </button>
      </div>


        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages
            .filter((m) => m.role !== "system")
            .map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="text-xl">{getAvatar(msg.role)}</div>
                )}
                <div
                  className={`max-w-[80%] text-sm px-4 py-2 rounded-2xl whitespace-pre-wrap prose prose-sm ${
                    msg.role === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                {msg.role === "user" && (
                  <div className="text-xl">{getAvatar(msg.role)}</div>
                )}
              </div>
            ))}

          {loading && (
            <div className="text-gray-500 text-xs italic">Assistant is typing...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2 border-t px-3 py-2">
          <input
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Ask about listings..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-full disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )}
  </>);
}
