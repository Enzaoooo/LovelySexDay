import { Product, Category, CarouselItem, Admin } from '../types';

// Dados iniciais para demonstração
export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Vibrador Premium Rose Gold',
    description: 'Vibrador de luxo com 12 velocidades e design ergonômico',
    price: 199.90,
    image: 'https://images.unsplash.com/photo-1585652757289-da1943421815?w=400&h=400&fit=crop',
    category: 'Vibradores',
    views: 45,
    featured: true
  },
  {
    id: '2',
    name: 'Óleo Corporal Afrodisíaco',
    description: 'Óleo corporal com fragrância afrodisíaca e textura sedosa',
    price: 59.90,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
    category: 'Cosméticos',
    views: 38,
    featured: true
  },
  {
    id: '3',
    name: 'Fantasia Sensual Vermelha',
    description: 'Lingerie sensual em renda francesa com detalhes dourados',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1594736797933-d0361ba4d295?w=400&h=400&fit=crop',
    category: 'Fantasias',
    views: 52,
    featured: true
  },
  {
    id: '4',
    name: 'Algemas de Veludo',
    description: 'Algemas macias com acabamento em veludo premium',
    price: 79.90,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    category: 'Acessórios',
    views: 29
  },
  {
    id: '5',
    name: 'Prótese Realística',
    description: 'Prótese com material ultra realista e base ventosa',
    price: 149.90,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    category: 'Próteses',
    views: 31
  },
  {
    id: '6',
    name: 'Kit Anal Iniciante',
    description: 'Kit completo para iniciantes com 3 tamanhos diferentes',
    price: 119.90,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    category: 'Para uso Anal',
    views: 27
  }
];

export const initialCategories: Category[] = [
  { id: '1', name: 'Acessórios', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', productCount: 0 },
  { id: '2', name: 'Cosméticos', image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=200&fit=crop', productCount: 0 },
  { id: '3', name: 'Fantasias', image: 'https://images.unsplash.com/photo-1594736797933-d0361ba4d295?w=300&h=200&fit=crop', productCount: 0 },
  { id: '4', name: 'Masturbadores', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop', productCount: 0 },
  { id: '5', name: 'Para uso Anal', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=200&fit=crop', productCount: 0 },
  { id: '6', name: 'Próteses', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop', productCount: 0 },
  { id: '7', name: 'Sado', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', productCount: 0 },
  { id: '8', name: 'Vibradores', image: 'https://images.unsplash.com/photo-1585652757289-da1943421815?w=300&h=200&fit=crop', productCount: 0 }
];

export const initialCarouselItems: CarouselItem[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=1200&h=400&fit=crop',
    title: 'Novidades em Vibradores',
    description: 'Descubra nossa nova linha premium com até 30% OFF'
  },
  {
    id: '2', 
    image: 'https://images.unsplash.com/photo-1594736797933-d0361ba4d295?w=1200&h=400&fit=crop',
    title: 'Fantasias Sensuais',
    description: 'Lingerie exclusiva para momentos especiais'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=1200&h=400&fit=crop', 
    title: 'Cosméticos Íntimos',
    description: 'Linha completa de produtos para seu bem-estar'
  }
];

export const initialAdmin: Admin = {
  id: '1',
  username: 'admin',
  password: 'admin123', // Em produção seria hash
  email: 'admin@lovelysexday.com',
  createdAt: new Date().toISOString()
};