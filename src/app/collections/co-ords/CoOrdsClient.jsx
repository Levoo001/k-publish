// src/app/collections/co-ords/CoOrdsClient.jsx

"use client";

import { useState } from "react";
import { urlFor } from "@/sanity/lib/image";
import ProductModal from "@/components/ProductModal";
import Image from "next/image";

export default function CoOrdsClient({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const coords =
    products?.filter(
      (product) =>
        product.name === "The Amara Set" || product.name === "The Amarachi Set"
    ) || [];

  const handleProductClick = (product) => {
    const modalProduct = {
      ...product,
      processedImages: product.image.map((img) =>
        urlFor(img)
          .width(1200)
          .height(1600)
          .quality(95)
          .format("jpg")
          .fit("fill")
          .bg("FFFFFF")
          .url()
      ),
    };
    setSelectedProduct(modalProduct);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <main className="min-h-screen py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-primary-900 mb-4 font-playfair">
            Co-ords
          </h1>
          <p className="text-lg text-primary-700 max-w-2xl mx-auto font-poppins">
            Perfectly coordinated sets for effortless style
          </p>
        </div>

        {/* Products Grid - No Carousel */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {coords.map((product) => {
            const displayImage = product.image[0]
              ? urlFor(product.image[0])
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

      <ProductModal product={selectedProduct} onClose={handleCloseModal} />
    </main>
  );
}
