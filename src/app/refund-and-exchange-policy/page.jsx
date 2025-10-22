// src/app/refund-and-exchange-policy/page.jsx

const Page = () => {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container-custom max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full shadow-lg mb-4 border border-primary-100">
            <span className="text-3xl text-primary">🔄</span>
          </div>
          <h1 className="text-4xl font-bold text-primary-900 mb-4 font-playfair">
            Return & Exchange Policy
          </h1>
          <p className="text-primary-600 text-lg font-poppins">
            Understanding our policies for a seamless shopping experience
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Refund & Exchange Policy Section */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">📝</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                Refund & Exchange Policy
              </h2>
            </div>
            <p className="text-primary-700 mb-4 leading-relaxed font-poppins">
              At <span className="text-primary font-playfair">Kavan The Brand</span>, each piece is made to order with care. Because
              of the time and resources involved, we do not offer monetary
              refunds except in cases where the item arrives damaged.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-yellow-700 text-sm font-poppins">
                <strong className="font-playfair">Important:</strong> For damaged items, you must provide
                video evidence within 24 hours of receiving the item to our
                WhatsApp line.
              </p>
            </div>
          </section>

          {/* Exchanges & Store Credit Section */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">💳</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                Exchanges & Store Credit
              </h2>
            </div>
            <p className="text-primary-700 mb-4 leading-relaxed font-poppins">
              Eligible only if you receive the wrong item, size, color, or a
              defective piece.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-2 font-playfair text-sm">
                  Contact Requirements
                </h3>
                <ul className="text-primary-700 text-sm space-y-1 font-poppins">
                  <li>• Email: admin@kavanthebrand.com</li>
                  <li>• WhatsApp/Call: +234 703 621 0107</li>
                  <li>• Contact within 48 hours of delivery</li>
                </ul>
              </div>

              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-2 font-playfair text-sm">
                  Return Conditions
                </h3>
                <ul className="text-primary-700 text-sm space-y-1 font-poppins">
                  <li>• Items must be unworn and unwashed</li>
                  <li>• Original packaging with tags intact</li>
                  <li>• Store credit valid for 6 months</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Fit Issues Section */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">📏</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                Fit Issues
              </h2>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <p className="text-primary-700 text-sm font-poppins">
                <strong className="font-playfair">Note:</strong> Exchanges accepted for the same style in
                a different size, or we can remake using your custom
                measurements. Customer is responsible for exchange shipping
                costs.
              </p>
            </div>
          </section>

          {/* Final Sale Section */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">🏷️</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                Final Sale Items
              </h2>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm font-poppins">
                <strong className="font-playfair">Non-returnable:</strong> Custom orders and discounted
                items are not eligible for return or exchange.
              </p>
            </div>
          </section>

          {/* Production & Shipping Section */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">⚡</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                Production & Shipping
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start p-3 rounded-lg border border-primary-100">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary text-sm">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 font-playfair text-sm">
                    Production Time
                  </h3>
                  <p className="text-primary-700 font-poppins text-sm">
                    4–7 business days (excluding weekends & holidays)
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg border border-primary-100">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary text-sm">🚫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 font-playfair text-sm">
                    Order Cancellation
                  </h3>
                  <p className="text-primary-700 font-poppins text-sm">
                    Orders cannot be cancelled once production starts. Please
                    confirm before you order.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg border border-primary-100">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary text-sm">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 font-playfair text-sm">Urgent Orders</h3>
                  <p className="text-primary-700 font-poppins text-sm">
                    For urgent orders, special requests, and pickup, please
                    message us on WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Timeline Section */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <h3 className="text-lg font-bold text-primary-900 mb-4 font-playfair">
              Shipping Timeline
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="bg-primary-50 p-3 rounded-lg text-center border border-primary-200">
                <h4 className="font-semibold text-primary-900 mb-1 font-playfair text-sm">
                  Abuja Delivery
                </h4>
                <p className="text-primary-700 text-xs font-poppins">3–5 working days</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg text-center border border-primary-200">
                <h4 className="font-semibold text-primary-900 mb-1 font-playfair text-sm">
                  Other Nigerian Cities
                </h4>
                <p className="text-primary-700 text-xs font-poppins">5–7 working days</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg text-center border border-primary-200">
                <h4 className="font-semibold text-primary-900 mb-1 font-playfair text-sm">
                  International
                </h4>
                <p className="text-primary-700 text-xs font-poppins">
                  5–7 working days via DHL
                </p>
              </div>
            </div>
            <p className="text-primary-600 text-xs mt-3 text-center font-poppins">
              * Customs/duties are the responsibility of the customer for international orders
            </p>
          </section>

          {/* Sustainability Section */}
          <section className="bg-primary-50 rounded-xl border border-primary-200 p-6">
            <h2 className="text-lg font-bold text-primary-900 mb-3 flex items-center font-playfair">
              <span className="text-primary mr-2">🌱</span>A Note on Sustainability
            </h2>
            <p className="text-primary-700 leading-relaxed font-poppins text-sm">
              Every <span className="font-playfair">Kavan</span> piece is made with care to reduce waste. Please
              double-check your size, measurements, and interest before placing
              an order. Your mindful shopping helps us limit packaging waste and
              reduce the carbon footprint of unnecessary returns—supporting a
              more thoughtful fashion ecosystem for both people and the planet.
            </p>
          </section>

          {/* Contact CTA */}
          <div className="bg-primary rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold mb-2 font-playfair text-white">Need Help?</h3>
            <p className="mb-4 font-poppins text-primary-100 text-sm">
              Contact us for any questions about our policies
            </p>
            <a
              href="https://wa.me/2347036210107"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-white text-primary hover:bg-primary-50 px-4 py-2 rounded-lg font-medium transition-colors font-poppins text-sm"
            >
              <span className="mr-2">💬</span>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;