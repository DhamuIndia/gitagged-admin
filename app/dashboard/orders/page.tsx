'use client';

import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '@/lib/orders';

const STATUS_COLORS: any = {
  PLACED: 'bg-blue-600',
  PAID: 'bg-purple-600',
  SHIPPED: 'bg-yellow-600',
  DELIVERED: 'bg-green-600',
  CANCELLED: 'bg-red-600',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const res = await getAllOrders();
    setOrders(res.data);
    setLoading(false);
  };

  const changeStatus = async (orderId: string, status: string) => {
    await updateOrderStatus(orderId, status);
    loadOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">Orders</h1>

        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto no-scrollbar">
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100">Order ID</th>
                <th className="border p-2 bg-gray-100">Name</th>
                <th className="border p-2 bg-gray-100">Phone</th>
                <th className="border p-2 bg-gray-100">Address</th>
                <th className="border p-2 bg-gray-100">Amount</th>
                <th className="border p-2 bg-gray-100">Status</th>
                <th className="border p-2 bg-gray-100">Created</th>
                <th className="border p-2 bg-gray-100">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="border p-2 text-center whitespace-nowrap">
                    {order._id.slice(-6)}
                  </td>

                  <td className="border p-2 text-center whitespace-nowrap">
                      {order.userId?.name || '—'}
                  </td>

                  <td className='border p-2 text-center whitespace-nowrap'>{order.userId?.phone ||'—'}</td>

                  <td className='border p-2 text-center whitespace-nowrap'>{order.userId?.address ||'—'}</td>

                  <td className="border p-2 text-center font-semibold whitespace-nowrap">
                    ₹{order.totalAmount}
                  </td>

                  <td className="border p-2 text-center whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="border p-2 text-center text-sm whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="border p-2 text-center whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        changeStatus(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="PLACED">PLACED</option>
                      <option value="PAID">PAID</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center p-4 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {loading && (
            <div className="text-center mt-4 text-gray-500">
              Loading orders...
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
