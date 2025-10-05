import { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, Promotion } from '../lib/types';
import { addToCart } from '../lib/cart';
import { supabase } from '../lib/supabase';
import { getSessionId } from '../lib/session';

interface ProductCardProps {
  product: Product;
  promotion?: Promotion;
  onFavoriteChange?: () => void;
}

export const ProductCard = ({ product, promotion, onFavoriteChange }: ProductCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const productImages = product.images && product.images.length > 0
    ? product.images
    : product.image_url
    ? [product.image_url]
    : [];

  useEffect(() => {
    checkFavorite();
  }, [product.id]);

  const checkFavorite = async () => {
    const sessionId = getSessionId();
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('session_id', sessionId)
      .eq('product_id', product.id)
      .maybeSingle();

    setIsFavorited(!!data);
  };

  const hasPromotion = promotion && promotion.is_active;
  const displayPrice = hasPromotion ? product.price * (1 - promotion.discount_percentage / 100) : product.price;
  const discountPercent = hasPromotion && promotion.discount_percentage;

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);

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
      window.dispatchEvent(new Event('favorites-updated'));
      onFavoriteChange?.();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product, hasPromotion ? promotion : undefined);
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative cursor-pointer h-full"
    >
      <div className="relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 hover:border-gold transition-all duration-500 md:transform md:hover:-translate-y-2 h-full flex flex-col">
        {discountPercent && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10 px-2 py-0.5 md:px-3 md:py-1 bg-magenta text-white text-xs font-bold rounded-lg">
            -{discountPercent}%
          </div>
        )}

        <button
          onClick={toggleFavorite}
          disabled={loading}
          className="absolute top-2 left-2 md:top-3 md:left-3 z-10 p-1.5 md:p-2 bg-black/80 backdrop-blur-sm rounded-lg hover:bg-black transition-all duration-300 disabled:opacity-50"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 ${
              isFavorited ? 'fill-magenta text-magenta' : 'text-white'
            }`}
          />
        </button>

        <div className="aspect-[3/4] overflow-hidden bg-neutral-950 relative">
          {productImages.length > 0 ? (
            <>
              <img
                src={productImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {productImages.length > 1 && (
                <>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setCurrentImageIndex(index);
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-gold w-4'
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
                      }}
                      className="bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-sm"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
                      }}
                      className="bg-black/50 hover:bg-black/70 text-white p-1 rounded-full backdrop-blur-sm"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
              <span className="text-neutral-700 text-3xl md:text-5xl font-display">?</span>
            </div>
          )}
        </div>

        <div className="p-3 md:p-4 flex flex-col flex-grow">
          <h3 className="font-display text-sm md:text-lg text-white font-semibold mb-2 md:mb-3 line-clamp-2 flex-grow">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-1 md:gap-2 mb-2 md:mb-4">
            {hasPromotion && (
              <span className="text-xs md:text-sm text-neutral-500 line-through">
                R$ {product.price.toFixed(2)}
              </span>
            )}
            <span className="font-display text-lg md:text-2xl font-bold text-gold">
              R$ {displayPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_quantity <= 0}
            className="w-full py-2 md:py-3 bg-wine text-white font-semibold text-xs md:text-sm rounded-lg hover:bg-wine-light transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden md:inline">Adicionar ao Carrinho</span>
            <span className="md:hidden">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
