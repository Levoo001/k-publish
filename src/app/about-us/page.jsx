const AboutUs = () => {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container-custom max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-4 font-playfair tracking-wide">
            About <span className="text-primary">Kavan</span>
          </h1>
          <p className="text-slate-600 text-lg font-poppins">
            Where strength meets softness in contemporary fashion
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-primary-50 p-6 md:p-8 mb-8 border-l-4 border-primary">
          <p className="text-slate-700 text-lg leading-relaxed font-poppins">
            <strong className="text-primary">Kavan</strong> is a contemporary fashion brand for women in
            their soft but powerful era. We create timeless, sophisticated
            pieces that honor both strength and softness, legacy and
            individuality.
          </p>
        </div>

        {/* Founder's Story Section */}
        <section className="border-b border-slate-200 pb-8 mb-8">
          <div className="flex items-start mb-6">
            <span className="text-2xl font-light text-primary mr-4 font-playfair">01</span>
            <h2 className="text-2xl font-light text-slate-900 font-playfair tracking-wide">Founder's Story</h2>
          </div>

          <div className="space-y-6 text-slate-700 leading-relaxed font-poppins ml-10">
            <div className="bg-primary text-white p-6 mb-4">
              <p className="text-lg leading-relaxed italic font-poppins">
                "I never planned to be in fashion. I planned to be strong. But sometimes, the most powerful strength is found in embracing our softness."
              </p>
            </div>

            <p>
              For most of my life, I was the first daughter who carried the weight of responsibility with ease—always strong, always moving, always making money. Caring for everyone else came naturally; caring for myself rarely crossed my mind.
            </p>

            <p>
              Everything shifted after I gave birth to my son in March 2024. Six months later, hormonal changes meant the clothes I owned no longer felt like me. They didn't celebrate my femininity or the softer woman I was becoming.
            </p>

            <p>
              I began creating pieces that made me feel elegant, radiant, and effortlessly feminine—clothing that let me care for myself without trying too hard. What started as a personal journey to honor my own softness became a dream worth sharing.
            </p>

            <div className="border-l-2 border-primary pl-4 mt-4">
              <p className="text-slate-700 font-poppins">
                That dream grew into <strong className="text-primary">Kavan</strong>: a brand for women who, like me, have spent years being strong for everyone else and are ready to celebrate themselves—soft, powerful, and beautifully feminine.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 2: Our Philosophy */}
          <section className="border-b border-slate-200 pb-8">
            <div className="flex items-start mb-6">
              <span className="text-2xl font-light text-primary mr-4 font-playfair">02</span>
              <h2 className="text-2xl font-light text-slate-900 font-playfair tracking-wide">
                Our Philosophy
              </h2>
            </div>

            <div className="space-y-4 text-slate-700 leading-relaxed font-poppins ml-10">
              <p>
                Our designs balance structure and fluidity, echoing the
                dualities women navigate daily: resilience and rest, elegance
                and ease, tradition and modernity.
              </p>
              <div className="border-l-2 border-primary pl-4 mt-4">
                <p className="text-slate-700 font-poppins">
                  Each piece is intentionally crafted to whisper: You are seen.
                  You are powerful. You are allowed to be soft.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Mission & Vision */}
          <section className="border-b border-slate-200 pb-8">
            <div className="flex items-start mb-6">
              <span className="text-2xl font-light text-primary mr-4 font-playfair">03</span>
              <h2 className="text-2xl font-light text-slate-900 font-playfair tracking-wide">
                Mission & Vision
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 ml-10">
              <div className="border border-slate-200 p-6 hover:border-primary transition-colors">
                <h3 className="font-semibold text-primary mb-3 font-playfair">
                  Our Mission
                </h3>
                <p className="text-slate-700 font-poppins">
                  To design intentional garments that affirm women's strength
                  and softness, empowering them to lead their lives with
                  elegance, confidence, and ease.
                </p>
              </div>

              <div className="border border-slate-200 p-6 hover:border-primary transition-colors">
                <h3 className="font-semibold text-primary mb-3 font-playfair">
                  Our Vision
                </h3>
                <p className="text-slate-700 font-poppins">
                  To grow into a global fashion house rooted in African elegance
                  and timeless design — creating pieces that carry stories,
                  legacies, and the fullness of womanhood beyond seasons.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Our Values */}
          <section className="border-b border-slate-200 pb-8">
            <div className="flex items-start mb-6">
              <span className="text-2xl font-light text-primary mr-4 font-playfair">04</span>
              <h2 className="text-2xl font-light text-slate-900 font-playfair tracking-wide">Our Values</h2>
            </div>

            <div className="space-y-4 ml-10">
              <div className="flex items-start group hover:bg-primary-50 p-3 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 font-playfair group-hover:text-primary">Legacy</h3>
                  <p className="text-slate-700 font-poppins">
                    Honoring women's stories, the journeys they walk, and the
                    weight they carry
                  </p>
                </div>
              </div>

              <div className="flex items-start group hover:bg-primary-50 p-3 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 font-playfair group-hover:text-primary">Elegance</h3>
                  <p className="text-slate-700 font-poppins">
                    Designing pieces that are timeless, sophisticated, and
                    versatile
                  </p>
                </div>
              </div>

              <div className="flex items-start group hover:bg-primary-50 p-3 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 font-playfair group-hover:text-primary">
                    Strength in Softness
                  </h3>
                  <p className="text-slate-700 font-poppins">
                    Affirming the power found in femininity and rest
                  </p>
                </div>
              </div>

              <div className="flex items-start group hover:bg-primary-50 p-3 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 font-playfair group-hover:text-primary">
                    Craftsmanship
                  </h3>
                  <p className="text-slate-700 font-poppins">
                    Creating intentional, well-made garments that last
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: The Kavan Woman */}
          <section className="pb-8">
            <div className="flex items-start mb-6">
              <span className="text-2xl font-light text-primary mr-4 font-playfair">05</span>
              <h2 className="text-2xl font-light text-slate-900 font-playfair tracking-wide">
                The Kavan Woman
              </h2>
            </div>

            <div className="bg-primary-50 p-4 mb-4 ml-10">
              <p className="text-slate-700 font-poppins">
                She is sophisticated yet grounded. Feminine yet commanding.
              </p>
            </div>

            <div className="space-y-4 text-slate-700 font-poppins ml-10">
              <p>
                She embodies quiet power in the way she carries herself, and
                effortless softness in how she chooses to rest, feel, and
                express her individuality.
              </p>
              <p>
                Whether she is the first-born daughter carrying legacy, or any
                woman navigating her own era of strength and softness — she
                wears <strong className="text-primary">Kavan</strong> not just as fashion, but as a declaration of her
                presence in the world.
              </p>
            </div>
          </section>

          {/* Join Our Community */}
          <div className="bg-primary text-white p-8 text-center mt-12 rounded-lg">
            <h3 className="text-xl font-light mb-3 font-playfair tracking-wide">Join the Kavan Community</h3>
            <p className="mb-6 opacity-90 font-poppins">
              Become part of a movement that celebrates the beautiful duality of
              womanhood
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/"
                className="inline-flex items-center bg-white text-primary px-6 py-3 font-medium transition-colors hover:bg-slate-100 font-poppins text-sm tracking-wide rounded"
              >
                Explore Collections
              </a>
              <a
                href="/contact-us"
                className="inline-flex items-center bg-transparent border border-white text-white px-6 py-3 font-medium transition-colors hover:bg-white hover:text-primary font-poppins text-sm tracking-wide rounded"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;