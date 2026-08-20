import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { getCardImage } from "@/lib/productImage";

// Server component — it's just links and images, so none of this needs to
// ship as client JS.
export default function RelatedProducts({
  products,
  title = "You might also like",
}) {
  if (!products?.length) return null;

  return (
    <section className="border-t border-slate-200 mt-10 sm:mt-14 pt-8 sm:pt-10">
      <h2 className="text-lg sm:text-xl font-light text-slate-900 font-playfair mb-1">
        {title}
      </h2>
      <div className="w-8 h-px bg-primary mb-5 sm:mb-6" />

      {/* One scrollable row. The negative margins mirror the page wrapper's
          padding so the strip scrolls edge-to-edge on mobile, while the
          matching padding keeps the first card aligned with the heading. */}
      <div
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory
                   -mx-4 md:-mx-6 lg:-mx-8
                   px-4 md:px-6 lg:px-8 pb-1"
      >
        {products.map((product) => {
          const slug =
            product.slug?.current || encodeURIComponent(product.name);
          const cardImage = getCardImage(product);
          const displayImage = cardImage
            ? urlFor(cardImage)
                .width(400)
                .height(533)
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
              className="group cursor-pointer shrink-0 snap-start w-28 sm:w-32 md:w-36"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-2 bg-slate-50 rounded-lg">
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="144px"
                />
                {product.comparePrice &&
                  product.comparePrice > product.price && (
                    <span className="absolute top-1.5 left-1.5 bg-primary text-white text-[9px] px-1.5 py-0.5 rounded font-poppins">
                      SALE
                    </span>
                  )}
              </div>
              <h3 className="text-xs font-light text-slate-900 line-clamp-1 font-playfair mb-0.5">
                {product.name}
              </h3>
              <div className="flex items-baseline gap-1.5">
                <p className="text-xs font-semibold text-primary font-poppins">
                  ₦{product.price?.toLocaleString()}
                </p>
                {product.comparePrice &&
                  product.comparePrice > product.price && (
                    <p className="text-[10px] text-slate-400 line-through font-poppins">
                      ₦{product.comparePrice?.toLocaleString()}
                    </p>
                  )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
