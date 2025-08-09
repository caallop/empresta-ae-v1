// API Configuration
export const API_CONFIG = {
  // Base URL for API calls
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
  
  // Auth endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
      CHANGE_PASSWORD: '/auth/change-password',
      GOOGLE: '/auth/google',
      FACEBOOK: '/auth/facebook',
      APPLE: '/auth/apple',
    },
    USERS: {
      PROFILE: '/users/profile',
      AVATAR: '/users/avatar',
      LOCATION: '/users/location',
    },
    ITEMS: {
      LIST: '/items',
      CREATE: '/items',
      DETAILS: '/items/:id',
      UPDATE: '/items/:id',
      DELETE: '/items/:id',
      SEARCH: '/items/search',
    },
    CATEGORIES: {
      LIST: '/categories',
    },
    LOANS: {
      CREATE: '/loans',
      LIST: '/loans',
      DETAILS: '/loans/:id',
      UPDATE: '/loans/:id',
    },
    MESSAGES: {
      LIST: '/messages',
      CREATE: '/messages',
      CONVERSATION: '/messages/conversation/:itemId',
    },
    REVIEWS: {
      LIST: '/reviews',
      CREATE: '/reviews',
      UPDATE: '/reviews/:id',
      DELETE: '/reviews/:id',
    },
    UPLOAD: {
      IMAGE: '/upload/image',
    },
  },
  
  // Headers configuration
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Environment check
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API Status
export const API_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  LOADING: 'loading',
  ERROR: 'error',
} as const;

export type ApiStatus = typeof API_STATUS[keyof typeof API_STATUS];
