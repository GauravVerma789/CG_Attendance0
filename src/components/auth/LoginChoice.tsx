import { Link } from 'react-router-dom';

const LoginChoice = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#585394]">
      <div className="bg-white p-8 w-96 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4">
            CG
          </div>
          <h2 className="text-4xl font-bold text-text-primary mb-2">CollegeGate ERP</h2>
          <p className="text-text-secondary">Sign in to access your account</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/admin-login"
            className="btn btn-primary w-full"
          >
            Login as Admin
          </Link>

          <Link
            to="/staff-login"
            className="btn btn-success w-full"
          >
            Login as Staff
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginChoice; 