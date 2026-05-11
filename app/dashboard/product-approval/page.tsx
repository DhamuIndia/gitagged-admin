'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProductApproval() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:3002/products/pending');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const approveProduct = async (product: any) => {
    setLoading(true);
    try {
      if (product.isUpdatePending) {
        await axios.patch(`http://localhost:3002/products/${product._id}/approve-update`);
      } else {
        await axios.patch(`http://localhost:3002/products/${product._id}/approve`);
      }
      setSelectedProduct(null);
      fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  const rejectProduct = async (product: any) => {
    if (!rejectReason.trim()) {
      alert('Enter rejection reason');
      return;
    }

    setLoading(true);
    try {
      if (product.isUpdatePending) {
        await axios.patch(
          `http://localhost:3002/products/${product._id}/reject-update`,
          { reason: rejectReason }
        );
      } else {
        await axios.patch(
          `http://localhost:3002/products/${product._id}/reject`,
          { reason: rejectReason }
        );
      }

      setRejectReason('');
      setShowRejectBox(false);
      setSelectedProduct(null);
      fetchProducts();
    } finally {
      setLoading(false);
    }
  };

  const renderCompareField = (
    label: string,
    oldValue: any,
    newValue: any
  ) => {

    const oldStr =
      oldValue === undefined ||
        oldValue === null ||
        oldValue === ''
        ? '—'
        : JSON.stringify(oldValue);

    const newStr =
      newValue === undefined ||
        newValue === null ||
        newValue === ''
        ? '—'
        : JSON.stringify(newValue);

    const changed = oldStr !== newStr;

    return (
      <div className="grid grid-cols-3 gap-4 border-b py-3 items-start">

        {/* LABEL */}
        <div className="font-semibold text-gray-700">
          {label}
        </div>

        {/* OLD */}
        <div className="bg-gray-50 p-3 rounded-lg">
          {oldStr}
        </div>

        {/* NEW */}
        <div
          className={`p-3 rounded-lg ${changed
            ? 'bg-yellow-100 border border-yellow-400'
            : 'bg-gray-50'
            }`}
        >
          {newStr}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Product Approval</h1>

      {/* TABLE (NO STOCK HERE) */}
      <div className="bg-white shadow rounded-xl p-4 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3">S.No</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p: any, index) => (
              <tr key={p._id} className="border-b hover:bg-gray-50">

                <td className="p-3 text-center">{index + 1}</td>

                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.images?.[0] || '/no-image.png'}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-xs text-gray-500">
                        {p.categories?.[0]?.name || 'No category'}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-3 text-center">
                  {p.sellerId?.sellerName || '—'}
                </td>

                <td className="p-3 text-center text-sm">
                  {p.isUpdatePending ? (
                    <span className="bg-orange-100 text-yellow-700 rounded-full py-1 px-3">
                      UPDATE PRODUCT
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 rounded-full py-1 px-3">
                      NEW PRODUCT
                    </span>
                  )}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedProduct(p);
                      setShowRejectBox(false);
                      setRejectReason('');
                    }}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    Review
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6">

            {/* DETECT VARIANT */}
            {(() => {
              const isVariant = selectedProduct.variantOptions?.length > 0;
              const currentData = selectedProduct;
              const updatedData = selectedProduct.pendingUpdates;

              return (
                <>
                  <h3 className="text-xl font-bold mb-4">Product Details</h3>

                  {selectedProduct.isUpdatePending ? (

                    <div className="grid grid-cols-2 gap-8">

                      {/* CURRENT PRODUCT */}
                      <div className="border rounded-2xl p-5 bg-white shadow-sm">

                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            📦
                          </div>

                          <div>
                            <h2 className="text-xl font-bold text-blue-700">
                              Current Product
                            </h2>

                            <p className="text-sm text-gray-500">
                              Existing product data
                            </p>
                          </div>
                        </div>

                        <img
                          src={currentData.images?.[0] || '/no-image.png'}
                          className="w-full h-52 rounded-xl object-cover border mb-6"
                        />

                        <div className="space-y-4 text-sm">

                          {/* SELLER NAME!! */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">Seller Name</span>
                            <span className="text-gray-800">{currentData.sellerId?.sellerName || '—'}</span>
                          </div>

                          {/* TITLE */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">Title</span>
                            <span className="text-gray-800">
                              {currentData.title || '—'}
                            </span>
                          </div>

                          {/* DESCRIPTION */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Description
                            </span>

                            <span className="text-gray-800">
                              {currentData.description || '—'}
                            </span>
                          </div>

                          {/* CATEGORY */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Category
                            </span>

                            <span>
                              {currentData.categories?.[0]?.name || '—'}
                            </span>
                          </div>

                          {/* REGION */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Region
                            </span>

                            <span>
                              {currentData.giRegions?.[0]?.name || '—'}
                            </span>
                          </div>

                          {/* PRICE */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Price
                            </span>

                            <span>
                              ₹{currentData.variants?.[0]?.price || 0}
                            </span>
                          </div>

                          {/* ATTRIBUTES */}
                          <div className="grid grid-cols-2 gap-3 items-start">

                            <span className="text-gray-500 font-medium">
                              Attributes
                            </span>

                            <div className="space-y-2">

                              {currentData?.attributes &&
                                Object.keys(currentData.attributes).length > 0 ? (

                                Object.entries(currentData.attributes).map(
                                  ([key, value]: any) => {

                                    const changed =
                                      currentData.attributes?.[key] !== value;

                                    return (
                                      <div
                                        key={key}
                                        className={`rounded-lg p-2 flex justify-between ${changed
                                          ? 'bg-yellow-200 border border-yellow-400'
                                          : 'bg-gray-50'
                                          }`}
                                      >
                                        <span className="font-medium">
                                          {key}
                                        </span>

                                        <span>{value}</span>
                                      </div>
                                    );
                                  }
                                )

                              ) : (

                                <span className="text-gray-400">
                                  --
                                </span>

                              )}

                            </div>

                          </div>

                          {/* VARIANTS */}
                          <div className="text-gray-800"></div>

                          {/* RETURN POLICY */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Return Allowed
                            </span>

                            <span>
                              {currentData.isReturnAllowed ? 'Allowed' : 'Not Allowed'}
                            </span>
                          </div>

                          {/* RETURN VALIDITY */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Return Validity
                            </span>

                            <span>
                              {currentData.returnValidityDays || 0} days
                            </span>
                          </div>

                          {/* VARIANTS */}
                          <div>
                            <p className="text-gray-500 font-medium mb-2">
                              Variants
                            </p>

                            <div className="space-y-2">

                              {currentData.variants?.map((v: any, i: number) => (

                                <div
                                  key={i}
                                  className="bg-gray-50 border rounded-lg p-3"
                                >
                                  <p>
                                    <b>Variant:</b> {v.values?.join(' / ')}
                                  </p>

                                  <p>
                                    <b>Price:</b> ₹{v.price}
                                  </p>

                                  <p>
                                    <b>Discount:</b> {v.discountPercentage || 0}%
                                  </p>
                                </div>

                              ))}

                            </div>
                          </div>

                        </div>
                      </div>

                      {/* UPDATED PRODUCT */}
                      <div className="border-2 border-yellow-300 rounded-2xl p-5 bg-yellow-50 shadow-sm">

                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            ⚠️
                          </div>

                          <div>
                            <h2 className="text-xl font-bold text-green-700">
                              Updated Product
                            </h2>

                            <p className="text-sm text-gray-500">
                              Seller updated data
                            </p>
                          </div>
                        </div>

                        <img
                          src={
                            updatedData?.images?.[0] ||
                            currentData.images?.[0] ||
                            '/no-image.png'
                          }
                          className={`w-full h-52 rounded-xl object-cover border mb-6 ${JSON.stringify(currentData.images) !==
                            JSON.stringify(updatedData?.images)
                            ? 'border-yellow-500 ring-2 ring-yellow-300'
                            : ''
                            }`}
                        />

                        <div className="space-y-4 text-sm">

                          {/* SELLER NAME!! */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">Seller Name</span>
                            <span className="text-gray-800">{currentData.sellerId?.sellerName || '—'}</span>
                          </div>

                          {/* TITLE */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Title
                            </span>

                            <span
                              className={
                                currentData.title !== updatedData?.title
                                  ? 'bg-yellow-200 px-2 py-1 rounded font-semibold'
                                  : ''
                              }
                            >
                              {updatedData?.title || currentData.title}
                            </span>
                          </div>

                          {/* DESCRIPTION */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Description
                            </span>

                            <span
                              className={
                                currentData.description !== updatedData?.description
                                  ? 'bg-yellow-200 px-2 py-1 rounded'
                                  : ''
                              }
                            >
                              {updatedData?.description ||
                                currentData.description}
                            </span>
                          </div>

                          {/* CATEGORY */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Category
                            </span>

                            <span
                              className={
                                JSON.stringify(currentData.categories) !==
                                  JSON.stringify(updatedData?.categories)
                                  ? 'bg-yellow-200 px-2 py-1 rounded'
                                  : ''
                              }
                            >
                              {updatedData?.categories?.[0]?.name ||
                                currentData.categories?.[0]?.name}
                            </span>
                          </div>

                          {/* REGION */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Region
                            </span>

                            <span
                              className={
                                JSON.stringify(currentData.giRegions) !==
                                  JSON.stringify(updatedData?.giRegions)
                                  ? 'bg-yellow-200 px-2 py-1 rounded'
                                  : ''
                              }
                            >
                              {updatedData?.giRegions?.[0]?.name ||
                                currentData.giRegions?.[0]?.name}
                            </span>
                          </div>

                          {/* PRICE */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Price
                            </span>

                            <span
                              className={
                                currentData.variants?.[0]?.price !==
                                  updatedData?.variants?.[0]?.price
                                  ? 'bg-yellow-200 px-2 py-1 rounded font-semibold'
                                  : ''
                              }
                            >
                              ₹{
                                updatedData?.variants?.[0]?.price ||
                                currentData.variants?.[0]?.price
                              }
                            </span>
                          </div>

                          {/* ATTRIBUTES */}
                          <div>
                            <p className="text-gray-500 font-medium mb-2">
                              Attributes
                            </p>

                            <div className="space-y-2">

                              {Object.entries(
                                updatedData?.attributes || {}
                              ).map(([key, value]: any) => {

                                const changed =
                                  currentData.attributes?.[key] !== value;

                                return (
                                  <div
                                    key={key}
                                    className={`rounded-lg p-2 flex justify-between ${changed
                                      ? 'bg-yellow-200 border border-yellow-400'
                                      : 'bg-gray-50'
                                      }`}
                                  >
                                    <span className="font-medium">
                                      {key}
                                    </span>

                                    <span>{value}</span>
                                  </div>
                                );
                              })}

                            </div>
                          </div>

                          {/* RETURN POLICY */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Return Allowed
                            </span>

                            <span
                              className={
                                currentData.isReturnAllowed !== updatedData?.isReturnAllowed
                                  ? 'bg-yellow-200 px-2 py-1 rounded'
                                  : ''
                              }
                            >
                              {(updatedData?.isReturnAllowed ??
                                currentData.isReturnAllowed)
                                ? 'Allowed'
                                : 'Not Allowed'}
                            </span>
                          </div>

                          {/* RETURN VALIDITY */}
                          <div className="grid grid-cols-2 gap-3">
                            <span className="text-gray-500 font-medium">
                              Return Validity
                            </span>

                            <span
                              className={
                                currentData.returnValidityDays !==
                                  (updatedData?.returnValidityDays ??
                                    currentData.returnValidityDays)
                                  ? 'bg-yellow-200 px-2 py-1 rounded'
                                  : ''
                              }
                            >
                              {(
                                updatedData?.returnValidityDays ??
                                currentData.returnValidityDays ??
                                0
                              )} days
                            </span>
                          </div>

                          {/* VARIANTS */}
                          <div>
                            <p className="text-gray-500 font-medium mb-2">
                              Variants
                            </p>

                            <div className="space-y-2">

                              {(updatedData?.variants || currentData.variants)?.map(
                                (v: any, i: number) => {

                                  const oldVariant = currentData.variants?.[i];

                                  const changed =
                                    JSON.stringify(oldVariant) !==
                                    JSON.stringify(v);

                                  return (
                                    <div
                                      key={i}
                                      className={`border rounded-lg p-3 ${changed
                                        ? 'bg-yellow-200 border-yellow-400'
                                        : 'bg-gray-50'
                                        }`}
                                    >
                                      <p>
                                        <b>Variant:</b> {v.values?.join(' / ')}
                                      </p>

                                      <p>
                                        <b>Price:</b> ₹{v.price}
                                      </p>

                                      <p>
                                        <b>Discount:</b>{" "}
                                        {v.discountPercentage ??
                                          oldVariant?.discountPercentage ??
                                          0}%
                                      </p>
                                    </div>
                                  );
                                }
                              )}

                            </div>
                          </div>

                        </div>
                      </div>

                    </div>

                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-y-3 text-sm mt-4">

                        <span className="text-gray-500">Image</span>
                        <img
                          src={selectedProduct.images?.[0] || '/no-image.png'}
                          className="w-20 h-20 rounded-lg object-cover border"
                        />

                        <span className="text-gray-500">Name</span>
                        <span className="font-medium">{selectedProduct.title}</span>

                        <span className="text-gray-500">Description</span>
                        <span>{selectedProduct.description || '-'}</span>

                        <span className="text-gray-500">Category</span>
                        <span>{selectedProduct.categories?.[0]?.name || '-'}</span>

                        <span className="text-gray-500">Region</span>
                        <span>{selectedProduct.giRegions?.[0]?.name || '-'}</span>

                        <span className="text-gray-500">Return Policy</span>
                        <span>
                          {selectedProduct.isReturnAllowed ? 'Allowed' : 'Not Allowed'}
                        </span>

                        <span className="text-gray-500">Return Validity</span>
                        <span>{selectedProduct.returnValidityDays || 0} days</span>

                      </div>

                      <br />

                      <h2 className="text-xl font-bold mb-4">
                        {isVariant ? 'Variant Product' : ''}
                      </h2>

                      {/* NON VARIANT */}
                      {!isVariant && (
                        <div className="space-y-2">
                          <p><b>Price:</b> ₹{selectedProduct.variants?.[0]?.price}</p>
                          <p><b>Discount:</b> {selectedProduct.variants?.[0]?.discountPercentage || 0}%</p>
                          <p><b>Stock:</b> {selectedProduct.totalStock}</p>
                        </div>
                      )}

                      {/* VARIANT TABLE */}
                      {isVariant && (
                        <table className="w-full border mt-4">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="p-2 border">Variant</th>
                              <th className="p-2 border">Price</th>
                              <th className="p-2 border">Discount</th>
                              <th className="p-2 border">Stock</th>
                            </tr>
                          </thead>

                          <tbody>
                            {selectedProduct.variants.map((v: any, i: number) => {
                              const batch = selectedProduct.batches?.find(
                                (b: any) =>
                                  JSON.stringify(b.variantValues.sort()) ===
                                  JSON.stringify(v.values.sort())
                              );

                              return (
                                <tr key={i}>
                                  <td className="p-2 border">
                                    {v.values.join(' / ')}
                                  </td>
                                  <td className="p-2 border">₹{v.price}</td>
                                  <td className="p-2 border">
                                    {v.discountPercentage || 0}%
                                  </td>
                                  <td className="p-2 border">
                                    {batch?.stock || 0}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}

                    </>
                  )}
                </>
              );
            })()}

            {/* REJECT */}
            {showRejectBox && (
              <div className="mt-6 border-t pt-4">

                <p className="text-sm font-semibold text-red-600 mb-2">
                  Enter rejection reason (required)
                </p>

                <textarea
                  placeholder="Why are you rejecting this product?"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />

                <div className="flex gap-3 mt-3">

                  {/* SUBMIT */}
                  <button
                    disabled={loading || !rejectReason.trim()}
                    onClick={() => rejectProduct(selectedProduct)}
                    className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {loading ? 'Rejecting...' : 'Submit Rejection'}
                  </button>

                  {/* CANCEL */}
                  <button
                    onClick={() => {
                      setShowRejectBox(false);
                      setRejectReason('');
                    }}
                    className="border px-4 py-2 rounded"
                  >
                    Cancel
                  </button>

                </div>
              </div>
            )}

            {/* ACTION */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                disabled={loading || showRejectBox}
                onClick={() => approveProduct(selectedProduct)}
                className="bg-green-600 text-white px-4 py-2"
              >
                {loading ? 'Processing...' : 'Approve'}
              </button>

              <button
                disabled={loading}
                onClick={() => {
                  setShowRejectBox(true);
                  setRejectReason('');
                }}
                className="bg-red-500 text-white px-4 py-2 disabled:opacity-50"
              >
                Reject
              </button>

              <button
                onClick={() => setSelectedProduct(null)}
                className="border px-4 py-2"
              >
                Close
              </button>
            </div>

          </div >
        </div>
      )}
    </div>
  );
}