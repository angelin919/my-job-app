import { Job } from "@/data/types/job";
import { FALLBACK_JOBS } from "../data/fallbackJobs";

// Функция для безопасной фильтрации fallback данных
function getFallbackJobsSafe(params?: {
  search?: string;
  department?: string;
  seniority?: string;
  type?: string;
  location?: string;
  page?: number;
  limit?: number;
}): { jobs: Job[]; totalCount: number } {
  console.log('🎭 Using safe fallback data');
  
  let filteredJobs = FALLBACK_JOBS;
  
  // Поиск по всем полям
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.company.display_name.toLowerCase().includes(searchLower) ||
      job.category.label.toLowerCase().includes(searchLower)
    );
  }
  
  // Безопасная фильтрация
  if (params?.department && params.department.trim() !== '') {
    const departmentLower = params.department.toLowerCase().trim();
    filteredJobs = filteredJobs.filter(job => 
      job.department?.toLowerCase() === departmentLower
    );
  }

  if (params?.seniority && params.seniority.trim() !== '') {
    const seniorityLower = params.seniority.toLowerCase().trim();
    filteredJobs = filteredJobs.filter(job => 
      job.seniority?.toLowerCase() === seniorityLower
    );
  }
  
  if (params?.type && params.type.trim() !== '') {
    const typeLower = params.type.toLowerCase().trim();
    filteredJobs = filteredJobs.filter(job => 
      job.type?.toLowerCase() === typeLower
    );
  }

  if (params?.location && params.location.trim() !== '') {
    const locationLower = params.location.toLowerCase().trim();
    filteredJobs = filteredJobs.filter(job => 
      job.location.display_name.toLowerCase().includes(locationLower)
    );
  }
  
  console.log('✅ Returning safe fallback jobs:', filteredJobs.length);
  
  return {
    jobs: filteredJobs,
    totalCount: filteredJobs.length
  };
}

// Основная функция для загрузки вакансий - ВАЖНО: экспортируем!
export async function fetchJobsServer(params?: {
  search?: string;
  department?: string;
  seniority?: string;
  type?: string;
  location?: string;
  page?: number;
  limit?: number;
}): Promise<{ jobs: Job[]; totalCount: number }> {
  try {
    console.log('🔄 Server Action: fetchJobsServer called with:', params);
    
    // Параметры для Rise API
    const apiParams = new URLSearchParams({
      page: (params?.page || 1).toString(),
      limit: (params?.limit || 20).toString(),
      sort: 'desc',
      sortedBy: 'createdAt',
      includeDescription: 'true'
    });

    // Безопасное добавление параметров
    if (params?.search) apiParams.append('search', params.search);
    if (params?.department) apiParams.append('department', params.department);
    if (params?.seniority) apiParams.append('seniority', params.seniority);
    if (params?.type) apiParams.append('type', params.type);
    if (params?.location) apiParams.append('location', params.location);

    const riseUrl = `https://api.joinrise.io/api/v1/jobs/public?${apiParams.toString()}`;
    
    console.log('🔗 Server fetching from:', riseUrl);

    const response = await fetch(riseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'MyJobApp-Server/1.0'
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Rise API error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Server Action: Rise API success, jobs:', data.result?.jobs?.length || 0);

    if (data.result?.jobs) {
      // Преобразуем данные в наш формат
      const transformedJobs = data.result.jobs.map((apiJob: any) => ({
        id: apiJob._id,
        title: apiJob.title,
        description: apiJob.description || 'No description available',
        salary_min: apiJob.salary_min || 50000,
        salary_max: apiJob.salary_max || 80000,
        salary_is_predicted: '1',
        created: apiJob.createdAt,
        redirect_url: apiJob.url,
        contract_type: apiJob.type,
        location: {
          area: ['Remote', apiJob.locationAddress],
          display_name: apiJob.locationAddress
        },
        category: {
          label: apiJob.department,
          tag: apiJob.department?.toLowerCase().replace(/\s+/g, '-') || 'general'
        },
        company: {
          display_name: apiJob.owner?.companyName || 'Unknown Company'
        },
        isFavorite: false,
        isApplied: false,
        source: 'api',
        type: apiJob.type,
        department: apiJob.department,
        seniority: apiJob.seniority
      }));

      return {
        jobs: transformedJobs,
        totalCount: data.result.count
      };
    } else {
      throw new Error('No jobs data in response');
    }

  } catch (error) {
    console.log('🎭 Server Action: Using fallback data due to error:', error);
    return getFallbackJobsSafe(params);
  }
}
export async function fetchJobById(jobId: string): Promise<Job | null> {
    try {
      // ... код функции использует LOCAL_FALLBACK_JOBS вместо FALLBACK_JOBS
      const fallbackJob = FALLBACK_JOBS.find(job => job.id === jobId);
      return fallbackJob || null;
    } catch (error) {
      console.error('❌ Error fetching job:', error);
      const fallbackJob = FALLBACK_JOBS.find(job => job.id === jobId);
      return fallbackJob || null;
    }
  }