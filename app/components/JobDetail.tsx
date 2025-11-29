// app/components/JobDetail.tsx
'use client'
import { useRouter } from 'next/navigation';
import { 
  HeartIcon, 
  BookmarkIcon, 
  MapPinIcon, 
  BuildingOfficeIcon, 
  ClockIcon, 
  CurrencyPoundIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useAppDispatch } from '../hooks/hooks';
import { toggleFavorite, toggleApplied } from '@/features/jobSlice';
import { Job } from '@/data/types/job';

interface JobDetailProps {
  job: Job;
}

export default function JobDetail({ job }: JobDetailProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleBack = () => {
    router.back();
  };

  const handleFavorite = () => {
    dispatch(toggleFavorite(job.id));
  };

  const handleApplied = () => {
    dispatch(toggleApplied(job.id));
  };

  const handleApply = () => {
    if (job.redirect_url && job.redirect_url !== '#') {
      window.open(job.redirect_url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Apply link not available for this job');
    }
  };

  const formatSalary = (min: number, max: number) => {
    if (!min || !max) return 'Salary not specified';
    return `£${min.toLocaleString()} - £${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Jobs
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Job Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
              <p className="text-xl mb-2">{job.company.display_name}</p>
              <div className="flex flex-wrap items-center gap-4 text-blue-100">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{job.location.display_name}</span>
                </div>
                <div className="flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                  <span className="capitalize">{job.contract_type}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  <span>Posted {formatDate(job.created)}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleFavorite}
                className="p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                title={job.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {job.isFavorite ? (
                  <BookmarkIcon className="h-6 w-6 text-red-300 fill-red-300" />
                ) : (
                  <BookmarkIcon className="h-6 w-6 text-white" />
                )}
              </button>
              <button
                onClick={handleApplied}
                className="p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                title={job.isApplied ? "Mark as not applied" : "Mark as applied"}
              >
                {job.isApplied ? (
                  <HeartIcon className="h-6 w-6 text-green-300 fill-green-300" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2">
              {/* Salary */}
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <CurrencyPoundIcon className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-2xl font-bold text-green-600">
                    {formatSalary(job.salary_min, job.salary_max)}
                  </h2>
                </div>
                {job.salary_is_predicted === '1' && (
                  <p className="text-sm text-gray-500">* Predicted salary range</p>
                )}
              </div>

              {/* Category and Department */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-100 text-blue-800 text-lg font-medium px-4 py-2 rounded-full">
                  {job.category.label}
                </span>
                {job.department && (
                  <span className="bg-green-100 text-green-800 text-lg font-medium px-4 py-2 rounded-full">
                    {job.department}
                  </span>
                )}
                {job.seniority && (
                  <span className="bg-purple-100 text-purple-800 text-lg font-medium px-4 py-2 rounded-full">
                    {job.seniority}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                {/* Apply Button */}
                <button
                  onClick={handleApply}
                  className="w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold mb-6"
                >
                  Apply Now
                </button>

                {/* Job Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg mb-4">Job Details</h4>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Company</h5>
                    <p className="text-gray-900">{job.company.display_name}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Location</h5>
                    <p className="text-gray-900">{job.location.display_name}</p>
                    {job.location.area && job.location.area.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {job.location.area.join(', ')}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Contract Type</h5>
                    <p className="text-gray-900 capitalize">{job.contract_type}</p>
                  </div>
                  
                  {job.department && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Department</h5>
                      <p className="text-gray-900">{job.department}</p>
                    </div>
                  )}
                  
                  {job.seniority && (
                    <div>
                      <h5 className="font-medium text-gray-700 mb-1">Seniority</h5>
                      <p className="text-gray-900">{job.seniority}</p>
                    </div>
                  )}
                  
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Posted</h5>
                    <p className="text-gray-900">{formatDate(job.created)}</p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex space-x-2 pt-4">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}