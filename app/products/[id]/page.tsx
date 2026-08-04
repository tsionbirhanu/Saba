import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RatingSummary } from "@/components/rating-summary";
import { AiStyleAssistant } from "@/components/ai-style-assistant";
import { VerifiedDesignerBadge } from "@/components/verified-designer-badge";
import { getProduct, getProducts, getReviews } from "@/lib/api-client";
import { ProductActions } from "./product-actions";
import { ProductReviewForm } from "./product-review-form";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id).catch(() => null);

  if (!product) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-white">Back to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const relatedProducts = await getProducts({
    categoryId: product.category.id,
    sort: "newest",
  })
    .then((products) => products.filter((item) => item.id !== product.id).slice(0, 4))
    .catch(() => []);
  const reviewResponse = await getReviews(product.id).catch(() => ({
    reviews: [],
    summary: product.reviewSummary || { averageRating: 0, reviewCount: 0 },
  }));

  const orderCount = product._count?.orders || 0;
  const favoriteCount = product._count?.favorites || 0;
  const reviewCount = reviewResponse.summary.reviewCount;
  const seller = product.designerProfile?.user;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/shop/${product.category.name.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-primary">
            {product.category.name.toUpperCase()}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-96 flex items-center justify-center relative">
                <Image src={product.image || "/images/dress.jpg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {[product.image].map((img, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-primary"
                  >
                    <Image
                      src={img || "/images/dress.jpg"}
                      alt={`View ${idx + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <RatingSummary summary={reviewResponse.summary} size="md" />
                <span className="text-sm text-gray-600">
                  {orderCount} orders, {favoriteCount} favorites
                </span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-primary">Birr {product.price.toLocaleString()}</span>
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Color</label>
                <div className="flex gap-3">
                  {["#4A90E2", "#50C878", "#FFB6C1", "#000000"].map((color) => (
                    <span
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <ProductActions productId={product.id} sellerId={seller?.id} />

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  Sold by{" "}
                  <span className="font-medium text-gray-900 inline-flex items-center gap-1.5">
                    {seller?.name || "Saba Artisan"}
                    <VerifiedDesignerBadge isVerified={product.designerProfile?.isVerified} />
                  </span>
                </p>
                <div className="mt-2">
                  <RatingSummary summary={product.designerProfile?.reviewSummary} />
                </div>
                <p className="text-sm text-gray-600 mt-1">Verified seller profile and secure checkout</p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-3">Why Choose This Product</h3>
                <ul className="space-y-2">
                  {[
                    "Authentic handmade design",
                    "Premium quality materials",
                    "Supports independent sellers",
                    "One-of-a-kind marketplace item",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {reviewCount === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600">No reviews have been added yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviewResponse.reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900">{review.user?.name || "Buyer"}</p>
                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                          <RatingSummary summary={{ averageRating: review.rating, reviewCount: 1 }} showCount={false} />
                        </div>
                        {review.comment && <p className="text-sm text-gray-700">{review.comment}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Leave a Review</h3>
                <ProductReviewForm productId={product.id} />
                <p className="text-xs text-gray-500 mt-3">
                  Reviews are available after a delivered order.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 mb-12">
            <AiStyleAssistant productId={product.id} categoryId={product.category.id} />
          </div>

          <div className="border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            {relatedProducts.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">No related products yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relProduct) => (
                  <Link key={relProduct.id} href={`/products/${relProduct.id}`}>
                    <div className="group cursor-pointer">
                      <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 h-48 relative">
                        <Image
                          src={relProduct.image || "/images/dress.jpg"}
                          alt={relProduct.name}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      </div>
                      <h3 className="font-medium text-gray-900 group-hover:text-primary transition">{relProduct.name}</h3>
                      <RatingSummary summary={relProduct.reviewSummary} />
                      <p className="text-primary font-bold">Birr {relProduct.price.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

