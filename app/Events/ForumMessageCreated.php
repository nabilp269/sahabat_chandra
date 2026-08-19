<?php

namespace App\Events;

use App\Models\ForumMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ForumMessageCreated implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    /**
     * Data postingan forum.
     */
    public array $message;

    /**
     * Buat event.
     */
    public function __construct(ForumMessage $forumMessage)
    {
        /*
        |--------------------------------------------------------------------------
        | Ambil data lengkap postingan
        |--------------------------------------------------------------------------
        */

        $forumMessage->load([
            'user',
            'likes' => function ($query) {
                $query->select(
                    'id',
                    'user_id',
                    'forum_message_id'
                );
            },
            'comments' => function ($query) {
                $query
                    ->with('user')
                    ->latest();
            },
        ]);

        /*
        |--------------------------------------------------------------------------
        | Hitung jumlah like & komentar
        |--------------------------------------------------------------------------
        */

        $forumMessage->loadCount([
            'likes',
            'comments',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Kirim sebagai array
        |--------------------------------------------------------------------------
        |
        | Ini lebih aman untuk React/Echo daripada mengirim object
        | Eloquent secara langsung.
        |
        */

        $this->message = $forumMessage->toArray();
    }

    /**
     * Channel yang digunakan.
     *
     * Public channel:
     *
     * forums
     *
     * Jadi Admin dan User yang membuka forum
     * sama-sama bisa menerima event.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('forums'),
        ];
    }

    /**
     * Nama event yang diterima Echo.
     */
    public function broadcastAs(): string
    {
        return 'forum.message.created';
    }

    /**
     * Data yang dikirim melalui Reverb.
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
        ];
    }
}