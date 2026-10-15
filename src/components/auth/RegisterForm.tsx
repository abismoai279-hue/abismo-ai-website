/**
 * Composant de formulaire d'inscription.
 * Utilise React Signals pour la gestion d'état.
 */
import React, { useState } from 'react';
import { useAuth } from '../../core/auth/auth.signals';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSuccess, 
  onLoginClick 
}) => {
  const { isLoading, authError, setError } = useAuth();
  const loadingValue = isLoading.value;
  const errorValue = authError.value;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const validatePassword = (pwd: string): boolean => {
    // Au moins 12 caractères
    if (pwd.length < 12) return false;
    // Au moins une majuscule
    if (!/[A-Z]/.test(pwd)) return false;
    // Au moins une minuscule
    if (!/[a-z]/.test(pwd)) return false;
    // Au moins un chiffre
    if (!/[0-9]/.test(pwd)) return false;
    // Au moins un caractère spécial
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setError(null);

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!validatePassword(password)) {
      setLocalError(
        'Le mot de passe doit contenir au moins 12 caractères, ' +
        'une majuscule, une minuscule, un chiffre et un caractère spécial'
      );
      return;
    }

    try {
      // TODO: Implement register API call
      // await register(email, password, name);
      console.log('Register attempt:', email, name);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Échec de l\'inscription');
    }
  };

  return (
    <div className="register-form">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Créer un compte</h1>
          <p>Rejoignez Abismo.ai</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {localError && (
            <div className="error-message">
              {localError}
            </div>
          )}

          {errorValue && (
            <div className="error-message">
              {errorValue}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Nom complet</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jean Dupont"
              required
              disabled={loadingValue}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              required
              disabled={loadingValue}
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
              disabled={loadingValue}
            />
            <div className="password-hint">
              Minimum 12 caractères, majuscule, minuscule, chiffre, spécial
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loadingValue}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loadingValue}
            >
              {loadingValue ? 'Création...' : 'Créer mon compte'}
            </button>
          </div>

          <div className="terms-agreement">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>
                J'accepte les{' '}
                <a href="/terms" className="link">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="/privacy" className="link">
                  politique de confidentialité
                </a>
              </span>
            </label>
          </div>
        </form>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        <div className="auth-switch">
          <p>
            Déjà inscrit ? 
            <button 
              type="button" 
              className="link-button"
              onClick={onLoginClick}
              disabled={loadingValue}
            >
              Se connecter
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        .register-form {
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

        .password-hint {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
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

        .terms-agreement {
          margin-top: 10px;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          color: #666;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin-top: 2px;
        }

        .link {
          color: #667eea;
          text-decoration: none;
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

export default RegisterForm;