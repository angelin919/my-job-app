// app/data/fallbackJobs.ts
import { Job } from '@/data/types/job';

export const FALLBACK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    description: 'We are looking for an experienced React Developer to join our team. You will work with modern technologies like React, TypeScript, and Next.js.',
    salary_min: 70000,
    salary_max: 95000,
    salary_is_predicted: '0',
    created: '2024-01-15T10:00:00Z',
    redirect_url: '#',
    contract_type: 'Remote',
    location: {
      area: ['Remote'],
      display_name: 'Remote'
    },
    category: {
      label: 'Engineering',
      tag: 'engineering'
    },
    company: {
      display_name: 'Tech Innovations'
    },
    isFavorite: false,
    isApplied: false,
    source: 'manual',
    department: 'Engineering',
    seniority: 'Senior Level',
    type: 'Remote'
  },
  {
    id: '2',
    title: 'Product Manager',
    description: 'Join our product team to help define and execute the product roadmap. Work closely with engineering and design teams.',
    salary_min: 80000,
    salary_max: 110000,
    salary_is_predicted: '0',
    created: '2024-01-14T09:00:00Z',
    redirect_url: '#',
    contract_type: 'Hybrid',
    location: {
      area: ['New York', 'NY'],
      display_name: 'New York, NY'
    },
    category: {
      label: 'Product',
      tag: 'product'
    },
    company: {
      display_name: 'Product Labs'
    },
    isFavorite: false,
    isApplied: false,
    source: 'manual',
    department: 'Product',
    seniority: 'Mid Level',
    type: 'Hybrid'
  },
  {
    id: '3',
    title: 'UX Designer',
    description: 'Create amazing user experiences for our products. Work with user research and design systems.',
    salary_min: 60000,
    salary_max: 85000,
    salary_is_predicted: '0',
    created: '2024-01-13T14:00:00Z',
    redirect_url: '#',
    contract_type: 'Remote',
    location: {
      area: ['Remote'],
      display_name: 'Remote'
    },
    category: {
      label: 'Design',
      tag: 'design'
    },
    company: {
      display_name: 'Design Studio'
    },
    isFavorite: false,
    isApplied: false,
    source: 'manual',
    department: 'Design',
    seniority: 'Mid Level',
    type: 'Remote'
  },
  {
    id: '4',
    title: 'Backend Engineer (Node.js)',
    description: 'Build scalable backend services and APIs using Node.js and modern cloud technologies.',
    salary_min: 75000,
    salary_max: 100000,
    salary_is_predicted: '0',
    created: '2024-01-12T11:00:00Z',
    redirect_url: '#',
    contract_type: 'Remote',
    location: {
      area: ['Remote'],
      display_name: 'Remote'
    },
    category: {
      label: 'Engineering',
      tag: 'engineering'
    },
    company: {
      display_name: 'Cloud Systems'
    },
    isFavorite: false,
    isApplied: false,
    source: 'manual',
    department: 'Engineering',
    seniority: 'Senior Level',
    type: 'Remote'
  },
  {
    id: '5',
    title: 'Data Scientist',
    description: 'Work with large datasets to extract insights and build machine learning models.',
    salary_min: 85000,
    salary_max: 120000,
    salary_is_predicted: '0',
    created: '2024-01-11T16:00:00Z',
    redirect_url: '#',
    contract_type: 'On-site',
    location: {
      area: ['San Francisco', 'CA'],
      display_name: 'San Francisco, CA'
    },
    category: {
      label: 'Data Science',
      tag: 'data-science'
    },
    company: {
      display_name: 'Data Analytics Inc'
    },
    isFavorite: false,
    isApplied: false,
    source: 'manual',
    department: 'Data Science',
    seniority: 'Senior Level',
    type: 'On-site'
  }
];