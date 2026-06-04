import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import FilterSidebar from '../components/FilterSidebar';
import { Search as SearchIcon, Download, Star, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import axios from 'axios';

const Search = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('Advanced Calculus');
    const [sort, setSort] = useState('downloads');
    const [filters, setFilters] = useState({
        college: 'All Colleges',
        course: '',
        branch: [],
        semester: 3,
        year: '',
        minRating: 4
    });

    const fetchNotes = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (filters.college !== 'All Colleges') params.append('college', filters.college);
            if (filters.course) params.append('course', filters.course);
            if (filters.branch.length > 0) params.append('branch', filters.branch.join(','));
            if (filters.semester) params.append('semester', filters.semester);
            if (filters.year) params.append('year', filters.year);
            if (filters.minRating) params.append('minRating', filters.minRating);
            if (sort) params.append('sort', sort);

            const response = await axios.get(`/api/notes?${params.toString()}`);
            setNotes(response.data);
        } catch (err) {
            console.error('Error fetching notes:', err);
            // Fallback mock data
            setNotes([
                {
                    id: 1,
                    title: "OOPS",
                    description: "College students notes on Object Oriented Programming Systems covering inheritance, polymorphism, and encapsulation.",
                    subject: "MISC",
                    fileType: "PDF",
                    author: "Deepika Mishra",
                    college: "IIT Bombay",
                    branch: "CS",
                    rating: 3.8,
                    downloadCount: 3,
                    viewCount: 1,
                    thumbnail: ""
                },
                {
                    id: 2,
                    title: "computer science",
                    description: "Introductory computer science concepts and foundational algorithms cheat sheet.",
                    subject: "MISC",
                    fileType: "PDF",
                    author: "Deepika Mishra",
                    college: "IIT Bombay",
                    branch: "DBMS",
                    rating: 4.5,
                    downloadCount: 1,
                    viewCount: 3,
                    thumbnail: ""
                },
                {
                    id: 3,
                    title: "demo",
                    description: "Quick reference card and sample note template.",
                    subject: "DEMO",
                    fileType: "PDF",
                    author: "Deepika Mishra",
                    college: "IIT Bombay",
                    branch: "DEMO",
                    rating: 4.0,
                    downloadCount: 0,
                    viewCount: 1,
                    thumbnail: ""
                }
            ]);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, filters, sort]);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const removeFilter = (key, value) => {
        if (key === 'branch') {
            setFilters(prev => ({ ...prev, branch: prev.branch.filter(b => b !== value) }));
        } else {
            setFilters(prev => ({ ...prev, [key]: key === 'semester' ? 1 : key === 'minRating' ? 0 : '' }));
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
            fetchNotes(); // Refresh to show updated download count
        } catch (err) {
            console.error('Download error:', err);
            alert('Failed to start download. Please try again.');
        }
    };

    const handleView = async (noteId, fileUrl) => {
        try {
            await axios.patch(`/api/notes/${noteId}/view`);
            window.open(fileUrl, '_blank');
            fetchNotes(); // Refresh to show updated view count
        } catch (err) {
            console.error('View error:', err);
            window.open(fileUrl, '_blank');
        }
    };

    return (
        <div className="bg-background text-white font-body min-h-screen">
            <Navbar />
            
            <div className="flex pt-16">
                <FilterSidebar filters={filters} setFilters={setFilters} />
                
                <main className="ml-72 flex-1 p-8 pb-24">
                    <div className="max-w-6xl mx-auto mb-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div>
                                <h1 className="font-headline text-5xl font-black text-white tracking-tighter mb-2">{searchQuery || 'All Resources'}</h1>
                                <p className="font-body text-slate-400">
                                    Found <span className="text-primary font-bold">{notes.length} resources</span> matching your academic criteria.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4 bg-white p-1.5 rounded-full border border-slate-200 text-slate-800 shadow-sm">
                                <span className="text-xs font-label uppercase tracking-wider text-slate-400 px-3 border-r border-slate-200">SORT BY</span>
                                <div className="flex gap-1">
                                    {['downloads', 'rating', 'newest'].map(type => (
                                        <button 
                                            key={type}
                                            onClick={() => setSort(type)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold font-headline transition-all ${
                                                sort === type 
                                                ? 'bg-primary text-white shadow-sm' 
                                                : 'hover:bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1).replace('downloads', 'Downloads').replace('rating', 'Rating')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        <div className="flex flex-wrap gap-2 mb-10">
                            {filters.branch.map(b => (
                                <div key={b} className="flex items-center gap-2 bg-[#120f3a] text-indigo-300 px-3 py-1.5 rounded-full text-xs font-label font-bold border border-indigo-500/30">
                                    {b} <X size={14} className="cursor-pointer" onClick={() => removeFilter('branch', b)} />
                                </div>
                            ))}
                            {filters.semester > 1 && (
                                <div className="flex items-center gap-2 bg-[#120f3a] text-indigo-300 px-3 py-1.5 rounded-full text-xs font-label font-bold border border-indigo-500/30">
                                    Semester {filters.semester} <X size={14} className="cursor-pointer" onClick={() => removeFilter('semester')} />
                                </div>
                            )}
                            {filters.minRating > 0 && (
                                <div className="flex items-center gap-2 bg-[#120f3a] text-indigo-300 px-3 py-1.5 rounded-full text-xs font-label font-bold border border-indigo-500/30">
                                    {filters.minRating}.0+ Rating <X size={14} className="cursor-pointer" onClick={() => removeFilter('minRating')} />
                                </div>
                            )}
                        </div>

                        {/* Results Grid */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                                {notes.length > 0 ? notes.map(note => (
                                    <div key={note._id || note.id} className="bg-white rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-300 flex flex-col border border-slate-100 text-slate-800">
                                        <div className="h-48 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                            {note.thumbnail && !note.thumbnail.includes('example.com') && !note.thumbnail.includes('googleusercontent.com') ? (
                                                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={note.thumbnail} alt={note.title} />
                                            ) : (
                                                /* Folded page PDF icon graphic */
                                                <div className="w-20 h-28 bg-white rounded-lg shadow-sm border border-slate-200 relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                    <div className="absolute top-0 right-0 w-5 h-5 bg-slate-100 border-l border-b border-slate-200 rounded-bl-lg"></div>
                                                    <div className="w-16 h-8 bg-red-500 text-white font-headline font-black text-xs text-center flex items-center justify-center rounded">
                                                        PDF
                                                    </div>
                                                </div>
                                            )}
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded text-[10px] font-label font-bold tracking-widest uppercase">Verified Note</span>
                                            </div>
                                            <button 
                                                onClick={() => handleDownload(note._id || note.id, note.title)}
                                                className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md hover:bg-black/70 text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                <Download size={14} />
                                                <span className="text-xs font-label">{note.downloadCount || 0}</span>
                                            </button>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <p className="text-[10px] font-label font-bold uppercase tracking-widest text-slate-400 mb-2">{(note.branch || 'CS') + ' • ' + (note.subject || 'MISC')}</p>
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-headline font-bold text-lg leading-tight group-hover:text-primary transition-colors text-slate-900">{note.title}</h3>
                                                <span className="bg-slate-100 text-slate-600 text-[10px] font-label px-2 py-0.5 rounded-full uppercase">{note.fileType}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-body">{note.description}</p>
                                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700">
                                                        {note.author ? note.author.split(' ').map(n => n[0]).join('') : 'U'}
                                                    </div>
                                                    <div>
                                                        <span className="block text-xs font-label font-bold text-slate-700 leading-none mb-1">{note.author}</span>
                                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                                            <Star size={10} className="text-amber-500 fill-amber-500" />
                                                            <span>{note.rating}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleView(note._id || note.id, note.fileUrl)}
                                                    className="flex items-center gap-2 text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-lg transition-all text-xs font-bold border border-primary/10"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full text-center py-20 text-slate-500 bg-white rounded-xl border border-slate-100 shadow-sm">
                                        No resources found matching your criteria.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-20 flex justify-center">
                            <div className="flex items-center gap-1 bg-white p-2 rounded-full shadow-sm border border-slate-200 text-slate-800">
                                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">
                                    <ChevronLeft size={20} />
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">1</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">2</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">3</button>
                                <span className="w-10 h-10 flex items-center justify-center text-slate-400">...</span>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">12</button>
                                <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-600">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Search;
