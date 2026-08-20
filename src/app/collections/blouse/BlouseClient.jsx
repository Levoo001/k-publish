"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { getCardImage } from "@/lib/productImage";

export default function BlouseClient({ products }) {
  const blouses =
    products?.filter((p) => p.name?.toLowerCase().includes("blouse")) || [];

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 mb-2 font-playfair">Blouses</h1>
          <p className="text-sm text-slate-500 max-w-xl mx-auto font-poppins">
            Elegant blouses for every occasion
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {blouses.map((product) => {
            const slug = product.slug?.current || encodeURIComponent(product.name);
            const displayImage = getCardImage(product)
              ? urlFor(getCardImage(product))
                  .width(600).height(800).quality(90).format("jpg").fit("fill").bg("FFFFFF").url()
              : "/fallback.jpg";

            return (
              <Link key={product._id} href={`/products/${slug}`} className="group cursor-pointer">
                <div className="relative aspect-[3/4] overflow-hidden mb-2 bg-slate-50 rounded-xl">
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority
                  />
                </div>
                <div className="px-1 pb-2">
                  <h3 className="text-sm font-light text-slate-900 line-clamp-1 font-playfair mb-0.5">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-primary font-poppins">
                      ₦{product.price?.toLocaleString()}
                    </p>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <p className="text-xs text-slate-400 line-through font-poppins">
                        ₦{product.comparePrice?.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
