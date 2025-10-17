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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-xl text-burgundy">Loading data...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Admin <span className="text-burgundy">Dashboard</span></h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-burgundy">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Orders Overview</h3>
            <p className="text-3xl font-bold text-burgundy">{orders.length}</p>
            <p className="text-slate-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-burgundy">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Newsletter Subscribers</h3>
            <p className="text-3xl font-bold text-burgundy">{subscribers.length}</p>
            <p className="text-slate-600">Active Subscribers</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-slate-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-burgundy text-burgundy'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('subscribers')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'subscribers'
                    ? 'border-burgundy text-burgundy'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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
                <h2 className="text-xl font-semibold mb-4 text-burgundy">Orders Management</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No orders found.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow hover:border-burgundy-200">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">Order #{order.orderId || order.id}</h3>
                            <p className="text-slate-600">Customer: {order.customerName || 'N/A'}</p>
                            <p className="text-slate-600">Email: {order.customerEmail || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-burgundy">
                              ₦{order.totalAmount?.toLocaleString() || '0'}
                            </p>
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                              order.orderStatus === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : order.orderStatus === 'pending'
                                ? 'bg-burgundy-100 text-burgundy-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}>
                              {order.orderStatus || 'unknown'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-burgundy">Payment Information:</p>
                            <p>Method: {order.paymentMethod || 'N/A'}</p>
                            <p>Reference: {order.paymentReference || 'N/A'}</p>
                            {order.createdAt && (
                              <p>Date: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-burgundy">Shipping Information:</p>
                            <p>Location: {order.shippingLocation || 'N/A'}</p>
                            <p>Fee: ₦{order.shippingFee?.toLocaleString() || '0'}</p>
                            <p className="truncate">Address: {order.shippingAddress || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="font-medium mb-2 text-burgundy">Items:</p>
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
                <h2 className="text-xl font-semibold mb-4 text-burgundy">Newsletter Subscribers</h2>
                {subscribers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">No subscribers yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-burgundy-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-burgundy-900 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-burgundy-900 uppercase tracking-wider">
                            Subscribed At
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-burgundy-900 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-burgundy-900 uppercase tracking-wider">
                            Source
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {subscribers.map((subscriber) => (
                          <tr key={subscriber.id} className="hover:bg-burgundy-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-slate-900">
                                {subscriber.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-500">
                                {subscriber.subscribedAt.toLocaleDateString()} at{' '}
                                {subscriber.subscribedAt.toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                subscriber.status === 'active' 
                                  ? 'bg-burgundy-100 text-burgundy-800' 
                                  : 'bg-slate-100 text-slate-800'
                              }`}>
                                {subscriber.status || 'active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
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
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-burgundy">
          <h3 className="text-lg font-semibold mb-4 text-burgundy">Export Data</h3>
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
              className="bg-burgundy text-white px-4 py-2 rounded hover:bg-burgundy-700 transition-colors"
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
              className="bg-burgundy text-white px-4 py-2 rounded hover:bg-burgundy-700 transition-colors"
            >
              Export Subscribers as CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}