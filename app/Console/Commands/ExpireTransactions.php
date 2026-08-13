<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Transaction;
use App\Models\Notification;
use Carbon\Carbon;

class ExpireTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'transactions:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark pending transactions as expired when expires_at passed and notify users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();

        $expired = Transaction::where('status', 'pending')
            ->whereNotNull('expires_at')
            ->where('expires_at', '<', $now)
            ->get();

        foreach ($expired as $trx) {
            $trx->update(['status' => 'failed']);

            Notification::create([
                'user_id' => $trx->user_id,
                'title' => 'Transaksi Kedaluwarsa',
                'message' => 'Transaksi dengan kode ' . $trx->transaction_code . ' telah kedaluwarsa.',
            ]);

            try {
                event(new \App\Events\TransactionExpired($trx));
            } catch (\Throwable $e) {
                // ignore broadcast errors
            }

            $this->info('Expired transaction: ' . $trx->id);
        }

        return 0;
    }
}
