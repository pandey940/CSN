import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UploadNoteModal from '../components/UploadNoteModal';
import { Settings, Verified, Star, Eye, Download, MoreVertical, PlusCircle, Share2, Globe, History, Bookmark, Trash2 } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'uploads';
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [userNotes, setUserNotes] = useState([]);
    const [loading, setLoading] = useState(false);

    const setActiveTab = (tab) => {
        setSearchParams({ tab });
    };

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchUserNotes = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const response = await axios.get(`/api/notes?author=${user.name}`);
                setUserNotes(response.data);
            } catch (err) {
                console.error('Error fetching user notes:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserNotes();
    }, []);

    const handleUploadSuccess = (newNote) => {
        setUserNotes(prev => [newNote, ...prev]);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;
        
        try {
            await axios.delete(`/api/notes/${id}`);
            setUserNotes(prev => prev.filter(note => note._id !== id));
        } catch (err) {
            console.error('Error deleting note:', err);
            alert('Failed to delete note. Please try again.');
        }
    };

    const handleDownload = async (noteId, title) => {
        try {
            const response = await axios.get(`/api/notes/${noteId}/download`);
            const link = document.createElement('a');
            link.href = response.data.downloadUrl;
            link.download = `${title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Refresh notes to show updated download count
            const updatedNotes = await axios.get(`/api/notes?author=${user.name}`);
            setUserNotes(updatedNotes.data);
        } catch (err) {
            console.error('Download error:', err);
            alert('Failed to start download. Please try again.');
        }
    };

    const handleView = async (noteId, fileUrl) => {
        try {
            // 1. Open the PDF immediately so the user isn't waiting
            window.open(fileUrl, '_blank');
            
            // 2. Increment view count in backend
            await axios.patch(`/api/notes/${noteId}/view`);
            
            // 3. Refresh notes to show updated view count
            const updatedNotes = await axios.get(`/api/notes?author=${user.name}`);
            setUserNotes(updatedNotes.data);
            console.log('View count updated successfully');
        } catch (err) {
            console.error('View tracking error:', err);
        }
    };

    return (
        <div className="bg-surface font-body text-on-surface min-h-screen">
            <Navbar />
            
            <div className="flex pt-16">
                <Sidebar />
                
                <main className="ml-64 w-full p-12 max-w-7xl">
                    {/* Profile Header */}
                    <header className="mb-16">
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-4xl font-headline font-black shadow-xl shadow-indigo-900/20">
                                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'JD'}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-secondary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                                    <Verified size={16} fill="currentColor" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start w-full">
                                    <div>
                                        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-on-surface mb-2">{user?.name || 'Julianne D. Curator'}</h1>
                                        <p className="text-lg text-slate-500 font-body mb-6">{user?.branch || 'Senior Researcher'} • {user?.college || 'Faculty of Advanced Engineering'}</p>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="bg-slate-100 px-4 py-1.5 rounded-full font-label text-xs uppercase tracking-widest text-slate-600 flex items-center gap-2">
                                                {user?.college || 'Stanford University'}
                                            </span>
                                            <span className="bg-slate-100 px-4 py-1.5 rounded-full font-label text-xs uppercase tracking-widest text-slate-600 flex items-center gap-2">
                                                {user?.branch || 'Neural Networks'}
                                            </span>
                                            <span className="bg-slate-100 px-4 py-1.5 rounded-full font-label text-xs uppercase tracking-widest text-slate-600 flex items-center gap-2">
                                                Semester {user?.semester || 'VIII'}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-headline font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2">
                                        <Settings size={16} /> Account Settings
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 border-l-4 border-primary">
                                <p className="font-label text-xs uppercase text-slate-500 tracking-wider">Total Uploads</p>
                                <p className="text-3xl font-headline font-black text-on-surface">142</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 border-l-4 border-secondary">
                                <p className="font-label text-xs uppercase text-slate-500 tracking-wider">Avg. Rating</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-headline font-black text-on-surface">4.8</p>
                                    <Star size={24} className="text-secondary fill-secondary" />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 border-l-4 border-emerald-500">
                                <p className="font-label text-xs uppercase text-slate-500 tracking-wider">Saves Received</p>
                                <p className="text-3xl font-headline font-black text-on-surface">2.4k</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 border-l-4 border-indigo-200">
                                <p className="font-label text-xs uppercase text-slate-500 tracking-wider">Total Downloads</p>
                                <p className="text-3xl font-headline font-black text-on-surface">8.9k</p>
                            </div>
                        </div>
                    </header>

                    {/* Content Section */}
                    <section className="mt-16">
                        <div className="flex gap-12 border-b border-slate-100 mb-8">
                            <button 
                                onClick={() => setActiveTab('uploads')}
                                className={`pb-4 text-sm font-headline font-bold tracking-tight transition-all ${activeTab === 'uploads' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-on-surface'}`}
                            >
                                My Uploads
                            </button>
                            <button 
                                onClick={() => setActiveTab('saved')}
                                className={`pb-4 text-sm font-headline font-bold tracking-tight transition-all ${activeTab === 'saved' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-on-surface'}`}
                            >
                                Saved Notes
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`pb-4 text-sm font-headline font-bold tracking-tight transition-all ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-on-surface'}`}
                            >
                                Download History
                            </button>
                            <button 
                                onClick={() => setActiveTab('settings')}
                                className={`pb-4 text-sm font-headline font-bold tracking-tight transition-all ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-on-surface'}`}
                            >
                                Preferences
                            </button>
                        </div>

                        {activeTab === 'uploads' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Map through uploaded notes */}
                                {userNotes.map(note => (
                                    <div key={note._id} className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                                            <img className="w-full h-full object-cover" src={note.thumbnail} alt="Note thumbnail" />
                                        </div>
                                        <div className="p-6">
                                            <p className="font-label text-[10px] uppercase tracking-widest text-slate-400 mb-2">{note.subject} • {note.course}</p>
                                            <h3 className="font-headline font-bold text-lg text-on-surface mb-4 leading-snug">{note.title}</h3>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-4 text-slate-400 text-xs font-label">
                                                    <span className="flex items-center gap-1 cursor-help" title="Views"><Eye size={14} /> {note.viewCount}</span>
                                                    <button 
                                                        onClick={() => handleDownload(note._id, note.title)}
                                                        className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer" 
                                                        title="Download PDF"
                                                    >
                                                        <Download size={14} /> {note.downloadCount}
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => handleView(note._id, note.fileUrl)}
                                                        className="flex items-center gap-2 text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all text-xs font-bold border border-primary/10"
                                                    >
                                                        <Eye size={14} /> View
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(note._id)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                        title="Delete Note"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Existing Card 1 (Demo) */}
                                {userNotes.length === 0 && (
                                    <div className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                                        <div className="h-48 bg-slate-100 relative overflow-hidden">
                                            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaCLcbpj5ewG2iyyluHCrNbJ1h6pz3kC_DBOI4j8Gn2LOD_gozqdJ9gbhkWgCsmSqvkRyA0RbN4dRr-7XzqF8IXGoxzNXhf-BQYcSMKOuVcKKxIj8s9RsD1FhcHZd8FHpoRi_Dbt12mTStYaNWe7k0mKLu5SqUYlfg3g4TjGa_SgK6h77bKi3yW5vAAgaqO81tIvDyrnLsY70YybchLKB2hJvtv1Kr9VnT1BUDW42Kux-BJmtHLzk_L1hU-eTjkiUWhul4FEjUIAcD" alt="Note thumbnail" />
                                            <div className="absolute top-4 right-4 bg-emerald-50 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-100">
                                                <span className="text-[10px] font-label font-bold text-emerald-600 uppercase tracking-widest">Approved</span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <p className="font-label text-[10px] uppercase tracking-widest text-slate-400 mb-2">CS-402 • Distributed Systems</p>
                                            <h3 className="font-headline font-bold text-lg text-on-surface mb-4 leading-snug">Raft Consensus Algorithm: Visual Deep Dive</h3>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-4 text-slate-400 text-xs font-label">
                                                    <span className="flex items-center gap-1"><Eye size={14} /> 1.2k</span>
                                                    <span className="flex items-center gap-1"><Download size={14} /> 430</span>
                                                </div>
                                                <MoreVertical size={18} className="text-primary cursor-pointer hover:scale-110 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <History size={32} className="text-slate-400" />
                                </div>
                                <h3 className="font-headline font-bold text-xl mb-2">Your Download History</h3>
                                <p className="text-slate-500 font-body mb-6">You haven't downloaded any notes yet. Start exploring!</p>
                                <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm tracking-tight shadow-lg shadow-indigo-200">Go to Search</button>
                            </div>
                        )}

                        {activeTab === 'saved' && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bookmark size={32} className="text-slate-400" />
                                </div>
                                <h3 className="font-headline font-bold text-xl mb-2">Saved for Later</h3>
                                <p className="text-slate-500 font-body mb-6">Keep track of important resources by bookmarking them.</p>
                                <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm tracking-tight shadow-lg shadow-indigo-200">Browse Notes</button>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-12">
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
                                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Settings size={32} className="text-slate-400" />
                                    </div>
                                    <h3 className="font-headline font-bold text-xl mb-2">Profile Preferences</h3>
                                    <p className="text-slate-500 font-body mb-6">Customize your profile experience and account settings here.</p>
                                    <div className="flex justify-center gap-4">
                                        <button className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">Edit Profile</button>
                                        <button className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">Privacy</button>
                                    </div>
                                </div>

                                {/* Upload CTA - Moved here to only appear in Preferences */}
                                <div 
                                    onClick={() => setIsUploadModalOpen(true)}
                                    className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-12 text-center group hover:border-primary transition-colors cursor-pointer"
                                >
                                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <PlusCircle size={32} className="text-primary" />
                                    </div>
                                    <h4 className="font-headline font-bold text-xl text-on-surface">Curate a new set of notes</h4>
                                    <p className="text-slate-500 font-body max-w-sm mx-auto mt-2 mb-6">Contribute to the collective knowledge of your institution and build your academic reputation.</p>
                                    <button className="bg-primary text-white px-8 py-3 rounded-lg font-headline font-bold text-sm tracking-tight shadow-lg shadow-indigo-200">Start Uploading</button>
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            <UploadNoteModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setIsUploadModalOpen(false)} 
                onUploadSuccess={handleUploadSuccess}
            />
            
            {/* Minimal Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 px-8 mt-24">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <p className="font-body text-sm text-slate-500">© 2024 The Academic Curator. Knowledge preserved.</p>
                    <div className="flex gap-4 text-slate-300">
                        <Share2 size={20} className="hover:text-primary transition-colors cursor-pointer" />
                        <Globe size={20} className="hover:text-primary transition-colors cursor-pointer" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Profile;
