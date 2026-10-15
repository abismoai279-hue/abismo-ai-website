/**
 * Provider React pour l'authentification avec React Signals.
 * Fournit le contexte d'authentification à toute l'application.
 */
import React, { useEffect } from 'react';
import { useAuth, restoreSession } from './auth.signals';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider d'authentification
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Restaurer la session au chargement
    restoreSession();
  }, []);

  return (
    <div className="auth-provider">
      {children}
    </div>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 */
export const useAuthContext = () => {
  const auth = useAuth();
  
  return {
    ...auth,
  };
};