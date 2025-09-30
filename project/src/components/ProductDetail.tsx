import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Package, Truck } from 'lucide-react';
import { dbFunctions } from '../lib/database';
import { Product } from '../types/database';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { formatPrice, getPromotionPrice } from '../utils/formatters';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';
import { Badge } from './ui/Badge';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onBack }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const productData = await dbFunctions.getProductById(productId);
      setProduct(productData || null);
    } catch (err) {
      setError('Erro ao carregar produto');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    } catch (err) {
      console.error('Falha ao copiar o link: ', err);
      alert('Não foi possível copiar o link.');
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(() => copyToClipboard()); // Fallback to copy if share is cancelled or fails
    } else {
      await copyToClipboard();
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id);
      } else {
        addToFavorites(product);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={loadProduct} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
          <button
            onClick={onBack}
            className="text-red-600 hover:text-red-700 font-semibold"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = getPromotionPrice(
    product.price,
    product.is_on_promotion,
    product.promotion_discount
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center text-red-600 hover:text-red-700 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2" size={20} />
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 lg:h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {product.is_featured && (
                  <Badge variant="warning">
                    <Star className="mr-1" size={14} />
                    Destaque
                  </Badge>
                )}
                {product.is_on_promotion && (
                  <Badge variant="error">
                    -{product.promotion_discount}% OFF
                  </Badge>
                )}
              </div>

              {/* Stock Status */}
              {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                <div className="absolute bottom-4 left-4">
                  <Badge variant="warning">
                    Últimas unidades!
                  </Badge>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                {product.is_on_promotion && product.promotion_discount > 0 ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500 text-xl line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(finalPrice)}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      Economia de {formatPrice(product.price - finalPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-red-600">
                    {formatPrice(finalPrice)}
                  </span>
                )}
              </div>

              {/* Stock and Shipping Info */}
              <div className="flex items-center space-x-6 mb-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Package className="mr-2" size={16} />
                  <span>
                    {product.stock_quantity > 0 
                      ? `${product.stock_quantity} em estoque`
                      : 'Fora de estoque'
                    }
                  </span>
                </div>
                <div className="flex items-center">
                  <Truck className="mr-2" size={16} />
                  <span>Entrega em 2-5 dias úteis</span>
                </div>
              </div>

              {/* Quantity Selector */}
              {product.stock_quantity > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade:
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-semibold min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="border border-gray-300 rounded-lg p-2 hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2" size={20} />
                  {product.stock_quantity === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
                </button>
                
                <button
                  onClick={handleShare}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Share2 className="mr-2" size={20} />
                  Compartilhar
                </button>
                
                <button
                  onClick={handleToggleFavorite}
                  className={`border font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
                    isFavorite(product.id)
                      ? 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="mr-2" size={20} />
                  {isFavorite(product.id) ? 'Favoritado' : 'Favoritar'}
                </button>
              </div>

              {/* Tabs */}
              <div className="border-t pt-6">
                <div className="flex space-x-6 mb-4">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`font-semibold pb-2 border-b-2 transition-colors ${
                      activeTab === 'description'
                        ? 'text-red-600 border-red-600'
                        : 'text-gray-600 border-transparent hover:text-red-600'
                    }`}
                  >
                    Descrição Detalhada
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`font-semibold pb-2 border-b-2 transition-colors ${
                      activeTab === 'specs'
                        ? 'text-red-600 border-red-600'
                        : 'text-gray-600 border-transparent hover:text-red-600'
                    }`}
                  >
                    Especificações
                  </button>
                </div>

                <div className="text-gray-700 leading-relaxed">
                  {activeTab === 'description' ? (
                    <div className="whitespace-pre-line">
                      {product.detailed_description}
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">
                      {product.technical_specs}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};