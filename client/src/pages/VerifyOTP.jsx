import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            navigate('/signup');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post('/api/auth/verify-otp', { email, otp });
            setMessage(response.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError('');
        setMessage('');
        try {
            const response = await axios.post('/api/auth/resend-otp', { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resend OTP.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 selection:bg-primary/20">
            <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-12 border border-slate-100 flex flex-col gap-8">
                <div className="text-center">
                    <h1 className="font-headline text-5xl font-black text-primary tracking-tighter mb-4">Verify Email</h1>
                    <p className="font-body text-slate-500 text-lg">Enter the 6-digit code sent to <span className="font-bold text-slate-900">{email}</span></p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium text-center">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-medium text-center">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">OTP Code</label>
                        <input
                            type="text"
                            maxLength="6"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary/20 transition-all outline-none font-body text-on-surface text-center text-3xl tracking-[0.5em] font-black"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.length !== 6}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 font-body">
                    Didn't receive code? <button onClick={handleResend} className="text-primary font-bold hover:text-indigo-700 transition-colors ml-1">Resend Code</button>
                </p>
            </div>
        </div>
    );
};

export default VerifyOTP;
