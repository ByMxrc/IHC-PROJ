// API Service - Maneja todas las peticiones al backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Helper para manejar respuestas
async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }
  
  return data;
}

// Helper para hacer peticiones con autenticación
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });
  
  return handleResponse(response);
}

// ============================================
// AUTENTICACIÓN
// ============================================

export const authAPI = {
  login: async (username: string, password: string, rememberMe: boolean = false) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, rememberMe }),
      credentials: 'include',
    });
    return handleResponse(response);
  },

  logout: async () => {
    return fetchWithAuth('/auth/logout', { method: 'POST' });
  },

  verify: async () => {
    return fetchWithAuth('/auth/verify', { method: 'POST' });
  },
};

// ============================================
// USUARIOS
// ============================================

export const usersAPI = {
  getAll: async () => {
    return fetchWithAuth('/users');
  },

  getById: async (id: number) => {
    return fetchWithAuth(`/users/${id}`);
  },

  create: async (userData: any) => {
    return fetchWithAuth('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  update: async (id: number, userData: any) => {
    return fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  delete: async (id: number) => {
    return fetchWithAuth(`/users/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// PRODUCTORES
// ============================================

export const producersAPI = {
  getAll: async () => {
    return fetchWithAuth('/producers');
  },

  getById: async (id: number) => {
    return fetchWithAuth(`/producers/${id}`);
  },

  create: async (producerData: any) => {
    return fetchWithAuth('/producers', {
      method: 'POST',
      body: JSON.stringify(producerData),
    });
  },
};

// ============================================
// FERIAS
// ============================================

export const fairsAPI = {
  getAll: async () => {
    return fetchWithAuth('/fairs');
  },

  getById: async (id: number) => {
    return fetchWithAuth(`/fairs/${id}`);
  },

  create: async (fairData: any) => {
    return fetchWithAuth('/fairs', {
      method: 'POST',
      body: JSON.stringify(fairData),
    });
  },
};

// ============================================
// INSCRIPCIONES
// ============================================

export const registrationsAPI = {
  getAll: async () => {
    return fetchWithAuth('/registrations');
  },

  create: async (registrationData: any) => {
    return fetchWithAuth('/registrations', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });
  },
};

// ============================================
// NOTIFICACIONES
// ============================================

export const notificationsAPI = {
  getByUser: async (userId: number) => {
    return fetchWithAuth(`/notifications/user/${userId}`);
  },

  create: async (notificationData: any) => {
    return fetchWithAuth('/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },

  markAsRead: async (id: number) => {
    return fetchWithAuth(`/notifications/${id}/read`, { method: 'PUT' });
  },

  delete: async (id: number) => {
    return fetchWithAuth(`/notifications/${id}`, { method: 'DELETE' });
  },
};

// ============================================
// VENTAS
// ============================================

export const salesAPI = {
  getAll: async () => {
    return fetchWithAuth('/sales');
  },

  create: async (saleData: any) => {
    return fetchWithAuth('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  },
};

// ============================================
// TRANSPORTE
// ============================================

export const transportAPI = {
  getRoutes: async () => {
    return fetchWithAuth('/transport/routes');
  },

  createRoute: async (routeData: any) => {
    return fetchWithAuth('/transport/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  },
};

// ============================================
// TRADUCCIONES
// ============================================

export const translationsAPI = {
  getLanguages: async () => {
    return fetchWithAuth('/translations/languages');
  },

  getHomeContent: async (language?: string) => {
    const lang = language || localStorage.getItem('language') || 'es';
    return fetchWithAuth(`/translations/home-content?lang=${lang}`);
  },

  updateHomeContent: async (contentKey: string, languageCode: string, content: string) => {
    return fetchWithAuth('/translations/home-content', {
      method: 'POST',
      body: JSON.stringify({ contentKey, languageCode, content }),
    });
  },

  updateUserLanguage: async (userId: number, languageCode: string) => {
    return fetchWithAuth(`/translations/users/${userId}/language`, {
      method: 'PUT',
      body: JSON.stringify({ languageCode }),
    });
  },
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthAPI = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },
};
