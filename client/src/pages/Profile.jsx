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
                if (Array.isArray(response.data)) {
                    setUserNotes(response.data);
                } else {
                    console.error('Expected array of user notes, got:', response.data);
                    setUserNotes([]);
                }
            } catch (err) {
                console.error('Error fetching user notes:', err);
                setUserNotes([]);
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
            const downloadUrl = response.data.downloadUrl;
            link.href = downloadUrl.startsWith('/') && axios.defaults.baseURL 
                ? `${axios.defaults.baseURL}${downloadUrl}` 
                : downloadUrl;
            link.download = `${title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Refresh notes to show updated download count
            const updatedNotes = await axios.get(`/api/notes?author=${user.name}`);
            if (Array.isArray(updatedNotes.data)) {
                setUserNotes(updatedNotes.data);
            }
        } catch (err) {
            console.error('Download error:', err);
            alert('Failed to start download. Please try again.');
        }
    };

    const handleView = async (noteId, fileUrl) => {
        try {
            // 1. Open the PDF immediately so the user isn't waiting
            const fullFileUrl = fileUrl.startsWith('/') && axios.defaults.baseURL 
                ? `${axios.defaults.baseURL}${fileUrl}` 
                : fileUrl;
            window.open(fullFileUrl, '_blank');
            
            // 2. Increment view count in backend
            await axios.patch(`/api/notes/${noteId}/view`);
            
            // 3. Refresh notes to show updated view count
            const updatedNotes = await axios.get(`/api/notes?author=${user.name}`);
            if (Array.isArray(updatedNotes.data)) {
                setUserNotes(updatedNotes.data);
            }
            console.log('View count updated successfully');
        } catch (err) {
            console.error('View tracking error:', err);
            // Fallback: make sure the PDF opens even if views endpoint fails
            const fullFileUrl = fileUrl.startsWith('/') && axios.defaults.baseURL 
                ? `${axios.defaults.baseURL}${fileUrl}` 
                : fileUrl;
            window.open(fullFileUrl, '_blank');
        }
    };

    return (
        <div className="bg-background font-body text-white min-h-screen">
            <Navbar />
            
            <div className="flex pt-16">
                <Sidebar />
                
                <main className="ml-64 w-full p-12 max-w-7xl">
                    {/* Profile Header */}
                    <header className="mb-16">
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-lg bg-primary flex items-center justify-center text-white text-4xl font-headline font-black shadow-xl shadow-indigo-900/20">
                                    {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'DM'}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-[#9d4300] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                                    <Verified size={16} fill="currentColor" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start w-full">
                                    <div>
                                        <h1 className="text-5xl font-headline font-extrabold tracking-tighter text-white mb-2">{user?.name || 'Deepika Mishra'}</h1>
                                        <p className="text-lg text-slate-400 font-body mb-6">{user?.branch || 'CS'} • {user?.college || 'IIT Bombay'}</p>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="bg-white px-4 py-1.5 rounded-full border border-slate-200 font-label text-xs uppercase tracking-widest text-slate-700 flex items-center gap-2 shadow-sm">
                                                {user?.college || 'IIT Bombay'}
                                            </span>
                                            <span className="bg-white px-4 py-1.5 rounded-full border border-slate-200 font-label text-xs uppercase tracking-widest text-slate-700 flex items-center gap-2 shadow-sm">
                                                {user?.branch || 'CS'}
                                            </span>
                                            <span className="bg-white px-4 py-1.5 rounded-full border border-slate-200 font-label text-xs uppercase tracking-widest text-slate-700 flex items-center gap-2 shadow-sm">
                                                Semester {user?.semester || '4'}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="bg-white text-slate-700 border border-slate-200 px-6 py-2 rounded-lg font-headline font-bold text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                                        <Settings size={16} /> Account Settings
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 border-l-4 border-primary text-slate-800">
                                <p className="font-label text-xs uppercase text-slate-500 tracking-wider">Total Uploads</p>
                                <p className="text-3xl font-headline font-black text-slate-900">142</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 border-l-4 border-secondary text-slate-800">
                                <p className="font-label text-xs uppercase text-slate-500 tracking-wider">Avg. Rating</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-headline font-black text-slate-900">4.8</p>
                                    <Star size={24} className="text-amber-500 fill-amber-500" />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 border-l-4 border-emerald-500 text-slate-800">
                                <p className="font-label text-xs uppercase text-slate-500 tracking-wider">Saves Received</p>
                                <p className="text-3xl font-headline font-black text-slate-900">2.4k</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 border-l-4 border-indigo-200 text-slate-800">
                                <p className="font-label text-xs uppercase text-slate-500 tracking-wider">Total Downloads</p>
                                <p className="text-3xl font-headline font-black text-slate-900">8.9k</p>
                            </div>
                        </div>
                    </header>

                    {/* Content Section */}
                    <section className="mt-16">
                        <div className="flex gap-12 border-b border-indigo-950/20 mb-8">
                            <button 
                                onClick={() => setActiveTab('uploads')}
                                className={`pb-4 text-sm font-headline font-bold tracking-tight transition-all ${activeTab === 'uploads' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}
                            >
                                My Uploads
                            </button>
                            <button 
                                onClick={() => setActiveTab('saved')}
                                className={`pb-4 text-sm font-headline font-bold tracking-tight transition-all ${activeTab === 'saved' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}
                            >
                                Saved Notes
                            </button>
                            <button 
                                onClick={() => setActiveTab('history')}
                                className={`pb-4 text-sm font-headline font-bold tracking-tight transition-all ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}
                            >
                                Download History
                            </button>
                            <button 
                                onClick={() => setActiveTab('settings')}
                                className={`pb-4 text-sm font-headline font-bold tracking-tight transition-all ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-white'}`}
                            >
                                Preferences
                            </button>
                        </div>

                        {activeTab === 'uploads' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Map through uploaded notes */}
                                {userNotes.map(note => (
                                    <div key={note._id} className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-transform duration-300 hover:-translate-y-1 text-slate-800">
                                        <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                            {note.thumbnail && !note.thumbnail.includes('example.com') && !note.thumbnail.includes('googleusercontent.com') && !note.thumbnail.includes('flaticon.com') ? (
                                                <img className="w-full h-full object-cover" src={note.thumbnail} alt="Note thumbnail" />
                                            ) : (
                                                /* Folded page PDF icon graphic */
                                                <div className="w-20 h-28 bg-white rounded-lg shadow-sm border border-slate-200 relative flex items-center justify-center">
                                                    <div className="absolute top-0 right-0 w-5 h-5 bg-slate-100 border-l border-b border-slate-200 rounded-bl-lg"></div>
                                                    <div className="w-16 h-8 bg-red-500 text-white font-headline font-black text-xs text-center flex items-center justify-center rounded">
                                                        PDF
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <p className="font-label text-[10px] uppercase tracking-widest text-slate-400 mb-2">{(note.branch || 'CS') + ' • ' + (note.subject || 'MISC')}</p>
                                            <h3 className="font-headline font-bold text-lg text-slate-900 mb-4 leading-snug">{note.title}</h3>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-4 text-slate-400 text-xs font-label">
                                                    <span className="flex items-center gap-1 cursor-help" title="Views"><Eye size={14} /> {note.viewCount || 0}</span>
                                                    <button 
                                                        onClick={() => handleDownload(note._id, note.title)}
                                                        className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer" 
                                                        title="Download PDF"
                                                    >
                                                        <Download size={14} /> {note.downloadCount || 0}
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
                                    <>
                                        <div className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-transform duration-300 hover:-translate-y-1 text-slate-800">
                                            <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                                <div className="w-20 h-28 bg-white rounded-lg shadow-sm border border-slate-200 relative flex items-center justify-center">
                                                    <div className="absolute top-0 right-0 w-5 h-5 bg-slate-100 border-l border-b border-slate-200 rounded-bl-lg"></div>
                                                    <div className="w-16 h-8 bg-red-500 text-white font-headline font-black text-xs text-center flex items-center justify-center rounded">
                                                        PDF
                                                    </div>
                                                </div>
                                                <div className="absolute top-4 right-4 bg-emerald-50 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-100">
                                                    <span className="text-[10px] font-label font-bold text-emerald-600 uppercase tracking-widest">Approved</span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <p className="font-label text-[10px] uppercase tracking-widest text-slate-400 mb-2">CS • MISC</p>
                                                <h3 className="font-headline font-bold text-lg text-slate-900 mb-4 leading-snug">OOPS</h3>
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                                    <div className="flex items-center gap-4 text-slate-400 text-xs font-label">
                                                        <span className="flex items-center gap-1"><Eye size={14} /> 3</span>
                                                        <span className="flex items-center gap-1"><Download size={14} /> 1</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button className="flex items-center gap-2 text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all text-xs font-bold border border-primary/10">
                                                            <Eye size={14} /> View
                                                        </button>
                                                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-transform duration-300 hover:-translate-y-1 text-slate-800">
                                            <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                                <div className="w-20 h-28 bg-white rounded-lg shadow-sm border border-slate-200 relative flex items-center justify-center">
                                                    <div className="absolute top-0 right-0 w-5 h-5 bg-slate-100 border-l border-b border-slate-200 rounded-bl-lg"></div>
                                                    <div className="w-16 h-8 bg-red-500 text-white font-headline font-black text-xs text-center flex items-center justify-center rounded">
                                                        PDF
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <p className="font-label text-[10px] uppercase tracking-widest text-slate-400 mb-2">DBMS • MISC</p>
                                                <h3 className="font-headline font-bold text-lg text-slate-900 mb-4 leading-snug">computer science</h3>
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                                    <div className="flex items-center gap-4 text-slate-400 text-xs font-label">
                                                        <span className="flex items-center gap-1"><Eye size={14} /> 3</span>
                                                        <span className="flex items-center gap-1"><Download size={14} /> 1</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button className="flex items-center gap-2 text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all text-xs font-bold border border-primary/10">
                                                            <Eye size={14} /> View
                                                        </button>
                                                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden transition-transform duration-300 hover:-translate-y-1 text-slate-800">
                                            <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                                <div className="w-20 h-28 bg-white rounded-lg shadow-sm border border-slate-200 relative flex items-center justify-center">
                                                    <div className="absolute top-0 right-0 w-5 h-5 bg-slate-100 border-l border-b border-slate-200 rounded-bl-lg"></div>
                                                    <div className="w-16 h-8 bg-red-500 text-white font-headline font-black text-xs text-center flex items-center justify-center rounded">
                                                        PDF
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <p className="font-label text-[10px] uppercase tracking-widest text-slate-400 mb-2">DEMO • DEMO</p>
                                                <h3 className="font-headline font-bold text-lg text-slate-900 mb-4 leading-snug">demo</h3>
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                                    <div className="flex items-center gap-4 text-slate-400 text-xs font-label">
                                                        <span className="flex items-center gap-1"><Eye size={14} /> 1</span>
                                                        <span className="flex items-center gap-1"><Download size={14} /> 0</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button className="flex items-center gap-2 text-primary bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all text-xs font-bold border border-primary/10">
                                                            <Eye size={14} /> View
                                                        </button>
                                                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-800 shadow-sm">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <History size={32} className="text-slate-400" />
                                </div>
                                <h3 className="font-headline font-bold text-xl mb-2 text-slate-900">Your Download History</h3>
                                <p className="text-slate-500 font-body mb-6">You haven't downloaded any notes yet. Start exploring!</p>
                                <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm tracking-tight shadow-lg shadow-indigo-100">Go to Search</button>
                            </div>
                        )}

                        {activeTab === 'saved' && (
                            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-800 shadow-sm">
                                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bookmark size={32} className="text-slate-400" />
                                </div>
                                <h3 className="font-headline font-bold text-xl mb-2 text-slate-900">Saved for Later</h3>
                                <p className="text-slate-500 font-body mb-6">Keep track of important resources by bookmarking them.</p>
                                <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-sm tracking-tight shadow-lg shadow-indigo-100">Browse Notes</button>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="space-y-12">
                                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-800 shadow-sm">
                                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Settings size={32} className="text-slate-400" />
                                    </div>
                                    <h3 className="font-headline font-bold text-xl mb-2 text-slate-900">Profile Preferences</h3>
                                    <p className="text-slate-500 font-body mb-6">Customize your profile experience and account settings here.</p>
                                    <div className="flex justify-center gap-4">
                                        <button className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">Edit Profile</button>
                                        <button className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">Privacy</button>
                                    </div>
                                </div>

                                {/* Upload CTA */}
                                <div 
                                    onClick={() => setIsUploadModalOpen(true)}
                                    className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-12 text-center group hover:border-primary transition-colors cursor-pointer text-slate-800"
                                >
                                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <PlusCircle size={32} className="text-primary" />
                                    </div>
                                    <h4 className="font-headline font-bold text-xl text-slate-900">Curate a new set of notes</h4>
                                    <p className="text-slate-500 font-body max-w-sm mx-auto mt-2 mb-6">Contribute to the collective knowledge of your institution and build your academic reputation.</p>
                                    <button className="bg-primary text-white px-8 py-3 rounded-lg font-headline font-bold text-sm tracking-tight shadow-lg shadow-indigo-100">Start Uploading</button>
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
            <footer className="bg-[#030816] border-t border-indigo-950/20 py-12 px-8 mt-24 text-slate-400">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <p className="font-body text-sm">© 2024 The Academic Curator. Knowledge preserved.</p>
                    <div className="flex gap-4 text-slate-400">
                        <Share2 size={20} className="hover:text-white transition-colors cursor-pointer" />
                        <Globe size={20} className="hover:text-white transition-colors cursor-pointer" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Profile;
