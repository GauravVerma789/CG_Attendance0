import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StaffLogin = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ identifier, password, role: 'staff' });
      navigate('/staff');
    } catch (err) {
      setError('Invalid staff credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-background flex items-center justify-center">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="login-card-loading mb-4"></div>
          <p className="text-white text-lg font-medium">Loading CollegeGate ERP...</p>
        </div>
      )}
      <div className="edusync-glass-card p-8 w-96 transform transition-all hover:scale-105">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Staff Login</h2>
          <p className="text-text-secondary">Welcome back! Please login to your account.</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="identifier">
              Username or Email
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setError('');
              }}
              className="input"
              required
              placeholder="Enter your username or email"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="input"
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-full"
            disabled={isLoading}
          >
            Login as Staff
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/admin-login" className="text-success hover:text-green-800">
            Login as Admin instead
          </a>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin; 