'use client'
import { useEffect, useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import SearchBar from "./SearchBar";
import JobCard from "./JobCard";
import { Job } from "@/data/types/job";
import { fetchJobs, setCurrentPage } from "@/features/jobSlice";
import Pagination from "./Pagination";

function JobList() {
    const dispatch = useAppDispatch();
    // Получаем данные из обоих slice
    const searchState = useAppSelector((state) => state.search);
    const jobsState = useAppSelector((state) => state.jobs);
    const { searchTerm, searchField } = searchState;

    const { jobs, loading, error, filter, currentPage, jobsPerPage } = jobsState;

    const [updateCount, setUpdateCount] = useState(0);

    // Отладочная информация
    console.log('🔍 JobList DEBUG:', {
        // Search slice
        searchTerm,
        searchField,
        // Jobs slice
        jobsCount: jobs.length,
        loading,
        error,
        currentPage,
        jobsPerPage
    });

    // Загружаем данные при монтировании
    useEffect(() => {
        console.log('🔄 JobList mounted, loading jobs...');
        dispatch(fetchJobs());
    }, [dispatch]);

    // Отслеживаем изменения в jobs
    useEffect(() => {
        console.log('📊 Jobs array changed:', {
            length: jobs.length,
            firstJob: jobs[0],
            allJobs: jobs.map(j => ({ id: j.id, title: j.title }))
        });
    }, [jobs]);

    // Фильтрация jobs
    const filteredJobs = useMemo(() => {
        if (!searchTerm.trim()) {
            console.log('🔍 No search term, showing all jobs');
            return jobs;
        }

        const searchLower = searchTerm.toLowerCase().trim();
        console.log('🔍 Filtering jobs with term:', searchLower);

        const result = jobs.filter(job => {
            const matchesTitle = job.title.toLowerCase().includes(searchLower);
            const matchesCategory = job.category.label.toLowerCase().includes(searchLower);

            console.log(`🔍 Job "${job.title}":`, {
                matchesTitle,
                matchesCategory,
                category: job.category.label
            });

            switch (searchField) {
                case 'title':
                    return matchesTitle;
                case 'category':
                    return matchesCategory;
                case 'both':
                default:
                    return matchesTitle || matchesCategory;
            }
        });

        console.log('🔍 Filtered jobs result:', result.length, 'jobs found');
        return result;
    }, [jobs, searchTerm, searchField]);

    // Определяем какие jobs показывать
    const displayJobs = searchTerm.trim() ? filteredJobs : jobs;
    const totalPages = Math.ceil(displayJobs.length / jobsPerPage);
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = displayJobs.slice(indexOfFirstJob, indexOfLastJob);

    const handlePageChange = (page: number) => {
        console.log('📄 Page change to:', page);
        dispatch(setCurrentPage(page));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Сбрасываем страницу при изменении поиска или фильтра
    useEffect(() => {
        dispatch(setCurrentPage(1));
    }, [searchTerm, filter, dispatch]);

    // Принудительная перезагрузка
    const handleForceReload = () => {
        console.log('🔄 Manually reloading jobs...');
        dispatch(fetchJobs());
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading jobs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center text-red-600">
                    <p className="text-lg font-semibold mb-2">Error loading jobs</p>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={handleForceReload}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto">

                {/* Debug информация */}
                {/* <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-bold text-blue-800 mb-2">Debug Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-semibold">Render Count:</span> {updateCount}
                        </div>
                        <div>
                            <span className="font-semibold">Total Jobs:</span> {jobs.length}
                        </div>
                        <div>
                            <span className="font-semibold">Display Jobs:</span> {displayJobs.length}
                        </div>
                        <div>
                            <span className="font-semibold">Current Page:</span> {currentPage}
                        </div>
                        <div>
                            <span className="font-semibold">Search Term:</span> {searchTerm}
                        </div>
                        <div>
                            <span className="font-semibold">Search Field:</span> {searchField}
                        </div>
                        <div>
                            <span className="font-semibold">Filtered Jobs:</span> {filteredJobs.length}
                        </div>
                        <div>
                            <button
                                onClick={handleForceReload}
                                className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                            >
                                Reload Data
                            </button>
                        </div>
                    </div>
                </div> */}

                {/* Search Bar */}
                <div className="relative mb-8">
                    <SearchBar
                        placeholder="Search in job titles, categories..."
                        className="w-full"
                    />
                </div>

                {/* Search Results Info */}
                {searchTerm.trim() && (
                    <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-lg text-gray-800">
                            <span className="font-semibold">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'job' : 'jobs'} found
                            <span className="text-blue-600 ml-2">
                                for {searchTerm}
                            </span>
                        </p>
                        {filteredJobs.length === 0 && jobs.length > 0 && (
                            <p className="text-gray-600 mt-2">
                                Try different keywords or check the spelling
                            </p>
                        )}
                    </div>
                )}

                {/* Jobs Grid */}
                {displayJobs.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            {searchTerm ? 'No jobs found' : 'No jobs available'}
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                            {searchTerm
                                ? `We couldn't find any jobs matching "${searchTerm}". Try different keywords.`
                                : 'There are currently no jobs available. Check back later or try reloading.'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={handleForceReload}
                                className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                            >
                                Reload Jobs
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Jobs Count */}
                        {!searchTerm.trim() && (
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Available Jobs ({displayJobs.length})
                                </h2>
                                <span className="text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </span>
                            </div>
                        )}

                        {/* Jobs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {currentJobs.map((job: Job) => (
                                <JobCard key={job.id} jobId={job.id} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Raw Data Preview (для отладки) */}
                {/* {process.env.NODE_ENV === 'development' && jobs.length > 0 && (
                    <details className="mt-12 bg-yellow-50 p-4 rounded-lg">
                        <summary className="cursor-pointer font-semibold text-yellow-800">
                            Raw Jobs Data (Development Only)
                        </summary>
                        <pre className="mt-2 text-xs overflow-auto max-h-60 bg-white p-4 rounded border">
                            {JSON.stringify(jobs.slice(0, 3).map(job => ({
                                id: job.id,
                                title: job.title,
                                company: job.company.display_name,
                                category: job.category.label,
                                salary: `£${job.salary_min} - £${job.salary_max}`
                            })), null, 2)}
                        </pre>
                    </details>
                )} */}
            </div>
        </div>
    );
}

export default JobList;