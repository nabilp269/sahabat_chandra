import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { Heart, MessageCircle, Trash2, Send, MessageSquare } from "lucide-react";

function timeAgo(dateString) {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return "Baru saja";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}j lalu`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}h lalu`;
    return new Date(dateString).toLocaleDateString("id-ID");
}

export default function ForumIndex({ posts = [], auth }) {
    const [expandedComments, setExpandedComments] = useState({});
    const { post, delete: destroy } = useForm();
    const { data: commentData, setData: setCommentData, post: postComment, reset: resetComment, processing } = useForm({ comment: "" });

    const handleAddComment = (postId) => {
        postComment(route("forum.comment.store", postId), {
            preserveScroll: true,
            onSuccess: () => resetComment("comment"),
        });
    };

    const toggleLike = (postId) => post(route("forum.like", postId), { preserveScroll: true });

    const toggleComments = (postId) =>
        setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));

    return (
        <AppLayout>
            <Head title="Forum Diskusi" />

            <div className="max-w-2xl mx-auto px-4 pb-10">

                {/* Header */}
                <div className="bg-gradient-to-r from-[#0057B8] to-[#0F6FFF] rounded-3xl p-6 text-white shadow-lg mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <MessageSquare size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Forum Diskusi</h1>
                            <p className="text-blue-100 text-sm mt-0.5">Informasi & pengumuman dari Admin</p>
                        </div>
                    </div>
                </div>

                {/* Posts */}
                {posts.data && posts.data.length > 0 ? (
                    <div className="space-y-5">
                        {posts.data.map((p) => {
                            const liked = p.likes?.some((l) => l.user_id === auth.user.id);
                            const likeCount = p.likes?.length ?? 0;
                            const commentCount = p.comments?.length ?? 0;

                            return (
                                <div key={p.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">

                                    {/* Post Header */}
                                    <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                                                {p.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-800">{p.user?.name}</p>
                                                    {p.is_admin && (
                                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400">{timeAgo(p.created_at)}</p>
                                            </div>
                                        </div>
                                        {auth.user.is_admin && (
                                            <button
                                                onClick={() => destroy(route("forum.destroy", p.id), { preserveScroll: true })}
                                                className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Content */}
                                    {p.message && (
                                        <p className="px-5 pb-3 text-slate-700 whitespace-pre-wrap leading-relaxed">
                                            {p.message}
                                        </p>
                                    )}
                                    {p.image && (
                                        <img src={`/storage/${p.image}`} alt="Post" className="w-full max-h-96 object-cover" />
                                    )}

                                    {/* Stats */}
                                    <div className="px-5 py-2 flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50">
                                        <span>{likeCount} suka</span>
                                        <span>{commentCount} komentar</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="px-5 py-3 flex gap-2 border-t border-gray-50">
                                        <button
                                            onClick={() => toggleLike(p.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm transition ${
                                                liked ? "bg-red-50 text-red-600" : "bg-gray-50 text-slate-600 hover:bg-gray-100"
                                            }`}
                                        >
                                            <Heart size={17} fill={liked ? "currentColor" : "none"} />
                                            Suka
                                        </button>
                                        <button
                                            onClick={() => toggleComments(p.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm bg-gray-50 text-slate-600 hover:bg-gray-100 transition"
                                        >
                                            <MessageCircle size={17} />
                                            Komentar
                                        </button>
                                    </div>

                                    {/* Comments */}
                                    {expandedComments[p.id] && (
                                        <div className="px-5 pb-5 pt-2 bg-slate-50 space-y-3">
                                            {p.comments?.length > 0 ? (
                                                p.comments.map((c) => (
                                                    <div key={c.id} className="flex gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                            {c.user?.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 bg-white rounded-2xl px-4 py-3 shadow-sm">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <p className="font-semibold text-sm text-slate-800">{c.user?.name}</p>
                                                                    <p className="text-sm text-slate-600 mt-0.5">{c.comment}</p>
                                                                    <p className="text-xs text-gray-400 mt-1">{timeAgo(c.created_at)}</p>
                                                                </div>
                                                                {(c.user_id === auth.user.id || auth.user.is_admin) && (
                                                                    <button
                                                                        onClick={() => destroy(route("forum.comment.destroy", c.id), { preserveScroll: true })}
                                                                        className="text-red-400 hover:text-red-600 transition shrink-0"
                                                                    >
                                                                        <Trash2 size={13} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 text-center py-2">Belum ada komentar</p>
                                            )}

                                            {/* Input Komentar */}
                                            <form
                                                onSubmit={(e) => { e.preventDefault(); handleAddComment(p.id); }}
                                                className="flex gap-2 mt-2"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Tulis komentar..."
                                                    value={commentData.comment}
                                                    onChange={(e) => setCommentData("comment", e.target.value)}
                                                    className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!commentData.comment || processing}
                                                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-2xl flex items-center justify-center transition"
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare size={36} className="text-blue-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-700">Belum Ada Postingan</h2>
                        <p className="text-gray-400 mt-2">Admin belum membuat postingan.</p>
                    </div>
                )}

                {/* Pagination */}
                {posts.links && posts.links.length > 3 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {posts.links.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                                    link.active
                                        ? "bg-blue-600 text-white"
                                        : "bg-white text-slate-600 hover:bg-gray-100 border border-gray-200"
                                } ${!link.url ? "opacity-40 pointer-events-none" : ""}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
