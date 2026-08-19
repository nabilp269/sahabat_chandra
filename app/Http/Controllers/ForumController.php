<?php

namespace App\Http\Controllers;

use App\Events\ForumCommentCreated;
use App\Events\ForumLikeUpdated;
use App\Models\ForumComment;
use App\Models\ForumLike;
use App\Models\ForumMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ForumController extends Controller
{
    /**
     * Forum User
     */
    public function index()
    {
        $messages = ForumMessage::with([
            'user',

            'likes' => function ($query) {
                $query->select(
                    'id',
                    'user_id',
                    'forum_message_id'
                );
            },

            'comments' => function ($query) {
                $query->latest();
            },

            'comments.user',
        ])
            ->withCount([
                'likes',
                'comments',
            ])
            ->latest()
            ->paginate(20);

        auth()->user()->update([
            'last_seen_forum_at' => now(),
        ]);

        return inertia('Forum/Index', [
            'posts' => $messages,
        ]);
    }

    /**
     * Cek postingan admin terbaru
     */
    public function checkNew()
    {
        $user = auth()->user();

        $lastSeen = $user->last_seen_forum_at;

        $latestPost = ForumMessage::where(
            'is_admin',
            true
        )
            ->latest()
            ->first();

        if (!$latestPost) {
            return response()->json([
                'has_new' => false,
                'post' => null,
            ]);
        }

        $hasNew =
            $lastSeen === null ||
            $latestPost->created_at->gt($lastSeen);

        return response()->json([
            'has_new' => $hasNew,

            'post' => $hasNew
                ? [
                    'id' => $latestPost->id,
                    'message' => $latestPost->message,
                    'image' => $latestPost->image,
                    'created_at' => $latestPost->created_at,
                ]
                : null,
        ]);
    }

    /**
     * Tandai forum sudah dilihat
     */
    public function markSeen()
    {
        auth()->user()->update([
            'last_seen_forum_at' => now(),
        ]);

        return response()->json([
            'ok' => true,
        ]);
    }

    /**
     * LIKE / UNLIKE
     */
    public function toggleLike(
        ForumMessage $forumMessage
    ) {
        $userId = auth()->id();

        $like = ForumLike::where(
            'user_id',
            $userId
        )
            ->where(
                'forum_message_id',
                $forumMessage->id
            )
            ->first();

        if ($like) {
            $like->delete();

            $liked = false;
        } else {
            $like = ForumLike::create([
                'user_id' => $userId,
                'forum_message_id' => $forumMessage->id,
            ]);

            $liked = true;
        }

        /*
        |--------------------------------------------------------------------------
        | Hitung ulang jumlah like
        |--------------------------------------------------------------------------
        */

        $likesCount = ForumLike::where(
            'forum_message_id',
            $forumMessage->id
        )->count();

        /*
        |--------------------------------------------------------------------------
        | Broadcast realtime
        |--------------------------------------------------------------------------
        */

        event(
            new ForumLikeUpdated(
                $forumMessage->id,
                $likesCount
            )
        );

        return back()->with(
            'success',
            'Like diperbarui.'
        );
    }

    /**
     * TAMBAH KOMENTAR
     */
    public function addComment(
        Request $request,
        ForumMessage $forumMessage
    ) {
        $validated = $request->validate([
            'comment' => [
                'required',
                'string',
                'max:500',
            ],
        ]);

        $comment = ForumComment::create([
            'user_id' => auth()->id(),
            'forum_message_id' => $forumMessage->id,
            'comment' => $validated['comment'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Load user supaya frontend langsung dapat nama
        |--------------------------------------------------------------------------
        */

        $comment->load('user');

        /*
        |--------------------------------------------------------------------------
        | Hitung jumlah komentar
        |--------------------------------------------------------------------------
        */

        $commentsCount = ForumComment::where(
            'forum_message_id',
            $forumMessage->id
        )->count();

        /*
        |--------------------------------------------------------------------------
        | Broadcast realtime
        |--------------------------------------------------------------------------
        */

        event(
            new ForumCommentCreated(
                $comment,
                $commentsCount
            )
        );

        return back()->with(
            'success',
            'Komentar berhasil ditambahkan.'
        );
    }

    /**
     * Hapus komentar
     */
    public function deleteComment(
        ForumComment $forumComment
    ) {
        if (
            $forumComment->user_id !== auth()->id()
            &&
            !auth()->user()->is_admin
        ) {
            abort(403);
        }

        $forumMessageId =
            $forumComment->forum_message_id;

        $forumComment->delete();

        $commentsCount = ForumComment::where(
            'forum_message_id',
            $forumMessageId
        )->count();

        return back()->with(
            'success',
            'Komentar berhasil dihapus.'
        );
    }

    /**
     * Hapus postingan
     */
    public function destroy(
        ForumMessage $forumMessage
    ) {
        if (
            $forumMessage->user_id !== auth()->id()
            &&
            !auth()->user()->is_admin
        ) {
            abort(403);
        }

        if ($forumMessage->image) {
            Storage::disk('public')->delete(
                $forumMessage->image
            );
        }

        $forumMessage->delete();

        return back()->with(
            'success',
            'Postingan berhasil dihapus.'
        );
    }
}