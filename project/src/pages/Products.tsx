import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Promotion } from '../lib/types';
import { ProductCard } from '../components/ProductCard';
import { CategoryGrid } from '../components/CategoryGrid';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const Products = () => {
  const query = useQuery();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState(query.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(query.get('category') || 'all');
  const [priceRange, setPriceRange] = useState<'all' | 'under50' | '50to100' | '100to200' | 'over200'>('all');
  const [inStock, setInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc' | 'newest'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const urlSearchTerm = query.get('search');
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
    const urlCategory = query.get('category');
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory('all');
    }
  }, [query]);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, selectedCategory, priceRange, inStock, sortBy]);

  const loadData = async () => {
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: promosData } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true);

    if (productsData) setProducts(productsData);
    if (promosData) setPromotions(promosData);
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      const categoryId = parseInt(selectedCategory, 10);
      filtered = filtered.filter(p => p.category_id === categoryId);
    }

    if (priceRange !== 'all') {
      filtered = filtered.filter(p => {
        switch (priceRange) {
          case 'under50':
            return p.price < 50;
          case '50to100':
            return p.price >= 50 && p.price < 100;
          case '100to200':
            return p.price >= 100 && p.price < 200;
          case 'over200':
            return p.price >= 200;
          default:
            return true;
        }
      });
    }

    if (inStock) {
      filtered = filtered.filter(p => p.stock_quantity > 0);
    }

    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange('all');
    setInStock(false);
    setSortBy('newest');
  };

  const getPromotionForProduct = (productId: string) => {
    return promotions.find(p => p.product_ids.includes(productId));
  };

  return (
    <div className="min-h-screen bg-black pt-24">
      <CategoryGrid />
      <div className="container-custom py-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            Todos os Produtos
          </h1>
          <p className="text-neutral-400">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80 space-y-6`}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-gold hover:text-gold-light transition-colors"
                >
                  Limpar
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Nome do produto..."
                      className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Faixa de Preço
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="all">Todos os Preços</option>
                    <option value="under50">Até R$ 50</option>
                    <option value="50to100">R$ 50 - R$ 100</option>
                    <option value="100to200">R$ 100 - R$ 200</option>
                    <option value="over200">Acima de R$ 200</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-5 h-5 rounded bg-black border-neutral-800 text-gold focus:ring-gold focus:ring-offset-0"
                    />
                    <span className="text-sm text-neutral-300">Apenas em Estoque</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Ordenar Por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-4 py-3 bg-black border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="newest">Mais Recentes</option>
                    <option value="name">Nome (A-Z)</option>
                    <option value="price-asc">Menor Preço</option>
                    <option value="price-desc">Maior Preço</option>
                  </select>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full mb-6 py-3 px-6 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:border-gold transition-colors"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? 'Esconder Filtros' : 'Mostrar Filtros'}
            </button>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-neutral-600" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-neutral-400 mb-6">
                  Tente ajustar os filtros para encontrar o que procura
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-wine text-white font-semibold rounded-lg hover:bg-wine-light transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    promotion={getPromotionForProduct(product.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};