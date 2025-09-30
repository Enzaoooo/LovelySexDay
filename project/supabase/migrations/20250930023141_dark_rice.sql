/*
  # Criar schema inicial para Lovely Sex Day

  1. Novas Tabelas
    - `categories` - Categorias de produtos
    - `products` - Produtos do e-commerce
    - `carousel_images` - Imagens do carrossel
    - `administrators` - Administradores do sistema
    - `promotions` - Promoções e descontos
    - `site_settings` - Configurações do site

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Adicionar políticas para acesso público aos dados do e-commerce
    - Adicionar políticas para administradores
*/

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  detailed_description TEXT,
  technical_specs TEXT,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id),
  stock_quantity INTEGER DEFAULT 0,
  access_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_on_promotion BOOLEAN DEFAULT FALSE,
  promotion_discount DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de imagens do carrossel
CREATE TABLE IF NOT EXISTS carousel_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  order_index INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de administradores
CREATE TABLE IF NOT EXISTS administrators (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de promoções
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  discount_percentage DECIMAL(5,2) NOT NULL,
  product_ids INTEGER[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar tabela de configurações do site
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  whatsapp_number VARCHAR(20),
  site_name VARCHAR(255) DEFAULT 'Lovely Sex Day',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para acesso público (leitura)
CREATE POLICY "Permitir leitura pública de categorias"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir leitura pública de produtos"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir leitura pública de imagens do carrossel"
  ON carousel_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Permitir leitura pública de configurações do site"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Políticas para administradores (acesso completo)
CREATE POLICY "Administradores podem gerenciar categorias"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Administradores podem gerenciar produtos"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Administradores podem gerenciar carrossel"
  ON carousel_images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Administradores podem gerenciar outros administradores"
  ON administrators FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Administradores podem gerenciar promoções"
  ON promotions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Administradores podem gerenciar configurações"
  ON site_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Inserir dados padrão

-- Inserir administrador padrão
INSERT INTO administrators (username, email, password_hash)
VALUES ('admin', 'admin@lovelysexday.com', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Inserir configurações padrão do site
INSERT INTO site_settings (whatsapp_number, site_name)
VALUES ('5511999999999', 'Lovely Sex Day')
ON CONFLICT DO NOTHING;

-- Inserir categorias padrão
INSERT INTO categories (name, image_url, description) VALUES
('Lingeries', 'https://images.pexels.com/photos/6980357/pexels-photo-6980357.jpeg', 'Coleção completa de lingeries sensuais'),
('Perfumes', 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg', 'Fragrâncias aphrodisíacas e sensuais'),
('Fantasias', 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg', 'Fantasias para momentos especiais'),
('Acessórios', 'https://images.pexels.com/photos/6980357/pexels-photo-6980357.jpeg', 'Acessórios íntimos e sensuais')
ON CONFLICT DO NOTHING;

-- Inserir imagens padrão do carrossel
INSERT INTO carousel_images (image_url, title, order_index) VALUES
('https://images.pexels.com/photos/6980357/pexels-photo-6980357.jpeg', 'Coleção Verão 2024', 1),
('https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg', 'Perfumes Exclusivos', 2),
('https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg', 'Fantasias Premium', 3)
ON CONFLICT DO NOTHING;

-- Inserir produtos padrão
INSERT INTO products (name, price, description, detailed_description, technical_specs, image_url, category_id, stock_quantity, is_featured) VALUES
('Conjunto Sensual Ruby', 89.90, 'Conjunto íntimo em renda delicada', 'Conjunto composto por sutiã e calcinha em renda francesa premium, proporcionando conforto e sensualidade.', 'Material: 90% Poliamida, 10% Elastano. Disponível nos tamanhos P, M, G, GG.', 'https://images.pexels.com/photos/6980357/pexels-photo-6980357.jpeg', 1, 25, true),
('Perfume Sedução Intensa', 129.90, 'Perfume aphrodisíaco com notas florais', 'Fragância exclusiva com blend de sândalo, jasmin e almíscar, criada especialmente para momentos íntimos.', 'Volume: 50ml. Concentração: Eau de Parfum. Fixação: 8-12 horas.', 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg', 2, 40, true),
('Fantasia Elegante Dreams', 159.90, 'Fantasia completa para noites especiais', 'Conjunto completo incluindo vestido, acessórios e meias 7/8, confeccionado em tecido premium.', 'Material: Cetim e renda. Tamanhos: P ao GG. Inclui: vestido, tanga, meias e acessórios.', 'https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg', 3, 15, true)
ON CONFLICT DO NOTHING;