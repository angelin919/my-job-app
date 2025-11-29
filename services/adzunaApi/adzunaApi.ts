// const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api';
// const APP_ID = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
// const APP_KEY = process.env.NEXT_PUBLIC_ADZUNA_APP_KEY;
// const PROXY_BASE_URL = '/api/adzuna';
// const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API
// // import {mockJobsList} from '../data/data'
// import { mockAdzunaService } from './mockAdzunaApi';

// export interface AdzunaJob {
//     id: string;
//     title: string;
//     description: string;
//     salary_min: number;
//     salary_max: number;
//     salary_is_predicted: string;
//     created: string;
//     redirect_url: string;
//     contract_type: string;
//     location: {
//       area: string[];
//       display_name: string;
//     };
//     category: {
//       label: string;
//       tag: string;
//     };
//     company: {
//       display_name: string;
//     };
//   }

//   export interface AdzunaCategory {
//     tag: string;
//     label: string;
//   }
  
//   export interface AdzunaCompany {
//     display_name: string;
//     count: number;
//   }
  
//   export interface AdzunaSearchResponse {
//     results: AdzunaJob[];
//     count: number;
//   }

//   class AdzunaService {
//     private async makeRequest<T>(endpoint: string): Promise<T> {
//     //   const url = `${ADZUNA_BASE_URL}${endpoint}?app_id=${APP_ID}&app_key=${APP_KEY}`;
         
    
//     if(USE_MOCK_API){

//         console.log('🎭 Using mock API for:', endpoint);
//         // Для мок-режима имитируем задержку
//         await new Promise(resolve => setTimeout(resolve, 500));
        
//         // В мок-режиме возвращаем ошибку, так как методы будут вызываться напрямую
//         throw new Error('Mock mode: use direct method calls');
//     }
//     // Убираем начальный слэш если есть
//     const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
//     const url = `${PROXY_BASE_URL}/${cleanEndpoint}`;
//     console.log('🔄 Making proxied request to:', url);

//       try {
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error(`API request failed: ${response.status}`);
//         }
//         return await response.json();
//       } catch (error) {
//         console.error('Adzuna API Error:', error);
//         throw error;
//       }
//     }
  
//     async searchJobs(
//       country: string = 'gb',
//       page: number = 1,
//       options: {
//         what?: string;
//         category?: string;
//         location?: string;
//       } = {}
//     ): Promise<AdzunaSearchResponse> {
//         if (USE_MOCK_API) {
//             return mockAdzunaService.searchJobs(country, page, options);
//           }


//       let endpoint = `/jobs/${country}/search/${page}`;
      
//       const params = new URLSearchParams();
//       if (options.what) params.append('what', options.what);
//       if (options.category) params.append('category', options.category);
//       if (options.location) params.append('where', options.location);
      
//       const queryString = params.toString();
//       if (queryString) {
//         endpoint += `?${queryString}`;
//       }
  
//       return this.makeRequest<AdzunaSearchResponse>(endpoint);
//     }
  
//     async getCategories(country: string = 'gb'): Promise<AdzunaCategory[]> {
//       const response = await this.makeRequest<{ results: AdzunaCategory[] }>(
//         `/jobs/${country}/categories`
//       );
//       return response.results;
//     }
  
//     async getTopCompanies(country: string = 'gb'): Promise<AdzunaCompany[]> {
//         if (USE_MOCK_API) {
//             return mockAdzunaService.getTopCompanies(country);
//           }
//       const response = await this.makeRequest<{ leaderboard: AdzunaCompany[] }>(
//         `/jobs/${country}/top_companies`
//       );
//       return response.leaderboard;
//     }
  
//     async getSalaryHistogram(country: string = 'gb'): Promise<any> {
//       return this.makeRequest(`/jobs/${country}/histogram`);
//     }
  
//     async getSalaryHistory(country: string = 'gb'): Promise<any> {
//       return this.makeRequest(`/jobs/${country}/history`);
//     }
  
//     async getGeoData(country: string = 'gb'): Promise<any> {
//       return this.makeRequest(`/jobs/${country}/geodata`);
//     }
//   }
  
//   export const adzunaService = new AdzunaService();