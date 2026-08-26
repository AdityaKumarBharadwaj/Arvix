import React, { useState } from 'react';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Wrench,
  Droplet,
  School,
  Zap,
  Trash2,
  FileText
} from 'lucide-react';
import { complaintService } from '../../services/api';

const CATEGORIES = [
  { id: 'Road', name: 'Roads & Potholes', icon: Wrench, desc: 'Craters, broken asphalt, damaged pavement' },
  { id: 'Water', name: 'Water Supply', icon: Droplet, desc: 'Contamination, pipeline leakage, no water' },
  { id: 'Government School', name: 'Govt Schools', icon: School, desc: 'Classrooms, drinking water, meals, fans' },
  { id: 'Electricity', name: 'Streetlights', icon: Zap, desc: 'Dark poles, flickering lights, exposed wire' },
  { id: 'Sanitation', name: 'Sanitation & Waste', icon: Trash2, desc: 'Garbage pileup, blocked drains, fumigation' },
];

const ComplaintForm = ({ onComplaintCreated }) => {
  const [formData, setFormData] = useState({
    citizenName: '',
    citizenPhone: '',
    citizenEmail: '',
    category: 'Road',
    title: '',
    description: '',
    landmark: '',
    priority: 'Routine',
    wardNumber: 14
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 4) {
      setErrorMessage('Maximum 4 photographs allowed per grievance.');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      selectedFiles.forEach((file) => {
        data.append('photos', file);
      });

      const res = await complaintService.lodgeComplaint(data);
      if (res.success) {
        setSuccessData(res);
        if (onComplaintCreated) onComplaintCreated(res.trackingId);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (successData) {
    return (
      <div className="bg-white border border-emerald-200 rounded-lg p-6 sm:p-8 text-center space-y-5 shadow-xs">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 font-sans">
            Grievance Registered Successfully
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your grievance has been officially registered and forwarded to the Ward Public Works & Representative Office.
          </p>
        </div>

        {/* Tracking ID Badge */}
        <div className="max-w-md mx-auto bg-slate-50 border border-slate-300 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
              Permanent Tracking ID
            </span>
            <div className="font-mono text-lg font-extrabold text-slate-950 tracking-wide">
              {successData.trackingId}
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(successData.trackingId)}
            className="civic-btn-secondary text-xs px-3 py-1.5 font-medium shrink-0"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Copied!' : 'Copy ID'}</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 max-w-md mx-auto">
          Please save this reference number. You will receive an SMS status update once the engineer inspects the location.
        </div>

        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              setSuccessData(null);
              setFormData({
                citizenName: '',
                citizenPhone: '',
                citizenEmail: '',
                category: 'Road',
                title: '',
                description: '',
                landmark: '',
                priority: 'Routine',
                wardNumber: 14
              });
              setSelectedFiles([]);
              setFilePreviews([]);
            }}
            className="civic-btn-secondary text-xs px-4 py-2"
          >
            Lodge Another Complaint
          </button>

          <a
            href={`/complaints/track?id=${successData.trackingId}`}
            className="civic-btn-primary text-xs px-4 py-2"
          >
            Track Status Timeline
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-bold text-slate-900 font-sans">
          Lodge Civic Complaint (Ward No. 14)
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit issues regarding road potholes, drinking water supply, government school conditions, or streetlights.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Category Selection Pills */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          1. Select Problem Category <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = formData.category === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => setFormData((prev) => ({ ...prev, category: cat.id }))}
                className={`p-3 rounded-md border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-slate-950 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-400 text-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                <div>
                  <div className="text-xs font-bold">{cat.name}</div>
                  <div className={`text-[10px] mt-0.5 leading-tight ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {cat.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Citizen Contact Details */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          2. Citizen Details <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Your Full Name</label>
            <input
              type="text"
              name="citizenName"
              value={formData.citizenName}
              onChange={handleInputChange}
              required
              placeholder="e.g. Ramesh Kumar"
              className="civic-input"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Mobile Phone (For SMS Tracking)</label>
            <input
              type="tel"
              name="citizenPhone"
              value={formData.citizenPhone}
              onChange={handleInputChange}
              required
              placeholder="10-digit mobile number"
              className="civic-input font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Email Address (Optional)</label>
            <input
              type="email"
              name="citizenEmail"
              value={formData.citizenEmail}
              onChange={handleInputChange}
              placeholder="e.g. name@example.com"
              className="civic-input"
            />
          </div>
        </div>
      </div>

      {/* 3. Grievance Specifics */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          3. Grievance Description & Location <span className="text-rose-500">*</span>
        </label>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Complaint Subject / Short Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="e.g. Severe water pipeline crack causing mud in drinking water"
              className="civic-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Specific Landmark / Street / House No. in Ward 14
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                required
                placeholder="e.g. Opposite Shiv Mandir, Gali No. 3, Sector 2"
                className="civic-input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Urgency Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="civic-input"
              >
                <option value="Routine">Routine (Regular maintenance)</option>
                <option value="High">High (Affecting multiple families)</option>
                <option value="Urgent">Urgent (Immediate health / safety hazard)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Detailed Description of the Issue
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe the issue in detail, how many days it has persisted, and how it is affecting the residents..."
              className="civic-input"
            ></textarea>
          </div>
        </div>
      </div>

      {/* 4. Photo Upload */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          4. Attach Site Photographs (Optional, up to 4 images)
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:bg-slate-50 transition-colors">
          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
          <p className="text-xs text-slate-600 font-medium">
            Drag and drop site photos here, or <label className="text-slate-900 font-bold underline cursor-pointer">browse<input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" /></label>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 5MB each</p>
        </div>

        {filePreviews.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {filePreviews.map((src, index) => (
              <div key={index} className="relative group rounded-md overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img src={src} alt="Site preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-slate-500">
          By submitting, you certify that the information provided is accurate and pertains to Ward No. 14 jurisdiction.
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="civic-btn-primary w-full sm:w-auto px-6 py-2.5 font-semibold text-xs"
        >
          {submitting ? 'Registering Grievance...' : 'Submit Grievance to Ward Office'}
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;
