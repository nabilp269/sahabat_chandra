import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";
import { Send, Paperclip, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Index({
    messages = [],
}) {

    const [imagePreview, setImagePreview] = useState(null);

    const {
        data,
        setData,
        post,
        delete: destroy,
        processing,
        reset,
    } = useForm({
        message: "",
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.forum.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset("message", "image");
                setImagePreview(null);
            },
        });
    };

    return (
        <AdminLayout>

            <div className="bg-white rounded-2xl shadow h-[82vh] flex flex-col overflow-hidden">

                {/* HEADER */}

                <div className="border-b p-5">

                    <h1 className="text-2xl font-bold">
                        Forum Diskusi
                    </h1>

                    <p className="text-gray-500">
                        Forum bersama seluruh pengguna Sahabat Chandra
                    </p>

                </div>

                {/* CHAT */}

                <div className="flex-1 overflow-y-auto bg-[#ECE5DD] p-6 space-y-4">

                    {messages.length > 0 ? (

                        messages.map((msg) => (

                            <div
                                key={msg.id}
                                className={`flex ${
                                    msg.is_admin
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >

                                <div
                                    className={`rounded-2xl shadow px-4 py-3 max-w-xl ${
                                        msg.is_admin
                                            ? "bg-[#DCF8C6]"
                                            : "bg-white"
                                    }`}
                                >

                                    <div className="flex justify-between items-start gap-5">

                                        <div>

                                            <h3 className="font-bold text-[#0057B8]">

                                                {msg.is_admin
                                                    ? "Admin"
                                                    : msg.user?.name}

                                            </h3>

                                            <p className="mt-2 whitespace-pre-line">

                                                {msg.message}

                                            </p>

                                            {msg.image && (

                                                <img
                                                    src={`/storage/${msg.image}`}
                                                    alt=""
                                                    className="rounded-xl mt-3 max-w-xs"
                                                />

                                            )}

                                            <p className="text-xs text-gray-500 mt-2">

                                                {new Date(
                                                    msg.created_at
                                                ).toLocaleString("id-ID")}

                                            </p>

                                        </div>

                                        <button
                                            onClick={() => {
                                                alert(msg.id);
                                                alert(`/admin/forum/${msg.id}`);

                                                destroy(`/admin/forum/${msg.id}`);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    ) : (

                        <div className="flex items-center justify-center h-full text-gray-500">

                            Belum ada pesan.

                        </div>

                    )}

                </div>

                {/* Preview */}

                {imagePreview && (

                    <div className="px-5 py-3 border-t bg-gray-50">

                        <img
                            src={imagePreview}
                            alt=""
                            className="w-32 rounded-xl"
                        />

                    </div>

                )}

                {/* INPUT */}

                <form
                    onSubmit={submit}
                    className="border-t bg-white p-4 flex items-center gap-3"
                >

                    <label className="cursor-pointer">

                        <Paperclip />

                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {

                                const file = e.target.files[0];

                                if (!file) return;

                                setData("image", file);

                                setImagePreview(
                                    URL.createObjectURL(file)
                                );

                            }}
                        />

                    </label>

                    <input
                        type="text"
                        value={data.message}
                        onChange={(e) =>
                            setData("message", e.target.value)
                        }
                        className="flex-1 border rounded-full px-5 py-3"
                        placeholder="Tulis pesan..."
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-[#0057B8] text-white w-12 h-12 rounded-full flex items-center justify-center"
                    >

                        <Send size={18} />

                    </button>

                </form>

            </div>

        </AdminLayout>
    );
}