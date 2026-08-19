import { useEffect, useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import {
    MessageCircle,
    Trash2,
    Paperclip,
} from "lucide-react";

function formatTimeAgo(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Baru saja";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m yang lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}j yang lalu`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}h yang lalu`;

    return date.toLocaleDateString("id-ID");
}

export default function Index({ posts = {}, auth }) {
    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [postList, setPostList] = useState(
        posts?.data ?? []
    );

    const [expandedComments, setExpandedComments] = useState({});

    const [imagePreview, setImagePreview] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | FORM POSTING
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | SYNC DARI INERTIA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        setPostList(posts?.data ?? []);
    }, [posts?.data]);

    /*
    |--------------------------------------------------------------------------
    | REALTIME REVERB
    |--------------------------------------------------------------------------
    |
    | Admin mendengarkan channel:
    |
    | forums
    |
    | Event:
    |
    | forum.message.created
    | forum.like.updated
    | forum.comment.created
    | forum.comment.deleted
    | forum.message.deleted
    |
    */

    useEffect(() => {
        if (!window.Echo) {
            console.error(
                "❌ Laravel Echo tidak tersedia."
            );

            return;
        }

        console.log(
            "🟢 Admin Forum: connecting to channel forums..."
        );

        const channel = window.Echo.channel("forums");

        /*
        |--------------------------------------------------------------------------
        | 1. POSTING BARU
        |--------------------------------------------------------------------------
        */

        channel.listen(
            ".forum.message.created",
            (event) => {
                console.log(
                    "🟢 Admin Forum - posting baru:",
                    event
                );

                const newPost = event?.message;

                if (!newPost) {
                    console.warn(
                        "⚠️ event.message tidak ditemukan"
                    );

                    return;
                }

                setPostList((currentPosts) => {
                    const exists = currentPosts.some(
                        (post) =>
                            Number(post.id) ===
                            Number(newPost.id)
                    );

                    if (exists) {
                        return currentPosts;
                    }

                    return [
                        newPost,
                        ...currentPosts,
                    ];
                });
            }
        );

        /*
        |--------------------------------------------------------------------------
        | 2. LIKE BERUBAH
        |--------------------------------------------------------------------------
        */

        channel.listen(
            ".forum.like.updated",
            (event) => {
                console.log(
                    "❤️ Admin Forum - like berubah:",
                    event
                );

                const postId =
                    event?.forum_message_id ??
                    event?.post_id;

                const likesCount =
                    event?.likes_count;

                if (!postId) {
                    return;
                }

                setPostList((currentPosts) =>
                    currentPosts.map((item) => {
                        if (
                            Number(item.id) !==
                            Number(postId)
                        ) {
                            return item;
                        }

                        return {
                            ...item,
                            likes_count:
                                likesCount ??
                                item.likes_count ??
                                item.likes?.length ??
                                0,
                        };
                    })
                );
            }
        );

        /*
        |--------------------------------------------------------------------------
        | 3. KOMENTAR BARU
        |--------------------------------------------------------------------------
        */

        channel.listen(
            ".forum.comment.created",
            (event) => {
                console.log(
                    "💬 Admin Forum - komentar baru:",
                    event
                );

                const postId =
                    event?.forum_message_id ??
                    event?.post_id;

                const comment =
                    event?.comment;

                if (!postId || !comment) {
                    return;
                }

                setPostList((currentPosts) =>
                    currentPosts.map((item) => {
                        if (
                            Number(item.id) !==
                            Number(postId)
                        ) {
                            return item;
                        }

                        const currentComments =
                            item.comments ?? [];

                        const exists =
                            currentComments.some(
                                (c) =>
                                    Number(c.id) ===
                                    Number(comment.id)
                            );

                        if (exists) {
                            return item;
                        }

                        return {
                            ...item,

                            comments: [
                                ...currentComments,
                                comment,
                            ],

                            comments_count:
                                event?.comments_count ??
                                currentComments.length +
                                    1,
                        };
                    })
                );
            }
        );

        /*
        |--------------------------------------------------------------------------
        | 4. KOMENTAR DIHAPUS
        |--------------------------------------------------------------------------
        */

        channel.listen(
            ".forum.comment.deleted",
            (event) => {
                console.log(
                    "🗑️ Admin Forum - komentar dihapus:",
                    event
                );

                const postId =
                    event?.forum_message_id ??
                    event?.post_id;

                const commentId =
                    event?.comment_id;

                if (!postId || !commentId) {
                    return;
                }

                setPostList((currentPosts) =>
                    currentPosts.map((item) => {
                        if (
                            Number(item.id) !==
                            Number(postId)
                        ) {
                            return item;
                        }

                        const currentComments =
                            item.comments ?? [];

                        const newComments =
                            currentComments.filter(
                                (comment) =>
                                    Number(comment.id) !==
                                    Number(commentId)
                            );

                        return {
                            ...item,

                            comments: newComments,

                            comments_count:
                                event?.comments_count ??
                                newComments.length,
                        };
                    })
                );
            }
        );

        /*
        |--------------------------------------------------------------------------
        | 5. POSTINGAN DIHAPUS
        |--------------------------------------------------------------------------
        */

        channel.listen(
            ".forum.message.deleted",
            (event) => {
                console.log(
                    "🗑️ Admin Forum - postingan dihapus:",
                    event
                );

                const postId =
                    event?.forum_message_id ??
                    event?.post_id;

                if (!postId) {
                    return;
                }

                setPostList((currentPosts) =>
                    currentPosts.filter(
                        (item) =>
                            Number(item.id) !==
                            Number(postId)
                    )
                );
            }
        );

        /*
        |--------------------------------------------------------------------------
        | CLEANUP
        |--------------------------------------------------------------------------
        */

        return () => {
            console.log(
                "🔴 Admin Forum: leaving channel forums..."
            );

            channel.stopListening(
                ".forum.message.created"
            );

            channel.stopListening(
                ".forum.like.updated"
            );

            channel.stopListening(
                ".forum.comment.created"
            );

            channel.stopListening(
                ".forum.comment.deleted"
            );

            channel.stopListening(
                ".forum.message.deleted"
            );

            window.Echo.leave("forums");
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | POSTING ADMIN
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            processing ||
            (
                !data.message?.trim() &&
                !data.image
            )
        ) {
            return;
        }

        post(
            route("admin.forum.store"),
            {
                forceFormData: true,
                preserveScroll: true,

                onSuccess: () => {
                    reset(
                        "message",
                        "image"
                    );

                    setImagePreview(null);
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | HAPUS POSTINGAN
    |--------------------------------------------------------------------------
    */

    const handleDeletePost = (id) => {
        if (
            !confirm(
                "Yakin ingin menghapus postingan ini?"
            )
        ) {
            return;
        }

        destroy(
            route(
                "admin.forum.destroy",
                id
            ),
            {
                preserveScroll: true,

                onSuccess: () => {
                    setPostList(
                        (currentPosts) =>
                            currentPosts.filter(
                                (item) =>
                                    Number(item.id) !==
                                    Number(id)
                            )
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | HAPUS KOMENTAR
    |--------------------------------------------------------------------------
    */

    const handleDeleteComment = (
        commentId,
        postId
    ) => {
        if (
            !confirm(
                "Yakin ingin menghapus komentar ini?"
            )
        ) {
            return;
        }

        destroy(
            route(
                "admin.forum.comment.destroy",
                commentId
            ),
            {
                preserveScroll: true,

                onSuccess: () => {
                    setPostList(
                        (currentPosts) =>
                            currentPosts.map(
                                (item) => {
                                    if (
                                        Number(
                                            item.id
                                        ) !==
                                        Number(
                                            postId
                                        )
                                    ) {
                                        return item;
                                    }

                                    const comments =
                                        (
                                            item.comments ??
                                            []
                                        ).filter(
                                            (
                                                comment
                                            ) =>
                                                Number(
                                                    comment.id
                                                ) !==
                                                Number(
                                                    commentId
                                                )
                                        );

                                    return {
                                        ...item,

                                        comments,

                                        comments_count:
                                            comments.length,
                                    };
                                }
                            )
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | TOGGLE KOMENTAR
    |--------------------------------------------------------------------------
    */

    const toggleComments = (id) => {
        setExpandedComments(
            (prev) => ({
                ...prev,

                [id]:
                    !prev[id],
            })
        );
    };

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <AdminLayout>

            <Head title="Forum Diskusi" />

            <div className="max-w-3xl mx-auto px-4 py-8">

                {/* HEADER */}

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-slate-800">
                        Forum Diskusi
                    </h1>

                    <p className="text-slate-600 mt-1">
                        Kelola postingan dan komentar forum
                    </p>

                </div>

                {/* FORM POSTING */}

                <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

                    <p className="font-semibold text-slate-700 mb-3">
                        Buat Postingan Baru
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* PREVIEW GAMBAR */}

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
                                        setImagePreview(
                                            null
                                        );

                                        setData(
                                            "image",
                                            null
                                        );
                                    }}
                                    className="mt-2 text-sm text-red-600 hover:text-red-700 font-semibold"
                                >
                                    Hapus Gambar
                                </button>

                            </div>
                        )}

                        {/* TEXT */}

                        <textarea
                            value={
                                data.message
                            }
                            onChange={(e) =>
                                setData(
                                    "message",
                                    e.target.value
                                )
                            }
                            placeholder="Tulis pengumuman atau informasi untuk pengguna..."
                            className="w-full border rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />

                        <div className="flex items-center justify-between mt-4">

                            <label className="cursor-pointer">

                                <Paperclip
                                    size={20}
                                    className="text-slate-600 hover:text-blue-600"
                                />

                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {

                                        const file =
                                            e.target.files?.[0];

                                        if (!file) {
                                            return;
                                        }

                                        setData(
                                            "image",
                                            file
                                        );

                                        setImagePreview(
                                            URL.createObjectURL(
                                                file
                                            )
                                        );

                                    }}
                                />

                            </label>

                            <button
                                type="submit"
                                disabled={
                                    processing ||
                                    (
                                        !data.message?.trim() &&
                                        !data.image
                                    )
                                }
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-6 py-2 rounded-full font-semibold transition"
                            >
                                {processing
                                    ? "Mengirim..."
                                    : "Posting"}
                            </button>

                        </div>

                    </form>

                </div>

                {/* POSTS */}

                <div className="space-y-6">

                    {postList.length > 0 ? (

                        postList.map(
                            (item) => {

                                const comments =
                                    item.comments ??
                                    [];

                                const likesCount =
                                    item.likes_count ??
                                    item.likes?.length ??
                                    0;

                                const commentsCount =
                                    item.comments_count ??
                                    comments.length;

                                return (

                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                                    >

                                        {/* HEADER */}

                                        <div className="p-4 flex justify-between items-start border-b">

                                            <div className="flex items-center gap-3">

                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">

                                                    {item.user?.name
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}

                                                </div>

                                                <div>

                                                    <p className="font-semibold text-slate-800">

                                                        {
                                                            item
                                                                .user
                                                                ?.name
                                                        }

                                                        {item.is_admin && (
                                                            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                                                Admin
                                                            </span>
                                                        )}

                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {formatTimeAgo(
                                                            item.created_at
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeletePost(
                                                        item.id
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2
                                                    size={18}
                                                />
                                            </button>

                                        </div>

                                        {/* CONTENT */}

                                        {item.message && (
                                            <div className="px-4 py-3">

                                                <p className="text-slate-800 whitespace-pre-wrap">
                                                    {
                                                        item.message
                                                    }
                                                </p>

                                            </div>
                                        )}

                                        {/* IMAGE */}

                                        {item.image && (
                                            <img
                                                src={`/storage/${item.image}`}
                                                alt="Post"
                                                className="w-full h-96 object-cover"
                                            />
                                        )}

                                        {/* STATS */}

                                        <div className="px-4 py-3 border-t border-b text-sm text-slate-600">

                                            <div className="flex justify-between">

                                                <span>
                                                    {
                                                        likesCount
                                                    }{" "}
                                                    Suka
                                                </span>

                                                <span>
                                                    {
                                                        commentsCount
                                                    }{" "}
                                                    Komentar
                                                </span>

                                            </div>

                                        </div>

                                        {/* COMMENT BUTTON */}

                                        <div className="px-4 py-3 border-b">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleComments(
                                                        item.id
                                                    )
                                                }
                                                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm transition"
                                            >

                                                <MessageCircle
                                                    size={
                                                        18
                                                    }
                                                />

                                                {expandedComments[
                                                    item.id
                                                ]
                                                    ? "Sembunyikan Komentar"
                                                    : "Lihat Komentar"}

                                            </button>

                                        </div>

                                        {/* COMMENTS */}

                                        {expandedComments[
                                            item.id
                                        ] && (

                                            <div className="px-4 py-4 bg-slate-50 space-y-3">

                                                {comments.length >
                                                0 ? (

                                                    comments.map(
                                                        (
                                                            comment
                                                        ) => (

                                                            <div
                                                                key={
                                                                    comment.id
                                                                }
                                                                className="flex gap-3"
                                                            >

                                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">

                                                                    {comment
                                                                        .user
                                                                        ?.name
                                                                        ?.charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}

                                                                </div>

                                                                <div className="flex-1 bg-white p-3 rounded-lg">

                                                                    <div className="flex justify-between items-start">

                                                                        <div>

                                                                            <p className="font-semibold text-sm text-slate-800">

                                                                                {
                                                                                    comment
                                                                                        .user
                                                                                        ?.name
                                                                                }

                                                                            </p>

                                                                            <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">

                                                                                {
                                                                                    comment.comment
                                                                                }

                                                                            </p>

                                                                        </div>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleDeleteComment(
                                                                                    comment.id,
                                                                                    item.id
                                                                                )
                                                                            }
                                                                            className="text-red-500 hover:text-red-700"
                                                                        >

                                                                            <Trash2
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />

                                                                        </button>

                                                                    </div>

                                                                    <p className="text-xs text-slate-500 mt-1">

                                                                        {formatTimeAgo(
                                                                            comment.created_at
                                                                        )}

                                                                    </p>

                                                                </div>

                                                            </div>

                                                        )
                                                    )

                                                ) : (

                                                    <p className="text-sm text-slate-500 text-center py-3">
                                                        Belum ada komentar
                                                    </p>

                                                )}

                                            </div>

                                        )}

                                    </div>

                                );
                            }
                        )

                    ) : (

                        <div className="text-center py-12 bg-white rounded-2xl shadow-md">

                            <p className="text-slate-600 text-lg">
                                Belum ada postingan.
                            </p>

                        </div>

                    )}

                </div>

                {/* PAGINATION */}

                {posts?.links &&
                    posts.links.length > 3 && (

                        <div className="mt-8 flex justify-center gap-2 flex-wrap">

                            {posts.links.map(
                                (
                                    link,
                                    index
                                ) => (

                                    <a
                                        key={`${link.label}-${index}`}
                                        href={
                                            link.url ??
                                            "#"
                                        }
                                        className={`px-4 py-2 rounded-lg ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : "bg-white text-slate-700 hover:bg-slate-100"
                                        } ${
                                            !link.url
                                                ? "opacity-40 pointer-events-none"
                                                : ""
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                link.label,
                                        }}
                                    />

                                )
                            )}

                        </div>

                    )}

            </div>

        </AdminLayout>
    );
}