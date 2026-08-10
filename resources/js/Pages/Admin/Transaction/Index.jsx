import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Eye,
    Search,
    CheckCircle,
    XCircle,
    Clock3,
    CreditCard,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function Index({ transactions }) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['transactions'],
                preserveState: true,
                preserveScroll: true,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const [search, setSearch] = useState("");

    const filteredTransactions = useMemo(() => {

        return transactions.filter((trx) => {

            const keyword = search.toLowerCase();

            return (
                String(trx.id).includes(keyword) ||
                (trx.user?.name ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                (trx.receiver_name ?? "")
                    .toLowerCase()
                    .includes(keyword)
            );

        });

    }, [transactions, search]);

    const badgeStatus = (status) => {
        switch (status) {
            case "success":
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                        <CheckCircle size={16} />
                        Success
                    </span>
                );

            case "failed":
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                        <XCircle size={16} />
                        Failed
                    </span>
                );

            case "pending":
            default:
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                        <Clock3 size={16} />
                        Pending
                    </span>
                );
        }
    };

    return (

        <AdminLayout>

            <Head title="Data Transaksi" />

            <div className="space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">

                    <div>

                        <h1 className="text-3xl font-bold text-slate-800">
                            Data Transaksi
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Semua transaksi pengguna Sahabat Chandra.
                        </p>

                    </div>

                    <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3">

                        <CreditCard size={22} />

                        <div>

                            <p className="text-sm">
                                Total
                            </p>

                            <h3 className="text-xl font-bold">
                                {transactions.length}
                            </h3>

                        </div>

                    </div>

                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl shadow p-5">

                    <div className="relative">

                        <Search
                            size={20}
                            className="absolute left-4 top-3.5 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Cari nama pengirim, penerima atau ID transaksi..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                    </div>

                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-[#0057B8] text-white">

                            <tr>

                                <th className="px-5 py-4 text-left">
                                    ID
                                </th>

                                <th className="px-5 py-4 text-left">
                                    Pengirim
                                </th>

                                <th className="px-5 py-4 text-left">
                                    Penerima
                                </th>

                                <th className="px-5 py-4 text-left">
                                    HKD
                                </th>

                                <th className="px-5 py-4 text-left">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-center">
                                    Aksi
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredTransactions.length > 0 ? (

                                filteredTransactions.map((trx) => (

                                    <tr
                                        key={trx.id}
                                        className="border-b hover:bg-blue-50 transition"
                                    >

                                        <td className="px-5 py-4 font-semibold">
                                            #{trx.id}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div>

                                                <p className="font-semibold">
                                                    {trx.user?.name ?? "-"}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {trx.user?.email}
                                                </p>

                                            </div>

                                        </td>

                                        <td className="px-5 py-4">
                                            {trx.receiver_name}
                                        </td>

                                        <td className="px-5 py-4 font-semibold text-blue-600">
                                            HK$ {trx.amount_hkd}
                                        </td>

                                        <td className="px-5 py-4">
                                            {badgeStatus(trx.status)}
                                        </td>

                                        <td className="px-5 py-4 text-center">

                                            <Link
                                                href={route(
                                                    "admin.transaction.show",
                                                    trx.id
                                                )}
                                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-xl"
                                            >

                                                <Eye size={18} />

                                                Detail

                                            </Link>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan={6}
                                        className="py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center">

                                            <CreditCard
                                                size={55}
                                                className="text-gray-300"
                                            />

                                            <h2 className="mt-4 text-xl font-bold text-gray-600">
                                                Tidak ada transaksi
                                            </h2>

                                            <p className="text-gray-400 mt-2">
                                                Belum ada data transaksi yang ditemukan.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

                {/* Footer */}
                <div className="flex justify-between items-center text-sm text-gray-500">

                    <span>
                        Total Transaksi :
                        <span className="font-bold text-blue-600 ml-2">
                            {filteredTransactions.length}
                        </span>
                    </span>

                    <span>
                        Sahabat Chandra Admin Panel
                    </span>

                </div>

            </div>

        </AdminLayout>

    );

}