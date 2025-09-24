import React from 'react';
import { Carousel } from '../components/Carousel';
import { CategoryGrid } from '../components/CategoryGrid';
import { ProductGrid } from '../components/ProductGrid';
import { HorizontalProductScroll } from '../components/HorizontalProductScroll';
import { CarouselItem, Category, Product } from '../types';
import { getProductsByCategory } from '../utils/categoryUtils';

interface HomePageProps {
  carouselItems: CarouselItem[];
  categories: Category[];
  allProducts: Product[];
  featuredProducts: Product[];
  mostViewedProducts: Product[];
  onCategoryClick: (category: Category) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  getProductViews: (productId: string) => number;
}

export function HomePage({
  carouselItems,
  categories,
  allProducts,
  featuredProducts,
  mostViewedProducts,
  onCategoryClick,
  onProductClick,
  onAddToCart,
  getProductViews
}: HomePageProps) {
  // Get unique categories that have products
  const categoriesWithProducts = categories.filter(category => 
    allProducts.some(product => product.category === category.name));

  return (
    <>
      {/* Hero Carousel */}
      <section className="container mx-auto px-4 py-8">
        <Carousel items={carouselItems} />
      </section>

      {/* Categories */}
      <CategoryGrid 
        categories={categories} 
        onCategoryClick={onCategoryClick}
        products={allProducts}
      />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <ProductGrid
          products={featuredProducts}
          title="Produtos em Destaque"
          subtitle="Nossa seleção especial dos melhores produtos"
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          getProductViews={getProductViews}
        />
      )}

      {/* Most Viewed Products */}
      {mostViewedProducts.length > 0 && (
        <ProductGrid
          products={mostViewedProducts}
          title="Mais Visualizados"
          subtitle="Os produtos que mais despertam interesse"
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          getProductViews={getProductViews}
        />
      )}

      {/* Category-specific horizontal scrolling sections */}
      <div id="produtos">
        {categoriesWithProducts.map((category) => {
          const categoryProducts = getProductsByCategory(allProducts, category.name);
          return (
            <HorizontalProductScroll
              key={category.id}
              products={categoryProducts}
              categoryName={category.name}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
              getProductViews={getProductViews}
            />
          );
        })}
      </div>
    </>
  );
}