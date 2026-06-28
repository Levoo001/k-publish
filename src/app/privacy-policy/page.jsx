const Page = () => {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-3xl mx-auto px-4">

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-2 font-playfair">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm font-poppins">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <p className="text-slate-600 text-sm font-poppins leading-relaxed mb-8">
          At <strong className="text-primary font-playfair">Kavan The Brand</strong> ("Kavan," "we," "our," "us"), we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard the details you share with us.
        </p>

        <div className="space-y-6">

          {[
            {
              num: "1",
              title: "Information We Collect",
              content: (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 font-playfair text-sm mb-2">Personal Details</h3>
                    <ul className="text-slate-600 text-sm space-y-1 font-poppins list-disc list-inside">
                      <li>Name and contact information</li>
                      <li>Email address and phone number</li>
                      <li>Shipping and billing addresses</li>
                      <li>Payment information</li>
                    </ul>
                    <p className="text-slate-400 text-xs mt-2 font-poppins">Collected when you place an order</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 font-playfair text-sm mb-2">Usage Data</h3>
                    <ul className="text-slate-600 text-sm space-y-1 font-poppins list-disc list-inside">
                      <li>Device type and browser information</li>
                      <li>IP address and location data</li>
                      <li>Website interaction patterns</li>
                      <li>Cookies and similar technologies</li>
                    </ul>
                  </div>
                </div>
              ),
            },
            {
              num: "2",
              title: "How We Use Your Information",
              content: (
                <ul className="space-y-2 text-sm font-poppins text-slate-600">
                  {[
                    ["Order Processing & Delivery", "To process and deliver your orders efficiently."],
                    ["Customer Communication", "To send updates about your purchase and respond to inquiries."],
                    ["Service Improvement", "To enhance our website, products, and customer experience."],
                    ["Marketing", "Only with your opt-in consent. You can unsubscribe at any time."],
                  ].map(([title, body]) => (
                    <li key={title} className="flex gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span><strong className="text-slate-800 font-playfair">{title}:</strong> {body}</span>
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              num: "3",
              title: "Sharing Your Information",
              content: (
                <div className="space-y-3 text-sm font-poppins text-slate-600">
                  <p className="font-medium text-slate-800">We do not sell your personal data to third parties.</p>
                  <p>We only share necessary details with trusted partners to fulfill your orders:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Payment processors for secure transactions</li>
                    <li>Shipping carriers like DHL for delivery</li>
                    <li>Service providers essential for order fulfillment</li>
                  </ul>
                </div>
              ),
            },
            {
              num: "4",
              title: "Data Security",
              content: (
                <div className="space-y-3 text-sm font-poppins text-slate-600">
                  <p>We use industry-standard security measures to protect your personal data.</p>
                  <p className="text-slate-500">While we implement robust security measures, no method of transmission over the internet is 100% secure. Please keep your account password confidential.</p>
                </div>
              ),
            },
            {
              num: "5",
              title: "Your Rights",
              content: (
                <div className="space-y-3 text-sm font-poppins text-slate-600">
                  <p>You have the right to access, correct, or delete your personal data at any time.</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <a href="mailto:admin@kavanthebrand.com" className="border border-slate-200 rounded-lg p-3 hover:border-primary transition-colors">
                      <p className="font-semibold text-slate-800 font-playfair text-xs mb-0.5">Email Us</p>
                      <p className="text-primary text-xs">admin@kavanthebrand.com</p>
                    </a>
                    <a href="https://wa.me/2347036210107" target="_blank" rel="noopener noreferrer" className="border border-slate-200 rounded-lg p-3 hover:border-primary transition-colors">
                      <p className="font-semibold text-slate-800 font-playfair text-xs mb-0.5">WhatsApp / Call</p>
                      <p className="text-primary text-xs">+234 703 621 0107</p>
                    </a>
                  </div>
                </div>
              ),
            },
            {
              num: "6",
              title: "Cookies",
              content: (
                <div className="space-y-2 text-sm font-poppins text-slate-600">
                  <p>Our site uses cookies to enhance your browsing experience and analyze website traffic.</p>
                  <p className="text-slate-500">You can disable cookies in your browser settings, but some site features may not function properly without them.</p>
                </div>
              ),
            },
            {
              num: "7",
              title: "Policy Updates",
              content: (
                <div className="space-y-2 text-sm font-poppins text-slate-600">
                  <p>We may update this privacy policy occasionally to reflect changes in our practices or for legal or regulatory reasons.</p>
                  <p className="text-slate-500">Your continued use of our site after changes have been made indicates your acceptance of the updated policy.</p>
                </div>
              ),
            },
          ].map(({ num, title, content }, i, arr) => (
            <div key={num}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-base font-light text-primary font-playfair">{num.padStart(2, "0")}</span>
                <h2 className="text-base font-semibold text-slate-900 font-playfair">{title}</h2>
              </div>
              {content}
              {i < arr.length - 1 && <hr className="border-slate-100 mt-6" />}
            </div>
          ))}

        </div>
      </div>
    </main>
  );
};

export default Page;
