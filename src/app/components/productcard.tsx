import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "./UI/button";
import { Card, CardContent, CardFooter } from "./UI/card";
import { Badge } from "./UI/badge";
import { ImageWithFallback } from "./Figma/ImageWithFallback";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: number) => void;
  isFavorite: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-300 border-purple-100 bg-white">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
          onClick={() => onToggleFavorite(product.id)}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </Button>
        {!product.inStock && (
          <Badge className="absolute top-3 left-3 bg-gray-900/90 text-white border-none shadow-lg backdrop-blur-sm">
            Out of Stock
          </Badge>
        )}
      </div>

      <CardContent className="p-5">
        <div className="text-xs uppercase tracking-wider text-purple-600 font-semibold mb-2">
          {product.category}
        </div>
        <h3 className="font-semibold mb-3 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          ${product.price.toFixed(2)}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300"
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}
