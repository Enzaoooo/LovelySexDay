import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Package, Tag, Settings, LogOut } from 'lucide-react';

type AdminView = 'dashboard' | 'products' | 'categories' | 'settings';

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
}

export function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
  const { dispatch } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'categories', label: 'Categorias', icon: Tag },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleLogout = () => {
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
  };

  return (
    <aside className="w-64 bg-gray-900 h-screen border-r border-gray-700">
      <div className="p-6">
        <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text">
          Admin Panel
        </h1>
      </div>

      <nav className="px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as AdminView)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                currentView === item.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors mt-8"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </nav>
    </aside>
  );
}