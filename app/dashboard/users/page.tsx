'use client';

import { useEffect, useState } from 'react';
import { getUsers, blockUser, unblockUser } from '@/lib/users';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const res = await getUsers();
        setUsers(res.data);
    };

    const toggleBlock = async (user: any) => {
        if (user.isBlocked) {
            await unblockUser(user._id);
        } else {
            await blockUser(user._id);
        }
        loadUsers();
    };

    const resolveStatus = (user: any) => {
        const isBlocked = user.isBlocked === true || user.isBlocked === 'true';
        const isActive = user.isActive === true || user.isActive === 'true';

        if (isBlocked) return 'Blocked';
        if (!isActive) return 'Inactive';
        return 'Active';
    };


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl font-semibold mb-6">Users</h1>

                <div className="bg-white rounded-xl shadow p-6">
                    <table className="w-full border">
                        <thead>
                            <tr>
                                <th className="border p-2 bg-gray-100">Name</th>
                                <th className="border p-2 bg-gray-100">Email</th>
                                <th className="border p-2 bg-gray-100">Phone</th>
                                <th className="border p-2 bg-gray-100">Address</th>
                                <th className="border p-2 bg-gray-100">Status</th>
                                <th className="border p-2 bg-gray-100">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => {
                                const status = resolveStatus(user);

                                return (
                                    <tr key={user._id}>
                                        <td className="border p-2 text-center">{user.name}</td>
                                        <td className="border p-2 text-center">{user.email}</td>
                                        <td className="border p-2 text-center">{user.phone}</td>
                                        <td className="border p-2 text-center">{user.address}</td>

                                        <td className="border p-2 text-center">
                                            <span className={`px-2 py-1 rounded-full text-white ${
                                                status === 'Active' ? 'bg-green-600' :
                                                status === 'Inactive' ? 'bg-yellow-600' :
                                                'bg-red-600'
                                            }`}>
                                                {status}
                                            </span>
                                        </td>

                                        <td className="border p-2 text-center">
                                            <button
                                                onClick={() => toggleBlock(user)}
                                                className={`px-4 py-1 rounded text-white ${(user.isBlocked === true || user.isBlocked === 'true')
                                                        ? 'bg-green-600 hover:bg-green-700'
                                                        : 'bg-red-600 hover:bg-red-700'
                                                    }`}
                                            >
                                                {(user.isBlocked === true || user.isBlocked === 'true') ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center p-4 text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
