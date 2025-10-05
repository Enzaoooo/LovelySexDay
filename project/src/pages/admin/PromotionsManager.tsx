import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Promotion, Product } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const PromotionsManager = () => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    product_id: '',
    discount_price: '',
    discount_percent: '',
    starts_at: '',
    ends_at: '',
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: promosData } = await supabase
      .from('promotions')
      .select('*, product:products(name)')
      .order('created_at', { ascending: false });

    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('name');

    if (promosData) setPromotions(promosData);
    if (productsData) setProducts(productsData);
  };

  const handleOpenModal = (promotion?: any) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        product_id: promotion.product_id,
        discount_price: promotion.discount_price.toString(),
        discount_percent: promotion.discount_percent?.toString() || '',
        starts_at: promotion.starts_at.split('T')[0],
        ends_at: promotion.ends_at?.split('T')[0] || '',
        is_active: promotion.is_active,
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        product_id: '',
        discount_price: '',
        discount_percent: '',
        starts_at: new Date().toISOString().split('T')[0],
        ends_at: '',
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const promotionData = {
        product_id: formData.product_id,
        discount_price: parseFloat(formData.discount_price),
        discount_percent: formData.discount_percent ? parseInt(formData.discount_percent) : null,
        starts_at: formData.starts_at,
        ends_at: formData.ends_at || null,
        is_active: formData.is_active,
      };

      if (editingPromotion) {
        await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', editingPromotion.id);
      } else {
        await supabase.from('promotions').insert(promotionData);
      }

      setIsModalOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Erro ao salvar promoção');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta promoção?')) {
      await supabase.from('promotions').delete().eq('id', id);
      loadData();
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Promoções</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Nova Promoção
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-100 border-b border-neutral-200">
            <tr>
              <th className="text-left p-3 font-semibold">Produto</th>
              <th className="text-left p-3 font-semibold">Preço Promo</th>
              <th className="text-left p-3 font-semibold">Desconto</th>
              <th className="text-left p-3 font-semibold">Período</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-right p-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                <td className="p-3 font-medium">{promo.product?.name}</td>
                <td className="p-3">R$ {promo.discount_price.toFixed(2)}</td>
                <td className="p-3">{promo.discount_percent ? `${promo.discount_percent}%` : '-'}</td>
                <td className="p-3 text-sm">
                  {new Date(promo.starts_at).toLocaleDateString()} -{' '}
                  {promo.ends_at ? new Date(promo.ends_at).toLocaleDateString() : '∞'}
                </td>
                <td className="p-3">
                  <span className={`badge ${promo.is_active ? 'badge-new' : 'badge'}`}>
                    {promo.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(promo)}
                      className="p-2 hover:bg-neutral-200 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 hover:bg-rose/10 text-rose rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPromotion ? 'Editar Promoção' : 'Nova Promoção'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Produto
            </label>
            <select
              value={formData.product_id}
              onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Selecione um produto</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - R$ {product.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço Promocional"
              type="number"
              step="0.01"
              value={formData.discount_price}
              onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
              required
            />

            <Input
              label="Desconto (%)"
              type="number"
              value={formData.discount_percent}
              onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data Início"
              type="date"
              value={formData.starts_at}
              onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
              required
            />

            <Input
              label="Data Fim"
              type="date"
              value={formData.ends_at}
              onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm font-medium text-neutral-700">Promoção ativa</span>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
