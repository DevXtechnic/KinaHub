import { API_BASE } from './api';

export const API = `${API_BASE}/products`;

export interface ProductImageType {
  id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

export interface CategoryType {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface BrandType {
  id: number;
  name: string;
  slug: string;
}

export interface SpecType {
  key: string;
  value: string;
}

export interface ProductType {
  id: number;
  name: string;
  slug: string;
  store?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  category: CategoryType;
  brand: BrandType | null;
  description: string;
  specifications: string;
  specs: SpecType[];
  price: string;
  discount_price: string | null;
  stock: number;
  rating: string;
  tag: string | null;
  is_featured: boolean;
  is_active: boolean;
  images: ProductImageType[];
}

export function productImage(product: ProductType) {
  return product.images.find((image) => image.is_primary)?.image_url || product.images[0]?.image_url || '';
}

export function price(product: ProductType) {
  return Number(product.discount_price || product.price);
}

export function formatPrice(value: number | string) {
  return `Rs. ${Number(value).toLocaleString()}`;
}
