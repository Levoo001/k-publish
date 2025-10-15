// src/app/refund-and-exchange-policy/page.jsx

const Page = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Delivery and Return Conditions
          </h1>
          <p className="text-gray-600 text-lg font-cormorant">
            Understanding our policies for a seamless shopping experience
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Refund & Exchange Policy Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center font-playfair">
              <span className="w-3 h-3 bg-black rounded-full mr-3"></span>
              Refund & Exchange Policy
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed font-cormorant">
              At Kavan The Brand, each piece is made to order with care. Because
              of the time and resources involved, we do not offer monetary
              refunds except in cases where the item arrives damaged.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-yellow-700 text-sm font-cormorant">
                <strong className="font-playfair">Important:</strong> For damaged items, you must provide
                video evidence within 24 hours of receiving the item to our
                WhatsApp line.
              </p>
            </div>
          </section>

          {/* Exchanges & Store Credit Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center font-playfair">
              <span className="w-3 h-3 bg-black rounded-full mr-3"></span>
              Exchanges & Store Credit
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed font-cormorant">
              Eligible only if you receive the wrong item, size, color, or a
              defective piece.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 font-playfair">
                  Contact Requirements
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 font-cormorant">
                  <li>• Email: admin@kavanthebrand.com</li>
                  <li>• WhatsApp/Call: +234 703 621 0107</li>
                  <li>• Contact within 48 hours of delivery</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2 font-playfair">
                  Return Conditions
                </h3>
                <ul className="text-sm text-gray-700 space-y-1 font-cormorant">
                  <li>• Items must be unworn and unwashed</li>
                  <li>• Original packaging with tags intact</li>
                  <li>• Store credit valid for 6 months</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Fit Issues Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center font-playfair">
              <span className="w-3 h-3 bg-black rounded-full mr-3"></span>
              Fit Issues
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-700 text-sm font-cormorant">
                <strong className="font-playfair">Note:</strong> Exchanges accepted for the same style in
                a different size, or we can remake using your custom
                measurements. Customer is responsible for exchange shipping
                costs.
              </p>
            </div>
          </section>

          {/* Final Sale Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center font-playfair">
              <span className="w-3 h-3 bg-black rounded-full mr-3"></span>
              Final Sale Items
            </h2>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-700 text-sm font-cormorant">
                <strong className="font-playfair">Non-returnable:</strong> Custom orders and discounted
                items are not eligible for return or exchange.
              </p>
            </div>
          </section>

          {/* Production & Shipping Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center font-playfair">
              <span className="w-3 h-3 bg-black rounded-full mr-3"></span>
              Production & Shipping
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-xs font-bold">⚡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-playfair">
                    Production Time
                  </h3>
                  <p className="text-gray-700 font-cormorant">
                    4–7 business days (excluding weekends & holidays)
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-xs font-bold">🚫</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-playfair">
                    Order Cancellation
                  </h3>
                  <p className="text-gray-700 font-cormorant">
                    Orders cannot be cancelled once production starts. Please
                    confirm before you order.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-xs font-bold">📞</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 font-playfair">Urgent Orders</h3>
                  <p className="text-gray-700 font-cormorant">
                    For urgent orders, special requests, and pickup, please
                    message us on WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Timeline Section */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-playfair">
              Shipping Timeline
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-green-900 mb-2 font-playfair">
                  Abuja Delivery
                </h4>
                <p className="text-green-700 text-sm font-cormorant">3–5 working days</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-blue-900 mb-2 font-playfair">
                  Other Nigerian Cities
                </h4>
                <p className="text-blue-700 text-sm font-cormorant">5–7 working days</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-purple-900 mb-2 font-playfair">
                  International
                </h4>
                <p className="text-purple-700 text-sm font-cormorant">
                  5–7 working days via DHL
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-3 text-center font-cormorant">
              * Customs/duties are the responsibility of the customer for
              international orders
            </p>
          </section>

          {/* Sustainability Section */}
          <section className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-2xl font-bold text-green-900 mb-3 flex items-center font-playfair">
              <span className="text-green-600 mr-2">🌱</span>A Note on
              Sustainability
            </h2>
            <p className="text-green-800 leading-relaxed font-cormorant">
              Every Kavan piece is made with care to reduce waste. Please
              double-check your size, measurements, and interest before placing
              an order. Your mindful shopping helps us limit packaging waste and
              reduce the carbon footprint of unnecessary returns—supporting a
              more thoughtful fashion ecosystem for both people and the planet.
            </p>
          </section>

          {/* Contact CTA */}
          {/* <div className="bg-black text-white p-6 rounded-lg text-center mt-8">
            <h3 className="text-xl font-bold mb-2 font-playfair">Need Help?</h3>
            <p className="mb-4 font-cormorant">
              Contact us for any questions about our policies
            </p>
            <a
              href="https://wa.me/2347036210107"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors font-inter"
            >
              <span className="mr-2">💬</span>
              Chat on WhatsApp
            </a>
          </div> */}
        </div>
      </div>
    </main>
  );
};

export default Page;