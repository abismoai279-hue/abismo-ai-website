/**
 * Page d'authentification principale.
 * Gère l'affichage des formulaires de connexion et d'inscription.
 */
import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth, isAuthenticated } from '../core/auth/auth.signals';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const router = useRouter();
  const authStatus = isAuthenticated.value;

  // Rediriger si déjà authentifié
  React.useEffect(() => {
    if (authStatus) {
      router.push('/dashboard');
    }
  }, [authStatus, router]);

  const handleSuccess = () => {
    router.push('/dashboard');
  };

  return (
    <div className="auth-page">
      {mode === 'login' ? (
        <LoginForm 
          onSuccess={handleSuccess}
          onRegisterClick={() => setMode('register')}
        />
      ) : (
        <RegisterForm 
          onSuccess={handleSuccess}
          onLoginClick={() => setMode('login')}
        />
      )}

      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}