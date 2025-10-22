// src/components/QuoteCarousel.jsx - Cleaner Version
"use client";

import { useState, useEffect } from "react";

const QuoteCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const quotes = [
    {
      id: 1,
      text: "We create timeless, sophisticated pieces that honor both strength and softness, legacy and individuality.",
    },
    {
      id: 2,
      text: "Kavan is a love letter to women who carry more than they are given~ women who lead, nurture and hold it all together.",
    },
    {
      id: 3,
      text: "Kavan is a brand for everywoman who embodies quiet power and chooses softness without apology.",
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
    <section className="py-20 bg-white">
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