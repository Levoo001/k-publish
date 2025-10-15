// app/admin/orders/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { getDocs, collection, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersQuery = collection(db, 'orders');
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersData = [];
        
        ordersSnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() });
        });
        
        setOrders(ordersData);

        // Fetch newsletter subscribers
        const subscribersRef = collection(db, 'newsletter_subscribers');
        const subscribersQuery = query(subscribersRef, orderBy('subscribedAt', 'desc'));
        const subscribersSnapshot = await getDocs(subscribersQuery);
        
        const subscribersData = subscribersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          subscribedAt: doc.data().subscribedAt?.toDate() || new Date()
        }));
        
        setSubscribers(subscribersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-xl">Loading data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders Overview</h3>
            <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
            <p className="text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Newsletter Subscribers</h3>
            <p className="text-3xl font-bold text-green-600">{subscribers.length}</p>
            <p className="text-gray-600">Active Subscribers</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('subscribers')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'subscribers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Newsletter Subscribers ({subscribers.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Orders Management</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders found.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.orderId || order.id}</h3>
                            <p className="text-gray-600">Customer: {order.customerName || 'N/A'}</p>
                            <p className="text-gray-600">Email: {order.customerEmail || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ₦{order.totalAmount?.toLocaleString() || '0'}
                            </p>
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              order.orderStatus === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : order.orderStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {order.orderStatus || 'unknown'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Payment Information:</p>
                            <p>Method: {order.paymentMethod || 'N/A'}</p>
                            <p>Reference: {order.paymentReference || 'N/A'}</p>
                            {order.createdAt && (
                              <p>Date: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">Shipping Information:</p>
                            <p>Location: {order.shippingLocation || 'N/A'}</p>
                            <p>Fee: ₦{order.shippingFee?.toLocaleString() || '0'}</p>
                            <p className="truncate">Address: {order.shippingAddress || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="font-medium mb-2">Items:</p>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>{item.name} (x{item.quantity})</span>
                                  <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Newsletter Subscribers</h2>
                {subscribers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No subscribers yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subscribed At
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Source
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {subscriber.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">
                                {subscriber.subscribedAt.toLocaleDateString()} at{' '}
                                {subscriber.subscribedAt.toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                subscriber.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {subscriber.status || 'active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subscriber.source || 'website'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Export Options */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Export Data</h3>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                const dataStr = JSON.stringify(orders, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'orders.json';
                link.click();
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Export Orders as JSON
            </button>
            <button
              onClick={() => {
                const csv = subscribers.map(sub => 
                  `"${sub.email}","${sub.subscribedAt.toISOString()}","${sub.status}","${sub.source}"`
                ).join('\n');
                const headers = 'Email,Subscribed At,Status,Source\n';
                const dataBlob = new Blob([headers + csv], { type: 'text/csv' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'subscribers.csv';
                link.click();
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            >
              Export Subscribers as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}