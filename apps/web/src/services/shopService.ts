import { api } from "../api/client";

// Categories
export const getShopCategories = () => {
  return api.get("/shop/categories");
};

export const createShopCategory = (payload: any) => {
  return api.post("/shop/categories", payload);
};

export const updateShopCategory = (uuid: string, payload: any) => {
  return api.patch(`/shop/categories/${uuid}`, payload);
};

export const deleteShopCategory = (uuid: string) => {
  return api.delete(`/shop/categories/${uuid}`);
};

// Products
export const getShopProducts = (params?: any) => {
  return api.get("/shop/products", { params });
};

export const getShopProductByUuid = (uuid: string) => {
  return api.get(`/shop/products/${uuid}`);
};

export const createShopProduct = (payload: any) => {
  return api.post("/shop/products", payload);
};

export const updateShopProduct = (uuid: string, payload: any) => {
  return api.patch(`/shop/products/${uuid}`, payload);
};

export const deleteShopProduct = (uuid: string) => {
  return api.delete(`/shop/products/${uuid}`);
};

export const uploadShopProductImage = (uuid: string, file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  return api.post(`/shop/products/${uuid}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteShopProductImage = (uuid: string) => {
  return api.delete(`/shop/product-images/${uuid}`);
};

// Wishlist
export const toggleWishlist = (productUuid: string) => {
  return api.post(`/shop/wishlist/${productUuid}/toggle`);
};

export const getMyWishlist = () => {
  return api.get("/shop/wishlist/me");
};

// Cart
export const getMyCart = () => {
  return api.get("/shop/cart/me");
};

export const addToCart = (payload: {
  product_uuid: string;
  quantity: number;
}) => {
  return api.post("/shop/cart/items", payload);
};

export const updateCartItem = (
  itemUuid: string,
  payload: { quantity: number },
) => {
  return api.patch(`/shop/cart/items/${itemUuid}`, payload);
};

export const removeCartItem = (itemUuid: string) => {
  return api.delete(`/shop/cart/items/${itemUuid}`);
};

// Shipping Address
export const createShippingAddress = (payload: any) => {
  return api.post("/shop/shipping-addresses", payload);
};

export const getMyShippingAddresses = () => {
  return api.get("/shop/shipping-addresses/me");
};

// Orders
export const createProductOrder = (payload: any) => {
  return api.post("/shop/orders", payload);
};

export const verifyProductPayment = (payload: any) => {
  return api.post("/shop/orders/verify-payment", payload);
};

export const getMyProductOrders = () => {
  return api.get("/shop/orders/me");
};

export const getAllProductOrders = (params?: any) => {
  return api.get("/shop/orders", { params });
};

export const updateProductOrderStatus = (uuid: string, payload: any) => {
  return api.patch(`/shop/orders/${uuid}/status`, payload);
};

export const getShopInventoryLogs = (params?: any) => {
  return api.get("/shop/inventory-logs", { params });
};

export const getShopReportsSummary = () => {
  return api.get("/shop/reports/summary");
};

export const getShopRefunds = (params?: any) => {
  return api.get("/shop/refunds", { params });
};

export const refundProductOrder = (uuid: string, payload: any) => {
  return api.post(`/shop/orders/${uuid}/refund`, payload);
};

export const updateProductShipping = (uuid: string, payload: any) => {
  return api.patch(`/shop/orders/${uuid}/shipping`, payload);
};

export const getMyProductOrderByUuid = (uuid: string) => {
  return api.get(`/shop/orders/me/${uuid}`);
};

// =====================
// Coupons
// =====================

export const getShopCoupons = (params?: any) => {
  return api.get("/shop/coupons", { params });
};

export const createShopCoupon = (payload: any) => {
  return api.post("/shop/coupons", payload);
};

export const updateShopCoupon = (uuid: string, payload: any) => {
  return api.patch(`/shop/coupons/${uuid}`, payload);
};

export const deleteShopCoupon = (uuid: string) => {
  return api.delete(`/shop/coupons/${uuid}`);
};

export const applyShopCoupon = (payload: { code: string }) => {
  return api.post("/shop/coupons/apply", payload);
};

// =====================
// Product Reviews
// =====================

export const createProductReview = (
  productUuid: string,
  payload: {
    rating: number;
    review_text?: string;
  },
) => {
  return api.post(`/shop/products/${productUuid}/reviews`, payload);
};

export const getProductReviews = (productUuid: string) => {
  return api.get(`/shop/products/${productUuid}/reviews`);
};

export const getAllProductReviews = (params?: any) => {
  return api.get("/shop/reviews", { params });
};

export const updateProductReviewStatus = (
  uuid: string,
  payload: {
    status: "pending" | "approved" | "rejected";
  },
) => {
  return api.patch(`/shop/reviews/${uuid}/status`, payload);
};