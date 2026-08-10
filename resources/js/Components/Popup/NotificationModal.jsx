import { useState } from "react";
import { Link } from "@inertiajs/react";
import Modal from "../Modal";
import { Bell, MessageCircle, ArrowRight, X, ChevronLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function NotificationModal({ show, onClose, notifications = [] }) {
    const [tab, setTab] = useState("notification");
    const [selectedTrx, setSelectedTrx] = useState(null);
    const [showQR, setShowQR] = useState(false);

    if (!show) return null;

    const statusBadge = (status) => {
        if (status === "pending")
            return <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold">Menunggu Kasir</span>;
        if (status === "success")
            return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Berhasil</span>;
        return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold">Ditolak</span>;
    };

    const handleSelectTrx = (notif) => {
        setSelectedTrx(notif);
        setShowQR(false);
    };

    const handleBack = () => {
        setSelectedTrx(null);
        setShowQR(false);
    };

    // ===================== DETAIL TRANSAKSI =====================
    if (selectedTrx) {
        const qrValue = JSON.stringify({
            code: selectedTrx.transaction_code,
            name: selectedTrx.receiver_name,
            bank: selectedTrx.receiver_bank,
            account: selectedTrx.receiver_account,
            amount: selectedTrx.amount,
        });

        return (
            <Modal show={show} onClose={onClose} maxWidth="md">
                <div className="w-full max-w-md bg-white rounded-[28px] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0057B8] to-[#0F6FFF] px-5 h-16 flex items-center gap-3 text-white">
                        <button
                            onClick={handleBack}
                            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="font-bold">Detail Transaksi</span>
                        <button
                            onClick={onClose}
                            className="ml-auto w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* QR + Kode — hanya muncul setelah tombol diklik */}
                    {showQR && (
                        <>
                            <div className="flex flex-col items-center py-6 px-5 border-b">
                                <QRCodeSVG value={qrValue} size={180} />
                                <p className="mt-3 text-xs text-slate-500">Scan QR Code di kasir</p>
                            </div>
                            <div className="px-5 py-4 border-b text-center">
                                <p className="text-sm text-slate-500 mb-1">Kode Transaksi</p>
                                <p className="text-2xl font-bold tracking-widest text-blue-700">
                                    {selectedTrx.transaction_code}
                                </p>
                            </div>
                        </>
                    )}

                    {/* Detail */}
                    <div className="px-5 py-4 space-y-2 text-sm border-b">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Penerima</span>
                            <span className="font-semibold">{selectedTrx.receiver_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Bank</span>
                            <span className="font-semibold">{selectedTrx.receiver_bank}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">No. Rekening</span>
                            <span className="font-semibold">{selectedTrx.receiver_account}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Jumlah</span>
                            <span className="font-bold text-blue-700">
                                Rp {Number(selectedTrx.amount).toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500">Status</span>
                            {statusBadge(selectedTrx.status)}
                        </div>
                    </div>

                    {/* Tombol */}
                    <div className="p-4 flex gap-3">
                        {selectedTrx.status === "pending" && !showQR && (
                            <button
                                onClick={() => setShowQR(true)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                            >
                                Tampilkan QR & Kode
                            </button>
                        )}
                        <button
                            onClick={handleBack}
                            className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-semibold transition"
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    // ===================== LIST NOTIFIKASI =====================
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="w-full max-w-md h-[78vh] bg-white rounded-[28px] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0057B8] to-[#0F6FFF] px-5 h-20 flex items-center justify-between text-white">
                    <div>
                        <h2 className="font-bold text-lg">Sahabat Chandra</h2>
                        <p className="text-xs opacity-80">Notifikasi & Forum</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center transition"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Tab */}
                <div className="flex bg-white border-b">
                    <button
                        onClick={() => setTab("notification")}
                        className={`flex-1 h-12 flex items-center justify-center gap-2 font-semibold text-sm transition ${
                            tab === "notification"
                                ? "text-[#0057B8] border-b-2 border-[#0057B8]"
                                : "text-gray-500"
                        }`}
                    >
                        <Bell size={16} />
                        Notifikasi
                    </button>
                    <button
                        onClick={() => setTab("forum")}
                        className={`flex-1 h-12 flex items-center justify-center gap-2 font-semibold text-sm transition ${
                            tab === "forum"
                                ? "text-[#0057B8] border-b-2 border-[#0057B8]"
                                : "text-gray-500"
                        }`}
                    >
                        <MessageCircle size={16} />
                        Forum
                    </button>
                </div>

                {/* Notifikasi */}
                {tab === "notification" ? (
                    <div className="flex-1 overflow-y-auto bg-[#F5F7FB] p-4">
                        {notifications.length > 0 ? (
                            <div className="space-y-3">
                                {notifications.map((notif) => {
                                    const isTransaction = notif.type === "transaction";
                                    const isPending = isTransaction && notif.status === "pending";

                                    return (
                                        <div
                                            key={notif.id}
                                            onClick={() => isTransaction && handleSelectTrx(notif)}
                                            className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition ${
                                                isTransaction
                                                    ? "cursor-pointer hover:shadow-md hover:border-blue-200"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h3 className="font-bold text-[#0057B8]">
                                                            {notif.title}
                                                        </h3>
                                                        {isTransaction && statusBadge(notif.status)}
                                                    </div>
                                                    <p className="text-sm text-gray-600 whitespace-pre-line">
                                                        {notif.message}
                                                    </p>
                                                    {isPending && (
                                                        <p className="text-xs text-blue-500 font-medium mt-1">
                                                            Ketuk untuk lihat detail
                                                        </p>
                                                    )}
                                                </div>
                                                <Bell size={18} className="text-[#0057B8] shrink-0" />
                                            </div>
                                            <div className="mt-2 text-right text-xs text-gray-400">
                                                {new Date(notif.created_at).toLocaleString("id-ID")}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Bell size={55} className="mb-4 opacity-40" />
                                <p className="font-semibold">Belum ada notifikasi</p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Forum */
                    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-6">
                        <div className="text-center">
                            <MessageCircle size={64} className="mx-auto text-blue-600 mb-4 opacity-80" />
                            <h3 className="font-bold text-lg text-slate-800 mb-2">Forum Komunitas</h3>
                            <p className="text-sm text-slate-600 mb-6">
                                Lihat informasi dan pengumuman dari Admin
                            </p>
                            <Link
                                href={route("forum.index")}
                                onClick={onClose}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition"
                            >
                                Buka Forum
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
