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

const createMarkerIcon = (color, emoji) =>
    L.divIcon({
        className: "custom-marker",
        html: `
            <div style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:9999px;background:${color};color:white;border:3px solid white;box-shadow:0 15px 35px rgba(15,23,42,0.2);">
                <span style="font-size:18px;line-height:1;">${emoji}</span>
            </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -40],
    });

const branchIcon = createMarkerIcon("#2563eb", "📍");
const userIcon = createMarkerIcon("#0f766e", "🧭");

function FitBounds({ positions }) {
    const map = useMap();

    useEffect(() => {
        if (!positions.length) return;

        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, {
            padding: [70, 70],
            maxZoom: 14,
        });
    }, [map, positions]);

    return null;
}

export default function LocationMap({ branches = [] }) {
    const [position, setPosition] = useState([-6.2, 106.816666]);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            },
            () => {}
        );
    }, []);

    const validBranches = branches.filter(
        (branch) =>
            branch.latitude !== null &&
            branch.longitude !== null &&
            branch.latitude !== "" &&
            branch.longitude !== ""
    );

    const positions = useMemo(
        () => [
            position,
            ...validBranches.map((branch) => [
                Number(branch.latitude),
                Number(branch.longitude),
            ]),
        ],
        [position, validBranches]
    );

    const fallbackCenter = useMemo(() => {
        const firstBranch = validBranches[0];

        if (firstBranch) {
            return [Number(firstBranch.latitude), Number(firstBranch.longitude)];
        }

        return position;
    }, [position, validBranches]);

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={fallbackCenter}
                zoom={12}
                scrollWheelZoom={true}
                zoomControl={true}
                style={{
                    height: "100%",
                    width: "100%",
                }}
                className="h-full w-full rounded-[24px] relative z-0"
            >
                <FitBounds positions={positions} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={position} icon={userIcon}>
                    <Popup>
                        <div className="space-y-2 text-sm">
                            <p className="font-semibold text-slate-800">Lokasi Anda</p>
                            <p className="text-slate-600">Posisi GPS saat ini</p>
                        </div>
                    </Popup>
                </Marker>

                {validBranches.map((branch) => (
                    <Marker
                        key={branch.id}
                        position={[Number(branch.latitude), Number(branch.longitude)]}
                        icon={branchIcon}
                    >
                        <Popup>
                            <div className="min-w-[220px] space-y-3 text-sm text-slate-800">
                                <div>
                                    <p className="text-base font-semibold">{branch.name}</p>
                                    <p className="text-xs text-slate-600">{branch.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                                    <div className="rounded-2xl bg-slate-100 p-2">
                                        <p className="font-semibold">Status</p>
                                        <p>{branch.status || "-"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-100 p-2">
                                        <p className="font-semibold">Jarak</p>
                                        <p>{branch.distance ? `${branch.distance.toFixed(2)} km` : "-"}</p>
                                    </div>
                                </div>
                                <button
                                    className="w-full rounded-2xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    onClick={() =>
                                        window.open(
                                            `https://www.google.com/maps/dir/?api=1&destination=${branch.latitude},${branch.longitude}`,
                                            "_blank"
                                        )
                                    }
                                >
                                    Buka Rute
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

                    <div className="absolute left-4 top-4 z-20 rounded-lg bg-white p-2 shadow-md">
                        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                            Peta Cabang
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-sm text-slate-700">
                            <div className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 rounded-full bg-blue-600" />
                                <span className="text-xs">Cabang</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-3.5 w-3.5 rounded-full bg-teal-600" />
                                <span className="text-xs">Lokasi Anda</span>
                            </div>
                        </div>
                    </div>
        </div>
    );
}