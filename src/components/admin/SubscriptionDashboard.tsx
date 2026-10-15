/**
 * Dashboard Admin pour la gestion des abonnements scm-method.
 * Interface pour créer, gérer et surveiller les abonnements.
 */
import React, { useState, useEffect } from 'react';

interface Subscription {
  id: string;
  license_id: string;
  company_name: string;
  contact_email: string;
  subscription_type: '6_months' | '1_year';
  start_date: string;
  end_date: string;
  max_users: number;
  current_users: number;
  status: 'active' | 'expired' | 'revoked';
  hwid_hash?: string;
}

export const SubscriptionDashboard: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    company_name: '',
    contact_email: '',
    subscription_type: '6_months' as '6_months' | '1_year',
    max_users: 10
  });

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscriptions');
      if (!response.ok) throw new Error('Failed to load subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create subscription');

      await loadSubscriptions();
      setShowCreateModal(false);
      setFormData({
        company_name: '',
        contact_email: '',
        subscription_type: '6_months',
        max_users: 10
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subscription');
    }
  };

  const handleRevokeSubscription = async (licenseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir révoquer cet abonnement ?')) return;

    try {
      const response = await fetch(`/api/subscriptions/revoke/${licenseId}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to revoke subscription');

      await loadSubscriptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke subscription');
    }
  };

  const handleRenewSubscription = async (licenseId: string, subscriptionType: '6_months' | '1_year') => {
    try {
      const response = await fetch(`/api/subscriptions/renew/${licenseId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_type })
      });

      if (!response.ok) throw new Error('Failed to renew subscription');

      await loadSubscriptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to renew subscription');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#28a745';
      case 'expired': return '#dc3545';
      case 'revoked': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Chargement des abonnements...</p>
        <style jsx>{`
          .dashboard-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            color: #666;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="subscription-dashboard">
      <div className="dashboard-header">
        <h1>Gestion des Abonnements</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          + Nouvel Abonnement
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{subscriptions.length}</div>
          <div className="stat-label">Total Abonnements</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {subscriptions.filter(s => s.status === 'active').length}
          </div>
          <div className="stat-label">Actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {subscriptions.filter(s => s.status === 'expired').length}
          </div>
          <div className="stat-label">Expirés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {subscriptions.filter(s => getDaysRemaining(s.end_date) <= 30).length}
          </div>
          <div className="stat-label">Expirant bientôt</div>
        </div>
      </div>

      <div className="subscriptions-table">
        <table>
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Email</th>
              <th>Type</th>
              <th>Date de fin</th>
              <th>Jours restants</th>
              <th>Utilisateurs</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.company_name}</td>
                <td>{sub.contact_email}</td>
                <td>{sub.subscription_type === '6_months' ? '6 mois' : '1 an'}</td>
                <td>{new Date(sub.end_date).toLocaleDateString('fr-FR')}</td>
                <td>
                  <span className={getDaysRemaining(sub.end_date) <= 30 ? 'warning' : ''}>
                    {getDaysRemaining(sub.end_date)} jours
                  </span>
                </td>
                <td>{sub.current_users}/{sub.max_users}</td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(sub.status) }}
                  >
                    {sub.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {sub.status === 'active' && (
                      <>
                        <button 
                          className="btn-renew"
                          onClick={() => handleRenewSubscription(sub.license_id, sub.subscription_type)}
                        >
                          Renouveler
                        </button>
                        <button 
                          className="btn-revoke"
                          onClick={() => handleRevokeSubscription(sub.license_id)}
                        >
                          Révoquer
                        </button>
                      </>
                    )}
                    {sub.status === 'expired' && (
                      <button 
                        className="btn-renew"
                        onClick={() => handleRenewSubscription(sub.license_id, sub.subscription_type)}
                      >
                        Réactiver
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Nouvel Abonnement</h2>
              <button onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateSubscription}>
              <div className="form-group">
                <label>Nom de l'entreprise</label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email de contact</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type d'abonnement</label>
                <select
                  value={formData.subscription_type}
                  onChange={(e) => setFormData({...formData, subscription_type: e.target.value as '6_months' | '1_year'})}
                >
                  <option value="6_months">6 mois</option>
                  <option value="1_year">1 an</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nombre maximum d'utilisateurs</label>
                <input
                  type="number"
                  value={formData.max_users}
                  onChange={(e) => setFormData({...formData, max_users: parseInt(e.target.value)})}
                  min="1"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .subscription-dashboard {
          padding: 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .dashboard-header h1 {
          font-size: 28px;
          color: #333;
          margin: 0;
        }

        .btn-primary {
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        .error-message {
          background-color: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #fcc;
          margin-bottom: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .error-message button {
          background: none;
          border: none;
          color: #c33;
          font-size: 18px;
          cursor: pointer;
        }

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-value {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: #666;
        }

        .subscriptions-table {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f8f9fa;
        }

        th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        td {
          padding: 12px 16px;
          border-bottom: 1px solid #eee;
          font-size: 14px;
        }

        tr:last-child td {
          border-bottom: none;
        }

        .warning {
          color: #ffc107;
          font-weight: 500;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-renew {
          padding: 6px 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .btn-revoke {
          padding: 6px 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: white;
          border-radius: 8px;
          padding: 30px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }

        .modal-header button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 30px;
        }

        .modal-actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
        }

        .modal-actions button[type="button"] {
          background: #f8f9fa;
          color: #333;
        }

        .modal-actions button[type="submit"] {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default SubscriptionDashboard;