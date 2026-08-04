"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  BarChart3,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  Eye,
  Package,
  Settings,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react";
import {
  ApiOrder,
  ApiProduct,
  ApiUser,
  createProduct,
  generateProductDescription,
  getLoggedInUser,
  getOrders,
  getProducts,
  suggestImageTags,
  updateOrderStatus,
  uploadDesignerId,
  uploadProductImage,
} from "@/lib/api-client";

type ProductForm = {
  name: string;
  description: string;
  price: string;
  categoryId: string;
  file: File | null;
  keywords: string;
  uploadedImageUrl: string;
  suggestedTags: string[];
};

export default function SellerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<ApiUser | null>(null);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verificationForm, setVerificationForm] = useState<{ nationalId: string; file: File | null }>({
    nationalId: "",
    file: null,
  });
  const [formStatus, setFormStatus] = useState("");
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    file: null,
    keywords: "",
    uploadedImageUrl: "",
    suggestedTags: [],
  });

  async function loadDashboard() {
    setIsLoading(true);
    try {
      const currentUser = await getLoggedInUser();
      if (currentUser.role !== "DESIGNER") {
        router.push("/");
        return;
      }

      setUser(currentUser);
      const designerProfileId = currentUser.designerProfile?.id;
      const [productRows, orderResponse, catalogRows] = await Promise.all([
        designerProfileId ? getProducts({ designerProfileId }) : Promise.resolve([]),
        getOrders(),
        getProducts({ sort: "newest" }),
      ]);

      setProducts(productRows);
      setOrders(
        orderResponse.orders.filter(
          (order) =>
            order.product.designerProfile?.user?.id === currentUser.id ||
            order.items?.some((item) => item.product.designerProfile?.user?.id === currentUser.id)
        )
      );
      setAllProducts(catalogRows);
    } catch {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    allProducts.forEach((product) => map.set(product.category.id, product.category.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [allProducts]);

  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((order) => order.status === "PAID" || order.status === "DELIVERED")
      .reduce((sum, order) => sum + getSellerOrderTotal(order, user?.id), 0);
    const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
    const totalSales = orders.reduce((sum, order) => sum + getSellerOrderQuantity(order, user?.id), 0);

    return [
      { label: "Total Revenue", value: `Br ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600" },
      { label: "Total Orders", value: String(orders.length), icon: ShoppingBag, color: "text-blue-600" },
      { label: "Active Products", value: String(products.length), icon: Package, color: "text-purple-600" },
      { label: "Pending Orders", value: String(pendingOrders), icon: ShoppingBag, color: "text-orange-600" },
      { label: "Items Sold", value: String(totalSales), icon: BarChart3, color: "text-teal-600" },
    ];
  }, [orders, products.length, user?.id]);

  async function handleCreateProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("Creating product...");

    try {
      if (!form.file) throw new Error("Please choose a product image.");
      if (!form.categoryId) throw new Error("Please choose a category.");

      let image = form.uploadedImageUrl;
      if (!image) {
        const uploaded = await uploadProductImage(form.file);
        image = uploaded.secure_url || uploaded.url || "";
      }
      if (!image) throw new Error("Image upload did not return a URL.");

      await createProduct({
        name: form.name,
        description: form.description,
        price: form.price,
        image,
        categoryId: form.categoryId,
      });

      setForm({
        name: "",
        description: "",
        price: "",
        categoryId: "",
        file: null,
        keywords: "",
        uploadedImageUrl: "",
        suggestedTags: [],
      });
      setFormStatus("Product added successfully.");
      await loadDashboard();
    } catch (error) {
      setFormStatus(error instanceof Error ? error.message : "Could not create product.");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    router.push("/");
  };

  async function handleDeliverOrder(orderId: string) {
    setFormStatus("");
    try {
      await updateOrderStatus(orderId, "DELIVERED");
      setFormStatus("Order marked delivered.");
      await loadDashboard();
    } catch (error) {
      setFormStatus(error instanceof Error ? error.message : "Could not update order.");
    }
  }

  async function handleGenerateDescription() {
    const categoryName = categories.find((category) => category.id === form.categoryId)?.name;
    setFormStatus("");

    try {
      if (!form.name) throw new Error("Add a product name first.");
      if (!categoryName) throw new Error("Choose a category first.");

      setIsAiLoading(true);
      const response = await generateProductDescription({
        name: form.name,
        categoryName,
        keywords: form.keywords,
      });
      setForm((current) => ({ ...current, description: response.description }));
      setFormStatus(response.usedAi ? "Description generated. You can edit it before saving." : "Draft description added without AI.");
    } catch (error) {
      setFormStatus(error instanceof Error ? error.message : "Could not generate a description.");
    } finally {
      setIsAiLoading(false);
    }
  }

  async function handleSuggestImageTags() {
    setFormStatus("");

    try {
      if (!form.name) throw new Error("Add a product name first.");
      if (!form.file && !form.uploadedImageUrl) throw new Error("Choose a product image first.");

      setIsAiLoading(true);
      let imageUrl = form.uploadedImageUrl;
      if (!imageUrl && form.file) {
        const uploaded = await uploadProductImage(form.file);
        imageUrl = uploaded.secure_url || uploaded.url || "";
      }
      if (!imageUrl) throw new Error("Image upload did not return a URL.");

      const response = await suggestImageTags({ name: form.name, imageUrl });
      setForm((current) => ({
        ...current,
        categoryId: response.categoryId || current.categoryId,
        uploadedImageUrl: imageUrl,
        suggestedTags: response.tags,
        keywords: response.tags.length ? response.tags.join(", ") : current.keywords,
      }));
      setFormStatus(
        response.usedAi
          ? "Category and tags suggested from the image."
          : "Basic category and tag suggestions added without AI."
      );
    } catch (error) {
      setFormStatus(error instanceof Error ? error.message : "Could not suggest tags.");
    } finally {
      setIsAiLoading(false);
    }
  }

  async function handleSubmitVerification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setVerificationStatus("Submitting verification...");

    try {
      if (!user) throw new Error("Please log in again.");
      if (!verificationForm.nationalId.trim()) throw new Error("Enter your National ID number.");
      if (!verificationForm.file) throw new Error("Upload a National ID image.");

      await uploadDesignerId(user.id, {
        nationalId: verificationForm.nationalId.trim(),
        file: verificationForm.file,
      });
      setVerificationStatus("Verification submitted. Admin approval is required before your products appear publicly.");
      setVerificationForm({ nationalId: "", file: null });
      await loadDashboard();
    } catch (error) {
      setVerificationStatus(error instanceof Error ? error.message : "Could not submit verification.");
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800020]"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-[#800020] to-[#a00030] rounded-2xl text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, {user.name || "Seller"}!</h2>
                <p className="opacity-90">
                  {user.designerProfile?.isVerified
                    ? "Your verified shop is publicly visible to buyers."
                    : "You can prepare products now. They become public after National ID verification."}
                </p>
              </div>
              <Button
                className="bg-white text-[#800020] hover:bg-gray-100 font-semibold"
                onClick={() => setActiveTab(user.designerProfile?.isVerified ? "products" : "settings")}
              >
                <Plus className="w-4 h-4 mr-2" />
                {user.designerProfile?.isVerified ? "Add New Product" : "Submit Verification"}
              </Button>
            </div>
          </div>

          {!user.designerProfile?.isVerified && (
            <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-semibold text-amber-950 mb-1">Verification required before public selling</h2>
              <p className="text-sm text-amber-900">
                Your account is active, and you can prepare your shop. Buyers will not see your products until an admin approves your National ID submission.
              </p>
            </div>
          )}

          <div className="flex gap-1 mb-8 p-1 bg-gray-100 rounded-xl max-w-3xl overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "products", label: "Products", icon: Package },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-32 items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all flex-1 justify-center ${
                  activeTab === tab.id ? "bg-white text-[#800020] shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-gray-600 text-sm font-medium">{stat.label}</h3>
                          <Icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                      </div>
                    );
                  })}
                </div>

                <ProductTable products={products.slice(0, 5)} orders={orders} emptyText="No products yet." />
              </>
            )}

            {activeTab === "products" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ProductTable products={products} orders={orders} emptyText="Add your first product to start selling." />
                </div>

                <form onSubmit={handleCreateProduct} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add Product</h3>
                  {!user.designerProfile?.isVerified && (
                    <p className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-sm text-amber-900">
                      You can save products now, but they stay hidden from buyers until your seller verification is approved.
                    </p>
                  )}
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Product name"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="Description"
                    className="w-full px-4 py-2 border rounded-lg min-h-28"
                    required
                  />
                  <input
                    value={form.keywords}
                    onChange={(event) => setForm({ ...form, keywords: event.target.value })}
                    placeholder="Keywords for AI description"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isAiLoading}
                    className="w-full px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 disabled:opacity-60"
                  >
                    {isAiLoading ? "Generating..." : "Generate description"}
                  </button>
                  <input
                    value={form.price}
                    onChange={(event) => setForm({ ...form, price: event.target.value })}
                    placeholder="Price"
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                  <select
                    value={form.categoryId}
                    onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="">Choose category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setForm({
                        ...form,
                        file: event.target.files?.[0] || null,
                        uploadedImageUrl: "",
                        suggestedTags: [],
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleSuggestImageTags}
                    disabled={isAiLoading}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
                  >
                    {isAiLoading ? "Checking image..." : "Suggest category and tags"}
                  </button>
                  {form.suggestedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {form.suggestedTags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <Button className="w-full bg-[#800020] hover:bg-[#660018] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Save Product
                  </Button>
                  {formStatus && <p className="text-sm text-gray-600">{formStatus}</p>}
                  {categories.length === 0 && (
                    <p className="text-sm text-red-600">
                      No categories were found from the catalog yet. Add categories in the database before creating products.
                    </p>
                  )}
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders</h3>
                {formStatus && <p className="mb-4 text-sm text-gray-600">{formStatus}</p>}
                {orders.length === 0 ? (
                  <p className="text-gray-600">No orders for your products yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border rounded-lg p-4">
                        <div>
                          <p className="font-medium text-gray-900">{getSellerOrderTitle(order, user.id)}</p>
                          <p className="text-sm text-gray-600">
                            {getSellerOrderQuantity(order, user.id)} item(s) by {order.buyer?.name || "Buyer"}
                          </p>
                        </div>
                        <div className="sm:text-right space-y-2">
                          <p className="font-bold text-gray-900">Br {getSellerOrderTotal(order, user.id).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{order.status}</p>
                          {order.status === "PAID" && (
                            <Button
                              onClick={() => handleDeliverOrder(order.id)}
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-white"
                            >
                              Mark Delivered
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Designer Verification</h3>
                  <p className="text-sm text-gray-600 mb-5">
                    Submit your National ID after registration. Admin approval adds the verified badge and makes your products visible in the shop.
                  </p>

                  <div className="mb-5 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-900">
                      Status: {user.designerProfile?.isVerified ? "Verified" : user.designerProfile?.idImage ? "Submitted for review" : "Not submitted"}
                    </p>
                    {user.designerProfile?.verifiedAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Approved on {new Date(user.designerProfile.verifiedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {!user.designerProfile?.isVerified && (
                    <form onSubmit={handleSubmitVerification} className="space-y-4">
                      <input
                        value={verificationForm.nationalId}
                        onChange={(event) =>
                          setVerificationForm({ ...verificationForm, nationalId: event.target.value })
                        }
                        placeholder="National ID number"
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          setVerificationForm({
                            ...verificationForm,
                            file: event.target.files?.[0] || null,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                        Submit for approval
                      </Button>
                    </form>
                  )}

                  {verificationStatus && <p className="mt-4 text-sm text-gray-600">{verificationStatus}</p>}
                </section>

                <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">How seller approval works</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p>1. Register normally with email and password.</p>
                    <p>2. Prepare your profile and products in this dashboard.</p>
                    <p>3. Submit National ID here for admin review.</p>
                    <p>4. Once approved, your products appear in the shop with a verified badge.</p>
                  </div>
                </section>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function getSellerItems(order: ApiOrder, userId?: string) {
  const items = order.items?.filter((item) => item.product.designerProfile?.user?.id === userId) || [];
  if (items.length > 0) return items;
  return order.product.designerProfile?.user?.id === userId
    ? [{ quantity: order.quantity, totalAmount: order.totalAmount, product: order.product }]
    : [];
}

function getSellerOrderTitle(order: ApiOrder, userId?: string) {
  const items = getSellerItems(order, userId);
  if (items.length === 0) return order.product.name;
  if (items.length === 1) return items[0].product.name;
  return `${items[0].product.name} + ${items.length - 1} more`;
}

function getSellerOrderQuantity(order: ApiOrder, userId?: string) {
  return getSellerItems(order, userId).reduce((sum, item) => sum + item.quantity, 0);
}

function getSellerOrderTotal(order: ApiOrder, userId?: string) {
  return getSellerItems(order, userId).reduce((sum, item) => sum + item.totalAmount, 0);
}

function ProductTable({
  products,
  orders,
  emptyText,
}: {
  products: ApiProduct[];
  orders: ApiOrder[];
  emptyText: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Products</h3>
        <span className="text-sm text-gray-500">{products.length} listed</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{emptyText}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-600 border-b">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Sales</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const sales = orders
                  .flatMap((order) => order.items || [])
                  .filter((item) => item.productId === product.id)
                  .reduce((sum, item) => sum + item.quantity, 0);
                return (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                          <Image src={product.image || "/images/dress.jpg"} alt={product.name} fill className="object-cover" />
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4">Br {product.price.toLocaleString()}</td>
                    <td className="py-4">{sales}</td>
                    <td className="py-4">{product.stock}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          !product.designerProfile?.isVerified
                            ? "bg-amber-100 text-amber-800"
                            : product.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {!product.designerProfile?.isVerified ? "Hidden until verified" : product.stock > 0 ? "Public" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Link href={`/products/${product.id}`} className="p-2 hover:bg-gray-100 rounded-lg">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </Link>
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

