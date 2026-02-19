import { apiClient } from '../client/axios-client';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

export interface Product {
  [key: string]: any;
}

export interface ProductsListResponse {
  items: Product[];
  total: number;
  page: number;
  pages: number;
}

export interface ProductDetailResponse {
  product: Product;
}

export interface ProductCreateData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  brand?: string;
  images?: string[];
  attributes?: Record<string, any>;
  options?: any[];
  variants?: any[];
}

export interface ProductUpdateData extends Partial<ProductCreateData> {
  isDeleted?: boolean;
}

class ProductsService {
  async getProducts(
    page: number = 1,
    limit: number = 10,
    query?: {
      q?: string;
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      includeDeleted?: boolean;
    }
  ): Promise<ProductsListResponse> {
    const response = await apiClient.get<ProductsListResponse>(
      API_ENDPOINTS.PRODUCTS,
      {
        params: {
          page,
          limit,
          ...query,
        },
      }
    );
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<ProductDetailResponse>(
      API_ENDPOINTS.PRODUCT_BY_ID(id)
    );
    return response.data.product;
  }

  async createProduct(data: ProductCreateData): Promise<Product> {
    const response = await apiClient.post<ProductDetailResponse>(
      API_ENDPOINTS.PRODUCTS,
      data
    );
    return response.data.product;
  }

  async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
    const response = await apiClient.put<ProductDetailResponse>(
      API_ENDPOINTS.PRODUCT_BY_ID(id),
      data
    );
    return response.data.product;
  }

  async patchProduct(id: string, data: ProductUpdateData): Promise<Product> {
    const response = await apiClient.patch<ProductDetailResponse>(
      API_ENDPOINTS.PRODUCT_BY_ID(id),
      data
    );
    return response.data.product;
  }

  async deleteProduct(id: string): Promise<any> {
    const response = await apiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
    return response.data;
  }

  async restoreProduct(id: string): Promise<Product> {
    const response = await apiClient.post<ProductDetailResponse>(
      API_ENDPOINTS.PRODUCT_RESTORE(id)
    );
    return response.data.product;
  }

  async importProducts(items: any[]): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS_IMPORT, {
      items,
    });
    return response.data;
  }

  async exportProducts(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS_EXPORT);
    return response.data;
  }

  async updatePricesBulk(data: any): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS_PRICE_BULK, data);
    return response.data;
  }

  async updateStockBulk(data: any): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS_STOCK_BULK, data);
    return response.data;
  }
}

export const productsService = new ProductsService();
