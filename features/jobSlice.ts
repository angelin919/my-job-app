import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Job, JobState } from "@/data/types/job";
import { mockJobsList } from '@/data/data';
import { FormData, FormErrors } from '@/data/types/form'


const initialState: JobState = {
    jobs: [],
    loading: false,
    error: null,
    filter: 'all',
    currentPage: 1,
    jobsPerPage: 4
};

// Async thunk для загрузки вакансий
export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async (_, { rejectWithValue }) => {
        try {
            // Имитация API запроса
            await new Promise(resolve => setTimeout(resolve, 1000));
            return mockJobsList;
        } catch (error) {
            return rejectWithValue('Failed to fetch jobs');
        }
    }
);

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        toggleFavorite: (state, action: PayloadAction<string>) => {
            const jobId = action.payload;
            console.log('🔄 REDUX: toggleFavorite called for job:', jobId);
            console.log('📊 REDUX: Current jobs array:', state.jobs);

            if (!state.jobs || !Array.isArray(state.jobs)) {
                console.error('❌ REDUX: Jobs is not an array!');
                state.jobs = [];
                return;
            }

            const job = state.jobs.find((j) => j.id === jobId);
            console.log('🔎 REDUX: Found job:', job);

            if (job) {
                console.log('📝 REDUX: Before toggle - isFavorite:', job.isFavorite);
                job.isFavorite = !job.isFavorite;
                console.log('✅ REDUX: After toggle - isFavorite:', job.isFavorite);
                console.log('🎯 REDUX: Job updated successfully!');
            } else {
                console.error('❌ REDUX: Job not found with id:', jobId);
                console.log('🔍 REDUX: Available job IDs:', state.jobs.map(j => j.id));
            }
        },
        deleteJob: (state, action: PayloadAction<string>) => {
            state.jobs = state.jobs.filter((j) => j.id !== action.payload)
        },
        setJobs: (state, action: PayloadAction<Job[]>) => {
            console.log('📥 Setting jobs in Redux:', action.payload.length);
            state.jobs = action.payload;
        },
        createJob: (state, action: PayloadAction<FormData>) => {
            if (!state.jobs || !Array.isArray(state.jobs)) {
                state.jobs = [];
            }
            const newJob: Job = {
                id: Date.now().toString(),
                title: action.payload.title,
                description: action.payload.description,
                salary_min: action.payload.salary_min,
                salary_max: action.payload.salary_max,
                salary_is_predicted: 0,
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
                isApplied: false
            };

            console.log('✅ Creating new job:', newJob);
            state.jobs.unshift(newJob);

        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },

        setJobsPerPage: (state, action: PayloadAction<number>) => {
            state.jobsPerPage = action.payload;
            state.currentPage = 1;
        },

    }
})
export const { toggleFavorite, deleteJob, setJobs, createJob, setCurrentPage, setJobsPerPage } = jobSlice.actions;
export default jobSlice.reducer;