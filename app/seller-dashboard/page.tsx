"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  BadgeCheck,
  CheckCircle2,
  Clock,
  ImagePlus,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import {
  ApiCategory,
  ApiOrder,
  ApiProduct,
  ApiUser,
  createProduct,
  generateProductDescription,
  getCategories,
  getLoggedInUser,
  getOrders,
  getProducts,
  suggestImageTags,
  updateProduct,
  updateOrderStatus,
  uploadDesignerId,
  uploadProductImage,
} from "@/lib/api-client";

type ProductForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
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
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [verificationForm, setVerificationForm] = useState<{ nationalId: string; file: File | null }>({
    nationalId: "",
    file: null,
  });
  const [formStatus, setFormStatus] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | null>(null);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    stock: "1",
    categoryId: "",
    file: null,
    keywords: "",
    uploadedImageUrl: "",
    suggestedTags: [],
  });

  function resetProductForm() {
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "1",
      categoryId: "",
      file: null,
      keywords: "",
      uploadedImageUrl: "",
      suggestedTags: [],
    });
  }

  function openAddProductModal() {
    setEditingProduct(null);
    setFormStatus("");
    resetProductForm();
    setIsProductModalOpen(true);
    setActiveTab("products");
  }

  function openEditProductModal(product: ApiProduct) {
    setEditingProduct(product);
    setFormStatus("");
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      categoryId: product.category.id,
      file: null,
      keywords: "",
      uploadedImageUrl: product.image || "",
      suggestedTags: [],
    });
    setIsProductModalOpen(true);
    setActiveTab("products");
  }

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await getLoggedInUser();
      if (currentUser.role !== "DESIGNER") {
        router.push("/");
        return;
      }

      setUser(currentUser);
      const designerProfileId = currentUser.designerProfile?.id;
      const [productRows, orderResponse, categoryRows] = await Promise.all([
        designerProfileId ? getProducts({ designerProfileId }) : Promise.resolve([]),
        getOrders(),
        getCategories(),
      ]);

      setProducts(productRows);
      setOrders(
        orderResponse.orders.filter(
          (order) =>
            order.product.designerProfile?.user?.id === currentUser.id ||
            order.items?.some((item) => item.product.designerProfile?.user?.id === currentUser.id)
        )
      );
      setCategories(categoryRows);
    } catch {
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

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

  async function handleSaveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus(editingProduct ? "Updating product..." : "Creating product...");

    try {
      if (!editingProduct && !form.file) throw new Error("Please choose a product image.");
      if (!form.categoryId) throw new Error("Please choose a category.");
      if (!form.stock || Number(form.stock) < 0) throw new Error("Enter a valid stock quantity.");

      let image = form.uploadedImageUrl;
      if (form.file && !image) {
        const uploaded = await uploadProductImage(form.file);
        image = uploaded.secure_url || uploaded.url || "";
      }
      if (!editingProduct && !image) throw new Error("Image upload did not return a URL.");

      if (editingProduct) {
        await updateProduct(editingProduct.id, {
          name: form.name,
          description: form.description,
          price: form.price,
          stock: form.stock,
          image,
          categoryId: form.categoryId,
        });
      } else {
        await createProduct({
          name: form.name,
          description: form.description,
          price: form.price,
          stock: form.stock,
          image,
          categoryId: form.categoryId,
        });
      }

      resetProductForm();
      setEditingProduct(null);
      setIsProductModalOpen(false);
      setFormStatus(editingProduct ? "Product updated successfully." : "Product added successfully.");
      await loadDashboard();
    } catch (error) {
      setFormStatus(error instanceof Error ? error.message : "Could not save product.");
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
      <Header showPattern={false} />
      <main className="min-h-screen bg-gray-50">
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Seller Workspace</p>
                <h1 className="mt-1 text-2xl font-bold text-gray-950 sm:text-3xl">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage products, orders, verification, and fulfillment from one place.
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {user.designerProfile?.isVerified ? <BadgeCheck className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                  {user.designerProfile?.isVerified ? "Verified seller" : "Verification pending"}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-950">Welcome back, {user.name || "Seller"}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                  {user.designerProfile?.isVerified
                    ? "Your verified shop is publicly visible to buyers."
                    : "You can prepare products now. They become public after National ID verification."}
                </p>
              </div>
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90 font-semibold md:w-auto"
                onClick={() => (user.designerProfile?.isVerified ? openAddProductModal() : setActiveTab("settings"))}
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

          <div className="mb-8 flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
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
                  activeTab === tab.id ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

                <ProductTable products={products.slice(0, 5)} orders={orders} emptyText="No products yet." onEdit={openEditProductModal} />
              </>
            )}

            {activeTab === "products" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-950">Products</h2>
                    <p className="text-sm text-gray-600">Add listings and update names, prices, stock, and categories.</p>
                  </div>
                  <Button onClick={openAddProductModal} className="w-full bg-primary text-white hover:bg-primary/90 sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
                <ProductTable products={products} orders={orders} emptyText="Add your first product to start selling." onEdit={openEditProductModal} />
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
                <section className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Designer Verification</h3>
                  <p className="text-sm text-gray-600 mb-5">
                    Submit your National ID after registration. Admin approval adds the verified badge and makes your products visible in the shop.
                  </p>

                  <div className="mb-5 rounded-lg bg-gray-50 p-4">
                    <p className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      {user.designerProfile?.isVerified ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Clock className="h-4 w-4 text-amber-600" />}
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

                <section className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-gray-100">
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
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-950">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h3>
                <p className="text-sm text-gray-600">
                  {editingProduct
                    ? "Update product name, price, stock, category, or photo."
                    : "Create a listing with a real category and product photo."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                  resetProductForm();
                  setFormStatus("");
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                aria-label="Close product form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6">
              {!user.designerProfile?.isVerified && (
                <p className="mb-4 rounded-lg border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">
                  You can save products now, but they stay hidden from buyers until your seller verification is approved.
                </p>
              )}

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-800">Product name</span>
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Traditional Habesha dress"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-800">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                    placeholder="Describe fabric, fit, occasion, and handmade details."
                    className="min-h-28 w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </label>

                {!editingProduct && (
                  <>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-gray-800">Style keywords</span>
                      <input
                        value={form.keywords}
                        onChange={(event) => setForm({ ...form, keywords: event.target.value })}
                        placeholder="Wedding, cotton, modern, traditional"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      disabled={isAiLoading}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 disabled:opacity-60"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isAiLoading ? "Drafting..." : "Draft Description"}
                    </button>
                  </>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-800">Price</span>
                    <input
                      value={form.price}
                      onChange={(event) => setForm({ ...form, price: event.target.value })}
                      placeholder="Birr"
                      type="number"
                      min="0"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-800">Stock</span>
                    <input
                      value={form.stock}
                      onChange={(event) => setForm({ ...form, stock: event.target.value })}
                      placeholder="1"
                      type="number"
                      min="0"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-800">Category</span>
                    <select
                      value={form.categoryId}
                      onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    >
                      <option value="">Choose category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center hover:bg-gray-100">
                  <ImagePlus className="mb-2 h-6 w-6 text-primary" />
                  <span className="text-sm font-medium text-gray-900">
                    {form.file ? form.file.name : editingProduct ? "Replace product photo" : "Upload product photo"}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    {editingProduct ? "Optional. Leave empty to keep current image." : "PNG, JPG, or WEBP"}
                  </span>
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
                    className="sr-only"
                    required={!editingProduct}
                  />
                </label>

                {!editingProduct && (
                  <button
                    type="button"
                    onClick={handleSuggestImageTags}
                    disabled={isAiLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                  >
                    <UploadCloud className="h-4 w-4" />
                    {isAiLoading ? "Analyzing..." : "Analyze Photo"}
                  </button>
                )}
              </div>

              {form.suggestedTags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {form.suggestedTags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-gray-100 text-xs text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {formStatus && <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-600">{formStatus}</p>}
              {categories.length === 0 && (
                <p className="mt-3 text-sm text-red-600">
                  No categories were found. Add categories in the database before creating products.
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                    resetProductForm();
                    setFormStatus("");
                  }}
                  className="bg-white"
                >
                  Cancel
                </Button>
                <Button className="bg-primary text-white hover:bg-primary/90">
                  {editingProduct ? "Save Changes" : "Save Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  onEdit,
}: {
  products: ApiProduct[];
  orders: ApiOrder[];
  emptyText: string;
  onEdit: (product: ApiProduct) => void;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-gray-100">
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
                const sales = orders.reduce((sum, order) => {
                  const itemSales =
                    order.items
                      ?.filter((item) => item.productId === product.id)
                      .reduce((itemSum, item) => itemSum + item.quantity, 0) || 0;
                  const legacySales = order.productId === product.id ? order.quantity : 0;
                  return sum + itemSales + legacySales;
                }, 0);
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
                        <Link
                          href={`/products/${product.id}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                          Open
                        </Link>
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                          Edit
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

