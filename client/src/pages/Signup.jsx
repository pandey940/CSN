import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    semester: '1'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('/api/auth/signup', formData);
      console.log('Signup successful:', response.data);
      // Redirect to OTP verification with email in state
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-primary/20">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-12 border border-slate-100">
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl font-black text-primary tracking-tighter mb-4">Join the Curator</h1>
          <p className="font-body text-slate-500 text-lg">Create your account to start sharing and learning</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="md:col-span-2 space-y-2">
            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Full Name</label>
            <input
              type="text"
              name="name"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none"
              placeholder="John Doe"
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">University Email</label>
            <input
              type="email"
              name="email"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none"
              placeholder="john@university.edu"
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">College</label>
            <select
              name="college"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
              onChange={handleChange}
              required
            >
              <option value="">Select College</option>
              <option value="IIT Bombay">IIT Bombay</option>
              <option value="MIT Manipal">MIT Manipal</option>
              <option value="DTU Delhi">DTU Delhi</option>
              <option value="Stanford University">Stanford University</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Branch</label>
            <input
              type="text"
              name="branch"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none"
              placeholder="Computer Science"
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-1 space-y-2">
            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Semester</label>
            <select
              name="semester"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none appearance-none cursor-pointer"
              onChange={handleChange}
              required
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 space-y-2">
            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Password</label>
            <input
              type="password"
              name="password"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-primary text-white py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-12 text-sm text-slate-500 font-body">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:text-indigo-700 transition-colors ml-1">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
