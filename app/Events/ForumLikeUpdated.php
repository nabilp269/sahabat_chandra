<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ForumLikeUpdated implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public int $forumMessageId;

    public int $likesCount;

    public function __construct(
        int $forumMessageId,
        int $likesCount
    ) {
        $this->forumMessageId = $forumMessageId;
        $this->likesCount = $likesCount;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('forums'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'forum.like.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'forum_message_id' => $this->forumMessageId,
            'likes_count' => $this->likesCount,
        ];
    }
}