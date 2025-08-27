const API_BASE_URL = 'http://localhost:3001/api';

// Generic API function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Divisions API
export const divisionsApi = {
  getAll: () => apiRequest('/divisions'),
  create: (data: any) => apiRequest('/divisions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/divisions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/divisions/${id}`, {
    method: 'DELETE',
  }),
};

// School Rooms API
export const schoolRoomsApi = {
  getAll: () => apiRequest('/school-rooms'),
  create: (data: any) => apiRequest('/school-rooms', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/school-rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/school-rooms/${id}`, {
    method: 'DELETE',
  }),
};

// Students API
export const studentsApi = {
  getAll: () => apiRequest('/students'),
  create: (data: any) => apiRequest('/students', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/students/${id}`, {
    method: 'DELETE',
  }),
};

// Sessions API
export const sessionsApi = {
  getAll: () => apiRequest('/sessions'),
  create: (data: any) => apiRequest('/sessions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest(`/sessions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest(`/sessions/${id}`, {
    method: 'DELETE',
  }),
};