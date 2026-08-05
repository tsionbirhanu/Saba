"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Minus, Plus, Share2, ShoppingCart } from "lucide-react";
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
      <div className="mb-5 rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-sm font-semibold text-gray-900">Quantity</label>
          <div className="inline-flex w-fit items-center rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
              type="button"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-12 text-center text-sm font-semibold text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100"
              type="button"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-[1fr_auto_auto] gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={isSaving}
          className="h-12 w-full bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </Button>
        <Button
          onClick={handleFavorite}
          disabled={isSaving}
          variant="outline"
          className="h-12 w-12 rounded-lg border-gray-300 bg-white p-0"
          aria-label="Add to favorites"
        >
          <Heart className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => navigator.share?.({ title: "Saba product", url: window.location.href })}
          variant="outline"
          className="h-12 w-12 rounded-lg border-gray-300 bg-white p-0"
          aria-label="Share product"
        >
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {sellerId && (
        <a href={`/messages?user=${sellerId}`} className="block">
          <Button variant="outline" className="mb-3 h-11 w-full rounded-lg border-gray-300 bg-white font-semibold">
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Seller
          </Button>
        </a>
      )}

      {status && <p className="mb-6 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">{status}</p>}
    </>
  );
}
