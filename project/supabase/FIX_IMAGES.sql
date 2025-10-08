-- CORRIGIR IMAGENS DOS PRODUTOS
-- Substituir URLs do via.placeholder.com por placehold.co (que funciona)

UPDATE products
SET images = ARRAY[
  CASE
    WHEN name LIKE '%Vibrador%' THEN 'https://placehold.co/800x800/FF1493/FFFFFF/png?text=Vibrador+Rosa'
    WHEN name LIKE '%Lingerie%' THEN 'https://placehold.co/800x800/DC143C/FFFFFF/png?text=Lingerie'
    WHEN name LIKE '%Lubrificante%' THEN 'https://placehold.co/800x800/4169E1/FFFFFF/png?text=Lubrificante'
    WHEN name LIKE '%Algemas%' THEN 'https://placehold.co/800x800/000000/FFFFFF/png?text=Kit+Algemas'
    WHEN name LIKE '%Plug%' OR name LIKE '%Anal%' THEN 'https://placehold.co/800x800/9370DB/FFFFFF/png?text=Plug+Anal'
    WHEN name LIKE '%Anel%' THEN 'https://placehold.co/800x800/FF69B4/FFFFFF/png?text=Anel+Vibratorio'
    ELSE 'https://placehold.co/800x800/CCCCCC/FFFFFF/png?text=Produto'
  END
]
WHERE images[1] LIKE '%via.placeholder.com%';

-- Verificar
SELECT id, name, images FROM products;
