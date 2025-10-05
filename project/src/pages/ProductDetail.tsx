import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Share2, Package, ChevronLeft, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getSessionId } from '../lib/session';
import { Product, Promotion } from '../lib/types';
import { addToCart } from '../lib/cart';

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    setLoading(true);

    const productId = parseInt(slug || '0');
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .maybeSingle();

    if (productData) {
      setProduct(productData);

      await supabase
        .from('products')
        .update({ access_count: (productData.access_count || 0) + 1 })
        .eq('id', productData.id);

      const { data: promos } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true);

      if (promos) {
        const activePromo = promos.find(p => p.product_ids.includes(productData.id));
        if (activePromo) setPromotion(activePromo);
      }

      const sessionId = getSessionId();
      const { data: favoriteData } = await supabase
        .from('favorites')
        .select('id')
        .eq('session_id', sessionId)
        .eq('product_id', productData.id)
        .maybeSingle();

      setIsFavorited(!!favoriteData);
    }

    setLoading(false);
  };

  const toggleFavorite = async () => {
    if (!product) return;

    const sessionId = getSessionId();

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('session_id', sessionId)
          .eq('product_id', product.id);
        setIsFavorited(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ session_id: sessionId, product_id: product.id });
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const hasPromotion = promotion && promotion.is_active;
      addToCart(product, hasPromotion ? promotion : undefined);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-6">Produto não encontrado</h2>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-wine text-white font-medium tracking-wider hover:bg-wine-light transition-all duration-300"
          >
            VOLTAR À HOME
          </button>
        </div>
      </div>
    );
  }

  const hasPromotion = promotion && promotion.is_active;
  const displayPrice = hasPromotion ? product.price * (1 - promotion.discount_percentage / 100) : product.price;
  const discountPercent = hasPromotion && promotion.discount_percentage;

  return (
    <div className="min-h-screen bg-black">
      <button
        onClick={() => navigate('/')}
        className="fixed top-24 left-8 z-20 p-4 bg-black-light border border-neutral-800 hover:border-gold text-white transition-all duration-300 group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
      </button>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="relative">
            <div className="sticky top-32">
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-800">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-32 h-32 text-neutral-700" />
                  </div>
                )}

                {product.is_featured && (
                  <div className="absolute top-6 right-6 px-4 py-2 bg-gold text-black text-sm font-semibold tracking-wider">
                    DESTAQUE
                  </div>
                )}
                {discountPercent && (
                  <div className="absolute top-6 left-6 px-4 py-2 bg-magenta text-white text-sm font-semibold tracking-wider">
                    -{discountPercent}%
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={toggleFavorite}
                  className="flex-1 py-4 bg-black-light border border-neutral-800 hover:border-magenta text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      isFavorited ? 'fill-magenta text-magenta' : ''
                    }`}
                  />
                  {isFavorited ? 'FAVORITADO' : 'FAVORITAR'}
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 bg-black-light border border-neutral-800 hover:border-gold text-white transition-all duration-300"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="font-display text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                {hasPromotion && (
                  <span className="text-2xl text-neutral-500 line-through font-light">
                    R$ {product.price.toFixed(2)}
                  </span>
                )}
                <span className="text-5xl font-display font-bold text-gold">
                  R$ {displayPrice.toFixed(2)}
                </span>
              </div>

              {product.stock_quantity > 0 ? (
                <div className="flex items-center gap-2 text-green-400 mb-8">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm tracking-wider">EM ESTOQUE</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-neutral-500 mb-8">
                  <div className="w-2 h-2 bg-neutral-500 rounded-full"></div>
                  <span className="text-sm tracking-wider">ESGOTADO</span>
                </div>
              )}
            </div>

            {product.description && (
              <div className="border-t border-neutral-800 pt-8">
                <h3 className="font-display text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <div className="w-1 h-6 bg-gold"></div>
                  Descrição
                </h3>
                <p className="text-neutral-300 leading-relaxed text-lg font-light whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {product.detailed_description && (
              <div className="border-t border-neutral-800 pt-8">
                <h3 className="font-display text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                  <div className="w-1 h-6 bg-gold"></div>
                  Detalhes
                </h3>
                <p className="text-neutral-300 leading-relaxed text-lg font-light whitespace-pre-line">
                  {product.detailed_description}
                </p>
              </div>
            )}

            {product.technical_specs && (
              <div className="bg-black-light border border-neutral-800 p-8">
                <h3 className="font-display text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-gold"></div>
                  Especificações Técnicas
                </h3>
                <div className="text-neutral-300 leading-relaxed text-lg font-light whitespace-pre-line">
                  {product.technical_specs}
                </div>
              </div>
            )}

            <div className="border-t border-neutral-800 pt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                className="w-full py-5 bg-wine text-white font-semibold text-lg tracking-wider hover:bg-wine-light transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                {product.stock_quantity > 0 ? 'ADICIONAR AO CARRINHO' : 'PRODUTO INDISPONÍVEL'}
              </button>
            </div>

            <div className="bg-wine/10 border border-wine/30 p-8">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-display text-xl font-semibold text-white mb-2">Entrega Discreta</h4>
                  <p className="text-neutral-300 leading-relaxed font-light">
                    Todos os produtos são enviados em embalagens discretas, sem qualquer identificação externa do conteúdo.
                    Sua privacidade é nossa prioridade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
