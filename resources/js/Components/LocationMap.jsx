import { useState, useEffect, useCallback } from "react";
import {
    GoogleMap,
    useJsApiLoader,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const mapContainerStyle = { width: "100%", height: "100%" };

const defaultCenter = { lat: -6.2, lng: 106.816666 };

export default function LocationMap({ branches = [] }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    const [userPos, setUserPos] = useState(null);
    const [selected, setSelected] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) =>
                setUserPos({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                }),
            () => {}
        );
    }, []);

    const onLoad = useCallback(
        (mapInstance) => {
            setMap(mapInstance);

            const bounds = new window.google.maps.LatLngBounds();

            if (userPos) bounds.extend(userPos);

            branches.forEach((b) => {
                if (b.latitude && b.longitude) {
                    bounds.extend({
                        lat: Number(b.latitude),
                        lng: Number(b.longitude),
                    });
                }
            });

            if (!bounds.isEmpty()) mapInstance.fitBounds(bounds);
        },
        [userPos, branches]
    );

    // Fit bounds saat userPos baru tersedia setelah map sudah load
    useEffect(() => {
        if (!map || !userPos) return;

        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(userPos);
        branches.forEach((b) => {
            if (b.latitude && b.longitude) {
                bounds.extend({
                    lat: Number(b.latitude),
                    lng: Number(b.longitude),
                });
            }
        });
        map.fitBounds(bounds);
    }, [userPos, map]);

    if (!isLoaded) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 rounded-[24px]">
                <p className="text-slate-500 text-sm">Memuat peta...</p>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={userPos ?? defaultCenter}
            zoom={12}
            onLoad={onLoad}
            options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
            }}
        >
            {/* Marker lokasi user */}
            {userPos && (
                <Marker
                    position={userPos}
                    title="Lokasi Anda"
                    icon={{
                        url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                    }}
                />
            )}

            {/* Marker setiap cabang */}
            {branches
                .filter((b) => b.latitude && b.longitude)
                .map((branch) => (
                    <Marker
                        key={branch.id}
                        position={{
                            lat: Number(branch.latitude),
                            lng: Number(branch.longitude),
                        }}
                        title={branch.name}
                        onClick={() => setSelected(branch)}
                    />
                ))}

            {/* InfoWindow saat marker cabang diklik */}
            {selected && (
                <InfoWindow
                    position={{
                        lat: Number(selected.latitude),
                        lng: Number(selected.longitude),
                    }}
                    onCloseClick={() => setSelected(null)}
                >
                    <div className="min-w-[200px] space-y-2 text-sm text-slate-800">
                        <p className="text-base font-semibold">{selected.name}</p>
                        <p className="text-xs text-slate-500">{selected.address}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-slate-100 p-2">
                                <p className="font-semibold">Status</p>
                                <p>{selected.status || "-"}</p>
                            </div>
                            <div className="rounded-lg bg-slate-100 p-2">
                                <p className="font-semibold">Jarak</p>
                                <p>
                                    {selected.distance
                                        ? `${selected.distance.toFixed(2)} km`
                                        : "-"}
                                </p>
                            </div>
                        </div>
                        <button
                            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            onClick={() =>
                                window.open(
                                    `https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`,
                                    "_blank"
                                )
                            }
                        >
                            Buka Rute
                        </button>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}
