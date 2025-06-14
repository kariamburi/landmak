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
import { title } from "process";
import Fuse from "fuse.js";
import nlp from 'compromise';
import { aiParseFilters } from "@/lib/actions/openai";
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

export default function ChatBot({
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


const [data, setAds] = useState<any[]>([]);
const [errorMsg, setErrorMsg] = useState<string | null>(null);


const types = [
  'house',
  'plot',
  'apartment',
  'maisonette',
  'bungalow',
  'studio',
  'commercial',
  'office',
  'warehouse',
  'land',
  'farm land',
  'ranch',
  'vacation rental',
  'short let',
  'shop',
  'building',
  'hostel',
  'guesthouse',
];

// Initialize Fuse with your array of keywords
const fuse = new Fuse(types, {
  includeScore: true,
  threshold: 0.4, // control fuzziness; 0 = exact match, 1 = very fuzzy
});

// Example usage:
function fuzzySearchType(input: string) {
  const result = fuse.search(input);
  return result.length ? result[0].item : null;
}
function parseCurrencyToNumber(input: string): number {
  const match = input.trim().toLowerCase().match(/^([\d,.]+)\s*(m|million|k)?$/);

  if (!match) return NaN;

  const value = parseFloat(match[1].replace(/,/g, ""));
  const unit = match[2];

  if (unit === 'm' || unit === 'million') return value * 1_000_000;
  if (unit === 'k') return value * 1_000;
  return value;
}
const parseFilters = (input: string) => {
  const doc = nlp(input);
  const filters: any = {};

 // Flatten all regions and areas, then tag them as 'Place'
  const allPlaces = REGIONS_WITH_AREA.flatMap(({ region, area }) => [region, ...area]);
  allPlaces.forEach(place => {
    doc.match(place).tag('Place');
  });

  // 📍 Location: Match either region or area
  const locMatch =
    doc.match('in [#Place+]')?.terms(1).text() ||
    input.match(/in\s+([a-zA-Z\s]+)/i)?.[1];

  if (locMatch) {
    filters.address = locMatch.trim();
  }
  

  const words = input.toLowerCase().split(/\s+/);
  
  // Fuzzy match against your list of types
  let matchedType = '';
let maxScore = 1;

for (const word of words) {
  const result:any = fuse.search(word);
  if (result.length > 0 && result[0].score < maxScore) {
    maxScore = result[0].score;
    matchedType = result[0].item;
    maxScore = result[0].score;

    if (matchedType) filters.query = matchedType;
  }
}

  //const types = ['house', 'plot','apartment', 'maisonette', 'bungalow', 'studio'];
 // const typeMatch = types.find(t => input.toLowerCase().includes(t));
 // if (typeMatch) filters.query = typeMatch;
 
  const priceMatch = input.match(/(?:under|below|less than|upto|between|from)?\s*([\d,.]+\s*(million|m|k)?)(?:\s*(and|to|-)\s*([\d,.]+\s*(million|m|k)?))?/i);

if (priceMatch) {
  const minStr = priceMatch[1];
  const maxStr = priceMatch[4];

  if (minStr && maxStr) {
    // Range (e.g. "between 2M and 5M")
    filters.price = `\${parseCurrencyToNumber(minStr)}-\${parseCurrencyToNumber(maxStr)}`;
  } else {
    // Single upper limit (e.g. "below 5M")
    filters.price = `0-${parseCurrencyToNumber(minStr)}`;
  }
}
 const lower = input.toLowerCase();
  if (/\b(for\s+rent|rent)\b/.test(lower)) {
    filters.transaction = "rent";
  } else if (/\b(for\s+sale|sale|sell|buy)\b/.test(lower)) {
    filters.transaction = "sale";
  }
  //const bedMatch = input.match(/(\d+)\s*(bed|bedroom)/i);
  //if (bedMatch) filters.bedrooms = parseInt(bedMatch[1]);

  //const possibleFeatures = ['parking', 'tarmac', 'balcony', 'furnished', 'internet'];
  //const features = possibleFeatures.filter(f => input.toLowerCase().includes(f));
  //if (features.length) filters.features = { $in: features };

  return filters;
};


const handleListingIntegration = async (userInput: string): Promise<string | null> => {
  //const filters = parseFilters(userInput);
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
      .map((ad: any, index: number) =>
        `${index + 1}- [${ad.data.title}](${process.env.NEXT_PUBLIC_DOMAIN_URL + "?Ad=" + ad._id})`
      )
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
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
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


  const getAvatar = (role: string) => (role === "user" ? "🧑" : "🤖");

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
      setMessages((prev) =>
        [
          ...prev.filter((msg) => msg.uid !== uid),
          ...senderMessages,
        ].sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
      );
    });

    const unsubscribeRecipient = onSnapshot(recipientMessagesQuery, (snapshot) => {
      const recipientMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Message),
      }));
      setMessages((prev) =>
        [
          ...prev.filter((msg) => msg.uid !== recipientUid),
          ...recipientMessages,
        ].sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0))
      );
    });

    return () => {
      unsubscribeSender();
      unsubscribeRecipient();
    };
  }, [uid, recipientUid]);

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full z-50">
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
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
  );
}
