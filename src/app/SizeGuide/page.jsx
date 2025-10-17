// src/app/size-guide/page.js

const SizeGuide = () => {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container-custom max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-burgundy-50 rounded-full shadow-lg mb-4 border border-burgundy-100">
            <span className="text-3xl text-burgundy">📏</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-burgundy-900 mb-4 font-playfair">
            Size <span className="text-burgundy">Guide</span>
          </h1>
          <p className="text-lg text-burgundy-600 max-w-2xl mx-auto leading-relaxed font-cormorant">
            Find your perfect fit with our comprehensive sizing charts. We believe in flattering fits for all bodies.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-burgundy-50 border-l-4 border-burgundy p-6 rounded-lg mb-8">
          <div className="flex items-start">
            <div className="text-xl mr-4 text-burgundy mt-1">💡</div>
            <div>
              <h3 className="text-lg font-semibold text-burgundy-900 mb-2 font-playfair">
                Finding Your Perfect Fit
              </h3>
              <p className="text-burgundy-700 font-cormorant leading-relaxed">
                All measurements are in inches. If your measurements fall between sizes or outside our standard range, 
                we offer custom sizing upon request to ensure the perfect fit for your unique body.
              </p>
            </div>
          </div>
        </div>

        {/* Size Guide Section */}
        <section className="bg-white rounded-xl shadow-sm border border-burgundy-100 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <span className="text-xl text-burgundy">👗</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-burgundy-900 mb-2 font-playfair">
                Clothing Size Guide
              </h2>
              <div className="w-12 h-1 bg-burgundy rounded-full"></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-burgundy text-white">
                  <th className="p-3 text-left font-semibold font-playfair text-sm">SIZE</th>
                  <th className="p-3 text-center font-semibold font-playfair text-sm">BUST</th>
                  <th className="p-3 text-center font-semibold font-playfair text-sm">WAIST</th>
                  <th className="p-3 text-center font-semibold font-playfair text-sm">HIPS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-burgundy-100">
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
                ].map((row, index) => (
                  <tr 
                    key={row.size} 
                    className={`hover:bg-burgundy-50 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-burgundy-25' : 'bg-white'
                    }`}
                  >
                    <td className="p-3 font-semibold text-burgundy font-playfair text-sm">{row.size}</td>
                    <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">{row.bust}"</td>
                    <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">{row.waist}"</td>
                    <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">{row.hips}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-burgundy-600 text-center font-cormorant">
            <p>All measurements are in inches. We recommend measuring your bust, waist, and hips to find your perfect size.</p>
          </div>
        </section>

        {/* Length Guide Section */}
        <section className="bg-white rounded-xl shadow-sm border border-burgundy-100 p-6 mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <span className="text-xl text-burgundy">📐</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-burgundy-900 mb-2 font-playfair">
                Length Guide
              </h2>
              <div className="w-12 h-1 bg-burgundy rounded-full"></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-burgundy text-white">
                  <th className="p-3 text-left font-semibold font-playfair text-sm">HEIGHT RANGE</th>
                  <th className="p-3 text-center font-semibold font-playfair text-sm">PETITE+</th>
                  <th className="p-3 text-center font-semibold font-playfair text-sm">AVERAGE</th>
                  <th className="p-3 text-center font-semibold font-playfair text-sm">AVERAGE+</th>
                  <th className="p-3 text-center font-semibold font-playfair text-sm">VERY TALL</th>
                </tr>
                <tr className="bg-burgundy-50">
                  <th className="p-2 text-left text-xs font-semibold text-burgundy-900 font-playfair">HEIGHT</th>
                  <th className="p-2 text-center text-xs font-semibold text-burgundy-900 font-playfair">5'0"-5'3FT</th>
                  <th className="p-2 text-center text-xs font-semibold text-burgundy-900 font-playfair">5'4"-5'7FT</th>
                  <th className="p-2 text-center text-xs font-semibold text-burgundy-900 font-playfair">5'8"-5'9FT</th>
                  <th className="p-2 text-center text-xs font-semibold text-burgundy-900 font-playfair">6FT+</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-burgundy-100">
                <tr className="hover:bg-burgundy-50 transition-colors duration-200 bg-white">
                  <td className="p-3 font-semibold text-burgundy font-playfair text-sm">PANTS/SKIRT LENGTH</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">42"</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">45"</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">47"</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">52"</td>
                </tr>
                <tr className="hover:bg-burgundy-50 transition-colors duration-200 bg-burgundy-25">
                  <td className="p-3 font-semibold text-burgundy font-playfair text-sm">DRESS LENGTH</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">56"</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">58"</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">60"</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">65"</td>
                </tr>
                <tr className="hover:bg-burgundy-50 transition-colors duration-200 bg-burgundy-25">
                  <td className="p-3 font-semibold text-burgundy font-playfair text-sm">DRESS LENGTH</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">56"</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">57"</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">63"</td>
                  <td className="p-3 text-center text-burgundy-700 font-cormorant text-sm">65"</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-burgundy-50 rounded-lg border border-burgundy-200">
            <p className="text-burgundy-700 text-sm font-cormorant">
              <strong className="font-playfair">FYI:</strong> All measurements are in inches. These are waist to feet measurements. 
              If you would like it to fit longer, please go for a taller length.
            </p>
          </div>
        </section>

        {/* How to Measure Section */}
        <section className="bg-burgundy-50 rounded-xl border border-burgundy-200 p-6 mb-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🎯</div>
            <h2 className="text-2xl font-bold mb-3 font-playfair text-burgundy-900">How to Measure</h2>
            <div className="w-16 h-1 bg-burgundy rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-burgundy-100 hover:shadow-md transition-all duration-300">
              <div className="text-2xl mb-3 text-center text-burgundy">📏</div>
              <h3 className="font-semibold text-lg mb-2 text-center font-playfair text-burgundy-900">Bust</h3>
              <p className="text-burgundy-700 text-sm text-center font-cormorant leading-relaxed">
                Measure around the fullest part of your bust, keeping the tape parallel to the floor
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-burgundy-100 hover:shadow-md transition-all duration-300">
              <div className="text-2xl mb-3 text-center text-burgundy">⏳</div>
              <h3 className="font-semibold text-lg mb-2 text-center font-playfair text-burgundy-900">Waist</h3>
              <p className="text-burgundy-700 text-sm text-center font-cormorant leading-relaxed">
                Measure around the narrowest part of your waist, typically above your belly button
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-burgundy-100 hover:shadow-md transition-all duration-300">
              <div className="text-2xl mb-3 text-center text-burgundy">🍐</div>
              <h3 className="font-semibold text-lg mb-2 text-center font-playfair text-burgundy-900">Hips</h3>
              <p className="text-burgundy-700 text-sm text-center font-cormorant leading-relaxed">
                Measure around the fullest part of your hips, approximately 7-8 inches below your waist
              </p>
            </div>
          </div>
        </section>

        {/* Custom Sizing CTA */}
        <section className="bg-burgundy rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold mb-3 font-playfair text-white">Need a Custom Size?</h3>
          <p className="text-burgundy-100 text-base mb-4 max-w-2xl mx-auto font-cormorant">
            We believe every body is unique. If your measurements fall outside our standard sizes, 
            we're happy to create custom pieces just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact-us"
              className="inline-flex items-center justify-center bg-white text-burgundy hover:bg-burgundy-50 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 font-inter"
            >
              <span className="mr-2">✂️</span>
              Request Custom Sizing
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SizeGuide;