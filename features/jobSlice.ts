import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Job, JobState } from "@/data/types/job";
import { jobService } from '@/services/jobApi';
import { FormData } from '@/data/types/form';

// Константы для фильтров
const DEFAULT_DEPARTMENTS = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'Operations', 'People & HR', 'Finance', 'Legal'];
const DEFAULT_SENIORITIES = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];
const DEFAULT_TYPES = ['Remote', 'Hybrid', 'On-site'];

const initialState: JobState = {
    jobs: [],
    loading: false,
    error: null,
    filter: 'all',
    currentPage: 1,
    jobsPerPage: 12,
    searchQuery: '', // Для поиска через API
    selectedDepartment: '',
    selectedSeniority: '',
    selectedType: '',
    selectedLocation: '',
    totalResult: 0,
    departments: DEFAULT_DEPARTMENTS,
    seniorities: DEFAULT_SENIORITIES,
    types: DEFAULT_TYPES
};

// Async thunk для загрузки вакансий
export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { jobs: JobState };
            const { 
                searchQuery, 
                selectedDepartment, 
                selectedSeniority, 
                selectedType, 
                selectedLocation,
                currentPage 
            } = state.jobs;
            
            console.log('🔄 fetchJobs thunk called with params:', {
                searchQuery,
                selectedDepartment,
                selectedSeniority,
                selectedType,
                selectedLocation,
                currentPage
            });
            
            const response = await jobService.searchJobs({
                search: searchQuery,
                department: selectedDepartment,
                seniority: selectedSeniority,
                type: selectedType,
                location: selectedLocation,
                page: currentPage,
                limit: state.jobs.jobsPerPage
            });
            
            console.log('✅ fetchJobs resolved with:', {
                jobsCount: response.jobs.length,
                totalCount: response.totalCount,
                firstJob: response.jobs[0] ? {
                    id: response.jobs[0].id,
                    title: response.jobs[0].title,
                    company: response.jobs[0].company.display_name
                } : null
            });

            return {
                jobs: response.jobs,
                totalResults: response.totalCount
            };
        } catch (error) {
            console.error('❌ fetchJobs rejected:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch jobs');
        }
    }
);

// Async thunk для поиска вакансий через API
export const searchJobs = createAsyncThunk(
    'jobs/searchJobs',
    async (searchParams: {
        search?: string;
        department?: string;
        seniority?: string;
        type?: string;
        location?: string;
    }, { rejectWithValue }) => {
        try {
            console.log('🔍 searchJobs thunk called with:', searchParams);
            
            const response = await jobService.searchJobs({
                ...searchParams,
                page: 1,
                limit: 50 // Больше результатов для поиска
            });

            console.log('✅ searchJobs resolved with:', {
                jobsCount: response.jobs.length,
                totalCount: response.totalCount
            });

            return {
                jobs: response.jobs,
                totalResults: response.totalCount,
                searchQuery: searchParams.search || '',
                selectedDepartment: searchParams.department || '',
                selectedSeniority: searchParams.seniority || '',
                selectedType: searchParams.type || '',
                selectedLocation: searchParams.location || ''
            };
        } catch (error) {
            console.error('❌ searchJobs rejected:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Search failed');
        }
    }
);

// Async thunk для трендовых вакансий
export const fetchTrendingJobs = createAsyncThunk(
    'jobs/fetchTrendingJobs',
    async (_, { rejectWithValue }) => {
        try {
            console.log('🔥 fetchTrendingJobs thunk called');
            const jobs = await jobService.getTrendingJobs();
            
            console.log('✅ fetchTrendingJobs resolved with:', {
                jobsCount: jobs.length
            });
            
            return { jobs, totalResults: jobs.length };
        } catch (error) {
            console.error('❌ fetchTrendingJobs rejected:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch trending jobs');
        }
    }
);

// Async thunk для загрузки по фильтрам
export const fetchJobsByFilters = createAsyncThunk(
    'jobs/fetchJobsByFilters',
    async (filters: {
        department?: string;
        seniority?: string;
        type?: string;
        location?: string;
    }, { rejectWithValue }) => {
        try {
            console.log('🎯 fetchJobsByFilters called with:', filters);
            
            const response = await jobService.searchJobs({
                ...filters,
                page: 1,
                limit: 20
            });

            return {
                jobs: response.jobs,
                totalResults: response.totalCount,
                selectedDepartment: filters.department || '',
                selectedSeniority: filters.seniority || '',
                selectedType: filters.type || '',
                selectedLocation: filters.location || ''
            };
        } catch (error) {
            console.error('❌ fetchJobsByFilters rejected:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch filtered jobs');
        }
    }
);

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        // Управление избранным и откликами
        toggleFavorite: (state, action: PayloadAction<string>) => {
            const jobId = action.payload;
            const job = state.jobs.find((j) => j.id === jobId);
            
            if (job) {
                job.isFavorite = !job.isFavorite;
                console.log('⭐ Toggle favorite for job:', jobId, '->', job.isFavorite);
            }
        },
        
        toggleApplied: (state, action: PayloadAction<string>) => {
            const jobId = action.payload;
            const job = state.jobs.find((j) => j.id === jobId);
            
            if (job) {
                job.isApplied = !job.isApplied;
                console.log('📝 Toggle applied for job:', jobId, '->', job.isApplied);
            }
        },
        
        deleteJob: (state, action: PayloadAction<string>) => {
            const jobId = action.payload;
            state.jobs = state.jobs.filter((j) => j.id !== jobId);
            console.log('🗑️ Deleted job:', jobId);
        },
        
        // Ручное управление jobs (для мок-данных или тестов)
        setJobs: (state, action: PayloadAction<Job[]>) => {
            console.log('📥 Setting jobs directly:', action.payload.length);
            state.jobs = action.payload;
        },
        
        // Создание новой вакансии (ручной ввод)
        createJob: (state, action: PayloadAction<FormData>) => {
            const newJob: Job = {
                id: Date.now().toString(),
                title: action.payload.title,
                description: action.payload.description,
                salary_min: action.payload.salary_min,
                salary_max: action.payload.salary_max,
                salary_is_predicted: '0',
                created: new Date().toISOString(),
                redirect_url: "#",
                contract_type: action.payload.contract_type,
                location: {
                    area: ["UK", action.payload.location],
                    display_name: action.payload.location
                },
                category: {
                    label: action.payload.category,
                    tag: action.payload.category.toLowerCase().replace(/\s+/g, '-')
                },
                company: {
                    display_name: action.payload.company
                },
                isFavorite: false,
                isApplied: false,
                source: 'manual'
            };

            console.log('✅ Creating new job:', newJob.title);
            state.jobs.unshift(newJob);
        },
        
        // Управление поиском и фильтрами
        setSearchQuery: (state, action: PayloadAction<string>) => {
            console.log('🔍 Set search query:', action.payload);
            state.searchQuery = action.payload;
        },
        
        setSelectedDepartment: (state, action: PayloadAction<string>) => {
            console.log('🏢 Set department:', action.payload);
            state.selectedDepartment = action.payload;
        },
        
        setSelectedSeniority: (state, action: PayloadAction<string>) => {
            console.log('📊 Set seniority:', action.payload);
            state.selectedSeniority = action.payload;
        },
        
        setSelectedType: (state, action: PayloadAction<string>) => {
            console.log('📍 Set job type:', action.payload);
            state.selectedType = action.payload;
        },
        
        setSelectedLocation: (state, action: PayloadAction<string>) => {
            console.log('🌍 Set location:', action.payload);
            state.selectedLocation = action.payload;
        },
        
        // Пагинация
        setCurrentPage: (state, action: PayloadAction<number>) => {
            console.log('📄 Set current page:', action.payload);
            state.currentPage = action.payload;
        },
        
        setJobsPerPage: (state, action: PayloadAction<number>) => {
            console.log('📊 Set jobs per page:', action.payload);
            state.jobsPerPage = action.payload;
            state.currentPage = 1; // Сбрасываем на первую страницу
        },
        
        // Фильтры (избранное/отклики)
        setFilter: (state, action: PayloadAction<'all' | 'favorites' | 'applied'>) => {
            console.log('🎯 Set filter:', action.payload);
            state.filter = action.payload;
        },
        
        // Очистка всех фильтров
        clearFilters: (state) => {
            console.log('🧹 Clearing all job filters');
            state.searchQuery = '';
            state.selectedDepartment = '';
            state.selectedSeniority = '';
            state.selectedType = '';
            state.selectedLocation = '';
            state.currentPage = 1;
            state.filter = 'all';
        },
        
        // Сброс ошибки
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Jobs
            .addCase(fetchJobs.pending, (state) => {
                console.log('⏳ fetchJobs.pending - current jobs:', state.jobs.length);
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                console.log('✅ fetchJobs.fulfilled - updating state:', {
                    jobsBefore: state.jobs.length,
                    jobsInPayload: action.payload.jobs.length,
                    totalResults: action.payload.totalResults
                });

                // Проверяем структуру данных
                if (!Array.isArray(action.payload.jobs)) {
                    console.error('❌ Payload jobs is not an array!');
                    state.loading = false;
                    state.error = 'Invalid data received';
                    return;
                }

                state.loading = false;
                state.jobs = action.payload.jobs;
                state.totalResult = action.payload.totalResults;
                state.error = null;
                
                console.log('✅ State updated successfully:', {
                    jobsAfter: state.jobs.length,
                    firstJob: state.jobs[0] ? state.jobs[0].title : 'none'
                });
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                console.log('❌ fetchJobs.rejected:', action.payload);
                state.loading = false;
                state.error = action.payload as string;
                state.jobs = [];
                state.totalResult = 0;
            })
            
            // Search Jobs
            .addCase(searchJobs.pending, (state) => {
                console.log('⏳ searchJobs.pending');
                state.loading = true;
                state.error = null;
            })
            .addCase(searchJobs.fulfilled, (state, action) => {
                console.log('✅ searchJobs.fulfilled:', {
                    jobsCount: action.payload.jobs.length,
                    searchQuery: action.payload.searchQuery
                });
                state.loading = false;
                state.jobs = action.payload.jobs;
                state.totalResult = action.payload.totalResults;
                state.searchQuery = action.payload.searchQuery;
                state.selectedDepartment = action.payload.selectedDepartment;
                state.selectedSeniority = action.payload.selectedSeniority;
                state.selectedType = action.payload.selectedType;
                state.selectedLocation = action.payload.selectedLocation;
                state.currentPage = 1;
                state.error = null;
            })
            .addCase(searchJobs.rejected, (state, action) => {
                console.log('❌ searchJobs.rejected:', action.payload);
                state.loading = false;
                state.error = action.payload as string;
            })
            
            // Fetch Trending Jobs
            .addCase(fetchTrendingJobs.fulfilled, (state, action) => {
                console.log('✅ fetchTrendingJobs.fulfilled:', {
                    jobsCount: action.payload.jobs.length
                });
                state.jobs = action.payload.jobs;
                state.totalResult = action.payload.totalResults;
            })
            
            // Fetch Jobs By Filters
            .addCase(fetchJobsByFilters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobsByFilters.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload.jobs;
                state.totalResult = action.payload.totalResults;
                state.selectedDepartment = action.payload.selectedDepartment;
                state.selectedSeniority = action.payload.selectedSeniority;
                state.selectedType = action.payload.selectedType;
                state.selectedLocation = action.payload.selectedLocation;
                state.currentPage = 1;
                state.error = null;
            })
            .addCase(fetchJobsByFilters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const {
    toggleFavorite,
    toggleApplied,
    deleteJob,
    setJobs,
    createJob,
    setSearchQuery,
    setSelectedDepartment,
    setSelectedSeniority,
    setSelectedType,
    setSelectedLocation,
    setCurrentPage,
    setJobsPerPage,
    setFilter,
    clearFilters,
    clearError
} = jobSlice.actions;

export default jobSlice.reducer;