'use client';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { ArrowLeftIcon, MapPinIcon, BuildingOfficeIcon, ClockIcon, CurrencyPoundIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { fetchJobs } from '@/features/jobSlice';
import { mockJobsList } from '@/data/data';

export default function JobDetailPage() {
    const params = useParams();
    const router = useRouter();

    const dispatch = useAppDispatch();
    const jobId = params.id as string;
    console.log(params, 'params JobDetailPage')
    console.log(jobId, 'jobId JobDetailPage')
    console.log(router, 'router JobDetailPage')


    // Находим вакансию по ID
    const job = mockJobsList.find(j => j.id == jobId);
    console.log(job, 'job JobDetailPage')


    if (!job) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h1>
                    <p className="text-gray-600 mb-6">The job you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    const formatSalary = (min: number, max: number) => {
        return `£${min.toLocaleString()} - £${max.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Кнопка назад */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    <span>Back to Jobs</span>
                </button>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                                <p className="text-xl opacity-90">{job.company.display_name}</p>
                            </div>
                            <div className="mt-4 lg:mt-0 lg:ml-6">
                                <span className="text-3xl font-bold">{formatSalary(job.salary_min, job.salary_max)}</span>
                                <p className="text-sm opacity-80">per year</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Details */}
                            <div className="lg:col-span-2">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
                                    <div className="prose max-w-none text-gray-700">
                                        <p className="whitespace-pre-line">{job.description}</p>
                                    </div>
                                </div>

                                {/* Responsibilities & Requirements */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Responsibilities</h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                                            <li>Develop and maintain web applications</li>
                                            <li>Collaborate with cross-functional teams</li>
                                            <li>Write clean, maintainable code</li>
                                            <li>Participate in code reviews</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                                            <li>3+ years of experience in relevant field</li>
                                            <li>Strong problem-solving skills</li>
                                            <li>Excellent communication skills</li>
                                            <li>Bachelor's degree in Computer Science or related</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Contract Type</p>
                                                <p className="font-medium text-gray-800 capitalize">{job.contract_type}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <MapPinIcon className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Location</p>
                                                <p className="font-medium text-gray-800">{job.location.display_name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <ClockIcon className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Posted</p>
                                                <p className="font-medium text-gray-800">{formatDate(job.created)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <CurrencyPoundIcon className="h-5 w-5 text-gray-500" />
                                            <div>
                                                <p className="text-sm text-gray-600">Salary</p>
                                                <p className="font-medium text-gray-800">{formatSalary(job.salary_min, job.salary_max)}</p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-200">
                                            <p className="text-sm text-gray-600 mb-2">Category</p>
                                            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                                {job.category.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 space-y-3">
                                        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                                            Apply Now
                                        </button>
                                        <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                                            Save for Later
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}

