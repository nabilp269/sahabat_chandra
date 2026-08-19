<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ForumCommentDeleted implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public int $forum_message_id;
    public int $comment_id;
    public int $comments_count;

    public function __construct(
        int $forum_message_id,
        int $comment_id,
        int $comments_count
    ) {
        $this->forum_message_id = $forum_message_id;
        $this->comment_id = $comment_id;
        $this->comments_count = $comments_count;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('forums'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'forum.comment.deleted';
    }

    public function broadcastWith(): array
    {
        return [
            'forum_message_id' =>
                $this->forum_message_id,

            'comment_id' =>
                $this->comment_id,

            'comments_count' =>
                $this->comments_count,
        ];
    }
}