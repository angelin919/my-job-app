// services/jobApi.ts
import { RiseJob } from '@/data/types/search';
import { riseService} from './riseApi';
import { Job } from '@/data/types/job';

// Функция для преобразования RiseJob в наш формат Job
export function transformRiseJobToJob(riseJob: RiseJob): Job {
  // Генерируем примерные зарплаты на основе seniority
  const salaryRanges = {
    'Entry Level': { min: 40000, max: 60000 },
    'Mid Level': { min: 60000, max: 90000 },
    'Senior Level': { min: 80000, max: 130000 },
    'Executive': { min: 120000, max: 250000 }
  };

  const range = salaryRanges[riseJob.seniority as keyof typeof salaryRanges] || { min: 50000, max: 80000 };

  return {
    id: riseJob._id,
    title: riseJob.title,
    description: riseJob.description || 'No description available',
    salary_min: range.min,
    salary_max: range.max,
    salary_is_predicted: '1', // Так как зарплаты генерируем
    created: riseJob.createdAt,
    redirect_url: riseJob.url,
    contract_type: riseJob.type,
    location: {
      area: ['Remote', riseJob.locationAddress],
      display_name: riseJob.locationAddress
    },
    category: {
      label: riseJob.department,
      tag: riseJob.department?.toLowerCase().replace(/\s+/g, '-') || 'general'
    },
    company: {
      display_name: riseJob.owner.companyName
    },
    isFavorite: false,
    isApplied: false,
    source: 'api',
    
    // Новые поля
    type: riseJob.type,
    department: riseJob.department,
    seniority: riseJob.seniority,
    owner: {
      companyName: riseJob.owner.companyName,
      photo: riseJob.owner.photo,
      rating: riseJob.owner.rating,
      badges: riseJob.owner.badges,
      benefits: riseJob.owner.benefits,
      sector: riseJob.owner.sector,
      teamSize: riseJob.owner.teamSize
    }
  };
}

export class JobService {
  async searchJobs(params: {
    search?: string;
    department?: string;
    seniority?: string;
    type?: string;
    location?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ jobs: Job[]; totalCount: number }> {
    try {
      const response = await riseService.searchJobs({
        search: params.search,
        department: params.department,
        seniority: params.seniority,
        type: params.type,
        location: params.location,
        page: params.page || 1,
        limit: params.limit || 20
      });

      const jobs = response.result.jobs.map(transformRiseJobToJob);
      
      return {
        jobs,
        totalCount: response.result.count
      };
    } catch (error) {
      console.error('Job service error:', error);
      throw error;
    }
  }

  async getTrendingJobs(limit: number = 20): Promise<Job[]> {
    const response = await riseService.getTrendingJobs(limit);
    return response.result.jobs.map(transformRiseJobToJob);
  }

  async getJobsByDepartment(department: string): Promise<Job[]> {
    const response = await riseService.getJobsByDepartment(department);
    return response.result.jobs.map(transformRiseJobToJob);
  }

  async getJobsBySeniority(seniority: string): Promise<Job[]> {
    const response = await riseService.getJobsBySeniority(seniority);
    return response.result.jobs.map(transformRiseJobToJob);
  }
}

export const jobService = new JobService();