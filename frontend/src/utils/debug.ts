// Debug utility for troubleshooting
export const debug = {
  log: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  
  error: (message: string, error?: any) => {
    if (import.meta.env.DEV) {
      console.error(`[DEBUG ERROR] ${message}`, error);
    }
  },
  
  warn: (message: string, data?: any) => {
    if (import.meta.env.DEV) {
      console.warn(`[DEBUG WARN] ${message}`, data);
    }
  }
};

// Monitor auth state changes
export const monitorAuthState = (user: any, isAuthenticated: boolean) => {
  debug.log('Auth state changed:', { user, isAuthenticated });
};

// Monitor navigation
export const monitorNavigation = (from: string, to: string) => {
  debug.log('Navigation:', { from, to });
};
