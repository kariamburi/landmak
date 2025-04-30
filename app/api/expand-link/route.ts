import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { shortUrl } = await req.json();
        if (!shortUrl) return NextResponse.json({ error: "Missing shortUrl" }, { status: 400 });

        const response = await fetch(shortUrl, { method: "HEAD", redirect: "follow" });
        console.log(response)
        return NextResponse.json({ expandedUrl: response.url });
    } catch (error) {
        console.error("Failed to expand URL:", error);
        return NextResponse.json({ error: "Failed to expand URL" }, { status: 500 });
    }
}
