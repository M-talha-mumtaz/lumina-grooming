import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { t } = useTranslation();
  const heroRef = useRef(null);
  const bgImageRef = useRef(null);
  const textRef = useRef(null);
  const servicesRef = useRef(null);
  const cardsRef = useRef([]);
  const parallaxImgRef = useRef(null);
  
  const addToCards = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Smooth initial load text reveal
      gsap.fromTo(textRef.current.children, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out", force3D: true }
      );
      
      // 2. Hero Background Image Parallax / Slow zoom
      gsap.to(bgImageRef.current, {
        yPercent: 30,
        scale: 1.1,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1 // smooth scrubbing
        }
      });

      // 3. Services Cards fade up sequentially when scrolled into view
      gsap.fromTo(cardsRef.current, 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          stagger: 0.2, 
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: servicesRef.current,
            start: "top 80%", // starts when the top of the section hits 80% down the viewport
            toggleActions: "play none none reverse"
          }
        }
      );

      // 4. Secondary Image Parallax
      gsap.fromTo(parallaxImgRef.current, 
        { yPercent: -20 },
        { 
          yPercent: 20, 
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: parallaxImgRef.current,
            start: "top bottom", 
            end: "bottom top",
            scrub: true
          }
        }
      );

    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax Background Image */}
        <img 
          ref={bgImageRef}
          src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=1920&q=80"
          alt="Premium Grooming Environment"
          fetchPriority="high"
          className="absolute inset-0 z-0 w-full h-[120%] object-cover will-change-transform"
        />
          <div className="absolute inset-0 bg-neutral-950/70" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto will-change-transform" ref={textRef}>
          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif text-gold tracking-tight mb-8 glow-text leading-tight">
            Apex <br/> Grooming
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-neutral-300 font-light mb-14 tracking-widest sm:tracking-[0.3em] uppercase opacity-90">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link 
              to="/book"
              className="px-12 py-5 bg-gold text-neutral-950 hover:bg-[#ebd074] hover:shadow-gold-glow-lg transition-all duration-500 uppercase tracking-[0.2em] text-xs font-bold"
            >
              {t('book_appointment')}
            </Link>
            <Link 
              to="/services"
              className="px-12 py-5 border border-gold text-gold hover:bg-gold/10 hover:shadow-gold-glow transition-all duration-500 uppercase tracking-[0.2em] text-xs font-bold backdrop-blur-sm"
            >
              {t('services')}
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Philosophy Section */}
      <section className="py-32 md:py-48 bg-neutral-950 relative z-10 flex items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-10">
             <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
          </div>
          <h2 className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold mb-8 font-semibold">The Apex Philosophy</h2>
          <p className="text-3xl md:text-5xl font-serif text-neutral-200 leading-snug md:leading-snug font-light">
            Grooming is an <span className="text-gold italic">art form</span>. It's not just about looking your best, it's about <span className="text-gold italic">feeling unstoppable</span>. Experience the pinnacle of modern refinement.
          </p>
          <div className="flex justify-center mt-12">
             <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Transitional Parallax Graphic */}
      <section className="h-[60vh] bg-neutral-950 flex items-center justify-center overflow-hidden relative">
         <img 
           ref={parallaxImgRef}
           src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1920&q=80"
           alt="Masterpiece grooming detail"
           loading="lazy"
           className="w-full h-[120%] object-cover absolute opacity-30 mix-blend-luminosity will-change-transform"
         />
         <div className="relative z-10 text-center max-w-3xl px-6">
            <h2 className="text-4xl md:text-5xl text-gold font-serif italic mb-8 tracking-wide drop-shadow-lg">"A masterpiece in every cut."</h2>
            <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
         </div>
      </section>

      {/* Services Highlight Section */}
      <section ref={servicesRef} className="py-40 bg-neutral-950 text-center relative z-20">
        <div className="mx-auto px-6 max-w-7xl">
          <div className="overflow-hidden mb-24">
             <h2 className="text-5xl md:text-6xl text-gold font-serif leading-tight glow-text font-light">Elite Services</h2>
             <div className="h-[1px] w-24 bg-gold/50 mx-auto mt-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Precision Haircut", param: "Refining your features with masterful scissors work." },
              { title: "Executive Beard Sculpting", param: "Hot towel, straight razor lines, and restorative oils." },
              { title: "The Royal Treatment", param: "Comprehensive grooming including facial, cut, and shave." }
            ].map((item, idx) => (
              <div 
                key={idx} 
                ref={addToCards}
                className="group relative p-14 border border-neutral-800/80 hover:border-gold/40 hover:shadow-gold-glow transition-all duration-700 bg-neutral-900/40 flex flex-col items-center justify-center min-h-[340px] backdrop-blur-sm will-change-transform"
              >
                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h3 className="text-3xl font-serif text-neutral-200 group-hover:text-gold transition-colors duration-500 mb-6 relative z-10 font-light tracking-wide">
                  {item.title}
                </h3>
                <p className="text-neutral-400 mb-10 font-light relative z-10 leading-relaxed text-sm">
                  {item.param}
                </p>
                <div className="text-gold tracking-[0.2em] text-xs uppercase relative z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-500 font-semibold">Learn More</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
