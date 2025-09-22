// API service configuration aligned with backend requirements
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Custom fetch wrapper with cookie support (matches backend requirements)
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    credentials: 'include', // Essential for HTTP-only cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // Handle 401 globally
  if (response.status === 401) {
    window.location.href = '/login';
    return;
  }

  return response;
};

// Worker service - matches backend endpoints exactly
export const workerService = {
  getAll: async () => {
    const response = await apiRequest('/workers');
    return response?.json();
  },
  
  getActive: async () => {
    const response = await apiRequest('/workers/active');
    return response?.json();
  },
  
  getInactive: async () => {
    const response = await apiRequest('/workers/inactive');
    return response?.json();
  },
  
  getById: async (id: string) => {
    const response = await apiRequest(`/workers/${id}`);
    return response?.json();
  },
  
  create: async (data: WorkerCreateData) => {
    const response = await apiRequest('/workers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response?.json();
  },
  
  // Get workers leaving on a specific date (YYYY-MM-DD)
  getLeaving: async (date: string) => {
    const response = await apiRequest(`/workers/leaving/${date}`);
    return response?.json();
  },
  
  update: async (id: string, data: WorkerUpdateData) => {
    const response = await apiRequest(`/workers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response?.json();
  },
  
  delete: async (id: string) => {
    const response = await apiRequest(`/workers/${id}`, {
      method: 'DELETE',
    });
    return response?.json();
  }
};

// Type definitions - aligned with backend models
export interface WorkerCreateData {
  name: string;
  phone: string;
  address?: string;
  designation: 'weaver' | 'repairer' | 'other';
  join_date: string; // ISO date string (YYYY-MM-DD)
  leave_date?: string; // ISO date string
  email?: string;
  salary: number; // Required in backend
  notes?: string;
}

export interface WorkerUpdateData {
  name?: string;
  phone?: string;
  address?: string;
  designation?: 'weaver' | 'repairer' | 'other';
  join_date?: string;
  leave_date?: string;
  email?: string;
  salary?: number;
  status?: 'active' | 'inactive';
  notes?: string;
}

// Worker interface - updated to match backend model exactly
export interface Worker {
  _id: string;
  name: string;
  phone: string;
  address?: string;
  designation: 'weaver' | 'repairer' | 'other';
  join_date: string;
  leave_date?: string;
  email?: string;
  salary: number; // Required field
  status: 'active' | 'inactive';
  notes?: string;
  
  // Auto-calculated loan fields
  loans: string[]; // Array of loan IDs
  total_loan_amt: number;
  paid_amt: number;
  remaining_amt: number;
  loan_history: Array<{
    loan_id: string;
    loan_amt: number;
    loan_date: string;
  }>;
  installment_history: Array<{
    installment_id: string;
    installment_amt: number;
    installment_date: string;
  }>;
  
  createdAt: string;
  updatedAt: string;
}

// Authentication service - matches backend requirements
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response?.json();
  },

  logout: async () => {
    const response = await apiRequest('/auth/logout', {
      method: 'POST',
    });
    return response?.json();
  },

  checkAuth: async () => {
    const response = await apiRequest('/auth/me');
    return response?.json();
  },
};
