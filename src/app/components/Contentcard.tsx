import { Play, Plus, Check, ChevronDown, Star } from "lucide-react";
import { Button } from "./UI/button";
import { Card } from "./UI/card";
import { useState } from "react";
import { ImageWithFallback } from "./Figma/ImageWithFallback";

export interface Content {
  id: number;
  title: string;
  image: string;
  rating: number;
  year: number;
  duration: string;
  genre: string;
  description: string;
  ageRating: string;
  isNew?: boolean;
}

interface ContentCardProps {
  content: Content;
  onPlay: (content: Content) => void;
  onAddToList: (content: Content) => void;
  isInList: boolean;
}

export function ContentCard({
  content,
  onPlay,
  onAddToList,
  isInList,
}: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group relative bg-zinc-900 border-0 overflow-hidden transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <ImageWithFallback
          src={content.image}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* New Badge */}
        {content.isNew && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button on hover */}
        <Button
          size="icon"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100"
          onClick={() => onPlay(content)}
        >
          <Play className="h-6 w-6 text-black fill-black ml-1" />
        </Button>
      </div>

      {/* Expanded Info on Hover */}
      <div
        className={`bg-zinc-900 transition-all duration-300 ${
          isHovered ? "p-4 space-y-3" : "p-3 space-y-2"
        }`}
      >
        <h3 className="font-semibold text-white line-clamp-1">
          {content.title}
        </h3>

        {isHovered && (
          <>
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                className="rounded-full bg-white hover:bg-white/90 w-9 h-9"
                onClick={() => onPlay(content)}
              >
                <Play className="h-4 w-4 text-black fill-black ml-0.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border-2 border-gray-400 hover:border-white text-gray-400 hover:text-white w-9 h-9"
                onClick={() => onAddToList(content)}
              >
                {isInList ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full border-2 border-gray-400 hover:border-white text-gray-400 hover:text-white w-9 h-9 ml-auto"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-500 font-semibold">
                {(content.rating * 10).toFixed(0)}% Match
              </span>
              <span className="px-1.5 py-0.5 border border-gray-500 text-gray-400">
                {content.ageRating}
              </span>
              <span className="text-gray-400">{content.year}</span>
              <span className="text-gray-400">{content.duration}</span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm text-white font-semibold">
                {content.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">/10</span>
            </div>

            {/* Genre */}
            <div className="flex flex-wrap gap-1">
              {content.genre.split(",").map((genre, index) => (
                <span key={index} className="text-xs text-gray-400">
                  {genre.trim()}
                  {index < content.genre.split(",").length - 1 && " •"}
                </span>
              ))}
            </div>
          </>
        )}

        {!isHovered && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span>{content.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{content.year}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
