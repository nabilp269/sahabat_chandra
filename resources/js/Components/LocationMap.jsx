// import { useState, useEffect, useCallback } from "react";
// import {
//     GoogleMap,
//     useJsApiLoader,
//     Marker,
//     InfoWindow,
// } from "@react-google-maps/api";

// const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// const mapContainerStyle = { width: "100%", height: "100%" };

// const defaultCenter = { lat: -6.2, lng: 106.816666 };

// export default function LocationMap({ branches = [] }) {
//     const { isLoaded } = useJsApiLoader({
//         googleMapsApiKey: GOOGLE_MAPS_API_KEY,
//     });

//     const [userPos, setUserPos] = useState(null);
//     const [selected, setSelected] = useState(null);
//     const [map, setMap] = useState(null);

//     useEffect(() => {
//         if (!navigator.geolocation) return;
//         navigator.geolocation.getCurrentPosition(
//             (pos) =>
//                 setUserPos({
//                     lat: pos.coords.latitude,
//                     lng: pos.coords.longitude,
//                 }),
//             () => {}
//         );
//     }, []);

//     const onLoad = useCallback(
//         (mapInstance) => {
//             setMap(mapInstance);

//             const bounds = new window.google.maps.LatLngBounds();

//             if (userPos) bounds.extend(userPos);

//             branches.forEach((b) => {
//                 if (b.latitude && b.longitude) {
//                     bounds.extend({
//                         lat: Number(b.latitude),
//                         lng: Number(b.longitude),
//                     });
//                 }
//             });

//             if (!bounds.isEmpty()) mapInstance.fitBounds(bounds);
//         },
//         [userPos, branches]
//     );

//     // Fit bounds saat userPos baru tersedia setelah map sudah load
//     useEffect(() => {
//         if (!map || !userPos) return;

//         const bounds = new window.google.maps.LatLngBounds();
//         bounds.extend(userPos);
//         branches.forEach((b) => {
//             if (b.latitude && b.longitude) {
//                 bounds.extend({
//                     lat: Number(b.latitude),
//                     lng: Number(b.longitude),
//                 });
//             }
//         });
//         map.fitBounds(bounds);
//     }, [userPos, map]);

//     if (!isLoaded) {
//         return (
//             <div className="flex h-full w-full items-center justify-center bg-slate-100 rounded-[24px]">
//                 <p className="text-slate-500 text-sm">Memuat peta...</p>
//             </div>
//         );
//     }

//     return (
//         <GoogleMap
//             mapContainerStyle={mapContainerStyle}
//             center={userPos ?? defaultCenter}
//             zoom={12}
//             onLoad={onLoad}
//             options={{
//                 streetViewControl: false,
//                 mapTypeControl: false,
//                 fullscreenControl: true,
//             }}
//         >
//             {/* Marker lokasi user */}
//             {userPos && (
//                 <Marker
//                     position={userPos}
//                     title="Lokasi Anda"
//                     icon={{
//                         url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//                     }}
//                 />
//             )}

//             {/* Marker setiap cabang */}
//             {branches
//                 .filter((b) => b.latitude && b.longitude)
//                 .map((branch) => (
//                     <Marker
//                         key={branch.id}
//                         position={{
//                             lat: Number(branch.latitude),
//                             lng: Number(branch.longitude),
//                         }}
//                         title={branch.name}
//                         onClick={() => setSelected(branch)}
//                     />
//                 ))}

//             {/* InfoWindow saat marker cabang diklik */}
//             {selected && (
//                 <InfoWindow
//                     position={{
//                         lat: Number(selected.latitude),
//                         lng: Number(selected.longitude),
//                     }}
//                     onCloseClick={() => setSelected(null)}
//                 >
//                     <div className="min-w-[200px] space-y-2 text-sm text-slate-800">
//                         <p className="text-base font-semibold">{selected.name}</p>
//                         <p className="text-xs text-slate-500">{selected.address}</p>
//                         <div className="grid grid-cols-2 gap-2 text-xs">
//                             <div className="rounded-lg bg-slate-100 p-2">
//                                 <p className="font-semibold">Status</p>
//                                 <p>{selected.status || "-"}</p>
//                             </div>
//                             <div className="rounded-lg bg-slate-100 p-2">
//                                 <p className="font-semibold">Jarak</p>
//                                 <p>
//                                     {selected.distance
//                                         ? `${selected.distance.toFixed(2)} km`
//                                         : "-"}
//                                 </p>
//                             </div>
//                         </div>
//                         <button
//                             className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
//                             onClick={() =>
//                                 window.open(
//                                     `https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`,
//                                     "_blank"
//                                 )
//                             }
//                         >
//                             Buka Rute
//                         </button>
//                     </div>
//                 </InfoWindow>
//             )}
//         </GoogleMap>
//     );
// }


import { useEffect, useMemo, useState } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

const defaultCenter = [-6.2, 106.816666];

/*
|--------------------------------------------------------------------------
| ICON CABANG
|--------------------------------------------------------------------------
*/

const branchIcon = new L.Icon({
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

/*
|--------------------------------------------------------------------------
| ICON LOKASI USER
|--------------------------------------------------------------------------
*/

const userIcon = new L.DivIcon({
    className: "custom-user-marker",

    html: `
        <div style="
            width: 20px;
            height: 20px;
            background: #2563eb;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.25);
        "></div>
    `,

    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

/*
|--------------------------------------------------------------------------
| AUTO FIT MAP
|--------------------------------------------------------------------------
*/

function FitBounds({ branches, userPos }) {
    const map = useMap();

    useEffect(() => {
        const points = [];

        if (userPos) {
            points.push(userPos);
        }

        branches.forEach((branch) => {
            if (
                branch.latitude !== null &&
                branch.latitude !== undefined &&
                branch.longitude !== null &&
                branch.longitude !== undefined
            ) {
                points.push([
                    Number(branch.latitude),
                    Number(branch.longitude),
                ]);
            }
        });

        /*
        |--------------------------------------------------------------
        | Tidak ada titik
        |--------------------------------------------------------------
        */

        if (points.length === 0) {
            map.setView(defaultCenter, 12);
            return;
        }

        /*
        |--------------------------------------------------------------
        | Hanya satu titik
        |--------------------------------------------------------------
        */

        if (points.length === 1) {
            map.setView(points[0], 14);
            return;
        }

        /*
        |--------------------------------------------------------------
        | Banyak titik
        |--------------------------------------------------------------
        */

        const bounds = L.latLngBounds(points);

        map.fitBounds(bounds, {
            padding: [40, 40],
        });
    }, [branches, userPos, map]);

    return null;
}

/*
|--------------------------------------------------------------------------
| LOCATION MAP
|--------------------------------------------------------------------------
*/

export default function LocationMap({ branches = [] }) {
    const [userPos, setUserPos] = useState(null);
    const [locationError, setLocationError] = useState(false);

    /*
    |--------------------------------------------------------------------------
    | AMBIL LOKASI USER
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError(true);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserPos([
                    position.coords.latitude,
                    position.coords.longitude,
                ]);

                setLocationError(false);
            },

            (error) => {
                console.warn(
                    "Lokasi user tidak dapat diakses:",
                    error.message
                );

                setLocationError(true);
            },

            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000,
            }
        );
    }, []);

    /*
    |--------------------------------------------------------------------------
    | FILTER CABANG VALID
    |--------------------------------------------------------------------------
    */

    const validBranches = useMemo(() => {
        return branches.filter(
            (branch) =>
                branch.latitude !== null &&
                branch.latitude !== undefined &&
                branch.longitude !== null &&
                branch.longitude !== undefined
        );
    }, [branches]);

    /*
    |--------------------------------------------------------------------------
    | MAPTILER TILE URL
    |--------------------------------------------------------------------------
    */

    const tileUrl = `https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`;

    /*
    |--------------------------------------------------------------------------
    | CEK API KEY
    |--------------------------------------------------------------------------
    */

    if (!MAPTILER_API_KEY) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-[24px] bg-red-50 p-6">
                <div className="text-center">
                    <p className="font-semibold text-red-700">
                        API MapTiler belum ditemukan.
                    </p>

                    <p className="mt-2 text-sm text-red-600">
                        Pastikan VITE_MAPTILER_API_KEY sudah ada di file .env
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                className="h-full w-full"
                scrollWheelZoom={true}
            >
                {/* ======================================================
                    MAPTILER
                ====================================================== */}

                <TileLayer
                    url={tileUrl}
                    attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                    maxZoom={22}
                />

                {/* ======================================================
                    AUTO FIT
                ====================================================== */}

                <FitBounds
                    branches={validBranches}
                    userPos={userPos}
                />

                {/* ======================================================
                    LOKASI USER
                ====================================================== */}

                {userPos && (
                    <Marker
                        position={userPos}
                        icon={userIcon}
                    >
                        <Popup>
                            <div className="min-w-[180px]">
                                <p className="font-semibold text-slate-800">
                                    Lokasi Anda
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Posisi Anda saat ini
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* ======================================================
                    MARKER CABANG
                ====================================================== */}

                {validBranches.map((branch) => {
                    const latitude = Number(branch.latitude);
                    const longitude = Number(branch.longitude);

                    return (
                        <Marker
                            key={branch.id}
                            position={[latitude, longitude]}
                            icon={branchIcon}
                        >
                            <Popup>
                                <div className="min-w-[220px]">
                                    {/* NAMA */}

                                    <h3 className="text-base font-bold text-slate-800">
                                        {branch.name}
                                    </h3>

                                    {/* ALAMAT */}

                                    <p className="mt-1 text-sm text-slate-500">
                                        {branch.address}
                                    </p>

                                    {/* DETAIL */}

                                    <div className="mt-3 space-y-2">
                                        {/* STATUS */}

                                        <div className="rounded-lg bg-slate-100 p-2">
                                            <p className="text-xs font-semibold text-slate-500">
                                                Status
                                            </p>

                                            <p
                                                className={`text-sm font-semibold ${
                                                    branch.status === "Buka"
                                                        ? "text-emerald-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {branch.status || "-"}
                                            </p>
                                        </div>

                                        {/* TELEPON */}

                                        <div className="rounded-lg bg-slate-100 p-2">
                                            <p className="text-xs font-semibold text-slate-500">
                                                Telepon
                                            </p>

                                            <p className="text-sm font-semibold text-slate-800">
                                                {branch.phone || "-"}
                                            </p>
                                        </div>

                                        {/* JAM */}

                                        <div className="rounded-lg bg-slate-100 p-2">
                                            <p className="text-xs font-semibold text-slate-500">
                                                Jam Operasional
                                            </p>

                                            <p className="text-sm font-semibold text-slate-800">
                                                {branch.open_time || "-"} -{" "}
                                                {branch.close_time || "-"}
                                            </p>
                                        </div>

                                        {/* KOORDINAT */}

                                        <div className="rounded-lg bg-slate-100 p-2">
                                            <p className="text-xs font-semibold text-slate-500">
                                                Koordinat
                                            </p>

                                            <p className="text-sm font-semibold text-slate-800">
                                                {latitude}, {longitude}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ==================================================
                                        BUKA RUTE
                                    ================================================== */}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.open(
                                                `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
                                                "_blank",
                                                "noopener,noreferrer"
                                            );
                                        }}
                                        className="mt-3 w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Buka Rute
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* ==========================================================
                STATUS LOKASI
            ========================================================== */}

            <div className="absolute left-3 top-3 z-[1000]">
                <div className="rounded-xl bg-white/95 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur">
                    {userPos ? (
                        <span className="text-emerald-600">
                            ● Lokasi Anda terdeteksi
                        </span>
                    ) : locationError ? (
                        <span className="text-amber-600">
                            ● Lokasi tidak tersedia
                        </span>
                    ) : (
                        <span className="text-slate-500">
                            ● Mengakses lokasi...
                        </span>
                    )}
                </div>
            </div>

            {/* ==========================================================
                JUMLAH CABANG
            ========================================================== */}

            <div className="absolute bottom-3 left-3 z-[1000]">
                <div className="rounded-xl bg-white/95 px-3 py-2 text-xs font-semibold text-slate-700 shadow-lg backdrop-blur">
                    {validBranches.length} cabang
                </div>
            </div>
        </div>
    );
}