"use client";

import React, { useState } from "react";
import HlsPlayer from "@/components/HlsPlayer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Camera } from "@/types";

interface CameraCardProps {
  camera: Camera;
}

export default function CameraCard({ camera }: CameraCardProps) {
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative w-full rounded-2xl bg-black shadow-lg overflow-hidden">
      <HlsPlayer
        src={camera.url}
        autoPlay={true}
        muted={true}
        controls={false}
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-2xl z-10">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
