import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export interface videoProps {
  videoUrl: string;
}

const youtubeRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

function extractYouTubeVideoId(url: string) {
  const match = url.match(youtubeRegex);
  return match?.[1] || null;
}

const YouTubePlayer = ({ videoUrl }: videoProps) => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const playerInstance = useRef<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const videoId = extractYouTubeVideoId(videoUrl);

  useEffect(() => {
    // Load script only once
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);

      window.onYouTubeIframeAPIReady = () => {
        setScriptLoaded(true);
      };
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !videoId || !playerRef.current) return;

    // Clean up previous player if it exists
    if (playerInstance.current) {
      playerInstance.current.destroy();
    }

    // Create new player
    playerInstance.current = new window.YT.Player(playerRef.current, {
      height: "360",
      width: "100%",
      videoId: videoId,
      playerVars: {
        rel: 0,
      },
      events: {
        onReady: () => {},
      },
    });

    return () => {
      // Clean up when component unmounts
      if (playerInstance.current) {
        playerInstance.current.destroy();
      }
    };
  }, [scriptLoaded, videoId]);

  return <div ref={playerRef} className="rounded-xl" />;
};

export default YouTubePlayer;
