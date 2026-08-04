import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RatingSummary } from "@/components/rating-summary";
import { AiStyleAssistant } from "@/components/ai-style-assistant";
import { VerifiedDesignerBadge } from "@/components/verified-designer-badge";
import { Heart, ChevronDown, Grid, List, Search } from "lucide-react";
import { getProducts, smartSearchProducts } from "@/lib/api-client";

const categoryData = {
  "women-clothes": {
    name: "Women Clothes",
    description:
      "Discover our exquisite collection of traditional and modern women's clothing, handcrafted by skilled artisans",
  },
  "men-clothes": {
    name: "Men Clothes",
    description:
      "Explore authentic men's traditional and contemporary wear, featuring premium quality fabrics and timeless designs",
  },
  gabi: {
    name: "Gabi",
    description: "Traditional wraps and shawls for every occasion, perfect for adding elegance to any outfit",
  },
  jewelry: {
    name: "Jewelry",
    description: "Handcrafted jewelry pieces from local artisans, each piece tells a unique story of craftsmanship",
  },
};

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    sort?: string;
    view?: string;
    page?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

function buildHref(category: string, params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const query = searchParams.toString();
  return query ? `/shop/${category}?${query}` : `/shop/${category}`;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category: categoryKey } = await params;
  const query = await searchParams;
  const category = categoryData[categoryKey as keyof typeof categoryData] || categoryData["women-clothes"];
  const sortBy = query.sort || "newest";
  const viewMode = query.view || "grid";
  const currentPage = Number(query.page || "1");
  const itemsPerPage = 12;

  const products = query.search
    ? await smartSearchProducts({
        q: query.search,
        category: categoryKey,
        sort: sortBy,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
      })
        .then((response) => response.products)
        .catch(() =>
          getProducts({
            category: categoryKey,
            sort: sortBy,
            search: query.search,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
          }).catch(() => [])
        )
    : await getProducts({
        category: categoryKey,
        sort: sortBy,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
      }).catch(() => []);

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-600 mt-2">{category.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <form action={`/shop/${categoryKey}`} className="bg-white rounded-lg p-6 sticky top-20">
                <input type="hidden" name="sort" value={sortBy} />
                <input type="hidden" name="view" value={viewMode} />
                <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

                <div className="mb-6 pb-6 border-b">
                  <h4 className="font-medium text-gray-900 mb-3">Search</h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      name="search"
                      defaultValue={query.search || ""}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                  <div className="flex gap-2 mt-4">
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={query.minPrice || ""}
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={query.maxPrice || ""}
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <button className="w-full px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium">
                  Apply Filters
                </button>
              </form>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-6">
                <AiStyleAssistant />
              </div>

              <div className="bg-white rounded-lg p-4 mb-6 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {paginatedProducts.length} of {products.length} products
                </span>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <Link
                      href={buildHref(categoryKey, { ...query, view: "grid" })}
                      className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-white" : "bg-gray-100"}`}
                    >
                      <Grid className="w-5 h-5" />
                    </Link>
                    <Link
                      href={buildHref(categoryKey, { ...query, view: "list" })}
                      className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-white" : "bg-gray-100"}`}
                    >
                      <List className="w-5 h-5" />
                    </Link>
                  </div>
                  <form action={`/shop/${categoryKey}`} className="flex items-center gap-2">
                    <input type="hidden" name="view" value={viewMode} />
                    <input type="hidden" name="search" value={query.search || ""} />
                    <input type="hidden" name="minPrice" value={query.minPrice || ""} />
                    <input type="hidden" name="maxPrice" value={query.maxPrice || ""} />
                    <div className="relative">
                      <select
                        name="sort"
                        defaultValue={sortBy}
                        className="px-4 py-2 border rounded-lg appearance-none pr-8 bg-white"
                      >
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="popular">Most Popular</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none text-gray-600" />
                    </div>
                    <button className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100">Apply</button>
                  </form>
                </div>
              </div>

              {paginatedProducts.length === 0 ? (
                <div className="bg-white rounded-lg p-10 text-center">
                  <h2 className="text-xl font-bold text-gray-900">No products found</h2>
                  <p className="text-gray-600 mt-2">This category does not have matching products yet.</p>
                </div>
              ) : (
                <div
                  className={`grid gap-6 mb-8 ${
                    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                  }`}
                >
                  {paginatedProducts.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition group">
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          <Image
                            src={product.image || "/images/dress.jpg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                          <span className="absolute top-3 right-3 p-2 bg-white rounded-full hover:bg-gray-100 transition">
                            <Heart className="w-5 h-5 text-gray-600" />
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 group-hover:text-primary transition">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 inline-flex items-center gap-1.5">
                            <span>{product.designerProfile?.user?.name || "Saba Artisan"}</span>
                            <VerifiedDesignerBadge isVerified={product.designerProfile?.isVerified} />
                          </p>
                          <div className="mt-2">
                            <RatingSummary summary={product.reviewSummary} />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-primary font-bold">Birr {product.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-center gap-2">
                <Link
                  href={buildHref(categoryKey, { ...query, page: String(Math.max(1, currentPage - 1)) })}
                  className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                  Previous
                </Link>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Link
                    key={i + 1}
                    href={buildHref(categoryKey, { ...query, page: String(i + 1) })}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1 ? "bg-primary text-white" : "border hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
                <Link
                  href={buildHref(categoryKey, { ...query, page: String(Math.min(totalPages, currentPage + 1)) })}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Next
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

