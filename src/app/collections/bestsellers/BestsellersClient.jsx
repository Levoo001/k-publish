// src/app/collections/bestsellers/BestsellersClient.jsx

"use client";

import { useRouter } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

export default function BestsellersClient({ products }) {
  const router = useRouter();

  const bestsellers =
    products?.filter(
      (product) =>
        product.name === "The Chisom Dress" ||
        product.name === "The Amarachi Set" ||
        product.name === "Urenna Mini-skirt Set" ||
        product.name === "Urenna Midi-Set" ||
        product.name === "Urenna Pant-Set" ||
        product.name === "Grace Midi-skirt Set" ||
        product.name === "Grace Mini-skirt Set",
    ) || [];

  const handleProductClick = (product) => {
    router.push(`/products/${encodeURIComponent(product.name)}`);
  };

  return (
    <main className="min-h-screen py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-primary-900 mb-4 font-playfair">
            Bestsellers
          </h1>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto font-poppins">
            Discover our most loved and frequently purchased pieces
          </p>
        </div>

        {/* Products Grid - No Carousel */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {bestsellers.map((product) => {
            const displayImage =
              product.image[1] || product.image[0]
                ? urlFor(product.image[1] || product.image[0])
                    .width(600)
                    .height(800)
                    .quality(90)
                    .format("jpg")
                    .fit("fill")
                    .bg("FFFFFF")
                    .url()
                : "/fallback.jpg";

            return (
              <div
                key={product._id}
                className="group cursor-pointer transform hover:-translate-y-1 transition-all duration-500"
                onClick={() => handleProductClick(product)}
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-white rounded-lg">
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority
                  />
                </div>
                <div className="text-center p-2">
                  <h3 className="font-light text-base mb-1 text-primary-900 line-clamp-1 font-playfair">
                    {product.name}
                  </h3>
                  <p className="text-base font-medium text-primary font-poppins">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
