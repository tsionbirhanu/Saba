import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RatingSummary } from "@/components/rating-summary";
import { VerifiedDesignerBadge } from "@/components/verified-designer-badge";
import { ChevronDown, Grid, List, Heart, Search } from "lucide-react";
import { getProducts, smartSearchProducts } from "@/lib/api-client";
import { ShopSortSelect } from "@/components/shop-sort-select";

const categories = [
  { id: "all", name: "All Products" },
  { id: "women-clothes", name: "Women Clothes" },
  { id: "men-clothes", name: "Men Clothes" },
  { id: "gabi", name: "Gabi" },
  { id: "jewelry", name: "Jewelry" },
];

type ShopPageProps = {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    view?: string;
    page?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

function buildHref(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const query = searchParams.toString();
  return query ? `/shop?${query}` : "/shop";
}

function getCategoryName(categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name || categoryId;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category || "all";
  const sortBy = params.sort || "newest";
  const viewMode = params.view || "grid";
  const currentPage = Number(params.page || "1");
  const itemsPerPage = 12;

  const products = params.search
    ? await smartSearchProducts({
        q: params.search,
        category: selectedCategory,
        sort: sortBy,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      })
        .then((response) => response.products)
        .catch(() =>
          getProducts({
            category: selectedCategory,
            sort: sortBy,
            search: params.search,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
          }).catch(() => [])
        )
    : await getProducts({
        category: selectedCategory,
        sort: sortBy,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
      }).catch(() => []);

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const activeFilters = [
    selectedCategory !== "all" ? getCategoryName(selectedCategory) : undefined,
    params.search ? `Search: ${params.search}` : undefined,
    params.minPrice ? `Min Birr ${Number(params.minPrice).toLocaleString()}` : undefined,
    params.maxPrice ? `Max Birr ${Number(params.maxPrice).toLocaleString()}` : undefined,
  ].filter(Boolean);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
            <p className="text-gray-600 mt-2">Discover authentic handmade products from women artisans</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-20">
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={buildHref({ ...params, category: cat.id, page: undefined })}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition ${
                        selectedCategory === cat.id ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                <form action="/shop" className="mt-8 pt-8 border-t">
                  <input type="hidden" name="category" value={selectedCategory} />
                  <input type="hidden" name="sort" value={sortBy} />
                  <input type="hidden" name="view" value={viewMode} />
                  <h3 className="font-bold text-gray-900 mb-4">Search</h3>
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      name="search"
                      defaultValue={params.search || ""}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                  <div className="flex gap-2 mt-4">
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={params.minPrice || ""}
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={params.maxPrice || ""}
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button className="flex-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">
                      Show Results
                    </button>
                    <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-primary">
                      Clear
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-sm text-gray-600">
                    Showing {paginatedProducts.length} of {products.length} products
                  </span>
                  {activeFilters.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeFilters.map((filter) => (
                        <span key={filter} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                          {filter}
                        </span>
                      ))}
                      <Link href="/shop" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200">
                        Clear all
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex gap-2">
                    <Link
                      href={buildHref({ ...params, view: "grid" })}
                      className={`p-2 rounded ${viewMode === "grid" ? "bg-primary text-white" : "bg-gray-100"}`}
                    >
                      <Grid className="w-5 h-5" />
                    </Link>
                    <Link
                      href={buildHref({ ...params, view: "list" })}
                      className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-white" : "bg-gray-100"}`}
                    >
                      <List className="w-5 h-5" />
                    </Link>
                  </div>
                  <form action="/shop" className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="category" value={selectedCategory} />
                    <input type="hidden" name="view" value={viewMode} />
                    <input type="hidden" name="search" value={params.search || ""} />
                    <input type="hidden" name="minPrice" value={params.minPrice || ""} />
                    <input type="hidden" name="maxPrice" value={params.maxPrice || ""} />
                    <div className="relative">
                      <ShopSortSelect
                        name="sort"
                        defaultValue={sortBy}
                        className="px-4 py-2 border rounded-lg appearance-none pr-8 bg-white"
                      />
                      <ChevronDown className="absolute right-2 top-3 w-4 h-4 pointer-events-none text-gray-600" />
                    </div>
                  </form>
                </div>
              </div>

              {paginatedProducts.length === 0 ? (
                <div className="bg-white rounded-lg p-10 text-center">
                  <h2 className="text-xl font-bold text-gray-900">No products found</h2>
                  <p className="text-gray-600 mt-2">Try adjusting your filters or search term.</p>
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
                          <span className="absolute top-3 right-3 p-2 bg-white rounded-full">
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

              <div className="flex flex-wrap items-center justify-center gap-2">
                <Link
                  href={buildHref({ ...params, page: String(Math.max(1, currentPage - 1)) })}
                  className={`px-4 py-2 border rounded-lg ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
                >
                  Previous
                </Link>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Link
                    key={i + 1}
                    href={buildHref({ ...params, page: String(i + 1) })}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1 ? "bg-primary text-white" : "border hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
                <Link
                  href={buildHref({ ...params, page: String(Math.min(totalPages, currentPage + 1)) })}
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

