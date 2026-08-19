<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ForumLike extends Model
{
    protected $table = 'forum_likes';

    protected $fillable = [
        'user_id',
        'forum_message_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function forumMessage(): BelongsTo
    {
        return $this->belongsTo(
            ForumMessage::class,
            'forum_message_id'
        );
    }
}