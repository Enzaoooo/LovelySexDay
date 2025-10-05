import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from '../../components/admin/AdminDashboard';
import { AdminLogin } from '../../components/admin/AdminLogin';
import { AdminManager } from '../../components/admin/AdminManager';
import { CarouselManager } from '../../components/admin/CarouselManager';
import { CategoryManager } from '../../components/admin/CategoryManager';
import { ProductManager } from '../../components/admin/ProductManager';
import { PromotionManager } from '../../components/admin/PromotionManager';
import { SiteSettingsManager } from '../../components/admin/SiteSettingsManager';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-passion border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={() => {}} />;
  }

  return (
    <Routes>
      <Route path="" element={<AdminDashboard onLogout={handleLogout} onNavigate={() => {}} />} />
      <Route path="managers" element={<AdminManager />} />
      <Route path="carousel" element={<CarouselManager />} />
      <Route path="categories" element={<CategoryManager />} />
      <Route path="products" element={<ProductManager />} />
      <Route path="promotions" element={<PromotionManager />} />
      <Route path="settings" element={<SiteSettingsManager />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}