import { apiService } from '@/services/api';

export const testApiConnection = async () => {
  try {
    console.log('🔍 Testando conexão com a API...');
    
    // Test health endpoint
    const healthResponse = await apiService.get('/health');
    console.log('✅ Health check:', healthResponse);
    
    // Test API base endpoint
    const apiResponse = await apiService.get('/');
    console.log('✅ API base:', apiResponse);
    
    return {
      success: true,
      health: healthResponse,
      api: apiResponse,
    };
  } catch (error) {
    console.error('❌ Erro na conexão com a API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const testAuthEndpoints = async () => {
  try {
    console.log('🔍 Testando endpoints de autenticação...');
    
    // Test login endpoint (should return 401 for invalid credentials)
    try {
      await apiService.post('/auth/login', {
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    } catch (error: any) {
      if (error.message.includes('401') || error.message.includes('Invalid')) {
        console.log('✅ Login endpoint está funcionando (retornou erro esperado)');
      } else {
        console.log('⚠️ Login endpoint retornou erro inesperado:', error.message);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao testar endpoints de auth:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Auto-test on import in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    testApiConnection();
  }, 1000);
}
