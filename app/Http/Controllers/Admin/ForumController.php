<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForumMessage;
use App\Models\ForumComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ForumController extends Controller
{
    /**
     * Forum Global
     */
    public function index()
    {
        $messages = ForumMessage::with(['user', 'likes', 'comments.user'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Forum/Index', [
            'posts' => $messages,
        ]);
    }

    /**
     * Admin mengirim pesan
     */
    public function store(Request $request)
    {
        $request->validate([
            'message' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if (!$request->filled('message') && !$request->hasFile('image')) {
            return back()->withErrors([
                'message' => 'Pesan tidak boleh kosong.',
            ]);
        }

        $image = null;

        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('forum', 'public');
        }

        ForumMessage::create([
            'user_id' => auth()->id(),
            'message' => $request->message,
            'image' => $image,
            'is_admin' => true,
        ]);

        return redirect()
            ->route('admin.forum')
            ->with('success', 'Pesan berhasil dikirim.');
    }

    /**
     * Hapus pesan
     */
    public function destroy(ForumMessage $forumMessage)
    {
        if ($forumMessage->image) {
            Storage::disk('public')->delete($forumMessage->image);
        }

        $forumMessage->delete();

        return back()->with('success', 'Pesan berhasil dihapus.');
    }

    public function deleteComment(ForumComment $forumComment)
    {
        $forumComment->delete();
        return back()->with('success', 'Komentar berhasil dihapus.');
    }
}