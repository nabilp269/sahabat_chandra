<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Notification;
use App\Models\ForumMessage;
use Inertia\Inertia;

class LocationController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Ambil SEMUA cabang
        $branches = Branch::with('users')
            ->latest()
            ->get();

        return Inertia::render('Location/Index', [

            'branches' => $branches,

            'notifications' => Notification::where(function ($query) use ($user) {

                    $query->whereNull('user_id')
                          ->orWhere('user_id', $user->id);

                })
                ->latest()
                ->take(10)
                ->get(),

            'messages' => ForumMessage::with('user')
                ->latest()
                ->take(20)
                ->get(),

        ]);
    }
}