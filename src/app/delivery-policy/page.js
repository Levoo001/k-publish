// src/app/delivery-policy/page.js

const DeliveryPolicy = () => {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container-custom max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full shadow-lg mb-4 border border-primary-100">
            <span className="text-3xl text-primary">🚚</span>
          </div>
          <h1 className="text-4xl font-bold text-primary-900 mb-4 font-playfair">
            Delivery Policy
          </h1>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Order & Production */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">📦</span>
              </div>
              <h2 className="text-xl font-semibold text-primary-900 font-playfair">
                Order & Production
              </h2>
            </div>
            <ul className="space-y-2 list-disc list-inside font-poppins text-primary-700">
              <li>You'll receive an email confirmation after purchase.</li>
              <li>
                Each piece is made to order: 6–10 business days production before shipping.
              </li>
            </ul>
          </section>

          {/* Domestic Shipping */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">🇳🇬</span>
              </div>
              <h2 className="text-xl font-semibold text-primary-900 font-playfair">
                Domestic Shipping (Nigeria)
              </h2>
            </div>
            <ul className="space-y-2 list-disc list-inside font-poppins text-primary-700">
              <li>
                <strong className="font-playfair text-primary">Abuja:</strong> 1–3 working days after production.
              </li>
              <li>
                <strong className="font-playfair text-primary">Other Nigerian States:</strong> 5–7 working days via DHL.
              </li>
            </ul>
          </section>

          {/* International Shipping */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">🌍</span>
              </div>
              <h2 className="text-xl font-semibold text-primary-900 font-playfair">
                International Shipping
              </h2>
            </div>
            <ul className="space-y-2 list-disc list-inside font-poppins text-primary-700">
              <li>
                Ships via DHL Express, typically delivered 5–7 working days after dispatch.
              </li>
              <li>
                Shipping fees vary by destination and are shown at checkout.
              </li>
              <li>
                Customs duties and taxes are the customer's responsibility.
              </li>
            </ul>
          </section>

          {/* Tracking & Responsibility */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">📊</span>
              </div>
              <h2 className="text-xl font-semibold text-primary-900 font-playfair">
                Tracking & Responsibility
              </h2>
            </div>
            <ul className="space-y-2 list-disc list-inside font-poppins text-primary-700">
              <li>Tracking details are emailed once your order ships.</li>
              <li>
                Please double-check your address and contact info; failed deliveries require a re-delivery fee.
              </li>
              <li>
                <span className="text-primary font-playfair">Kavan The Brand</span> is not responsible for customs delays, lost, or stolen packages once marked as delivered.
              </li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="bg-primary rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold mb-3 font-playfair text-white">Need Help?</h2>
            <p className="text-primary-100 mb-4 font-poppins">
              For questions or any concerns about your order, or our shipping policies:
            </p>
            <div className="space-y-2">
              <p className="font-poppins text-primary-100">
                <strong className="font-playfair">Email:</strong> admin@kavanthebrand.com
              </p>
              <p className="font-poppins text-primary-100">
                <strong className="font-playfair">WhatsApp/Call:</strong> +234 703 621 0107
              </p>
            </div>
          </section>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm font-poppins text-primary-600">
            Thank you for choosing <span className="text-primary font-playfair">Kavan The Brand</span>. We appreciate your business and look forward to serving you!
          </p>
        </div>
      </div>
    </main>
  );
};

export default DeliveryPolicy;