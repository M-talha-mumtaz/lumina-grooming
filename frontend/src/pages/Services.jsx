import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Guaranteed luxury men's grooming photography from Pexels
const defaultImages = {
  'Haircut': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
  'Beard Trim': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
  'Hair Styling': 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?auto=format&fit=crop&w=800&q=80'
};

const Services = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/services`);
        
        // Instantly eliminate duplicates
        const uniqueData = Array.from(new Map(data.map(item => [item.name, item])).values());
        
        // Force EXACTLY 3 requested services regardless of database state
        const targetNames = ['Haircut', 'Beard Trim', 'Hair Styling'];
        const strictlyThree = uniqueData.filter(item => targetNames.includes(item.name));
        
        // Guarantee proper ordering
        strictlyThree.sort((a, b) => targetNames.indexOf(a.name) - targetNames.indexOf(b.name));
        
        setServices(strictlyThree);
      } catch (error) {
        console.error('Error fetching services', error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-32 px-6 max-w-[1400px] mx-auto">
      <div className="text-center mb-28">
        <h1 className="text-6xl md:text-7xl font-serif text-gold mb-8 tracking-wide drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">Premium Services</h1>
        <p className="text-zinc-400 uppercase tracking-[0.3em] text-sm md:text-base font-light">The pinnacle of men's grooming & refinement</p>
      </div>
      
      {services.length === 0 ? (
        <div className="text-center text-neutral-400 text-lg uppercase tracking-widest">Unable to load services. Please ensure server is running.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 relative" style={{ perspective: 2000 }}>
          {services.map((service, index) => {
            const displayImage = defaultImages[service.name] || service.image;

            return (
              <motion.div 
                key={service._id} 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                whileHover={{ 
                  y: -12, 
                  rotateX: 3, 
                  rotateY: -3,
                  boxShadow: "0 30px 60px -15px rgba(212, 175, 55, 0.2)"
                }}
                className="group relative overflow-hidden bg-zinc-900/50 flex flex-col backdrop-blur-md rounded-sm border border-zinc-800/80 hover:border-gold/40 transition-colors duration-500 will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {displayImage && (
                  <div className="w-full h-[380px] overflow-hidden bg-black relative">
                    <div className="absolute inset-0 bg-neutral-950/30 group-hover:bg-neutral-950/0 transition-colors duration-700 z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-20 opacity-95" />
                    <img 
                      src={displayImage} 
                      alt={service.name} 
                      loading="lazy" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out grayscale contrast-[1.15] brightness-[0.75] group-hover:brightness-[0.9] sepia-[0.2]" 
                    />
                  </div>
                )}
                
                <div className="p-10 flex flex-col flex-grow relative z-20 bg-gradient-to-b from-transparent to-zinc-950/95 -mt-24">
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="text-4xl font-serif text-white group-hover:text-gold transition-colors duration-500 drop-shadow-md">{service.name}</h3>
                    <span className="text-gold font-serif text-3xl drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] block pb-1">€{service.price}</span>
                  </div>
                  
                  <p className="text-zinc-400 font-light mb-8 text-base leading-relaxed">{service.description}</p>
                  
                  <div className="mb-10">
                    <Link 
                      to={`/book?service=${encodeURIComponent(service.name)}`}
                      className="inline-block px-8 py-3 bg-white/5 border border-gold/30 text-gold uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold hover:text-zinc-950 transition-all duration-300 rounded-sm"
                    >
                      Book Now
                    </Link>
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto pt-8 border-t border-white/5 group-hover:border-gold/30 transition-colors duration-500">
                    <span className="text-xs uppercase tracking-[0.25em] text-zinc-500 flex items-center gap-2">
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                       {service.duration} Min
                    </span>
                    <span className="text-xs uppercase tracking-[0.25em] text-gold/80 border border-gold/20 px-5 py-2.5 bg-gold/5 hover:bg-gold/10 transition-colors">{service.category}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Services;
