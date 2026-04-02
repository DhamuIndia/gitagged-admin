'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductApproval() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:3002/products/pending');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const approveProduct = async (product: any) => {

    if (product.isUpdatePending) {
      // UPDATE APPROVAL
      await axios.patch(`http://localhost:3002/products/${product._id}/approve-update`);
    } else {
      // NEW PRODUCT APPROVAL
      await axios.patch(`http://localhost:3002/products/${product._id}/approve`);
    }

    setSelectedProduct(null);
    fetchProducts();
  };

  const rejectProduct = async (product: any) => {

    if (product.isUpdatePending) {
      await axios.patch(`http://localhost:3002/products/${product._id}/reject-update`);
    } else {
      await axios.patch(`http://localhost:3002/products/${product._id}/reject`);
    }

    setSelectedProduct(null);
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Approval</h1>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">S.No</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Seller</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p: any, index) => (
              <tr key={p._id}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">{p.title}</td>
                <td className="border p-2 text-center">₹{p.price}</td>
                <td className="border p-2 text-center">
                  {p.sellerId?.sellerName || '—'}
                </td>
                <td className="border p-2 text-center">
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded">{p.approveStatus}</span>

                  {p.isUpdatePending && (
                    <div className="text-xs text-orange-600 mt-1">
                      Update Pending 🔄
                    </div>
                  )}
                </td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No pending products
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-[700px] rounded-lg p-6">

            <h2 className="text-xl font-bold mb-4">Product Review For Updation!!</h2>

            {/* IMAGE */}
            <img
              src={selectedProduct.images?.[0]}
              className="w-full h-48 object-cover mb-4 rounded"
            />

            {/* 🔥 COMPARISON */}
            <div className="grid grid-cols-2 gap-6">

              {/* OLD DATA */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-600">Current <p className='text-red-500 inline'>(Live)</p></h3>

                <p><strong>Title:</strong> {selectedProduct.title}</p>
                <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
                <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
              </div>

              {/* NEW DATA */}
              {selectedProduct.pendingUpdates && (
                <div>
                  <h3 className="font-semibold mb-2 text-blue-600">New Changes</h3>

                  <p>
                    <strong>Title:</strong>{' '}
                    {selectedProduct.pendingUpdates.title || '-'}
                  </p>

                  <p>
                    <strong>Price:</strong>{' '}
                    ₹{selectedProduct.pendingUpdates.price || '-'}
                  </p>

                  <p>
                    <strong>Stock:</strong>{' '}
                    {selectedProduct.pendingUpdates.stock || '-'}
                  </p>

                  <p>
                    <strong>Description:</strong>{' '}
                    {selectedProduct.pendingUpdates.description || '-'}
                  </p>
                </div>
              )}

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={() => approveProduct(selectedProduct)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => rejectProduct(selectedProduct)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>

              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}