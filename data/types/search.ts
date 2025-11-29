import { Job } from "./job";

export interface JobSearchParams {
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

export interface RiseJobsResponse {
  success: boolean;
  legal: string;
  result: {
    count: number;
    jobs: RiseJob[];
  };
}

export interface RiseJob {
  _id: string;
  title: string;
  description?: string;
  type: string;
  department: string;
  seniority: string;
  locationAddress: string;
  locationCoordinates: {
    lon: number;
    lat: number;
  } | null;
  url: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    _id: string;
    companyName: string;
    photo: string;
    locationAddress: string;
    rating: string;
    evaluatedSize: string;
    sector: string;
    teamSize: number;
    funding: string;
    isClaimed: boolean;
    badges: string[];
    benefits: {
      benefits: string[];
      title: string;
    };
    values: {
      values: string[];
      title: string;
    };
    slug: string;
  };
}

export interface SearchState {
  searchTerm: string;
  searchField: 'both' | 'title' | 'category';
  recentSearches: string[];
  isSearchActive: boolean;
}

export interface JobState {
    jobs: Job[];
    loading: boolean;
    error: string | null;
    filter: 'all' | 'favorites' | 'applied';
    currentPage: number;
    jobsPerPage: number;
    searchQuery: string;
    selectedDepartment: string;
    selectedSeniority: string;
    selectedType: string;
    selectedLocation: string;
    totalResults: number;
    departments: string[];
    seniorities: string[];
    types: string[];
    // Добавьте searchState если нужно
    searchState?: SearchState;
}