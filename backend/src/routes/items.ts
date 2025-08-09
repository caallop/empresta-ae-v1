import {
  addItemImage,
  createItem,
  deleteItem,
  getItemById,
  getItemImages,
  getItemsByCategory,
  getItemsByOwner,
  getNearbyItems,
  removeItemImage,
  searchItems,
  setItemAvailability,
  updateItem,
} from '@/controllers/itemController';
import { authenticate, optionalAuthenticate } from '@/middleware/auth';
import { Router } from 'express';

const router = Router();

// Public routes - ordem específica para evitar conflitos
router.get('/search', optionalAuthenticate, searchItems);
router.get('/nearby', getNearbyItems);
router.get('/category/:categoryId', getItemsByCategory);
router.get('/owner/:ownerId', getItemsByOwner);
router.get('/', optionalAuthenticate, searchItems); // Rota raiz por último para compatibilidade

// Protected routes
router.post('/', authenticate, createItem);
router.put('/:id', authenticate, updateItem);
router.delete('/:id', authenticate, deleteItem);
router.patch('/:id/availability', authenticate, setItemAvailability);
router.post('/:id/images', authenticate, addItemImage);
router.delete('/images/:imageId', authenticate, removeItemImage);

// Item-specific routes (deve vir depois das rotas específicas)
router.get('/:id', optionalAuthenticate, getItemById);
router.get('/:id/images', getItemImages);

export default router;
