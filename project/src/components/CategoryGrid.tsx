import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Category } from '../lib/types';

export const CategoryGrid = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: cats, error: catsError } = await supabase
        .from('categories')
        .select('*');
      if (catsError) console.error('Categories error:', catsError);
      if (cats) setCategories(cats);
    };

    fetchCategories();
  }, []);

  return (
    <>
      {categories.length > 0 && (
        <section id="categories-section" className="py-12 md:py-20 bg-black">
          <div className="container-custom">
            <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-12">
              Categorias
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`#/products?category=${category.slug}`}
                  className="group relative overflow-hidden aspect-square rounded-xl md:rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-gold transition-all duration-500 md:transform md:hover:-translate-y-2"
                >
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                      <span className="text-neutral-700 text-2xl md:text-4xl font-display">?</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-end p-2 md:p-4">
                    <h3 className="font-display text-sm md:text-lg font-bold text-white">
                      {category.name}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
