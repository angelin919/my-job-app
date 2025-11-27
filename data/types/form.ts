export interface FormData {
    title: string;
    description: string;
    salary_min: number;
    salary_max: number;
    company: string;
    category: string;
    contract_type: string;
    location: string;
  }
  
  export interface FormErrors {
    title?: string;
    description?: string;
    salary_min?: string;
    salary_max?: string;
    company?: string;
    category?: string;
    contract_type?: string;
    location?: string;
  }