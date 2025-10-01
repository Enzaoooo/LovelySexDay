import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Carousel } from './components/Carousel';
import { CategoryGrid } from './components/CategoryGrid';
import { CategorySection } from './components/CategorySection';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetail } from './components/ProductDetail';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { dbFunctions, initializeDatabase } from './lib/database';
import { Product, Category } from './types/database';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorMessage } from './components/ui/ErrorMessage';

type AppPage = 'home' | 'categories' | 'featured' | 'category-products' | 'product-detail' | 'admin-login' | 'admin-dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminSection, setAdminSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<{[key: number]: Product[]}>({});

  React.useEffect(() => {
    initializeApp();
    
    // Adicionar listener para teclas de atalho do admin
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setCurrentPage('admin-login');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize database connection
      await initializeDatabase();
      
      // Load initial data
      await loadInitialData();
    } catch (error) {
      console.error('Error initializing app:', error);
      setError('Erro ao carregar a aplicação. Usando dados de demonstração.');
      
      // Load initial data anyway (will use mock data)
      await loadInitialData();
    } finally {
      setIsLoading(false);
    }
  };
  const loadInitialData = async () => {
    try {
      const productsData = await dbFunctions.getProducts();
      const categoriesData = await dbFunctions.getCategories();
      setProducts(productsData);
      setCategories(categoriesData);
      
      // Organizar produtos por categoria
      const productsByCat: {[key: number]: Product[]} = {};
      for (const category of categoriesData) {
        const categoryProducts = productsData.filter(p => p.category_id === category.id);
        if (categoryProducts.length > 0) {
          productsByCat[category.id] = categoryProducts;
        }
      }
      setProductsByCategory(productsByCat);
    } catch (error) {
      console.error('Error loading initial data:', error);
      // Data will be empty, but app won't crash
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const allProducts = await dbFunctions.getProducts();
      const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filteredProducts);
      setCurrentPage('home');
    } else {
      loadInitialData();
    }
  };

  const handleSelectCategory = async (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    const categoryProducts = await dbFunctions.getProductsByCategory(categoryId);
    setProducts(categoryProducts);
    setCurrentPage('category-products');
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProductId(productId);
    setCurrentPage('product-detail');
  };

  const handleNavigate = async (page: string) => {
    switch (page) {
      case 'home':
        setCurrentPage('home');
        setSearchQuery('');
        loadInitialData();
        break;
      case 'categories':
        setCurrentPage('categories');
        break;
      case 'featured':
        const featuredProducts = await dbFunctions.getFeaturedProducts();
        setProducts(featuredProducts);
        setCurrentPage('featured');
        break;
      case 'admin':
        setCurrentPage('admin-login');
        break;
    }
  };

  // Função para acessar admin via URL (HashRouter)
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('/admin')) {
      setCurrentPage('admin-login');
    }
  }, []);

  const handleAdminLogin = (username: string, password: string) => {
    setIsAdminLoggedIn(true);
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setAdminSection('dashboard');
    setCurrentPage('home');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSearchQuery('');
    loadInitialData();
  };

  const getCurrentCategory = () => {
    if (selectedCategoryId) {
      return categories.find(c => c.id === selectedCategoryId);
    }
    return null;
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-red-600 via-purple-700 to-red-600 flex items-center justify-center">
        <div className="text-center text-white">
          <LoadingSpinner size="lg" className="mx-auto mb-4 border-white" />
          <h2 className="text-2xl font-bold mb-2">Lovely Sex Day</h2>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }
  const renderContent = () => {
    // Show error message if there's an error
    if (error && currentPage === 'home') {
      return (
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-md mx-auto pt-20 px-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-3">
                <div className="bg-yellow-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-yellow-800">Modo Demonstração</h3>
              </div>
              <p className="text-yellow-700 mb-3">{error}</p>
              <div className="text-sm text-yellow-600">
                <p>• A aplicação está funcionando com dados de demonstração</p>
                <p>• Para usar todas as funcionalidades, configure o Supabase</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Continuar com Demonstração
            </button>
          </div>
        </div>
      );
    }
    
    switch (currentPage) {
      case 'admin-login':
        return <AdminLogin onLogin={handleAdminLogin} />;
      
      case 'admin-dashboard':
        return (
          <AdminDashboard 
            onLogout={handleAdminLogout}
            onNavigate={setAdminSection}
          />
        );

      case 'product-detail':
        return (
          <ProductDetail
            productId={selectedProductId!}
            onBack={handleBackToHome}
          />
        );

      case 'categories':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <CategoryGrid onSelectCategory={handleSelectCategory} />
          </div>
        );

      case 'category-products':
        const currentCategory = getCurrentCategory();
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <ProductGrid
              products={products}
              onSelectProduct={handleSelectProduct}
              title={currentCategory ? `Produtos - ${currentCategory.name}` : 'Produtos'}
              subtitle={currentCategory?.description}
            />
          </div>
        );

      case 'featured':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <ProductGrid
              products={products}
              onSelectProduct={handleSelectProduct}
              title="Produtos em Destaque"
              subtitle="Nossa seleção especial dos produtos mais procurados e avaliados"
            />
          </div>
        );

      default: // home
        return (
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Carousel />
            </div>
            
            {!searchQuery && (
              <>
                {/* Produtos em Destaque */}
                <ProductGrid
                  products={products.filter(p => p.is_featured)}
                  onSelectProduct={handleSelectProduct}
                  title="Produtos em Destaque"
                  subtitle="Nossa seleção especial para você"
                />
                
                <CategoryGrid onSelectCategory={handleSelectCategory} />
                
                {/* Seções por categoria */}
                {categories.map((category) => {
                  const categoryProducts = productsByCategory[category.id];
                  if (!categoryProducts || categoryProducts.length === 0) return null;
                  
                  return (
                    <CategorySection
                      key={category.id}
                      category={category}
                      products={categoryProducts}
                      onSelectProduct={handleSelectProduct}
                    />
                  );
                })}
              </>
            )}
            
            {searchQuery && (
              <ProductGrid
                products={products}
                onSelectProduct={handleSelectProduct}
                title={`Resultados para "${searchQuery}"`}
                subtitle={`${products.length} produto(s) encontrado(s)`}
              />
            )}
          </div>
        );
    }
  };

  // Admin pages don't need header/footer
  if (currentPage === 'admin-login' || currentPage === 'admin-dashboard') {
    return <div className="App">{renderContent()}</div>;
  }

  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="App">
          <Header onSearch={handleSearch} onNavigate={handleNavigate} onSelectProduct={handleSelectProduct} />
          <main>
            {renderContent()}
          </main>
          <Footer />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;