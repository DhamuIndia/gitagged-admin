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

  const changeStatus = async(id: string, status: string) => {
    await updateSellerStatus(id, status);
    load();
  };

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
                      className="text-blue-600 pr-4"
                    >
                      View
                    </button>
                    <select
                      value={s.status}
                      onChange={(e) => changeStatus(s._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {selectedSeller && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-[600px] relative">

              <button
                onClick={() => setSelectedSeller(null)}
                className="absolute top-4 right-4 text-gray-500"
              >
                ✕
              </button>

              <h2 className="text-xl font-semibold mb-4">
                Seller Details
              </h2>

              <div className="space-y-3 text-sm">

                <p><strong>Business:</strong> {selectedSeller.businessName}</p>
                <p><strong>Business Type:</strong> {selectedSeller.businessType}</p>
                <p><strong>GST:</strong> {selectedSeller.gstNumber}</p>
                <p><strong>PAN:</strong> {selectedSeller.panNumber}</p>
                <p><strong>Account Holder:</strong> {selectedSeller.accountHolderName}</p>
                <p><strong>Account No:</strong> {selectedSeller.bankAccountNumber}</p>
                <p><strong>IFSC:</strong> {selectedSeller.ifscCode}</p>
                <p><strong>Mobile:</strong> {selectedSeller.mobileNumber}</p>

                {selectedSeller.digitalSignatureUrl && (
                  <div className="pt-2">
                    <strong>Digital Signature:</strong>
                    <img
                      src={selectedSeller.digitalSignatureUrl}
                      className="mt-2 h-24 border rounded"
                    />
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}