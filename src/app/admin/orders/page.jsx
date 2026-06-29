"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const statusColor = (status) => {
  switch (status) {
    case "confirmed":  return "bg-green-100 text-green-800";
    case "shipped":    return "bg-blue-100 text-blue-800";
    case "delivered":  return "bg-purple-100 text-purple-800";
    case "cancelled":  return "bg-red-100 text-red-800";
    default:           return "bg-yellow-100 text-yellow-800";
  }
};

const fmt = (price) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(price ?? 0);

const fmtDate = (ts) =>
  (ts?.toDate?.() ?? (ts ? new Date(ts) : null))?.toLocaleDateString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
  }) ?? "N/A";

// ─── Delivery tracker ────────────────────────────────────────────────────────

function DeliveryTracker({ order, onUpdate, saving }) {
  const [trackingInput, setTrackingInput] = useState(order.trackingNumber || "");
  const status = order.deliveryStatus ?? "pending";
  const isShipped   = status === "shipped" || status === "delivered";
  const isDelivered = status === "delivered";

  const dot = (filled) => (
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
      filled ? "bg-primary border-primary" : "border-slate-300 bg-white"
    }`}>
      {filled && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );

  return (
    <div>
      {/* Track line */}
      <div className="flex items-center gap-0 mb-3">
        {dot(isShipped)}
        <div className="flex-1 h-[2px] bg-slate-200 relative overflow-hidden">
          <div className={`absolute inset-y-0 left-0 bg-primary transition-all duration-700 ${isDelivered ? "w-full" : "w-0"}`} />
        </div>
        {dot(isDelivered)}
      </div>

      {/* Labels */}
      <div className="flex justify-between mb-5">
        <div>
          <p className={`text-sm font-semibold font-poppins ${isShipped ? "text-primary" : "text-slate-400"}`}>Shipped</p>
          {isShipped && !isDelivered && order.trackingNumber && (
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{order.trackingNumber}</p>
          )}
        </div>
        <div className="text-right">
          <p className={`text-sm font-semibold font-poppins ${isDelivered ? "text-primary" : "text-slate-400"}`}>Delivered</p>
        </div>
      </div>

      {/* Actions */}
      {isDelivered ? (
        <div className="flex items-center gap-2 text-sm font-poppins font-semibold text-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Order delivered
        </div>
      ) : status === "shipped" ? (
        <button
          disabled={saving}
          onClick={() => onUpdate({ deliveryStatus: "delivered", orderStatus: "delivered" })}
          className="w-full py-3 rounded-xl bg-primary text-white text-sm font-poppins font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {saving ? "Saving…" : "Mark as Delivered"}
        </button>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            placeholder="Tracking number (optional)"
            className="w-full px-4 py-3 text-sm font-poppins border border-slate-200 rounded-xl outline-none focus:border-primary/60 placeholder:text-xs placeholder:text-slate-300 transition-colors"
          />
          <button
            disabled={saving}
            onClick={() =>
              onUpdate({
                deliveryStatus: "shipped",
                orderStatus: "shipped",
                ...(trackingInput.trim() ? { trackingNumber: trackingInput.trim() } : {}),
              })
            }
            className="w-full py-3 rounded-xl bg-primary text-white text-sm font-poppins font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Mark as Shipped"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [saving, setSaving]           = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  // Prevent body scroll when detail is open
  useEffect(() => {
    document.body.style.overflow = selectedOrder ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedOrder]);

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
      await updateDoc(doc(db, "orders", selectedOrder.id), { ...fields, updatedAt: new Date() });
      const updated = { ...selectedOrder, ...fields };
      setSelectedOrder(updated);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

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
          <h1 className="text-2xl font-playfair text-slate-900">Order Management</h1>
          <p className="text-slate-400 text-sm font-poppins">Manage and track customer orders</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <span className="text-red-500 mt-0.5">⚠</span>
            <div className="flex-1 min-w-0">
              <p className="font-poppins font-medium text-red-800 text-sm">Could not load orders</p>
              <p className="font-poppins text-xs text-red-600 mt-0.5">{error}</p>
              <button onClick={fetchOrders} className="mt-1.5 text-xs font-poppins text-red-700 underline">Try again</button>
            </div>
          </div>
        )}

        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-poppins text-slate-500">{orders.length} order{orders.length !== 1 ? "s" : ""}</span>
          <button onClick={fetchOrders} className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-poppins hover:border-primary/40 transition-colors">
            ↺ Refresh
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 && !error && (
          <div className="bg-white rounded-xl border border-slate-100 py-16 text-center">
            <p className="font-poppins text-slate-400 text-sm">No orders yet.</p>
          </div>
        )}

        {/* Desktop table */}
        {orders.length > 0 && (
          <>
            <div className="hidden md:block bg-white rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400 font-poppins uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800 font-poppins">{order.customerName}</p>
                        <p className="text-xs text-slate-400 font-poppins">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 font-poppins">{order.items?.length ?? 0}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-800 font-poppins">{fmt(order.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-poppins ${statusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-poppins">{fmtDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 font-poppins">View →</td>
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
                  onClick={() => setSelectedOrder(order)}
                  className="w-full text-left bg-white rounded-xl border border-slate-200 p-4 hover:border-primary/50 hover:shadow-sm active:scale-[0.99] transition-all"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 font-poppins truncate">{order.customerName}</p>
                      <p className="text-xs text-slate-400 font-poppins">{fmtDate(order.createdAt)}</p>
                    </div>
                    <span className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-full text-[11px] font-poppins ${statusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-poppins">{order.items?.length ?? 0} item(s)</span>
                    <p className="text-sm font-bold text-primary font-poppins">{fmt(order.totalAmount)}</p>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Fullscreen order detail ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">

          {/* Sticky top bar */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-poppins font-semibold ${statusColor(selectedOrder.orderStatus)}`}>
                {selectedOrder.orderStatus}
              </span>
              <p className="text-xs font-mono text-slate-400 truncate hidden sm:block">{selectedOrder.orderId}</p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center gap-1.5 text-sm font-poppins text-slate-500 hover:text-slate-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>

          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 space-y-6">

            {/* ── Customer ── */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-playfair text-2xl font-light leading-none">
                  {selectedOrder.customerName?.[0]?.toUpperCase() ?? "?"}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-playfair text-slate-900 leading-tight">{selectedOrder.customerName}</h2>
                <p className="text-sm text-slate-400 font-poppins truncate">{selectedOrder.customerEmail}</p>
                <a href={`tel:${selectedOrder.customerPhone}`} className="text-sm font-semibold text-primary font-poppins mt-0.5 inline-block">
                  {selectedOrder.customerPhone}
                </a>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* ── Items ── */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins font-semibold mb-4">
                Items · {selectedOrder.items?.length ?? 0}
              </p>
              <div className="space-y-4">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Image */}
                    <div className="w-28 h-36 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={112}
                          height={144}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                      <div>
                        <p className="font-playfair text-slate-900 text-base leading-snug mb-3">{item.name}</p>
                        <div className="space-y-1.5">
                          {[
                            { label: "Qty",    value: item.quantity },
                            { label: "Size",   value: item.size !== "Not specified" ? item.size : null },
                            { label: "Colour", value: item.color !== "Not specified" ? item.color : null },
                          ]
                            .filter(({ value }) => value != null)
                            .map(({ label, value }) => (
                              <div key={label} className="flex items-baseline gap-3">
                                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-poppins font-semibold w-10 flex-shrink-0">{label}</span>
                                <span className="text-sm font-poppins text-slate-800 font-medium capitalize">{value}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <p className="text-base font-bold text-slate-900 font-poppins mt-3">{fmt(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex justify-between font-poppins text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>{fmt(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between font-poppins text-sm text-slate-500">
                  <span>Shipping {selectedOrder.shippingProvider ? `· ${selectedOrder.shippingProvider}` : ""}</span>
                  <span>{fmt(selectedOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between font-poppins text-base font-bold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total paid</span>
                  <span className="text-primary">{fmt(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* ── Delivery progress ── */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins font-semibold mb-4">
                Delivery progress
              </p>
              <DeliveryTracker order={selectedOrder} onUpdate={updateOrder} saving={saving} />
            </div>

            <hr className="border-slate-100" />

            {/* ── Ship to ── */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins font-semibold mb-4">Ship to</p>

              {/* Labelled address fields */}
              <div className="space-y-2.5">
                {[
                  { label: "Name",        value: selectedOrder.customerName },
                  { label: "Street",      value: selectedOrder.shippingStreetAddress },
                  { label: "Apartment",   value: selectedOrder.shippingApartment },
                  { label: "City",        value: selectedOrder.shippingCity },
                  { label: "State",       value: selectedOrder.shippingState },
                  { label: "Country",     value: selectedOrder.shippingCountry },
                  { label: "Postal code", value: selectedOrder.shippingPostalCode },
                ]
                  .filter(({ value }) => value && value !== "Not provided")
                  .map(({ label, value }) => (
                    <div key={label} className="flex items-baseline gap-4">
                      <span className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins font-semibold w-20 flex-shrink-0">
                        {label}
                      </span>
                      <span className="text-sm font-poppins text-slate-800 font-medium">{value}</span>
                    </div>
                  ))}
              </div>

              {/* Contact */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                <a
                  href={`tel:${selectedOrder.customerPhone}`}
                  className="flex items-center gap-2 text-sm font-semibold font-poppins text-primary"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {selectedOrder.customerPhone}
                </a>
                <a
                  href={`mailto:${selectedOrder.customerEmail}`}
                  className="flex items-center gap-2 text-sm text-slate-400 font-poppins hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {selectedOrder.customerEmail}
                </a>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* ── Payment ── */}
            <div className="pb-6">
              <p className="text-[11px] uppercase tracking-widest text-slate-400 font-poppins font-semibold mb-4">Payment</p>
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-slate-900 font-poppins">{selectedOrder.paymentMethod}</p>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-poppins font-semibold">Completed</span>
              </div>
              {selectedOrder.paymentReference && (
                <p className="text-xs font-mono text-slate-400 mt-2 break-all">{selectedOrder.paymentReference}</p>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
