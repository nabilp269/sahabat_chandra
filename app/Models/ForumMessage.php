<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumMessage extends Model
{
    protected $fillable = [
        'user_id',
        'message',
        'image',
        'is_admin',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}   