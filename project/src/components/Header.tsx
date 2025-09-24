import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Heart } from 'lucide-react';

interface HeaderProps {
  cartItemsCount?: number;
  onCartClick?: () => void;
}

export function Header({ cartItemsCount = 0, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-rose-600 via-rose-500 to-orange-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-rose-200" fill="currentColor" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-rose-100 bg-clip-text text-transparent">
              LovelySexDay
            </h1>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-rose-200 transition-colors font-medium"
            >
              Início
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('categorias');
                if (element) {
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - 80;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="hover:text-rose-200 transition-colors font-medium"
            >
              Categorias
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('produtos');
                if (element) {
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - 80;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="hover:text-rose-200 transition-colors font-medium"
            >
              Produtos
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('contato');
                if (element) {
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - 80;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="hover:text-rose-200 transition-colors font-medium"
            >
              Contato
            </button>
          </nav>

          {/* Cart and Menu */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-white/20 mt-2 pt-4">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="hover:text-rose-200 transition-colors font-medium text-left"
              >
                Início
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('categorias');
                  if (element) {
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - 80;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                  setIsMenuOpen(false);
                }}
                className="hover:text-rose-200 transition-colors font-medium text-left"
              >
                Categorias
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('produtos');
                  if (element) {
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - 80;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                  setIsMenuOpen(false);
                }}
                className="hover:text-rose-200 transition-colors font-medium text-left"
              >
                Produtos
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('contato');
                  if (element) {
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - 80;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                  setIsMenuOpen(false);
                }}
                className="hover:text-rose-200 transition-colors font-medium text-left"
              >
                Contato
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}