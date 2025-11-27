'use client'
import { mockJobsList } from "@/data/data";
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { useMemo } from "react";
import SearchBar from "./SearchBar";
import JobCard from "./JobCard";
import { Job } from "@/data/types/job";
import { fetchJobs, setJobs, setCurrentPage } from "@/features/jobSlice";
import Pagination from "./Pagination";




function JobList() {

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    const dispatch = useAppDispatch();
    const searchState = useAppSelector((state) => state.search);

    const { searchTerm, searchField } = searchState;
    const { jobs, loading, error, filter, currentPage, jobsPerPage } = useAppSelector((state) => state.jobs);

    // const jobs = [...mockJobsList]
    // console.log(jobs, 'jobs[]')


    useEffect(() => {
        console.log('🔄 Checking Redux store...', {
            reduxJobsCount: jobs.length,
            shouldLoad: jobs.length === 0
        });

        if (jobs.length === 0) {
            console.log('📥 Loading mock data into Redux...');
            // Вместо fetchJobs, сразу устанавливаем мок данные
            dispatch(setJobs(mockJobsList));
        }
    }, [dispatch, jobs.length]);
    // Упрощенная функция поиска - только по title и category
    const filteredJobs = useMemo(() => {

        if (!searchTerm.trim()) {
            return [];
        }
        const searchLower = searchTerm.toLowerCase().trim();
        const result = jobs.filter(job => {
            const matchesTitle = job.title.toLowerCase().includes(searchLower);
            const matchesCategory = job.category.label.toLowerCase().includes(searchLower);
            switch (searchField) {
                case 'title':
                    console.log(matchesTitle, 'matchesTitle')
                    return matchesTitle;
                case 'category':
                    console.log(matchesCategory, 'matchesCategory')
                    return matchesCategory;
                case 'both':
                default:
                    console.log(matchesCategory, matchesTitle, '-both')

                    return matchesTitle || matchesCategory;
            }
        })
        return result;
    }, [jobs, searchTerm, searchField]);
    const safeFilteredJobs = filteredJobs || [];

    console.log(safeFilteredJobs, 'safeFilteredJobs[]')
    console.log(filteredJobs, 'filteredJobs[]')



    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = safeFilteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(safeFilteredJobs.length / jobsPerPage);
    const totalPagesMain = Math.ceil(jobs.length / jobsPerPage);

    console.log(currentJobs, 'currentJobs[]')

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
        // Плавная прокрутка к верху
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        dispatch(setCurrentPage(1));
    }, [searchTerm, filter, dispatch]);
    console.log('🔍 Pagination Debug:', {
        filteredJobsLength: filteredJobs.length,
        safeFilteredJobsLength: safeFilteredJobs.length,
        currentPage,
        jobsPerPage,
        totalPages,
        hasPagination: totalPages > 1
    });

    if (!isClient) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="max-w-4xl mx-auto">

                <div className="relative">
                    <SearchBar
                        placeholder="Searching in titles, companies..."
                        className="w-full"
                    />
                </div>

                {
                    safeFilteredJobs.length !== 0 ? (
                        <div>
                            <p className="text-gray-600 mt-1">
                                {safeFilteredJobs.length} {safeFilteredJobs.length === 1 ? 'job' : 'jobs'} found
                                {searchTerm && (
                                    <span className="text-blue-600 ml-2">
                                        for "{searchTerm}"  {/* ← Вот здесь показывается поисковый запрос */}
                                    </span>
                                )}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                                {currentJobs.map((job: Job) => (
                                    <JobCard key={job.id} jobId={job.id} />))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>

                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Job Card Demo</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {jobs.map(job => (
                                    <JobCard key={job.id} jobId={job.id} />))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPagesMain}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )
                }


            </div>

        </div>
    );
}

export default JobList;
