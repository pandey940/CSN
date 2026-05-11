import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleAuthAction = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            navigate('/');
        } else {
            navigate('/login');
        }
    };
    return (
        <nav className="glass-nav fixed top-0 w-full z-50 border-b border-indigo-500/10 h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <span className="text-xl font-black text-indigo-700 tracking-tighter font-headline">The Academic Curator</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
                <Link to="/" className="font-headline font-bold text-sm text-primary">Home</Link>
                <Link to="/search" className="font-headline font-bold text-sm text-slate-600 hover:text-primary transition-colors">Browse Notes</Link>
                <Link to="/profile" className="font-headline font-bold text-sm text-slate-600 hover:text-primary transition-colors">My Profile</Link>
                <Link to="/admin" className="font-headline font-bold text-sm text-slate-600 hover:text-primary transition-colors">Admin</Link>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleAuthAction}
                    className={`${isLoggedIn ? 'bg-slate-100 text-slate-700' : 'bg-primary text-white'} px-6 py-2 rounded-lg font-headline font-bold text-sm hover:opacity-90 active:scale-95 transition-all`}
                >
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
