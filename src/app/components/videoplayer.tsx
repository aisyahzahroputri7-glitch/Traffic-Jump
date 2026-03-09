import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Plus,
  Check,
} from "lucide-react";
import { Dialog, DialogContent } from "./UI/dialog";
import { Button } from "./UI/button";
import { useState } from "react";
import { type Content } from "./Contentcard";
import { ImageWithFallback } from "./Figma/ImageWithFallback";

interface VideoPlayerProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToList: (content: Content) => void;
  isInList: boolean;
}

export function VideoPlayer({
  content,
  isOpen,
  onClose,
  onAddToList,
  isInList,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 bg-black border-0 overflow-hidden">
        <div className="relative">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Video Area */}
          <div className="relative aspect-video bg-black">
            <ImageWithFallback
              src={content.image}
              alt={content.title}
              className="w-full h-full object-cover"
            />

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
              {/* Center Play Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-4 border-white"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-10 w-10 text-white fill-white" />
                ) : (
                  <Play className="h-10 w-10 text-white fill-white ml-1" />
                )}
              </Button>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <span className="text-white text-sm">0:00 / 2:28:00</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Info */}
          <div className="bg-zinc-900 p-8 space-y-6">
            {/* Title and Actions */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {content.title}
                </h2>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-500 font-semibold">
                    {(content.rating * 10).toFixed(0)}% Match
                  </span>
                  <span className="text-gray-400">{content.year}</span>
                  <span className="px-2 py-0.5 border border-gray-500 text-gray-400">
                    {content.ageRating}
                  </span>
                  <span className="text-gray-400">{content.duration}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border-2 border-gray-400 hover:border-white text-gray-400 hover:text-white"
                onClick={() => onAddToList(content)}
              >
                {isInList ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-base leading-relaxed">
              {content.description}
            </p>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <div>
                <span className="text-gray-500">Genre: </span>
                <span className="text-white">{content.genre}</span>
              </div>
              <div>
                <span className="text-gray-500">Rating: </span>
                <span className="text-yellow-500 font-semibold">
                  {content.rating.toFixed(1)}/10
                </span>
              </div>
            </div>

            {/* Cast & Crew Placeholder */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Cast</h3>
              <div className="text-gray-400 text-sm">
                Featured actors and crew information would appear here
              </div>
            </div>

            {/* Similar Content Placeholder */}
            <div className="space-y-2 pt-4">
              <h3 className="text-lg font-semibold text-white">
                More Like This
              </h3>
              <div className="text-gray-400 text-sm">
                Similar content recommendations would appear here
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
