import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';
import axios from 'axios';

const UploadNoteModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subject: '',
        college: '',
        course: '',
        branch: '',
        semester: 1,
        year: '1st',
        fileType: 'PDF'
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Only PDF files are allowed');
                return;
            }
            if (selectedFile.size > 20 * 1024 * 1024) {
                setError('File size exceeds 20MB limit');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'semester' ? parseInt(value) : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!file) {
            setError('Please select a PDF file to upload');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            const data = new FormData();
            // Append metadata
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            // Append file
            data.append('file', file);
            // Append author info
            data.append('author', user?.name || 'Anonymous');
            data.append('authorAvatar', user?.avatar || '');

            const response = await axios.post('/api/notes', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Note uploaded:', response.data);
            onUploadSuccess(response.data);
            onClose();
        } catch (err) {
            console.error('Upload error detail:', err);
            const serverMessage = err.response?.data?.message;
            setError(serverMessage || 'Failed to connect to server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="font-headline text-2xl font-black text-on-surface tracking-tight">Curate New Knowledge</h2>
                        <p className="text-xs font-label uppercase tracking-widest text-slate-400 mt-1">Note Repository Submission</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Title & Subject */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Note Title</label>
                            <input 
                                name="title"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-body text-on-surface"
                                placeholder="e.g., Quantum Mechanics II - Lecture Notes Week 4"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="md:col-span-2 space-y-3">
                            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Description</label>
                            <textarea 
                                name="description"
                                required
                                rows="3"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-body text-on-surface resize-none"
                                placeholder="Briefly describe the contents of these notes..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Subject</label>
                            <input 
                                name="subject"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-body text-on-surface"
                                placeholder="e.g., Physics"
                                value={formData.subject}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">College / University</label>
                            <input 
                                name="college"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-body text-on-surface"
                                placeholder="e.g., MIT Manipal"
                                value={formData.college}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Course</label>
                            <input 
                                name="course"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-body text-on-surface"
                                placeholder="e.g., B.Tech"
                                value={formData.course}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Branch</label>
                            <input 
                                name="branch"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none font-body text-on-surface"
                                placeholder="e.g., CSE"
                                value={formData.branch}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Semester</label>
                            <select 
                                name="semester"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none appearance-none cursor-pointer font-body text-on-surface"
                                value={formData.semester}
                                onChange={handleChange}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                                    <option key={s} value={s}>Semester {s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="block font-label text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Academic Year</label>
                            <select 
                                name="year"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all outline-none appearance-none cursor-pointer font-body text-on-surface"
                                value={formData.year}
                                onChange={handleChange}
                            >
                                {['1st', '2nd', '3rd', '4th'].map(y => (
                                    <option key={y} value={y}>{y} Year</option>
                                ))}
                            </select>
                        </div>

                        {/* File Upload */}
                        <div 
                            onClick={() => document.getElementById('fileInput').click()}
                            className="md:col-span-2 p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group hover:border-primary/40 transition-all cursor-pointer"
                        >
                            <input 
                                id="fileInput"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                <Upload size={24} />
                            </div>
                            <p className="font-headline font-bold text-on-surface text-center">
                                {file ? file.name : 'Drag and drop your PDF here'}
                            </p>
                            <p className="text-xs font-label text-slate-400 mt-1">
                                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Maximum file size 20MB'}
                            </p>
                            
                            {file ? (
                                <div className="mt-4 flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                                    <CheckCircle size={14} /> File ready for upload
                                </div>
                            ) : (
                                <div className="mt-4 flex items-center gap-2 bg-slate-100 text-slate-400 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-slate-200">
                                    <FileText size={14} /> Click to select PDF
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-5 rounded-2xl font-headline font-bold text-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <FileText size={24} /> Publish Notes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadNoteModal;
