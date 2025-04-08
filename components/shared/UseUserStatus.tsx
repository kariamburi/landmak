import { getDatabase, ref, onValue, off } from "firebase/database";
import { useEffect, useState } from "react";
import { app } from "@/lib/firebase";

interface SettingsProp {
  userId: string;
}
const UseUserStatus = ({userId}: SettingsProp) => {
 const [status, setStatus] = useState<"online" | "offline" | null>(null);

  useEffect(() => {
    if (!userId) return;
 
    const db = getDatabase(app);
    const statusRef = ref(db, `/status/${userId}`);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      setStatus(data?.state || "offline");
    });

    return () => off(statusRef, "value", unsubscribe);
  }, [userId]);

  return (
    <div className="text-xs">
   {status === "online" ? "🟢" : "⚪"}
    </div>
  );
};

export default UseUserStatus;
