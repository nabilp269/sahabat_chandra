import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import usePolling from "@/Hooks/usePolling";

import HistoryModal from "@/Components/Popup/HistoryModal";
import TransactionModal from "@/Components/Popup/TransactionModal";
import NotificationModal from "@/Components/Popup/NotificationModal";

export default function Dashboard({
    user,
    transactions = [],
    messages = [],
    notifications = [],
    branches = [],
    limit = {},
}) {

    const [showHistory, setShowHistory] = useState(false);
    const [showTransaction, setShowTransaction] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    // Aman walaupun flash tidak ada
    const page = usePage();
    const flash = page.props.flash ?? {};

    console.log("FLASH:", flash);

    useEffect(() => {
        if (!flash.success) return;

        let title = "";
        let text = "";

        switch (flash.success) {
            case "Login Berhasil":
                title = "Login Berhasil";
                text = "Selamat datang di Sahabat Chandra!";
                break;

            case "Registrasi Berhasil":
                title = "Registrasi Berhasil";
                text = "Akun berhasil dibuat. Selamat datang di Sahabat Chandra!";
                break;

            default:
                title = "Berhasil";
                text = flash.success;
                break;
        }

        Swal.fire({
            icon: "success",
            title,
            text,
            confirmButtonColor: "#0057B8",
        });
    }, [flash.success]);

    // Polling background agar data transaksi & notifikasi update otomatis
    usePolling(['transactions', 'notifications', 'limit']);

    const MenuButton = ({ onClick, emoji, label, subtitle }) => (
        <button
            type="button"
            onClick={onClick}
            className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-white p-4 shadow-sm border border-gray-100 transition hover:shadow-md"
        >
            <div className="bg-blue-50 text-[#0057B8] rounded-2xl p-3 text-xl">
                {emoji}
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold">{label}</p>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            </div>
        </button>
    );

    return (
        <>
            <Head title="Dashboard" />

            <AppLayout messages={messages} notifications={notifications}>
                {/* Header */}
                <section className="bg-[#0057B8] rounded-b-3xl p-6 text-white shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-sm opacity-80">Selamat datang,</p>
                            <h1 className="text-2xl sm:text-3xl font-bold mt-1">
                                {user.name}
                            </h1>
                            <p className="text-sm opacity-80 mt-1">
                                Aplikasi Sahabat Chandra
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4">

                        {/* Card Limit Pemakaian */}
                        <div className="rounded-3xl bg-white p-5 text-gray-900 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">
                                            Pemakaian Limit ({new Date().toLocaleString("id-ID", { month: "short" })})
                                        </p>
                                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                                            <span className="text-xl">HK$</span> {Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(limit.used_hkd || 0)}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium mt-1">
                                            (Rp {Intl.NumberFormat("id-ID").format(limit.used_idr || 0)})
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                                        Max HK$ {Intl.NumberFormat("id-ID").format(limit.limit_hkd || 8000)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-end mb-2">
                                    <p className="text-xs text-gray-500 font-medium">Telah Terpakai</p>
                                    <p className="text-xs text-[#0057B8] font-bold">
                                        Sisa HK$ {Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(limit.remaining_hkd || 8000)}
                                    </p>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${(limit.percentage || 0) >= 100 ? "bg-red-500" : "bg-[#0057B8]"}`}
                                        style={{ width: `${limit.percentage || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Quick Actions */}
                <section className="mt-5">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg font-bold">Aksi Cepat</h2>
                        <span className="text-sm text-gray-500">Mudah digunakan</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <MenuButton
                            emoji="💸"
                            label="Tambah"
                            subtitle="Transfer"
                            onClick={() => setShowTransaction(true)}
                        />
                        <MenuButton
                            emoji="📄"
                            label="Riwayat"
                            subtitle="Detail"
                            onClick={() => setShowHistory(true)}
                        />
                        <MenuButton
                            emoji="📍"
                            label="Cabang"
                            subtitle={`${branches.length} Cabang`}
                        />
                    </div>
                </section>

                {/* Transaksi */}
                <section className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-bold text-lg">Transaksi Terakhir</h2>
                            <p className="text-sm text-gray-500">Periksa riwayat 5 transaksi terbaru</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => router.get(route("history"))}
                            className="text-blue-600 text-sm font-semibold"
                        >
                            Lihat Semua
                        </button>

                    </div>

                    <div className="space-y-3">
                        {transactions.length > 0 ? (
                            transactions.map((trx) => (
                                <div
                                    key={trx.id}
                                    className="bg-white rounded-3xl shadow-sm p-4 flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-500 truncate">
                                            {new Date(trx.created_at).toLocaleDateString("id-ID")}
                                        </p>
                                        <h3 className="font-semibold text-base truncate">
                                            {trx.receiver_name}
                                        </h3>
                                        <p className="text-sm text-gray-500 truncate">
                                            {trx.receiver_bank}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-semibold text-red-600">
                                            Rp {Number(trx.amount).toLocaleString("id-ID")}
                                        </p>
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${trx.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : trx.status === "success"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {trx.status.charAt(0).toUpperCase() + trx.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl shadow-sm p-6 text-center text-gray-500">
                                Belum ada transaksi.
                            </div>
                        )}
                    </div>
                </section>

                <HistoryModal
                    show={showHistory}
                    onClose={() => setShowHistory(false)}
                    branches={branches}
                />

                <TransactionModal show={showTransaction} onClose={() => setShowTransaction(false)} user={user} />
                <NotificationModal
                    show={showNotification}
                    onClose={() => setShowNotification(false)}
                    messages={messages}
                    notifications={notifications}
                />
            </AppLayout>
        </>
    );
}
