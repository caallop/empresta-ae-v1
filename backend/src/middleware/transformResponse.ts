import { Request, Response, NextFunction } from 'express';

// Função para converter snake_case para camelCase
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Função para transformar objeto de snake_case para camelCase com mapeamentos específicos
function transformToCamelCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformToCamelCase);
  }

  if (typeof obj === 'object') {
    const transformed: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = toCamelCase(key);
        let value = transformToCamelCase(obj[key]);

        // Mapeamentos específicos para compatibilidade com o frontend
        if (camelKey === 'dailyRate' && typeof value === 'string') {
          // Converter dailyRate string para price number
          transformed.price = parseFloat(value) || 0;
        } else if (camelKey === 'isAvailable') {
          // Converter isAvailable para status
          transformed.status = value ? 'available' : 'unavailable';
        } else if (camelKey === 'locationAddress') {
          // Criar objeto location com address
          if (!transformed.location) {
            transformed.location = {};
          }
          transformed.location.address = value;
        } else if (camelKey === 'locationLat') {
          // Adicionar latitude ao objeto location
          if (!transformed.location) {
            transformed.location = {};
          }
          transformed.location.latitude = parseFloat(value) || 0;
        } else if (camelKey === 'locationLng') {
          // Adicionar longitude ao objeto location
          if (!transformed.location) {
            transformed.location = {};
          }
          transformed.location.longitude = parseFloat(value) || 0;
        } else if (camelKey === 'images' && Array.isArray(value)) {
          // Converter array de objetos de imagem para array de strings (URLs)
          transformed.images = value.map((img: any) => img.url || img).filter(Boolean);
        } else {
          transformed[camelKey] = value;
        }
      }
    }
    return transformed;
  }

  return obj;
}

// Middleware para transformar respostas
export const transformResponse = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function(data: any) {
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        const transformed = transformToCamelCase(parsed);
        return originalSend.call(this, JSON.stringify(transformed));
      } catch {
        return originalSend.call(this, data);
      }
    } else if (typeof data === 'object') {
      const transformed = transformToCamelCase(data);
      return originalSend.call(this, transformed);
    }

    return originalSend.call(this, data);
  };

  next();
};
