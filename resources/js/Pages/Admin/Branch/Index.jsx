import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, router } from "@inertiajs/react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/*
|--------------------------------------------------------------------------
| Marker Picker
|--------------------------------------------------------------------------
*/

function LocationPicker({
    latitude,
    longitude,
    setData,
}) {
    const map = useMap();

    useMapEvents({
        click(e) {
            const lat = e.latlng.lat.toFixed(7);
            const lng = e.latlng.lng.toFixed(7);

            setData("latitude", lat);
            setData("longitude", lng);

            map.flyTo([lat, lng], 17);
        },
    });

    if (!latitude || !longitude) return null;

    return (
        <Marker
            position={[
                Number(latitude),
                Number(longitude),
            ]}
        >
            <Popup>Lokasi Cabang</Popup>
        </Marker>
    );
}

export default function Index({ branches = [] }) {
    const {
        data,
        setData,
        post,
        processing,
        reset,
        errors,
    } = useForm({
        name: "",
        address: "",
        phone: "",
        latitude: "",
        longitude: "",
        open_time: "",
        close_time: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("branch.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const hapus = (id) => {
        if (!confirm("Hapus cabang ini?")) return;

        router.delete(route("branch.destroy", id));
    };

    return (
        <AdminLayout>
            <div className="bg-white rounded-3xl shadow-lg p-8">

                <div className="flex items-center justify-between mb-8">

                    <div>

                        <h1 className="text-3xl font-bold text-slate-800">
                            Data Cabang
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Kelola lokasi cabang Sahabat Chandra
                        </p>

                    </div>

                </div>

                <form
                    onSubmit={submit}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        placeholder="Nama Cabang"
                        value={data.name}
                        onChange={(e) =>
                            setData("name", e.target.value)
                        }
                        className="w-full border rounded-xl p-3"
                    />

                    {errors.name && (
                        <p className="text-red-500 text-sm">
                            {errors.name}
                        </p>
                    )}

                    <textarea
                        placeholder="Alamat Lengkap"
                        rows="3"
                        value={data.address}
                        onChange={(e) =>
                            setData("address", e.target.value)
                        }
                        className="w-full border rounded-xl p-3 resize-none"
                    />

                    {errors.address && (
                        <p className="text-red-500 text-sm">
                            {errors.address}
                        </p>
                    )}

                    <input
                        type="text"
                        placeholder="Nomor Telepon"
                        value={data.phone}
                        onChange={(e) =>
                            setData("phone", e.target.value)
                        }
                        className="w-full border rounded-xl p-3"
                    />

                    <div>

                        <label className="block font-semibold mb-2">
                            Klik peta untuk menentukan lokasi cabang
                        </label>

                        <MapContainer
                            center={[-6.200000, 106.816666]}
                            zoom={13}
                            style={{
                                height: "400px",
                                width: "100%",
                                borderRadius: "18px",
                            }}
                        >

                            <TileLayer
                                attribution="&copy; OpenStreetMap"
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            <LocationPicker
                                latitude={data.latitude}
                                longitude={data.longitude}
                                setData={setData}
                            />

                        </MapContainer>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <label className="text-sm font-semibold">
                                Latitude
                            </label>

                            <input
                                readOnly
                                value={data.latitude}
                                className="w-full mt-1 border rounded-xl p-3 bg-gray-100"
                            />

                        </div>

                        <div>

                            <label className="text-sm font-semibold">
                                Longitude
                            </label>

                            <input
                                readOnly
                                value={data.longitude}
                                className="w-full mt-1 border rounded-xl p-3 bg-gray-100"
                            />

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="time"
                            value={data.open_time}
                            onChange={(e) =>
                                setData("open_time", e.target.value)
                            }
                            className="border rounded-xl p-3"
                        />

                        <input
                            type="time"
                            value={data.close_time}
                            onChange={(e) =>
                                setData("close_time", e.target.value)
                            }
                            className="border rounded-xl p-3"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                    >
                        {processing
                            ? "Menyimpan..."
                            : "Simpan Cabang"}
                    </button>

                </form>

                <hr className="my-10" />

                <h2 className="text-2xl font-bold mb-6">
                    Daftar Cabang
                </h2>

                <div className="space-y-6">

                                        {branches.length > 0 ? (
                        branches.map((branch) => (
                            <div
                                key={branch.id}
                                className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                            >

                                <div className="p-5">

                                    <div className="flex justify-between items-start">

                                        <div>

                                            <h3 className="text-xl font-bold text-slate-800">
                                                {branch.name}
                                            </h3>

                                            <p className="text-gray-600 mt-1">
                                                {branch.address}
                                            </p>

                                            <div className="mt-4 space-y-1 text-sm text-gray-600">

                                                <p>
                                                    ☎ {branch.phone || "-"}
                                                </p>

                                                <p>
                                                    🕒 {branch.open_time} - {branch.close_time}
                                                </p>

                                                <p>
                                                    📍 {branch.latitude},{" "}
                                                    {branch.longitude}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="flex gap-2">

                                            <button
                                                onClick={() =>
                                                    router.get(
                                                        route(
                                                            "branch.edit",
                                                            branch.id
                                                        )
                                                    )
                                                }
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    hapus(branch.id)
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
                                            >
                                                Hapus
                                            </button>

                                        </div>

                                    </div>

                                </div>

                                <div className="h-[260px]">

                                    <MapContainer
                                        center={[
                                            Number(branch.latitude),
                                            Number(branch.longitude),
                                        ]}
                                        zoom={17}
                                        scrollWheelZoom={false}
                                        dragging={false}
                                        doubleClickZoom={false}
                                        zoomControl={false}
                                        attributionControl={false}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    >

                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <Marker
                                            position={[
                                                Number(branch.latitude),
                                                Number(branch.longitude),
                                            ]}
                                        >
                                            <Popup>
                                                <strong>
                                                    {branch.name}
                                                </strong>
                                                <br />
                                                {branch.address}
                                            </Popup>
                                        </Marker>

                                    </MapContainer>

                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-100 rounded-2xl py-12 text-center text-gray-500">
                            Belum ada data cabang.
                        </div>
                    )}

                </div>

            </div>

        </AdminLayout>
    );
}