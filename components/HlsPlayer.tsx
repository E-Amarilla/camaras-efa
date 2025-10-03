"use client";

import { useEffect, useRef } from "react";
import type Hls from "hls.js";

type Props = {
  src: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  onLoadedData?: () => void;
  onError?: () => void;
};

export default function HlsPlayer({
  src,
  autoPlay = true,
  muted = true,
  controls = false,
  poster,
  onLoadedData,
  onError,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let hls: Hls | null = null;
    const video = videoRef.current;
    if (!video || !src) return;

    const setup = async () => {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.currentTime = video.duration || 0;
        return;
      }
      const Hls = (await import("hls.js")).default;
      if (Hls.isSupported()) {
        hls = new Hls({ lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (video.readyState > 0) {
            video.currentTime = video.duration || 0;
          }
        });
      }
    };

    setup();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (hls) {
          hls.destroy();
          hls = null;
        }
        if (video) {
          video.src = "";
        }
        setup();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (hls) hls.destroy();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      playsInline
      autoPlay={autoPlay}
      muted={muted}
      controls={controls}
      poster={poster}
      onLoadedData={onLoadedData}
      onError={onError}
      className="w-full h-full object-cover rounded-lg bg-black"
    />
  );
}
