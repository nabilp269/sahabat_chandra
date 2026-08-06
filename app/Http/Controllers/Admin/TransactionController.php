<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Daftar seluruh transaksi
     */
    public function index(): Response
    {
        $transactions = Transaction::with('user')
            ->latest()
            ->get();

        return Inertia::render('Admin/Transaction/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Detail transaksi
     */
    public function show(Transaction $transaction): Response
    {
        $transaction->load('user');

        return Inertia::render('Admin/Transaction/Show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Approve transaksi
     */
    public function approve(Transaction $transaction)
    {
        if ($transaction->status != 'pending') {
            return back();
        }

        $balance = \App\Models\Balance::where(
            'user_id',
            $transaction->user_id
        )->first();

        if (!$balance) {
            return back()->with(
                'error',
                'Saldo user tidak ditemukan.'
            );
        }

        if ($balance->amount < $transaction->amount) {
            return back()->with(
                'error',
                'Saldo user tidak mencukupi.'
            );
        }

        // Kurangi saldo
        $balance->decrement(
            'amount',
            $transaction->amount
        );

        // Update status transaksi
        $transaction->update([
            'status' => 'success',
        ]);

        // Buat notifikasi
        \App\Models\Notification::create([
            'title' => 'Transaksi Berhasil',
            'message' => 'Transaksi Anda sebesar Rp '
                . number_format($transaction->amount,0,',','.')
                . ' berhasil diproses.',
            'user_id' => $transaction->user_id,
        ]);

        return back()->with(
            'success',
            'Transaksi berhasil disetujui.'
        );
    }

    /**
     * Reject transaksi
     */
    public function reject(Transaction $transaction)
    {
        if ($transaction->status != 'pending') {
            return back();
        }

        $transaction->update([
            'status' => 'failed',
        ]);

        \App\Models\Notification::create([
            'title' => 'Transaksi Ditolak',
            'message' => 'Transaksi Anda ditolak oleh Admin.',
            'user_id' => $transaction->user_id,
        ]);

        return back()->with(
            'success',
            'Transaksi berhasil ditolak.'
        );
    }
}