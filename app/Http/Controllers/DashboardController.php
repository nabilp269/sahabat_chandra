<?php

namespace App\Http\Controllers;

use App\Models\Balance;
use App\Models\ForumMessage;
use App\Models\Notification;
use App\Models\Transaction;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        // Saldo
        $balance = Balance::firstOrCreate(
            [
                'user_id' => $user->id,
            ],
            [
                'balance' => 0,
            ]
        );

        // Cabang
        $branches = $user->branches()
            ->select('branches.id', 'branches.name')
            ->orderBy('name')
            ->get();

        // Transaksi
        $transactions = Transaction::where('user_id', $user->id)
            ->latest()
            ->take(3)
            ->get();

        // Forum
        $messages = ForumMessage::with('user')
            ->oldest()
            ->get();

        // Notifikasi Admin
        $adminNotifications = Notification::whereNull('user_id')
            ->latest()
            ->get();

        // Notifikasi Transaksi
        $transactionNotifications = Transaction::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'success', 'failed'])
            ->latest()
            ->get()
            ->map(function ($trx) {

                switch ($trx->status) {

                    case 'success':
                        $title = 'Transaksi Berhasil';
                        $message = 'Transfer sebesar Rp '
                            . number_format($trx->amount, 0, ',', '.')
                            . ' berhasil diproses Admin.';
                        break;

                    case 'failed':
                        $title = 'Transaksi Ditolak';
                        $message = 'Transfer sebesar Rp '
                            . number_format($trx->amount, 0, ',', '.')
                            . ' ditolak Admin.';
                        break;

                    default:
                        $title = 'Menunggu Persetujuan';
                        $message = 'Transfer sebesar Rp '
                            . number_format($trx->amount, 0, ',', '.')
                            . ' sedang menunggu persetujuan Admin.';
                        break;
                }

                return (object) [
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

        $kurs = 2050; // Sama dengan di TransactionController
        $limitHkd = 8000;
        $limitIdr = $limitHkd * $kurs;

        $monthlyTotalIdr = Transaction::where('user_id', $user->id)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->whereIn('status', ['pending', 'success'])
            ->sum('amount');

        $monthlyTotalHkd = $monthlyTotalIdr / $kurs;

        $monthlyCount = Transaction::where('user_id', $user->id)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->whereIn('status', ['pending', 'success'])
            ->count();

        $limitData = [
            'total_transactions' => $monthlyCount,
            'used_hkd' => $monthlyTotalHkd,
            'used_idr' => $monthlyTotalIdr,
            'limit_hkd' => $limitHkd,
            'limit_idr' => $limitIdr,
            'remaining_hkd' => max(0, $limitHkd - $monthlyTotalHkd),
            'remaining_idr' => max(0, $limitIdr - $monthlyTotalIdr),
            'percentage' => min(100, ($monthlyTotalHkd / $limitHkd) * 100),
        ];

        return Inertia::render('Dashboard/Index', [
            'user' => $user,
            'balance' => $balance->balance,
            'transactions' => $transactions,
            'messages' => $messages,
            'notifications' => $notifications,
            'branches' => $branches,
            'limit' => $limitData,
        ]);
    }
}