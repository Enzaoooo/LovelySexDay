// Tipos principais da aplicação
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  views: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export interface CarouselItem {
  id: string;
  image: string;
  title: string;
  description: string;
  link?: string;
}

export interface Admin {
  id: string;
  username: string;
  password: string; // Em produção, seria hash
  email: string;
  createdAt: string;
}

export interface AdminSession {
  isAuthenticated: boolean;
  admin: Admin | null;
}