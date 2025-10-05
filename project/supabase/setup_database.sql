-- ============================================================================
-- LOVELY SEX DAY - SCHEMA COMPLETO, ROBUSTO E SEGURO
-- Data: 2025-10-03
-- Versao: 2.0 (Production Ready)
-- ============================================================================

-- ============================================================================
-- PARTE 1: LIMPEZA COMPLETA
-- ============================================================================

-- Remover tabelas existentes (o CASCADE remove triggers e functions dependentes)
DROP TABLE IF EXISTS public.cart CASCADE;
DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.carousel_images CASCADE;
DROP TABLE IF EXISTS public.promotions CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- Remover politicas de storage
DROP POLICY IF EXISTS "public_upload_images" ON storage.objects;
DROP POLICY IF EXISTS "public_read_images" ON storage.objects;
DROP POLICY IF EXISTS "auth_delete_images" ON storage.objects;
DROP POLICY IF EXISTS "auth_update_images" ON storage.objects;

-- ============================================================================
-- PARTE 2: CRIACAO DAS TABELAS
-- ============================================================================

-- TABELA: categories
CREATE TABLE public.categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  slug TEXT UNIQUE,
  image_url TEXT,
  description TEXT CHECK (char_length(description) <= 500),
  is_active BOOLEAN DEFAULT true NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABELA: products
CREATE TABLE public.products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 200),
  slug TEXT UNIQUE,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  description TEXT CHECK (char_length(description) <= 1000),
  detailed_description TEXT CHECK (char_length(detailed_description) <= 5000),
  technical_specs TEXT CHECK (char_length(technical_specs) <= 2000),

  -- Sistema de multiplas imagens
  images TEXT[] DEFAULT '{}' NOT NULL,
  image_url TEXT, -- Mantido para compatibilidade (sempre = primeira imagem)

  category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity INTEGER DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),

  -- Flags de destaque
  is_featured BOOLEAN DEFAULT false NOT NULL,
  is_on_promotion BOOLEAN DEFAULT false NOT NULL,
  promotion_discount NUMERIC(5, 2) DEFAULT 0 CHECK (promotion_discount >= 0 AND promotion_discount <= 100),

  -- Metricas
  access_count BIGINT DEFAULT 0 NOT NULL,
  view_count BIGINT DEFAULT 0 NOT NULL,
  cart_add_count BIGINT DEFAULT 0 NOT NULL,
  favorite_count BIGINT DEFAULT 0 NOT NULL,

  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_deleted BOOLEAN DEFAULT false NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- TABELA: promotions
CREATE TABLE public.promotions (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 200),
  description TEXT CHECK (char_length(description) <= 500),
  discount_percentage NUMERIC(5, 2) NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  product_ids BIGINT[] DEFAULT '{}' NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT valid_date_range CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- TABELA: carousel_images
CREATE TABLE public.carousel_images (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT CHECK (char_length(title) <= 200),
  subtitle TEXT CHECK (char_length(subtitle) <= 300),
  link_url TEXT,
  order_index INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- TABELA: site_settings
CREATE TABLE public.site_settings (
  id BIGSERIAL PRIMARY KEY,
  whatsapp_number TEXT CHECK (char_length(whatsapp_number) <= 20),
  site_name TEXT DEFAULT 'Lovely Sex Day' CHECK (char_length(site_name) <= 100),
  site_description TEXT CHECK (char_length(site_description) <= 500),
  logo_url TEXT,
  favicon_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- TABELA: favorites
CREATE TABLE public.favorites (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL CHECK (char_length(session_id) >= 10),
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(session_id, product_id)
);

-- TABELA: cart
CREATE TABLE public.cart (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL CHECK (char_length(session_id) >= 10),
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 NOT NULL CHECK (quantity > 0 AND quantity <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(session_id, product_id)
);

-- ============================================================================
-- PARTE 3: INDICES PARA PERFORMANCE
-- ============================================================================

-- Categories
CREATE INDEX idx_categories_active ON public.categories(is_active) WHERE is_active = true;
CREATE INDEX idx_categories_order ON public.categories(display_order);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- Products
CREATE INDEX idx_products_category ON public.products(category_id) WHERE category_id IS NOT NULL;
CREATE INDEX idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_featured ON public.products(is_featured, created_at DESC) WHERE is_featured = true AND is_active = true;
CREATE INDEX idx_products_promotion ON public.products(is_on_promotion, created_at DESC) WHERE is_on_promotion = true AND is_active = true;
CREATE INDEX idx_products_access_count ON public.products(access_count DESC) WHERE is_active = true;
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_created ON public.products(created_at DESC);

-- Favorites
CREATE INDEX idx_favorites_session ON public.favorites(session_id);
CREATE INDEX idx_favorites_product ON public.favorites(product_id);
CREATE INDEX idx_favorites_created ON public.favorites(created_at DESC);

-- Cart
CREATE INDEX idx_cart_session ON public.cart(session_id);
CREATE INDEX idx_cart_product ON public.cart(product_id);
CREATE INDEX idx_cart_updated ON public.cart(updated_at DESC);

-- Promotions
CREATE INDEX idx_promotions_active ON public.promotions(is_active) WHERE is_active = true;
CREATE INDEX idx_promotions_dates ON public.promotions(start_date, end_date) WHERE is_active = true;

-- Carousel
CREATE INDEX idx_carousel_active ON public.carousel_images(order_index) WHERE is_active = true;

-- ============================================================================
-- PARTE 4: FUNCTIONS E TRIGGERS
-- ============================================================================

-- Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function para sincronizar image_url com primeira imagem do array
CREATE OR REPLACE FUNCTION sync_primary_image()
RETURNS TRIGGER AS $$
BEGIN
  IF array_length(NEW.images, 1) > 0 THEN
    NEW.image_url := NEW.images[1];
  ELSE
    NEW.image_url := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function para gerar slug automaticamente
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Gerar slug base a partir do nome
  base_slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  final_slug := base_slug;

  -- Verificar se slug ja existe e adicionar numero se necessario
  IF TG_OP = 'INSERT' THEN
    WHILE EXISTS (SELECT 1 FROM products WHERE slug = final_slug) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    NEW.slug := final_slug;
  ELSIF TG_OP = 'UPDATE' AND NEW.name != OLD.name THEN
    WHILE EXISTS (SELECT 1 FROM products WHERE slug = final_slug AND id != NEW.id) LOOP
      counter := counter + 1;
      final_slug := base_slug || '-' || counter;
    END LOOP;
    NEW.slug := final_slug;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function para incrementar contadores de produto
CREATE OR REPLACE FUNCTION increment_product_counter(
  product_id_param BIGINT,
  counter_name TEXT
)
RETURNS void AS $$
BEGIN
  EXECUTE format('UPDATE products SET %I = %I + 1 WHERE id = $1', counter_name, counter_name)
  USING product_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers para updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON public.promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carousel_images_updated_at BEFORE UPDATE ON public.carousel_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_updated_at BEFORE UPDATE ON public.cart
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para sincronizar imagem principal
CREATE TRIGGER sync_product_primary_image
  BEFORE INSERT OR UPDATE OF images ON public.products
  FOR EACH ROW EXECUTE FUNCTION sync_primary_image();

-- Trigger para gerar slug automaticamente
CREATE TRIGGER generate_product_slug
  BEFORE INSERT OR UPDATE OF name ON public.products
  FOR EACH ROW EXECUTE FUNCTION generate_slug();

-- ============================================================================
-- PARTE 5: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;

-- POLICIES: Categories
CREATE POLICY "public_read_categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "auth_manage_categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

-- POLICIES: Products
CREATE POLICY "public_read_products" ON public.products
  FOR SELECT USING (is_active = true AND is_deleted = false);

CREATE POLICY "auth_manage_products" ON public.products
  FOR ALL USING (auth.role() = 'authenticated');

-- POLICIES: Promotions
CREATE POLICY "public_read_promotions" ON public.promotions
  FOR SELECT USING (is_active = true);

CREATE POLICY "auth_manage_promotions" ON public.promotions
  FOR ALL USING (auth.role() = 'authenticated');

-- POLICIES: Carousel Images
CREATE POLICY "public_read_carousel" ON public.carousel_images
  FOR SELECT USING (is_active = true);

CREATE POLICY "auth_manage_carousel" ON public.carousel_images
  FOR ALL USING (auth.role() = 'authenticated');

-- POLICIES: Site Settings
CREATE POLICY "public_read_settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "auth_manage_settings" ON public.site_settings
  FOR ALL USING (auth.role() = 'authenticated');

-- POLICIES: Favorites (publico pode ler/escrever via session_id)
CREATE POLICY "public_read_favorites" ON public.favorites
  FOR SELECT USING (true);

CREATE POLICY "public_insert_favorites" ON public.favorites
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_delete_favorites" ON public.favorites
  FOR DELETE USING (true);

-- POLICIES: Cart (publico pode ler/escrever via session_id)
CREATE POLICY "public_read_cart" ON public.cart
  FOR SELECT USING (true);

CREATE POLICY "public_manage_cart" ON public.cart
  FOR ALL WITH CHECK (true);

-- ============================================================================
-- PARTE 6: STORAGE BUCKET E POLICIES
-- ============================================================================

-- Criar ou atualizar bucket de imagens
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lovely-sex-day',
  'lovely-sex-day',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];

-- Policies de storage
CREATE POLICY "public_upload_images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'lovely-sex-day');

CREATE POLICY "public_read_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lovely-sex-day');

CREATE POLICY "auth_delete_images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'lovely-sex-day' AND auth.role() = 'authenticated');

CREATE POLICY "auth_update_images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'lovely-sex-day' AND auth.role() = 'authenticated');

-- ============================================================================
-- PARTE 7: DADOS INICIAIS
-- ============================================================================

-- Configuracoes do site
INSERT INTO public.site_settings (
  id,
  whatsapp_number,
  site_name,
  site_description,
  email
) VALUES (
  1,
  '5511999999999',
  'Lovely Sex Day',
  'Sua loja intima de confianca',
  'contato@lovelysexday.com'
) ON CONFLICT (id) DO UPDATE SET
  whatsapp_number = EXCLUDED.whatsapp_number,
  site_name = EXCLUDED.site_name,
  site_description = EXCLUDED.site_description,
  email = EXCLUDED.email;

-- Categorias
INSERT INTO public.categories (name, description, display_order, is_active) VALUES
('Vibradores', 'Vibradores e massageadores de alta qualidade', 1, true),
('Lingerie', 'Lingeries sensuais e confortaveis', 2, true),
('Lubrificantes', 'Lubrificantes intimos seguros', 3, true),
('Acessorios', 'Acessorios e fantasias', 4, true),
('Anal', 'Produtos para prazer anal', 5, true),
('Casal', 'Produtos para casais', 6, true)
ON CONFLICT DO NOTHING;

-- Produtos de exemplo
INSERT INTO public.products (
  name,
  price,
  description,
  detailed_description,
  category_id,
  stock_quantity,
  is_featured,
  is_active,
  images
) VALUES
(
  'Vibrador Classico Rosa',
  89.90,
  'Vibrador classico com 10 niveis de vibracao',
  'Vibrador de alta qualidade feito em silicone medico. Possui 10 niveis de vibracao diferentes para maior prazer. A prova d''agua e recarregavel via USB. Tamanho ideal para iniciantes.',
  1,
  50,
  true,
  true,
  ARRAY['https://placehold.co/800x800/FF1493/FFFFFF?text=Vibrador+Rosa']
),
(
  'Conjunto de Lingerie Vermelha',
  129.90,
  'Conjunto completo em renda vermelha',
  'Conjunto de lingerie sensual em renda premium. Inclui sutia e calcinha. Disponivel em varios tamanhos. Material confortavel e de alta durabilidade.',
  2,
  30,
  false,
  true,
  ARRAY['https://placehold.co/800x800/DC143C/FFFFFF?text=Lingerie']
),
(
  'Lubrificante a Base de Agua 100ml',
  39.90,
  'Lubrificante intimo a base de agua',
  'Lubrificante intimo premium a base de agua. Hipoalergenico e compativel com preservativos. Nao mancha e facil de limpar. Testado dermatologicamente.',
  3,
  100,
  false,
  true,
  ARRAY['https://placehold.co/800x800/4169E1/FFFFFF?text=Lubrificante']
),
(
  'Kit Algemas e Venda',
  79.90,
  'Kit completo para iniciantes',
  'Kit perfeito para quem esta comecando. Inclui algemas macias ajustaveis e venda de cetim. Sistema de liberacao rapida para seguranca.',
  4,
  25,
  true,
  true,
  ARRAY['https://placehold.co/800x800/000000/FFFFFF?text=Kit+Algemas']
),
(
  'Plug Anal Iniciante',
  69.90,
  'Plug anal em silicone medico para iniciantes',
  'Plug anal ideal para iniciantes. Tamanho pequeno e formato anatomico. Feito em silicone premium com base de seguranca. Facil de limpar e esterilizar.',
  5,
  40,
  false,
  true,
  ARRAY['https://placehold.co/800x800/9370DB/FFFFFF?text=Plug+Anal']
),
(
  'Anel Peniano Vibratorio',
  49.90,
  'Anel com vibracao para casais',
  'Anel peniano vibratorio para maior prazer do casal. Feito em silicone flexivel. Bateria de longa duracao. Aumenta a duracao e intensifica o prazer.',
  6,
  60,
  true,
  true,
  ARRAY['https://placehold.co/800x800/FF69B4/FFFFFF?text=Anel+Vibratorio']
)
ON CONFLICT DO NOTHING;

-- Promocao de exemplo
INSERT INTO public.promotions (
  name,
  description,
  discount_percentage,
  product_ids,
  is_active,
  start_date
)
SELECT
  'Promocao de Inauguracao',
  'Desconto especial em produtos selecionados',
  20,
  ARRAY(SELECT id FROM products WHERE is_featured = true LIMIT 3)::BIGINT[],
  true,
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM promotions WHERE name = 'Promocao de Inauguracao');

-- Imagens do carrossel
INSERT INTO public.carousel_images (image_url, title, subtitle, order_index, is_active) VALUES
('https://placehold.co/1200x400/FF1493/FFFFFF?text=Promocao+de+Inauguracao', 'Promocao de Inauguracao', 'Ate 20% de desconto', 1, true),
('https://placehold.co/1200x400/FF69B4/FFFFFF?text=Novidades+da+Semana', 'Novidades da Semana', 'Confira nossos lancamentos', 2, true),
('https://placehold.co/1200x400/C71585/FFFFFF?text=Frete+Gratis', 'Frete Gratis', 'Em compras acima de R$ 199', 3, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PARTE 8: GRANTS E PERMISSOES
-- ============================================================================

-- Garantir que authenticated pode executar functions
GRANT EXECUTE ON FUNCTION increment_product_counter TO authenticated;
GRANT EXECUTE ON FUNCTION increment_product_counter TO anon;

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================

-- Verificar se tudo foi criado corretamente
DO $$
DECLARE
  table_count INTEGER;
  index_count INTEGER;
  trigger_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name IN ('categories', 'products', 'promotions', 'carousel_images', 'site_settings', 'favorites', 'cart');

  SELECT COUNT(*) INTO index_count FROM pg_indexes
  WHERE schemaname = 'public' AND indexname LIKE 'idx_%';

  SELECT COUNT(*) INTO trigger_count FROM information_schema.triggers
  WHERE trigger_schema = 'public';

  RAISE NOTICE 'Schema criado com sucesso!';
  RAISE NOTICE 'Tabelas criadas: %', table_count;
  RAISE NOTICE 'Indices criados: %', index_count;
  RAISE NOTICE 'Triggers criados: %', trigger_count;
END $$;