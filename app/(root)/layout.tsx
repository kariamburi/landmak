import { auth } from "@clerk/nextjs/server";
import { SignedIn } from "@clerk/nextjs";
import ReceiveChat from "@/components/shared/ReceiveChat";
import FCMTokenProvider from "@/components/shared/FCMTokenProvider";
import PresenceProvider from "@/components/shared/PresenceProvider";
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  return <main className="flex-1">
      {/* Only load WebSocket listener if user is signed in */}
      <SignedIn>
       <PresenceProvider  userId={userId}/>
        <FCMTokenProvider userId={userId}/>
      </SignedIn>
    {children}</main>;
}
