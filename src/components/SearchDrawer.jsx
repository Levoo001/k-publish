"use client";

import { FiSearch } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { useSearch } from "./SearchContext";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

const SearchDrawer = () => {
  const {
    isSearchOpen,
    toggleSearch,
    searchQuery,
    setSearchQuery,
    products,
    isLoading,
  } = useSearch();

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={toggleSearch}
      />

      <div className="absolute top-0 right-0 w-full md:w-96 h-full bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-medium font-poppins text-gray-900">
              Search Products
            </h2>
            <button
              onClick={toggleSearch}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close search"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-poppins"
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length > 0 ? (
              <div className="p-4">
                {searchQuery && (
                  <p className="text-sm text-gray-500 mb-4 font-poppins">
                    {products.length} result{products.length !== 1 ? "s" : ""}
                  </p>
                )}
                <div className="space-y-2">
                  {products.map((product) => {
                    const slug = product.slug?.current || encodeURIComponent(product.name);
                    return (
                      <Link
                        key={product._id}
                        href={`/products/${slug}`}
                        onClick={toggleSearch}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                      >
                        {product.image?.[0] && (
                          <img
                            src={urlFor(product.image[0]).width(80).height(80).url()}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate font-poppins group-hover:text-primary">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-poppins">
                            ₦{product.price?.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <FiSearch size={32} className="mb-2 text-gray-300" />
                <p className="font-poppins text-sm">
                  {searchQuery ? "No products found" : "Start typing to search"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDrawer;
