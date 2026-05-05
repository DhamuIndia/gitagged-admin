'use client';

import { useEffect, useState } from 'react';
import {
  getAllSellers,
  updateSellerStatus,
} from '@/lib/sellers';

export default function SellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);

  useEffect(() => {
    load();
  }, []);

  const STATUS_COLORS: any = {
    APPROVED: 'bg-blue-600',
    PENDING: 'bg-yellow-600',
    REJECTED: 'bg-red-600',
  };

  const load = async () => {
    const res = await getAllSellers();
    setSellers(res.data);
  };

  const approve = async (id: string) => {
    if (!confirm('Approve this seller?')) return;
    await updateSellerStatus(id, 'APPROVED');
    load();
  };

  const reject = async (id: string) => {
    if (!confirm('Reject this seller?')) return;
    await updateSellerStatus(id, 'REJECTED');
    load();
  };

  const badgeColor = (status: string) => {
    if (status === 'APPROVED') return 'bg-green-100 text-green-700';
    if (status === 'REJECTED') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const changeStatus = async (id: string, status: string) => {
    await updateSellerStatus(id, status);
    load();
  };

  const Row = ({ label, value }: any) => (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">
        {value || '-'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">
          Sellers
        </h1>

        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">S.No</th>
                <th className="border p-2">Business Name</th>
                <th className="border p-2">User</th>
                <th className="border p-2">GST</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((s, index) => (
                <tr key={s._id}>
                  <td className='border p-2 text-center'>{index + 1}</td>
                  <td className="border p-2 text-center">
                    {s.businessName}
                  </td>

                  <td className="border p-2 text-center">
                    {s.userId?.name}
                  </td>

                  <td className="border p-2 text-center">
                    {s.gstNumber}
                  </td>

                  <td className="border p-2 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${badgeColor(
                        s.status,
                      )}`}
                    >
                      {s.status}
                    </span>
                  </td>

                  <td className="border p-2 text-center whitespace-nowrap">
                    <button
                      onClick={() => setSelectedSeller(s)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {selectedSeller && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl shadow-2xl w-[800px] max-h-[90vh] overflow-y-auto relative p-6">

              {/* CLOSE */}
              <button
                onClick={() => setSelectedSeller(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg"
              >
                ✕
              </button>

              {/* HEADER */}
              <div className="mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Seller Details
                </h2>
                <p className="text-sm text-gray-500">
                  Complete information about the seller
                </p>
              </div>

              {/* GRID SECTIONS */}
              <div className="grid grid-cols-2 gap-6 text-sm">

                {/* BUSINESS INFO */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Business Information
                  </h3>

                  <div className="space-y-2">
                    <Row label="Business Name" value={selectedSeller.businessName} />
                    <Row label="Business Type" value={selectedSeller.businessType} />
                    <Row label="GST Number" value={selectedSeller.gstNumber} />
                    <Row label="PAN Number" value={selectedSeller.panNumber} />
                    <Row label="Description" value={selectedSeller.productDescription} />
                  </div>
                </div>

                {/* CONTACT INFO */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Contact Information
                  </h3>

                  <div className="space-y-2">
                    <Row label="Account Holder" value={selectedSeller.accountHolderName} />
                    <Row label="Mobile" value={selectedSeller.mobileNumber} />
                    <Row label="Email" value={selectedSeller.email} />
                  </div>
                </div>

                {/* BANK INFO */}
                <div className="bg-gray-50 p-4 rounded-xl col-span-2">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Banking Details
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <Row label="Account Number" value={selectedSeller.bankAccountNumber} />
                    <Row label="IFSC Code" value={selectedSeller.ifscCode} />
                  </div>
                </div>

                {/* SIGNATURE */}
                {selectedSeller.digitalSignatureUrl && (
                  <div className="bg-gray-50 p-4 rounded-xl col-span-2">
                    <h3 className="font-semibold text-gray-700 mb-3">
                      Digital Signature
                    </h3>

                    <div className="border rounded-lg p-3 bg-white flex justify-center">
                      <img
                        src={selectedSeller.digitalSignatureUrl}
                        className="h-24 object-contain"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* ACTION BUTTONS */}
              <div className="flex justify-end gap-3 mt-6 border-t pt-4">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Approve
                </button>

                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                  Reject
                </button>

                <button
                  onClick={() => setSelectedSeller(null)}
                  className="border px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}