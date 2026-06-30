// src/components/ShopClient.jsx

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
export default function ShopClient({ products }) {
  const router = useRouter();

  // Collection filtering — uses `collection` field if set, falls back to name matching
  const REBIRTH_NAMES = [
    "the amarachi set",
    "the chisom dress",
    "the amara set",
    "the zahra dress",
    "the adanna dress",
  ];
  const isRebirth = (p) =>
    p.collection === "rebirth" ||
    (!p.collection && REBIRTH_NAMES.includes(p.name?.toLowerCase().trim()));
  const bloomCollection = products.filter((p) => !isRebirth(p));
  const rebirthCollection = products.filter(isRebirth);

  const handleProductClick = (product) => {
    const slug = product.slug?.current || encodeURIComponent(product.name);
    router.push(`/products/${slug}`);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Bloom Collection Section */}
      <section className="bg-gradient-to-r from-white to-primary-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="">
            <h1 className="text-3xl md:text-5xl font-playfair mb-3 text-primary text-center">
              The Bloom Collection
            </h1>
            <div className="space-y-2 text-slate-700 leading-snug font-poppins max-w-2xl mx-auto text-center text-sm md:text-base">
              <p>
                Bloom is about living in your presence fully and without
                apology.
              </p>
              <p>
                It is the quiet confidence that comes from no longer abandoning
                yourself.
              </p>
              <p className="italic text-xs md:text-sm">
                Not louder. Not harder. Just more you.
              </p>
              <p className="pt-1">
                Because when you stop disappearing… you don't need to prove
                anything.
              </p>
              <div className="bg-primary text-white p-3 italic mt-2 rounded text-xs md:text-sm">
                <p>You simply exist and that is felt.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bloom Collection Products Grid */}
      <section className="container mx-auto px-2 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {bloomCollection.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-lg rounded-xl group-hover:shadow-luxury"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-t-xl transition-all duration-300">
                <Image
                  src={
                    product.image?.[1] || product.image?.[0]
                      ? urlFor(product.image?.[1] || product.image?.[0])
                          .width(600)
                          .height(800)
                          .quality(90)
                          .format("jpg")
                          .fit("fill")
                          .bg("FFFFFF")
                          .url()
                      : "/fallback.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              <div className="text-center p-2 space-y-2">
                <h3 className="font-light text-base md:text-lg text-primary line-clamp-2 font-playfair">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-primary font-poppins">
                  ₦{product.price?.toLocaleString()}
                </p>

                <button
                  className="md:hidden w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mt-2 font-poppins"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rebirth Collection Section */}
      <section className="bg-gradient-to-r from-primary-50 to-white py-8 mt-6 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="">
            <h1 className="text-3xl md:text-5xl font-playfair mb-3 text-primary text-center">
              The Rebirth Collection
            </h1>
            <div className="space-y-2 text-slate-700 leading-snug font-poppins max-w-2xl mx-auto text-center text-sm md:text-base">
              <p>
                Rebirth is where it begins. Not with certainty, not with
                confidence—but with awareness.
              </p>
              <p>
                The quiet realization that you began to disappear into
                expectations, responsibilities, into being everything for
                everyone else except yourself.
              </p>
              <p className="pt-1">
                Rebirth is not about having answers. It is about no longer
                ignoring the question.
              </p>
              <div className="bg-primary text-white p-3 italic rounded text-xs md:text-sm">
                <p>Who am I when I am not performing for the world?</p>
              </div>
              <p>
                This collection lives in that space—the in-between, the
                becoming. Where you start to feel again, notice yourself again,
                and begin gently to come back.
              </p>
              <p>Not all at once. Not perfectly. But intentionally.</p>
              <p>
                Because the moment you see yourself clearly, you cannot go back
                to being unseen.
              </p>
              <div className="bg-primary text-white p-3 italic rounded text-xs md:text-sm">
                <p>This is where you begin again.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rebirth Collection Products Grid */}
      <section className="container mx-auto px-2 max-w-7xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {rebirthCollection.map((product) => (
            <div
              key={product._id}
              className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300 shadow-lg rounded-xl group-hover:shadow-luxury"
              onClick={() => handleProductClick(product)}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 rounded-t-xl transition-all duration-300">
                <Image
                  src={
                    product.image?.[1] || product.image?.[0]
                      ? urlFor(product.image?.[1] || product.image?.[0])
                          .width(600)
                          .height(800)
                          .quality(90)
                          .format("jpg")
                          .fit("fill")
                          .bg("FFFFFF")
                          .url()
                      : "/fallback.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              <div className="text-center p-2 space-y-2">
                <h3 className="font-light text-base md:text-lg text-primary line-clamp-2 font-playfair">
                  {product.name}
                </h3>
                <p className="text-lg font-bold text-primary font-poppins">
                  ₦{product.price?.toLocaleString()}
                </p>

                <button
                  className="md:hidden w-full bg-primary text-white py-2 rounded-lg text-sm font-medium mt-2 font-poppins"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
