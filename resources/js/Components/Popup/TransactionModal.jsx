import Modal from "../Modal";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import Swal from "sweetalert2";

export default function TransactionModal({ show, onClose, user }) {
    const { props } = usePage();
    const [receipt, setReceipt] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        receiver_name: "",
        receiver_bank: "",
        receiver_account: "",
        amount: "",
        description: "",
    });

    if (!show) return null;

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const res = await axios.post(route("transaction.store"), form);
            setReceipt(res.data.transaction);
            setForm({
                receiver_name: "",
                receiver_bank: "",
                receiver_account: "",
                amount: "",
                description: "",
            });
        } catch (err) {
            if (err.response?.status === 422) {
                const errs = err.response.data.errors ?? {};
                setErrors(Object.fromEntries(
                    Object.entries(errs).map(([k, v]) => [k, v[0]])
                ));
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Transaksi Gagal",
                    text: "Silakan periksa kembali data transaksi.",
                    confirmButtonColor: "#f59e0b",
                });
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setReceipt(null);
        setErrors({});
        onClose();
    };

    // Tampilan kode & QR setelah berhasil
    if (receipt) {
        const qrValue = JSON.stringify({
            code: receipt.transaction_code,
            name: receipt.receiver_name,
            bank: receipt.receiver_bank,
            account: receipt.receiver_account,
            amount: receipt.amount,
        });

        const expiresAt = receipt.expires_at ? new Date(receipt.expires_at) : null;

        const downloadQR = () => {
            const canvas = document.getElementById("qr-canvas");
            if (canvas) {
                const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                const downloadLink = document.createElement("a");
                downloadLink.href = pngUrl;
                downloadLink.download = `QR_${receipt.transaction_code}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        };

        return (
            <Modal show={show} onClose={handleClose}>
                <div className="flex flex-col bg-white rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-5 text-white text-center">
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                            <span className="text-blue-600 text-2xl">✓</span>
                        </div>
                        <h2 className="text-xl font-bold">Transaksi Dibuat</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            Tunjukkan kode ini ke kasir
                        </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center py-6 px-5 border-b">
                        <QRCodeCanvas id="qr-canvas" value={qrValue} size={180} />
                        <p className="mt-4 text-xs text-slate-500">Scan QR Code</p>
                    </div>

                    {/* Kode Transaksi */}
                    <div className="px-5 py-4 border-b text-center">
                        <p className="text-sm text-slate-500 mb-1">Kode Transaksi</p>
                        <p className="text-2xl font-bold tracking-widest text-blue-700">
                            {receipt.transaction_code}
                        </p>
                    </div>

                    {/* Detail */}
                    <div className="px-5 py-4 space-y-2 text-sm border-b">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Penerima</span>
                            <span className="font-semibold">{receipt.receiver_name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Bank</span>
                            <span className="font-semibold">{receipt.receiver_bank}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">No. Rekening</span>
                            <span className="font-semibold">{receipt.receiver_account}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Jumlah</span>
                            <span className="font-bold text-blue-700">
                                Rp {Number(receipt.amount).toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Status</span>
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                Menunggu Kasir
                            </span>
                        </div>
                        {expiresAt && (
                            <div className="flex justify-between">
                                <span className="text-slate-500">Berlaku Sampai</span>
                                <span className="font-semibold">{expiresAt.toLocaleString('id-ID')}</span>
                            </div>
                        )}
                    </div>

                    <div className="p-4 flex gap-3">
                        <button
                            type="button"
                            onClick={downloadQR}
                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold transition"
                        >
                            Unduh QR
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            Selesai
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    // Tampilan form
    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="flex flex-col h-full bg-white">
                <div className="p-5 border-b">
                    <h2 className="text-xl font-bold text-blue-700">
                        Formulir Kirim Uang
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div className="bg-blue-50 rounded-xl p-4">
                        <h3 className="font-bold mb-3">Data Pengirim</h3>
                        <input
                            type="text"
                            readOnly
                            value={user?.name ?? ""}
                            className="w-full border rounded-lg p-3 bg-gray-100 mb-3"
                        />
                        <input
                            type="text"
                            readOnly
                            value={user?.email ?? ""}
                            className="w-full border rounded-lg p-3 bg-gray-100 mb-3"
                        />
                        <input
                            type="text"
                            readOnly
                            value={user?.phone ?? "-"}
                            className="w-full border rounded-lg p-3 bg-gray-100"
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Nama Penerima"
                        value={form.receiver_name}
                        onChange={(e) => handleChange("receiver_name", e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                    <select
                        value={form.receiver_bank}
                        onChange={(e) => handleChange("receiver_bank", e.target.value)}
                        className="w-full border rounded-lg p-3"
                    >
                        <option value="">Pilih Bank</option>
                        <option value="BCA">BCA</option>
                        <option value="BRI">BRI</option>
                        <option value="BNI">BNI</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="BSI">BSI</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Nomor Rekening"
                        value={form.receiver_account}
                        onChange={(e) => handleChange("receiver_account", e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        placeholder="Jumlah Transfer"
                        value={form.amount}
                        onChange={(e) => handleChange("amount", e.target.value)}
                        className="w-full border rounded-lg p-3"
                        min="1"
                    />

                    <textarea
                        rows={3}
                        placeholder="Catatan"
                        value={form.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            {Object.values(errors).map((err, index) => (
                                <p key={index} className="text-sm text-red-600">
                                    • {err}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t p-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="flex-1 border rounded-lg py-3"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-blue-600 text-white rounded-lg py-3"
                    >
                        {processing ? "Menyimpan..." : "Simpan Transaksi"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
