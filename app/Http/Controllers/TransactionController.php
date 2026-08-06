<?php

namespace App\Http\Controllers;

use App\Models\Balance;
use App\Models\Branch;
use App\Models\ForumMessage;
use App\Models\Notification;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Simpan Transaksi
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $request->validate([
            'receiver_name'    => 'required|string|max:255',
            'receiver_bank'    => 'required|string|max:255',
            'receiver_account' => 'required|string|max:255',
            'amount'           => 'required|numeric|min:1',
            'description'      => 'nullable|string',
        ]);

        $balance = Balance::where('user_id', Auth::id())->first();

        if (!$balance) {
            return back()->withErrors([
                'amount' => 'Saldo Anda belum tersedia.',
            ]);
        }

        if ($balance->amount <= 0) {
            return back()->withErrors([
                'amount' => 'Saldo Anda habis.',
            ]);
        }

        if ($balance->amount < $request->amount) {
            return back()->withErrors([
                'amount' => 'Saldo tidak mencukupi.',
            ]);
        }

        DB::transaction(function () use ($request) {

            $branchId = Auth::user()
                ->branches()
                ->value('branches.id');

            Transaction::create([
                'user_id'          => Auth::id(),
                'branch_id'        => $branchId,
                'transaction_code' => 'TRX' . now()->format('YmdHis') . rand(100, 999),
                'type'             => 'transfer',
                'receiver_name'    => $request->receiver_name,
                'receiver_bank'    => $request->receiver_bank,
                'receiver_account' => $request->receiver_account,
                'amount'           => $request->amount,
                'status'           => 'pending',
                'description'      => $request->description,
            ]);
        });

        return back()->with(
            'success',
            'Transaksi berhasil dikirim. Menunggu persetujuan Admin.'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Riwayat
    |--------------------------------------------------------------------------
    */

    public function history(Request $request)
    {
        $user = Auth::user();

        /*
        |--------------------------------------------------------------------------
        | Cabang User
        |--------------------------------------------------------------------------
        */

        $branches = $user->branches()
            ->orderBy('name')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Query Transaksi
        |--------------------------------------------------------------------------
        */

        $query = Transaction::with('branch')
            ->where('user_id', $user->id);

        if ($request->filled('branch')) {
            $query->where('branch_id', $request->branch);
        }

        if ($request->filled('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $transactions = $query
            ->latest()
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Forum
        |--------------------------------------------------------------------------
        */

        $messages = ForumMessage::with('user')
            ->orderBy('created_at', 'asc')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Notifikasi Admin
        |--------------------------------------------------------------------------
        */

        $adminNotifications = Notification::where(function ($q) use ($user) {
            $q->whereNull('user_id')
              ->orWhere('user_id', $user->id);
        })
        ->latest()
        ->get();

        /*
        |--------------------------------------------------------------------------
        | Notifikasi Status Transaksi
        |--------------------------------------------------------------------------
        */

        $transactionNotifications = Transaction::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'success', 'failed'])
            ->latest()
            ->get()
            ->map(function ($trx) {

                if ($trx->status === 'success') {

                    $title = 'Transaksi Berhasil';
                    $message = 'Transfer sebesar Rp '
                        . number_format($trx->amount, 0, ',', '.')
                        . ' berhasil diproses Admin.';

                } elseif ($trx->status === 'failed') {

                    $title = 'Transaksi Ditolak';
                    $message = 'Transfer sebesar Rp '
                        . number_format($trx->amount, 0, ',', '.')
                        . ' ditolak Admin.';

                } else {

                    $title = 'Menunggu Persetujuan';
                    $message = 'Transfer sebesar Rp '
                        . number_format($trx->amount, 0, ',', '.')
                        . ' sedang menunggu persetujuan Admin.';
                }

                return (object)[
                    'id' => 'trx-' . $trx->id,
                    'title' => $title,
                    'message' => $message,
                    'created_at' => $trx->updated_at,
                ];
            });

        $notifications = $adminNotifications
            ->concat($transactionNotifications)
            ->sortByDesc('created_at')
            ->values();

        return Inertia::render('History/Index', [

            'transactions' => $transactions,

            'branches' => $branches,

            'messages' => $messages,

            'notifications' => $notifications,

            'filters' => [
                'branch' => $request->branch,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],

        ]);
    }
}