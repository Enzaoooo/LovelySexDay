import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';

interface HeaderProps {
  onCategorySelect: (categoryId: string | null) => void;
  onSearchChange: (query: string) => void;
  onCartClick: () => void;
  categories: Category[];
}

export function Header({ onCategorySelect, onSearchChange, onCartClick, categories }: HeaderProps) {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img src="/img/Lovely Sex Day.svg" alt="Lovely Sex Day" className="h-12" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onCategorySelect(null)}
              className="text-gray-300 hover:text-accent transition-colors duration-200"
            >
              Todos os Produtos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className="text-gray-300 hover:text-accent transition-colors duration-200"
              >
                {category.name}
              </button>
            ))}
          </nav>

          {/* Search Bar and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-primary-dark text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light transition-all duration-200"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-300 hover:text-accent transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-primary-dark text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              <button
                onClick={() => {
                  onCategorySelect(null);
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-gray-300 hover:text-accent py-2"
              >
                Todos os Produtos
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategorySelect(category.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left text-gray-300 hover:text-accent py-2"
                >
                  {category.name}
                </button>
              ))}
              
              <button
                onClick={() => {
                  onCartClick();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 text-gray-300 hover:text-accent py-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Carrinho ({cartItemsCount})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}