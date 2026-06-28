const DeliveryPolicy = () => {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4">

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-2 font-playfair">
            Delivery Policy
          </h1>
          <div className="w-8 h-px bg-primary mx-auto" />
        </div>

        <div className="space-y-6">

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-2">Order & Production</h2>
            <ul className="space-y-1.5 font-poppins text-slate-600 text-sm list-disc list-inside">
              <li>You'll receive an email confirmation after purchase.</li>
              <li>Each piece is made to order: 6–10 business days production before shipping.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-2">Domestic Shipping (Nigeria)</h2>
            <ul className="space-y-1.5 font-poppins text-slate-600 text-sm list-disc list-inside">
              <li><strong className="text-slate-800">Abuja:</strong> 1–3 working days after production.</li>
              <li><strong className="text-slate-800">Other Nigerian States:</strong> 5–7 working days via DHL.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-2">International Shipping</h2>
            <ul className="space-y-1.5 font-poppins text-slate-600 text-sm list-disc list-inside">
              <li>Ships via DHL Express, typically delivered 5–7 working days after dispatch.</li>
              <li>Shipping fees vary by destination and are shown at checkout.</li>
              <li>Customs duties and taxes are the customer's responsibility.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-base font-semibold text-slate-900 font-playfair mb-2">Tracking & Responsibility</h2>
            <ul className="space-y-1.5 font-poppins text-slate-600 text-sm list-disc list-inside">
              <li>Tracking details are emailed once your order ships.</li>
              <li>Please double-check your address and contact info — failed deliveries require a re-delivery fee.</li>
              <li><strong className="text-slate-800">Kavan The Brand</strong> is not responsible for customs delays, lost, or stolen packages once marked as delivered.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          <div className="bg-primary rounded-xl p-5 text-center">
            <h3 className="text-base font-light mb-1.5 font-playfair text-white">Need Help?</h3>
            <p className="text-white/70 text-sm font-poppins mb-3">For questions about your order or shipping:</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm font-poppins">
              <a href="mailto:admin@kavanthebrand.com" className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                admin@kavanthebrand.com
              </a>
              <a href="https://wa.me/2347036210107" target="_blank" rel="noopener noreferrer" className="border border-white text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                WhatsApp / Call
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 font-poppins">
            Thank you for choosing <span className="text-primary">Kavan The Brand</span>. We appreciate your business.
          </p>

        </div>
      </div>
    </main>
  );
};

export default DeliveryPolicy;
