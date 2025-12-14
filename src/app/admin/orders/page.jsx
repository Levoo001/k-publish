// src/app/admin/orders/page.jsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setShowOrderDetails(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-600 font-poppins">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div>
            <h1 className="text-3xl font-playfair text-primary-900 mb-2 text-center">
              Order Management
            </h1>
            <p className="text-primary-600 font-poppins text-center">
              Manage and track customer orders
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-poppins text-sm my-3 flex justify-self-end"
          >
            Refresh Orders
          </button>

          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-primary-50">
                    <th className="p-3 text-left font-poppins font-medium text-primary-900">
                      Order ID
                    </th>
                    <th className="p-3 text-left font-poppins font-medium text-primary-900">
                      Customer
                    </th>
                    <th className="p-3 text-left font-poppins font-medium text-primary-900">
                      Items
                    </th>
                    <th className="p-3 text-left font-poppins font-medium text-primary-900">
                      Total
                    </th>
                    <th className="p-3 text-left font-poppins font-medium text-primary-900">
                      Status
                    </th>
                    <th className="p-3 text-left font-poppins font-medium text-primary-900">
                      Date
                    </th>
                    <th className="p-3 text-left font-poppins font-medium text-primary-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-primary-100 hover:bg-primary-25"
                    >
                      <td className="p-3 font-poppins text-sm">
                        <div className="font-medium text-primary-900">
                          {order.orderId}
                        </div>
                        <div className="text-primary-600 text-xs">
                          {order.paymentReference}
                        </div>
                      </td>
                      <td className="p-3 font-poppins text-sm">
                        <div className="font-medium">{order.customerName}</div>
                        <div className="text-primary-600 text-xs">
                          {order.customerEmail}
                        </div>
                        <div className="text-primary-600 text-xs">
                          {order.customerPhone}
                        </div>
                      </td>
                      <td className="p-3 font-poppins text-sm">
                        <div className="text-xs mb-1">
                          {order.items?.length || 0} item(s)
                        </div>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-primary text-xs hover:underline"
                        >
                          View Details
                        </button>
                      </td>
                      <td className="p-3 font-poppins font-medium text-primary-900">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-poppins ${
                            order.orderStatus === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : order.orderStatus === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.orderStatus === "delivered"
                                  ? "bg-purple-100 text-purple-800"
                                  : order.orderStatus === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-3 font-poppins text-sm text-primary-600">
                        {order.createdAt?.toDate?.().toLocaleDateString() ||
                          "N/A"}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="bg-primary text-white px-3 py-1 rounded text-xs font-poppins hover:bg-primary-700 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-primary-200 rounded-lg p-4"
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-primary-900 font-poppins">
                          {order.orderId}
                        </div>
                        <div className="text-primary-600 text-xs font-poppins">
                          {order.paymentReference}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-poppins ${
                          order.orderStatus === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : order.orderStatus === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.orderStatus === "delivered"
                                ? "bg-purple-100 text-purple-800"
                                : order.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div>
                      <div className="font-medium font-poppins">
                        {order.customerName}
                      </div>
                      <div className="text-primary-600 text-xs font-poppins">
                        {order.customerEmail}
                      </div>
                      <div className="text-primary-600 text-xs font-poppins">
                        {order.customerPhone}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-primary-600 font-poppins">
                          Items
                        </div>
                        <div className="font-poppins">
                          {order.items?.length || 0} item(s)
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-primary-600 font-poppins">
                          Total
                        </div>
                        <div className="font-medium font-poppins text-primary-900">
                          {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-primary-600 font-poppins">
                          Date
                        </div>
                        <div className="font-poppins text-sm">
                          {order.createdAt?.toDate?.().toLocaleDateString() ||
                            "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="w-full bg-primary text-white px-4 py-2 rounded text-sm font-poppins hover:bg-primary-700 transition-colors"
                    >
                      View Order Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-primary-600 font-poppins">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl w-full max-w-full sm:max-w-6xl mx-auto my-2 sm:my-4 h-[95vh] sm:h-auto max-h-[95vh] flex flex-col">
            {/* Header - Fixed */}
            <div className="p-3 sm:p-4 border-b border-primary-200 bg-white rounded-t-xl flex-shrink-0">
              <div className="flex justify-between items-start sm:items-center">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-2xl font-playfair text-primary-900 truncate">
                    Order #{selectedOrder.orderId}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm font-poppins">
                    <div className="flex items-center">
                      <span className="text-primary-600 mr-1">Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          selectedOrder.orderStatus === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : selectedOrder.orderStatus === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : selectedOrder.orderStatus === "delivered"
                                ? "bg-purple-100 text-purple-800"
                                : selectedOrder.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedOrder.orderStatus}
                      </span>
                    </div>
                    <div className="hidden sm:block">•</div>
                    <div className="text-primary-600">
                      Date:{" "}
                      <span className="text-primary-900">
                        {selectedOrder.createdAt
                          ?.toDate?.()
                          .toLocaleDateString() || "N/A"}
                      </span>
                    </div>
                    <div className="hidden sm:block">•</div>
                    <div className="text-primary-600">
                      Total:{" "}
                      <span className="font-medium text-primary-900">
                        {formatPrice(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeOrderDetails}
                  className="text-primary-600 hover:text-primary-900 text-2xl p-1 ml-2 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content - Scrollable if needed */}
            <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
              {/* Mobile Stack Layout */}
              <div className="block lg:hidden space-y-4">
                {/* Customer Information Card */}
                <div className="bg-white border border-primary-200 rounded-lg p-4">
                  <h3 className="font-playfair text-base text-primary-900 mb-3 flex items-center gap-2">
                    <span className="text-primary">👤</span> Customer
                    Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-poppins">
                    <div>
                      <p className="text-primary-600 text-xs">Full Name</p>
                      <p className="font-medium">
                        {selectedOrder.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-600 text-xs">Email Address</p>
                      <p className="font-medium break-all">
                        {selectedOrder.customerEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-600 text-xs">Phone Number</p>
                      <p className="font-medium">
                        {selectedOrder.customerPhone}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-600 text-xs">
                        Payment Reference
                      </p>
                      <p className="font-medium text-sm break-all">
                        {selectedOrder.paymentReference}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Shipping Information */}
                  <div className="bg-white border border-primary-200 rounded-lg p-4">
                    <h3 className="font-playfair text-base text-primary-900 mb-3 flex items-center gap-2">
                      <span className="text-primary">🚚</span> Shipping
                    </h3>
                    <div className="space-y-2 text-sm font-poppins">
                      <div>
                        <p className="text-primary-600 text-xs">Provider</p>
                        <p className="font-medium">
                          {selectedOrder.shippingProvider}
                        </p>
                      </div>
                      <div>
                        <p className="text-primary-600 text-xs">Fee</p>
                        <p className="font-medium">
                          {formatPrice(selectedOrder.shippingFee)}
                        </p>
                      </div>
                      <div>
                        <p className="text-primary-600 text-xs">
                          Delivery Status
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              selectedOrder.deliveryStatus === "delivered"
                                ? "bg-green-100 text-green-800"
                                : selectedOrder.deliveryStatus === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {selectedOrder.deliveryStatus || "pending"}
                          </span>
                          {selectedOrder.trackingNumber && (
                            <span className="text-xs text-primary-600 truncate">
                              Track: {selectedOrder.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-white border border-primary-200 rounded-lg p-4">
                    <h3 className="font-playfair text-base text-primary-900 mb-3 flex items-center gap-2">
                      <span className="text-primary">💳</span> Payment
                    </h3>
                    <div className="space-y-2 text-sm font-poppins">
                      <div>
                        <p className="text-primary-600 text-xs">Method</p>
                        <p className="font-medium">
                          {selectedOrder.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <p className="text-primary-600 text-xs">Status</p>
                        <p
                          className={`font-medium ${
                            selectedOrder.paymentStatus === "completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {selectedOrder.paymentStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Complete Address Card */}
                <div className="bg-white border border-primary-200 rounded-lg p-4">
                  <h3 className="font-playfair text-base text-primary-900 mb-3 flex items-center gap-2">
                    <span className="text-primary">📍</span> Shipping Address
                  </h3>
                  <div className="text-sm font-poppins">
                    {selectedOrder.shippingFullAddress ? (
                      <div className="bg-primary-50 p-3 rounded border border-primary-100">
                        <p className="text-primary-900 leading-relaxed text-sm">
                          {selectedOrder.shippingFullAddress}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 bg-primary-50 p-3 rounded border border-primary-100">
                        {selectedOrder.shippingStreetAddress && (
                          <div>
                            <p className="text-primary-600 text-xs">
                              Street Address
                            </p>
                            <p className="font-medium">
                              {selectedOrder.shippingStreetAddress}
                            </p>
                          </div>
                        )}
                        {selectedOrder.shippingApartment && (
                          <div>
                            <p className="text-primary-600 text-xs">
                              Apartment/Suite
                            </p>
                            <p className="font-medium">
                              {selectedOrder.shippingApartment}
                            </p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {selectedOrder.shippingCity && (
                            <div>
                              <p className="text-primary-600 text-xs">City</p>
                              <p className="font-medium">
                                {selectedOrder.shippingCity}
                              </p>
                            </div>
                          )}
                          {selectedOrder.shippingState && (
                            <div>
                              <p className="text-primary-600 text-xs">State</p>
                              <p className="font-medium">
                                {selectedOrder.shippingState}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedOrder.shippingCountry && (
                            <div>
                              <p className="text-primary-600 text-xs">
                                Country
                              </p>
                              <p className="font-medium">
                                {selectedOrder.shippingCountry}
                              </p>
                            </div>
                          )}
                          {selectedOrder.shippingPostalCode && (
                            <div>
                              <p className="text-primary-600 text-xs">
                                Postal Code
                              </p>
                              <p className="font-medium">
                                {selectedOrder.shippingPostalCode}
                              </p>
                            </div>
                          )}
                        </div>
                        {!selectedOrder.shippingCountry &&
                          !selectedOrder.shippingStreetAddress && (
                            <p className="text-primary-600 text-sm">
                              Address not available
                            </p>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items Card */}
                <div className="bg-white border border-primary-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-playfair text-base text-primary-900 flex items-center gap-2">
                      <span className="text-primary">📦</span> Order Items
                      <span className="text-sm font-poppins font-normal text-primary-600">
                        ({selectedOrder.items?.length || 0} items)
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {selectedOrder.items?.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="border border-primary-100 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-medium font-poppins text-primary-900 text-sm">
                              {item.name}
                            </p>
                            {item.color && item.color !== "Not specified" && (
                              <p className="text-xs text-primary-600 mt-1">
                                Color: {item.color}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold text-primary text-sm">
                            {formatPrice(item.total)}
                          </p>
                        </div>
                        <div className="flex justify-between text-xs text-primary-600">
                          <div className="flex items-center gap-2">
                            <span>Qty: {item.quantity}</span>
                            <span>×</span>
                            <span>{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Show "View All" if more than 3 items */}
                    {selectedOrder.items && selectedOrder.items.length > 3 && (
                      <button className="w-full text-center text-primary text-sm font-poppins py-2 border border-primary-200 rounded-lg hover:bg-primary-50">
                        + {selectedOrder.items.length - 3} more items
                      </button>
                    )}
                  </div>

                  {/* Quick Stats */}
                  {selectedOrder.items && (
                    <div className="mt-4 pt-4 border-t border-primary-200">
                      <div className="flex justify-between text-sm">
                        <div className="text-center p-2 bg-primary-25 rounded flex-1 mx-1">
                          <p className="text-primary-600 text-xs">
                            Total Items
                          </p>
                          <p className="font-semibold">
                            {selectedOrder.items.reduce(
                              (sum, item) => sum + (item.quantity || 0),
                              0
                            )}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-primary-25 rounded flex-1 mx-1">
                          <p className="text-primary-600 text-xs">
                            Items Count
                          </p>
                          <p className="font-semibold">
                            {selectedOrder.items.length}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-primary-25 rounded flex-1 mx-1">
                          <p className="text-primary-600 text-xs">
                            Total Value
                          </p>
                          <p className="font-semibold">
                            {formatPrice(selectedOrder.subtotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Desktop Grid Layout (Hidden on mobile) */}
              <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Your original desktop 3-column layout here */}
                {/* ... keep your original desktop layout code ... */}
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="p-3 sm:p-4 border-t border-primary-200 bg-white rounded-b-xl flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs sm:text-sm font-poppins text-primary-600 truncate w-full text-center sm:text-left">
                  Order #{selectedOrder.orderId} • {selectedOrder.customerName}
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                  <button
                    onClick={closeOrderDetails}
                    className="px-3 py-2 sm:px-4 sm:py-2 border border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors font-poppins text-sm flex-1 sm:flex-none"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors font-poppins text-sm flex-1 sm:flex-none"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => {
                      // Add edit/ship functionality here
                    }}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-poppins text-sm flex-1 sm:flex-none"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
