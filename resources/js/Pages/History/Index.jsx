import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { Filter, ArrowDownCircle, CheckCircle, XCircle, Clock, MapPin, Calendar, SlidersHorizontal } from "lucide-react";

export default function History({
    transactions = [],
    branches = [],
    filters = {},
    messages = [],
    notifications = [],
}) {
    const [branch, setBranch] = useState(filters.branch ?? "");
    const [startDate, setStartDate] = useState(filters.start_date ?? "");
    const [endDate, setEndDate] = useState(filters.end_date ?? "");
    const [showFilter, setShowFilter] = useState(false);

    const formatRupiah = (angka) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

    const formatTanggal = (tanggal) =>
        new Date(tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

    const filterData = () => {
        router.get(route("history"), { branch, start_date: startDate, end_date: endDate }, { preserveState: true, preserveScroll: true });
        setShowFilter(false);
    };

    const resetFilter = () => {
        setBranch(""); setStartDate(""); setEndDate("");
        router.get(route("history"), {}, { preserveState: true });
        setShowFilter(false);
    };

    const statusConfig = {
        pending: { label: "Menunggu", icon: <Clock size={14} />, cls: "bg-yellow-100 text-yellow-700" },
        success: { label: "Berhasil", icon: <CheckCircle size={14} />, cls: "bg-green-100 text-green-700" },
        failed:  { label: "Ditolak",  icon: <XCircle size={14} />,   cls: "bg-red-100 text-red-700" },
    };

    const activeFilters = [branch, startDate, endDate].filter(Boolean).length;

    return (
        <AppLayout messages={messages} notifications={notifications}>
            <Head title="Riwayat Transaksi" />

            <div className="max-w-2xl mx-auto px-4 pb-10">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#0057B8] to-[#0073E6] rounded-3xl p-6 text-white shadow-lg mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
                            <p className="text-sm text-blue-100 mt-1">
                                {transactions.length} transaksi ditemukan
                            </p>
                        </div>
                        <div className="bg-white/20 rounded-2xl p-3">
                            <ArrowDownCircle size={28} />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-5">
                        {["pending","success","failed"].map((s) => (
                            <div key={s} className="bg-white/15 rounded-2xl p-3 text-center">
                                <p className="text-xl font-bold">
                                    {transactions.filter(t => t.status === s).length}
                                </p>
                                <p className="text-xs text-blue-100 mt-0.5">{statusConfig[s].label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filter Button */}
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className="w-full flex items-center justify-between bg-white rounded-2xl shadow-sm px-5 py-4 mb-4 border border-gray-100 hover:shadow-md transition"
                >
                    <div className="flex items-center gap-3">
                        <SlidersHorizontal size={20} className="text-blue-600" />
                        <span className="font-semibold text-slate-700">Filter Transaksi</span>
                        {activeFilters > 0 && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{activeFilters}</span>
                        )}
                    </div>
                    <Filter size={18} className="text-gray-400" />
                </button>

                {/* Filter Panel */}
                {showFilter && (
                    <div className="bg-white rounded-2xl shadow-md p-5 mb-5 border border-gray-100 space-y-4">
                        {branches.length > 1 && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Cabang</label>
                                <select value={branch} onChange={(e) => setBranch(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option value="">Semua Cabang</option>
                                    {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Dari Tanggal</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Sampai Tanggal</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={resetFilter}
                                className="flex-1 border border-gray-300 text-slate-600 rounded-xl py-3 font-semibold hover:bg-gray-50 transition">
                                Reset
                            </button>
                            <button onClick={filterData}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold transition">
                                Terapkan
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                {transactions.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ArrowDownCircle size={36} className="text-gray-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700">Belum Ada Transaksi</h2>
                        <p className="text-gray-400 mt-2">Riwayat transaksi akan muncul di sini.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((trx) => {
                            const s = statusConfig[trx.status] ?? statusConfig.pending;
                            return (
                                <div key={trx.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                                <ArrowDownCircle size={22} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{trx.receiver_name}</p>
                                                <p className="text-sm text-gray-500">{trx.receiver_bank}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-bold text-red-600">{formatRupiah(trx.amount)}</p>
                                            <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
                                                {s.icon} {s.label}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-4 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {formatTanggal(trx.created_at)}
                                        </span>
                                        {trx.branch?.name && (
                                            <span className="flex items-center gap-1">
                                                <MapPin size={12} />
                                                {trx.branch.name}
                                            </span>
                                        )}
                                        <span className="ml-auto font-mono text-gray-300">{trx.transaction_code}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
