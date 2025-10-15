// src/app/privacy-policy/page.js

const Page = () => {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
            Privacy Policy
          </h1>
          <p className="text-gray-600 text-lg font-cormorant">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
          <p className="text-gray-700 text-lg leading-relaxed font-cormorant">
            At <strong className="font-playfair">Kavan The Brand</strong> ("Kavan," "we," "our," "us"), we
            respect your privacy and are committed to protecting your personal
            information. This policy explains how we collect, use, and safeguard
            the details you share with us.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Section 1: Information We Collect */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-start mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-3 font-playfair">1</span>
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                Information We Collect
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center font-playfair">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Personal Details
                </h3>
                <ul className="text-blue-800 text-sm space-y-2 font-cormorant">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Name and contact information
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Email address and phone number
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Shipping and billing addresses
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Payment information
                  </li>
                </ul>
                <p className="text-blue-700 text-xs mt-2 font-cormorant">
                  Collected when you place an order or create an account
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center font-playfair">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Usage Data
                </h3>
                <ul className="text-green-800 text-sm space-y-2 font-cormorant">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Device type and browser information
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    IP address and location data
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Website interaction patterns
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    Cookies and similar technologies
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-start mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-3 font-playfair">2</span>
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                How We Use Your Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-purple-600 font-bold">📦</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 font-playfair">
                    Order Processing & Delivery
                  </h3>
                  <p className="text-gray-700 font-cormorant">
                    To process and deliver your orders efficiently
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-blue-600 font-bold">💬</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 font-playfair">
                    Customer Communication
                  </h3>
                  <p className="text-gray-700 font-cormorant">
                    To send updates about your purchase and respond to inquiries
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-green-600 font-bold">✨</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 font-playfair">
                    Service Improvement
                  </h3>
                  <p className="text-gray-700 font-cormorant">
                    To enhance our website, products, and customer experience
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-orange-600 font-bold">📢</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 font-playfair">
                    Marketing Communications
                  </h3>
                  <p className="text-gray-700 font-cormorant">
                    For marketing emails or texts only with your opt-in consent
                  </p>
                  <p className="text-gray-600 text-sm mt-1 font-cormorant">
                    You can unsubscribe at any time
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Sharing Your Information */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-start mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-3 font-playfair">3</span>
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                Sharing Your Information
              </h2>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-red-700 font-semibold font-cormorant">
                🔒 We do not sell your personal data to third parties.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 font-playfair">
                Trusted Service Providers
              </h3>
              <p className="text-gray-700 mb-3 font-cormorant">
                We only share necessary details with trusted partners to fulfill
                your orders:
              </p>
              <ul className="text-gray-700 text-sm space-y-1 font-cormorant">
                <li className="flex items-center">
                  <span className="text-gray-500 mr-2">•</span>
                  Payment processors for secure transactions
                </li>
                <li className="flex items-center">
                  <span className="text-gray-500 mr-2">•</span>
                  Shipping carriers like DHL for delivery
                </li>
                <li className="flex items-center">
                  <span className="text-gray-500 mr-2">•</span>
                  Service providers essential for order fulfillment
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-start mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-3 font-playfair">4</span>
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                Data Security
              </h2>
            </div>

            <div className="flex items-start mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-green-600 font-bold">🛡️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 font-playfair">
                  Industry-Standard Protection
                </h3>
                <p className="text-gray-700 font-cormorant">
                  We use industry-standard security measures to protect your
                  personal data
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-700 text-sm font-cormorant">
                <strong className="font-playfair">Important:</strong> While we implement robust security
                measures, no method of transmission over the internet is 100%
                secure. Please keep your account password confidential and do
                not share it with anyone.
              </p>
            </div>
          </section>

          {/* Section 5: Your Rights */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-start mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-3 font-playfair">5</span>
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">Your Rights</h2>
            </div>

            <p className="text-gray-700 mb-4 font-cormorant">
              You have the right to access, correct, or delete your personal
              data at any time.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 text-xl">📧</span>
                </div>
                <h3 className="font-semibold text-blue-900 mb-2 font-playfair">Email Us</h3>
                <a
                  href="mailto:admin@kavanthebrand.com"
                  className="text-blue-700 hover:text-blue-900 font-cormorant"
                >
                  admin@kavanthebrand.com
                </a>
              </div>

              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 text-xl">💬</span>
                </div>
                <h3 className="font-semibold text-green-900 mb-2 font-playfair">
                  WhatsApp/Call
                </h3>
                <a
                  href="https://wa.me/2347036210107"
                  className="text-green-700 hover:text-green-900 font-cormorant"
                >
                  +234 703 621 0107
                </a>
              </div>
            </div>

            <p className="text-gray-600 text-sm mt-4 text-center font-cormorant">
              Contact us for any privacy-related requests or questions about
              your data.
            </p>
          </section>

          {/* Section 6: Cookies */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-start mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-3 font-playfair">6</span>
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">Cookies</h2>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-purple-600 font-bold">🍪</span>
              </div>
              <div>
                <p className="text-gray-700 mb-3 font-cormorant">
                  Our site uses cookies to enhance your browsing experience and
                  analyze website traffic.
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-gray-600 text-sm font-cormorant">
                    You can disable cookies in your browser settings, but please
                    note that some site features may not function properly
                    without them.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7: Updates */}
          <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-start mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-3 font-playfair">7</span>
              <h2 className="text-2xl font-bold text-gray-900 font-playfair">
                Policy Updates
              </h2>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-3 font-cormorant">
                We may update this privacy policy occasionally to reflect
                changes in our practices or for other operational, legal, or
                regulatory reasons.
              </p>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-blue-700 text-sm font-cormorant">
                  <strong className="font-playfair">Continued Use:</strong> We encourage you to review
                  this policy periodically. Your continued use of our site after
                  changes have been made indicates your acceptance of the
                  updated policy.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          {/* <div className="bg-black text-white p-6 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-2 font-playfair">
              Questions About Our Privacy Policy?
            </h3>
            <p className="mb-4 opacity-90 font-cormorant">
              We're here to help you understand how we protect your data
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:admin@kavanthebrand.com"
                className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors font-inter"
              >
                <span className="mr-2">📧</span>
                Email Us
              </a>
              <a
                href="https://wa.me/2347036210107"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors font-inter"
              >
                <span className="mr-2">💬</span>
                WhatsApp Chat
              </a>
            </div>
          </div> */}
        </div>
      </div>
    </main>
  );
};

export default Page;