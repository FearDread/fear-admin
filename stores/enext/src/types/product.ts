/* Products */

export interface Product {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  category?: string;
  categoryId?: string;
  price?: number;
  salePrice?: number;
  quantity?: number;
  rating?: number;
  reviewCount?: number;
  sku?: string;
  brand?: string;
  description?: string;
  shortDescription?: string;
  deliveryInfo?: string;
  inStock?: boolean;
  sizes?: string[];
  colors?: string[];
  images?: { url: string }[];
  image?: string;
  [key: string]: unknown;
}