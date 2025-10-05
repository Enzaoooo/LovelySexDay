import { useState, useEffect } from 'react';
import { Plus, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { supabase, uploadImage } from '../../lib/supabase';
import { Category } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const CategoriesManager = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [orderIndex, setOrderIndex] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('order_index');

    if (data) setCategories(data);
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setName(category.name);
      setSlug(category.slug);
      setOrderIndex(category.order_index.toString());
    } else {
      setEditingCategory(null);
      setName('');
      setSlug('');
      setOrderIndex('0');
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingCategory?.image_url || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'categories');
      }

      const categoryData = {
        name,
        slug,
        order_index: parseInt(orderIndex),
        image_url: imageUrl,
      };

      if (editingCategory) {
        await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);
      } else {
        await supabase.from('categories').insert(categoryData);
      }

      setIsModalOpen(false);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Erro ao salvar categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await supabase.from('categories').delete().eq('id', id);
      loadCategories();
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Categorias</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="card p-4">
            <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-3">
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <h3 className="font-semibold mb-2">{category.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal(category)}
                className="btn-outline flex-1 text-sm py-2"
              >
                <Edit2 className="w-3 h-3" />
                Editar
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-2 hover:bg-rose/10 text-rose rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Nome"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!editingCategory) {
                setSlug(generateSlug(e.target.value));
              }
            }}
            required
          />

          <Input
            label="Slug (URL)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />

          <Input
            label="Ordem"
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Imagem
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="input-field"
            />
          </div>

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
