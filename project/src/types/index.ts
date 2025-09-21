export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  shortDescription: string;
  category: string;
  images: string[];
  specifications: Record<string, string>;
  usage: string;
  status: 'active' | 'inactive';
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
}

export interface AppConfig {
  whatsappNumber: string;
  storeName: string;
  storeDescription: string;
}