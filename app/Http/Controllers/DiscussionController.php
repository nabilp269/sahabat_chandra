<?php

namespace App\Http\Controllers;

use App\Models\Discussion;
use Illuminate\Http\Request;

class DiscussionController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'content' => 'required|string',
            'attachment' => 'nullable|image|max:2048',
        ]);

        $image = null;

        if ($request->hasFile('attachment')) {
            $image = $request->file('attachment')->store('discussion', 'public');
        }

        Discussion::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'category' => $request->category,
            'content' => $request->content,
            'attachment' => $image,
        ]);

        return back()->with('success', 'Diskusi berhasil dibuat.');
    }
}