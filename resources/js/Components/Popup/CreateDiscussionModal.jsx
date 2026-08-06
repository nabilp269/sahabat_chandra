import Modal from "../Modal";
import { useForm } from "@inertiajs/react";

export default function CreateDiscussionModal({ show, onClose }) {

    const { data, setData, post, processing, reset, errors } = useForm({
        title: "",
        category: "",
        content: "",
        attachment: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("discussion.store"), {
            forceFormData: true,

            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="bg-white rounded-3xl p-6">

                {/* Header */}
                <div className="flex justify-between items-start">

                    <div>
                        <h2 className="text-3xl font-bold text-blue-900">
                            Buat Diskusi
                        </h2>

                        <p className="text-gray-500">
                            Bagikan pertanyaan atau informasi kepada anggota
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-3xl font-bold"
                    >
                        ×
                    </button>

                </div>

                <hr className="my-5" />

                <form
                    onSubmit={submit}
                    className="space-y-5"
                >

                    {/* Judul */}
                    <div>

                        <label className="font-semibold block mb-2">
                            Judul Diskusi
                        </label>

                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            className="w-full border rounded-xl p-3"
                            placeholder="Masukkan judul diskusi"
                        />

                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.title}
                            </p>
                        )}

                    </div>

                    {/* Kategori */}
                    <div>

                        <label className="font-semibold block mb-2">
                            Kategori
                        </label>

                        <select
                            value={data.category}
                            onChange={(e) => setData("category", e.target.value)}
                            className="w-full border rounded-xl p-3"
                        >
                            <option value="">Pilih Kategori</option>
                            <option value="Informasi">Informasi</option>
                            <option value="Pertanyaan">Pertanyaan</option>
                            <option value="Pengumuman">Pengumuman</option>
                        </select>

                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.category}
                            </p>
                        )}

                    </div>

                    {/* Isi */}
                    <div>

                        <label className="font-semibold block mb-2">
                            Isi Diskusi
                        </label>

                        <textarea
                            rows="5"
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                            className="w-full border rounded-xl p-3"
                            placeholder="Tulis isi diskusi..."
                        />

                        {errors.content && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.content}
                            </p>
                        )}

                    </div>

                    {/* Lampiran */}
                    <div>

                        <label className="font-semibold block mb-2">
                            Lampiran (Opsional)
                        </label>

                        <input
                            type="file"
                            onChange={(e) => setData("attachment", e.target.files[0])}
                            className="w-full border rounded-xl p-3"
                        />

                        {errors.attachment && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.attachment}
                            </p>
                        )}

                    </div>

                    {/* Tombol */}
                    <div className="grid grid-cols-2 gap-4 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="border rounded-xl py-3 font-semibold text-blue-700"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-xl py-3 font-semibold"
                        >
                            {processing ? "Menyimpan..." : "Posting Diskusi"}
                        </button>

                    </div>

                </form>

            </div>
        </Modal>
    );
}