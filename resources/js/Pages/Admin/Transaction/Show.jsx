import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { User, Wallet, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function Show({ transaction: initial }) {
    const [transaction, setTransaction] = useState(initial);
    const { patch, processing } = useForm();

    // Echo: update status realtime saat admin approve/reject dari tab lain
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.channel("admin.transactions");

        channel.listen(".TransactionStatusUpdated", (e) => {
            if (e.transaction.id === transaction.id) {
                setTransaction((prev) => ({ ...prev, ...e.transaction }));
            }
        });

        return () => {
            channel.stopListening(".TransactionStatusUpdated");
            window.Echo.leave("admin.transactions");
        };
    }, [transaction.id]);

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
        success: "bg-green-100 text-green-700",
        failed: "bg-red-100 text-red-700",
    };

    const qrValue = JSON.stringify({
        code: transaction.transaction_code,
        name: transaction.receiver_name,
        bank: transaction.receiver_bank,
        account: transaction.receiver_account,
        amount: transaction.amount,
    });

    return (
        <>
            <Head title="Detail Transaksi" />
            <AdminLayout>
                <div className="space-y-6">

                    <div>
                        <h1 className="text-3xl font-bold">Detail Transaksi</h1>
                        <p className="text-gray-500">Informasi lengkap transaksi pengguna</p>
                    </div>

                    {/* Status + Kode */}
                    <div className="bg-white rounded-2xl shadow p-6 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Status</p>
                            <span className={`px-4 py-2 rounded-full font-semibold ${statusColor[transaction.status] ?? "bg-gray-100 text-gray-700"}`}>
                                {transaction.status}
                            </span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 mb-1">Kode Transaksi</p>
                            <p className="text-xl font-bold tracking-widest text-blue-700">
                                {transaction.transaction_code}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        {/* QR Code */}
                        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
                            <h2 className="font-bold text-lg mb-4 self-start">QR Code Transaksi</h2>
                            <QRCodeSVG value={qrValue} size={200} />
                            <p className="text-xs text-slate-500 mt-3">Scan untuk verifikasi transaksi</p>
                        </div>

                        {/* Data Pengirim */}
                        <div className="bg-white rounded-2xl shadow p-6">
                            <h2 className="font-bold text-lg mb-5">Data Pengirim</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="text-blue-600" />
                                    <div>
                                        <p className="text-gray-500 text-sm">Nama</p>
                                        <p className="font-semibold">{transaction.user?.name}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Email</p>
                                    <p className="font-semibold">{transaction.user?.email}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Informasi Transaksi */}
                    <div className="bg-white rounded-2xl shadow p-6">
                        <h2 className="font-bold text-lg mb-5">Informasi Transaksi</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500 text-sm">Penerima</p>
                                <p className="font-semibold">{transaction.receiver_name}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Bank</p>
                                <p className="font-semibold">{transaction.receiver_bank}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">No. Rekening</p>
                                <p className="font-semibold">{transaction.receiver_account}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Jumlah</p>
                                <p className="font-semibold text-blue-700">
                                    Rp {Number(transaction.amount).toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="text-blue-600" />
                                <div>
                                    <p className="text-gray-500 text-sm">Tanggal</p>
                                    <p className="font-semibold">
                                        {new Date(transaction.created_at).toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Wallet className="text-green-600" />
                                <div>
                                    <p className="text-gray-500 text-sm">ID Transaksi</p>
                                    <p className="font-semibold">#{transaction.id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Approve / Reject */}
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
