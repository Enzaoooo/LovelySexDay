import React, { useState } from 'react';
import { Product } from '../../types';
import { Star, Minus, Plus, ArrowLeft } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
}

export function ProductDetail({ product, onAddToCart, onBack }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'usage'>('description');

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Voltar aos produtos</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
              {product.images[selectedImage] && (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-purple-500' : 'border-gray-700'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1 text-yellow-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <span className="text-gray-400">(5.0)</span>
              </div>
            </div>

            <div className="text-4xl font-bold text-purple-400">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Quantidade:</span>
              <div className="flex items-center bg-gray-800 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 text-white font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-700">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'description'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Descrição Detalhada
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'specifications'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Especificações Técnicas
              </button>
              <button
                onClick={() => setActiveTab('usage')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'usage'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                Modo de Uso
              </button>
            </div>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b border-gray-800 pb-2">
                    <span className="text-gray-400 font-medium w-32">{key}:</span>
                    <span className="text-white">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">{product.usage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}