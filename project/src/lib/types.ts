export interface Category {
  id: number;
  name: string;
  image_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  detailed_description: string | null;
  technical_specs: string | null;
  image_url: string | null;
  images: string[] | null;
  category_id: number | null;
  stock_quantity: number;
  is_featured: boolean;
  is_on_promotion: boolean;
  promotion_discount: number;
  access_count: number;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: number;
  name: string;
  discount_percentage: number;
  product_ids: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarouselImage {
  id: number;
  image_url: string;
  title: string | null;
  order_index: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: number;
  whatsapp_number: string | null;
  site_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: number;
  session_id: string;
  product_id: number;
  created_at: string;
}

export interface Cart {
  id: number;
  session_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  promotion?: Promotion;
}

export interface ProductWithPromotion extends Product {
  promotion?: Promotion;
}

export interface Administrator {
  id: string;
  email: string;
  username: string;
  created_at: string;
}
