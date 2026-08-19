import { useEffect, useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";
import {
    Heart,
    MessageCircle,
    Trash2,
    Send,
    MessageSquare,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| TIME AGO
|--------------------------------------------------------------------------
*/

function timeAgo(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return "Baru saja";
    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m lalu`;
    }

    if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)}j lalu`;
    }

    if (seconds < 604800) {
        return `${Math.floor(seconds / 86400)}h lalu`;
    }

    return date.toLocaleDateString("id-ID");
}

/*
|--------------------------------------------------------------------------
| NORMALIZE POST
|--------------------------------------------------------------------------
*/

function normalizePost(post) {
    if (!post) return null;

    return {
        ...post,

        likes: Array.isArray(post.likes)
            ? post.likes
            : [],

        comments: Array.isArray(post.comments)
            ? post.comments
            : [],

        likes_count:
            post.likes_count ??
            (Array.isArray(post.likes)
                ? post.likes.length
                : 0),

        comments_count:
            post.comments_count ??
            (Array.isArray(post.comments)
                ? post.comments.length
                : 0),
    };
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function ForumIndex({
    posts = {},
    auth,
}) {
    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */

    const [postList, setPostList] = useState(
        Array.isArray(posts?.data)
            ? posts.data.map(normalizePost)
            : []
    );

    const [expandedComments, setExpandedComments] = useState({});

    const [commentInputs, setCommentInputs] = useState({});

    const [likedPosts, setLikedPosts] = useState({});

    const [likingPost, setLikingPost] = useState(null);

    const [commentingPost, setCommentingPost] = useState(null);

    const [deletingPost, setDeletingPost] = useState(null);

    const [deletingComment, setDeletingComment] = useState(null);

    /*
    |--------------------------------------------------------------------------
    | SYNC DATA DARI INERTIA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const incomingPosts = Array.isArray(posts?.data)
            ? posts.data.map(normalizePost)
            : [];

        setPostList(incomingPosts);
    }, [posts]);

    /*
    |--------------------------------------------------------------------------
    | INITIAL LIKE STATUS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const initialLikes = {};

        postList.forEach((post) => {
            initialLikes[post.id] =
                post.likes?.some(
                    (like) =>
                        Number(like.user_id) ===
                        Number(auth?.user?.id)
                ) ?? false;
        });

        setLikedPosts(initialLikes);
    }, [postList, auth?.user?.id]);

    /*
    |--------------------------------------------------------------------------
    | REALTIME - LARAVEL ECHO / REVERB
    |--------------------------------------------------------------------------
    |
    | Channel:
    |
    | forums
    |
    | Event:
    |
    | forum.message.created
    |
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!window.Echo) {
            console.error(
                "Forum: window.Echo belum tersedia."
            );

            return;
        }

        console.log(
            "Forum User: connecting to channel forums..."
        );

        const channel =
            window.Echo.channel("forums");

        /*
        |--------------------------------------------------------------------------
        | POSTINGAN BARU
        |--------------------------------------------------------------------------
        */

        channel.listen(
            ".forum.message.created",
            (event) => {
                console.log(
                    "Forum User - posting baru:",
                    event
                );

                const newPost =
                    normalizePost(event?.message);

                if (!newPost?.id) {
                    return;
                }

                setPostList((prev) => {
                    /*
                    | Jangan masukkan dua kali
                    */

                    const alreadyExists =
                        prev.some(
                            (post) =>
                                Number(post.id) ===
                                Number(newPost.id)
                        );

                    if (alreadyExists) {
                        return prev;
                    }

                    /*
                    | Postingan baru di paling atas
                    */

                    return [
                        newPost,
                        ...prev,
                    ];
                });
            }
        );

        /*
        |--------------------------------------------------------------------------
        | POSTINGAN DIUPDATE
        |--------------------------------------------------------------------------
        |
        | Akan aktif kalau backend mengirim:
        |
        | forum.message.updated
        |
        */

        channel.listen(
            ".forum.message.updated",
            (event) => {
                console.log(
                    "Forum User - posting diupdate:",
                    event
                );

                const updatedPost =
                    normalizePost(event?.message);

                if (!updatedPost?.id) {
                    return;
                }

                setPostList((prev) =>
                    prev.map((post) =>
                        Number(post.id) ===
                        Number(updatedPost.id)
                            ? {
                                  ...post,
                                  ...updatedPost,
                              }
                            : post
                    )
                );
            }
        );

        /*
        |--------------------------------------------------------------------------
        | POSTINGAN DIHAPUS
        |--------------------------------------------------------------------------
        |
        | Akan aktif kalau backend mengirim:
        |
        | forum.message.deleted
        |
        */

        channel.listen(
            ".forum.message.deleted",
            (event) => {
                console.log(
                    "Forum User - posting dihapus:",
                    event
                );

                const deletedId =
                    event?.id ??
                    event?.message_id ??
                    event?.message?.id;

                if (!deletedId) {
                    return;
                }

                setPostList((prev) =>
                    prev.filter(
                        (post) =>
                            Number(post.id) !==
                            Number(deletedId)
                    )
                );

                /*
                | Bersihkan state postingan
                */

                setLikedPosts((prev) => {
                    const next = { ...prev };

                    delete next[deletedId];

                    return next;
                });

                setCommentInputs((prev) => {
                    const next = { ...prev };

                    delete next[deletedId];

                    return next;
                });

                setExpandedComments((prev) => {
                    const next = { ...prev };

                    delete next[deletedId];

                    return next;
                });
            }
        );

        /*
        |--------------------------------------------------------------------------
        | KOMENTAR BARU
        |--------------------------------------------------------------------------
        |
        | Akan aktif kalau backend mengirim:
        |
        | forum.comment.created
        |
        */

        channel.listen(
            ".forum.comment.created",
            (event) => {
                console.log(
                    "Forum User - komentar baru:",
                    event
                );

                const comment =
                    event?.comment;

                const postId =
                    event?.forum_message_id ??
                    comment?.forum_message_id ??
                    event?.post_id;

                if (!comment?.id || !postId) {
                    return;
                }

                setPostList((prev) =>
                    prev.map((post) => {
                        if (
                            Number(post.id) !==
                            Number(postId)
                        ) {
                            return post;
                        }

                        const comments =
                            Array.isArray(post.comments)
                                ? post.comments
                                : [];

                        /*
                        | Jangan duplikat komentar
                        */

                        const exists =
                            comments.some(
                                (item) =>
                                    Number(item.id) ===
                                    Number(comment.id)
                            );

                        if (exists) {
                            return post;
                        }

                        return {
                            ...post,

                            comments: [
                                comment,
                                ...comments,
                            ],

                            comments_count:
                                Number(
                                    post.comments_count ?? 0
                                ) + 1,
                        };
                    })
                );

                /*
                | Buka komentar otomatis
                */

                setExpandedComments((prev) => ({
                    ...prev,
                    [postId]: true,
                }));
            }
        );

        /*
        |--------------------------------------------------------------------------
        | KOMENTAR DIHAPUS
        |--------------------------------------------------------------------------
        */

        channel.listen(
            ".forum.comment.deleted",
            (event) => {
                console.log(
                    "Forum User - komentar dihapus:",
                    event
                );

                const commentId =
                    event?.comment_id ??
                    event?.comment?.id;

                const postId =
                    event?.forum_message_id ??
                    event?.comment?.forum_message_id ??
                    event?.post_id;

                if (!commentId) {
                    return;
                }

                setPostList((prev) =>
                    prev.map((post) => {
                        /*
                        | Kalau post ID tersedia,
                        | hanya update post tersebut
                        */

                        if (
                            postId &&
                            Number(post.id) !==
                                Number(postId)
                        ) {
                            return post;
                        }

                        const comments =
                            (post.comments ?? []).filter(
                                (comment) =>
                                    Number(comment.id) !==
                                    Number(commentId)
                            );

                        return {
                            ...post,

                            comments,

                            comments_count:
                                Math.max(
                                    0,
                                    Number(
                                        post.comments_count ??
                                            comments.length + 1
                                    ) - 1
                                ),
                        };
                    })
                );
            }
        );

        /*
        |--------------------------------------------------------------------------
        | LIKE UPDATED
        |--------------------------------------------------------------------------
        |
        | Akan aktif kalau backend mengirim:
        |
        | forum.like.updated
        |
        */

        channel.listen(
            ".forum.like.updated",
            (event) => {
                console.log(
                    "Forum User - like berubah:",
                    event
                );

                const postId =
                    event?.forum_message_id ??
                    event?.post_id ??
                    event?.message?.id;

                if (!postId) {
                    return;
                }

                const likesCount =
                    event?.likes_count ??
                    event?.message?.likes_count;

                if (
                    likesCount !== undefined
                ) {
                    setPostList((prev) =>
                        prev.map((post) =>
                            Number(post.id) ===
                            Number(postId)
                                ? {
                                      ...post,
                                      likes_count:
                                          Number(
                                              likesCount
                                          ),
                                  }
                                : post
                        )
                    );
                }

                /*
                | Kalau event membawa user_id
                | dan action, update status like
                */

                if (
                    event?.user_id &&
                    event?.action
                ) {
                    const isCurrentUser =
                        Number(event.user_id) ===
                        Number(auth?.user?.id);

                    if (isCurrentUser) {
                        setLikedPosts((prev) => ({
                            ...prev,
                            [postId]:
                                event.action ===
                                "liked",
                        }));
                    }
                }
            }
        );

        /*
        |--------------------------------------------------------------------------
        | CONNECTION ERROR
        |--------------------------------------------------------------------------
        */

        const pusher =
            window.Echo.connector?.pusher;

        if (pusher) {
            pusher.connection.bind(
                "connected",
                () => {
                    console.log(
                        "Forum User: Reverb connected."
                    );
                }
            );

            pusher.connection.bind(
                "disconnected",
                () => {
                    console.warn(
                        "Forum User: Reverb disconnected."
                    );
                }
            );

            pusher.connection.bind(
                "error",
                (error) => {
                    console.error(
                        "Forum User: Reverb error:",
                        error
                    );
                }
            );
        }

        /*
        |--------------------------------------------------------------------------
        | CLEANUP
        |--------------------------------------------------------------------------
        */

        return () => {
            console.log(
                "Forum User: leaving channel forums..."
            );

            channel.stopListening(
                ".forum.message.created"
            );

            channel.stopListening(
                ".forum.message.updated"
            );

            channel.stopListening(
                ".forum.message.deleted"
            );

            channel.stopListening(
                ".forum.comment.created"
            );

            channel.stopListening(
                ".forum.comment.deleted"
            );

            channel.stopListening(
                ".forum.like.updated"
            );

            window.Echo.leave("forums");
        };
    }, [auth?.user?.id]);

    /*
    |--------------------------------------------------------------------------
    | INPUT KOMENTAR
    |--------------------------------------------------------------------------
    */

    const handleCommentChange = (
        postId,
        value
    ) => {
        setCommentInputs((prev) => ({
            ...prev,
            [postId]: value,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | TOGGLE KOMENTAR
    |--------------------------------------------------------------------------
    */

    const toggleComments = (postId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | LIKE
    |--------------------------------------------------------------------------
    */

    const toggleLike = (postId) => {
        if (likingPost === postId) {
            return;
        }

        const previousLiked =
            !!likedPosts[postId];

        /*
        | Optimistic like
        */

        setLikedPosts((prev) => ({
            ...prev,
            [postId]: !previousLiked,
        }));

        /*
        | Optimistic count
        */

        setPostList((prev) =>
            prev.map((post) => {
                if (
                    Number(post.id) !==
                    Number(postId)
                ) {
                    return post;
                }

                const currentCount =
                    Number(
                        post.likes_count ??
                            post.likes?.length ??
                            0
                    );

                return {
                    ...post,

                    likes_count: Math.max(
                        0,
                        currentCount +
                            (previousLiked
                                ? -1
                                : 1)
                    ),
                };
            })
        );

        setLikingPost(postId);

        router.post(
            route(
                "forum.like",
                postId
            ),
            {},
            {
                preserveScroll: true,
                preserveState: true,

                onError: () => {
                    /*
                    | Rollback status
                    */

                    setLikedPosts((prev) => ({
                        ...prev,
                        [postId]:
                            previousLiked,
                    }));

                    /*
                    | Rollback count
                    */

                    setPostList((prev) =>
                        prev.map((post) => {
                            if (
                                Number(
                                    post.id
                                ) !==
                                Number(postId)
                            ) {
                                return post;
                            }

                            const currentCount =
                                Number(
                                    post.likes_count ??
                                        0
                                );

                            return {
                                ...post,

                                likes_count:
                                    Math.max(
                                        0,
                                        currentCount +
                                            (previousLiked
                                                ? 1
                                                : -1)
                                    ),
                            };
                        })
                    );
                },

                onFinish: () => {
                    setLikingPost(null);
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | TAMBAH KOMENTAR
    |--------------------------------------------------------------------------
    */

    const handleAddComment = (
        postId
    ) => {
        const comment =
            (
                commentInputs[
                    postId
                ] || ""
            ).trim();

        if (!comment) {
            return;
        }

        if (
            commentingPost ===
            postId
        ) {
            return;
        }

        setCommentingPost(postId);

        router.post(
            route(
                "forum.comment.store",
                postId
            ),
            {
                comment,
            },
            {
                preserveScroll: true,
                preserveState: true,

                onSuccess: () => {
                    /*
                    | Kosongkan input
                    */

                    setCommentInputs(
                        (prev) => ({
                            ...prev,
                            [postId]: "",
                        })
                    );

                    /*
                    | Buka komentar
                    */

                    setExpandedComments(
                        (prev) => ({
                            ...prev,
                            [postId]: true,
                        })
                    );
                },

                onFinish: () => {
                    setCommentingPost(null);
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | HAPUS POST
    |--------------------------------------------------------------------------
    */

    const handleDeletePost = (
        postId
    ) => {
        if (
            deletingPost ===
            postId
        ) {
            return;
        }

        if (
            !confirm(
                "Yakin ingin menghapus postingan ini?"
            )
        ) {
            return;
        }

        setDeletingPost(postId);

        router.delete(
            route(
                "forum.destroy",
                postId
            ),
            {
                preserveScroll: true,
                preserveState: true,

                onSuccess: () => {
                    /*
                    | Hapus langsung
                    */

                    setPostList(
                        (prev) =>
                            prev.filter(
                                (post) =>
                                    Number(
                                        post.id
                                    ) !==
                                    Number(
                                        postId
                                    )
                            )
                    );

                    setLikedPosts(
                        (prev) => {
                            const next = {
                                ...prev,
                            };

                            delete next[
                                postId
                            ];

                            return next;
                        }
                    );

                    setCommentInputs(
                        (prev) => {
                            const next = {
                                ...prev,
                            };

                            delete next[
                                postId
                            ];

                            return next;
                        }
                    );

                    setExpandedComments(
                        (prev) => {
                            const next = {
                                ...prev,
                            };

                            delete next[
                                postId
                            ];

                            return next;
                        }
                    );
                },

                onFinish: () => {
                    setDeletingPost(null);
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
            deletingComment ===
            commentId
        ) {
            return;
        }

        if (
            !confirm(
                "Yakin ingin menghapus komentar ini?"
            )
        ) {
            return;
        }

        setDeletingComment(
            commentId
        );

        router.delete(
            route(
                "forum.comment.destroy",
                commentId
            ),
            {
                preserveScroll: true,
                preserveState: true,

                onSuccess: () => {
                    setPostList(
                        (prev) =>
                            prev.map(
                                (post) => {
                                    if (
                                        Number(
                                            post.id
                                        ) !==
                                        Number(
                                            postId
                                        )
                                    ) {
                                        return post;
                                    }

                                    const comments =
                                        (
                                            post.comments ??
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
                                        ...post,

                                        comments,

                                        comments_count:
                                            comments.length,
                                    };
                                }
                            )
                    );
                },

                onFinish: () => {
                    setDeletingComment(
                        null
                    );
                },
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <AppLayout>
            <Head title="Forum Diskusi" />

            <div className="max-w-2xl mx-auto px-4 pb-10">

                {/* HEADER */}

                <div className="bg-gradient-to-r from-[#0057B8] to-[#0F6FFF] rounded-3xl p-6 text-white shadow-lg mb-6">
                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <MessageSquare
                                size={28}
                            />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold">
                                Forum Diskusi
                            </h1>

                            <p className="text-blue-100 text-sm mt-0.5">
                                Informasi & pengumuman dari Admin
                            </p>
                        </div>

                    </div>
                </div>

                {/* POSTS */}

                {postList.length >
                0 ? (

                    <div className="space-y-5">

                        {postList.map(
                            (p) => {

                                const liked =
                                    !!likedPosts[
                                        p.id
                                    ];

                                const likeCount =
                                    Number(
                                        p.likes_count ??
                                            p.likes
                                                ?.length ??
                                            0
                                    );

                                const commentCount =
                                    Number(
                                        p.comments_count ??
                                            p
                                                .comments
                                                ?.length ??
                                            0
                                    );

                                const currentComment =
                                    commentInputs[
                                        p.id
                                    ] || "";

                                const isCommenting =
                                    commentingPost ===
                                    p.id;

                                const isLiking =
                                    likingPost ===
                                    p.id;

                                return (
                                    <div
                                        key={
                                            p.id
                                        }
                                        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                                    >

                                        {/* HEADER */}

                                        <div className="flex items-center justify-between px-5 pt-5 pb-3">

                                            <div className="flex items-center gap-3">

                                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg">
                                                    {p.user?.name
                                                        ?.charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>

                                                <div>

                                                    <div className="flex items-center gap-2">

                                                        <p className="font-bold text-slate-800">
                                                            {p.user?.name}
                                                        </p>

                                                        {p.is_admin && (
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                                                                Admin
                                                            </span>
                                                        )}

                                                    </div>

                                                    <p className="text-xs text-gray-400">
                                                        {timeAgo(
                                                            p.created_at
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                            {auth
                                                ?.user
                                                ?.is_admin && (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        deletingPost ===
                                                        p.id
                                                    }
                                                    onClick={() =>
                                                        handleDeletePost(
                                                            p.id
                                                        )
                                                    }
                                                    className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition disabled:opacity-50"
                                                >
                                                    <Trash2
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>
                                            )}

                                        </div>

                                        {/* MESSAGE */}

                                        {p.message && (
                                            <p className="px-5 pb-3 text-slate-700 whitespace-pre-wrap leading-relaxed">
                                                {
                                                    p.message
                                                }
                                            </p>
                                        )}

                                        {/* IMAGE */}

                                        {p.image && (
                                            <img
                                                src={`/storage/${p.image}`}
                                                alt="Post"
                                                className="w-full max-h-96 object-cover"
                                            />
                                        )}

                                        {/* STATS */}

                                        <div className="px-5 py-2 flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50">

                                            <span>
                                                {
                                                    likeCount
                                                }{" "}
                                                suka
                                            </span>

                                            <span>
                                                {
                                                    commentCount
                                                }{" "}
                                                komentar
                                            </span>

                                        </div>

                                        {/* ACTION */}

                                        <div className="px-5 py-3 flex gap-2 border-t border-gray-50">

                                            {/* LIKE */}

                                            <button
                                                type="button"
                                                disabled={
                                                    isLiking
                                                }
                                                onClick={() =>
                                                    toggleLike(
                                                        p.id
                                                    )
                                                }
                                                className={`
                                                    flex-1
                                                    flex
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    py-2.5
                                                    rounded-2xl
                                                    font-semibold
                                                    text-sm
                                                    transition
                                                    disabled:opacity-60
                                                    ${
                                                        liked
                                                            ? "bg-red-50 text-red-600"
                                                            : "bg-gray-50 text-slate-600 hover:bg-gray-100"
                                                    }
                                                `}
                                            >

                                                <Heart
                                                    size={
                                                        17
                                                    }
                                                    fill={
                                                        liked
                                                            ? "currentColor"
                                                            : "none"
                                                    }
                                                />

                                                {liked
                                                    ? "Disukai"
                                                    : "Suka"}

                                            </button>

                                            {/* COMMENT */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleComments(
                                                        p.id
                                                    )
                                                }
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl font-semibold text-sm bg-gray-50 text-slate-600 hover:bg-gray-100 transition"
                                            >

                                                <MessageCircle
                                                    size={
                                                        17
                                                    }
                                                />

                                                {expandedComments[
                                                    p.id
                                                ]
                                                    ? "Sembunyikan"
                                                    : "Komentar"}

                                            </button>

                                        </div>

                                        {/* COMMENTS */}

                                        {expandedComments[
                                            p.id
                                        ] && (

                                            <div className="px-5 pb-5 pt-2 bg-slate-50 space-y-3">

                                                {p.comments
                                                    ?.length >
                                                0 ? (

                                                    p.comments.map(
                                                        (
                                                            c
                                                        ) => (

                                                            <div
                                                                key={
                                                                    c.id
                                                                }
                                                                className="flex gap-3"
                                                            >

                                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                                    {c.user?.name
                                                                        ?.charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>

                                                                <div className="flex-1 bg-white rounded-2xl px-4 py-3 shadow-sm">

                                                                    <div className="flex items-start justify-between gap-2">

                                                                        <div>

                                                                            <p className="font-semibold text-sm text-slate-800">
                                                                                {
                                                                                    c
                                                                                        .user
                                                                                        ?.name
                                                                                }
                                                                            </p>

                                                                            <p className="text-sm text-slate-600 mt-0.5 whitespace-pre-wrap">
                                                                                {
                                                                                    c.comment
                                                                                }
                                                                            </p>

                                                                            <p className="text-xs text-gray-400 mt-1">
                                                                                {timeAgo(
                                                                                    c.created_at
                                                                                )}
                                                                            </p>

                                                                        </div>

                                                                        {(
                                                                            Number(
                                                                                c.user_id
                                                                            ) ===
                                                                                Number(
                                                                                    auth
                                                                                        ?.user
                                                                                        ?.id
                                                                                ) ||
                                                                            auth
                                                                                ?.user
                                                                                ?.is_admin
                                                                        ) && (
                                                                            <button
                                                                                type="button"
                                                                                disabled={
                                                                                    deletingComment ===
                                                                                    c.id
                                                                                }
                                                                                onClick={() =>
                                                                                    handleDeleteComment(
                                                                                        c.id,
                                                                                        p.id
                                                                                    )
                                                                                }
                                                                                className="text-red-400 hover:text-red-600 transition shrink-0 disabled:opacity-50"
                                                                            >
                                                                                <Trash2
                                                                                    size={
                                                                                        13
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        )}

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        )
                                                    )

                                                ) : (

                                                    <p className="text-sm text-gray-400 text-center py-2">
                                                        Belum ada komentar
                                                    </p>

                                                )}

                                                {/* INPUT KOMENTAR */}

                                                <form
                                                    onSubmit={(
                                                        e
                                                    ) => {
                                                        e.preventDefault();

                                                        handleAddComment(
                                                            p.id
                                                        );
                                                    }}
                                                    className="flex gap-2 mt-2"
                                                >

                                                    <input
                                                        type="text"
                                                        placeholder="Tulis komentar..."
                                                        value={
                                                            currentComment
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleCommentChange(
                                                                p.id,
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        disabled={
                                                            isCommenting
                                                        }
                                                        className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                    />

                                                    <button
                                                        type="submit"
                                                        disabled={
                                                            !currentComment.trim() ||
                                                            isCommenting
                                                        }
                                                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-2xl flex items-center justify-center transition"
                                                    >
                                                        <Send
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </button>

                                                </form>

                                            </div>

                                        )}

                                    </div>
                                );
                            }
                        )}

                    </div>

                ) : (

                    /* EMPTY */

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">

                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">

                            <MessageSquare
                                size={
                                    36
                                }
                                className="text-blue-300"
                            />

                        </div>

                        <h2 className="text-xl font-bold text-slate-700">
                            Belum Ada Postingan
                        </h2>

                        <p className="text-gray-400 mt-2">
                            Admin belum membuat postingan.
                        </p>

                    </div>
                )}

                {/* PAGINATION */}

                {posts?.links &&
                    posts.links.length >
                        3 && (

                        <div className="mt-6 flex justify-center gap-2">

                            {posts.links.map(
                                (
                                    link,
                                    index
                                ) => (

                                    <a
                                        key={
                                            index
                                        }
                                        href={
                                            link.url
                                        }
                                        className={`
                                            px-4
                                            py-2
                                            rounded-xl
                                            text-sm
                                            font-semibold
                                            transition
                                            ${
                                                link.active
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white text-slate-600 hover:bg-gray-100 border border-gray-200"
                                            }
                                            ${
                                                !link.url
                                                    ? "opacity-40 pointer-events-none"
                                                    : ""
                                            }
                                        `}
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
        </AppLayout>
    );
}