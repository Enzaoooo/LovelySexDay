import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { LogOut, Package, FolderTree, Tag, Image, Settings } from 'lucide-react';
import { ProductsManager } from './ProductsManager';
import { CategoriesManager } from './CategoriesManager';
import { PromotionsManager } from './PromotionsManager';
import { CarouselManager } from './CarouselManager';
import { SettingsManager } from './SettingsManager';

interface DashboardProps {
  onLogout: () => void;
}

type Tab = 'products' | 'categories' | 'promotions' | 'carousel' | 'settings';

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const tabs = [
    { id: 'products' as Tab, label: 'Produtos', icon: Package },
    { id: 'categories' as Tab, label: 'Categorias', icon: FolderTree },
    { id: 'promotions' as Tab, label: 'Promoções', icon: Tag },
    { id: 'carousel' as Tab, label: 'Carrossel', icon: Image },
    { id: 'settings' as Tab, label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-20">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-neutral-900">
                Painel Administrativo
              </h1>
              {user && (
                <p className="text-sm text-neutral-600">{user.email}</p>
              )}
            </div>
            <Button onClick={handleLogout} variant="ghost">
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container-custom py-6">
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-passion text-white'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          {activeTab === 'products' && <ProductsManager />}
          {activeTab === 'categories' && <CategoriesManager />}
          {activeTab === 'promotions' && <PromotionsManager />}
          {activeTab === 'carousel' && <CarouselManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </div>
      </div>
    </div>
  );
};
