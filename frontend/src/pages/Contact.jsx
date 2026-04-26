import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen pt-24 pb-20 md:pt-40 md:pb-32 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="text-4xl md:text-7xl font-serif text-gold mb-8 tracking-widest uppercase drop-shadow-lg">
          {t('contact') || 'Contact Us'}
        </h1>
        <p className="text-zinc-400 uppercase tracking-[0.4em] text-xs md:text-sm font-light">
          Experience the pinnacle of grooming excellence
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Contact Details Card */}
        <div className="space-y-10 md:space-y-12 bg-zinc-900/40 p-6 md:p-10 lg:p-14 border border-zinc-800/50 backdrop-blur-md rounded-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gold/30 group-hover:bg-gold transition-colors duration-500" />
          
          <h2 className="text-3xl font-serif text-zinc-100 border-b border-white/5 pb-8 tracking-wide">
            Get In Touch
          </h2>
          
          <div className="space-y-8 md:space-y-10">
            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="bg-gold/10 p-3 rounded-full">
                <MapPin className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-3">Location</h3>
                <p className="text-zinc-400 font-light leading-relaxed text-base">
                  123 5th Ave<br />
                  New York, NY 10003<br />
                  USA
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="bg-gold/10 p-3 rounded-full">
                <Phone className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-3">Phone</h3>
                <p className="text-zinc-400 font-light leading-relaxed text-lg tracking-wider">+1 212 555 0198</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 md:space-x-6">
              <div className="bg-gold/10 p-3 rounded-full">
                <Mail className="text-gold" size={24} />
              </div>
              <div>
                <h3 className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold mb-3">Email</h3>
                <p className="text-zinc-400 font-light leading-relaxed text-sm md:text-base break-words">appointments@apex.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours Card */}
        <div className="bg-zinc-900/20 p-6 md:p-10 lg:p-14 border border-zinc-800/30 backdrop-blur-sm rounded-sm flex flex-col justify-center">
          <div className="flex items-center space-x-4 mb-10 border-b border-white/5 pb-8">
            <Clock className="text-gold/60" size={28} />
            <h2 className="text-3xl font-serif text-zinc-100 tracking-wide">
              Opening Hours
            </h2>
          </div>
          
          <ul className="space-y-6">
            <li className="flex justify-between items-center border-b border-white/5 pb-4 group">
              <span className="uppercase tracking-[0.3em] text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">Monday - Friday</span>
              <span className="text-zinc-300 font-serif text-lg tracking-wider">10:00 - 19:00</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-4 group">
              <span className="uppercase tracking-[0.3em] text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">Saturday</span>
              <span className="text-zinc-300 font-serif text-lg tracking-wider">09:00 - 17:00</span>
            </li>
            <li className="flex justify-between items-center pb-4 group">
              <span className="uppercase tracking-[0.3em] text-[10px] text-zinc-700">Sunday</span>
              <span className="text-zinc-600 font-serif text-lg italic">Closed</span>
            </li>
          </ul>

          <div className="mt-12 p-6 bg-gold/5 border border-gold/10 rounded-sm">
            <p className="text-zinc-500 text-[11px] uppercase tracking-[0.2em] leading-relaxed text-center italic">
              "Grooming is the secret of real elegance."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
