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
  "talk to human",
  "support",
  "real person"
];
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN_URL || "https://mapa.co.ke";
export default function ChatBotComp({
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
      content: `
You are MapaBot — a smart, friendly assistant for mapa.co.ke, Kenya's real estate and property discovery platform.

Your job is to help users navigate the site, answer questions, and guide them to useful features. Always assume users are referring to mapa.co.ke.

📌 On mapa.co.ke, users can:
- Post and discover property across these categories:
  - New Builds
  - Houses & Apartments for Rent
  - Houses & Apartments for Sale
  - Land & Plots for Rent
  - Land & Plots for Sale
  - Commercial Property for Rent
  - Commercial Property for Sale
  - Event Centres, Venues & Workstations
  - Short Let Property
  - Special Listings
  - Property Services
- View listings on an interactive map
- Use smart tools like boundary drawing and amenity search (schools, roads, hospitals)
- Filter results by location, price, or property type
- Contact sellers directly via phone, chat, or WhatsApp
- Capture and export **digital land beacons** using the **Digital Beacon Tracker**

🛰️ The Digital Beacon Tracker lets users:
- Walk the property boundary and drop GPS beacons
- Manually enter coordinates (e.g. from a title deed)
- Export boundaries as a **QR code**, **GeoJSON**, or **shareable link**
- Improve GPS accuracy by opening Google Maps

When responding:
- Be brief, polite, and helpful
- Give steps or links where appropriate
- Focus on property and land-related help in Kenya
- If unsure, refer to human support

If a user asks to speak to someone or needs human help, respond with:
**"Let me connect you to our human support team at [support@mapa.co.ke](mailto:support@mapa.co.ke) or call +254 769 722 932."**

If the user's request is outside your scope, say:
**"I'm not sure, but our support team can help at [support@mapa.co.ke](mailto:support@mapa.co.ke) or call +254 769 722 932."**

You are always helpful, clear, and aligned with mapa.co.ke's mission: to simplify property discovery and connect real buyers and sellers in Kenya.
`,
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

  const propertyTypes = [
    'house',
    'apartment',
    'plot',
    'maisonette',
    'bungalow',
    'studio',
    'commercial',
    'office',
    'warehouse',
    'land',
    'farmland',
    'ranch',
    'shop',
    'building',
    'hostel',
    'guesthouse',
    'bedsitter',
    'flat',
    'duplex',
    'penthouse',
    'villa',
    'condo',
    'lodging',
    'mansion',
    'room',
    'sublet',
    'carport',
    'go-down',
    'stall',
    'arcade',
    'mall',
    'center',
    'unit',
    'suite',
    'sectional',
    'salon',
    'spa',
    'restaurant',
    'cottage',
    'quarters',
    'resort',
    'camp',
    'tented',
    'gazebo',
    'barn',
    'garage',
    'hall',
    'lounge',
    'rooftop',
    'loft',
    'deck',
    'terrace',
    'enclosure',
    'open space',
    'church space',
    'complex',
    'filling station',
    'pharmacy',
    'plaza',
    'school',
    'showroom',
    'supermarket',
    'terraced duplex',
    'workshop'
  ];

  const services = [
    'agent',
    'contractor',
    'surveyor',
    'valuer',
    'legal',
    'lawyer',
    'manager',
    'service'
  ];
  const transactionTypes = [
    'rent-to-own',
    'rent to own',
    'lease',
    'timeshares',
    'auctions',
    'foreclosures',
    'exchange',
    'swap',
    'distressed',
    'bank',
    'repossessed'
  ];
  const allTypes = [
    ...propertyTypes,
    ...services,
    ...transactionTypes
  ];
  const capitalize = (text: string = '') =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  // Initialize Fuse with your array of keywords
  const fuse = new Fuse(allTypes, {
    includeScore: true,
    threshold: 0.4, // control fuzziness; 0 = exact match, 1 = very fuzzy
  });

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
      const result: any = fuse.search(word);
      if (result.length > 0 && result[0].score < maxScore) {
        maxScore = result[0].score;
        matchedType = result[0].item;
        maxScore = result[0].score;

        if (matchedType) filters.query = matchedType;
      }
    }

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
    const bedMatch = input.match(/(\d+)\s*(bed|bedroom)/i);
    if (bedMatch) filters['bedrooms-Number'] = parseInt(bedMatch[1]);

    const bathMatch = input.match(/(\d+)\s*(bath|bathroom)s?/i);
    if (bathMatch) filters['bathrooms-Number'] = parseInt(bathMatch[1]);

    const toiletMatch = input.match(/(\d+)\s*toilets?/i);
    if (toiletMatch) filters.toilets = parseInt(toiletMatch[1]);

    const possibleFeatures = ['parking', 'tarmac', 'balcony', 'furnished', 'internet'];
    const possibleFacilities = ['gym', 'swimming pool', 'office space', 'backup generator', 'elevator', 'security'];
    const possibleAmenities = ['sewage', 'drainage', 'water', 'electric', 'gas'];
    const features = possibleFeatures.filter(f => input.toLowerCase().includes(f));
    const facilities = possibleFacilities.filter(f => input.toLowerCase().includes(f));
    const amenities = possibleAmenities.filter(a => input.toLowerCase().includes(a));

    if (features.length) filters.features = features;
    if (facilities.length) filters.facilities = facilities;
    if (amenities.length) filters.amenities = amenities;

    // Match units like "1 acre", "250 sqm", etc.
    const sizeMatch = input.match(/(\d+(\.\d+)?)(\s)?(acre|acres|sqm|square meters|sq meters|sq\.?m?)/i);
    if (sizeMatch) {
      const sizeValue = parseFloat(sizeMatch[1]);
      const unit = sizeMatch[4].toLowerCase();

      if (unit.includes("acre")) {
        filters["landSize"] = sizeValue * 4046.86; // 1 acre = 4046.86 sqm
      } else if (unit.includes("sqm") || unit.includes("square")) {
        filters["landSize"] = sizeValue;
      }
    }

    // Match dimensions like "100x50", "80×40"
    const dimensionMatch = input.match(/(\d+)\s*[xX×]\s*(\d+)/);
    if (dimensionMatch) {
      const length = parseInt(dimensionMatch[1]);
      const width = parseInt(dimensionMatch[2]);
      const sqm = length * width;
      filters["landSize"] = sqm;
    }
    return filters;
  };


  const handleListingIntegration = async (userInput: string): Promise<string | null> => {
    const filters = parseFilters(userInput);

    // Must have these two at a minimum
    if (!filters.query || !filters.address) return null;
    console.log(filters);
    try {
      const ads = await getAlldynamicAd({
        page: 1,
        limit: 5,
        queryObject: filters
      });

      const results = ads?.data || [];

      if (results.length === 0) {
        const query = capitalize(filters.query || "");
        const transaction = filters.transaction ? ` for **${filters.transaction}**` : "";
        const address = capitalize(filters.address || "");

        return `No **${query}**s found${transaction} in **${address}** area with the filters provided. Try modifying your request.`;
      }
      const formatted = results
        .map((ad: any, index: number) => {
          const title = ad.data?.title || "Untitled";
          const id = ad._id;
          const price = ad.data?.price ? ` - Price: KES ${ad.data.price.toLocaleString()}` : "";
          const size = ad.data["land-Area(acres)"] ? ` - Size: ${ad.data["land-Area(acres)"]}` : "";

          return `${index + 1}- 🔗 [${title}](${DOMAIN_URL + "?Ad=" + id})${price}${size}`;
        })
        .join("\n");

      return `Here are some ${filters.query}s:\n\n${formatted}`;
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
    //await addDoc(collection(db, "messages"), {
    // uid,
    //recipientUid: AdminId,
    //content: input,
    // createdAt: serverTimestamp(),
    // role: "user",
    // read: 1,
    //});

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

      // await addDoc(collection(db, "messages"), {
      //  uid: AdminId,
      //  recipientUid: uid,
      //  content: replyContent,
      //  createdAt: serverTimestamp(),
      //   role: "assistant",
      //   read: 1,
      //  });

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
  //const getAvatar = (role: string) => {
  //if (role === "user") {
  // return "🧑"; // You can change this to a user image too
  //}

  // Mapa logo for assistant
  // return (
  // <img
  // src="/logo.png"
  //  alt="Mapa Assistant"
  //  className="w-6 h-6 p-1 bg-green-100 rounded-full"
  //  />
  //);
  //};

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

  return (
    <> {isMobile ? (
      // Fullscreen Popover for Mobile
      <div className="fixed h-screen inset-0 z-50 bg-white dark:bg-[#222528] dark:text-gray-100 p-0 flex flex-col">
        <div className="h-screen flex flex-col">
          <div className="bg-green-600 text-white text-sm px-4 py-2 font-medium flex justify-between items-center">
            <span>Chat Assistant</span>
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
                  className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  {msg.role === "assistant" && (
                    <div className="text-xl">{getAvatar(msg.role)}</div>
                  )}
                  <div
                    className={`max-w-[80%] text-sm px-4 py-2 rounded-2xl whitespace-pre-wrap prose prose-sm ${msg.role === "user"
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
              placeholder='Ask about buying, selling, listings, or real estate procedures'
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
    ) : (<div className="fixed bottom-4 right-4 max-w-lg w-full z-50">
      <div className="bg-white rounded-xl shadow-lg flex flex-col h-[90vh] border border-gray-200">
        <div className="bg-green-600 text-white text-sm px-4 py-2 rounded-t-xl font-medium flex justify-between items-center">
          <span>Chat Assistant</span>
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
                className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {msg.role === "assistant" && (
                  <div className="text-xl">{getAvatar(msg.role)}</div>
                )}
                <div
                  className={`max-w-[80%] text-sm px-4 py-2 rounded-2xl whitespace-pre-wrap prose prose-sm ${msg.role === "user"
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
            placeholder='Need help? Search or ask here'
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
