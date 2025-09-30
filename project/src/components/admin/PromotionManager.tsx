import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { dbFunctions } from '../../lib/database';
import { Product, Promotion } from '../../types/database';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const PromotionManager: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    discount_percentage: '',
    product_ids: [] as number[],
    is_active: true
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const productsData = await dbFunctions.getProducts();
      const promotionsData = await dbFunctions.getPromotions();
      setProducts(productsData);
      setPromotions(promotionsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setMessage('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      discount_percentage: '',
      product_ids: [],
      is_active: true
    });
    setEditingPromotion(null);
  };

  const openModal = (promotion?: Promotion) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        name: promotion.name,
        discount_percentage: promotion.discount_percentage.toString(),
        product_ids: promotion.product_ids,
        is_active: promotion.is_active
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
    setMessage('');
  };

  const handleProductToggle = (productId: number) => {
    setFormData(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const promotionData = {
        ...formData,
        discount_percentage: parseFloat(formData.discount_percentage)
      };

      if (editingPromotion) {
        await dbFunctions.updatePromotion(editingPromotion.id, promotionData);
        setMessage('Promoção atualizada com sucesso!');
      } else {
        await dbFunctions.createPromotion(promotionData);
        setMessage('Promoção criada com sucesso!');
      }

      await loadData(); // Reload data
      closeModal();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar promoção:', error);
      setMessage('Erro ao salvar promoção');
    } finally {
      setSaving(false);
    }
  };

  const applyPromotionToProducts = (productIds: number[], discount: number, isActive: boolean) => {
    const updatedProducts = products.map(product => {
      if (productIds.includes(product.id)) {
        return {
          ...product,
          is_on_promotion: isActive,
          promotion_discount: isActive ? discount : 0
        };
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  const handleDelete = async (promotionId: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta promoção?')) {
      try {
        await dbFunctions.deletePromotion(promotionId);
        await loadData(); // Reload data
        setMessage('Promoção excluída com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Erro ao excluir promoção:', error);
        setMessage('Erro ao excluir promoção');
      }
    }
  };

  const togglePromotionStatus = async (promotionId: number) => {
    try {
      await dbFunctions.togglePromotionStatus(promotionId);
      await loadData(); // Reload data
      setMessage('Status da promoção atualizado!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar status da promoção:', error);
      setMessage('Erro ao atualizar status da promoção');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="text-red-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Promoções</h2>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <Plus className="mr-2" size={16} />
            Nova Promoção
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('sucesso') || message.includes('atualizado')
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          {promotions.map((promotion) => (
            <div key={promotion.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{promotion.name}</h3>
                  <p className="text-gray-600">Desconto: {promotion.discount_percentage}%</p>
                  <p className="text-gray-600">Produtos: {promotion.product_ids.length}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    promotion.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {promotion.is_active ? 'Ativa' : 'Inativa'}
                  </span>
                  <button
                    onClick={() => togglePromotionStatus(promotion.id)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      promotion.is_active
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {promotion.is_active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => openModal(promotion)}
                    className="text-blue-600 hover:text-blue-900 p-2"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(promotion.id)}
                    className="text-red-600 hover:text-red-900 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promotion.product_ids.map(productId => {
                  const product = products.find(p => p.id === productId);
                  if (!product) return null;
                  
                  return (
                    <div key={productId} className="bg-white p-3 rounded-lg flex items-center space-x-3">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                {editingPromotion ? 'Editar Promoção' : 'Nova Promoção'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Promoção *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Ex: Promoção de Verão"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desconto (%) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="20"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Promoção Ativa
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Selecionar Produtos ({formData.product_ids.length} selecionados)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.product_ids.includes(product.id)
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleProductToggle(product.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.product_ids.includes(product.id)}
                          onChange={() => handleProductToggle(product.id)}
                          className="text-red-600"
                        />
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            R$ {product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || formData.product_ids.length === 0}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={16} />
                      {editingPromotion ? 'Atualizar' : 'Criar'} Promoção
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};