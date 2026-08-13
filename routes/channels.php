<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private channel used by Echo for user-specific events (user.{id})
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public channel for admin transaction list (admin only)
Broadcast::channel('admin.transactions', function ($user) {
    return $user->role === 'admin';
});
