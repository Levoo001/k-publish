const SizeGuide = () => {
  return (
    <main className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-light text-slate-900 mb-2 font-playfair">
            Size <span className="text-primary">Guide</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-poppins">
            Find your perfect fit. All measurements are in inches.
          </p>
        </div>

        {/* Notice */}
        <p className="text-slate-600 font-poppins text-sm mb-8 text-center">
          If your measurements fall between sizes or outside our standard range,
          we offer{" "}
          <a
            href="/contact-us"
            className="text-primary underline underline-offset-2"
          >
            custom sizing
          </a>{" "}
          upon request.
        </p>

        {/* Clothing Size Guide */}
        <section className="mb-8">
          <h2 className="text-lg font-light text-slate-900 font-playfair mb-1">
            Clothing Size Guide
          </h2>
          <div className="w-8 h-px bg-primary mb-3" />

          <div className="scrollbar-visible overflow-x-scroll rounded-lg border border-slate-200">
            <table className="w-full border-collapse min-w-[320px]">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 text-left font-medium font-playfair text-sm">
                    SIZE
                  </th>
                  <th className="p-3 text-center font-medium font-playfair text-sm">
                    BUST
                  </th>
                  <th className="p-3 text-center font-medium font-playfair text-sm">
                    WAIST
                  </th>
                  <th className="p-3 text-center font-medium font-playfair text-sm">
                    HIPS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { size: "6", bust: "32", waist: "25", hips: "36" },
                  { size: "8", bust: "34", waist: "37", hips: "38" },
                  { size: "10", bust: "36", waist: "30", hips: "43" },
                  { size: "12", bust: "41", waist: "34", hips: "45" },
                  { size: "14", bust: "43", waist: "36", hips: "48" },
                  { size: "16", bust: "45", waist: "38", hips: "50" },
                  { size: "18", bust: "48", waist: "40", hips: "54" },
                  { size: "20", bust: "50", waist: "44", hips: "56" },
                  { size: "22", bust: "52", waist: "44", hips: "59" },
                ].map((row, i) => (
                  <tr
                    key={row.size}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="p-3 font-semibold text-primary font-playfair text-sm">
                      {row.size}
                    </td>
                    <td className="p-3 text-center text-slate-700 font-poppins text-sm">
                      {row.bust}&quot;
                    </td>
                    <td className="p-3 text-center text-slate-700 font-poppins text-sm">
                      {row.waist}&quot;
                    </td>
                    <td className="p-3 text-center text-slate-700 font-poppins text-sm">
                      {row.hips}&quot;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="border-slate-100 mb-8" />

        {/* Length Guide */}
        <section className="mb-8">
          <h2 className="text-lg font-light text-slate-900 font-playfair mb-1">
            Length Guide
          </h2>
          <div className="w-8 h-px bg-primary mb-3" />

          <div className="scrollbar-visible overflow-x-scroll rounded-lg border border-slate-200">
            <table className="w-full border-collapse min-w-[480px]">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 text-left font-medium font-playfair text-sm whitespace-nowrap">
                    HEIGHT RANGE
                  </th>
                  <th className="p-3 text-center font-medium font-playfair text-sm whitespace-nowrap">
                    PETITE+
                  </th>
                  <th className="p-3 text-center font-medium font-playfair text-sm whitespace-nowrap">
                    AVERAGE
                  </th>
                  <th className="p-3 text-center font-medium font-playfair text-sm whitespace-nowrap">
                    AVERAGE+
                  </th>
                  <th className="p-3 text-center font-medium font-playfair text-sm whitespace-nowrap">
                    VERY TALL
                  </th>
                </tr>
                <tr className="bg-slate-50">
                  <th className="p-2 text-left text-sm font-medium text-slate-600 font-playfair whitespace-nowrap">
                    HEIGHT
                  </th>
                  <th className="p-2 text-center text-sm font-medium text-slate-600 font-playfair whitespace-nowrap">
                    5'0"–5'3"
                  </th>
                  <th className="p-2 text-center text-sm font-medium text-slate-600 font-playfair whitespace-nowrap">
                    5'4"–5'7"
                  </th>
                  <th className="p-2 text-center text-sm font-medium text-slate-600 font-playfair whitespace-nowrap">
                    5'8"–5'9"
                  </th>
                  <th className="p-2 text-center text-sm font-medium text-slate-600 font-playfair whitespace-nowrap">
                    6'0"+
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-white">
                  <td className="p-3 font-semibold text-primary font-playfair text-sm whitespace-nowrap">
                    PANTS / SKIRT
                  </td>
                  <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                    42&quot;
                  </td>
                  <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                    45&quot;
                  </td>
                  <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                    47&quot;
                  </td>
                  <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                    52&quot;
                  </td>
                </tr>
                <tr className="bg-slate-50/50">
                  <td className="p-3 font-semibold text-primary font-playfair text-sm whitespace-nowrap">
                    DRESS LENGTH
                  </td>
                  <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                    56&quot;
                  </td>
                  <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                    58&quot;
                  </td>
                  <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                    60&quot;
                  </td>
                  <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                    65&quot;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 font-poppins mt-2 md:hidden text-right">
            ← scroll to see all →
          </p>
          <p className="text-xs text-slate-500 font-poppins mt-3">
            Measurements are waist to feet. For a longer fit, go for the next
            height range.
          </p>
        </section>

        <hr className="border-slate-100 mb-8" />

        {/* How to Measure */}
        <section className="mb-8">
          <h2 className="text-lg font-light text-slate-900 font-playfair mb-1">
            How to Measure
          </h2>
          <div className="w-8 h-px bg-primary mb-4" />

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Bust",
                body: "Measure around the fullest part of your bust, keeping the tape parallel to the floor.",
              },
              {
                title: "Waist",
                body: "Measure around the narrowest part of your waist, typically above your belly button.",
              },
              {
                title: "Hips",
                body: "Measure around the fullest part of your hips, approximately 7–8 inches below your waist.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="border border-slate-100 rounded-lg p-4"
              >
                <h3 className="font-semibold text-slate-900 font-playfair mb-1.5 text-sm">
                  {title}
                </h3>
                <p className="text-slate-600 text-sm font-poppins leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-xl p-6 text-center">
          <h3 className="text-lg font-light mb-2 font-playfair text-white">
            Need a Custom Size?
          </h3>
          <p className="text-white/80 text-sm mb-4 max-w-md mx-auto font-poppins">
            If your measurements fall outside our standard sizes, we're happy to
            create custom pieces just for you.
          </p>
          <a
            href="/contact-us"
            className="inline-flex items-center justify-center bg-white text-primary px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors font-poppins"
          >
            Request Custom Sizing
          </a>
        </div>
      </div>
    </main>
  );
};

export default SizeGuide;
