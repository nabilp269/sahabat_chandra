import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";

export default function TopUpModal({
    show,
    onClose,
    user,
}) {
    const { data, setData, post, processing, reset } = useForm({
        amount: "",
    });

    if (!show) return null;

    const submit = (e) => {
        e.preventDefault();

        post(route("users.topup", user.id), {
            preserveScroll: true,

            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Saldo berhasil ditambahkan.",
                    confirmButtonColor: "#0057B8",
                });

                reset();
                onClose();
            },

            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: "Top Up gagal.",
                    confirmButtonColor: "#d33",
                });
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

                <h2 className="text-2xl font-bold mb-4">
                    Top Up Saldo
                </h2>

                <div className="mb-5">
                    <p className="text-gray-500 text-sm">
                        Nama User
                    </p>

                    <p className="font-bold text-lg">
                        {user.name}
                    </p>

                    <p className="text-gray-500">
                        {user.email}
                    </p>
                </div>

                <form onSubmit={submit}>

                    <label className="font-semibold">
                        Jumlah Top Up
                    </label>

                    <input
                        type="number"
                        min="1000"
                        step="1000"
                        required
                        value={data.amount}
                        onChange={(e) =>
                            setData("amount", e.target.value)
                        }
                        placeholder="Contoh: 500000"
                        className="w-full border rounded-lg p-3 mt-2"
                    />

                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            type="button"
                            onClick={() => {
                                reset();
                                onClose();
                            }}
                            className="px-5 py-2 rounded-lg border"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
                        >
                            {processing
                                ? "Memproses..."
                                : "Top Up"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}