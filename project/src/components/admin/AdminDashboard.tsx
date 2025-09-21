import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminSettings } from './AdminSettings';
import { Package, Tag, BarChart3, Settings } from 'lucide-react';

type AdminView = 'dashboard' | 'products' | 'categories' | 'settings';

export function AdminDashboard() {
  const { state } = useApp();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'settings':
        return <AdminSettings />;
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total de Produtos</p>
                    <p className="text-2xl font-bold text-white">{state.products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-purple-400" />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Categorias</p>
                    <p className="text-2xl font-bold text-white">{state.categories.length}</p>
                  </div>
                  <Tag className="h-8 w-8 text-pink-400" />
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Produtos Ativos</p>
                    <p className="text-2xl font-bold text-white">
                      {state.products.filter(p => p.status === 'active').length}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setCurrentView('products')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                >
                  Adicionar Novo Produto
                </button>
                <button
                  onClick={() => setCurrentView('categories')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Gerenciar Categorias
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 p-8">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}