"use client";

import { useEffect, useState, useRef } from "react";

interface TikTokEmbedProps {
  videoUrl: string;
}

function extractTikTokInfo(url: string) {
  const regex = /tiktok\.com\/@([\w.-]+)\/video\/(\d+)/;
  const match = url.match(regex);
  return match ? { username: match[1], videoId: match[2] } : null;
}

const TikTokEmbed = ({ videoUrl }: TikTokEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const result = extractTikTokInfo(videoUrl);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`);
        const data = await response.json();
        if (data?.thumbnail_url) {
          setThumbnail(data.thumbnail_url);
          setEmbedHtml(data.html);
        }
      } catch (error) {
        console.error("Failed to fetch TikTok thumbnail:", error);
      }
    };

    fetchThumbnail();
  }, [videoUrl]);

  useEffect(() => {
    if (isPlaying && containerRef.current) {
      // Clear previous embeds if any
      containerRef.current.innerHTML = "";

      // Create a blockquote for TikTok
      const blockquote = document.createElement("blockquote");
      blockquote.className = "tiktok-embed h-[580px]";
      blockquote.setAttribute("cite", videoUrl);
      blockquote.setAttribute("data-video-id", result?.videoId || "");

      const section = document.createElement("section");
      const link = document.createElement("a");
      link.href = videoUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerText = `@${result?.username}`;
      section.appendChild(link);
      blockquote.appendChild(section);

      containerRef.current.appendChild(blockquote);

      // Load TikTok script
      const script = document.createElement("script");
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      scriptRef.current = script;
      document.body.appendChild(script);
    }

    return () => {
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [isPlaying, videoUrl]);

  return (
    <div className="relative w-full">
      {!isPlaying ? (
        <div className="relative cursor-pointer" onClick={() => setIsPlaying(true)}>
          {thumbnail ? (
            <div className="items-center justify-center w-full flex">
              <img src={thumbnail} alt="TikTok Thumbnail" className="w-[300px] h-[580px] rounded-lg" />
            </div>
          ) : (
            <div className="w-full h-60 bg-black flex items-center justify-center rounded-lg">
              Loading...
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
            <button className="p-4 bg-red rounded-full shadow-lg">▶️ Play</button>
          </div>
        </div>
      ) : (
        <div ref={containerRef} />
      )}
    </div>
  );
};

export default TikTokEmbed;
