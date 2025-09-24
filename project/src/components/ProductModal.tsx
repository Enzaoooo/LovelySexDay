import React, { useEffect } from 'react';
import { X, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  views?: number;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart, views }: ProductModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 md:h-96 object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
              />
              <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>{views || product.views} visualizações</span>
              </div>
              {product.featured && (
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 rounded-full font-medium">
                  Produto em Destaque
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-8">
              <div className="space-y-6">
                <div>
                  <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>
                </div>

                <div className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">
                  R$ {product.price.toFixed(2)}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Descrição</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Características</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Material premium e seguro</li>
                    <li>• Discreta e sigilosa</li>
                    <li>• Garantia de qualidade</li>
                    <li>• Entrega rápida e segura</li>
                  </ul>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-6 py-4 rounded-xl flex items-center justify-center space-x-3 font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Adicionar ao Carrinho</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}