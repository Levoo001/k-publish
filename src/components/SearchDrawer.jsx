// src/components/SearchDrawer.jsx
"use client";

import { FiSearch } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { useSearch } from "./SearchContext";
import { urlFor } from "@/sanity/lib/image";
import { useState } from "react";
import ProductModal from "./ProductModal";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/CartSlice";
import { useCart } from "./CartProvider";

const SearchDrawer = () => {
  const { isSearchOpen, toggleSearch, searchQuery, setSearchQuery, filteredProducts, products } = useSearch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();
  const { openCart } = useCart();

  const handleProductClick = (product) => {
    const modalProduct = {
      ...product,
      processedImages: product.image.map((img) =>
        urlFor(img).width(600).height(800).url()
      ),
    };
    setSelectedProduct(modalProduct);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    const cartProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: urlFor(product.image[0]).width(300).height(400).url(),
    };

    dispatch(addToCart(cartProduct));
    setSelectedProduct(null);
    toggleSearch(); // Close search drawer when adding to cart
    openCart();
  };

  if (!isSearchOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60]">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={toggleSearch}
        />

        {/* Search Panel - Slides from right */}
        <div className="absolute top-0 right-0 w-full md:w-96 h-full bg-white shadow-xl transform transition-transform duration-300">
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="flex items-center justify-between p-4">
              <h2 className="text-lg font-medium font-poppins text-gray-900">Search Products</h2>
              <button
                onClick={toggleSearch}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-poppins"
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto">
              {searchQuery ? (
                filteredProducts.length > 0 ? (
                  <div className="p-4">
                    <p className="text-sm text-gray-500 mb-4 font-poppins">
                      Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                    </p>
                    <div className="space-y-4">
                      {filteredProducts.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group w-full text-left"
                        >
                          {product.image && product.image[0] && (
                            <img
                              src={urlFor(product.image[0]).width(100).height(100).url()}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate font-poppins group-hover:text-primary-600">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 font-poppins">
                              ₦{product.price?.toLocaleString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                    <FiSearch size={32} className="mb-2 text-gray-300" />
                    <p className="font-poppins">No products found</p>
                  </div>
                )
              ) : (
                // When no search query, show all products at the bottom
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-4 font-poppins">
                    All Products
                  </p>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group w-full text-left"
                      >
                        {product.image && product.image[0] && (
                          <img
                            src={urlFor(product.image[0]).width(100).height(100).url()}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate font-poppins group-hover:text-primary-600">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-poppins">
                            ₦{product.price?.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal with higher z-index */}
      <ProductModal
        product={selectedProduct}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};

export default SearchDrawer;