/**
 * React Signals pour la gestion d'état d'authentification.
 * Implémente un système de state management réactif et performant.
 */
import { signal, computed, effect } from '@preact/signals-react';

/**
 * Interface utilisateur
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'manager' | 'senior_admin';
  permissions: string[];
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

/**
 * Interface tokens
 */
export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Interface état d'authentification
 */
export interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Signals pour l'état d'authentification
 */
export const authState = signal<AuthState>({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
});

/**
 * Signal pour l'utilisateur actuel
 */
export const currentUser = computed(() => authState.value.user);

/**
 * Signal pour les tokens
 */
export const currentTokens = computed(() => authState.value.tokens);

/**
 * Signal pour le statut d'authentification
 */
export const isAuthenticated = computed(() => authState.value.isAuthenticated);

/**
 * Signal pour le statut de chargement
 */
export const isLoading = computed(() => authState.value.isLoading);

/**
 * Signal pour les erreurs
 */
export const authError = computed(() => authState.value.error);

/**
 * Signal pour les permissions de l'utilisateur
 */
export const userPermissions = computed(() => authState.value.user?.permissions || []);

/**
 * Signal pour le rôle de l'utilisateur
 */
export const userRole = computed(() => authState.value.user?.role || 'user');

/**
 * Vérifie si l'utilisateur a une permission spécifique
 */
export const hasPermission = (permission: string): boolean => {
  return userPermissions.value.includes(permission);
};

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export const hasRole = (role: string): boolean => {
  return userRole.value === role;
};

/**
 * Vérifie si l'utilisateur a l'un des rôles spécifiés
 */
export const hasAnyRole = (roles: string[]): boolean => {
  return roles.includes(userRole.value);
};

/**
 * Met à jour l'état de chargement
 */
export const setLoading = (loading: boolean): void => {
  authState.value = {
    ...authState.value,
    isLoading: loading,
  };
};

/**
 * Met à jour l'erreur d'authentification
 */
export const setError = (error: string | null): void => {
  authState.value = {
    ...authState.value,
    error,
  };
};

/**
 * Connecte l'utilisateur
 */
export const login = (user: User, tokens: Tokens): void => {
  authState.value = {
    user,
    tokens,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  };
  
  // Stocker dans localStorage
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
  localStorage.setItem('auth_user', JSON.stringify(user));
};

/**
 * Déconnecte l'utilisateur
 */
export const logout = (): void => {
  authState.value = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
  
  // Nettoyer localStorage
  localStorage.removeItem('auth_tokens');
  localStorage.removeItem('auth_user');
};

/**
 * Met à jour les tokens
 */
export const updateTokens = (tokens: Tokens): void => {
  authState.value = {
    ...authState.value,
    tokens,
  };
  
  localStorage.setItem('auth_tokens', JSON.stringify(tokens));
};

/**
 * Met à jour les informations utilisateur
 */
export const updateUser = (user: Partial<User>): void => {
  if (authState.value.user) {
    authState.value = {
      ...authState.value,
      user: {
        ...authState.value.user,
        ...user,
      },
    };
    
    localStorage.setItem('auth_user', JSON.stringify(authState.value.user));
  }
};

/**
 * Restaure la session depuis localStorage
 */
export const restoreSession = (): void => {
  try {
    const tokensStr = localStorage.getItem('auth_tokens');
    const userStr = localStorage.getItem('auth_user');
    
    if (tokensStr && userStr) {
      const tokens = JSON.parse(tokensStr);
      const user = JSON.parse(userStr);
      
      authState.value = {
        user,
        tokens,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Failed to restore session:', error);
    logout();
  }
};

/**
 * Effet pour surveiller les changements d'authentification
 */
effect(() => {
  if (authState.value.isAuthenticated) {
    console.log('User authenticated:', authState.value.user?.email);
  } else {
    console.log('User not authenticated');
  }
});

/**
 * Hook personnalisé pour utiliser l'authentification
 */
export const useAuth = () => {
  return {
    currentUser,
    currentTokens,
    isAuthenticated,
    isLoading,
    authError,
    userPermissions,
    userRole,
    hasPermission,
    hasRole,
    hasAnyRole,
    login,
    logout,
    updateTokens,
    updateUser,
    setLoading,
    setError,
    restoreSession,
  };
};