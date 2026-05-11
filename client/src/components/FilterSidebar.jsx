import React from 'react';
import { School, GitBranch, Star } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters }) => {
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleBranchToggle = (branch) => {
        const newBranches = filters.branch.includes(branch)
            ? filters.branch.filter(b => b !== branch)
            : [...filters.branch, branch];
        handleFilterChange('branch', newBranches);
    };

    return (
        <aside className="h-[calc(100vh-64px)] w-72 fixed left-0 top-16 bg-slate-50 overflow-y-auto border-r border-slate-200 pt-6 flex flex-col gap-1 pb-20 custom-scrollbar">
            <div className="px-6 mb-4">
                <h3 className="font-headline font-bold text-indigo-600 tracking-tight text-lg">Filters</h3>
                <p className="font-label text-xs uppercase tracking-wider text-slate-500 mb-6">Refine Results</p>
            </div>

            <div className="px-6 flex flex-col gap-8">
                {/* College */}
                <div className="space-y-3">
                    <label className="font-label text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center justify-between">
                        College
                        <School size={14} />
                    </label>
                    <select 
                        value={filters.college}
                        onChange={(e) => handleFilterChange('college', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg text-sm font-body py-2 px-3 focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="All Colleges">All Colleges</option>
                        <option value="IIT Bombay">IIT Bombay</option>
                        <option value="MIT Manipal">MIT Manipal</option>
                        <option value="DTU Delhi">DTU Delhi</option>
                    </select>
                </div>

                {/* Course (Specialization) */}
                <div className="space-y-3">
                    <label className="font-label text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center justify-between">
                        Specialization
                        <GitBranch size={14} />
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['B.Tech', 'M.Tech', 'B.Arch'].map(course => (
                            <span 
                                key={course}
                                onClick={() => handleFilterChange('course', filters.course === course ? '' : course)}
                                className={`px-3 py-1 rounded-full text-xs font-label cursor-pointer transition-all ${
                                    filters.course === course 
                                    ? 'bg-primary text-white' 
                                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                }`}
                            >
                                {course}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Branch */}
                <div className="space-y-3">
                    <label className="font-label text-xs font-bold uppercase tracking-widest text-slate-500">Branch</label>
                    <div className="space-y-2">
                        {['Computer Science', 'Information Technology', 'Electronics'].map(branch => (
                            <label key={branch} className="flex items-center gap-3 text-sm cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={filters.branch.includes(branch)}
                                    onChange={() => handleBranchToggle(branch)}
                                    className="rounded border-slate-300 text-primary focus:ring-primary/20" 
                                />
                                <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{branch}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Semester */}
                <div className="space-y-3">
                    <label className="font-label text-xs font-bold uppercase tracking-widest text-slate-500">Semester</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="8" 
                        value={filters.semester}
                        onChange={(e) => handleFilterChange('semester', e.target.value)}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" 
                    />
                    <div className="flex justify-between text-[10px] font-label text-slate-400 uppercase">
                        <span>Sem {filters.semester}</span>
                        <span>Sem 8</span>
                    </div>
                </div>

                {/* Year */}
                <div className="space-y-3">
                    <label className="font-label text-xs font-bold uppercase tracking-widest text-slate-500">Academic Year</label>
                    <select 
                        value={filters.year}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg text-sm font-body py-2 px-3 focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="">All Years</option>
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                    </select>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                    <label className="font-label text-xs font-bold uppercase tracking-widest text-slate-500">Minimum Rating</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                                key={star}
                                size={16}
                                onClick={() => handleFilterChange('minRating', star)}
                                className={`cursor-pointer transition-colors ${
                                    star <= filters.minRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                                }`}
                            />
                        ))}
                        <span className="text-xs font-label text-slate-500 ml-2">& Up</span>
                    </div>
                </div>

                <button 
                    onClick={() => setFilters({
                        college: 'All Colleges',
                        course: '',
                        branch: [],
                        semester: 1,
                        minRating: 0
                    })}
                    className="w-full py-2 border border-primary/20 text-primary font-headline font-bold text-xs tracking-widest uppercase hover:bg-primary/5 transition-colors rounded-lg"
                >
                    Clear All
                </button>
            </div>
        </aside>
    );
};

export default FilterSidebar;
