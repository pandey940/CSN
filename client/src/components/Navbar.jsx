import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleAuthAction = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        } else {
            navigate('/login');
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass-nav fixed top-0 w-full z-50 border-b border-indigo-500/10 h-16 flex items-center justify-between px-8">
            <div className="flex items-center gap-2">
                <span className="text-xl font-black text-indigo-700 tracking-tighter font-headline">The Academic Curator</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
                <Link to="/" className={`font-headline font-bold text-sm ${isActive('/') ? 'text-primary' : 'text-slate-600 hover:text-primary'} transition-colors`}>Home</Link>
                <Link to="/search" className={`font-headline font-bold text-sm ${isActive('/search') ? 'text-primary' : 'text-slate-600 hover:text-primary'} transition-colors`}>Browse Notes</Link>
                <Link to="/profile" className={`font-headline font-bold text-sm ${isActive('/profile') ? 'text-primary' : 'text-slate-600 hover:text-primary'} transition-colors`}>My Profile</Link>
                <Link to="/admin" className={`font-headline font-bold text-sm ${isActive('/admin') ? 'text-primary' : 'text-slate-600 hover:text-primary'} transition-colors`}>Admin</Link>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={handleAuthAction}
                    className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-lg font-headline font-bold text-sm hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all shadow-sm"
                >
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

