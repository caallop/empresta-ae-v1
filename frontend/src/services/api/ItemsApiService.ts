import { apiService } from './ApiService';
import type { PaginatedResponse, ItemWithDetails as FrontendItemWithDetails } from '@/types';

export interface ItemImage {
  id: string;
  item_id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

export interface Item {
  id: string;
  owner_id: string;
  category_id: string;
  title: string;
  description: string;
  condition_rating: number;
  estimated_value?: number;
  daily_rate?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  is_available: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemWithDetails extends Item {
  owner: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    average_rating: number;
    reviews_count: number;
  };
  category: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
  };
  images: ItemImage[];
  distance?: number;
}

export interface CreateItemData {
  category_id: string;
  title: string;
  description: string;
  condition_rating: number;
  estimated_value?: number;
  daily_rate?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
}

export interface UpdateItemData {
  category_id?: string;
  title?: string;
  description?: string;
  condition_rating?: number;
  estimated_value?: number;
  daily_rate?: number;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
  is_available?: boolean;
}

export interface ItemSearchFilters {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  condition_rating?: number;
  location_lat?: number;
  location_lng?: number;
  radius?: number;
  search?: string;
  is_available?: boolean;
  page?: number;
  limit?: number;
}

export interface ItemSearchResult {
  data: FrontendItemWithDetails[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ItemsApiService {
  // Convert backend item to frontend format
  private convertBackendToFrontendItem(backendItem: ItemWithDetails): FrontendItemWithDetails {
    return {
      id: backendItem.id,
      title: backendItem.title,
      description: backendItem.description,
      price: backendItem.daily_rate || 0,
      period: 'dia' as const, // Default period
      images: backendItem.images.map(img => img.url),
      categoryId: backendItem.category_id,
      ownerId: backendItem.owner_id,
      location: {
        latitude: backendItem.location_lat || 0,
        longitude: backendItem.location_lng || 0,
        address: backendItem.location_address || '',
      },
      status: backendItem.is_available ? 'available' as const : 'unavailable' as const,
      createdAt: backendItem.created_at.toString(),
      updatedAt: backendItem.updated_at.toString(),
      owner: backendItem.owner ? {
        id: backendItem.owner.id,
        name: `${backendItem.owner.first_name} ${backendItem.owner.last_name}`,
        email: '', // Not provided by backend
        avatar: backendItem.owner.avatar_url,
        rating: backendItem.owner.average_rating,
        location: {
          latitude: 0,
          longitude: 0,
          address: '',
        },
        createdAt: '',
        updatedAt: '',
      } : undefined,
      category: backendItem.category ? {
        id: backendItem.category.id,
        name: backendItem.category.name,
        icon: backendItem.category.icon || 'help',
        color: backendItem.category.color || '#ccc',
      } : undefined,
      distance: backendItem.distance,
    };
  }

  // Get all items with search and filters
  async getItems(filters: ItemSearchFilters = {}): Promise<PaginatedResponse<FrontendItemWithDetails>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiService.get<PaginatedResponse<ItemWithDetails>>('/items/search', { params });
    
    return {
      items: response.items.map(item => this.convertBackendToFrontendItem(item)),
      total: response.total,
      page: response.page,
      limit: response.limit,
      hasMore: response.hasMore,
    };
  }

  // Get all items with search and filters (legacy method)
  async searchItems(filters: ItemSearchFilters = {}): Promise<ItemSearchResult> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await apiService.get<PaginatedResponse<ItemWithDetails>>('/items/search', { params });

    return {
      data: response.items.map(item => this.convertBackendToFrontendItem(item)),
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: Math.ceil(response.total / response.limit),
      },
    };
  }

  // Get item by ID
  async getItemById(id: string): Promise<FrontendItemWithDetails> {
    const backendItem = await apiService.get<ItemWithDetails>(`/items/${id}`);
    return this.convertBackendToFrontendItem(backendItem);
  }

  // Get item by ID (alias for getItemById)
  async getItem(id: string): Promise<FrontendItemWithDetails> {
    const backendItem = await apiService.get<ItemWithDetails>(`/items/${id}`);
    return this.convertBackendToFrontendItem(backendItem);
  }

  // Create new item
  async createItem(data: CreateItemData): Promise<FrontendItemWithDetails> {
    const backendItem = await apiService.post<ItemWithDetails>('/items', data);
    return this.convertBackendToFrontendItem(backendItem);
  }

  // Update item
  async updateItem(id: string, data: UpdateItemData): Promise<FrontendItemWithDetails> {
    const backendItem = await apiService.put<ItemWithDetails>(`/items/${id}`, data);
    return this.convertBackendToFrontendItem(backendItem);
  }

  // Delete item
  async deleteItem(id: string): Promise<void> {
    await apiService.delete(`/items/${id}`);
  }

  // Get items by owner
  async getItemsByOwner(ownerId?: string): Promise<FrontendItemWithDetails[]> {
    const url = ownerId ? `/items/owner/${ownerId}` : '/items/owner/me';
    const backendItems = await apiService.get<Item[]>(url);
    // Convert basic items to frontend format (without details)
    return backendItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.daily_rate || 0,
      period: 'dia' as const,
      images: [], // No images in basic item
      categoryId: item.category_id,
      ownerId: item.owner_id,
      location: {
        latitude: item.location_lat || 0,
        longitude: item.location_lng || 0,
        address: item.location_address || '',
      },
      status: item.is_available ? 'available' as const : 'unavailable' as const,
      createdAt: item.created_at.toString(),
      updatedAt: item.updated_at.toString(),
    }));
  }

  // Get items by category
  async getItemsByCategory(categoryId: string): Promise<FrontendItemWithDetails[]> {
    const backendItems = await apiService.get<Item[]>(`/items/category/${categoryId}`);
    // Convert basic items to frontend format (without details)
    return backendItems.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.daily_rate || 0,
      period: 'dia' as const,
      images: [], // No images in basic item
      categoryId: item.category_id,
      ownerId: item.owner_id,
      location: {
        latitude: item.location_lat || 0,
        longitude: item.location_lng || 0,
        address: item.location_address || '',
      },
      status: item.is_available ? 'available' as const : 'unavailable' as const,
      createdAt: item.created_at.toString(),
      updatedAt: item.updated_at.toString(),
    }));
  }

  // Get nearby items
  async getNearbyItems(
    lat: number,
    lng: number,
    radius: number = 10,
    limit: number = 20
  ): Promise<FrontendItemWithDetails[]> {
    const params = { lat, lng, radius, limit };
    const backendItems = await apiService.get<ItemWithDetails[]>('/items/nearby', { params });
    return backendItems.map(item => this.convertBackendToFrontendItem(item));
  }

  // Set item availability
  async setItemAvailability(id: string, isAvailable: boolean): Promise<FrontendItemWithDetails> {
    const backendItem = await apiService.patch<ItemWithDetails>(`/items/${id}/availability`, {
      is_available: isAvailable,
    });
    return this.convertBackendToFrontendItem(backendItem);
  }

  // Upload item images
  async uploadItemImages(
    itemId: string,
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<ItemImage[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    return await apiService.post<ItemImage[]>(`/upload/item/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      } : undefined,
    });
  }

  // Get item images
  async getItemImages(itemId: string): Promise<ItemImage[]> {
    return await apiService.get<ItemImage[]>(`/items/${itemId}/images`);
  }

  // Remove item image
  async removeItemImage(imageId: string): Promise<void> {
    await apiService.delete(`/upload/${imageId}`);
  }

  // Get featured items (popular/recent)
  async getFeaturedItems(limit: number = 10): Promise<FrontendItemWithDetails[]> {
    const response = await apiService.get<PaginatedResponse<ItemWithDetails>>('/items/search', {
      params: { limit, page: 1 },
    });
    return response.items.map(item => this.convertBackendToFrontendItem(item));
  }

  // Get recommended items (based on user preferences)
  async getRecommendedItems(limit: number = 10): Promise<FrontendItemWithDetails[]> {
    // For now, return recent items. In a real app, this would use ML recommendations
    return this.getFeaturedItems(limit);
  }
}

// Export singleton instance
export const itemsApiService = new ItemsApiService();
