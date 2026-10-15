/**
 * Composant de formulaire de connexion.
 * Utilise React Signals pour la gestion d'état.
 */
import React, { useState } from 'react';
import { useAuth, loginUser } from '../../core/auth/auth.signals';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onRegisterClick 
}) => {
  const { isLoading, authError, setError } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    try {
      await loginUser(email, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Échec de la connexion');
    }
  };

  return (
    <div className="login-form">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Connexion</h1>
          <p>Bienvenue sur Abismo.ai</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {localError && (
            <div className="error-message">
              {localError}
            </div>
          )}

          {authError && (
            <div className="error-message">
              {authError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <div className="form-footer">
            <a href="/forgot-password" className="link">
              Mot de passe oublié ?
            </a>
          </div>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="auth-switch">
          <p>
            Pas encore de compte ? 
            <button 
              type="button" 
              className="link-button"
              onClick={onRegisterClick}
              disabled={isLoading}
            >
              S'inscrire
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-form {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .auth-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 400px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-header h1 {
          font-size: 28px;
          color: #333;
          margin: 0 0 8px 0;
        }

        .auth-header p {
          color: #666;
          margin: 0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .error-message {
          background-color: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #fcc;
          font-size: 14px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .form-group input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-group input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .form-actions {
          margin-top: 10px;
        }

        .btn-primary {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          opacity: 0.9;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-footer {
          text-align: center;
          margin-top: 10px;
        }

        .link {
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
        }

        .link:hover {
          text-decoration: underline;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          margin: 30px 0;
          color: #999;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #ddd;
        }

        .auth-divider span {
          padding: 0 15px;
          font-size: 14px;
        }

        .auth-switch {
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        .link-button {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          font-size: 14px;
        }

        .link-button:hover:not(:disabled) {
          text-decoration: underline;
        }

        .link-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;