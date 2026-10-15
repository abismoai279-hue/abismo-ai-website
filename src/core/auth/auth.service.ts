/**
 * Service d'authentification pour les appels API.
 * Implémente les méthodes pour communiquer avec le backend.
 */
import { authState, login, logout, updateTokens, setLoading, setError } from './auth.signals';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4242/api';

/**
 * Interface réponse d'authentification
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
    is_active: boolean;
    created_at: string;
    last_login?: string;
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
  };
}

/**
 * Configuration des headers avec token
 */
const getAuthHeaders = () => {
  const token = authState.value.tokens?.access_token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Gestionnaire d'erreurs API
 */
const handleApiError = (error: any) => {
  const message = error.response?.data?.detail || error.message || 'An error occurred';
  setError(message);
  throw new Error(message);
};

/**
 * Inscription d'un nouvel utilisateur
 */
export const register = async (email: string, password: string, name: string) => {
  try {
    setLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }
    
    const data: AuthResponse = await response.json();
    
    login(data.user, data.tokens);
    
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  } finally {
    setLoading(false);
  }
};

/**
 * Connexion utilisateur
 */
export const loginUser = async (email: string, password: string) => {
  try {
    setLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }
    
    const data: AuthResponse = await response.json();
    
    login(data.user, data.tokens);
    
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  } finally {
    setLoading(false);
  }
};

/**
 * Rafraîchissement des tokens
 */
export const refreshTokens = async () => {
  try {
    const refreshToken = authState.value.tokens?.refresh_token;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    
    updateTokens(data);
    
    return data;
  } catch (error) {
    // Si le refresh échoue, déconnecter l'utilisateur
    logout();
    handleApiError(error);
    throw error;
  }
};

/**
 * Déconnexion
 */
export const logoutUser = async () => {
  try {
    const token = authState.value.tokens?.access_token;
    
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    }
    
    logout();
  } catch (error) {
    // Même si l'appel échoue, déconnecter localement
    logout();
  }
};

/**
 * Déconnexion de tous les appareils
 */
export const logoutAllDevices = async () => {
  try {
    await fetch(`${API_BASE_URL}/auth/logout-all`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    logout();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

/**
 * Changement de mot de passe
 */
export const changePassword = async (oldPassword: string, newPassword: string) => {
  try {
    setLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Password change failed');
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  } finally {
    setLoading(false);
  }
};

/**
 * Demande de réinitialisation de mot de passe
 */
export const forgotPassword = async (email: string) => {
  try {
    setLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Password reset request failed');
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  } finally {
    setLoading(false);
  }
};

/**
 * Confirmation de réinitialisation de mot de passe
 */
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    setLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        new_password: newPassword,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Password reset failed');
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  } finally {
    setLoading(false);
  }
};

/**
 * Récupération des informations utilisateur actuel
 */
export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};