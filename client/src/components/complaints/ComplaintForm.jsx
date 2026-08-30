import React, { useState } from 'react';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Wrench,
  Droplet,
  School,
  Zap,
  Trash2
} from 'lucide-react';
import { complaintService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const ComplaintForm = ({ onComplaintCreated }) => {
  const { language, t } = useLanguage();

  const CATEGORIES = [
    {
      id: 'Road',
      name: language === 'hi' ? 'सड़क एवं गड्ढे' : 'Roads & Potholes',
      icon: Wrench,
      desc: language === 'hi' ? 'टूटी सड़क, गड्ढे, डामर उखड़ना' : 'Craters, broken asphalt, damaged pavement'
    },
    {
      id: 'Water',
      name: language === 'hi' ? 'पेयजल आपूर्ति' : 'Water Supply',
      icon: Droplet,
      desc: language === 'hi' ? 'गंदा पानी, पाइपलाइन लीकेज, लो प्रेशर' : 'Contamination, pipeline leakage, no water'
    },
    {
      id: 'Government School',
      name: language === 'hi' ? 'सरकारी स्कूल' : 'Govt Schools',
      icon: School,
      desc: language === 'hi' ? 'कक्षाएं, पीने का पानी, पंखे, मिड-डे मील' : 'Classrooms, drinking water, meals, fans'
    },
    {
      id: 'Electricity',
      name: language === 'hi' ? 'स्ट्रीट लाइट' : 'Streetlights',
      icon: Zap,
      desc: language === 'hi' ? 'अंधेरे खंभे, जलती-बुझती लाइट, ढीले तार' : 'Dark poles, flickering lights, exposed wire'
    },
    {
      id: 'Sanitation',
      name: language === 'hi' ? 'सफाई व नाली' : 'Sanitation & Waste',
      icon: Trash2,
      desc: language === 'hi' ? 'कचरे का ढेर, बंद नाली, फॉगिंग छिड़काव' : 'Garbage pileup, blocked drains, fumigation'
    },
  ];

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
      setErrorMessage(language === 'hi' ? 'अधिकतम 4 फोटो संलग्न करने की अनुमति है।' : 'Maximum 4 photographs allowed per grievance.');
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
      setErrorMessage(err.message || 'Failed to submit grievance.');
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
            {language === 'hi' ? 'शिकायत सफलतापूर्वक दर्ज हो गई है' : 'Grievance Registered Successfully'}
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {language === 'hi'
              ? 'आपकी शिकायत आधिकारिक रूप से वार्ड पार्षद एवं संबंधित नगर निगम विभाग को प्रेषित कर दी गई है।'
              : 'Your grievance has been officially registered and forwarded to the Ward Public Works & Representative Office.'}
          </p>
        </div>

        {/* Tracking ID Badge */}
        <div className="max-w-md mx-auto bg-slate-50 border border-slate-300 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">
              {language === 'hi' ? 'स्थाई ट्रैकिंग संदर्भ क्रमांक (ID)' : 'Permanent Tracking ID'}
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
            <span>{copied ? (language === 'hi' ? 'कॉपी हुआ!' : 'Copied!') : (language === 'hi' ? 'आईडी कॉपी करें' : 'Copy ID')}</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 max-w-md mx-auto">
          {language === 'hi'
            ? 'कृपया यह संदर्भ क्रमांक सुरक्षित रखें। इंजीनियर द्वारा निरीक्षण के पश्चात आपको एसएमएस द्वारा सूचित किया जाएगा।'
            : 'Please save this reference number. You will receive an SMS status update once the engineer inspects the location.'}
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
            {language === 'hi' ? 'अन्य शिकायत दर्ज करें' : 'Lodge Another Complaint'}
          </button>

          <a
            href={`/complaints/track?id=${successData.trackingId}`}
            className="civic-btn-primary text-xs px-4 py-2"
          >
            {language === 'hi' ? 'लाइव प्रगति स्थिति देखें' : 'Track Status Timeline'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-bold text-slate-900 font-sans">
          {language === 'hi' ? 'वार्ड नागरिक समस्या पंजीकरण (वार्ड संख्या 14)' : 'Lodge Civic Complaint (Ward No. 14)'}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {language === 'hi'
            ? 'सड़क के गड्ढे, पेयजल समस्या, सरकारी स्कूल की स्थिति, या स्ट्रीट लाइट की शिकायत दर्ज करें।'
            : 'Submit issues regarding road potholes, drinking water supply, government school conditions, or streetlights.'}
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
          1. {language === 'hi' ? 'समस्या का प्रकार चुनें' : 'Select Problem Category'} <span className="text-rose-500">*</span>
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
          2. {language === 'hi' ? 'नागरिक का विवरण' : 'Citizen Details'} <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              {language === 'hi' ? 'आपका पूरा नाम *' : 'Your Full Name *'}
            </label>
            <input
              type="text"
              name="citizenName"
              value={formData.citizenName}
              onChange={handleInputChange}
              required
              placeholder={language === 'hi' ? 'उदा. रमेश कुमार' : 'e.g. Ramesh Kumar'}
              className="civic-input"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              {language === 'hi' ? 'मोबाइल नंबर (SMS अपडेट हेतु) *' : 'Mobile Phone (For SMS Tracking) *'}
            </label>
            <input
              type="tel"
              name="citizenPhone"
              value={formData.citizenPhone}
              onChange={handleInputChange}
              required
              placeholder={language === 'hi' ? '10 अंकों का मोबाइल नंबर' : '10-digit mobile number'}
              className="civic-input font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              {language === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email Address (Optional)'}
            </label>
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
          3. {language === 'hi' ? 'समस्या का विवरण एवं स्थान' : 'Grievance Description & Location'} <span className="text-rose-500">*</span>
        </label>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              {language === 'hi' ? 'शिकायत का विषय / मुख्य शीर्षक *' : 'Complaint Subject / Short Title *'}
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder={language === 'hi' ? 'उदा. मुख्य गली में पाइपलाइन फटने से गंदे पानी की समस्या' : 'e.g. Severe water pipeline crack causing mud in drinking water'}
              className="civic-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                {language === 'hi' ? 'सटीक स्थान / गली / मकान नं. (वार्ड 14 में) *' : 'Specific Landmark / Street / House No. in Ward 14 *'}
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                required
                placeholder={language === 'hi' ? 'उदा. शिव मंदिर के सामने, गली नं. 3, सेक्टर 2' : 'e.g. Opposite Shiv Mandir, Gali No. 3, Sector 2'}
                className="civic-input"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                {language === 'hi' ? 'प्राथमिकता' : 'Urgency Level'}
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="civic-input"
              >
                <option value="Routine">{language === 'hi' ? 'सामान्य (नियमित रखरखाव)' : 'Routine (Regular maintenance)'}</option>
                <option value="High">{language === 'hi' ? 'उच्च (कई परिवारों को प्रभावित)' : 'High (Affecting multiple families)'}</option>
                <option value="Urgent">{language === 'hi' ? 'अति आवश्यक (आपातकालीन)' : 'Urgent (Immediate health / safety hazard)'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              {language === 'hi' ? 'समस्या का विस्तृत विवरण *' : 'Detailed Description of the Issue *'}
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder={language === 'hi' ? 'समस्या कितने दिनों से है, इससे क्या परेशानी हो रही है विस्तार से लिखें...' : 'Describe the issue in detail, how many days it has persisted, and how it is affecting the residents...'}
              className="civic-input"
            ></textarea>
          </div>
        </div>
      </div>

      {/* 4. Photo Upload */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
          4. {language === 'hi' ? 'घटनास्थल की फोटो संलग्न करें (वैकल्पिक, अधिकतम 4)' : 'Attach Site Photographs (Optional, up to 4 images)'}
        </label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-5 text-center hover:bg-slate-50 transition-colors">
          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
          <p className="text-xs text-slate-600 font-medium">
            {language === 'hi' ? 'फोटो यहाँ खींचें या ' : 'Drag and drop site photos here, or '}
            <label className="text-slate-900 font-bold underline cursor-pointer">
              {language === 'hi' ? 'फाइल चुनें' : 'browse'}
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'hi' ? 'JPG, PNG, WEBP (अधिकतम 5MB)' : 'Supports JPG, PNG, WEBP up to 5MB each'}
          </p>
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
          {language === 'hi'
            ? 'सबमिट करके, आप प्रमाणित करते हैं कि दी गई जानकारी सत्य है और वार्ड संख्या 14 से संबंधित है।'
            : 'By submitting, you certify that the information provided is accurate and pertains to Ward No. 14 jurisdiction.'}
        </p>

        <button
          type="submit"
          disabled={submitting}
          className="civic-btn-primary w-full sm:w-auto px-6 py-2.5 font-semibold text-xs"
        >
          {submitting
            ? (language === 'hi' ? 'शिकायत पंजीकृत हो रही है...' : 'Registering Grievance...')
            : (language === 'hi' ? 'वार्ड कार्यालय में शिकायत दर्ज करें' : 'Submit Grievance to Ward Office')}
        </button>
      </div>
    </form>
  );
};

export default ComplaintForm;
