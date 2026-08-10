import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useEffect } from "react";
import {
    User,
    Wallet,
    Calendar,
    CheckCircle,
    XCircle,
} from "lucide-react";

export default function Show({ transaction }) {
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['transaction'],
                preserveState: true,
                preserveScroll: true,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const { patch, processing } = useForm();

    const approve = () => {
        if (confirm("Approve transaksi ini?")) {
            patch(route("admin.transaction.approve", transaction.id));
        }
    };

    const reject = () => {
        if (confirm("Reject transaksi ini?")) {
            patch(route("admin.transaction.reject", transaction.id));
        }
    };

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
    };

    return (
        <>
            <Head title="Detail Transaksi" />

            <AdminLayout>

                <div className="space-y-6">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Detail Transaksi
                        </h1>

                        <p className="text-gray-500">
                            Informasi lengkap transaksi pengguna
                        </p>
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="font-bold text-lg mb-4">
                            Status
                        </h2>

                        <span
                            className={`px-4 py-2 rounded-full font-semibold ${statusColor[transaction.status] ??
                                "bg-gray-100 text-gray-700"
                                }`}
                        >
                            {transaction.status}
                        </span>

                    </div>

                    {/* Pengirim */}
                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="font-bold text-lg mb-5">
                            Data Pengirim
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5">

                            <div className="flex items-center gap-3">

                                <User className="text-blue-600" />

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Nama
                                    </p>

                                    <p className="font-semibold">
                                        {transaction.user?.name}
                                    </p>

                                </div>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Email
                                </p>

                                <p className="font-semibold">
                                    {transaction.user?.email}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Transaksi */}
                    <div className="bg-white rounded-2xl shadow p-6">

                        <h2 className="font-bold text-lg mb-5">
                            Informasi Transaksi
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Penerima
                                </p>

                                <p className="font-semibold">
                                    {transaction.receiver_name}
                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Nominal HKD
                                </p>

                                <p className="font-semibold">
                                    HK$ {transaction.amount_hkd}
                                </p>

                            </div>

                            <div>

                                <p className="text-gray-500 text-sm">
                                    Nominal IDR
                                </p>

                                <p className="font-semibold">
                                    Rp {transaction.amount_idr}
                                </p>

                            </div>

                            <div className="flex items-center gap-3">

                                <Calendar className="text-blue-600" />

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        Tanggal
                                    </p>

                                    <p className="font-semibold">
                                        {transaction.created_at}
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <Wallet className="text-green-600" />

                                <div>

                                    <p className="text-gray-500 text-sm">
                                        ID Transaksi
                                    </p>

                                    <p className="font-semibold">
                                        #{transaction.id}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Tombol */}
                    {transaction.status === "pending" && (

                        <div className="flex gap-4">

                            <button
                                onClick={approve}
                                disabled={processing}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                            >
                                <CheckCircle size={20} />

                                Approve
                            </button>

                            <button
                                onClick={reject}
                                disabled={processing}
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
                            >
                                <XCircle size={20} />

                                Reject
                            </button>

                        </div>

                    )}

                </div>

            </AdminLayout>
        </>
    );
}