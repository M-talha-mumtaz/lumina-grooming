import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Book = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    clientName: '', clientEmail: '', clientPhone: '', selectedServices: [], date: '', timeSlot: '', notes: ''
  });
  
  const [touched, setTouched] = useState({
    clientName: false, clientEmail: false, clientPhone: false, date: false, timeSlot: false
  });

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`);
        const uniqueData = Array.from(new Map(data.map(item => [item.name, item])).values());

        // Ensure exactly 3 services are shown if they exist
        const targetNames = ['Haircut', 'Beard Trim', 'Hair Styling'];
        const strictlyThree = uniqueData.filter(item => targetNames.includes(item.name));
        strictlyThree.sort((a, b) => targetNames.indexOf(a.name) - targetNames.indexOf(b.name));

        const finalServices = strictlyThree.length > 0 ? strictlyThree : uniqueData;
        setServices(finalServices);

        // Pre-select service from URL if present
        const serviceNameFromUrl = searchParams.get('service');
        if (serviceNameFromUrl) {
          const matchedService = finalServices.find(s => s.name === serviceNameFromUrl);
          if (matchedService) {
            setFormData(prev => ({
              ...prev,
              selectedServices: [matchedService._id]
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching services', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const toggleService = (id) => {
    setFormData(prev => {
      const current = prev.selectedServices;
      if (current.includes(id)) {
        return { ...prev, selectedServices: current.filter(s => s !== id) };
      } else {
        return { ...prev, selectedServices: [...current, id] };
      }
    });
  };

  const handleTimeSelect = (time) => {
    setFormData({ ...formData, timeSlot: time });
    setTouched({ ...touched, timeSlot: true });
  };

  const isFormValid = formData.clientName.trim() !== '' && 
                      formData.clientEmail.trim() !== '' && 
                      formData.clientPhone.trim() !== '' && 
                      formData.date !== '' && 
                      formData.timeSlot !== '' && 
                      formData.selectedServices.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setTouched({ clientName: true, clientEmail: true, clientPhone: true, date: true, timeSlot: true });
      return;
    }

    try {
      const names = services.filter(s => formData.selectedServices.includes(s._id)).map(s => s.name);
      
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, { 
        ...formData, 
        services: formData.selectedServices,
        serviceNames: names
      });
      
      showToast('success', 'Your reservation has been sent. We will inform you ASAP regarding your appointment.');
      
      // Clear form perfectly without page reload
      setFormData({ clientName: '', clientEmail: '', clientPhone: '', selectedServices: [], date: '', timeSlot: '', notes: '' });
      setTouched({ clientName: false, clientEmail: false, clientPhone: false, date: false, timeSlot: false });
      
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'That time slot may be unavailable or there was a server error. Please try again.';
      showToast('error', errorMsg);
    }
  };

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const totalInvestment = services
    .filter(s => formData.selectedServices.includes(s._id))
    .reduce((sum, service) => sum + service.price, 0);

  const renderError = (field, message) => {
    if (touched[field] && !formData[field]) {
      return <span className="absolute -bottom-5 left-0 text-red-500/90 text-xs font-semibold tracking-wider font-sans uppercase">{message}</span>;
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 max-w-5xl mx-auto relative">
      <div className="text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-serif text-gold mb-6 glow-text">{t('book_appointment')}</h1>
        <p className="text-neutral-400 font-light tracking-[0.2em] uppercase text-sm">Reserve your time for an elevated experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-20">
        
        {/* Service Selection */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-neutral-800 pb-4">
            <span className="text-gold font-serif text-3xl">01.</span>
            <div className="flex flex-col">
              <h2 className="text-3xl font-serif text-neutral-200 tracking-wide font-light">Signature Services</h2>
              <span className="text-neutral-500 text-xs uppercase tracking-widest mt-1">Select one or more</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="animate-spin text-gold" size={32} />
              <span className="text-neutral-600 uppercase tracking-widest text-[9px]">Gathering Services...</span>
            </div>
          ) : services.length === 0 ? (
            <div className="py-12 text-center text-neutral-600 text-xs uppercase tracking-[0.2em] font-light italic">
              Collections are currently unavailable for online booking.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map(s => {
                const isSelected = formData.selectedServices.includes(s._id);
                return (
                  <div
                    key={s._id}
                    onClick={() => toggleService(s._id)}
                    className={`cursor-pointer p-8 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group min-h-[140px] flex flex-col justify-center border ${isSelected
                        ? 'border-gold bg-gold/10 shadow-[0_0_15px_rgba(235,208,116,0.15)] scale-[1.02]'
                        : 'border-neutral-800/80 bg-neutral-900/40 hover:border-gold/40 hover:bg-neutral-800/60'
                      }`}
                  >
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-3 border-b border-transparent">
                        <h4 className={`text-xl font-serif transition-colors ${isSelected ? 'text-gold' : 'text-neutral-300 group-hover:text-gold/90'}`}>{s.name}</h4>
                        {isSelected && <Check className="text-gold mt-1" size={18} strokeWidth={3} />}
                      </div>
                      <div className="flex justify-between items-end mt-auto">
                        <span className={`text-xs tracking-[0.2em] uppercase ${isSelected ? 'text-gold/80' : 'text-neutral-500'}`}>{s.duration} MIN</span>
                        <span className={`font-serif text-lg ${isSelected ? 'text-gold glow-text' : 'text-neutral-400'}`}>€{s.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Dynamic Price Display */}
          <div className="h-16 flex items-center justify-end px-2 mt-4">
            {formData.selectedServices.length > 0 ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                <span className="text-neutral-400 font-light tracking-[0.2em] text-xs uppercase">Total Investment</span>
                <span className="text-5xl font-serif text-gold glow-text font-light">€{totalInvestment}</span>
              </motion.div>
            ) : (
              <span className="text-red-500/80 font-semibold tracking-widest text-xs uppercase">Please select at least one service *</span>
            )}
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-neutral-800 pb-4">
            <span className="text-gold font-serif text-3xl">02.</span>
            <h2 className="text-3xl font-serif text-neutral-200 tracking-wide font-light">Date & Time</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative">
              <label className="block text-neutral-400 text-xs tracking-[0.2em] mb-5 uppercase">Select Date <span className="text-red-500">*</span></label>
              <input
                required
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={() => handleBlur('date')}
                className={`w-full bg-neutral-900/50 border text-neutral-200 px-6 py-4 focus:outline-none transition-colors font-light tracking-wide appearance-none [color-scheme:dark] ${touched.date && !formData.date ? 'border-red-500/50 focus:border-red-500' : 'border-neutral-800 focus:border-gold/50'}`}
              />
              {renderError('date', 'Date is required')}
            </div>
            <div className="relative">
              <label className="block text-neutral-400 text-xs tracking-[0.2em] mb-5 uppercase">Select Time <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-4 gap-3">
                {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                  <div
                    key={t}
                    onClick={() => handleTimeSelect(t)}
                    className={`cursor-pointer py-4 text-center transition-all duration-300 border text-sm tracking-widest ${formData.timeSlot === t
                        ? 'border-gold bg-gold text-neutral-950 font-semibold shadow-gold-glow'
                        : 'border-neutral-800 bg-neutral-900/30 text-neutral-400 hover:border-gold/30 hover:text-gold'
                      }`}
                  >
                    {t}
                  </div>
                ))}
              </div>
              {renderError('timeSlot', 'Time is required')}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-neutral-800 pb-4">
            <span className="text-gold font-serif text-3xl">03.</span>
            <h2 className="text-3xl font-serif text-neutral-200 tracking-wide font-light">Your Details</h2>
          </div>
          <div className="bg-neutral-900/30 border border-neutral-800/50 p-8 md:p-12 space-y-12 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="relative">
                <label className="block text-neutral-500 text-xs tracking-[0.2em] mb-2 uppercase">Full Name <span className="text-red-500">*</span></label>
                <input required name="clientName" value={formData.clientName} onChange={handleChange} onBlur={() => handleBlur('clientName')} className={`w-full bg-transparent border-b text-neutral-200 px-2 py-4 focus:outline-none transition-colors font-light tracking-wide ${touched.clientName && !formData.clientName ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-gold'}`} placeholder="John Doe" />
                {renderError('clientName', 'Name is required')}
              </div>
              <div className="relative">
                <label className="block text-neutral-500 text-xs tracking-[0.2em] mb-2 uppercase">Email <span className="text-red-500">*</span></label>
                <input required type="email" name="clientEmail" value={formData.clientEmail} onChange={handleChange} onBlur={() => handleBlur('clientEmail')} className={`w-full bg-transparent border-b text-neutral-200 px-2 py-4 focus:outline-none transition-colors font-light tracking-wide ${touched.clientEmail && !formData.clientEmail ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-gold'}`} placeholder="john@example.com" />
                {renderError('clientEmail', 'Valid email is required')}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="relative">
                <label className="block text-neutral-500 text-xs tracking-[0.2em] mb-2 uppercase">Phone <span className="text-red-500">*</span></label>
                <input required type="tel" name="clientPhone" value={formData.clientPhone} onChange={handleChange} onBlur={() => handleBlur('clientPhone')} className={`w-full bg-transparent border-b text-neutral-200 px-2 py-4 focus:outline-none transition-colors font-light tracking-wide ${touched.clientPhone && !formData.clientPhone ? 'border-red-500 focus:border-red-500' : 'border-neutral-800 focus:border-gold'}`} placeholder="+358 40 123 4567" />
                {renderError('clientPhone', 'Phone number is required')}
              </div>
              <div className="relative">
                <label className="block text-neutral-500 text-xs tracking-[0.2em] mb-2 uppercase">Notes (Optional)</label>
                <input name="notes" value={formData.notes} onChange={handleChange} className="w-full bg-transparent border-b border-neutral-800 text-neutral-200 px-2 py-4 focus:outline-none focus:border-gold transition-colors font-light tracking-wide" placeholder="Specific requests..." />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 text-center">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-16 py-6 transition-all duration-500 uppercase tracking-[0.2em] text-sm font-bold border ${isFormValid
                ? 'bg-gold text-neutral-950 border-gold hover:bg-[#ebd074] hover:shadow-gold-glow-lg'
                : 'bg-transparent text-neutral-600 border-neutral-800 cursor-not-allowed opacity-60'
              }`}
          >
            Confirm Reservation
          </button>
        </div>
      </form>

      {/* Luxury Minimal Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-10 right-10 z-50 p-6 shadow-2xl flex items-start space-x-4 max-w-sm border backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-zinc-950/90 border-gold/40 shadow-[0_10px_40px_rgba(235,208,116,0.15)]' 
                : 'bg-zinc-950/90 border-red-500/40 shadow-[0_10px_40px_rgba(239,68,68,0.15)]'
            }`}
          >
            <div className="mt-1">
              {toast.type === 'success' ? (
                <Check className="text-gold" size={24} strokeWidth={2.5} />
              ) : (
                <X className="text-red-500" size={24} strokeWidth={2.5} />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`text-lg font-serif mb-1 ${toast.type === 'success' ? 'text-gold' : 'text-red-500'}`}>
                {toast.type === 'success' ? 'Success' : 'Notice'}
              </h4>
              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                {toast.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default Book;
