export type ApiProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
  designerProfile: {
    id: string;
    userId?: string;
    bio?: string | null;
    isVerified?: boolean;
    reviewSummary?: ApiReviewSummary;
    user: {
      id: string;
      name: string;
      email: string;
      profileImage?: string | null;
    };
  };
  _count?: {
    favorites: number;
    orders: number;
    orderItems?: number;
  };
  reviewSummary?: ApiReviewSummary;
};

export type ApiReviewSummary = {
  averageRating: number;
  reviewCount: number;
};

export type ApiReview = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    profileImage?: string | null;
  };
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  role: "BUYER" | "DESIGNER" | "ADMIN";
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
  designerProfile?: {
    id: string;
    userId: string;
    bio?: string | null;
    skills?: string | null;
    portfolio?: string | null;
    socialLinks?: string | null;
    contactInfo?: string | null;
    nationalId?: string | null;
    idImage?: string | null;
    isVerified?: boolean;
    verifiedAt?: string | null;
  } | null;
};

export type ApiAdminDesigner = {
  id: string;
  userId: string;
  bio?: string | null;
  skills?: string | null;
  portfolio?: string | null;
  socialLinks?: string | null;
  contactInfo?: string | null;
  nationalId?: string | null;
  idImage?: string | null;
  isVerified: boolean;
  verifiedAt?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profileImage?: string | null;
  };
};

export type ApiAdminOverview = {
  totalUsers: number;
  totalDesigners: number;
  verifiedDesigners: number;
  pendingDesigners: number;
  totalOrders: number;
  totalRevenue: number;
};

export type ApiOrder = {
  id: string;
  productId: string;
  buyerId: string;
  quantity: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "DELIVERED" | "CANCELLED";
  paymentRef?: string | null;
  paidAt?: string | null;
  paymentProvider?: string | null;
  chapaCheckoutUrl?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
  shippingNotes?: string | null;
  createdAt: string;
  product: ApiProduct;
  items?: ApiOrderItem[];
  buyer?: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string | null;
  };
};

export type ApiOrderItem = {
  id: string;
  orderId: string;
  productId: string;
  designerProfileId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  createdAt: string;
  product: ApiProduct;
};

export type ApiCartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: ApiProduct;
};

export type ApiCartResponse = {
  cart: {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    items: ApiCartItem[];
  };
  itemCount: number;
  subtotal: number;
};

export type ApiNotification = {
  id: string;
  userId: string;
  type?: string;
  title: string;
  body: string;
  message?: string;
  read?: boolean;
  readAt?: string | null;
  link?: string | null;
  createdAt: string;
};

export type ApiFavorite = {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: ApiProduct;
};

export type ApiConversation = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: string | null;
  };
  lastMessage: {
    id: string;
    text: string;
    timestamp: string;
    senderId: string;
  };
};

export type ApiMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
};

export type ApiAiProductPick = {
  product: ApiProduct;
  reason: string;
};

export type ApiStyleAssistantResponse = {
  picks: ApiAiProductPick[];
  usedAi: boolean;
  message?: string;
};

export type ApiProductDescriptionResponse = {
  description: string;
  usedAi: boolean;
};

export type ApiImageTagsResponse = {
  categoryName: string;
  categoryId: string;
  tags: string[];
  usedAi: boolean;
};

export type ApiSmartSearchResponse = {
  products: ApiProduct[];
  filters: {
    category?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    keywords: string[];
  };
  usedAi: boolean;
};

type RequestOptions = RequestInit & {
  token?: string | null;
  baseUrl?: string;
};

const GUEST_CART_KEY = "guestCart";

function getClientToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getBaseUrl(baseUrl?: string) {
  if (baseUrl) return baseUrl;
  if (typeof window !== "undefined") return "";
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = options.token ?? getClientToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${getBaseUrl(options.baseUrl)}${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
  });

  const contentType = response.headers.get("content-type");
  const payload = contentType?.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const error =
      typeof payload?.error === "string"
        ? payload.error
        : payload?.error
          ? JSON.stringify(payload.error)
          : "Request failed";
    throw new Error(error);
  }

  return payload as T;
}

export function getProducts(query: Record<string, string | number | undefined> = {}, baseUrl?: string) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });

  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<ApiProduct[]>(`/api/products${suffix}`, { baseUrl });
}

export function getProduct(id: string, baseUrl?: string) {
  return apiRequest<ApiProduct>(`/api/products/${id}`, { baseUrl });
}

export function getReviews(productId: string, baseUrl?: string) {
  return apiRequest<{ reviews: ApiReview[]; summary: ApiReviewSummary }>(
    `/api/reviews?productId=${encodeURIComponent(productId)}`,
    { baseUrl }
  );
}

export function saveReview(data: { productId: string; rating: number; comment?: string }) {
  return apiRequest<{ review: ApiReview; summary: ApiReviewSummary }>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getOrders() {
  return apiRequest<{ orders: ApiOrder[] }>("/api/orders");
}

export function updateOrderStatus(id: string, status: ApiOrder["status"]) {
  return apiRequest<{ order: ApiOrder }>(`/api/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export function getCart() {
  return apiRequest<ApiCartResponse>("/api/cart");
}

export function addCartItem(productId: string, quantity = 1) {
  return apiRequest<ApiCartResponse>("/api/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(productId: string, quantity: number) {
  return apiRequest<ApiCartResponse>("/api/cart", {
    method: "PATCH",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function removeCartItem(productId: string) {
  return apiRequest<ApiCartResponse>("/api/cart", {
    method: "DELETE",
    body: JSON.stringify({ productId }),
  });
}

export function clearCart() {
  return apiRequest<ApiCartResponse>("/api/cart", {
    method: "DELETE",
    body: JSON.stringify({ clear: true }),
  });
}

export function checkout(data: {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingNotes?: string;
}) {
  return apiRequest<{ order: ApiOrder; checkoutUrl: string | null }>("/api/checkout", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getNotifications() {
  return apiRequest<{ notifications: ApiNotification[]; unreadCount: number }>("/api/notifications");
}

export function markNotificationsRead(id?: string) {
  return apiRequest<{ success: boolean }>("/api/notifications", {
    method: "PATCH",
    body: JSON.stringify(id ? { id } : {}),
  });
}

export function getFavorites() {
  return apiRequest<ApiFavorite[]>("/api/favourites");
}

export function addFavorite(productId: string) {
  return apiRequest<ApiFavorite | { message: string }>("/api/favourites", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export function removeFavorite(productId: string) {
  return apiRequest<{ message: string }>(`/api/favourites/${productId}`, {
    method: "DELETE",
  });
}

export function createProduct(data: {
  name: string;
  description: string;
  price: string | number;
  image: string;
  categoryId: string;
}) {
  return apiRequest<ApiProduct>("/api/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function uploadProductImage(file: File) {
  const formData = new FormData();
  formData.set("file", file);
  return apiRequest<{ secure_url?: string; url?: string }>("/api/products/upload", {
    method: "POST",
    body: formData,
  });
}

export function uploadDesignerId(userId: string, data: { nationalId: string; file: File }) {
  const formData = new FormData();
  formData.set("nationalId", data.nationalId);
  formData.set("file", data.file);
  return apiRequest<{ message: string; profile: ApiUser["designerProfile"] }>(
    `/api/designers/${userId}/upload_id`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function getConversations() {
  return apiRequest<ApiConversation[]>("/api/messages/conversations");
}

export function getMessages(userId: string) {
  return apiRequest<ApiMessage[]>(`/api/messages/${userId}`);
}

export function sendMessage(userId: string, text: string) {
  return apiRequest<ApiMessage>(`/api/messages/${userId}`, {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function askStyleAssistant(data: { message: string; productId?: string; categoryId?: string }) {
  return apiRequest<ApiStyleAssistantResponse>("/api/ai/style-assistant", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function generateProductDescription(data: {
  name: string;
  categoryName: string;
  keywords?: string;
}) {
  return apiRequest<ApiProductDescriptionResponse>("/api/ai/product-description", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function suggestImageTags(data: { name: string; imageUrl: string }) {
  return apiRequest<ApiImageTagsResponse>("/api/ai/image-tags", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function smartSearchProducts(query: {
  q?: string;
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  baseUrl?: string;
}) {
  const { baseUrl, ...params } = query;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });
  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiRequest<ApiSmartSearchResponse>(`/api/ai/search${suffix}`, { baseUrl });
}

export function getLoggedInUser() {
  return apiRequest<ApiUser>("/api/auth/loggedin_users");
}

export function getUser(id: string) {
  return apiRequest<ApiUser>(`/api/users/${id}`);
}

export function getAdminOverview() {
  return apiRequest<ApiAdminOverview>("/api/admin/overview");
}

export function getAdminUsers() {
  return apiRequest<ApiUser[]>("/api/admin/users");
}

export function getAdminDesigners() {
  return apiRequest<ApiAdminDesigner[]>("/api/admin/designers");
}

export function verifyAdminDesigner(userId: string, action: "approve" | "reject") {
  return apiRequest<ApiAdminDesigner>(`/api/admin/verify_designer/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ action }),
  });
}

export function getAdminOrders(query: { status?: string; dateFrom?: string; dateTo?: string } = {}) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<ApiOrder[]>(`/api/admin/orders${suffix}`);
}

export type GuestCartItem = {
  productId: string;
  quantity: number;
};

export function getGuestCart() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.productId && item.quantity > 0) as GuestCartItem[];
  } catch {
    return [];
  }
}

export function setGuestCart(items: GuestCartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("guest-cart-updated"));
}

export function addGuestCartItem(productId: string, quantity = 1) {
  const items = getGuestCart();
  const existing = items.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ productId, quantity });
  }
  setGuestCart(items);
}

export async function mergeGuestCartIntoAccount(token?: string | null) {
  const items = getGuestCart();
  if (items.length === 0) return;

  await Promise.all(
    items.map((item) =>
      apiRequest<ApiCartResponse>("/api/cart", {
        method: "POST",
        token,
        body: JSON.stringify(item),
      })
    )
  );
  setGuestCart([]);
}
