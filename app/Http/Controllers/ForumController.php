<?php

namespace App\Http\Controllers;

use App\Models\ForumMessage;
use App\Models\ForumLike;
use App\Models\ForumComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ForumController extends Controller
{
    /**
     * Display forum feed
     */
    public function index()
    {
        $messages = ForumMessage::with(['user', 'likes', 'comments.user'])
            ->latest()
            ->paginate(20);

        // Update last_seen saat buka forum
        auth()->user()->update(['last_seen_forum_at' => now()]);

        return inertia('Forum/Index', [
            'posts' => $messages,
        ]);
    }

    /** Cek apakah ada post baru sejak user terakhir lihat */
    public function checkNew()
    {
        $user = auth()->user();
        $lastSeen = $user->last_seen_forum_at;

        $query = ForumMessage::where('is_admin', true)->latest();

        $latestPost = $query->first();

        if (!$latestPost) {
            return response()->json(['has_new' => false]);
        }

        $hasNew = $lastSeen === null || $latestPost->created_at->gt($lastSeen);

        return response()->json([
            'has_new' => $hasNew,
            'post' => $hasNew ? [
                'id' => $latestPost->id,
                'message' => $latestPost->message,
                'image' => $latestPost->image,
                'created_at' => $latestPost->created_at,
            ] : null,
        ]);
    }

    /** Tandai user sudah lihat forum */
    public function markSeen()
    {
        auth()->user()->update(['last_seen_forum_at' => now()]);
        return response()->json(['ok' => true]);
    }

    /** User menghapus postingan (hanya admin) */
    public function destroy(ForumMessage $forumMessage)
    {
        if ($forumMessage->user_id !== auth()->id() && !auth()->user()->is_admin) {
            abort(403);
        }

        if ($forumMessage->image) {
            Storage::disk('public')->delete($forumMessage->image);
        }

        $forumMessage->delete();

        return back()->with('success', 'Postingan berhasil dihapus.');
    }

    /**
     * Like/Unlike a forum post
     */
    public function toggleLike(ForumMessage $forumMessage)
    {
        $like = ForumLike::where([
            'user_id' => auth()->id(),
            'forum_message_id' => $forumMessage->id,
        ])->first();

        if ($like) {
            $like->delete();
        } else {
            ForumLike::create([
                'user_id' => auth()->id(),
                'forum_message_id' => $forumMessage->id,
            ]);
        }

        return back();
    }

    /**
     * Add comment to forum post
     */
    public function addComment(Request $request, ForumMessage $forumMessage)
    {
        $request->validate([
            'comment' => 'required|string|max:500',
        ]);

        ForumComment::create([
            'user_id' => auth()->id(),
            'forum_message_id' => $forumMessage->id,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Komentar berhasil ditambahkan.');
    }

    /**
     * Delete comment
     */
    public function deleteComment(ForumComment $forumComment)
    {
        if ($forumComment->user_id !== auth()->id() && !auth()->user()->is_admin) {
            abort(403);
        }

        $forumComment->delete();

        return back()->with('success', 'Komentar berhasil dihapus.');
    }
}