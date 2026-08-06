<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Notification;
use App\Models\ForumMessage;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Profile/Index', [

            'user' => $request->user(),

            'notifications' => Notification::where(function ($query) use ($request) {
                    $query->whereNull('user_id')
                        ->orWhere('user_id', $request->user()->id);
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