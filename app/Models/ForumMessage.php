<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ForumMessage extends Model
{
    protected $table = 'forum_messages';

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

    public function likes(): HasMany
    {
        return $this->hasMany(
            ForumLike::class,
            'forum_message_id'
        );
    }

    public function comments(): HasMany
    {
        return $this->hasMany(
            ForumComment::class,
            'forum_message_id'
        );
    }
}