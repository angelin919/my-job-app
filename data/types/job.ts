export interface Job {
  id: string;
  title: string;
  description: string;
  salary_min: number;
  salary_max: number;
  salary_is_predicted: string;
  created: string;
  redirect_url: string;
  contract_type: string;
  location: {
    area: string[];
    display_name: string;
  };
  category: {
    label: string;
    tag: string;
  };
  company: {
    display_name: string;
  };
  isFavorite: boolean;
  isApplied: boolean;
  source?: 'api' | 'manual';
  
  // Новые поля из Rise API
  type?: string;
  department?: string;
  seniority?: string;
  owner?: {
    companyName: string;
    photo: string;
    rating: string;
    badges: string[];
    benefits: {
      benefits: string[];
    };
    sector: string;
    teamSize: number;
  };
}


export interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'favorites' | 'applied';
  currentPage: number;
  jobsPerPage: number;
  searchQuery:string;
  selectedDepartment:string;
  selectedSeniority:string;
  selectedType:string;
  selectedLocation:string;
  totalResult:number;
  departments:string[];
  seniorities:string[];
  types:string[]
}