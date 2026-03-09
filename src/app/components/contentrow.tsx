import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./UI/button";
import { ContentCard, type Content } from "./Contentcard";
import { useRef, useState } from "react";

interface ContentRowProps {
  title: string;
  contents: Content[];
  onPlay: (content: Content) => void;
  onAddToList: (content: Content) => void;
  myList: Set<number>;
}

export function ContentRow({
  title,
  contents,
  onPlay,
  onAddToList,
  myList,
}: ContentRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="relative group/row px-4 lg:px-8 mb-8">
      {/* Title */}
      <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4">
        {title}
      </h2>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white rounded-full w-12 h-12 opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}

        {/* Content Grid */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-2 lg:gap-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {contents.map((content) => (
            <div
              key={content.id}
              className="flex-none w-[45%] sm:w-[30%] lg:w-[23%] xl:w-[18%]"
            >
              <ContentCard
                content={content}
                onPlay={onPlay}
                onAddToList={onAddToList}
                isInList={myList.has(content.id)}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black/90 text-white rounded-full w-12 h-12 opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>
    </div>
  );
}
