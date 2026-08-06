import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";

import {
    MapContainer,
    TileLayer,
    Marker,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Index({ branches }) {

    const hapusFavorit = (id) => {

        if (!confirm("Hapus dari favorit?")) return;

        router.delete(route("favorite.destroy", id));

    };

    return (

        <AppLayout>

            <div className="max-w-6xl mx-auto p-5">

                <h1 className="text-2xl font-bold mb-6">
                    Cabang Favorit
                </h1>

                {branches.length === 0 && (

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        <h2 className="font-semibold text-lg">
                            Belum ada cabang favorit
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Tambahkan cabang favorit dari halaman Lokasi.
                        </p>

                    </div>

                )}

                <div className="grid md:grid-cols-2 gap-5">

                    {branches.map((branch) => (

                        <div
                            key={branch.id}
                            className="bg-white rounded-2xl shadow overflow-hidden"
                        >

                            <MapContainer
                                center={[
                                    Number(branch.latitude),
                                    Number(branch.longitude),
                                ]}
                                zoom={16}
                                scrollWheelZoom={false}
                                style={{
                                    height: "220px",
                                    width: "100%",
                                }}
                            >

                                <TileLayer
                                    attribution="&copy; OpenStreetMap"
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <Marker
                                    position={[
                                        Number(branch.latitude),
                                        Number(branch.longitude),
                                    ]}
                                />

                            </MapContainer>

                            <div className="p-5">

                                <h2 className="font-bold text-lg">
                                    {branch.name}
                                </h2>

                                <p className="text-gray-600 mt-2">
                                    {branch.address}
                                </p>

                                <p className="mt-3">
                                    ☎ {branch.phone}
                                </p>

                                <p>
                                    🕒 {branch.open_time} - {branch.close_time}
                                </p>

                                <div className="flex gap-3 mt-5">

                                    <a
                                        href={branch.google_maps_url}
                                        target="_blank"
                                        className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Buka Maps
                                    </a>

                                    <button
                                        onClick={() => hapusFavorit(branch.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-lg"
                                    >
                                        Hapus
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </AppLayout>

    );

}