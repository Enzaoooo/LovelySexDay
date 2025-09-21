import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useInitialData } from './hooks/useInitialData';

// Public components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/public/HomePage';
import { ProductGrid } from './components/public/ProductGrid';
import { ProductDetail } from './components/public/ProductDetail';
import { Cart } from './components/public/Cart';

// Admin components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { Product } from './types';

type View = 'home' | 'products' | 'product' | 'cart' | 'admin';

function AppContent() {
  const { state, dispatch } = useApp();
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useInitialData();

  // Check if we're on admin route
  React.useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) {
      setIsAdminRoute(true);
    }
  }, []);

  const handleAddToCart = (product: Product, quantity = 1) => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentView('products');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('products');
    }
  };

  // Admin routes
  if (isAdminRoute) {
    if (!state.isAuthenticated) {
      return <AdminLogin />;
    }
    return <AdminDashboard />;
  }

  // Public routes
  const renderCurrentView = () => {
    switch (currentView) {
      case 'products':
        return (
          <ProductGrid
            products={state.products}
            categories={state.categories}
            selectedCategoryId={selectedCategoryId}
            searchQuery={searchQuery}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        );
      case 'product':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentView('products')}
          />
        ) : (
          <HomePage
            products={state.products}
            categories={state.categories}
            onCategoryClick={handleCategorySelect}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        );
      case 'cart':
        return <Cart onBack={() => setCurrentView('home')} />;
      default:
        return (
          <HomePage
            products={state.products}
            categories={state.categories}
            onCategoryClick={handleCategorySelect}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header
        onCategorySelect={handleCategorySelect}
        onSearchChange={handleSearchChange}
        onCartClick={() => setCurrentView('cart')}
        categories={state.categories}
      />
      
      <main>
        {renderCurrentView()}
      </main>

      {currentView !== 'cart' && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;