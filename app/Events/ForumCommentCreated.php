<?php

namespace App\Events;

use App\Models\ForumComment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ForumCommentCreated implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public ForumComment $comment;

    public int $commentsCount;

    public function __construct(
        ForumComment $comment,
        int $commentsCount
    ) {
        $this->comment = $comment;

        $this->commentsCount = $commentsCount;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('forums'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'forum.comment.created';
    }

    public function broadcastWith(): array
    {
        return [
            'comment' => $this->comment,
            'comments_count' => $this->commentsCount,

            'forum_message_id' =>
                $this->comment->forum_message_id,
        ];
    }
}