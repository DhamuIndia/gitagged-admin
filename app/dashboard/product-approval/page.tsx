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

  const approveProduct = async (id: string) => {
    await axios.patch(`http://localhost:3002/products/${id}/approve`);
    setSelectedProduct(null);
    fetchProducts();
  };

  const rejectProduct = async (id: string) => {
    await axios.patch(`http://localhost:3002/products/${id}/reject`);
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
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded">
                    Pending
                  </span>
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
          <div className="bg-white w-[500px] rounded-lg p-6">

            <h2 className="text-xl font-bold mb-4">Product Details</h2>

            <img
              src={selectedProduct.images?.[0]}
              className="w-full h-40 object-cover mb-3"
            />

            <p><strong>Title:</strong> {selectedProduct.title}</p>
            <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
            <p><strong>Stock:</strong> {selectedProduct.stock}</p>
            <p><strong>Seller:</strong> {selectedProduct.sellerId?.sellerName}</p>

            <p className="mt-2">
              <strong>Description:</strong> {selectedProduct.description}
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => approveProduct(selectedProduct._id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => rejectProduct(selectedProduct._id)}
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