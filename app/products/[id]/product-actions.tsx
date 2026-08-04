"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import { addCartItem, addFavorite, addGuestCartItem } from "@/lib/api-client";

export function ProductActions({
  productId,
  sellerId,
}: {
  productId: string;
  sellerId?: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleFavorite() {
    setIsSaving(true);
    setStatus("");
    try {
      await addFavorite(productId);
      setStatus("Added to favorites.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please log in to favorite this product.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddToCart() {
    setIsSaving(true);
    setStatus("");
    try {
      if (localStorage.getItem("token")) {
        await addCartItem(productId, quantity);
      } else {
        addGuestCartItem(productId, quantity);
      }
      window.dispatchEvent(new Event("cart-updated"));
      setStatus("Added to cart.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Please log in to add this product.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-900 mb-3">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
            type="button"
          >
            -
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100"
            type="button"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <Button
          onClick={handleAddToCart}
          disabled={isSaving}
          className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
        <Button
          onClick={handleFavorite}
          disabled={isSaving}
          variant="outline"
          className="w-full sm:w-auto px-6 py-3 rounded-lg border-gray-300 bg-transparent"
        >
          <Heart className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => navigator.share?.({ title: "Saba product", url: window.location.href })}
          variant="outline"
          className="w-full sm:w-auto px-6 py-3 rounded-lg border-gray-300 bg-transparent"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {status && <p className="mb-6 text-sm text-gray-600">{status}</p>}

      {sellerId && (
        <a href={`/messages?user=${sellerId}`}>
          <Button className="mb-6 w-full bg-primary hover:bg-primary/90 text-white">Contact Seller</Button>
        </a>
      )}
    </>
  );
}
