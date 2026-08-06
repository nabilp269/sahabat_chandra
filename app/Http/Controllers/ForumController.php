<?php

namespace App\Http\Controllers;

use App\Models\ForumMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ForumController extends Controller
{
    /**
     * User mengirim pesan ke admin
     */
    public function store(Request $request)
    {
        $request->validate([
            'message' => ['nullable', 'string', 'max:2000'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        // Pesan dan gambar tidak boleh sama-sama kosong
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
            'user_id'   => auth()->id(),
            'message'   => $request->message,
            'image'     => $image,
            'is_admin'  => false,
        ]);

        return back()->with('success', 'Pesan berhasil dikirim.');
    }

    /** User menghapus pesannya sendiri (opsional) */
    public function destroy(ForumMessage $forumMessage)
    {
        if ($forumMessage->user_id !== auth()->id()) {
            abort(403);
        }

        if ($forumMessage->image) {
            Storage::disk('public')->delete($forumMessage->image);
        }

        $forumMessage->delete();

        return back()->with('success', 'Pesan berhasil dihapus.');
    }
}