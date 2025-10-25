// src/components/QuoteCarousel.jsx - With Themed Icons
"use client";

import { useState, useEffect } from "react";

const QuoteCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const quotes = [
    {
      id: 1,
      text: "We create timeless, sophisticated pieces that honor both strength and softness, legacy and individuality.",
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mx-auto mb-6">
          {/* Diamond/Crystal representing timeless sophistication */}
          <path d="M28 8L36 20L28 32L20 20L28 8Z" fill="url(#grad1)" stroke="#8B5CF6" strokeWidth="1.5"/>
          <path d="M28 32L36 44L28 48L20 44L28 32Z" fill="url(#grad2)" stroke="#8B5CF6" strokeWidth="1.5"/>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDD6FE" />
              <stop offset="100%" stopColor="#A78BFA" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 2,
      text: "Kavan is a love letter to women who carry more than they are given~ women who lead, nurture and hold it all together.",
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mx-auto mb-6">
          {/* Heart with nurturing hands */}
          <path d="M28 16C24 12 16 12 16 20C16 28 28 36 28 36C28 36 40 28 40 20C40 12 32 12 28 16Z" fill="url(#heartGrad)" />
          <path d="M12 32C10 30 8 26 12 22M44 22C48 26 46 30 44 32" stroke="#F472B6" strokeWidth="2" strokeLinecap="round"/>
          <defs>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 3,
      text: "Kavan is a brand for everywoman who embodies quiet power and chooses softness without apology.",
      icon: (
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" className="mx-auto mb-6">
          {/* Lotus flower representing quiet power and softness */}
          <circle cx="28" cy="28" r="16" fill="url(#lotusGrad)" opacity="0.8"/>
          <path d="M28 12L32 20L28 24L24 20L28 12Z" fill="#6EE7B7" opacity="0.7"/>
          <path d="M36 24L40 28L36 32L32 28L36 24Z" fill="#34D399" opacity="0.7"/>
          <path d="M20 24L24 28L20 32L16 28L20 24Z" fill="#34D399" opacity="0.7"/>
          <path d="M28 36L32 44L28 48L24 44L28 36Z" fill="#10B981" opacity="0.7"/>
          <circle cx="28" cy="28" r="4" fill="#059669"/>
          <defs>
            <linearGradient id="lotusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="relative">
          {/* Slides */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {quotes.map((quote, index) => (
                <div key={quote.id} className="w-full flex-shrink-0">
                  <div className="text-center">
                    {/* Unique themed icon for each quote */}
                    {quote.icon}
                    
                    <blockquote className="text-base md:text-lg text-gray-700 leading-relaxed font-light font-poppins px-4">
                      {quote.text}
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bullet Dot Indicators */}
          <div className="flex items-center justify-center space-x-1 mt-4">
            {quotes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="flex items-center justify-center w-6 h-6"
                aria-label={`Go to slide ${index + 1}`}
              >
                {/* Outer circle for active slide */}
                <div className={`relative flex items-center justify-center transition-all duration-300 ${
                  currentSlide === index ? "w-6 h-6 border-2 border-gray-900 rounded-full" : ""
                }`}>
                  {/* Inner dot */}
                  <div className={`rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? "w-1.5 h-1.5 bg-slate-900" 
                      : "w-2 h-2 bg-slate-400 hover:bg-slate-600"
                  }`} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteCarousel;