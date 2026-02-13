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
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadOrders();
    const interval = setInterval(() => {
    loadOrders();
  }, 3000); // every 3 seconds

  return () => clearInterval(interval);
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

  //for searching orders..
  const filteredOrders = orders.filter(order => {
    const searchLower = search.toLowerCase();
    return (
      order._id?.toLowerCase().includes(searchLower) ||
      order.userId?.name?.toLowerCase().includes(searchLower) ||
      order.userId?.phone?.toLowerCase().includes(searchLower) ||
      order.userId?.address?.toLowerCase().includes(searchLower)
    );

  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6 inline-block">Orders</h1>

        <div className="flex justify-start mb-4">
          <input
            type="text"
            placeholder="🔍Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto no-scrollbar">
          <table className="w-full border">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100 whitespace-nowrap">Order ID</th>
                <th className="border p-2 bg-gray-100 whitespace-nowrap">Name</th>
                <th className="border p-2 bg-gray-100 whitespace-nowrap">Phone</th>
                <th className="border p-2 bg-gray-100 whitespace-nowrap">Address</th>
                <th className='border p-2 bg-gray-100 whitespace-nowrap'>Product and Quantity</th>
                <th className="border p-2 bg-gray-100 whitespace-nowrap">Amount</th>
                <th className="border p-2 bg-gray-100 whitespace-nowrap">Status</th>
                <th className="border p-2 bg-gray-100 whitespace-nowrap">Created</th>
                <th className="border p-2 bg-gray-100 whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id}>
                  <td className="border p-2 text-center whitespace-nowrap">
                    {order._id.slice(-6)}
                  </td>

                  <td className="border p-2 text-center whitespace-nowrap">
                    {order.userId?.name || '—'}
                  </td>

                  <td className='border p-2 text-center whitespace-nowrap'>{order.userId?.phone || '—'}</td>

                  <td className='border p-2 text-center whitespace-nowrap'>{order.userId?.address || '—'}</td>

                  <td className='border p-2 text-center whitespace-nowrap'>
                    {order.items?.map((item: any) => (
                      <div key={item._id}>
                        {item.productId?.title} × {item.quantity}
                      </div>
                    ))}
                  </td>

                  <td className="border p-2 text-center whitespace-nowrap">
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
