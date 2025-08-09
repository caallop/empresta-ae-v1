import { executeQuery } from '@/config/database';
import logger from '@/config/logger';

async function addImages() {
  try {
    logger.info('🖼️  Adicionando imagens aos itens...');

    // Buscar todos os itens
    const items = await executeQuery<any[]>('SELECT id, category_id FROM items WHERE is_active = true', []);

    // Imagens de placeholder por categoria
    const categoryImages: Record<string, string[]> = {
      '576eb397-fb98-45e7-89ba-5566e4dd4cc5': [ // Eletrônicos
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop'
      ],
      '91cc5813-200a-4147-9a82-33a869601085': [ // Ferramentas
        'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=300&fit=crop'
      ],
      'a91efb58-46db-43d6-b74e-cb426a430f6c': [ // Esportes
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop'
      ],
      'fdf36738-3fb7-4871-9f45-5f73833c8b57': [ // Casa e Jardim
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop'
      ],
      '1c92b566-f97c-4857-be24-0f5e4446278c': [ // Veículos
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'
      ],
      'a91efb58-46db-43d6-b74e-cb426a430f6c': [ // Livros e Mídia
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
      ],
      'fdf36738-3fb7-4871-9f45-5f73833c8b57': [ // Roupas e Acessórios
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
      ],
      '1c92b566-f97c-4857-be24-0f5e4446278c': [ // Música
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
      ]
    };

    // Imagem padrão para categorias não mapeadas
    const defaultImages = [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    ];

    for (const item of items) {
      // Verificar se já tem imagens
      const existingImages = await executeQuery<any[]>(
        'SELECT COUNT(*) as count FROM item_images WHERE item_id = ?',
        [item.id]
      );

      if (existingImages[0].count > 0) {
        logger.info(`⏭️  Item ${item.id} já tem imagens, pulando...`);
        continue;
      }

      // Selecionar imagens para a categoria
      const images = categoryImages[item.category_id] || defaultImages;

      // Adicionar imagens ao item
      for (let i = 0; i < Math.min(images.length, 2); i++) {
        const imageId = `img_${item.id.slice(0, 8)}_${i}`;
        await executeQuery(
          'INSERT INTO item_images (id, item_id, url, alt_text, is_primary, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
          [
            imageId,
            item.id,
            images[i],
            `Imagem ${i + 1} do item`,
            i === 0, // Primeira imagem é primária
            i + 1
          ]
        );
      }

      logger.info(`✅ Adicionadas ${Math.min(images.length, 2)} imagens ao item ${item.id}`);
    }

    logger.info('✅ Processo de adição de imagens concluído!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Erro ao adicionar imagens:', error);
    process.exit(1);
  }
}

// Executar script
addImages();
