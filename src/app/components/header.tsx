import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "./UI/button";
import { Input } from "./UI/input";
import { Badge } from "./UI/badge";

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export function Header({
  cartItemCount,
  onCartClick,
  onSearchChange,
  searchQuery,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ShopHub
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 border-purple-100 focus:border-purple-300 focus:ring-purple-200"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Cart Button */}
          <Button
            variant="outline"
            size="icon"
            className="relative border-purple-200 hover:bg-purple-50 hover:border-purple-300"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-5 w-5 text-purple-600" />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 border-none">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="pb-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 border-purple-100 focus:border-purple-300 focus:ring-purple-200"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
