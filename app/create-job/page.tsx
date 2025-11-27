'use client'
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../hooks/hooks';
import { createJob } from '../../features/jobSlice';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FormData, FormErrors } from '@/data/types/form'

const CreateJobPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        salary_min: 0,
        salary_max: 0,
        company: '',
        category: '',
        contract_type: 'permanent',
        location: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: name.includes('salary') ? Number(value) : value
        }));

        // Очищаем ошибку при вводе
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Required fields validation
        if (!formData.title.trim()) newErrors.title = 'Job title is required';
        if (!formData.description.trim()) newErrors.description = 'Job description is required';
        if (!formData.company.trim()) newErrors.company = 'Company name is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';

        // Salary validation
        if (formData.salary_min <= 0) newErrors.salary_min = 'Minimum salary must be greater than 0';
        if (formData.salary_max <= 0) newErrors.salary_max = 'Maximum salary must be greater than 0';
        if (formData.salary_max < formData.salary_min) {
            newErrors.salary_max = 'Maximum salary must be greater than minimum salary';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Диспатчим создание вакансии
            dispatch(createJob(formData));

            // Редирект на главную страницу
            router.push('/');
        } catch (error) {
            console.error('Error creating job:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleCancel}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back to Jobs</span>
                    </button>

                    <h1 className="text-3xl font-bold text-gray-800">Create New Job</h1>
                    <p className="text-gray-600 mt-2">Fill in the details to create a new job posting</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Job Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="e.g. Senior Frontend Developer"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Company */}
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.company ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="e.g. TechCorp Ltd"
                            />
                            {errors.company && <p className="mt-1 text-sm text-red-600">{errors.company}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Job Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Describe the job responsibilities, requirements, and benefits..."
                            />
                            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                        </div>

                        {/* Salary Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Salary (£) *
                                </label>
                                <input
                                    type="number"
                                    id="salary_min"
                                    name="salary_min"
                                    value={formData.salary_min}
                                    onChange={handleChange}
                                    min="0"
                                    step="1000"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.salary_min ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="40000"
                                />
                                {errors.salary_min && <p className="mt-1 text-sm text-red-600">{errors.salary_min}</p>}
                            </div>

                            <div>
                                <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Salary (£) *
                                </label>
                                <input
                                    type="number"
                                    id="salary_max"
                                    name="salary_max"
                                    value={formData.salary_max}
                                    onChange={handleChange}
                                    min="0"
                                    step="1000"
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.salary_max ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="60000"
                                />
                                {errors.salary_max && <p className="mt-1 text-sm text-red-600">{errors.salary_max}</p>}
                            </div>
                        </div>

                        {/* Category and Contract Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.category ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="">Select a category</option>
                                    <option value="IT Jobs">IT Jobs</option>
                                    <option value="Design Jobs">Design Jobs</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Product Management">Product Management</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                </select>
                                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                            </div>

                            <div>
                                <label htmlFor="contract_type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contract Type *
                                </label>
                                <select
                                    id="contract_type"
                                    name="contract_type"
                                    value={formData.contract_type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="permanent">Permanent</option>
                                    <option value="contract">Contract</option>
                                    <option value="temporary">Temporary</option>
                                    <option value="freelance">Freelance</option>
                                    <option value="internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location *
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.location ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="e.g. London, UK"
                            />
                            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                            >
                                {isSubmitting ? 'Creating...' : 'Create Job'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>All fields marked with * are required</p>
                </div>
            </div>
        </div>
    );
};

export default CreateJobPage;