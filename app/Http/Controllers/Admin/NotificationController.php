<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::latest()->get();

        return Inertia::render('Admin/Notification/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|max:255',
            'message' => 'required',
        ]);

        Notification::create([
            'title'   => $request->title,
            'message' => $request->message,
            'user_id' => null,
            'is_read' => false,
        ]);

        return back()->with(
            'success',
            'Notifikasi berhasil ditambahkan.'
        );
    }

    public function update(Request $request, Notification $notification)
    {
        $request->validate([
            'title'   => 'required|max:255',
            'message' => 'required',
        ]);

        $notification->update([
            'title'   => $request->title,
            'message' => $request->message,
        ]);

        return back()->with(
            'success',
            'Notifikasi berhasil diubah.'
        );
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return back()->with(
            'success',
            'Notifikasi berhasil dihapus.'
        );
    }
}