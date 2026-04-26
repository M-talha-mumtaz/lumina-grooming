import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

const Contact = () => {
  const { t } = useTranslation();
  const mapRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
    });

    loader.load().then((google) => {
      const position = { lat: 40.7380, lng: -73.9920 };
      const map = new google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#18181b' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#18181b' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#71717a' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d4af37' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d4af37', opacity: 0.5 }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#27272a' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#3f3f46' }]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#71717a' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#09090b' }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: true,
      });

      new google.maps.Marker({
        position: position,
        map: map,
        title: 'Apex Grooming',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#d4af37',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#000',
        }
      });
    }).catch(e => {
      console.error('Google Maps Load Error:', e);
    });
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 max-w-6xl mx-auto">
      <h1 className="text-6xl font-serif text-gold text-center mb-16 tracking-widest uppercase drop-shadow-lg">{t('contact')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-10 bg-zinc-900/40 p-12 border border-zinc-800 backdrop-blur-md">
          <h2 className="text-3xl font-serif text-zinc-200 border-b border-gold/10 pb-6 tracking-wide">Get In Touch</h2>
          
          <div className="flex items-start space-x-6 group">
            <MapPin className="text-gold mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={32} />
            <div>
              <h3 className="text-gold uppercase tracking-[0.2em] text-xs font-bold mb-3">Location</h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                123 5th Ave<br />
                New York, NY 10003<br />
                USA
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6 group">
            <Phone className="text-gold mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={32} />
            <div>
              <h3 className="text-gold uppercase tracking-[0.2em] text-xs font-bold mb-3">Phone</h3>
              <p className="text-zinc-400 font-light leading-relaxed text-lg tracking-wider">+1 212 555 0198</p>
            </div>
          </div>

          <div className="flex items-start space-x-6 group">
            <Mail className="text-gold mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" size={32} />
            <div>
              <h3 className="text-gold uppercase tracking-[0.2em] text-xs font-bold mb-3">Email</h3>
              <p className="text-zinc-400 font-light leading-relaxed">appointments@apexgrooming.com</p>
            </div>
          </div>

          <div className="pt-10 border-t border-gold/10">
            <h3 className="text-gold uppercase tracking-[0.2em] text-xs font-bold mb-6">Opening Hours</h3>
            <ul className="space-y-3 text-zinc-400 font-light">
              <li className="flex justify-between items-center"><span className="uppercase tracking-widest text-[10px]">Mon - Fri</span> <span className="text-zinc-200">10:00 - 19:00</span></li>
              <li className="flex justify-between items-center"><span className="uppercase tracking-widest text-[10px]">Saturday</span> <span className="text-zinc-200">09:00 - 17:00</span></li>
              <li className="flex justify-between items-center"><span className="uppercase tracking-widest text-[10px]">Sunday</span> <span className="text-zinc-700 italic">Closed</span></li>
            </ul>
          </div>
        </div>

        {/* Professional Google Map API Integration */}
        <div className="h-[650px] border border-zinc-800 relative bg-zinc-950 overflow-hidden shadow-2xl">
          <div ref={mapRef} className="w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-1000" />
          <div className="absolute inset-0 pointer-events-none border-[20px] border-zinc-950/20 mix-blend-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
