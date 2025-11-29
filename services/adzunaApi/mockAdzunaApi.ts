// import { mockJobsList, mockCategories, mockCompanies } from "../../data/types/adzuna/data";
// import { AdzunaCategory, AdzunaCompany, AdzunaSearchResponse } from "./adzunaApi";

// class MockAdzunaService {
//     private async simulateDelay(): Promise<void> {
//       await new Promise(resolve => setTimeout(resolve, 500));
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
//       await this.simulateDelay();
      
//       let filteredJobs = [...mockJobsList];
      
//       // Фильтрация по поисковому запросу
//       if (options.what) {
//         const query = options.what.toLowerCase();
//         filteredJobs = filteredJobs.filter(job => 
//           job.title.toLowerCase().includes(query) ||
//           job.description.toLowerCase().includes(query) ||
//           job.company.display_name.toLowerCase().includes(query)
//         );
//       }
      
//       // Фильтрация по категории
//       if (options.category) {
//         filteredJobs = filteredJobs.filter(job => 
//           job.category.tag === options.category
//         );
//       }
      
//       // Фильтрация по локации
//       if (options.location) {
//         filteredJobs = filteredJobs.filter(job => 
//           job.location.display_name.toLowerCase().includes(options.location!.toLowerCase())
//         );
//       }
  
//       return {
//         results: filteredJobs,
//         count: filteredJobs.length
//       };
//     }
  
//     async getCategories(country: string = 'gb'): Promise<AdzunaCategory[]> {
//       await this.simulateDelay();
//       return mockCategories;
//     }
  
//     async getTopCompanies(country: string = 'gb'): Promise<AdzunaCompany[]> {
//       await this.simulateDelay();
//       return mockCompanies;
//     }
  
//     async getSalaryHistogram(country: string = 'gb'): Promise<any> {
//       await this.simulateDelay();
//       return { /* мок-данные для гистограммы */ };
//     }
  
//     async getSalaryHistory(country: string = 'gb'): Promise<any> {
//       await this.simulateDelay();
//       return { /* мок-данные для истории */ };
//     }
  
//     async getGeoData(country: string = 'gb'): Promise<any> {
//       await this.simulateDelay();
//       return { /* мок-данные для геоданных */ };
//     }
//   }
  
//   export const mockAdzunaService = new MockAdzunaService();