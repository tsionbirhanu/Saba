import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RatingSummary } from "@/components/rating-summary";
import { VerifiedDesignerBadge } from "@/components/verified-designer-badge";
import type { ApiProduct } from "@/lib/api-client";

type BestsellerSectionProps = {
  featuredProducts: ApiProduct[];
  popularProducts: ApiProduct[];
};

function ProductCard({ product }: { product: ApiProduct }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden border-0 cursor-pointer transition-all flex flex-col h-full shadow-md hover:shadow-lg">
        <div className="relative flex-grow bg-gray-100 min-h-[180px] flex items-center justify-center">
          <Image
            src={product.image || "/images/dress.jpg"}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        <div className="p-3 text-center flex-shrink-0">
          <h3 className="font-bold text-base text-gray-900 mb-1">{product.name}</h3>
          <p className="text-xs text-gray-600 mb-2 inline-flex items-center justify-center gap-1.5">
            <span>{product.designerProfile?.user?.name || "Saba Artisan"}</span>
            <VerifiedDesignerBadge isVerified={product.designerProfile?.isVerified} />
          </p>
          <div className="flex justify-center mb-2">
            <RatingSummary summary={product.reviewSummary} />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-base font-bold text-primary">Birr {product.price.toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ProductBand({
  title,
  label,
  products,
  reverse = false,
}: {
  title: string;
  label: string;
  products: ApiProduct[];
  reverse?: boolean;
}) {
  const heroProduct = products[0];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-2">No products are available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className={`${reverse ? "lg:col-span-2 order-2 lg:order-1" : "lg:col-span-1"} flex justify-center`}>
              {!reverse && heroProduct && (
                <Card className="overflow-hidden border-0 shadow-lg w-full max-w-xs relative">
                  <div className="absolute top-4 left-4 z-10 text-black">
                    <div className="flex flex-col space-y-1 mt-2">
                      <span className="font-medium text-sm">{label}</span>
                      <span className="text-sm">{products.length} items</span>
                    </div>
                  </div>

                  <div className="relative h-80 sm:h-[440px] lg:h-[600px] bg-gray-50 flex items-center justify-center">
                    <Image
                      src={heroProduct.image || "/images/dress.jpg"}
                      alt={heroProduct.name}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </Card>
              )}

              {reverse && (
                <div className="w-full">
                  <div className="text-center lg:text-left mb-8">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 uppercase">{title}</h2>
                    <div className="w-full h-0.5 bg-gray-400 mt-2"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`${reverse ? "lg:col-span-1 order-1 lg:order-2" : "lg:col-span-2"} flex flex-col`}>
              {!reverse && (
                <>
                  <div className="text-center lg:text-left mb-8">
                    <h2 className="text-2xl md:text-4xl font-bold text-gray-900 uppercase">{title}</h2>
                    <div className="w-full h-0.5 bg-gray-400 mt-2"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}

              {reverse && heroProduct && (
                <Card className="overflow-hidden border-0 shadow-lg w-full max-w-xs relative mx-auto">
                  <div className="absolute top-4 left-4 z-10 text-black">
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium text-sm">{label}</span>
                      <span className="text-sm">{products.length} items</span>
                    </div>
                  </div>
                  <div className="relative h-80 sm:h-[440px] lg:h-[600px] bg-gray-50 flex items-center justify-center">
                    <Image
                      src={heroProduct.image || "/images/dress.jpg"}
                      alt={heroProduct.name}
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function BestsellerSection({ featuredProducts, popularProducts }: BestsellerSectionProps) {
  return (
    <>
      <ProductBand title="Featured Products" label="Newest" products={featuredProducts} />

      <section className="py-12 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
              <Image src="/images/couple.jpg" alt="Couples Clothing" fill className="object-cover" />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Couples Clothing</h2>
                <p className="text-gray-600 text-base leading-relaxed mb-2">We celebrate togetherness in style.</p>
                <p className="text-gray-600 text-base leading-relaxed mb-2">Matching tradition, woven with love.</p>
                <p className="text-gray-600 text-base leading-relaxed">A perfect pair, made to last.</p>
              </div>

              {featuredProducts[0] && (
                <Link href={`/products/${featuredProducts[0].id}`} className="block bg-gray-100 rounded-lg p-6 text-center">
                  <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={featuredProducts[0].image || "/images/dress.jpg"}
                      alt={featuredProducts[0].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Saba</p>
                  <p className="font-semibold text-gray-900 mb-3">{featuredProducts[0].name}</p>
                  <div className="flex justify-center mb-3">
                    <RatingSummary summary={featuredProducts[0].reviewSummary} />
                  </div>
                  <span className="text-teal-600 font-semibold">
                    Birr {featuredProducts[0].price.toLocaleString()}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductBand title="Most Popular" label="Popular" products={popularProducts} reverse />
    </>
  );
}

