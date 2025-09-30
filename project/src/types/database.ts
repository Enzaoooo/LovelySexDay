export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  detailed_description: string;
  technical_specs: string;
  image_url: string;
  category_id: number;
  access_count: number;
  is_featured: boolean;
  is_on_promotion: boolean;
  promotion_discount: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  image_url: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CarouselImage {
  id: number;
  image_url: string;
  title: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Administrator {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
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

export interface SiteSettings {
  id: number;
  whatsapp_number: string;
  site_name: string;
  created_at: string;
  updated_at: string;
}