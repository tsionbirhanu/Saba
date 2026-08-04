"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  ApiCartItem,
  getCart,
  getGuestCart,
  getProduct,
  removeCartItem,
  setGuestCart,
  updateCartItem,
} from "@/lib/api-client";

type CartRow = {
  productId: string;
  quantity: number;
  product: ApiCartItem["product"];
};

export default function CartPage() {
  const [items, setItems] = useState<CartRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const isLoggedIn = typeof window !== "undefined" && !!localStorage.getItem("token");

  async function loadCart() {
    setIsLoading(true);
    setStatus("");
    try {
      if (localStorage.getItem("token")) {
        const response = await getCart();
        setItems(response.cart.items);
      } else {
        const guestItems = getGuestCart();
        const products = await Promise.all(guestItems.map((item) => getProduct(item.productId)));
        setItems(
          guestItems.map((item, index) => ({
            productId: item.productId,
            quantity: item.quantity,
            product: products[index],
          }))
        );
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not load cart.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );

  async function changeQuantity(productId: string, quantity: number) {
    const nextQuantity = Math.max(1, quantity);
    if (localStorage.getItem("token")) {
      await updateCartItem(productId, nextQuantity);
    } else {
      setGuestCart(
        getGuestCart().map((item) =>
          item.productId === productId ? { ...item, quantity: nextQuantity } : item
        )
      );
    }
    window.dispatchEvent(new Event("cart-updated"));
    await loadCart();
  }

  async function removeItem(productId: string) {
    if (localStorage.getItem("token")) {
      await removeCartItem(productId);
    } else {
      setGuestCart(getGuestCart().filter((item) => item.productId !== productId));
    }
    window.dispatchEvent(new Event("cart-updated"));
    await loadCart();
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">Review your pieces before checkout.</p>
            </div>
            <Link href="/shop">
              <Button variant="outline" className="bg-transparent">Continue Shopping</Button>
            </Link>
          </div>

          {status && <div className="mb-6 rounded-lg bg-white p-4 text-sm text-gray-700 shadow-sm">{status}</div>}

          {isLoading ? (
            <div className="bg-white rounded-lg p-10 text-center shadow-sm">Loading cart...</div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add products from the shop to start an order.</p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-white">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="bg-white rounded-lg p-4 shadow-sm flex flex-col sm:flex-row gap-4">
                    <Link href={`/products/${item.productId}`} className="relative w-full h-48 sm:w-28 sm:h-28 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.product.image || "/images/dress.jpg"} alt={item.product.name} fill className="object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div>
                          <Link href={`/products/${item.productId}`} className="font-semibold text-gray-900 hover:text-primary">
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-600">{item.product.category?.name}</p>
                        </div>
                        <button onClick={() => removeItem(item.productId)} className="p-2 hover:bg-red-50 rounded-lg" aria-label="Remove item">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeQuantity(item.productId, item.quantity - 1)} className="w-9 h-9 border rounded-lg flex items-center justify-center">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.productId, item.quantity + 1)} className="w-9 h-9 border rounded-lg flex items-center justify-center">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-bold text-gray-900">Br {(item.product.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="bg-white rounded-lg p-6 shadow-sm h-fit">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>Subtotal</span>
                  <span>Br {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-6">
                  <span>Delivery</span>
                  <span>Calculated after confirmation</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>Br {subtotal.toLocaleString()}</span>
                </div>
                {isLoggedIn ? (
                  <Link href="/checkout">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">Checkout</Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">Log in to Checkout</Button>
                  </Link>
                )}
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
