import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Login successful:', user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 selection:bg-primary/20">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-12 border border-slate-100 flex flex-col gap-8 text-slate-800">
        <div className="text-center">
          <h1 className="font-headline text-5xl font-black text-primary tracking-tighter mb-4">Welcome Back</h1>
          <p className="font-body text-slate-500 text-lg">Log in to access your academic curator</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Email Address</label>
            <input
              type="email"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all outline-none font-body text-slate-800"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Password</label>
            <input
              type="password"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all outline-none font-body text-slate-800"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm font-medium">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
              <span className="text-slate-500 group-hover:text-slate-900">Remember me</span>
            </label>
            <a href="#" className="text-primary font-bold hover:text-indigo-700 transition-colors">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[10px] uppercase font-label font-bold tracking-[0.3em] text-slate-300 bg-white px-6">Or continue with</div>
        </div>

        <button className="w-full flex items-center justify-center gap-4 bg-white py-4 rounded-2xl border-2 border-slate-100 hover:border-primary/20 hover:bg-slate-50 transition-all duration-300 group">
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
          <span className="font-headline font-bold text-slate-700">Google Account</span>
        </button>

        <p className="text-center text-sm text-slate-500 font-body">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:text-indigo-700 transition-colors ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
