<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Notification;
use App\Models\ForumMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Halaman lokasi user
     */
    public function index()
    {
        $user = auth()->user();

        /*
        |--------------------------------------------------------------------------
        | CABANG
        |--------------------------------------------------------------------------
        |
        | Ambil semua cabang terbaru.
        | users ikut dimuat karena kemungkinan digunakan
        | pada tampilan lokasi.
        |
        */

        $branches = Branch::with('users')
            ->latest()
            ->get();

        /*
        |--------------------------------------------------------------------------
        | NOTIFICATION
        |--------------------------------------------------------------------------
        */

        $notifications = Notification::where(function ($query) use ($user) {
                $query
                    ->whereNull('user_id')
                    ->orWhere('user_id', $user->id);
            })
            ->latest()
            ->take(10)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | FORUM MESSAGE
        |--------------------------------------------------------------------------
        */

        $messages = ForumMessage::with('user')
            ->latest()
            ->take(20)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | RETURN
        |--------------------------------------------------------------------------
        */

        return Inertia::render('Location/Index', [
            'branches' => $branches,
            'notifications' => $notifications,
            'messages' => $messages,
        ]);
    }
}