'use client'
import { mockJobsList } from '@/data/data';
import { Job } from '@/data/types/job';
import { useRouter } from 'next/navigation';
import React from 'react';
import { HeartIcon, BookmarkIcon, TrashIcon, MapPinIcon, BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { deleteJob, toggleFavorite } from '@/features/jobSlice';

// interface JobCardProps {
//     job: Job;
// }
interface JobCardProps {
    jobId: string;
}
const JobCard = ({ jobId }: JobCardProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const job = useAppSelector((state) =>
        state.jobs.jobs.find(j => j.id === jobId)
    );
    if (!job) {
        console.warn('⚠️ Job not found for ID:', jobId);
        return null;
      }
    

    const handleCardClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.action-button')) {
            console.log(target, 'target JobCard')
            if (job) {
                router.push(`/jobs/${job.id}`);
            } else {
                console.error('❌ Job is undefined, cannot navigate');
            }
        }
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('🎯 CLICK: Favorite button clicked for job:', job.id);
        console.log('📊 BEFORE - job.isFavorite:', job.isFavorite);
        console.log('🔄 Dispatching toggleFavorite...');

        dispatch(toggleFavorite(job.id));

        // Проверим обновление через секунду
        setTimeout(() => {
            console.log('⏰ AFTER 1s - job.isFavorite should be:', !job.isFavorite);
        }, 1000);
    };

    const handleApplied = (e: React.MouseEvent) => {
        e.stopPropagation();
        //   dispatch(toggleApplied(job.id));
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(deleteJob(job.id));
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const formatSalary = (min: number, max: number) => {
        return `£${min.toLocaleString()} - £${max.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-200"
            onClick={handleCardClick}
        >
            <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-1 line-clamp-2">{job.title}</h3>
                        <p className="text-lg text-blue-600 font-semibold">{job.company.display_name}</p>
                    </div>
                    <div className="flex space-x-1 ml-2">
                        <button
                            onClick={handleFavorite}
                            className="action-button p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            title={job.isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {
                                job.isFavorite ? (
                                    <BookmarkIcon className="h-5 w-5 text-red-600" />


                                ) : (
                                    <BookmarkIcon className="h-5 w-5 text-gray-600" />
                                )
                            }

                        </button>
                        <button
                            onClick={handleFavorite}
                            className="action-button p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            title={job.isApplied ? "Mark as not applied" : "Mark as applied"}
                        >
                            {
                                job.isFavorite ? (
                                    <HeartIcon className="h-5 w-5 text-red-600" />


                                ) : (
                                    <HeartIcon className="h-5 w-5 text-gray-600" />
                                )
                            }


                        </button>
                        <button
                            onClick={handleDelete}
                            className="action-button p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Delete job"
                        >
                            <TrashIcon className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Salary and Category */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                        {formatSalary(job.salary_min, job.salary_max)}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {job.category.label}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                    {truncateText(job.description, 150)}
                </p>

                {/* Meta Information */}
                <div className="space-y-2 mt-auto">
                    <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{job.location.display_name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                        <span className="capitalize">{job.contract_type}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>Posted {formatDate(job.created)}</span>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex space-x-2 mt-3">
                    {job.isFavorite && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                            Favorite
                        </span>
                    )}
                    {job.isApplied && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                            Applied
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

};

export default JobCard;