import { Search, User, Menu } from "lucide-react";
import { Button } from "./UI/button";
import { Input } from "./UI/input";
import { useState } from "react";

interface StreamingHeaderProps {
  onSearch: (query: string) => void;
}

export function StreamingHeader({ onSearch }: StreamingHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 50);
    });
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              StreamPro
            </h1>

            {/* Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                Home
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                TV Shows
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                Movies
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                New & Popular
              </a>
              <a
                href="#"
                className="text-sm text-white hover:text-gray-300 transition-colors"
              >
                My List
              </a>
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div
              className={`transition-all duration-300 ${searchOpen ? "w-64" : "w-10"}`}
            >
              {searchOpen ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search titles..."
                    className="bg-black/70 border-white/20 text-white pl-10 pr-10"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onBlur={() => !searchQuery && setSearchOpen(false)}
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                      onSearch("");
                    }}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-gray-300"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* User Profile */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-300"
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:text-gray-300"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
