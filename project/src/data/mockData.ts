import { Product, Category } from '../types';

export const mockCategories: Category[] = [
  { id: '1', name: 'Lingerie', slug: 'lingerie', image: 'https://images.pexels.com/photos/6371999/pexels-photo-6371999.jpeg' },
  { id: '2', name: 'Acessórios', slug: 'acessorios', image: 'https://images.pexels.com/photos/6994314/pexels-photo-6994314.jpeg' },
  { id: '3', name: 'Cosméticos', slug: 'cosmeticos', image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg' },
  { id: '4', name: 'Produtos Íntimos', slug: 'produtos-intimos', image: 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg' },
  { id: '5', name: 'Fantasias', slug: 'fantasias', image: 'https://images.pexels.com/photos/6372037/pexels-photo-6372037.jpeg' },
  { id: '6', name: 'Perfumes', slug: 'perfumes', image: 'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg' }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Conjunto Sensual Romance',
    price: 89.90,
    description: 'Conjunto íntimo em renda delicada com detalhes em cetim. Peça confeccionada com materiais de alta qualidade para máximo conforto e sensualidade.',
    shortDescription: 'Conjunto íntimo em renda delicada',
    category: '1',
    images: [
      'https://images.pexels.com/photos/6371999/pexels-photo-6371999.jpeg',
      'https://images.pexels.com/photos/6372037/pexels-photo-6372037.jpeg'
    ],
    specifications: {
      'Material': 'Renda e cetim',
      'Tamanhos': 'P, M, G, GG',
      'Cores': 'Preto, Vermelho, Branco',
      'Cuidados': 'Lavar à mão com água fria'
    },
    usage: 'Use com cuidado ao vestir para não danificar a renda. Recomenda-se lavar à mão separadamente.',
    status: 'active',
    featured: true
  },
  {
    id: '2',
    name: 'Óleo Massagem Relaxante',
    price: 45.50,
    description: 'Óleo para massagem com aroma suave e textura sedosa. Fórmula especial que aquece com o toque, proporcionando momentos únicos de prazer e relaxamento.',
    shortDescription: 'Óleo para massagem com aroma suave',
    category: '3',
    images: [
      'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg',
      'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg'
    ],
    specifications: {
      'Volume': '100ml',
      'Aroma': 'Morango, Chocolate, Menta',
      'Efeito': 'Aquece com o toque',
      'Base': 'À base de água'
    },
    usage: 'Aplique uma pequena quantidade nas mãos e massageie suavemente sobre a pele limpa.',
    status: 'active',
    featured: true
  },
  {
    id: '3',
    name: 'Perfume Sedutor Premium',
    price: 120.00,
    description: 'Fragrância exclusiva com notas sensuais e marcantes. Desenvolvido especialmente para momentos íntimos, com fixação prolongada e aroma envolvente.',
    shortDescription: 'Fragrância exclusiva com notas sensuais',
    category: '6',
    images: [
      'https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg'
    ],
    specifications: {
      'Volume': '50ml',
      'Família Olfativa': 'Oriental Floral',
      'Notas': 'Baunilha, Almíscar, Rosa',
      'Fixação': '8-10 horas'
    },
    usage: 'Borrife nos pontos de pulsação: pulsos, pescoço e atrás das orelhas.',
    status: 'active',
    featured: false
  },
  {
    id: '4',
    name: 'Fantasia Enfermeira Deluxe',
    price: 78.90,
    description: 'Fantasia completa de enfermeira com tecido de alta qualidade. Inclui vestido, avental, touca e acessórios para uma experiência completa.',
    shortDescription: 'Fantasia completa de enfermeira',
    category: '5',
    images: [
      'https://images.pexels.com/photos/6372037/pexels-photo-6372037.jpeg'
    ],
    specifications: {
      'Tamanhos': 'P, M, G',
      'Material': 'Polyester e elastano',
      'Inclui': 'Vestido, avental, touca, meias',
      'Lavagem': 'Máquina, água fria'
    },
    usage: 'Vista com cuidado seguindo a sequência: vestido, avental, touca e acessórios.',
    status: 'active',
    featured: true
  }
];