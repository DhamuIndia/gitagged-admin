'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/admin-api';
import { updateSellerStatus } from '@/lib/sellers';

export default function SellerApprovalPage() {

    const [newSellers, setNewSellers] = useState<any[]>([]);
    const [profileUpdates, setProfileUpdates] = useState<any[]>([]);
    const [selectedSeller, setSelectedSeller] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        const res = await adminAPI.get('/sellers');

        const sellers = res.data;

        setNewSellers(
            sellers.filter(
                (s: any) => s.status === 'PENDING'
            )
        );

        setProfileUpdates(
            sellers.filter(
                (s: any) => s.isProfileUpdatePending
            )
        );
    };

    const approve = async (id: string) => {
        if (!confirm('Approve this seller?')) return;
        await updateSellerStatus(id, 'APPROVED');
    };

    const reject = async (id: string) => {
        if (!confirm('Reject this seller?')) return;
        await updateSellerStatus(id, 'REJECTED');
    };

    // NEW SELLER APPROVE
    const approveSeller = async (id: string) => {

        await adminAPI.patch(
            `/sellers/${id}/approve`
        );

        fetchData();
    };

    // NEW SELLER REJECT
    const rejectSeller = async (id: string) => {

        const reason = prompt(
            'Enter rejection reason'
        );

        if (!reason) return;

        await adminAPI.patch(
            `/sellers/${id}/reject`,
            { reason }
        );

        fetchData();
    };

    // PROFILE UPDATE APPROVE
    const approveProfileUpdate = async (
        id: string
    ) => {

        await adminAPI.patch(
            `/sellers/${id}/approve-profile-update`
        );

        fetchData();
    };

    // PROFILE UPDATE REJECT
    const rejectProfileUpdate = async (
        id: string
    ) => {

        const reason = prompt(
            'Enter rejection reason'
        );

        if (!reason) return;

        await adminAPI.patch(
            `/sellers/${id}/reject-profile-update`,
            { reason }
        );

        fetchData();
    };

    const Row = ({
        label,
        value,
    }: any) => (
        <div className="flex justify-between">
            <span className="text-gray-500">
                {label}
            </span>

            <span className="font-medium">
                {value || '-'}
            </span>
        </div>
    );

    return (
        <div className="space-y-10">

            {/* NEW SELLERS */}
            <div className="bg-white rounded-2xl shadow-sm p-6">

                <h1 className="text-3xl font-semibold mb-8 text-gray-900">
                    Seller Approval
                </h1>

                <div className="overflow-hidden rounded-2xl border border-gray-100">

                    <table className="w-full">

                        <thead className="bg-gray-50">
                            <tr>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    S.No
                                </th>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    Seller
                                </th>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    Business
                                </th>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {newSellers.map((s, index) => (

                                <tr
                                    key={s._id}
                                    className="border-t"
                                >

                                    <td className="px-6 py-5">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-4">

                                            {/* <div className="h-14 w-14 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                                {s.sellerName?.charAt(0)}
                                            </div> */}

                                            <div>

                                                <p className="font-semibold text-gray-900">
                                                    {s.sellerName}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {s.email}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    <td className="px-6 py-5">
                                        <div>

                                            <p className="font-medium text-gray-800">
                                                {s.businessName}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {s.businessType}
                                            </p>

                                        </div>
                                    </td>

                                    <td className="px-6 py-5">

                                        <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium">
                                            NEW SELLER
                                        </span>

                                    </td>

                                    <td className="px-6 py-5">

                                        <button
                                            onClick={() => setSelectedSeller(s)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition"
                                        >
                                            Review
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* PROFILE UPDATES */}
            <div className="bg-white rounded-2xl shadow-sm p-6">

                <h1 className="text-3xl font-semibold mb-8 text-gray-900">
                    Seller Profile Updates
                </h1>

                <div className="overflow-hidden rounded-2xl border border-gray-100">

                    <table className="w-full">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    S.No
                                </th>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    Seller
                                </th>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    Business
                                </th>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    Status
                                </th>

                                <th className="px-6 py-5 text-left text-sm font-semibold text-gray-700">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {profileUpdates.map((s, index) => (

                                <tr
                                    key={s._id}
                                    className="border-t"
                                >

                                    <td className="px-6 py-5">
                                        {index + 1}
                                    </td>

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-4">

                                            <div className="h-14 w-14 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-lg">
                                                {s.sellerName?.charAt(0)}
                                            </div>

                                            <div>

                                                <p className="font-semibold text-gray-900">
                                                    {s.sellerName}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {s.email}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    <td className="px-6 py-5">

                                        <div>

                                            <p className="font-medium text-gray-800">
                                                {s.businessName}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {s.businessType}
                                            </p>

                                        </div>

                                    </td>

                                    <td className="px-6 py-5">

                                        <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-medium">
                                            UPDATE REQUEST
                                        </span>

                                    </td>

                                    <td className="px-6 py-5">

                                        <button
                                            onClick={() => setSelectedSeller(s)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-medium transition"
                                        >
                                            Review
                                        </button>

                                    </td>

                                </tr>

                            ))}

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
                                                    <Row label="Seller Name" value={selectedSeller.sellerName} />
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

                                            {/* APPROVE */}
                                            {
                                                selectedSeller.status === 'PENDING' && (
                                                    <button
                                                        onClick={() =>
                                                            approveSeller(selectedSeller._id)
                                                        }
                                                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-medium transition"
                                                    >
                                                        Approve
                                                    </button>
                                                )
                                            }

                                            {/* REMOVE / REJECT */}
                                            {
                                                selectedSeller.status === 'PENDING' && (
                                                    <button
                                                        onClick={() =>
                                                            rejectSeller(selectedSeller._id)
                                                        }
                                                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-medium transition"
                                                    >
                                                        Remove
                                                    </button>
                                                )
                                            }

                                            {/* CANCEL */}
                                            <button
                                                onClick={() => setSelectedSeller(null)}
                                                className="border border-gray-300 hover:bg-gray-100 px-5 py-2 rounded-xl font-medium transition"
                                            >
                                                Cancel
                                            </button>

                                        </div>

                                    </div>
                                </div>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}