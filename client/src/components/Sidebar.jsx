import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, CloudUpload, Bookmark, History, School, BookOpen, GitBranch, Calendar, Book, LogOut } from 'lucide-react';

const Sidebar = ({ isAdmin: propIsAdmin = false }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if user is admin from localStorage as a fallback or primary source
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = propIsAdmin || user.role === 'Admin' || user.role === 'Moderator';

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear auth token
        localStorage.removeItem('user');
        navigate('/'); // Redirect to Home
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="h-[calc(100vh-64px)] w-72 fixed left-0 top-16 bg-slate-50 border-r border-slate-200 overflow-y-auto pt-6 flex flex-col gap-1 pb-20">
            <div className="px-6 mb-4">
                <h3 className="font-headline font-bold text-indigo-600 tracking-tight text-lg">Dashboard</h3>
                <p className="font-label text-xs uppercase tracking-wider text-slate-500 mb-6">Academic Archive</p>
            </div>
            
            <nav className="px-3 flex flex-col gap-1">
                {isAdmin && (
                    <Link 
                        className={`${isActive('/admin') ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-indigo-700 border-indigo-100'} rounded-lg px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider border transition-all`} 
                        to="/admin"
                    >
                        <Home size={18} /> Admin Panel
                    </Link>
                )}
                <Link className={`${isActive('/profile') && location.search.includes('tab=uploads') ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-primary'} px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider transition-all rounded-lg`} to="/profile?tab=uploads">
                    <CloudUpload size={18} /> My Uploads
                </Link>
                <Link className={`${isActive('/profile') && location.search.includes('tab=saved') ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-primary'} px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider transition-all rounded-lg`} to="/profile?tab=saved">
                    <Bookmark size={18} /> Saved Notes
                </Link>
                <Link className={`${isActive('/profile') && location.search.includes('tab=history') ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-primary'} px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider transition-all rounded-lg`} to="/profile?tab=history">
                    <History size={18} /> History
                </Link>
                
                <div className="my-4 border-t border-slate-200 mx-3"></div>
                
                <Link className={`${isActive('/search') ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-primary'} px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider transition-all rounded-lg`} to="/search">
                    <School size={18} /> College
                </Link>
                <Link className={`${isActive('/courses') ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-primary'} px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider transition-all rounded-lg`} to="/search">
                    <BookOpen size={18} /> Course
                </Link>
                <Link className={`${isActive('/branches') ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-primary'} px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider transition-all rounded-lg`} to="/search">
                    <GitBranch size={18} /> Branch
                </Link>
                <Link className={`${isActive('/semesters') ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-primary'} px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider transition-all rounded-lg`} to="/search">
                    <Calendar size={18} /> Semester
                </Link>
                <Link className={`${isActive('/subjects') ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:bg-white hover:text-primary'} px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider transition-all rounded-lg`} to="/search">
                    <Book size={18} /> Subject
                </Link>

                <div className="mt-auto mb-4 px-3 pt-4 border-t border-slate-200">
                    <button 
                        onClick={handleLogout}
                        className="w-full text-red-500 px-4 py-2 flex items-center gap-3 font-label text-sm uppercase tracking-wider hover:bg-red-50 transition-all rounded-lg"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
