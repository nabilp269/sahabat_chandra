import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { Heart, MessageCircle, Trash2, Paperclip } from "lucide-react";

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Baru saja";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m yang lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h yang lalu`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d yang lalu`;

    return date.toLocaleDateString("id-ID");
}

export default function Index({ posts = [], auth }) {
    const [expandedComments, setExpandedComments] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, delete: destroy, processing, reset } = useForm({
        message: "",
        image: null,
    });

    const handleSubmit = (e) => {
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
            <Head title="Forum Diskusi" />

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Forum Diskusi</h1>
                    <p className="text-slate-600 mt-1">Kelola postingan dan komentar forum</p>
                </div>

                {/* FORM POSTING ADMIN */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                    <p className="font-semibold text-slate-700 mb-3">Buat Postingan Baru</p>
                    <form onSubmit={handleSubmit}>
                        {imagePreview && (
                            <div className="mb-4">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-60 object-cover rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setData("image", null);
                                    }}
                                    className="mt-2 text-sm text-red-600 hover:text-red-700 font-semibold"
                                >
                                    Hapus Gambar
                                </button>
                            </div>
                        )}

                        <textarea
                            value={data.message}
                            onChange={(e) => setData("message", e.target.value)}
                            placeholder="Tulis pengumuman atau informasi untuk pengguna..."
                            className="w-full border rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />

                        <div className="flex items-center justify-between mt-4">
                            <label className="cursor-pointer">
                                <Paperclip size={20} className="text-slate-600 hover:text-blue-600" />
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;
                                        setData("image", file);
                                        setImagePreview(URL.createObjectURL(file));
                                    }}
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={processing || (!data.message && !data.image)}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-2 rounded-full font-semibold transition"
                            >
                                Posting
                            </button>
                        </div>
                    </form>
                </div>

                {/* POSTS */}
                <div className="space-y-6">
                    {posts.data && posts.data.length > 0 ? (
                        posts.data.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                                {/* Header */}
                                <div className="p-4 flex justify-between items-start border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                            {item.user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                {item.user?.name}
                                                {item.is_admin && (
                                                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                                        Admin
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {formatTimeAgo(item.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            destroy(route("admin.forum.destroy", item.id), {
                                                preserveScroll: true,
                                            })
                                        }
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Content */}
                                {item.message && (
                                    <div className="px-4 py-3">
                                        <p className="text-slate-800 whitespace-pre-wrap">{item.message}</p>
                                    </div>
                                )}

                                {item.image && (
                                    <img
                                        src={`/storage/${item.image}`}
                                        alt="Post"
                                        className="w-full h-96 object-cover"
                                    />
                                )}

                                {/* Stats */}
                                <div className="px-4 py-3 border-t border-b text-sm text-slate-600">
                                    <div className="flex justify-between">
                                        <span>{item.likes_count} Suka</span>
                                        <span>{item.comments_count} Komentar</span>
                                    </div>
                                </div>

                                {/* Toggle Komentar */}
                                <div className="px-4 py-3 border-b">
                                    <button
                                        onClick={() =>
                                            setExpandedComments((prev) => ({
                                                ...prev,
                                                [item.id]: !prev[item.id],
                                            }))
                                        }
                                        className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm transition"
                                    >
                                        <MessageCircle size={18} />
                                        {expandedComments[item.id] ? "Sembunyikan Komentar" : "Lihat Komentar"}
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {expandedComments[item.id] && (
                                    <div className="px-4 py-4 bg-slate-50 space-y-3">
                                        {item.comments && item.comments.length > 0 ? (
                                            item.comments.map((comment) => (
                                                <div key={comment.id} className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                                                        {comment.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 bg-white p-3 rounded-lg">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-semibold text-sm text-slate-800">
                                                                    {comment.user?.name}
                                                                </p>
                                                                <p className="text-sm text-slate-700 mt-1">
                                                                    {comment.comment}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    destroy(
                                                                        route("admin.forum.comment.destroy", comment.id),
                                                                        { preserveScroll: true }
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            {formatTimeAgo(comment.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 text-center py-3">
                                                Belum ada komentar
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                            <p className="text-slate-600 text-lg">Belum ada postingan.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {posts.links && (
                    <div className="mt-8 flex justify-center gap-2">
                        {posts.links.map((link) => (
                            <a
                                key={link.label}
                                href={link.url}
                                className={`px-4 py-2 rounded-lg ${
                                    link.active
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-slate-700 hover:bg-slate-100"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
