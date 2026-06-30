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
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <p className="text-slate-600 text-sm font-poppins leading-relaxed mb-8">
          At{" "}
          <strong className="text-primary font-playfair">
            Kavan The Brand
          </strong>{" "}
          ("Kavan," "we," "our," "us"), we respect your privacy and are
          committed to protecting your personal information. This policy
          explains how we collect, use, and safeguard the details you share with
          us.
        </p>

        <div className="space-y-6">
          {[
            {
              num: "1",
              title: "Information We Collect",
              content: (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 font-playfair text-sm mb-2">
                      When You Place an Order
                    </h3>
                    <ul className="text-slate-600 text-sm space-y-1 font-poppins list-disc list-inside">
                      <li>Name, email address, and phone number</li>
                      <li>Shipping address</li>
                      <li>Items ordered (name, size, colour, quantity)</li>
                      <li>Payment method and transaction reference</li>
                    </ul>
                    <p className="text-slate-400 text-xs mt-2 font-poppins">
                      We do not store card details — payments are processed
                      securely by Paystack.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 font-playfair text-sm mb-2">
                      When You Subscribe to Our Newsletter
                    </h3>
                    <ul className="text-slate-600 text-sm space-y-1 font-poppins list-disc list-inside">
                      <li>Email address</li>
                      <li>Name (optional)</li>
                    </ul>
                    <h3 className="font-semibold text-slate-800 font-playfair text-sm mb-2 mt-4">
                      Automatically via Cookies & Tracking
                    </h3>
                    <ul className="text-slate-600 text-sm space-y-1 font-poppins list-disc list-inside">
                      <li>Device type and browser</li>
                      <li>Pages visited and actions taken</li>
                      <li>Meta (Facebook) Pixel for ad performance</li>
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
                    [
                      "Order Processing & Delivery",
                      "To fulfill, pack, and ship your order and send you confirmation and updates.",
                    ],
                    [
                      "Customer Communication",
                      "To respond to inquiries submitted via our contact form or WhatsApp.",
                    ],
                    [
                      "Newsletter",
                      "To send style updates and offers to subscribers. You can unsubscribe at any time.",
                    ],
                    [
                      "Ad Performance",
                      "Meta Pixel data helps us understand how our ads perform. No personal details are sold.",
                    ],
                  ].map(([title, body]) => (
                    <li key={title} className="flex gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                      <span>
                        <strong className="text-slate-800 font-playfair">
                          {title}:
                        </strong>{" "}
                        {body}
                      </span>
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
                  <p className="font-medium text-slate-800">
                    We do not sell your personal data to third parties.
                  </p>
                  <p>
                    We share only what is necessary with trusted partners to
                    fulfil your order:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Paystack — to process payments securely</li>
                    <li>
                      Shipping carriers (e.g. DHL, GIG, GUO) — to deliver your
                      order
                    </li>
                    <li>
                      Meta — aggregated pixel data for ad performance only
                    </li>
                  </ul>
                </div>
              ),
            },
            {
              num: "4",
              title: "Data Security",
              content: (
                <div className="space-y-3 text-sm font-poppins text-slate-600">
                  <p>
                    Order and subscriber data is stored securely. Payment
                    processing is handled entirely by Paystack — we never see or
                    store your card details.
                  </p>
                  <p className="text-slate-500">
                    No method of transmission over the internet is 100% secure,
                    but we take reasonable measures to protect your information.
                  </p>
                </div>
              ),
            },
            {
              num: "5",
              title: "Your Rights",
              content: (
                <div className="space-y-3 text-sm font-poppins text-slate-600">
                  <p>
                    You can request access to, correction of, or deletion of
                    your personal data at any time by contacting us.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <a
                      href="mailto:admin@kavanthebrand.com"
                      className="border border-slate-200 rounded-lg p-3 hover:border-primary transition-colors"
                    >
                      <p className="font-semibold text-slate-800 font-playfair text-xs mb-0.5">
                        Email Us
                      </p>
                      <p className="text-primary text-xs">
                        admin@kavanthebrand.com
                      </p>
                    </a>
                    <a
                      href="https://wa.me/2347036210107"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-slate-200 rounded-lg p-3 hover:border-primary transition-colors"
                    >
                      <p className="font-semibold text-slate-800 font-playfair text-xs mb-0.5">
                        WhatsApp / Call
                      </p>
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
                  <p>
                    We use cookies to keep your cart active and to run the Meta
                    Pixel, which helps us measure the effectiveness of our
                    advertising. We do not use cookies to track you across other
                    websites for personal profiling.
                  </p>
                  <p className="text-slate-500">
                    You can disable cookies in your browser settings. This may
                    affect cart functionality.
                  </p>
                </div>
              ),
            },
            {
              num: "7",
              title: "Policy Updates",
              content: (
                <div className="space-y-2 text-sm font-poppins text-slate-600">
                  <p>
                    We may update this policy from time to time to reflect
                    changes in how we operate. The date at the top of this page
                    will always show when it was last revised.
                  </p>
                  <p className="text-slate-500">
                    Continued use of our site after updates means you accept the
                    revised policy.
                  </p>
                </div>
              ),
            },
          ].map(({ num, title, content }, i, arr) => (
            <div key={num}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-base font-light text-primary font-playfair">
                  {num.padStart(2, "0")}
                </span>
                <h2 className="text-base font-semibold text-slate-900 font-playfair">
                  {title}
                </h2>
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
