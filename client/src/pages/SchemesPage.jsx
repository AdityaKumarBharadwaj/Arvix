import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { schemeService } from '../../services/api';
import SchemeDetailModal from '../components/schemes/SchemeDetailModal';
import {
  Search,
  BookOpen,
  CheckCircle,
  FileText,
  Building,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Housing',
  'Healthcare',
  'Education',
  'Food & Ration',
  'Women & Child',
  'Senior Citizens',
  'Agriculture & Livelihood'
];

const SchemesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const res = await schemeService.getAll();
        if (res.success && res.schemes) {
          setSchemes(res.schemes);
          setFilteredSchemes(res.schemes);

          // Check if ID is in search params
          const schemeId = searchParams.get('id');
          if (schemeId) {
            const found = res.schemes.find(
              (s) => s._id === schemeId || s.slug === schemeId
            );
            if (found) setSelectedScheme(found);
          }
        }
      } catch (err) {
        console.error('Error loading schemes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, [searchParams]);

  useEffect(() => {
    let result = [...schemes];
    if (activeCategory !== 'All') {
      result = result.filter(
        (s) => s.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q)
      );
    }
    setFilteredSchemes(result);
  }, [activeCategory, searchTerm, schemes]);

  return (
    <div className="py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Public Welfare & Social Security Desk
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-0.5">
                Central & State Government Schemes Directory
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Complete explanations, eligibility criteria checklists, required documents, and step-by-step application procedures for Ward No. 14 residents.
              </p>
            </div>

            {/* Live Search Input */}
            <div className="w-full md:w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search scheme name, keyword..."
                className="civic-input pl-9 text-xs"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pt-5 pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg p-6 h-64 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-16 bg-slate-100 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredSchemes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-3">
            <Layers className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-900 text-sm">No schemes match your filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching for different keywords or select "All" to view all available welfare schemes.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchTerm('');
              }}
              className="civic-btn-secondary text-xs px-3 py-1.5 mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme._id || scheme.slug}
                className="civic-card p-5 flex flex-col justify-between group hover:border-slate-400"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                      {scheme.category}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {scheme.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-950 text-base leading-snug group-hover:text-slate-900 font-sans">
                    {scheme.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {scheme.shortDescription}
                  </p>

                  <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 space-y-1">
                    <div>
                      <strong className="text-slate-700">Department:</strong> {scheme.department}
                    </div>
                    {scheme.benefits && scheme.benefits.length > 0 && (
                      <div className="text-emerald-700 font-medium truncate">
                        ✓ {scheme.benefits[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedScheme(scheme)}
                    className="w-full civic-btn-primary text-xs py-2 justify-between"
                  >
                    <span>View Explanation & How to Apply</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complete Scheme Modal */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          onClose={() => setSelectedScheme(null)}
        />
      )}
    </div>
  );
};

export default SchemesPage;
