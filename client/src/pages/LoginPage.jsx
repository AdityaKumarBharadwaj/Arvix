import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoRepresentative = () => {
    setEmail('representative@arvix.gov.in');
    setPassword('WardRep@2024');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">
            Ward Representative Login
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to access grievance review desk, hall approvals & public bulletin broadcasting.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Quick-Fill Pill */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-slate-900">Ward Representative Demo</div>
            <div className="text-[10px] text-slate-500 font-mono">representative@arvix.gov.in</div>
          </div>
          <button
            type="button"
            onClick={fillDemoRepresentative}
            className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-bold hover:bg-slate-800"
          >
            Fill Demo
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="representative@arvix.gov.in"
                className="civic-input pl-9 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Secret Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="civic-input pl-9 text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full civic-btn-primary text-xs py-2.5 font-bold"
          >
            {submitting ? 'Verifying Credentials...' : 'Sign In to Ward Portal'}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Authorized municipal officers & councilor desk only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
