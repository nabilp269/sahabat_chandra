import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import {
    Trash2,
    Eye,
    Pencil,
    Search,
    Wallet,
} from "lucide-react";
import { useState } from "react";

import TopUpModal from "@/Components/Popup/TopUpModal";

export default function Index({ users = [] }) {
    const [search, setSearch] = useState("");

    const [showTopUp, setShowTopUp] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    const hapus = (id, name) => {
        if (!confirm(`Hapus user ${name}?`)) return;

        router.delete(route("users.destroy", id), {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            <div className="bg-white rounded-2xl shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Data User
                    </h1>

                    <div className="relative w-72">
                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Cari user..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full border rounded-lg pl-10 pr-4 py-2"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3">No</th>
                                <th className="p-3">Nama</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Telepon</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Terdaftar</th>
                                <th className="p-3 text-center">
                                    Aksi
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr
                                        key={user.id}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3">
                                            {index + 1}
                                        </td>

                                        <td className="p-3 font-semibold">
                                            {user.name}
                                        </td>

                                        <td className="p-3">
                                            {user.email}
                                        </td>

                                        <td className="p-3">
                                            {user.phone ?? "-"}
                                        </td>

                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    user.role === "admin"
                                                        ? "bg-red-100 text-red-600"
                                                        : "bg-green-100 text-green-600"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="p-3">
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString(
                                                "id-ID"
                                            )}
                                        </td>

                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">

                                                {/* DETAIL */}
                                                <Link
                                                    href={route(
                                                        "users.show",
                                                        user.id
                                                    )}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                                                >
                                                    <Eye size={16} />
                                                </Link>

                                                {/* EDIT */}
                                                <Link
                                                    href={route(
                                                        "users.edit",
                                                        user.id
                                                    )}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
                                                >
                                                    <Pencil size={16} />
                                                </Link>

                                                {/* TOP UP */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(
                                                            user
                                                        );
                                                        setShowTopUp(
                                                            true
                                                        );
                                                    }}
                                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg"
                                                >
                                                    <Wallet size={16} />
                                                </button>

                                                {/* DELETE */}
                                                {user.id !== 1 && (
                                                    <button
                                                        onClick={() =>
                                                            hapus(
                                                                user.id,
                                                                user.name
                                                            )
                                                        }
                                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                                                    >
                                                        <Trash2
                                                            size={16}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        Tidak ada user.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL TOP UP */}
            {selectedUser && (
                <TopUpModal
                    show={showTopUp}
                    onClose={() => {
                        setShowTopUp(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                />
            )}
        </AdminLayout>
    );
}