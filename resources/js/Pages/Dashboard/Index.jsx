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

    // Show small toast when admin posts new forum message
    useEffect(() => {
        const handler = (e) => {
            const msg = e.detail?.message ?? e.detail;
            if (!msg) return;

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'info',
                title: 'Admin memposting di forum',
                text: msg.message || '',
                showConfirmButton: false,
                timer: 5000,
                timerProgressBar: true,
            });
        };

        window.addEventListener('forum.message.created', handler);
        return () => window.removeEventListener('forum.message.created', handler);
    }, []);

    // Polling background agar data transaksi & notifikasi update otomatis
    usePolling(['transactions', 'notifications', 'limit']);

    // Prefer server-provided limit data (accurate): used_hkd, limit_hkd, percentage
    const usedHKD = limit.used_hkd ?? 0;
    const limitHKD = limit.limit_hkd ?? 8000;
    const percentage = limit.percentage ?? Math.min(100, Math.round((usedHKD / limitHKD) * 100));
    const remainingHKD = Math.max(0, limitHKD - usedHKD);
    const isHKDLimitExceeded = usedHKD >= limitHKD;

    const balanceDisplay = user?.balance_display ?? (user?.balance ? `Rp ${Intl.NumberFormat('id-ID').format(user.balance)}` : (limit.remaining_idr ? `Rp ${Intl.NumberFormat('id-ID').format(limit.remaining_idr)}` : 'Rp 0'));

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
                <section className="bg-gradient-to-r from-[#0057B8] to-[#0073E6] rounded-b-3xl p-6 text-white shadow-lg">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm opacity-90">Selamat datang,</p>
                            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
                                {user.name}
                            </h1>
                            <p className="text-sm opacity-90 mt-1">Aplikasi Sahabat Chandra</p>
                        </div>

                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-0 lg:ml-6">
                            <div className={`rounded-xl p-3 ${isHKDLimitExceeded ? 'bg-red-600/30' : 'bg-white/10'} text-white`}>
                                <p className="text-xs opacity-90">1 Bulan - Batas Transaksi (HKD)</p>
                                <div className="mt-2 flex items-end justify-between gap-3">
                                    <div className="flex-1">
                                        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                                            <div
                                                    className={`h-3 ${isHKDLimitExceeded ? 'bg-red-500' : 'bg-green-400'}`}
                                                    style={{ width: `${Math.min(100, percentage)}%` }}
                                                />
                                        </div>
                                        <div className="mt-2 flex items-center justify-between text-sm">
                                            <span className="opacity-90">Terpakai: {Number(usedHKD).toLocaleString(undefined, {maximumFractionDigits:2})} HKD</span>
                                            <span className="opacity-90">Sisa: {Number(remainingHKD).toLocaleString(undefined, {maximumFractionDigits:2})} HKD</span>
                                        </div>
                                        <div className="mt-1 text-xs opacity-80">Batas: {Number(limitHKD).toLocaleString()} HKD</div>
                                    </div>
                                </div>
                                {isHKDLimitExceeded && (
                                    <p className="mt-2 text-sm text-red-200">Batas 8.000 HKD tercapai — tunggu bulan depan</p>
                                )}
                            </div>
                            <div className="rounded-xl bg-white/10 p-3 text-white">
                                <p className="text-xs opacity-90">Transaksi Pending</p>
                                <p className="mt-1 font-semibold text-lg">{transactions.filter(t=>t.status==='pending').length}</p>
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
                            subtitle={isHKDLimitExceeded ? 'Batas 1 bulan 8.000 HKD terlampaui' : `Transfer`}
                            onClick={() => {
                                if (isHKDLimitExceeded) {
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Batas Bulanan Terlampaui',
                                        text: 'Anda sudah mencapai batas 1 bulan sebesar 8.000 HKD. Silakan tunggu bulan depan untuk melakukan transaksi.',
                                        confirmButtonColor: '#0057B8',
                                    });
                                    return;
                                }

                                setShowTransaction(true);
                            }}
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
                        <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500">Kuota HKD Bulan Ini</p>
                            <p className="mt-1 font-semibold text-lg">Terpakai: {Number(usedHKD).toLocaleString(undefined, {maximumFractionDigits:2})} HKD</p>
                            <p className="text-sm text-gray-500 mt-1">Sisa: {Number(remainingHKD).toLocaleString(undefined, {maximumFractionDigits:2})} HKD</p>
                            <p className="text-sm text-gray-500 mt-1">Batas: {Number(limitHKD).toLocaleString()} HKD</p>
                            {isHKDLimitExceeded && (
                                <p className="text-sm text-red-600 mt-1">Batas 8.000 HKD tercapai</p>
                            )}
                        </div>
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
