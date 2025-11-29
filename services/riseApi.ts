import { RiseJobsResponse } from "@/data/types/search";

const RISE_BASE_URL = 'https://api.joinrise.io/api/v1';

export interface RiseJobSearchParams {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sortedBy?: string;
  includeDescription?: boolean;
  isTrending?: boolean;
  type?: string;
  department?: string;
  seniority?: string;
  location?: string;
  search?: string;
}

export class RiseService {
  private async makeRequest<T>(endpoint: string, params: RiseJobSearchParams = {}): Promise<T> {
    const urlParams = new URLSearchParams();
    
    // Добавляем параметры по умолчанию
    const defaultParams: RiseJobSearchParams = {
      page: 1,
      limit: 20,
      sort: 'desc',
      sortedBy: 'createdAt',
      includeDescription: true
    };
    
    const allParams = { ...defaultParams, ...params };
    
    // Преобразуем параметры в строку запроса
    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        urlParams.append(key, value.toString());
      }
    });

    const url = `${RISE_BASE_URL}${endpoint}?${urlParams.toString()}`;
    
    console.log('🔄 Making request to Rise API:', url);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Rise API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Rise API returned unsuccessful response');
      }

      return data;
    } catch (error) {
      console.error('❌ Rise API Error:', error);
      throw error;
    }
  }

  async searchJobs(params: RiseJobSearchParams = {}): Promise<RiseJobsResponse> {
    return this.makeRequest<RiseJobsResponse>('/jobs/public', params);
  }

  async getTrendingJobs(limit: number = 20): Promise<RiseJobsResponse> {
    return this.searchJobs({
      isTrending: true,
      limit,
      sort: 'desc',
      sortedBy: 'createdAt'
    });
  }

  async getJobsByType(type: string, params: RiseJobSearchParams = {}): Promise<RiseJobsResponse> {
    return this.searchJobs({ ...params, type });
  }

  async getJobsByDepartment(department: string, params: RiseJobSearchParams = {}): Promise<RiseJobsResponse> {
    return this.searchJobs({ ...params, department });
  }

  async getJobsBySeniority(seniority: string, params: RiseJobSearchParams = {}): Promise<RiseJobsResponse> {
    return this.searchJobs({ ...params, seniority });
  }

  async searchJobsByKeyword(keyword: string, params: RiseJobSearchParams = {}): Promise<RiseJobsResponse> {
    return this.searchJobs({ ...params, search: keyword });
  }
}

export const riseService = new RiseService();