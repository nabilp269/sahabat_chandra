import { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import LocationMap from "@/Components/LocationMap";

import {
    Search,
    Navigation,
    Phone,
    Clock,
    MapPin,
    Users,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Hitung Jarak
|--------------------------------------------------------------------------
*/

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

/*
|--------------------------------------------------------------------------
| Card Cabang
|--------------------------------------------------------------------------
*/

const BranchCard = ({ branch }) => {

    const {
        name,
        address,
        status,
        distance,
        phone,
        open_time,
        close_time,
        latitude,
        longitude,
        users = [],
    } = branch;

    const isOpen = status === "Buka";

    const lihatRute = () => {

        if (!latitude || !longitude) {
            alert("Koordinat belum tersedia.");
            return;
        }

        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
            "_blank"
        );

    };

    return (

        <div className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className={`p-5 text-white ${isOpen ? "bg-gradient-to-r from-emerald-600 to-emerald-500" : "bg-gradient-to-r from-rose-600 to-rose-500"}`}>

                <div className="flex items-start justify-between gap-3">

                    <div>

                        <h2 className="text-xl font-bold">
                            {name}
                        </h2>

                        <p className="mt-1 text-sm text-white/90">
                            {address}
                        </p>

                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                            isOpen
                                ? "bg-white/20 text-white"
                                : "bg-white/20 text-white"
                        }`}
                    >
                        {status}
                    </span>

                </div>

            </div>

            <div className="p-5">

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Navigation size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                                Jarak
                            </span>
                        </div>
                        <p className="mt-2 font-semibold text-slate-800">
                            {distance != null
                                ? `${distance.toFixed(2)} km`
                                : "Belum tersedia"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Phone size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                                Kontak
                            </span>
                        </div>
                        <p className="mt-2 font-semibold text-slate-800">
                            {phone || "-"}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Clock size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                                Jam Operasional
                            </span>
                        </div>
                        <p className="mt-2 font-semibold text-slate-800">
                            {open_time} - {close_time}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3">
                        <div className="flex items-center gap-2 text-slate-500">
                            <MapPin size={16} />
                            <span className="text-xs font-semibold uppercase tracking-wide">
                                Koordinat
                            </span>
                        </div>
                        <p className="mt-2 font-semibold text-slate-800">
                            {latitude}, {longitude}
                        </p>
                    </div>

                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">

                    <div className="flex items-center gap-2 mb-3">

                        <Users size={18} />

                        <span className="font-semibold text-slate-700">
                            User terdaftar di cabang ini
                        </span>

                    </div>

                    {users && users.length > 0 ? (

                        <div className="flex flex-wrap gap-2">

                            {users.map((user) => (

                                <span
                                    key={user.id}
                                    className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                                >
                                    {user.name}
                                </span>

                            ))}

                        </div>

                    ) : branch.users_count > 0 ? (

                        <div className="flex items-center gap-3">
                            <p className="text-sm text-slate-600">{branch.users_count} user terdaftar.</p>
                            <button
                                onClick={() => alert('Detail user belum diimplementasikan: data ringkasan tersedia di backend.')}
                                className="text-sm text-blue-600 underline"
                            >
                                Lihat detail
                            </button>
                        </div>

                    ) : (

                        <p className="text-sm text-slate-400">
                            Belum ada user.
                        </p>

                    )}

                </div>

                <button
                    onClick={lihatRute}
                    className="mt-5 w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    Lihat Rute di Google Maps
                </button>

            </div>

        </div>

    );

};

export default function Location({

    branches = [],
    messages = [],
    notifications = [],

}) {

    const [search, setSearch] = useState("");

    const [userLocation, setUserLocation] =
        useState(null);

    useEffect(() => {

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(

            (position) => {

                setUserLocation({

                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,

                });

            },

            () => {}

        );

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Filter Cabang
    |--------------------------------------------------------------------------
    */

    const filteredBranches = branches

        .filter((branch) => {

            const keyword = (search || "").toLowerCase().trim();

            const name = (branch.name || "").toLowerCase();
            const address = (branch.address || "").toLowerCase();
            const phone = (branch.phone || "").toString().toLowerCase();
            const usersStr = ((branch.users || []).map((u) => u.name).join(" ") || "").toLowerCase();

            return (
                name.includes(keyword) ||
                address.includes(keyword) ||
                phone.includes(keyword) ||
                usersStr.includes(keyword)
            );

        })

        .map((branch) => {

            let distance = null;

            if (

                userLocation &&
                branch.latitude &&
                branch.longitude

            ) {

                distance = getDistance(

                    userLocation.latitude,
                    userLocation.longitude,

                    Number(branch.latitude),
                    Number(branch.longitude)

                );

            }

            return {

                ...branch,
                distance,

            };

        })

        .sort((a, b) => {

            if (a.distance == null) return 1;
            if (b.distance == null) return -1;

            return a.distance - b.distance;

        });

    return (

        <>

            <Head title="Lokasi Cabang" />

            <AppLayout

                messages={messages}
                notifications={notifications}

            >

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                    <div className="rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 p-7 text-white shadow-[0_20px_60px_-20px_rgba(37,99,235,0.45)]">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

                            <div>

                                <h1 className="text-3xl font-bold">
                                    Lokasi Cabang
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm text-blue-100 sm:text-base">
                                    Cari cabang terdekat, lihat posisi pada peta, dan temukan user yang terdaftar pada setiap cabang secara lebih jelas.
                                </p>

                            </div>

                            <div className="rounded-2xl border border-white/20 bg-white/15 px-4 py-3 backdrop-blur">
                                <p className="text-sm font-semibold">
                                    Jarak dihitung otomatis
                                </p>
                                <p className="mt-1 text-sm text-blue-50">
                                    Berdasarkan lokasi Anda saat ini.
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* Search and badges moved into the Peta Cabang card (see below) */}

                    <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                        <div className="mb-4 flex items-start justify-between gap-4">

                            <div className="flex-1">

                                <h2 className="text-xl font-bold text-slate-800">
                                    Peta Cabang
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Tampilan peta yang lebih jelas dan akurat untuk membantu Anda menemukan cabang terdekat.
                                </p>

                                <div className="mt-4">

                                    <div className="rounded-xl bg-slate-50 p-3 shadow-sm">

                                        <div className="flex flex-col gap-3">

                                            <div className="relative">

                                                <Search
                                                    size={20}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                />

                                                <input

                                                    type="text"

                                                    name="search"

                                                    autoComplete="off"

                                                    value={search}

                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        setSearch(v);
                                                        try { console.debug("search input:", v); } catch (err) {}
                                                    }}

                                                    placeholder="Cari nama cabang atau alamat..."

                                                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-400"

                                                />

                                            </div>

                                            <div className="flex gap-2 items-center">

                                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-blue-700">
                                                    <MapPin size={16} />
                                                    <span className="text-sm">{userLocation ? "Lokasi Anda terdeteksi" : "Mengakses lokasi..."}</span>
                                                </span>

                                                <span className="rounded-full bg-white px-3 py-1.5 text-sm border border-slate-100">
                                                    {filteredBranches.length} cabang
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* Total Cabang now shown inline with search badges */}

                        </div>

                        <div className="h-[520px] overflow-hidden rounded-[24px] border border-slate-200">

                            <LocationMap
                                branches={filteredBranches}
                            />

                        </div>

                    </div>

                    <div className="mt-6 flex items-center justify-between">

                        <div>

                            <h2 className="text-xl font-bold text-slate-800">
                                Daftar Cabang
                            </h2>

                            <p className="text-sm text-slate-500">
                                Pilih cabang yang ingin Anda lihat detailnya.
                            </p>

                        </div>

                    </div>

                    {filteredBranches.length > 0 ? (

                        <div className="mt-4 flex flex-col gap-6">

                            {filteredBranches.map((branch) => (

                                <BranchCard
                                    key={branch.id}
                                    branch={branch}
                                />

                            ))}

                        </div>

                    ) : (

                        <div className="mt-4 rounded-[24px] border border-slate-200 bg-white p-10 text-center shadow-sm">

                            <div className="mb-4 text-6xl">
                                📍
                            </div>

                            <h3 className="text-xl font-bold text-slate-700">
                                Cabang tidak ditemukan
                            </h3>

                            <p className="mt-2 text-slate-500">
                                Tidak ada cabang yang sesuai dengan pencarian.
                            </p>

                        </div>

                    )}

                </div>

            </AppLayout>

        </>

    );

}