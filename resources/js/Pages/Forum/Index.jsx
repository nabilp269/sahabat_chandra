import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";

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

export default function ForumIndex({ posts = [], auth }) {
    const [expandedComments, setExpandedComments] = useState({});

    const {
        post,
        delete: destroy,
    } = useForm();

    const {
        data: commentData,
        setData: setCommentData,
        post: postComment,
        reset: resetComment,
    } = useForm({ comment: "" });

    const handleAddComment = (postId) => {
        postComment(route("forum.comment.store", postId), {
            preserveScroll: true,
            onSuccess: () => resetComment("comment"),
        });
    };

    const toggleLike = (postId) => {
        post(route("forum.like", postId), { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title="Forum Diskusi" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {/* HEADER */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">Forum Diskusi</h1>
                        <p className="text-slate-600 mt-2">Informasi dan pengumuman dari Admin</p>
                    </div>

                    {/* POSTS */}
                    <div className="space-y-6">
                        {posts.data && posts.data.length > 0 ? (
                            posts.data.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                                >
                                    {/* Header */}
                                    <div className="p-4 flex justify-between items-start border-b">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                                                {post.user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {post.user?.name}
                                                    {post.is_admin && (
                                                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                                            Admin
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {formatTimeAgo(post.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        {auth.user.is_admin && (
                                            <button
                                                onClick={() =>
                                                    destroy(route("forum.destroy", post.id), {
                                                        preserveScroll: true,
                                                    })
                                                }
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Content */}
                                    {post.message && (
                                        <div className="px-4 py-3">
                                            <p className="text-slate-800 whitespace-pre-wrap">
                                                {post.message}
                                            </p>
                                        </div>
                                    )}

                                    {post.image && (
                                        <img
                                            src={`/storage/${post.image}`}
                                            alt="Post"
                                            className="w-full h-96 object-cover"
                                        />
                                    )}

                                    {/* Stats */}
                                    <div className="px-4 py-3 border-t border-b text-sm text-slate-600">
                                        <div className="flex justify-between">
                                            <span>{post.likes_count} Suka</span>
                                            <span>{post.comments_count} Komentar</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="px-4 py-3 flex gap-4 border-b">
                                        <button
                                            onClick={() => toggleLike(post.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition ${
                                                post.likes?.some((like) => like.user_id === auth.user.id)
                                                    ? "text-red-600 bg-red-50"
                                                    : "text-slate-600 hover:bg-slate-100"
                                            }`}
                                        >
                                            <Heart
                                                size={20}
                                                fill={
                                                    post.likes?.some((like) => like.user_id === auth.user.id)
                                                        ? "currentColor"
                                                        : "none"
                                                }
                                            />
                                            Suka
                                        </button>

                                        <button
                                            onClick={() =>
                                                setExpandedComments((prev) => ({
                                                    ...prev,
                                                    [post.id]: !prev[post.id],
                                                }))
                                            }
                                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
                                        >
                                            <MessageCircle size={20} />
                                            Komentar
                                        </button>
                                    </div>

                                    {/* Comments Section */}
                                    {expandedComments[post.id] && (
                                        <div className="px-4 py-4 bg-slate-50 space-y-4">
                                            {post.comments && post.comments.length > 0 ? (
                                                <div className="space-y-3">
                                                    {post.comments.map((comment) => (
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
                                                                    {(comment.user_id === auth.user.id || auth.user.is_admin) && (
                                                                        <button
                                                                            onClick={() =>
                                                                                destroy(
                                                                                    route("forum.comment.destroy", comment.id),
                                                                                    { preserveScroll: true }
                                                                                )
                                                                            }
                                                                            className="text-red-500 hover:text-red-700"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-slate-500 mt-1">
                                                                    {formatTimeAgo(comment.created_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500 text-center py-3">
                                                    Belum ada komentar
                                                </p>
                                            )}

                                            {/* Add Comment Form */}
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    handleAddComment(post.id);
                                                }}
                                                className="flex gap-2"
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="Tulis komentar..."
                                                    value={commentData.comment}
                                                    onChange={(e) => setCommentData("comment", e.target.value)}
                                                    className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!commentData.comment}
                                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition"
                                                >
                                                    Kirim
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                                <p className="text-slate-600 text-lg">
                                    Belum ada postingan dari Admin.
                                </p>
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
            </div>
        </AppLayout>
    );
}
