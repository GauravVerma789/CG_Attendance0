import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, UserRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Fullscreen loading overlay component
function LoginLoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-40">
      <span className="login-card-loading mb-6"></span>
      <span className="text-white text-lg font-semibold tracking-wide drop-shadow-lg">Loading AttendEase...</span>
    </div>
  );
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      
      if (success) {
        // Redirect based on user role
        if (username === 'admin') {
          navigate('/admin');
        } else {
          navigate('/staff');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      {isLoading && <LoginLoadingOverlay />}
      <div className="max-w-md w-full px-6 py-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AttendEase</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <UserRound size={20} />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input pl-10"
              required
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock size={20} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn btn-primary w-full flex justify-center items-center gap-2 transition-all duration-300 ${
              isLoading ? 'opacity-90 cursor-not-allowed' : ''
            }`}
          >
            <span>Sign In</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Demo Credentials:</p>
          <p className="mt-1">Admin: admin | Password: admin2580</p>
          <p>Staff: dhananjay | Password: dhananjay2580</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
