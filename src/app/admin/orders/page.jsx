// src/app/admin/orders/page.jsx
"use client";

import { useState, useEffect } from "react";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const statusColor = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-purple-100 text-purple-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const Field = ({ label, value, className = "" }) =>
  value ? (
    <div className={className}>
      <p className="text-[10px] uppercase tracking-wide text-slate-400 font-poppins mb-0.5">
        {label}
      </p>
      <p className="text-sm font-poppins text-slate-800 break-words">{value}</p>
    </div>
  ) : null;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setError(null);
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError(
        err.code === "permission-denied"
          ? "Permission denied — check your Firestore security rules."
          : `Failed to load orders: ${err.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const updateOrder = async (fields) => {
    if (!selectedOrder) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "orders", selectedOrder.id), {
        ...fields,
        updatedAt: new Date(),
      });
      const updated = { ...selectedOrder, ...fields };
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = (deliveryStatus) => {
    const orderStatus =
      deliveryStatus === "delivered"
        ? "delivered"
        : deliveryStatus === "shipped"
          ? "shipped"
          : "confirmed";
    updateOrder({ deliveryStatus, orderStatus });
  };

  const handleTrackingSave = () => {
    if (!trackingInput.trim()) return;
    updateOrder({ trackingNumber: trackingInput.trim(), deliveryStatus: "shipped", orderStatus: "shipped" });
    setTrackingInput("");
  };

  const fmt = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);

  const fmtDate = (ts) =>
    (ts?.toDate?.() ?? (ts ? new Date(ts) : null))?.toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    ) ?? "N/A";

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 font-poppins text-sm">Loading orders…</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Page header */}
        <div className="mb-4">
          <h1 className="text-2xl font-playfair text-slate-900">
            Order Management
          </h1>
          <p className="text-slate-400 text-sm font-poppins">
            Manage and track customer orders
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <span className="text-red-500 mt-0.5">⚠</span>
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-medium text-red-800 text-sm">
                Could not load orders
              </p>
              <p className="font-poppins text-xs text-red-600 mt-0.5">
                {error}
              </p>
              <button
                onClick={fetchOrders}
                className="mt-1.5 text-xs font-poppins text-red-700 underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-poppins text-slate-500">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={fetchOrders}
            className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-poppins hover:border-primary/40 transition-colors"
          >
            ↺ Refresh
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 && !error && (
          <div className="bg-white rounded-xl border border-slate-100 py-16 text-center">
            <p className="font-poppins text-slate-400 text-sm">
              No orders yet.
            </p>
          </div>
        )}

        {/* Desktop table */}
        {orders.length > 0 && (
          <>
            <div className="hidden md:block bg-white rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    {[
                      "Order ID",
                      "Customer",
                      "Items",
                      "Total",
                      "Status",
                      "Date",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium text-slate-400 font-poppins uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-800 font-poppins">
                          {order.orderId}
                        </p>
                        <p className="text-xs text-slate-400 font-poppins truncate max-w-[120px]">
                          {order.paymentReference}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-800 font-poppins">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-slate-400 font-poppins">
                          {order.customerEmail}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 font-poppins">
                        {order.items?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 font-poppins">
                        {fmt(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-poppins ${statusColor(order.orderStatus)}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-poppins">
                        {fmtDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setSelectedOrder(order); setTrackingInput(order.trackingNumber || ""); }}
                          className="text-xs text-primary font-poppins hover:underline"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-2.5">
              {orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => { setSelectedOrder(order); setTrackingInput(order.trackingNumber || ""); }}
                  className="w-full text-left bg-white rounded-xl border border-slate-100 p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 font-poppins truncate">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-slate-400 font-poppins truncate">
                        {order.orderId}
                      </p>
                    </div>
                    <span
                      className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full text-[11px] font-poppins ${statusColor(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-poppins">
                      <span>{order.items?.length ?? 0} item(s)</span>
                      <span>·</span>
                      <span>{fmtDate(order.createdAt)}</span>
                    </div>
                    <p className="text-sm font-bold text-primary font-poppins">
                      {fmt(order.totalAmount)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-2xl rounded-t-2xl max-h-[94vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-8 h-1 bg-slate-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-4 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-playfair font-semibold text-base leading-none">
                    {selectedOrder.customerName?.[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 font-poppins truncate">
                    {selectedOrder.customerName}
                  </p>
                  <p className="text-xs text-slate-400 font-poppins truncate">
                    {selectedOrder.customerEmail}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="ml-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Status + meta strip */}
            <div className="mx-5 mb-4 rounded-xl bg-slate-50 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-poppins mb-0.5">
                  Order ID
                </p>
                <p className="text-xs font-mono text-slate-600 truncate max-w-[160px]">
                  {selectedOrder.orderId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-poppins mb-1">
                  {fmtDate(selectedOrder.createdAt)}
                </p>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium font-poppins capitalize ${statusColor(selectedOrder.orderStatus)}`}
                >
                  {selectedOrder.orderStatus}
                </span>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-5 space-y-4 pb-2">
              {/* Items */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-poppins mb-2">
                  Items · {selectedOrder.items?.length ?? 0}
                </p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="text-sm font-semibold text-slate-900 font-poppins leading-tight flex-1 min-w-0">
                          {item.name}
                        </p>
                        <p className="text-sm font-bold text-primary font-poppins flex-shrink-0">
                          {fmt(item.total)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold font-poppins px-2.5 py-1 rounded-lg capitalize">
                          <span className="text-[10px] font-normal opacity-70">
                            Quantity
                          </span>
                          {item.quantity}
                        </span>
                        {item.size && item.size !== "Not specified" && (
                          <span className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold font-poppins px-2.5 py-1 rounded-lg">
                            <span className="text-[10px] font-normal text-slate-400">
                              Size
                            </span>
                            {item.size}
                          </span>
                        )}
                        {item.color && item.color !== "Not specified" && (
                          <span className="flex items-center gap-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold font-poppins px-2.5 py-1 rounded-lg capitalize">
                            <span className="text-[10px] font-normal text-slate-400">
                              Colour
                            </span>
                            {item.color}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-3 bg-slate-50 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-poppins text-slate-500">
                    <span>Subtotal</span>
                    <span>{fmt(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-poppins text-slate-500">
                    <span>Shipping</span>
                    <span>{fmt(selectedOrder.shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold font-poppins text-slate-900 pt-1.5 border-t border-slate-200">
                    <span>Total paid</span>
                    <span className="text-primary">
                      {fmt(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Update fulfilment status */}
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-poppins mb-3">
                  Fulfilment status
                </p>
                <div className="flex gap-2 mb-3">
                  {["pending", "shipped", "delivered"].map((s) => {
                    const active = (selectedOrder.deliveryStatus ?? "pending") === s;
                    return (
                      <button
                        key={s}
                        disabled={saving || active}
                        onClick={() => handleStatusChange(s)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold font-poppins capitalize transition-colors ${
                          active
                            ? statusColor(s) + " opacity-100 cursor-default"
                            : "bg-white border border-slate-200 text-slate-500 hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                {/* Tracking number */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-poppins mb-1.5">
                    Tracking number
                  </p>
                  {selectedOrder.trackingNumber ? (
                    <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-3 py-2">
                      <p className="text-xs font-mono text-slate-800 font-semibold">{selectedOrder.trackingNumber}</p>
                      <button
                        onClick={() => { setTrackingInput(selectedOrder.trackingNumber); updateOrder({ trackingNumber: null }); }}
                        className="text-[10px] text-slate-400 hover:text-red-500 font-poppins ml-2 transition-colors"
                      >
                        edit
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleTrackingSave()}
                        placeholder="e.g. 1234567890"
                        className="flex-1 text-xs font-poppins bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-primary/60 placeholder:text-slate-300"
                      />
                      <button
                        onClick={handleTrackingSave}
                        disabled={saving || !trackingInput.trim()}
                        className="px-3 py-2 bg-primary text-white text-xs font-poppins rounded-lg disabled:opacity-40 hover:bg-primary/90 transition-colors"
                      >
                        {saving ? "…" : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Shipping meta */}
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-3 text-[11px] font-poppins text-slate-500">
                  {selectedOrder.shippingProvider && <span>{selectedOrder.shippingProvider}</span>}
                  {selectedOrder.shippingType && (
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full capitalize">
                      {selectedOrder.shippingType}
                    </span>
                  )}
                  {selectedOrder.estimatedDelivery && (
                    <span className="ml-auto">Est. {fmtDate(selectedOrder.estimatedDelivery)}</span>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-poppins mb-2">Payment</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedOrder.paymentMethod && (
                    <span className="text-xs font-poppins text-slate-700">{selectedOrder.paymentMethod}</span>
                  )}
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-poppins ${selectedOrder.paymentStatus === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {selectedOrder.paymentStatus ?? "pending"}
                  </span>
                </div>
                {selectedOrder.paymentReference && (
                  <p className="text-[11px] font-mono text-slate-500 mt-2 break-all">{selectedOrder.paymentReference}</p>
                )}
              </div>

              {/* Delivery address */}
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-poppins mb-3">
                  Delivery address
                </p>
                <div className="space-y-0.5 font-poppins text-xs text-slate-700">
                  {selectedOrder.shippingFullAddress ? (
                    <p className="leading-relaxed">{selectedOrder.shippingFullAddress}</p>
                  ) : (
                    <>
                      {selectedOrder.shippingStreetAddress && selectedOrder.shippingStreetAddress !== "Not provided" && (
                        <p className="font-semibold text-slate-900">{selectedOrder.shippingStreetAddress}</p>
                      )}
                      {selectedOrder.shippingApartment && selectedOrder.shippingApartment !== "Not provided" && (
                        <p>{selectedOrder.shippingApartment}</p>
                      )}
                      {(selectedOrder.shippingCity || selectedOrder.shippingState) && (
                        <p>{[selectedOrder.shippingCity, selectedOrder.shippingState].filter(Boolean).join(", ")}</p>
                      )}
                      {selectedOrder.shippingCountry && selectedOrder.shippingCountry !== "Not provided" && (
                        <p className="font-semibold text-slate-900">{selectedOrder.shippingCountry}</p>
                      )}
                      {selectedOrder.shippingPostalCode && selectedOrder.shippingPostalCode !== "Not provided" && (
                        <p className="text-slate-500">Postal code: {selectedOrder.shippingPostalCode}</p>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${selectedOrder.customerPhone}`}
                    className="flex items-center gap-1.5 text-xs font-semibold font-poppins text-primary underline underline-offset-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {selectedOrder.customerPhone}
                  </a>
                  <a
                    href={`mailto:${selectedOrder.customerEmail}`}
                    className="text-[11px] text-slate-400 font-poppins hover:text-primary transition-colors truncate max-w-[160px]"
                  >
                    {selectedOrder.customerEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-2 px-5 py-4 border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-poppins hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-poppins hover:bg-primary/90 transition-colors"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
