// src/app/size-guide/page.js

const SizeGuide = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50 py-12">
      <div className="container-custom max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-6 border border-pink-200">
            <span className="text-4xl">📏</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 font-playfair">
            Size Guide
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-cormorant">
            Find your perfect fit with our comprehensive sizing charts. We believe in flattering fits for all bodies.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl mb-12">
          <div className="flex items-start">
            <div className="text-2xl mr-4">💡</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2 font-playfair">
                Finding Your Perfect Fit
              </h3>
              <p className="text-blue-800 font-cormorant">
                All measurements are in inches. If your measurements fall between sizes or outside our standard range, 
                we offer custom sizing upon request to ensure the perfect fit for your unique body.
              </p>
            </div>
          </div>
        </div>

        {/* Size Guide Section */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-12 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
              <span className="text-2xl">👗</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 font-playfair">
                Clothing Size Guide
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  <th className="p-4 text-left font-semibold font-playfair">SIZE</th>
                  <th className="p-4 text-center font-semibold font-playfair">BUST</th>
                  <th className="p-4 text-center font-semibold font-playfair">WAIST</th>
                  <th className="p-4 text-center font-semibold font-playfair">HIPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {[
                  { size: '6', bust: '32', waist: '25', hips: '36' },
                  { size: '8', bust: '34', waist: '37', hips: '38' },
                  { size: '10', bust: '36', waist: '30', hips: '43' },
                  { size: '12', bust: '41', waist: '34', hips: '45' },
                  { size: '14', bust: '43', waist: '36', hips: '48' },
                  { size: '16', bust: '45', waist: '38', hips: '50' },
                  { size: '18', bust: '48', waist: '40', hips: '54' },
                  { size: '20', bust: '50', waist: '44', hips: '56' },
                  { size: '22', bust: '52', waist: '44', hips: '59' }
                  // { size: '24', bust: '50', waist: '44', hips: '54' }
                ].map((row, index) => (
                  <tr 
                    key={row.size} 
                    className={`hover:bg-pink-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                    }`}
                  >
                    <td className="p-4 font-semibold text-slate-900 font-playfair">{row.size}</td>
                    <td className="p-4 text-center text-slate-700 font-cormorant">{row.bust}"</td>
                    <td className="p-4 text-center text-slate-700 font-cormorant">{row.waist}"</td>
                    <td className="p-4 text-center text-slate-700 font-cormorant">{row.hips}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-slate-600 text-center font-cormorant">
            <p>All measurements are in inches. We recommend measuring your bust, waist, and hips to find your perfect size.</p>
          </div>
        </section>

        {/* Length Guide Section */}
        <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-12 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
              <span className="text-2xl">📐</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 font-playfair">
                Length Guide
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <th className="p-4 text-left font-semibold font-playfair">HEIGHT RANGE</th>
                  <th className="p-4 text-center font-semibold font-playfair">PETITE+</th>
                  <th className="p-4 text-center font-semibold font-playfair">AVERAGE</th>
                  <th className="p-4 text-center font-semibold font-playfair">AVERAGE+</th>
                  <th className="p-4 text-center font-semibold font-playfair">VERY TALL</th>
                </tr>
                <tr className="bg-slate-100">
                  <th className="p-3 text-left text-sm font-semibold text-slate-700 font-playfair">HEIGHT</th>
                  <th className="p-3 text-center text-sm font-semibold text-slate-700 font-playfair">5'0"-5'3FT</th>
                  <th className="p-3 text-center text-sm font-semibold text-slate-700 font-playfair">5'4"-5'7FT</th>
                  <th className="p-3 text-center text-sm font-semibold text-slate-700 font-playfair">5'8"-5'9FT</th>
                  <th className="p-3 text-center text-sm font-semibold text-slate-700 font-playfair">6FT+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-purple-50 transition-colors duration-200 bg-white">
                  <td className="p-4 font-semibold text-slate-900 font-playfair">PANTS/SKIRT LENGTH</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">42"</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">45"</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">47"</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">52"</td>
                </tr>
                <tr className="hover:bg-purple-50 transition-colors duration-200 bg-slate-50">
                  <td className="p-4 font-semibold text-slate-900 font-playfair">DRESS LENGTH</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">56"</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">58"</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">60"</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">65"</td>
                </tr>
                  <tr className="hover:bg-purple-50 transition-colors duration-200 bg-slate-50">
                  <td className="p-4 font-semibold text-slate-900 font-playfair">DRESS LENGTH</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">56"</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">57"</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">63"</td>
                  <td className="p-4 text-center text-slate-700 font-cormorant">65"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-pink-50 rounded-xl border border-pink-200">
            <p className="text-pink-800 text-sm font-cormorant">
              <strong>FYI:</strong> All measurements are in inches. These are waist to feet measurements. 
              If you would like it to fit longer, please go for a taller length.
            </p>
          </div>
        </section>

        {/* How to Measure Section */}
        <section className="bg-gradient-to-br from-slate-900 to-black text-white rounded-2xl shadow-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold mb-4 font-playfair">How to Measure</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-xl border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4 text-center">📏</div>
              <h3 className="font-semibold text-lg mb-3 text-center font-playfair">Bust</h3>
              <p className="text-slate-300 text-center text-sm font-cormorant">
                Measure around the fullest part of your bust, keeping the tape parallel to the floor
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4 text-center">⏳</div>
              <h3 className="font-semibold text-lg mb-3 text-center font-playfair">Waist</h3>
              <p className="text-slate-300 text-center text-sm font-cormorant">
                Measure around the narrowest part of your waist, typically above your belly button
              </p>
            </div>

            <div className="bg-white/10 p-6 rounded-xl border border-white/20 hover:transform hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-4 text-center">🍐</div>
              <h3 className="font-semibold text-lg mb-3 text-center font-playfair">Hips</h3>
              <p className="text-slate-300 text-center text-sm font-cormorant">
                Measure around the fullest part of your hips, approximately 7-8 inches below your waist
              </p>
            </div>
          </div>
        </section>

        {/* Custom Sizing CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3 font-playfair">Need a Custom Size?</h3>
          <p className="text-purple-100 text-lg mb-6 max-w-2xl mx-auto font-cormorant">
            We believe every body is unique. If your measurements fall outside our standard sizes, 
            we're happy to create custom pieces just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact-us"
              className="inline-flex items-center justify-center bg-white text-purple-600 hover:bg-slate-100 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 font-inter"
            >
              <span className="mr-3">✂️</span>
              Request Custom Sizing
            </a>
          </div>
        </section>

      </div>
    </main>
  );
};

export default SizeGuide;