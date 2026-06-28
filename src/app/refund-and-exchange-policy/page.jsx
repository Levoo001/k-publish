const Page = () => {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4">

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-2 font-playfair">
            Return & Exchange Policy
          </h1>
          <p className="text-slate-400 text-sm font-poppins">Understanding our policies for a seamless experience</p>
        </div>

        <div className="space-y-6">

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-2">Refund & Exchange Policy</h2>
            <p className="text-slate-600 text-sm font-poppins leading-relaxed mb-3">
              At <strong className="text-primary font-playfair">Kavan The Brand</strong>, each piece is made to order with care. Because of the time and resources involved, we do not offer monetary refunds except in cases where the item arrives damaged.
            </p>
            <p className="text-slate-500 text-sm font-poppins">
              <strong className="text-slate-700">Note:</strong> For damaged items, you must provide video evidence within 24 hours of receiving the item to our WhatsApp line.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-2">Exchanges & Store Credit</h2>
            <p className="text-slate-600 text-sm font-poppins mb-3">
              Eligible only if you receive the wrong item, size, color, or a defective piece.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-slate-100 rounded-lg p-3">
                <h3 className="font-semibold text-slate-800 font-playfair text-sm mb-2">Contact Requirements</h3>
                <ul className="text-slate-600 text-sm space-y-1 font-poppins list-disc list-inside">
                  <li>Email: admin@kavanthebrand.com</li>
                  <li>WhatsApp/Call: +234 703 621 0107</li>
                  <li>Contact within 48 hours of delivery</li>
                </ul>
              </div>
              <div className="border border-slate-100 rounded-lg p-3">
                <h3 className="font-semibold text-slate-800 font-playfair text-sm mb-2">Return Conditions</h3>
                <ul className="text-slate-600 text-sm space-y-1 font-poppins list-disc list-inside">
                  <li>Items must be unworn and unwashed</li>
                  <li>Original packaging with tags intact</li>
                  <li>Store credit valid for 6 months</li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-2">Fit Issues</h2>
            <p className="text-slate-600 text-sm font-poppins">
              Exchanges accepted for the same style in a different size, or we can remake using your custom measurements. Customer is responsible for exchange shipping costs.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-2">Final Sale Items</h2>
            <p className="text-slate-600 text-sm font-poppins">
              <strong className="text-slate-800">Non-returnable:</strong> Custom orders and discounted items are not eligible for return or exchange.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-3">Production & Shipping</h2>
            <div className="space-y-2 mb-4">
              {[
                ["Production Time", "4–7 business days (excluding weekends & holidays)."],
                ["Order Cancellation", "Orders cannot be cancelled once production starts. Please confirm before you order."],
                ["Urgent Orders", "For urgent orders, special requests, and pickup, please message us on WhatsApp."],
              ].map(([title, body]) => (
                <div key={title} className="flex gap-2 text-sm font-poppins">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                  <span className="text-slate-600"><strong className="text-slate-800 font-playfair">{title}:</strong> {body}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ["Abuja", "3–5 working days"],
                ["Other Nigeria", "5–7 working days"],
                ["International", "5–7 days via DHL"],
              ].map(([place, time]) => (
                <div key={place} className="border border-slate-100 rounded-lg p-3 text-center">
                  <p className="font-semibold text-slate-800 font-playfair text-xs mb-1">{place}</p>
                  <p className="text-slate-500 text-xs font-poppins">{time}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-xs font-poppins mt-2 text-center">
              Customs and duties are the customer's responsibility for international orders.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-2">A Note on Sustainability</h2>
            <p className="text-slate-600 text-sm font-poppins leading-relaxed">
              Every <span className="font-playfair text-primary">Kavan</span> piece is made with care to reduce waste. Please double-check your size, measurements, and interest before placing an order. Your mindful shopping helps us limit packaging waste and reduce the carbon footprint of unnecessary returns.
            </p>
          </section>

          <div className="bg-primary rounded-xl p-5 text-center">
            <h3 className="text-base font-light mb-1.5 font-playfair text-white">Need Help?</h3>
            <p className="text-white/70 text-sm font-poppins mb-3">Contact us for any questions about our policies.</p>
            <a
              href="https://wa.me/2347036210107"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-primary px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors font-poppins"
            >
              Chat on WhatsApp
            </a>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Page;
