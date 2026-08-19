<?php

namespace App\Http\Controllers;

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

        /*
        |--------------------------------------------------------------------------
        | Cabang User
        |--------------------------------------------------------------------------
        */

        $branches = $user->branches()
            ->select(
                'branches.id',
                'branches.name'
            )
            ->orderBy('name')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Transaksi Terbaru
        |--------------------------------------------------------------------------
        */

        $transactions = Transaction::where(
            'user_id',
            $user->id
        )
            ->latest()
            ->take(3)
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Forum
        |--------------------------------------------------------------------------
        */

        $messages = ForumMessage::with('user')
            ->oldest()
            ->get();

        /*
        |--------------------------------------------------------------------------
        | NOTIFIKASI
        |--------------------------------------------------------------------------
        |
        | Sekarang semua notifikasi yang memang dibuat oleh sistem
        | diambil dari tabel notifications.
        |
        | Termasuk:
        | - Notifikasi Admin
        | - Transaksi baru
        |
        */

        $notifications = Notification::where(function ($query) use ($user) {

            $query->whereNull('user_id')
                ->orWhere('user_id', $user->id);

        })
            ->latest()
            ->get()
            ->map(function ($notification) {

                return (object) [

                    'id' => $notification->id,

                    'title' => $notification->title,

                    'message' => $notification->message,

                    'created_at' => $notification->created_at,

                    'type' => 'notification',

                    'is_read' => $notification->is_read,

                ];
            })
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Notifikasi Status Transaksi Lama
        |--------------------------------------------------------------------------
        |
        | Untuk sementara success / failed tetap dibuat dari transaksi.
        |
        | Pending TIDAK dibuat lagi di sini karena sudah dibuat
        | langsung di Notification::create() saat transaksi disimpan.
        |
        */

        $transactionNotifications = Transaction::where(
            'user_id',
            $user->id
        )
            ->whereIn(
                'status',
                ['pending', 'success', 'failed']
            )
            ->latest()
            ->get()
            ->map(function ($trx) {

                if ($trx->status === 'success') {

                    $title = 'Transaksi Berhasil';

                    $message =
                        'Transfer sebesar Rp '
                        . number_format(
                            $trx->amount,
                            0,
                            ',',
                            '.'
                        )
                        . ' berhasil diproses Admin.';

                } elseif ($trx->status === 'failed') {

                    $title = 'Transaksi Ditolak';

                    $message =
                        'Transfer sebesar Rp '
                        . number_format(
                            $trx->amount,
                            0,
                            ',',
                            '.'
                        )
                        . ' ditolak Admin.';

                } else {

                    $title = 'Menunggu Persetujuan';

                    $message =
                        'Transfer sebesar Rp '
                        . number_format(
                            $trx->amount,
                            0,
                            ',',
                            '.'
                        )
                        . ' sedang menunggu persetujuan Admin.';
                }

                return (object) [

                    'id' =>
                        'trx-' . $trx->id,

                    'title' =>
                        $title,

                    'message' =>
                        $message,

                    'created_at' =>
                        $trx->updated_at,

                    'type' =>
                        'transaction',

                    'status' =>
                        $trx->status,

                    'transaction_code' =>
                        $trx->transaction_code,

                    'receiver_name' =>
                        $trx->receiver_name,

                    'receiver_bank' =>
                        $trx->receiver_bank,

                    'receiver_account' =>
                        $trx->receiver_account,

                    'amount' =>
                        $trx->amount,

                ];
            });

        /*
        |--------------------------------------------------------------------------
        | Gabungkan Notifikasi
        |--------------------------------------------------------------------------
        */

        $allNotifications = $notifications
            ->concat($transactionNotifications)
            ->sortByDesc('created_at')
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Limit Transaksi Bulanan
        |--------------------------------------------------------------------------
        */

        $kurs = 2050;

        $limitHkd = 8000;

        $limitIdr = $limitHkd * $kurs;

        /*
        |--------------------------------------------------------------------------
        | Total Transaksi Berhasil Bulan Ini
        |--------------------------------------------------------------------------
        */

        $monthlyTotalIdr = Transaction::where(
            'user_id',
            $user->id
        )
            ->whereMonth(
                'created_at',
                now()->month
            )
            ->whereYear(
                'created_at',
                now()->year
            )
            ->where(
                'status',
                'success'
            )
            ->sum('amount');

        /*
        |--------------------------------------------------------------------------
        | Total HKD
        |--------------------------------------------------------------------------
        */

        $monthlyTotalHkd =
            $monthlyTotalIdr / $kurs;

        /*
        |--------------------------------------------------------------------------
        | Jumlah Transaksi Berhasil
        |--------------------------------------------------------------------------
        */

        $monthlyCount = Transaction::where(
            'user_id',
            $user->id
        )
            ->whereMonth(
                'created_at',
                now()->month
            )
            ->whereYear(
                'created_at',
                now()->year
            )
            ->where(
                'status',
                'success'
            )
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Data Limit
        |--------------------------------------------------------------------------
        */

        $limitData = [

            'total_transactions' =>
                $monthlyCount,

            'used_hkd' =>
                $monthlyTotalHkd,

            'used_idr' =>
                $monthlyTotalIdr,

            'limit_hkd' =>
                $limitHkd,

            'limit_idr' =>
                $limitIdr,

            'remaining_hkd' =>
                max(
                    0,
                    $limitHkd - $monthlyTotalHkd
                ),

            'remaining_idr' =>
                max(
                    0,
                    $limitIdr - $monthlyTotalIdr
                ),

            'percentage' =>
                min(
                    100,
                    ($monthlyTotalHkd / $limitHkd) * 100
                ),
        ];

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'Dashboard/Index',
            [

                'user' =>
                    $user,

                'transactions' =>
                    $transactions,

                'messages' =>
                    $messages,

                'notifications' =>
                    $allNotifications,

                'branches' =>
                    $branches,

                'limit' =>
                    $limitData,

            ]
        );
    }
}