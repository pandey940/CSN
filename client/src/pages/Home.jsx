import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search, ArrowRight, Brain, Calculator, Terminal, Key, Download, User, LogOut } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };
    return (
        <div className="bg-background font-body text-on-background selection:bg-primary/20">
            <Navbar />

            {/* Hero Section */}
            <section className="min-h-screen hero-gradient pt-32 pb-20 px-8 flex flex-col items-center justify-center text-center">
                <div className="max-w-4xl">
                    <span className="bg-indigo-100 text-primary px-4 py-1 rounded-full text-xs font-label font-bold uppercase tracking-widest mb-6 inline-block">Knowledge Preserved</span>
                    <h1 className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9] text-on-background mb-8">
                        The Global Commons for <span className="text-primary italic">Student Intelligence.</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-body max-w-2xl mx-auto mb-12 leading-relaxed">
                        Access a high-fidelity repository of verified academic notes, research, and curated wisdom from top institutions worldwide.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <a href="/search" className="bg-primary text-white px-8 py-4 rounded-xl font-headline font-bold text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2">
                            <Search size={24} /> Browse Catalog
                        </a>
                        {isLoggedIn ? (
                            <button 
                                onClick={handleLogout}
                                className="bg-white border border-red-200 text-red-500 px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-red-50 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <LogOut size={24} /> Logout
                            </button>
                        ) : (
                            <a href="/login" className="bg-white border border-slate-200 px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-slate-50 transition-all active:scale-95">
                                Login to Start
                            </a>
                        )}
                        <a href="/profile" className="bg-white border border-slate-200 px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-slate-50 transition-all active:scale-95">
                            Upload Your Work
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-8 bg-white border-y border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <p className="text-4xl font-headline font-black text-indigo-700">50K+</p>
                        <p className="text-sm font-label text-slate-500 uppercase tracking-widest mt-2">Verified Notes</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-headline font-black text-indigo-700">200+</p>
                        <p className="text-sm font-label text-slate-500 uppercase tracking-widest mt-2">Institutions</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-headline font-black text-indigo-700">12M</p>
                        <p className="text-sm font-label text-slate-500 uppercase tracking-widest mt-2">Total Reads</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-headline font-black text-indigo-700">100%</p>
                        <p className="text-sm font-label text-slate-500 uppercase tracking-widest mt-2">Student Verified</p>
                    </div>
                </div>
            </section>

            {/* Student Features Section */}
            <section className="py-24 px-8 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-xs font-bold font-label uppercase tracking-[0.2em] text-indigo-600 mb-12">Student Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Registration & Login */}
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8">
                                <Key size={28} />
                            </div>
                            <h3 className="text-sm font-bold font-label uppercase tracking-widest text-indigo-600 mb-4">Registration & Login</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Email + password sign-up with OTP email verification. Google OAuth 2.0 for one-click login. JWT access + refresh token flow. Password reset via secure email link. Profile setup: college, branch, semester, avatar.
                            </p>
                        </div>
                        {/* Search & Filter Notes */}
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                                <Search size={28} />
                            </div>
                            <h3 className="text-sm font-bold font-label uppercase tracking-widest text-indigo-600 mb-4">Search & Filter Notes</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Full-text search across title, subject, and description. Multi-dimensional filters: college, course, branch, semester, subject, year, note type, minimum rating. Sort by: downloads, rating, or newest.
                            </p>
                        </div>
                        {/* Download Notes */}
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
                                <Download size={28} />
                            </div>
                            <h3 class="text-sm font-bold font-label uppercase tracking-widest text-indigo-600 mb-4">Download Notes</h3>
                            <p className="text-slate-600 leading-relaxed">
                                One-click secure download via signed AWS S3 URLs (15-min TTL). Download counter visible on each note card. Daily limit enforced per user (free tier: 20 files/day). Full download history in profile.
                            </p>
                        </div>
                        {/* User Profile --> */}
                        <div className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-8">
                                <User size={28} />
                            </div>
                            <h3 className="text-sm font-bold font-label uppercase tracking-widest text-indigo-600 mb-4">User Profile</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Public profile: avatar, college, branch, stats (downloads received, average rating given). Private: bookmarked notes, download history, settings, and password change.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subjects Section */}
            <section className="py-32 px-8 bg-surface">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-headline font-black tracking-tight mb-4">Top Curated Subjects</h2>
                            <p className="text-slate-500 font-body">Deep dive into specific domains with notes verified by subject matter experts.</p>
                        </div>
                        <button className="text-primary font-headline font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            View Catalog <ArrowRight size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Subject 1 */}
                        <div className="bg-indigo-50 p-8 rounded-3xl group hover:bg-primary transition-all duration-500 cursor-pointer">
                            <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:text-primary-foreground transition-colors group-hover:bg-white/20">
                                <Brain size={28} />
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-4 group-hover:text-white transition-colors">Neurobiology</h3>
                            <p className="text-slate-500 group-hover:text-indigo-100 transition-colors">Advanced synaptic plasticity and neural circuit mappings notes.</p>
                        </div>
                        {/* Subject 2 */}
                        <div className="bg-orange-50 p-8 rounded-3xl group hover:bg-secondary transition-all duration-500 cursor-pointer">
                            <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-secondary group-hover:text-secondary-foreground transition-colors group-hover:bg-white/20">
                                <Calculator size={28} />
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-4 group-hover:text-white transition-colors">Advanced Calculus</h3>
                            <p className="text-slate-500 group-hover:text-orange-100 transition-colors">Multivariate integration and complex analysis practice papers.</p>
                        </div>
                        {/* Subject 3 */}
                        <div className="bg-emerald-50 p-8 rounded-3xl group hover:bg-emerald-600 transition-all duration-500 cursor-pointer">
                            <div className="bg-white w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:text-white transition-colors group-hover:bg-white/20">
                                <Terminal size={28} />
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-4 group-hover:text-white transition-colors">Systems Design</h3>
                            <p className="text-slate-500 group-hover:text-emerald-50 transition-colors">Distributed consensus and architectural scalability blueprints.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 pt-24 pb-12 px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <span className="text-2xl font-black text-indigo-700 font-headline mb-4 block">The Academic Curator</span>
                        <p className="text-slate-400 font-body max-w-sm">Elevating the standards of academic sharing. Knowledge is meant to be free, accurate, and accessible.</p>
                    </div>
                    <div className="flex gap-12 md:justify-end">
                        <nav className="flex flex-col gap-4">
                            <p className="text-xs font-bold font-label uppercase tracking-widest text-slate-400">Navigation</p>
                            <a href="/search" className="text-sm font-body text-slate-600 hover:text-primary">Catalog</a>
                            <a href="/profile" className="text-sm font-body text-slate-600 hover:text-primary">Uploads</a>
                        </nav>
                        <nav className="flex flex-col gap-4">
                            <p className="text-xs font-bold font-label uppercase tracking-widest text-slate-400">Legal</p>
                            <a href="#" className="text-sm font-body text-slate-600 hover:text-primary">Privacy</a>
                            <a href="#" className="text-sm font-body text-slate-600 hover:text-primary">Terms</a>
                        </nav>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 border-t border-slate-50 text-center">
                    <p className="text-xs text-slate-400 font-label uppercase tracking-widest">© 2024 THE ACADEMIC CURATOR. ALL RIGHTS RESERVED.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
