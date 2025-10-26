// src/app/admin/orders/page.jsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(ordersQuery);
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-playfair text-primary-900 mb-2">Order Management</h1>
          <p className="text-primary-600 font-poppins mb-6">Manage and track customer orders</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-primary-50">
                  <th className="p-3 text-left font-poppins font-medium text-primary-900">Order ID</th>
                  <th className="p-3 text-left font-poppins font-medium text-primary-900">Customer</th>
                  <th className="p-3 text-left font-poppins font-medium text-primary-900">Items</th>
                  <th className="p-3 text-left font-poppins font-medium text-primary-900">Total</th>
                  <th className="p-3 text-left font-poppins font-medium text-primary-900">Status</th>
                  <th className="p-3 text-left font-poppins font-medium text-primary-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-primary-100 hover:bg-primary-25">
                    <td className="p-3 font-poppins text-sm">
                      <div className="font-medium text-primary-900">{order.orderId}</div>
                      <div className="text-primary-600 text-xs">{order.paymentReference}</div>
                    </td>
                    <td className="p-3 font-poppins text-sm">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-primary-600 text-xs">{order.customerEmail}</div>
                      <div className="text-primary-600 text-xs">{order.customerPhone}</div>
                    </td>
                    <td className="p-3 font-poppins text-sm">
                      {order.items?.map((item, index) => (
                        <div key={index} className="text-xs mb-1">
                          {item.name} ({item.quantity})
                          {item.color && <span className="text-primary-600"> - {item.color}</span>}
                        </div>
                      ))}
                    </td>
                    <td className="p-3 font-poppins font-medium text-primary-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-poppins ${
                        order.orderStatus === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 font-poppins text-sm text-primary-600">
                      {order.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-primary-600 font-poppins">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}