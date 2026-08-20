"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { getCardImage } from "@/lib/productImage";

export default function CollectionClient({ products, title, description }) {
  if (products.length === 0) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 mb-2 font-playfair">{title}</h1>
          <p className="text-sm text-slate-400 font-poppins mb-6">{description}</p>
          <p className="text-slate-400 font-poppins text-sm mb-6">No products in this collection yet.</p>
          <Link href="/shop" className="inline-block bg-primary text-white px-6 py-3 rounded-xl text-sm font-poppins hover:bg-primary/90 transition-colors">
            Browse All Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-10">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-light text-slate-900 mb-2 font-playfair">{title}</h1>
          {description && (
            <p className="text-sm text-slate-500 max-w-xl mx-auto font-poppins">{description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map((product) => {
            const slug = product.slug?.current || encodeURIComponent(product.name);
            const displayImage = getCardImage(product)
              ? urlFor(getCardImage(product))
                  .width(600).height(800).quality(90).format("jpg").fit("fill").bg("FFFFFF").url()
              : "/fallback.jpg";

            return (
              <Link
                key={product._id}
                href={`/products/${slug}`}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-2 bg-slate-50 rounded-xl">
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded font-poppins">
                      SALE
                    </span>
                  )}
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
