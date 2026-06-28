"use client";

import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

export default function CollectionClient({ products, title, description }) {
  if (products.length === 0) {
    return (
      <main className="min-h-screen py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h1 className="text-4xl font-light text-primary-900 mb-4 font-playfair">
            {title}
          </h1>
          <p className="text-lg text-primary-600 font-poppins mb-12">{description}</p>
          <p className="text-slate-500 font-poppins">
            No products in this collection yet.
          </p>
          <Link
            href="/shop"
            className="inline-block mt-6 bg-primary text-white px-6 py-3 rounded-lg font-poppins hover:bg-primary/90 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-primary-900 mb-4 font-playfair">
            {title}
          </h1>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto font-poppins">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => {
            const slug = product.slug?.current || encodeURIComponent(product.name);
            const displayImage =
              product.image?.[1] || product.image?.[0]
                ? urlFor(product.image?.[1] || product.image?.[0])
                    .width(600)
                    .height(800)
                    .quality(90)
                    .format("jpg")
                    .fit("fill")
                    .bg("FFFFFF")
                    .url()
                : "/fallback.jpg";

            return (
              <Link
                key={product._id}
                href={`/products/${slug}`}
                className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-500"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-white rounded-lg">
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  {product.comparePrice && product.comparePrice > product.price && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded font-poppins">
                      SALE
                    </div>
                  )}
                </div>
                <div className="text-center p-2">
                  <h3 className="font-light text-base mb-1 text-primary-900 line-clamp-1 font-playfair">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-base font-medium text-primary font-poppins">
                      ₦{product.price?.toLocaleString()}
                    </p>
                    {product.comparePrice && product.comparePrice > product.price && (
                      <p className="text-sm text-slate-400 line-through font-poppins">
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
