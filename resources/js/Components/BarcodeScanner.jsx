import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { router } from "@inertiajs/react";
import { X, Camera, Loader2, AlertCircle } from "lucide-react";

export default function BarcodeScanner({ onClose }) {
    const videoRef = useRef(null);
    const readerRef = useRef(null);
    const [status, setStatus] = useState("loading"); // loading | scanning | found | error
    const [errorMsg, setErrorMsg] = useState("");
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);

    const processScannedCode = async (raw) => {
        try {
            const res = await fetch(
                route("admin.transaction.find-by-code") +
                "?code=" +
                encodeURIComponent(raw),
                {
                    headers: {
                        Accept: "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                }
            );

            const data = await res.json();

            if (data.id) {
                onClose();
                router.visit(route("admin.transaction.show", data.id));
            } else {
                setErrorMsg(data.error ?? "Transaksi tidak ditemukan.");
                setStatus("error");
            }
        } catch (_) {
            setErrorMsg("Gagal menghubungi server.");
            setStatus("error");
        }
    };

    const startScan = async (deviceId) => {
        if (readerRef.current) {
            try { BrowserMultiFormatReader.releaseAllStreams(); } catch (_) { }
        }

        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        try {
            await reader.decodeFromVideoDevice(
                deviceId ?? undefined,
                videoRef.current,
                async (result, err) => {
                    if (!result) return;

                    setStatus("found");
                    BrowserMultiFormatReader.releaseAllStreams();

                    processScannedCode(result.getText());
                }
            );

            setStatus("scanning");
        } catch (e) {
            setErrorMsg("Tidak dapat mengakses kamera: " + e.message);
            setStatus("error");
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const list =
                    await BrowserMultiFormatReader.listVideoInputDevices();
                setDevices(list);
                const defaultId = list[0]?.deviceId ?? null;
                setSelectedDevice(defaultId);
                await startScan(defaultId);
            } catch (e) {
                setErrorMsg("Tidak dapat mengakses kamera.");
                setStatus("error");
            }
        })();

        return () => {
            try {
                BrowserMultiFormatReader.releaseAllStreams();
            } catch (_) { }
        };
    }, []);

    const handleDeviceChange = async (e) => {
        const id = e.target.value;
        setSelectedDevice(id);
        setStatus("loading");
        await startScan(id);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Stop video scanning if active
        if (readerRef.current) {
            try { BrowserMultiFormatReader.releaseAllStreams(); } catch (_) { }
        }

        setStatus("loading");
        const reader = new BrowserMultiFormatReader();

        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        img.onload = async () => {
            try {
                const result = await reader.decodeFromImageElement(img);
                setStatus("found");
                processScannedCode(result.getText());
            } catch (err) {
                setErrorMsg("Tidak dapat membaca QR dari gambar ini.");
                setStatus("error");
            } finally {
                URL.revokeObjectURL(url);
            }
        };
        img.onerror = () => {
            setErrorMsg("Gagal memuat gambar.");
            setStatus("error");
            URL.revokeObjectURL(url);
        };

        // Reset input value so same file can be selected again
        e.target.value = null;
    };

    const retry = async () => {
        setStatus("loading");
        setErrorMsg("");
        await startScan(selectedDevice);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-screen">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <Camera size={20} className="text-blue-600" />
                        <h2 className="font-bold text-lg">Scan QR Transaksi</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="overflow-y-auto">
                    {/* Camera selector & Upload Button */}
                    <div className="px-5 pt-4 flex gap-2">
                        {devices.length > 1 && (
                            <select
                                value={selectedDevice ?? ""}
                                onChange={handleDeviceChange}
                                className="flex-1 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                {devices.map((d) => (
                                    <option key={d.deviceId} value={d.deviceId}>
                                        {d.label || "Kamera " + d.deviceId.slice(0, 8)}
                                    </option>
                                ))}
                            </select>
                        )}
                        <label className={`flex-1 flex items-center justify-center gap-2 border rounded-xl px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition border-blue-200 text-blue-700 bg-blue-50 ${devices.length <= 1 ? "w-full" : ""}`}>
                            <span className="font-semibold">Unggah Gambar QR</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Video */}
                    <div className="relative bg-black mx-5 mt-4 rounded-xl overflow-hidden aspect-square">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            muted
                            playsInline
                        />

                        {/* Overlay frame */}
                        {status === "scanning" && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-52 h-52 border-4 border-blue-400 rounded-2xl opacity-80">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />
                                </div>
                            </div>
                        )}

                        {/* Loading overlay */}
                        {status === "loading" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-3">
                                <Loader2 size={36} className="animate-spin" />
                                <p className="text-sm">Memulai kamera...</p>
                            </div>
                        )}

                        {/* Found overlay */}
                        {status === "found" && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-3">
                                <Loader2 size={36} className="animate-spin" />
                                <p className="text-sm">QR ditemukan, memuat...</p>
                            </div>
                        )}
                    </div>

                    {/* Error state */}
                    {status === "error" && (
                        <div className="mx-5 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                            <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-red-700 font-semibold text-sm">Gagal</p>
                                <p className="text-red-600 text-sm">{errorMsg}</p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="px-5 py-4 flex justify-between items-center">
                        <p className="text-xs text-gray-400">
                            {status === "scanning"
                                ? "Arahkan kamera ke QR Code transaksi"
                                : status === "error"
                                    ? "Periksa izin kamera browser Anda"
                                    : ""}
                        </p>
                        {status === "error" && (
                            <button
                                onClick={retry}
                                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
                            >
                                Coba Lagi
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
