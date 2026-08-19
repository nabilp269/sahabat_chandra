import AdminLayout from "@/Layouts/AdminLayout";
import { useState, useEffect } from "react";
import {
    Users,
    MessageCircle,
    MapPin,
    CreditCard,
    TrendingUp,
} from "lucide-react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

export default function Dashboard({
    users,
    transactions: initialTransactions,
    forums,
    branches,

    todayTransactions: initialTodayTransactions,
    totalAmount: initialTotalAmount,

    latestUsers = [],
    latestTransactions: initialLatestTransactions = [],
    latestForums = [],

    chart = [],
}) {
    const [transactionCount, setTransactionCount] = useState(initialTransactions);
    const [todayCount, setTodayCount] = useState(initialTodayTransactions);
    const [totalAmt, setTotalAmt] = useState(initialTotalAmount);
    const [latestTrx, setLatestTrx] = useState(initialLatestTransactions);

    // Echo: real-time update saat ada transaksi baru atau status berubah
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private("admin.transactions");

        channel.listen(".TransactionCreated", (e) => {
            const trx = e.transaction;
            setTransactionCount((prev) => prev + 1);
            setTodayCount((prev) => prev + 1);
            setTotalAmt((prev) => Number(prev) + Number(trx.amount));
            setLatestTrx((prev) => [trx, ...prev].slice(0, 5));
        });

        channel.listen(".TransactionStatusUpdated", (e) => {
            const trx = e.transaction;
            setLatestTrx((prev) =>
                prev.map((t) => (t.id === trx.id ? { ...t, ...trx } : t))
            );
        });

        return () => {
            channel.stopListening(".TransactionCreated");
            channel.stopListening(".TransactionStatusUpdated");
            window.Echo.leave("admin.transactions");
        };
    }, []);


    const cards = [
        {
            title: "Total User",
            total: users,
            icon: Users,
            color: "from-blue-500 to-blue-700",
        },
        {
            title: "Forum",
            total: forums,
            icon: MessageCircle,
            color: "from-green-500 to-green-700",
        },
        {
            title: "Cabang",
            total: branches,
            icon: MapPin,
            color: "from-purple-500 to-purple-700",
        },
        {
            title: "Transaksi",
            total: transactionCount,
            icon: CreditCard,
            color: "from-red-500 to-red-700",
        },
    ];

    return (

        <AdminLayout>

            <div className="space-y-8">

                <div>

                    <h1 className="text-3xl font-bold text-slate-800">
                        Dashboard Admin
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Selamat datang di Dashboard Sahabat Chandra
                    </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">

                    {cards.map((card, index) => {

                        const Icon = card.icon;

                        return (

                            <div
                                key={index}
                                className="rounded-3xl bg-white shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden"
                            >

                                <div className={`bg-gradient-to-r ${card.color} h-2`} />

                                <div className="p-6 flex justify-between items-center">

                                    <div>

                                        <p className="text-gray-500">
                                            {card.title}
                                        </p>

                                        <h2 className="text-4xl font-bold mt-2">
                                            {card.total}
                                        </h2>

                                    </div>

                                    <div
                                        className={`bg-gradient-to-r ${card.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white`}
                                    >

                                        <Icon size={28} />

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    <div className="xl:col-span-2 bg-white rounded-3xl shadow-xl p-6">

                        <div className="flex justify-between items-center mb-6">

                            <div>

                                <h2 className="text-2xl font-bold">
                                    Statistik Aktivitas
                                </h2>

                                <p className="text-gray-500">
                                    Transaksi dan User setiap bulan
                                </p>

                            </div>

                            <div className="flex items-center gap-2 text-blue-600 font-semibold">

                                <TrendingUp />

                                Dashboard Analytics

                            </div>

                        </div>

                        <div className="h-[420px]">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <AreaChart
                                    data={chart}
                                >

                                    <defs>

                                        <linearGradient
                                            id="blue"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >

                                            <stop
                                                offset="5%"
                                                stopColor="#2563eb"
                                                stopOpacity={0.7}
                                            />

                                            <stop
                                                offset="95%"
                                                stopColor="#2563eb"
                                                stopOpacity={0}
                                            />

                                        </linearGradient>

                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="5 5"
                                    />

                                    <XAxis
                                        dataKey="bulan"
                                    />

                                    <YAxis />

                                    <Tooltip />

                                    <Legend />

                                    <Area
                                        type="monotone"
                                        dataKey="transaksi"
                                        stroke="#2563eb"
                                        strokeWidth={4}
                                        fill="url(#blue)"
                                        name="Transaksi"
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="user"
                                        stroke="#10b981"
                                        strokeWidth={4}
                                        dot={{
                                            r: 5,
                                            fill: "#10b981",
                                        }}
                                        activeDot={{
                                            r: 8,
                                        }}
                                        name="User Baru"
                                    />

                                </AreaChart>

                            </ResponsiveContainer>

                        </div>

                        {/* Ringkasan */}

                        <div className="grid grid-cols-2 gap-5 mt-8">

                            <div className="bg-blue-50 rounded-2xl p-5">

                                <p className="text-gray-500">
                                    Total Nominal Transaksi
                                </p>

                                <h2 className="text-3xl font-bold text-blue-700 mt-2">
                                    Rp {Number(totalAmt).toLocaleString("id-ID")}
                                </h2>

                            </div>

                            <div className="bg-green-50 rounded-2xl p-5">

                                <p className="text-gray-500">
                                    Transaksi Hari Ini
                                </p>

                                <h2 className="text-3xl font-bold text-green-700 mt-2">
                                    {todayCount}
                                </h2>

                            </div>

                        </div>

                    </div>

                    {/* Aktivitas */}

                    <div className="bg-white rounded-3xl shadow-xl p-6 overflow-y-auto max-h-[650px]">

                        <h2 className="text-2xl font-bold mb-5">
                            Aktivitas Terbaru
                        </h2>

                        {/* USER */}

                        <div className="mb-8">

                            <h3 className="font-bold text-blue-600 mb-3">
                                👤 User Baru
                            </h3>

                            {latestUsers.length ? (

                                latestUsers.map((user) => (

                                    <div
                                        key={user.id}
                                        className="border rounded-2xl p-3 mb-3 hover:bg-gray-50"
                                    >

                                        <p className="font-semibold">
                                            {user.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {user.email}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <p className="text-gray-400">
                                    Belum ada user.
                                </p>

                            )}

                        </div>

                        {/* FORUM */}

                        <div className="mb-8">

                            <h3 className="font-bold text-green-600 mb-3">
                                💬 Forum
                            </h3>

                            {latestForums.length ? (

                                latestForums.map((forum) => (

                                    <div
                                        key={forum.id}
                                        className="border rounded-2xl p-3 mb-3 hover:bg-gray-50"
                                    >

                                        <p className="font-semibold">
                                            {forum.user?.name}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {forum.message}
                                        </p>

                                    </div>

                                ))

                            ) : (

                                <p className="text-gray-400">
                                    Belum ada forum.
                                </p>

                            )}

                        </div>

                        {/* TRANSAKSI */}

                        <div>

                            <h3 className="font-bold text-red-600 mb-3">
                                💳 Transaksi
                            </h3>

                            {latestTrx.length ? (

                                latestTrx.map((trx) => (

                                    latestTransactions.map((trx) => (

                                        <div
                                            key={trx.id}
                                            className="border rounded-2xl p-3 mb-3 hover:bg-gray-50"
                                        >

                                            <p className="font-semibold">
                                                {trx.user?.name ?? "-"}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                ID : {trx.id}
                                            </p>

                                            <p className="text-xs text-gray-400">
                                                {new Date(trx.created_at).toLocaleString("id-ID")}
                                            </p>

                                        </div>

                                    ))

                                ) : (

                                <p className="text-gray-400">
                                    Belum ada transaksi.
                                </p>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </AdminLayout>

    );

}