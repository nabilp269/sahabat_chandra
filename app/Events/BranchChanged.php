<?php

namespace App\Events;

use App\Models\Branch;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BranchChanged implements ShouldBroadcastNow
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public ?Branch $branch;

    public string $action;

    public $branchId;

    /**
     * Create a new event instance.
     */
    public function __construct(
        ?Branch $branch = null,
        string $action = 'updated',
        $branchId = null
    ) {
        $this->branch = $branch;
        $this->action = $action;
        $this->branchId = $branchId;
    }

    /**
     * Channel Reverb.
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('branches'),
        ];
    }

    /**
     * Nama event yang diterima Echo.
     */
    public function broadcastAs(): string
    {
        return 'branch.changed';
    }

    /**
     * Data yang dikirim ke browser.
     */
    public function broadcastWith(): array
    {
        return [
            'action' => $this->action,

            'branch' => $this->branch,

            'branch_id' => $this->branchId,
        ];
    }
}