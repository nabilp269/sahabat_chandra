<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ForumMessageDeleted implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public int $forum_message_id;

    public function __construct(
        int $forum_message_id
    ) {
        $this->forum_message_id =
            $forum_message_id;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('forums'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'forum.message.deleted';
    }

    public function broadcastWith(): array
    {
        return [
            'forum_message_id' =>
                $this->forum_message_id,
        ];
    }
}