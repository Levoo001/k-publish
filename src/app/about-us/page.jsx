// src/app/about-us/page.js

const AboutUs = () => {
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container-custom max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 font-playfair tracking-wide">
            About Kavan
          </h1>
          <p className="text-gray-600 text-lg font-cormorant">
            Where strength meets softness in contemporary fashion
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-gray-50 p-6 md:p-8 mb-8 border-l-4 border-black">
          <p className="text-gray-700 text-lg leading-relaxed font-cormorant">
            <strong>Kavan</strong> is a contemporary fashion brand for women in
            their soft but powerful era. We create timeless, sophisticated
            pieces that honor both strength and softness, legacy and
            individuality.
          </p>
        </div>

        {/* Founder's Story Section */}
        <section className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-start mb-6">
            <span className="text-2xl font-light text-gray-900 mr-4 font-playfair">01</span>
            <h2 className="text-2xl font-light text-gray-900 font-playfair tracking-wide">Founder's Story</h2>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed font-cormorant ml-10">
            <div className="bg-black text-white p-6 mb-4">
              <p className="text-lg leading-relaxed italic font-cormorant">
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

            <div className="border-l-2 border-gray-300 pl-4 mt-4">
              <p className="text-gray-700 font-cormorant">
                That dream grew into Kavan: a brand for women who, like me, have spent years being strong for everyone else and are ready to celebrate themselves—soft, powerful, and beautifully feminine.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Section 2: Our Philosophy */}
          <section className="border-b border-gray-200 pb-8">
            <div className="flex items-start mb-6">
              <span className="text-2xl font-light text-gray-900 mr-4 font-playfair">02</span>
              <h2 className="text-2xl font-light text-gray-900 font-playfair tracking-wide">
                Our Philosophy
              </h2>
            </div>

            <div className="space-y-4 text-gray-700 leading-relaxed font-cormorant ml-10">
              <p>
                Our designs balance structure and fluidity, echoing the
                dualities women navigate daily: resilience and rest, elegance
                and ease, tradition and modernity.
              </p>
              <div className="border-l-2 border-gray-300 pl-4 mt-4">
                <p className="text-gray-700 font-cormorant">
                  Each piece is intentionally crafted to whisper: You are seen.
                  You are powerful. You are allowed to be soft.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Mission & Vision */}
          <section className="border-b border-gray-200 pb-8">
            <div className="flex items-start mb-6">
              <span className="text-2xl font-light text-gray-900 mr-4 font-playfair">03</span>
              <h2 className="text-2xl font-light text-gray-900 font-playfair tracking-wide">
                Mission & Vision
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 ml-10">
              <div className="border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3 font-playfair">
                  Our Mission
                </h3>
                <p className="text-gray-700 font-cormorant">
                  To design intentional garments that affirm women's strength
                  and softness, empowering them to lead their lives with
                  elegance, confidence, and ease.
                </p>
              </div>

              <div className="border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3 font-playfair">
                  Our Vision
                </h3>
                <p className="text-gray-700 font-cormorant">
                  To grow into a global fashion house rooted in African elegance
                  and timeless design — creating pieces that carry stories,
                  legacies, and the fullness of womanhood beyond seasons.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Our Values */}
          <section className="border-b border-gray-200 pb-8">
            <div className="flex items-start mb-6">
              <span className="text-2xl font-light text-gray-900 mr-4 font-playfair">04</span>
              <h2 className="text-2xl font-light text-gray-900 font-playfair tracking-wide">Our Values</h2>
            </div>

            <div className="space-y-4 ml-10">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 font-playfair">Legacy</h3>
                  <p className="text-gray-700 font-cormorant">
                    Honoring women's stories, the journeys they walk, and the
                    weight they carry
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 font-playfair">Elegance</h3>
                  <p className="text-gray-700 font-cormorant">
                    Designing pieces that are timeless, sophisticated, and
                    versatile
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 font-playfair">
                    Strength in Softness
                  </h3>
                  <p className="text-gray-700 font-cormorant">
                    Affirming the power found in femininity and rest
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-2 h-2 bg-black rounded-full mt-2 mr-4 flex-shrink-0"></div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 font-playfair">
                    Craftsmanship
                  </h3>
                  <p className="text-gray-700 font-cormorant">
                    Creating intentional, well-made garments that last
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: The Kavan Woman */}
          <section className="pb-8">
            <div className="flex items-start mb-6">
              <span className="text-2xl font-light text-gray-900 mr-4 font-playfair">05</span>
              <h2 className="text-2xl font-light text-gray-900 font-playfair tracking-wide">
                The Kavan Woman
              </h2>
            </div>

            <div className="bg-gray-50 p-4 mb-4 ml-10">
              <p className="text-gray-700 font-cormorant">
                She is sophisticated yet grounded. Feminine yet commanding.
              </p>
            </div>

            <div className="space-y-4 text-gray-700 font-cormorant ml-10">
              <p>
                She embodies quiet power in the way she carries herself, and
                effortless softness in how she chooses to rest, feel, and
                express her individuality.
              </p>
              <p>
                Whether she is the first-born daughter carrying legacy, or any
                woman navigating her own era of strength and softness — she
                wears Kavan not just as fashion, but as a declaration of her
                presence in the world.
              </p>
            </div>
          </section>

          {/* Join Our Community */}
          <div className="bg-black text-white p-8 text-center mt-12">
            <h3 className="text-xl font-light mb-3 font-playfair tracking-wide">Join the Kavan Community</h3>
            <p className="mb-6 opacity-90 font-cormorant">
              Become part of a movement that celebrates the beautiful duality of
              womanhood
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/"
                className="inline-flex items-center bg-white text-black px-6 py-3 font-medium transition-colors hover:bg-gray-100 font-inter text-sm tracking-wide"
              >
                Explore Collections
              </a>
              <a
                href="/contact-us"
                className="inline-flex items-center bg-transparent border border-white text-white px-6 py-3 font-medium transition-colors hover:bg-white hover:text-black font-inter text-sm tracking-wide"
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