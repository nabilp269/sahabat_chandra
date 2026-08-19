import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Eye,
    Search,
    CheckCircle,
    XCircle,
    Clock3,
    CreditCard,
    ScanLine,
    RefreshCw,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import BarcodeScanner from "@/Components/BarcodeScanner";

export default function Index({ transactions: initial = [] }) {
    const [trxList, setTrxList] = useState(initial || []);
    const [search, setSearch] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [realtimeConnected, setRealtimeConnected] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | Sinkronisasi jika data Inertia berubah
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setTrxList(initial || []);
    }, [initial]);

    /*
    |--------------------------------------------------------------------------
    | Laravel Reverb
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!window.Echo) {
            console.error("Laravel Echo belum tersedia.");
            return;
        }

        console.log("Menghubungkan ke channel admin.transactions...");

        const channel = window.Echo.channel("admin.transactions");

        /*
        |--------------------------------------------------------------------------
        | Transaksi baru dibuat oleh user
        |--------------------------------------------------------------------------
        */

        channel.listen(".TransactionCreated", (event) => {
            console.log("Realtime TransactionCreated:", event);

            const transaction = event.transaction;

            if (!transaction?.id) {
                console.warn(
                    "TransactionCreated tidak memiliki data transaction:",
                    event
                );
                return;
            }

            setTrxList((prev) => {
                // Jangan sampai transaksi yang sama masuk dua kali
                const alreadyExists = prev.some(
                    (trx) => trx.id === transaction.id
                );

                if (alreadyExists) {
                    return prev.map((trx) =>
                        trx.id === transaction.id
                            ? { ...trx, ...transaction }
                            : trx
                    );
                }

                return [transaction, ...prev];
            });
        });

        /*
        |--------------------------------------------------------------------------
        | Status transaksi berubah
        |--------------------------------------------------------------------------
        */

        channel.listen(".TransactionStatusUpdated", (event) => {
            console.log("Realtime TransactionStatusUpdated:", event);

            const transaction = event.transaction;

            if (!transaction?.id) {
                console.warn(
                    "TransactionStatusUpdated tidak memiliki data transaction:",
                    event
                );
                return;
            }

            setTrxList((prev) =>
                prev.map((trx) =>
                    trx.id === transaction.id
                        ? {
                              ...trx,
                              ...transaction,
                          }
                        : trx
                )
            );
        });

        /*
        |--------------------------------------------------------------------------
        | Tandai koneksi realtime
        |--------------------------------------------------------------------------
        */

        try {
            channel.subscribed(() => {
                console.log(
                    "Berhasil subscribe ke channel admin.transactions"
                );

                setRealtimeConnected(true);
            });
        } catch (error) {
            console.warn(
                "Tidak dapat membaca status subscription Reverb:",
                error
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Cleanup
        |--------------------------------------------------------------------------
        */

        return () => {
            console.log("Meninggalkan channel admin.transactions");

            channel.stopListening(".TransactionCreated");
            channel.stopListening(".TransactionStatusUpdated");

            window.Echo.leave("admin.transactions");
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const filteredTransactions = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) {
            return trxList;
        }

        return trxList.filter((trx) => {
            return (
                String(trx.id ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(trx.transaction_code ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(trx.user?.name ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(trx.user?.email ?? "")
                    .toLowerCase()
                    .includes(keyword) ||
                String(trx.receiver_name ?? "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [trxList, search]);

    /*
    |--------------------------------------------------------------------------
    | Status Badge
    |--------------------------------------------------------------------------
    */

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

            default:
                return (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold">
                        <Clock3 size={16} />
                        Pending
                    </span>
                );
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Format Amount
    |--------------------------------------------------------------------------
    */

    const formatAmount = (amount) => {
        if (amount === null || amount === undefined) {
            return "-";
        }

        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <AdminLayout>
            <Head title="Data Transaksi" />

            <div className="space-y-6">

                {/* =========================================================
                    HEADER
                ========================================================== */}

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Data Transaksi
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Semua transaksi pengguna Sahabat Chandra.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">

                        {/* Status Realtime */}

                        <div
                            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
                                realtimeConnected
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                        >
                            <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                    realtimeConnected
                                        ? "bg-green-500 animate-pulse"
                                        : "bg-gray-400"
                                }`}
                            />

                            {realtimeConnected
                                ? "Realtime aktif"
                                : "Menghubungkan..."}
                        </div>

                        {/* Total */}

                        <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3">
                            <CreditCard size={22} />

                            <div>
                                <p className="text-sm">Total</p>

                                <h3 className="text-xl font-bold">
                                    {trxList.length}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =========================================================
                    SEARCH + SCANNER
                ========================================================== */}

                <div className="bg-white rounded-2xl shadow p-5">
                    <div className="flex gap-3">

                        <div className="relative flex-1">
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

                        <button
                            type="button"
                            onClick={() => setShowScanner(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition shrink-0"
                        >
                            <ScanLine size={20} />
                            Scan QR
                        </button>
                    </div>
                </div>

                {/* Scanner */}

                {showScanner && (
                    <BarcodeScanner
                        onClose={() => setShowScanner(false)}
                    />
                )}

                {/* =========================================================
                    TABLE
                ========================================================== */}

                <div className="bg-white rounded-2xl shadow overflow-hidden">

                    <div className="overflow-x-auto">

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

                                            {/* ID */}

                                            <td className="px-5 py-4">

                                                <p className="font-semibold">
                                                    #{trx.id}
                                                </p>

                                                {trx.transaction_code && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {
                                                            trx.transaction_code
                                                        }
                                                    </p>
                                                )}

                                            </td>

                                            {/* USER */}

                                            <td className="px-5 py-4">

                                                <p className="font-semibold">
                                                    {trx.user?.name ?? "-"}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {trx.user?.email ?? "-"}
                                                </p>

                                            </td>

                                            {/* RECEIVER */}

                                            <td className="px-5 py-4">
                                                {trx.receiver_name ?? "-"}
                                            </td>

                                            {/* AMOUNT */}

                                            <td className="px-5 py-4 font-semibold text-blue-600">

                                                HK${" "}

                                                {trx.amount_hkd !==
                                                undefined
                                                    ? formatAmount(
                                                          trx.amount_hkd
                                                      )
                                                    : formatAmount(
                                                          trx.amount
                                                      )}

                                            </td>

                                            {/* STATUS */}

                                            <td className="px-5 py-4">
                                                {badgeStatus(trx.status)}
                                            </td>

                                            {/* ACTION */}

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
                                                    Belum ada data transaksi
                                                    yang ditemukan.
                                                </p>

                                            </div>

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>
                </div>

                {/* =========================================================
                    FOOTER
                ========================================================== */}

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