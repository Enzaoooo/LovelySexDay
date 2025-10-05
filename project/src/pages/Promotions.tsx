import { useEffect, useState } from 'react';
import { Sparkles, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Promotion } from '../lib/types';
import { ProductCard } from '../components/ProductCard';

export const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);

    const { data: promosData } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .order('discount_percentage', { ascending: false });

    if (promosData && promosData.length > 0) {
      setPromotions(promosData);

      const productIds = promosData.flatMap(p => p.product_ids);
      if (productIds.length > 0) {
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds);

        if (productsData) {
          setProducts(productsData);
        }
      }
    }

    setLoading(false);
  };

  const getPromotionForProduct = (productId: string) => {
    return promotions.find(p => p.product_ids.includes(productId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Carregando promoções...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-24">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <Sparkles className="w-10 h-10 text-gold" />
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white">
              Promoções Especiais
            </h1>
            <Sparkles className="w-10 h-10 text-gold" />
          </div>
          <p className="text-neutral-400 text-lg">
            Aproveite nossas ofertas exclusivas por tempo limitado
          </p>
        </div>

        {promotions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              Nenhuma promoção ativa no momento
            </h3>
            <p className="text-neutral-400 mb-6">
              Fique atento! Em breve teremos ofertas incríveis para você
            </p>
            <a
              href="#/products"
              className="inline-block px-8 py-4 bg-wine text-white font-semibold rounded-lg hover:bg-wine-light transition-colors"
            >
              Ver Todos os Produtos
            </a>
          </div>
        ) : (
          <div className="space-y-16">
            {promotions.map((promotion) => {
              const promoProducts = products.filter(p =>
                promotion.product_ids.includes(p.id)
              );

              if (promoProducts.length === 0) return null;

              return (
                <div key={promotion.id} className="space-y-6">
                  <div className="bg-gradient-to-r from-magenta/20 to-wine/20 border border-magenta/30 rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                          {promotion.name}
                        </h2>
                        <div className="flex items-center gap-2 text-neutral-300">
                          <Clock className="w-5 h-5" />
                          <span>
                            Válido até {promotion.ends_at ? formatDate(promotion.ends_at) : 'Disponibilidade'}
                          </span>
                        </div>
                      </div>
                      <div className="inline-flex items-center justify-center px-6 py-3 bg-magenta rounded-full">
                        <span className="text-3xl md:text-4xl font-display font-bold text-white">
                          {promotion.discount_percentage}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {promoProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        promotion={promotion}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
