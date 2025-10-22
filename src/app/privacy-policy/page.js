// src/app/privacy-policy/page.js

const Page = () => {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="container-custom max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full shadow-lg mb-4 border border-primary-100">
            <span className="text-3xl text-primary">🔒</span>
          </div>
          <h1 className="text-4xl font-bold text-primary-900 mb-4 font-playfair">
            Privacy Policy
          </h1>
          <p className="text-primary-600 text-lg font-poppins">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6 mb-6">
          <p className="text-primary-700 text-lg leading-relaxed font-poppins">
            At <strong className="font-playfair text-primary">Kavan The Brand</strong> ("Kavan," "we," "our," "us"), we
            respect your privacy and are committed to protecting your personal
            information. This policy explains how we collect, use, and safeguard
            the details you share with us.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Section 1: Information We Collect */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">1</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                Information We Collect
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-3 font-playfair">
                  Personal Details
                </h3>
                <ul className="text-primary-700 text-sm space-y-2 font-poppins">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Name and contact information
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Email address and phone number
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Shipping and billing addresses
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Payment information
                  </li>
                </ul>
                <p className="text-primary-600 text-xs mt-2 font-poppins">
                  Collected when you place an order or create an account
                </p>
              </div>

              <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                <h3 className="font-semibold text-primary-900 mb-3 font-playfair">
                  Usage Data
                </h3>
                <ul className="text-primary-700 text-sm space-y-2 font-poppins">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Device type and browser information
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    IP address and location data
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Website interaction patterns
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Cookies and similar technologies
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">2</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                How We Use Your Information
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start p-3 rounded-lg border border-primary-100">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary text-sm">📦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-1 font-playfair">
                    Order Processing & Delivery
                  </h3>
                  <p className="text-primary-700 font-poppins text-sm">
                    To process and deliver your orders efficiently
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg border border-primary-100">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary text-sm">💬</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-1 font-playfair">
                    Customer Communication
                  </h3>
                  <p className="text-primary-700 font-poppins text-sm">
                    To send updates about your purchase and respond to inquiries
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg border border-primary-100">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary text-sm">✨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-1 font-playfair">
                    Service Improvement
                  </h3>
                  <p className="text-primary-700 font-poppins text-sm">
                    To enhance our website, products, and customer experience
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg border border-primary-100">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary text-sm">📢</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-900 mb-1 font-playfair">
                    Marketing Communications
                  </h3>
                  <p className="text-primary-700 font-poppins text-sm">
                    For marketing emails or texts only with your opt-in consent
                  </p>
                  <p className="text-primary-600 text-xs mt-1 font-poppins">
                    You can unsubscribe at any time
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Sharing Your Information */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">3</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                Sharing Your Information
              </h2>
            </div>

            <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
              <p className="text-red-700 font-semibold font-poppins text-sm">
                🔒 We do not sell your personal data to third parties.
              </p>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <h3 className="font-semibold text-primary-900 mb-2 font-playfair">
                Trusted Service Providers
              </h3>
              <p className="text-primary-700 mb-3 font-poppins text-sm">
                We only share necessary details with trusted partners to fulfill your orders:
              </p>
              <ul className="text-primary-700 text-sm space-y-1 font-poppins">
                <li className="flex items-center">
                  <span className="text-primary mr-2">•</span>
                  Payment processors for secure transactions
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">•</span>
                  Shipping carriers like DHL for delivery
                </li>
                <li className="flex items-center">
                  <span className="text-primary mr-2">•</span>
                  Service providers essential for order fulfillment
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">4</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                Data Security
              </h2>
            </div>

            <div className="flex items-start mb-4">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-primary text-sm">🛡️</span>
              </div>
              <div>
                <h3 className="font-semibold text-primary-900 mb-1 font-playfair">
                  Industry-Standard Protection
                </h3>
                <p className="text-primary-700 font-poppins text-sm">
                  We use industry-standard security measures to protect your personal data
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <p className="text-yellow-700 text-sm font-poppins">
                <strong className="font-playfair">Important:</strong> While we implement robust security
                measures, no method of transmission over the internet is 100%
                secure. Please keep your account password confidential and do
                not share it with anyone.
              </p>
            </div>
          </section>

          {/* Section 5: Your Rights */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">5</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">Your Rights</h2>
            </div>

            <p className="text-primary-700 mb-4 font-poppins">
              You have the right to access, correct, or delete your personal
              data at any time.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg text-center border border-primary-200">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary">📧</span>
                </div>
                <h3 className="font-semibold text-primary-900 mb-1 font-playfair text-sm">Email Us</h3>
                <a
                  href="mailto:admin@kavanthebrand.com"
                  className="text-primary-700 hover:text-primary-900 font-poppins text-sm"
                >
                  admin@kavanthebrand.com
                </a>
              </div>

              <div className="bg-primary-50 p-4 rounded-lg text-center border border-primary-200">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary">💬</span>
                </div>
                <h3 className="font-semibold text-primary-900 mb-1 font-playfair text-sm">
                  WhatsApp/Call
                </h3>
                <a
                  href="https://wa.me/2347036210107"
                  className="text-primary-700 hover:text-primary-900 font-poppins text-sm"
                >
                  +234 703 621 0107
                </a>
              </div>
            </div>

            <p className="text-primary-600 text-sm mt-4 text-center font-poppins">
              Contact us for any privacy-related requests or questions about your data.
            </p>
          </section>

          {/* Section 6: Cookies */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">6</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">Cookies</h2>
            </div>

            <div className="flex items-start">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <span className="text-primary text-sm">🍪</span>
              </div>
              <div>
                <p className="text-primary-700 mb-3 font-poppins text-sm">
                  Our site uses cookies to enhance your browsing experience and analyze website traffic.
                </p>
                <div className="bg-primary-50 p-3 rounded border border-primary-200">
                  <p className="text-primary-700 text-sm font-poppins">
                    You can disable cookies in your browser settings, but please note that some site features may not function properly without them.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Updates */}
          <section className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-lg text-primary">7</span>
              </div>
              <h2 className="text-xl font-bold text-primary-900 font-playfair">
                Policy Updates
              </h2>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
              <p className="text-primary-700 mb-3 font-poppins text-sm">
                We may update this privacy policy occasionally to reflect changes in our practices or for other operational, legal, or regulatory reasons.
              </p>
              <div className="bg-primary-100 p-3 rounded">
                <p className="text-primary-800 text-sm font-poppins">
                  <strong className="font-playfair">Continued Use:</strong> We encourage you to review this policy periodically. Your continued use of our site after changes have been made indicates your acceptance of the updated policy.
                </p>
              </div>
            </div>
          </section>          
        </div>
      </div>
    </main>
  );
};

export default Page;