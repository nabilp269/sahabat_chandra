import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";

import {
    MapContainer,
    TileLayer,
    Marker,
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
        />
    );
}

export default function Edit({ branch }) {

    const {
        data,
        setData,
        patch,
        processing,
        errors,
    } = useForm({

        name: branch.name ?? "",
        address: branch.address ?? "",
        phone: branch.phone ?? "",
        latitude: branch.latitude ?? "",
        longitude: branch.longitude ?? "",
        open_time: branch.open_time ?? "",
        close_time: branch.close_time ?? "",

    });

    const submit = (e) => {
        e.preventDefault();

        patch(route("branch.update", {
            branch: branch.id,
        }));
    };

    return (
    <AdminLayout>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">

            <h1 className="text-2xl font-bold mb-6">
                Edit Cabang
            </h1>

            <form
                onSubmit={submit}
                className="space-y-5"
            >

                {/* Nama */}

                <div>

                    <label className="block mb-2 font-medium">
                        Nama Cabang
                    </label>

                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) =>
                            setData("name", e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                        </p>
                    )}

                </div>

                {/* Alamat */}

                <div>

                    <label className="block mb-2 font-medium">
                        Alamat
                    </label>

                    <textarea
                        rows="3"
                        value={data.address}
                        onChange={(e) =>
                            setData("address", e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.address}
                        </p>
                    )}

                </div>

                {/* Telepon */}

                <div>

                    <label className="block mb-2 font-medium">
                        No Telepon
                    </label>

                    <input
                        type="text"
                        value={data.phone}
                        onChange={(e) =>
                            setData("phone", e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />

                </div>

                {/* MAP */}

                <div>

                    <label className="block mb-2 font-semibold">
                        Lokasi Cabang
                    </label>

                    <MapContainer
                        center={[
                            Number(data.latitude),
                            Number(data.longitude),
                        ]}
                        zoom={16}
                        style={{
                            height: "350px",
                            width: "100%",
                            borderRadius: "12px",
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

                {/* Latitude Longitude */}

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <label className="block mb-2 font-medium">
                            Latitude
                        </label>

                        <input
                            type="text"
                            value={data.latitude}
                            onChange={(e) =>
                                setData(
                                    "latitude",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg p-3"
                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">
                            Longitude
                        </label>

                        <input
                            type="text"
                            value={data.longitude}
                            onChange={(e) =>
                                setData(
                                    "longitude",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg p-3"
                        />

                    </div>

                </div>

                {errors.latitude && (
                    <p className="text-red-500 text-sm">
                        {errors.latitude}
                    </p>
                )}

                {errors.longitude && (
                    <p className="text-red-500 text-sm">
                        {errors.longitude}
                    </p>
                )}

                {/* Jam Operasional */}

                <div className="grid grid-cols-2 gap-4">

                    <div>

                        <label className="block mb-2 font-medium">
                            Jam Buka
                        </label>

                        <input
                            type="time"
                            value={data.open_time}
                            onChange={(e) =>
                                setData(
                                    "open_time",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg p-3"
                        />

                    </div>

                    <div>

                        <label className="block mb-2 font-medium">
                            Jam Tutup
                        </label>

                        <input
                            type="time"
                            value={data.close_time}
                            onChange={(e) =>
                                setData(
                                    "close_time",
                                    e.target.value
                                )
                            }
                            className="w-full border rounded-lg p-3"
                        />

                    </div>

                </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                    >
                        {processing
                            ? "Mengupdate..."
                            : "Update Cabang"}
                    </button>

                </form>

            </div>

        </AdminLayout>
    );
}