import { Play, Info, Volume2, VolumeX } from "lucide-react";
import { Button } from "./UI/button";
import { useState } from "react";
import { ImageWithFallback } from "./Figma/ImageWithFallback";

interface HeroSectionProps {
  title: string;
  description: string;
  image: string;
  onPlayClick: () => void;
  onInfoClick: () => void;
}

export function HeroSection({
  title,
  description,
  image,
  onPlayClick,
  onInfoClick,
}: HeroSectionProps) {
  const [muted, setMuted] = useState(true);

  return (
    <div className="relative h-[80vh] lg:h-[90vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl space-y-6 pb-20">
          {/* Title */}
          <h1 className="text-4xl lg:text-7xl font-bold text-white drop-shadow-2xl">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base lg:text-xl text-gray-200 line-clamp-3 drop-shadow-lg">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-black font-semibold px-8 text-lg"
              onClick={onPlayClick}
            >
              <Play className="h-6 w-6 mr-2 fill-black" />
              Play
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-gray-500/70 hover:bg-gray-500/50 text-white font-semibold px-8 backdrop-blur-sm text-lg"
              onClick={onInfoClick}
            >
              <Info className="h-6 w-6 mr-2" />
              More Info
            </Button>
          </div>

          {/* Additional Info */}
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span className="px-2 py-1 border border-gray-400 text-gray-300">
              16+
            </span>
            <span>2023</span>
            <span>2h 28m</span>
            <span className="px-2 py-1 bg-red-600/80 backdrop-blur-sm">
              Trending #1
            </span>
          </div>
        </div>
      </div>

      {/* Mute Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-24 right-8 lg:right-16 text-white border-2 border-white/50 rounded-full w-12 h-12 hover:bg-white/20"
        onClick={() => setMuted(!muted)}
      >
        {muted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
