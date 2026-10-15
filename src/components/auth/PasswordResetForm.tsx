/**
 * Composant de formulaire de réinitialisation de mot de passe.
 * Utilise React Signals pour la gestion d'état.
 */
import React, { useState } from 'react';
import { useAuth, resetPassword } from '../../core/auth/auth.signals';

interface PasswordResetFormProps {
  token: string;
  onSuccess?: () => void;
}

export const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ 
  token,
  onSuccess 
}) => {
  const { isLoading, authError, setError } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState(false);

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
      await resetPassword(token, password);
      setSuccess(true);
      if (onSuccess) {
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Échec de la réinitialisation');
    }
  };

  if (success) {
    return (
      <div className="password-reset-form">
        <div className="auth-card">
          <div className="auth-header">
            <div className="success-icon">✓</div>
            <h1>Mot de passe réinitialisé</h1>
            <p>Votre mot de passe a été modifié avec succès</p>
          </div>

          <div className="success-actions">
            <button 
              className="btn-primary"
              onClick={() => window.location.href = '/login'}
            >
              Se connecter
            </button>
          </div>

          <style jsx>{`
            .password-reset-form {
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
              text-align: center;
            }

            .auth-header {
              margin-bottom: 30px;
            }

            .success-icon {
              width: 60px;
              height: 60px;
              background: #28a745;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 32px;
              margin: 0 auto 20px;
            }

            .auth-header h1 {
              font-size: 24px;
              color: #333;
              margin: 0 0 8px 0;
            }

            .auth-header p {
              color: #666;
              margin: 0;
            }

            .success-actions {
              margin-top: 30px;
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

            .btn-primary:hover {
              opacity: 0.9;
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="password-reset-form">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Nouveau mot de passe</h1>
          <p>Entrez votre nouveau mot de passe</p>
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
            <label htmlFor="password">Nouveau mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </button>
          </div>

          <div className="form-footer">
            <a href="/login" className="link">
              ← Retour à la connexion
            </a>
          </div>
        </form>

        <style jsx>{`
          .password-reset-form {
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
            font-size: 24px;
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
        `}</style>
      </div>
    </div>
  );
};

export default PasswordResetForm;