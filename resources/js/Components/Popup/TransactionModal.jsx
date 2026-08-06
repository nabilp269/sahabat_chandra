import Modal from "../Modal";
import { useForm, usePage } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function TransactionModal({ show, onClose, user }) {
    const { flash } = usePage().props;

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        receiver_name: "",
        receiver_bank: "",
        receiver_account: "",
        amount: "",
        description: "",
    });

    if (!show) return null;

    const submit = (e) => {
        e.preventDefault();

        post(route("transaction.store"), {
            preserveScroll: true,
            preserveState: true,

            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text:
                        flash?.success ??
                        "Transaksi berhasil dikirim.",
                    confirmButtonColor: "#2563eb",
                });

                reset();
                onClose();
            },

            onError: (errors) => {
                Swal.fire({
                    icon: "warning",
                    title: "Transaksi Gagal",
                    text:
                        errors.amount ||
                        errors.error ||
                        "Silakan periksa kembali data transaksi.",
                    confirmButtonColor: "#f59e0b",
                });
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form
                onSubmit={submit}
                className="flex flex-col h-full bg-white"
            >
                <div className="p-5 border-b">
                    <h2 className="text-xl font-bold text-blue-700">
                        Formulir Kirim Uang
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">

                    <div className="bg-blue-50 rounded-xl p-4">
                        <h3 className="font-bold mb-3">
                            Data Pengirim
                        </h3>

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
                        value={data.receiver_name}
                        onChange={(e) =>
                            setData("receiver_name", e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    <select
                        value={data.receiver_bank}
                        onChange={(e) =>
                            setData("receiver_bank", e.target.value)
                        }
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
                        value={data.receiver_account}
                        onChange={(e) =>
                            setData("receiver_account", e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        placeholder="Jumlah Transfer"
                        value={data.amount}
                        onChange={(e) =>
                            setData("amount", e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                        min="1"
                    />

                    <textarea
                        rows={3}
                        placeholder="Catatan"
                        value={data.description}
                        onChange={(e) =>
                            setData("description", e.target.value)
                        }
                        className="w-full border rounded-lg p-3"
                    />

                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            {Object.values(errors).map((err, index) => (
                                <p
                                    key={index}
                                    className="text-sm text-red-600"
                                >
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
                        {processing
                            ? "Menyimpan..."
                            : "Simpan Transaksi"}
                    </button>

                </div>
            </form>
        </Modal>
    );
}