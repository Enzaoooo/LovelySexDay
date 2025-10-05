import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { getAdministrators, createAdministrator, updateAdministrator, deleteAdministrator } from '../../lib/database';
import { Administrator } from '../../lib/types';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const AdminManager: React.FC = () => {
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadAdministrators();
  }, []);

  const loadAdministrators = async () => {
    setLoading(true);
    try {
      const adminsData = await getAdministrators();
      setAdministrators(adminsData);
    } catch (error) {
      console.error('Erro ao carregar administradores:', error);
      setMessage('Erro ao carregar administradores. Verifique se o client supabase tem a service_role_key.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setEditingAdmin(null);
    setShowPassword(false);
  };

  const openModal = (admin?: Administrator) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        username: admin.username,
        email: admin.email,
        password: '',
        confirmPassword: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage('As senhas não coincidem');
      setSaving(false);
      return;
    }

    if (!editingAdmin && formData.password.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres');
      setSaving(false);
      return;
    }

    try {
      const adminData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      if (editingAdmin) {
        await updateAdministrator(editingAdmin.id, adminData);
        setMessage('Administrador atualizado com sucesso!');
      } else {
        await createAdministrator(adminData);
        setMessage('Administrador criado com sucesso!');
      }

      await loadAdministrators();
      closeModal();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao salvar administrador:', error);
      setMessage('Erro ao salvar administrador');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (adminId: string) => {
    if (administrators.length <= 1) {
      setMessage('Não é possível excluir o último administrador');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este administrador?')) {
      try {
        await deleteAdministrator(adminId);
        await loadAdministrators();
        setMessage('Administrador excluído com sucesso!');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Erro ao excluir administrador:', error);
        setMessage('Erro ao excluir administrador');
      }
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
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users className="text-red-600 mr-3" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Gerenciar Administradores</h2>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <Plus className="mr-2" size={16} />
            Novo Administrador
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes('sucesso') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {administrators.map((admin) => (
                <tr key={admin.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {admin.username}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{admin.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(admin)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(admin.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={administrators.length <= 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">
                {editingAdmin ? 'Editar Administrador' : 'Novo Administrador'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário *
                </label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  placeholder="admin@lovelysexday.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {editingAdmin ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editingAdmin}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required={!editingAdmin || formData.password !== ''}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-black"
                  placeholder="Confirme a senha"
                />
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
                  disabled={saving}
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
                      {editingAdmin ? 'Atualizar' : 'Criar'} Administrador
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