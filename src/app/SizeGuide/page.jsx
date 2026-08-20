import Image from "next/image";

const BODY_SIZES = [
  { size: "6", bust: "32", waist: "25", hips: "36" },
  { size: "8", bust: "34", waist: "27", hips: "38" },
  { size: "10", bust: "36", waist: "30", hips: "40" },
  { size: "12", bust: "38", waist: "32", hips: "43" },
  { size: "14", bust: "41", waist: "34", hips: "45" },
  { size: "16", bust: "43", waist: "36", hips: "48" },
  { size: "18", bust: "45", waist: "38", hips: "50" },
  { size: "20", bust: "48", waist: "40", hips: "54" },
  { size: "22", bust: "50", waist: "42", hips: "56" },
  { size: "24", bust: "52", waist: "44", hips: "59" },
];

const LENGTHS = [
  { label: "Petite", height: "5'0–5'3ft", pants: "42", dress: "56" },
  { label: "Petite +", height: "5'4–5'5ft", pants: "43", dress: "57" },
  { label: "Average", height: "5'6–5'7ft", pants: "45", dress: "58" },
  { label: "Average +", height: "5'8–5'9ft", pants: "47", dress: "60" },
  { label: "Tall", height: "5'10–5'11ft", pants: "49", dress: "63" },
  { label: "Very Tall", height: "6ft+", pants: "52", dress: "65" },
];

export const metadata = {
  title: "Size Guide",
  description:
    "Find your perfect fit with Kavan The Brand's size guide — body measurements, length guide, and how to measure yourself at home.",
};

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

        {/* Not-UK-sizing notice */}
        <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-8">
          <p className="text-slate-700 font-poppins text-sm leading-relaxed">
            <span className="font-semibold text-primary">Please note:</span> our
            sizes are <span className="font-semibold">not UK sizing</span>, so
            kindly double-check your measurements against the chart below to
            avoid any mix-ups. If you don&apos;t fit into any of the listed
            sizes, you can share your exact measurements — we cater to all
            sizes.
          </p>
        </div>

        {/* Body Measurements */}
        <section className="mb-8">
          <h2 className="text-lg font-light text-slate-900 font-playfair mb-1">
            Body Measurements
          </h2>
          <div className="w-8 h-px bg-primary mb-3" />

          <div className="scrollbar-visible overflow-x-auto rounded-lg border border-slate-200">
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
                {BODY_SIZES.map((row, i) => (
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

        {/* Height & Length */}
        <section className="mb-8">
          <h2 className="text-lg font-light text-slate-900 font-playfair mb-1">
            Height &amp; Length
          </h2>
          <div className="w-8 h-px bg-primary mb-3" />

          <div className="scrollbar-visible overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full border-collapse min-w-[380px]">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 text-left font-medium font-playfair text-sm whitespace-nowrap">
                    HEIGHT
                  </th>
                  <th className="p-3 text-center font-medium font-playfair text-sm whitespace-nowrap">
                    PANTS / SKIRT
                  </th>
                  <th className="p-3 text-center font-medium font-playfair text-sm whitespace-nowrap">
                    DRESS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LENGTHS.map((row, i) => (
                  <tr
                    key={row.label}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  >
                    <td className="p-3 font-poppins text-sm whitespace-nowrap">
                      <span className="font-semibold text-primary font-playfair">
                        {row.label}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {row.height}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                      {row.pants}&quot;
                    </td>
                    <td className="p-3 text-center text-slate-700 font-poppins text-sm whitespace-nowrap">
                      {row.dress}&quot;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 font-poppins mt-3 leading-relaxed">
            These are high waist to feet measurements. If you would like it to
            fit longer, please go for a taller length or share your exact
            length.
          </p>
        </section>

        <hr className="border-slate-100 mb-8" />

        {/* How to Measure — illustrated guide */}
        <section className="mb-8">
          <h2 className="text-lg font-light text-slate-900 font-playfair mb-1">
            How to Measure Yourself
          </h2>
          <div className="w-8 h-px bg-primary mb-3" />
          <p className="text-slate-600 text-sm font-poppins mb-4 leading-relaxed">
            Use this guide to take your body measurements at home. Wear fitted
            clothing, keep the tape snug but not tight, stand straight, and take
            each measurement twice for accuracy.
          </p>

          <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
            <Image
              src="/how-to-measure.jpg"
              alt="Kavan The Brand measurement instrument — illustrated guide showing how to measure natural waist, bust circumference, bust divergence, bust to waist length, neck circumference, neck to waist length, shoulder to waist length, shoulder length, and shoulder length to the shoulder."
              width={1320}
              height={2170}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>

          <a
            href="/how-to-measure.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary hover:text-primary/80 underline underline-offset-2 font-poppins transition-colors"
          >
            Open full size
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </section>

        {/* CTA */}
        <div className="bg-primary rounded-xl p-6 text-center">
          <h3 className="text-lg font-light mb-2 font-playfair text-white">
            Need a Custom Size?
          </h3>
          <p className="text-white/80 text-sm mb-4 max-w-md mx-auto font-poppins">
            If your measurements fall outside our standard sizes, we&apos;re
            happy to create custom pieces just for you — simply send us your
            measurements.
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
