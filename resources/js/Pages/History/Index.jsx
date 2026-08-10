import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";

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

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    const formatTanggal = (tanggal) => {
        return new Date(tanggal).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    const filterData = () => {
        router.get(
            route("history"),
            {
                branch,
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Auto-update polling (tanpa reload full page)
    useEffect(() => {
        const interval = setInterval(() => {
            router.reload({
                only: ['transactions', 'notifications'],
                preserveState: true,
                preserveScroll: true,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <AppLayout
            messages={messages}
            notifications={notifications}
        >
            <div className="min-h-screen bg-gray-100">

                {/* HEADER */}
                <div className="bg-[#0057B8] text-white rounded-b-3xl p-6 shadow-lg">
                    <h1 className="text-2xl font-bold">
                        Riwayat Transaksi
                    </h1>

                    <p className="text-sm opacity-80 mt-1">
                        Semua transaksi yang pernah dilakukan
                    </p>
                </div>

                {/* FILTER */}
                <div className="p-4">

                    <div className="bg-white rounded-2xl shadow-md p-5 mb-6 space-y-4">

                        {branches.length > 1 && (
                            <div>
                                <label className="block font-semibold mb-2">
                                    Cabang
                                </label>

                                <select
                                    value={branch}
                                    onChange={(e) => setBranch(e.target.value)}
                                    className="w-full border rounded-xl p-3"
                                >
                                    <option value="">
                                        Semua Cabang
                                    </option>

                                    {branches.map((item) => (
                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block font-semibold mb-2">
                                Tanggal Mulai
                            </label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) =>
                                    setStartDate(e.target.value)
                                }
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <div>
                            <label className="block font-semibold mb-2">
                                Sampai Tanggal
                            </label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) =>
                                    setEndDate(e.target.value)
                                }
                                className="w-full border rounded-xl p-3"
                            />
                        </div>

                        <button
                            onClick={filterData}
                            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl py-3 font-semibold"
                        >
                            Terapkan Filter
                        </button>

                    </div>

                    {/* LIST TRANSAKSI */}

                    {transactions.length === 0 ? (

                        <div className="bg-white rounded-2xl shadow p-8 text-center">

                            <div className="text-6xl mb-4">
                                📄
                            </div>

                            <h2 className="text-xl font-bold">
                                Belum Ada Transaksi
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Riwayat transaksi akan muncul di sini.
                            </p>

                        </div>

                    ) : (

                        transactions.map((trx) => (

                            <div
                                key={trx.id}
                                className="bg-white rounded-2xl shadow-md p-5 mb-4 hover:shadow-lg transition"
                            >
                                <div className="flex justify-between">

                                    <div>

                                        <div className="flex items-center gap-3">

                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                                                👤
                                            </div>

                                            <div>

                                                <h2 className="font-bold text-lg">
                                                    {trx.receiver_name}
                                                </h2>

                                                <p className="text-sm text-gray-500">
                                                    Transfer Uang
                                                </p>

                                            </div>

                                        </div>

                                        <div className="mt-4 text-sm text-gray-600 space-y-1">

                                            <p>
                                                📍{" "}
                                                {trx.branch?.name ??
                                                    "Belum ada cabang"}
                                            </p>

                                            <p>
                                                📅{" "}
                                                {formatTanggal(
                                                    trx.created_at
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <p className="text-xl font-bold text-red-600">
                                            {formatRupiah(trx.amount)}
                                        </p>

                                        <span
                                            className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${trx.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : trx.status === "success"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {trx.status}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>
        </AppLayout>
    );
}