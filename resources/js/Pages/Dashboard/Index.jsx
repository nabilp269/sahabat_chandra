import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";



import HistoryModal from "@/Components/Popup/HistoryModal";
import TransactionModal from "@/Components/Popup/TransactionModal";
import NotificationModal from "@/Components/Popup/NotificationModal";

import { router } from "@inertiajs/react";

export default function Dashboard({
    user,
    balance = 0,
    transactions = [],
    messages = [],
    notifications = [],

    branches = [],

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

    const formatBalance = (amount) => {
        return Number(amount).toLocaleString("id-ID");
    };

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
                        <div className="rounded-3xl bg-white p-5 text-gray-900 shadow-sm">
                            <p className="text-sm text-gray-500">Saldo tersedia</p>
                            <p className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                                <span className="text-xl sm:text-2xl font-medium">Rp&nbsp;</span>
                                {formatBalance(balance)}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Dapatkan informasi transaksi terbaru di bawah.
                            </p>
                        </div>

                        <div className="rounded-3xl bg-blue-800/90 p-5 shadow-sm text-white">
                            <p className="text-sm opacity-80">Aktifitas</p>
                            <p className="mt-3 text-2xl font-bold">{transactions.length}</p>
                            <p className="mt-2 text-sm opacity-80">Transaksi terakhir</p>
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
                        <MenuButton emoji="💰" label="Saldo" subtitle="Lihat" />
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
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                trx.status === "pending"
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
