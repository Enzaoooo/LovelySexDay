import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  Tag, 
  Images, 
  TrendingUp, 
  LogOut,
  Settings,
  Phone
} from 'lucide-react';
import { getProducts, getCategories, getCarouselImages, getMostAccessedProducts } from '../../lib/database';
import { Product } from '../../lib/types';
import { SiteSettingsManager } from './SiteSettingsManager';
import { ProductManager } from './ProductManager';
import { CategoryManager } from './CategoryManager';
import { CarouselManager } from './CarouselManager';
import { PromotionManager } from './PromotionManager';
import { AdminManager } from './AdminManager';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigate: (section: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onNavigate }) => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalCarouselImages: 0,
    featuredProducts: 0
  });
  const [mostAccessedProducts, setMostAccessedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [products, categories, carouselImages, mostAccessed] = await Promise.all([
        getProducts(),
        getCategories(),
        getCarouselImages(),
        getMostAccessedProducts()
      ]);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalCarouselImages: carouselImages.length,
        featuredProducts: products.filter(p => p.is_featured).length
      });

      setMostAccessedProducts(mostAccessed.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }: {
    icon: any;
    title: string;
    value: number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-black">{title}</p>
          <p className="text-2xl font-bold text-black">{value}</p>
        </div>
      </div>
    </div>
  );

  const quickActions = [
    {
      name: 'Produtos',
      icon: Package,
      color: 'bg-blue-600 hover:bg-blue-700',
      section: 'products'
    },
    {
      name: 'Categorias',
      icon: Tag,
      color: 'bg-green-600 hover:bg-green-700',
      section: 'categories'
    },
    {
      name: 'Carrossel',
      icon: Images,
      color: 'bg-purple-600 hover:bg-purple-700',
      section: 'carousel'
    },
    {
      name: 'Promoções',
      icon: TrendingUp,
      color: 'bg-orange-600 hover:bg-orange-700',
      section: 'promotions'
    },
    {
      name: 'Administradores',
      icon: Users,
      color: 'bg-red-600 hover:bg-red-700',
      section: 'administrators'
    },
    {
      name: 'Configurações',
      icon: Phone,
      color: 'bg-gray-600 hover:bg-gray-700',
      section: 'settings'
    }
  ];

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    onNavigate(section);
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'products':
        return <ProductManager />;
      case 'categories':
        return <CategoryManager />;
      case 'carousel':
        return <CarouselManager />;
      case 'promotions':
        return <PromotionManager />;
      case 'administrators':
        return <AdminManager />;
      case 'settings':
        return <SiteSettingsManager />;
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                <BarChart3 className="mr-2 text-black" size={20} />
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.section}
                    onClick={() => handleNavigate(action.section)}
                    className={`${action.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center space-y-2`}
                  >
                    <action.icon size={24} />
                    <span className="font-semibold">{action.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Most Accessed Products */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                <TrendingUp className="mr-2 text-black" size={20} />
                Produtos Mais Acessados
              </h3>
              <div className="space-y-3">
                {mostAccessedProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-black">
                        {product.access_count} acessos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Settings className="text-red-600 mr-3" size={24} />
              <div>
                <h1 className="text-xl font-bold text-black">
                  Painel Administrativo - Lovely Sex Day
                </h1>
                {currentSection !== 'dashboard' && (
                  <button
                    onClick={() => setCurrentSection('dashboard')}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    ← Voltar ao Dashboard
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentSection === 'dashboard' && (
          <>
            {/* Welcome Message */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">
                Bem-vindo ao Painel Administrativo
              </h2>
              <p className="text-black">
                Gerencie produtos, categorias, promoções e mais através desta interface.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Package}
                title="Total de Produtos"
                value={stats.totalProducts}
                color="bg-blue-600"
              />
              <StatCard
                icon={Tag}
                title="Categorias"
                value={stats.totalCategories}
                color="bg-green-600"
              />
              <StatCard
                icon={Images}
                title="Imagens no Carrossel"
                value={stats.totalCarouselImages}
                color="bg-purple-600"
              />
              <StatCard
                icon={TrendingUp}
                title="Produtos em Destaque"
                value={stats.featuredProducts}
                color="bg-orange-600"
              />
            </div>
          </>
        )}

        {renderContent()}
      </div>
    </div>
  );
};