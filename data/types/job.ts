export interface Job {
    id: string;
    title: string;
    description: string;
    salary_min: number;
    salary_max: number;
    salary_is_predicted: number;
    created: string;
    redirect_url: string;
    contract_type: string;
    location: Location;
    category: Category;
    company: Company;
    longitude?: number;
    latitude?: number;
    isFavorite?: boolean;
    isApplied?: boolean;
  }

  export interface Location {
    area: string[];
    display_name: string;
  }
  
  export interface Category {
    label: string;
    tag: string;
  }
  
  export interface Company {
    display_name: string;
  }

  export interface JobState {
    jobs: Job[];
    loading: boolean;
    error: string | null;
    filter: 'all' | 'favorites' | 'applied';
    currentPage: number;
    jobsPerPage: number;
  }