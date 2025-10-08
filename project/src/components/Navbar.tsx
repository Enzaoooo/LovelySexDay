import { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Menu, X, Search } from 'lucide-react';
import { getCartCount } from '../lib/cart';
import { supabase } from '../lib/supabase';
import { getSessionId } from '../lib/session';
import { SiteSettings } from '../lib/types';
import { FavoritesModal } from './FavoritesModal';
import { CartModal } from './CartModal';
import { Input } from './ui/Input';

export const Navbar = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSettings();
    updateCartCount();
    updateFavoritesCount();

    const handleCartUpdate = () => updateCartCount();
    const handleFavoritesUpdate = () => updateFavoritesCount();
    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('favorites-updated', handleFavoritesUpdate);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('favorites-updated', handleFavoritesUpdate);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .maybeSingle();

    if (data) {
      setSettings(data);
    }
  };

  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  const updateFavoritesCount = async () => {
    const sessionId = getSessionId();
    const { count } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId);

    setFavoritesCount(count || 0);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `#/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
          isScrolled
            ? 'bg-black/95 backdrop-blur-md border-b border-neutral-800'
            : 'bg-black border-b border-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <a href="#/" className="flex items-center gap-3 group">
                {settings?.logo_url ? (
                  <img
                    src={settings.logo_url}
                    alt={settings.site_name}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-white group-hover:text-gold transition-colors duration-300" translate="no">
                    {settings?.site_name || 'Lovely Sex Day'}
                  </h1>
                )}
              </a>
              <div className="hidden lg:flex items-center gap-8">
                <a href="#/" className="text-neutral-300 hover:text-gold transition-colors duration-300 font-medium tracking-wide text-sm uppercase">Início</a>
                <a href="#/products" className="text-neutral-300 hover:text-gold transition-colors duration-300 font-medium tracking-wide text-sm uppercase">Produtos</a>
                <a href="#/promotions" className="text-neutral-300 hover:text-gold transition-colors duration-300 font-medium tracking-wide text-sm uppercase">Promoções</a>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              <div className="hidden md:flex items-center justify-center px-8 lg:px-16">
                <form onSubmit={handleSearch} className="w-full max-w-xs relative">
                  <Input
                    type="text"
                    placeholder="Pesquisar..."
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400 rounded-full py-2 pl-10 pr-4 w-full focus:ring-gold focus:border-gold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gold">
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFavorites(true)}
                  className="relative p-3 text-neutral-300 hover:text-magenta transition-all duration-500 group rounded-2xl hover:bg-neutral-900/50 backdrop-blur-sm"
                  aria-label="Favorites"
                >
                  <Heart className="w-6 h-6 group-hover:scale-125 transition-transform duration-500 group-hover:drop-shadow-lg" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-magenta text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                      {favoritesCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setShowCart(true)}
                  className="relative p-3 text-neutral-300 hover:text-wine transition-all duration-500 group rounded-2xl hover:bg-neutral-900/50 backdrop-blur-sm"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-6 h-6 group-hover:scale-125 transition-transform duration-500 group-hover:drop-shadow-lg" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-wine text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-3 text-neutral-300 hover:text-gold transition-all duration-500 rounded-2xl hover:bg-neutral-900/50 backdrop-blur-sm transform hover:scale-110"
                  aria-label="Menu"
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden pb-6 border-t border-neutral-800 mt-2 pt-6 animate-slide-up">
              <div className="flex flex-col gap-4">
                <form onSubmit={handleSearch} className="w-full relative mb-4">
                  <Input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    className="bg-neutral-800 border-neutral-700 text-white placeholder-neutral-400 rounded-full py-2 pl-10 pr-4 w-full focus:ring-gold focus:border-gold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-gold">
                    <Search className="w-5 h-5" />
                  </button>
                </form>

                <a href="#/" onClick={() => setIsMenuOpen(false)} className="text-neutral-300 hover:text-gold transition-colors duration-300 font-medium tracking-wide text-sm uppercase py-2">Início</a>
                <a href="#/products" onClick={() => setIsMenuOpen(false)} className="text-neutral-300 hover:text-gold transition-colors duration-300 font-medium tracking-wide text-sm uppercase py-2">Produtos</a>
                <a href="#/promotions" onClick={() => setIsMenuOpen(false)} className="text-neutral-300 hover:text-gold transition-colors duration-300 font-medium tracking-wide text-sm uppercase py-2">Promoções</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="h-20" />

      <FavoritesModal
        isOpen={showFavorites}
        onClose={() => {
          setShowFavorites(false);
          updateFavoritesCount();
        }}
      />

      <CartModal
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </>
  );
};