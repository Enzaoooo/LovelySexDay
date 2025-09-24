import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Cart } from './components/Cart';
import { ProductModal } from './components/ProductModal';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { useCart } from './hooks/useCart';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useProductMetrics } from './hooks/useProductMetrics';
import { 
  initialProducts, 
  categories, 
  initialCarouselItems, 
  initialAdmin 
} from './data/initialData';
import { Product, Category, CarouselItem, Admin, AdminSession } from './types';

type AppView = 'home' | 'category' | 'admin-login' | 'admin-dashboard';

function App() {
  // State management
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Data state with localStorage persistence
  const [products, setProducts] = useLocalStorage<Product[]>('products', initialProducts);
  const [carouselItems, setCarouselItems] = useLocalStorage<CarouselItem[]>('carousel', initialCarouselItems);
  const [admins, setAdmins] = useLocalStorage<Admin[]>('admins', [initialAdmin]);
  const [whatsappNumber, setWhatsappNumber] = useLocalStorage<string>('whatsappNumber', '(12) 98222-6485');
  
  // Admin session
  const [adminSession, setAdminSession] = useState<AdminSession>({
    isAuthenticated: false,
    admin: null
  });

  // Custom hooks
  const cart = useCart();
  const { incrementView, getProductViews, getMostViewedProducts } = useProductMetrics();

  // Initialize data if empty
  useEffect(() => {
    if (products.length === 0) {
      setProducts(initialProducts);
    }
    if (carouselItems.length === 0) {
      setCarouselItems(initialCarouselItems);
    }
    if (admins.length === 0) {
      setAdmins([initialAdmin]);
    }
  }, []);

  // Derived data
  const featuredProducts = products.filter(p => p.featured);
  const mostViewedProducts = getMostViewedProducts(products, 6);

  // Event handlers
  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setCurrentView('category');
  };

  const handleProductClick = (product: Product) => {
    incrementView(product.id);
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    cart.addToCart(product);
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    setCurrentView('home');
  };

  // Admin functions
  const handleAdminLogin = (username: string, password: string): boolean => {
    const admin = admins.find(a => a.username === username && a.password === password);
    if (admin) {
      setAdminSession({ isAuthenticated: true, admin });
      setCurrentView('admin-dashboard');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setAdminSession({ isAuthenticated: false, admin: null });
    setCurrentView('home');
  };

  // Get products by category
  const getCategoryProducts = (categoryName: string) => {
    return products.filter(p => p.category === categoryName);
  };

  // Check for admin access
  useEffect(() => {
    const isAdminPath = window.location.pathname === '/LovelySexDay/admin';
    if (isAdminPath) {
      setCurrentView(adminSession.isAuthenticated ? 'admin-dashboard' : 'admin-login');
    }
  }, [adminSession.isAuthenticated]);

  // Admin routes
  if (currentView === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  if (currentView === 'admin-dashboard') {
    return (
      <AdminDashboard
        products={products}
        categories={categories}
        carouselItems={carouselItems}
        admins={admins}
        whatsappNumber={whatsappNumber}
        onUpdateProducts={setProducts}
        onUpdateCategories={() => {}} // Categories are static for now
        onUpdateCarousel={setCarouselItems}
        onUpdateAdmins={setAdmins}
        onUpdateWhatsappNumber={setWhatsappNumber}
        onLogout={handleAdminLogout}
        getProductViews={getProductViews}
      />
    );
  }

  // Main app layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      <Header 
        cartItemsCount={cart.getCartItemsCount()} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            carouselItems={carouselItems}
            categories={categories}
            allProducts={products}
            featuredProducts={featuredProducts}
            mostViewedProducts={mostViewedProducts}
            onCategoryClick={handleCategoryClick}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            getProductViews={getProductViews}
          />
        )}

        {currentView === 'category' && selectedCategory && (
          <CategoryPage
            category={selectedCategory}
            products={getCategoryProducts(selectedCategory.name)}
            onBack={handleBackToHome}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            getProductViews={getProductViews}
          />
        )}
      </main>

      <Footer whatsappNumber={whatsappNumber} />

      {/* Cart Modal */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart.cartItems}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        total={cart.getCartTotal()}
        onClearCart={cart.clearCart}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={handleAddToCart}
        views={selectedProduct ? getProductViews(selectedProduct.id) : 0}
      />

      {/* Admin button removed */}
    </div>
  );
}

export default App;