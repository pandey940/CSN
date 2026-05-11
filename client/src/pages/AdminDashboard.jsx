import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { TrendingUp, ShieldAlert, FileText, CheckCircle,XCircle, MoreVertical, Flag, Search as SearchIcon, UserPlus, MessageSquare, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
    const [reports, setReports] = useState([]);
    const [pendingNotes, setPendingNotes] = useState([]);
    const [viewAllPending, setViewAllPending] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Fetch reports from API
        const fetchReports = async () => {
            try {
                const response = await axios.get('/api/admin/reports');
                setReports(response.data);
            } catch (err) {
                console.error('Error fetching reports:', err);
                // Mock reports if API is not running
                setReports([
                    {
                        id: 1,
                        note: { title: "Organic Chemistry Guide v3", college: "Oxford Press" },
                        type: "Copyright Claim",
                        reportedBy: "Oxford Press",
                        status: "Open"
                    },
                    {
                        id: 2,
                        note: { title: "Discrete Math Cheat Sheet", college: "IIT Bombay" },
                        type: "Inaccurate Content",
                        reportedBy: "User @MattyM",
                        status: "Open"
                    }
                ]);
            }
        };

        const fetchPendingNotes = async () => {
            try {
                const response = await axios.get('/api/notes?status=Pending');
                setPendingNotes(response.data);
            } catch (err) {
                console.error('Error fetching pending notes:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
        fetchPendingNotes();
    }, []);

    const handleApprove = async (id) => {
        try {
            await axios.patch(`/api/notes/${id}`, { status: 'Approved' });
            setPendingNotes(prev => prev.filter(note => note._id !== id));
        } catch (err) {
            console.error('Error approving note:', err);
            alert('Failed to approve note');
        }
    };

    const handleReject = async (id) => {
        const comment = window.prompt('Enter reason for rejection (optional):');
        if (comment === null) return; // User cancelled prompt

        try {
            await axios.patch(`/api/notes/${id}`, { 
                status: 'Rejected',
                moderatorComment: comment 
            });
            setPendingNotes(prev => prev.filter(note => note._id !== id));
        } catch (err) {
            console.error('Error rejecting note:', err);
            alert('Failed to reject note');
        }
    };

    const handleAddComment = async (id) => {
        const comment = window.prompt('Add a moderator comment:');
        if (comment === null) return;
        try {
            await axios.patch(`/api/notes/${id}`, { moderatorComment: comment });
            setPendingNotes(prev => prev.map(note => note._id === id ? { ...note, moderatorComment: comment } : note));
        } catch (err) {
            console.error('Error adding comment:', err);
            alert('Failed to add comment');
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchReports();
        fetchPendingNotes();
    };

    const displayedNotes = viewAllPending ? pendingNotes : pendingNotes.slice(0, 3);

    return (
        <div className="bg-background font-body text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
            <Navbar />
            
            <div className="flex pt-16">
                <Sidebar isAdmin={true} />
                
                <main className="flex-1 ml-64 p-12 pt-24 bg-slate-50/50">
                    <header className="mb-16">
                        <h1 className="font-headline text-6xl font-black tracking-tighter text-on-background mb-4">Command Center</h1>
                        <p className="font-body text-slate-500 text-lg max-w-3xl leading-relaxed">Oversee the academic ecosystem. Manage contributions, monitor platform health, and ensure knowledge integrity across all institutions.</p>
                    </header>

                    {/* Stats Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 group hover:border-primary/20 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <span className="font-label text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Daily Uploads</span>
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <TrendingUp size={20} />
                                </div>
                            </div>
                            <div className="text-4xl font-headline font-black text-on-surface">248</div>
                            <div className="text-xs font-bold text-emerald-600 mt-3 flex items-center gap-1">
                                <TrendingUp size={14} /> +12% growth
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 group hover:border-secondary/20 transition-all">
                            <div className="flex justify-between items-start mb-6">
                                <span className="font-label text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Active Mods</span>
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                                    <ShieldAlert size={20} />
                                </div>
                            </div>
                            <div className="text-4xl font-headline font-black text-on-surface">14</div>
                            <div className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest">Currently live</div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 col-span-1 md:col-span-2 relative overflow-hidden group">
                           <div className="relative z-10 flex flex-col justify-between h-full">
                                <div>
                                    <span className="font-label text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Highest Velocity Subject</span>
                                    <div className="text-3xl font-headline font-black mt-2 text-on-surface">Quantum Mechanics II</div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <span className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full font-label text-[10px] font-bold uppercase tracking-widest border border-slate-100">Physics</span>
                                    <span className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full font-label text-[10px] font-bold uppercase tracking-widest border border-slate-100">Engineering</span>
                                </div>
                            </div>
                            <FileText className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] group-hover:opacity-[0.07] transition-all duration-500 scale-125" size={140} />
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Moderation Queue */}
                        <section className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-headline text-2xl font-bold flex items-center gap-3">
                                    Moderation Queue
                                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-lg text-xs font-label uppercase font-bold tracking-wider">{pendingNotes.length} PENDING</span>
                                </h3>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => alert('All pending items will be reviewed by admin.')}
                                        className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-label font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center gap-2"
                                    >
                                        <ShieldCheck size={14} /> Admin Approval
                                    </button>
                                    <button 
                                        onClick={handleRefresh}
                                        className="text-slate-400 hover:text-primary transition-colors p-1"
                                        title="Refresh Queue"
                                    >
                                        <TrendingUp size={16} className="rotate-90" />
                                    </button>
                                    {pendingNotes.length > 3 && (
                                        <button 
                                            onClick={() => setViewAllPending(!viewAllPending)}
                                            className="text-primary font-label text-xs font-bold hover:underline"
                                        >
                                            {viewAllPending ? 'Show Less' : 'View All'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-400">
                                        Loading queue...
                                    </div>
                                ) : pendingNotes.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-400">
                                        No pending items in queue.
                                    </div>
                                ) : (
                                    displayedNotes.map(note => (
                                        <div key={note._id} className="bg-white p-6 rounded-xl flex flex-col md:flex-row gap-6 items-center shadow-sm border border-slate-100 border-l-4 border-secondary">
                                            <div className="w-16 h-20 bg-slate-50 rounded flex-shrink-0 flex items-center justify-center relative border border-slate-100">
                                                <FileText className="text-slate-300" size={32} />
                                                <div className="absolute bottom-1 right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="font-bold text-lg leading-tight truncate">{note.title}</h4>
                                                    <span className="font-label text-[10px] bg-slate-100 px-2 py-0.5 rounded-full uppercase flex-shrink-0">{note.fileType}</span>
                                                </div>
                                                <div className="flex gap-4 mb-3 text-sm text-slate-500">
                                                    <span className="font-medium truncate">{note.author}</span>
                                                    <span className="truncate">{note.college} / {note.branch}</span>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-lg text-sm italic text-slate-600 mb-2 border-l-2 border-slate-200 line-clamp-1">
                                                    "{note.description}"
                                                </div>
                                                {note.moderatorComment && (
                                                    <div className="text-xs font-bold text-indigo-600 flex items-center gap-2">
                                                        <MessageSquare size={12} /> Note: {note.moderatorComment}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                                                <button 
                                                    onClick={() => handleApprove(note._id)}
                                                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-label text-[11px] font-bold uppercase hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(note._id)}
                                                    className="flex-1 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-label text-[11px] font-bold uppercase hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <XCircle size={14} /> Reject
                                                </button>
                                                <button 
                                                    onClick={() => handleAddComment(note._id)}
                                                    className="flex-1 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-label text-[11px] font-bold uppercase hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <MessageSquare size={14} /> Comment
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Right Sidebar - Reports & Management */}
                        <section className="space-y-8">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
                                    <Flag size={20} className="text-red-500" />
                                    Reported Content
                                </h3>
                                <div className="space-y-4">
                                    {reports.map(report => (
                                        <div key={report._id || report.id} className="bg-white p-4 rounded-lg border-l-2 border-red-500 shadow-sm">
                                            <div className="text-xs font-label text-slate-400 mb-1 uppercase tracking-tighter font-bold">{report.type}</div>
                                            <div className="font-bold text-sm mb-2">{report.note.title}</div>
                                            <div className="text-xs text-slate-500 mb-3">Reported by: {report.reportedBy}</div>
                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-red-500 text-white py-1.5 rounded font-label text-[11px] font-bold uppercase tracking-widest hover:bg-red-600 transition-colors">Take Down</button>
                                                <button className="bg-slate-100 px-3 py-1.5 rounded font-label text-[11px] font-bold uppercase text-slate-600 hover:bg-slate-200 transition-colors">Ignore</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* User Management */}
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-headline text-xl font-bold">New Contributors</h3>
                                    <button className="text-slate-400 hover:text-primary"><SearchIcon size={18} /></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">BK</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold truncate">Brandon K.</div>
                                            <div className="text-[10px] text-slate-500 font-label uppercase">5 Uploads</div>
                                        </div>
                                        <CheckCircle className="text-primary" size={16} fill="currentColor" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700">ML</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold truncate">Maria Lopez</div>
                                            <div className="text-[10px] text-slate-500 font-label uppercase">2 Uploads</div>
                                        </div>
                                        <UserPlus className="text-slate-400 hover:text-primary cursor-pointer" size={16} />
                                    </div>
                                </div>
                                <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-xs font-label font-bold uppercase text-slate-500 hover:bg-white hover:text-primary hover:border-primary transition-all">Manage All Users</button>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
            
            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 w-full py-12 px-8 mt-24">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="font-headline font-bold text-slate-900 text-lg">The Academic Curator</span>
                    <div className="flex gap-8 font-body text-sm text-slate-500">
                        <a href="#" className="hover:text-primary transition-colors">About Project</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
                    </div>
                    <div className="text-slate-400 text-sm">© 2024 The Academic Curator. Knowledge preserved.</div>
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;
