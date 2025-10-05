import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product, Promotion, CarouselImage } from '../lib/types';
import { ProductScrollSection } from '../components/ProductScrollSection';
import { CategoryGrid } from '../components/CategoryGrid';

export const Home = () => {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promotionalProducts, setPromotionalProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [mostAccessedProducts, setMostAccessedProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (carouselImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [carouselImages.length]);

  const loadData = async () => {
    try {
      const { data: carousel, error: carouselError } = await supabase
        .from('carousel_images')
        .select('*')
        .eq('is_active', true)
        .order('order_index');
      if (carouselError) console.error('Carousel error:', carouselError);

      const { data: featured, error: featuredError } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(8);
      if (featuredError) console.error('Featured products error:', featuredError);

      const { data: mostAccessed, error: mostAccessedError } = await supabase
        .from('products')
        .select('*')
        .order('access_count', { ascending: false })
        .limit(8);
      if (mostAccessedError) console.error('Most accessed products error:', mostAccessedError);

      const { data: promos, error: promosError } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true);
      if (promosError) console.error('Promotions error:', promosError);

      if (carousel) setCarouselImages(carousel);
      if (featured) setFeaturedProducts(featured);
      if (mostAccessed) setMostAccessedProducts(mostAccessed);

      if (promos) {
        setPromotions(promos);
        const promoProductIds = promos.flatMap(p => p.product_ids);
        if (promoProductIds.length > 0) {
          const { data: promoProducts, error: promoProductsError } = await supabase
            .from('products')
            .select('*')
            .in('id', promoProductIds);
          if (promoProductsError) console.error('Promotional products error:', promoProductsError);
          if (promoProducts) setPromotionalProducts(promoProducts);
        }
      }

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const currentImage = carouselImages[currentSlide];

  return (
    <div className="min-h-screen bg-black">
      {carouselImages.length > 0 && (
        <section className="relative h-screen overflow-hidden">
          {carouselImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.image_url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black" />
            </div>
          ))}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h1 className="font-display text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-white mb-4 md:mb-6 tracking-tight animate-fade-in">
                {currentImage?.title || 'Lovely Sex Day'}
              </h1>
              <p className="text-base md:text-xl lg:text-2xl text-neutral-200 mb-6 md:mb-8 font-light tracking-wide animate-slide-up">
                Descubra sua sensualidade
              </p>
              <a
                href={currentImage?.button_link || '#/products'}
                className="group relative inline-block px-8 py-3 md:px-12 md:py-5 text-white text-sm md:text-base font-medium tracking-wider overflow-hidden transition-all duration-700 animate-scale-in rounded-full shadow-2xl hover:shadow-wine/50 transform hover:scale-110" 
                style={{ background: 'linear-gradient(135deg, hsl(var(--color-wine)) 0%, hsl(var(--color-wine-dark)) 100%)' }}
              >
                <span className="relative z-10">EXPLORAR</span>
                <div className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 rounded-full" style={{ background: 'linear-gradient(135deg, hsl(var(--color-gold)) 0%, hsl(var(--color-magenta)) 100%)' }}></div>
              </a>
            </div>
          </div>

          {carouselImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden md:block absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-2 md:p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:shadow-lg hover:shadow-white/20"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden md:block absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-2 md:p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl hover:bg-white/20 transition-all duration-500 transform hover:scale-110 hover:shadow-lg hover:shadow-white/20"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </button>

              <div className="absolute bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? 'bg-gold w-12 md:w-16'
                        : 'bg-white/40 w-6 md:w-8 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <CategoryGrid />

      <section className="py-12 md:py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-magenta rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-wine rounded-full blur-3xl"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-8 md:mb-16">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-gold" />
              <h2 className="font-display text-2xl md:text-5xl lg:text-6xl font-bold text-white">
                Sensações Exclusivas
              </h2>
              <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-gold" />
            </div>
            <p className="text-sm md:text-lg text-neutral-300 leading-relaxed font-light px-4">
              Na Lovely Sex Day, acreditamos que a sensualidade é uma forma de arte.
              Cada produto é cuidadosamente selecionado para proporcionar experiências
              únicas e memoráveis. Explore nosso universo de luxo e sofisticação.
            </p>
          </div>
        </div>
      </section>

      <ProductScrollSection
        title="Produtos em Destaque"
        products={featuredProducts}
        promotions={promotions}
      />

      <ProductScrollSection
        title="Mais Desejados"
        products={mostAccessedProducts}
        promotions={promotions}
      />

      {promotionalProducts.length > 0 && (
        <ProductScrollSection
          title="Promoções Especiais"
          products={promotionalProducts}
          promotions={promotions}
        />
      )}

    </div>
  );
};
