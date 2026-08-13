<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Balance;
use App\Models\Notification;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
     * Cari transaksi berdasarkan transaction_code (untuk scan QR)
     */
    public function findByCode(Request $request)
    {
        $code = $request->query('code');

        if (!$code) {
            return response()->json(['error' => 'Kode tidak ditemukan'], 404);
        }

        // QR value bisa berupa JSON string
        if (str_starts_with($code, '{')) {
            $decoded = json_decode($code, true);
            $code = $decoded['code'] ?? $code;
        }

        $transaction = Transaction::where('transaction_code', $code)->first();

        if (!$transaction) {
            return response()->json(['error' => 'Transaksi tidak ditemukan'], 404);
        }

        return response()->json(['id' => $transaction->id]);
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
        if ($transaction->status !== 'pending') {
            return back()->with(
                'error',
                'Transaksi sudah diproses.'
            );
        }

        DB::transaction(function () use ($transaction) {

            // Ambil atau buat record saldo jika belum ada. Tidak menghentikan proses
            // meskipun saldo kurang — memungkinkan saldo menjadi negatif.
            $balance = Balance::firstOrCreate(
                ['user_id' => $transaction->user_id],
                ['balance' => 0]
            );

            // Kurangi saldo user (boleh menjadi negatif)
            $balance->decrement('balance', $transaction->amount);

            // Update status transaksi
            $transaction->update(['status' => 'success']);

            // Simpan notifikasi
            Notification::create([
                'user_id' => $transaction->user_id,
                'title' => 'Transaksi Berhasil',
                'message' =>
                    'Transfer sebesar Rp ' .
                    number_format($transaction->amount, 0, ',', '.') .
                    ' berhasil diproses Admin.',
            ]);
        });

        event(new \App\Events\TransactionStatusUpdated($transaction->fresh()));

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
        if ($transaction->status !== 'pending') {
            return back()->with(
                'error',
                'Transaksi sudah diproses.'
            );
        }

        $transaction->update(['status' => 'failed']);

        Notification::create([
            'user_id' => $transaction->user_id,
            'title' => 'Transaksi Ditolak',
            'message' => 'Transaksi Anda ditolak oleh Admin.',
        ]);

        event(new \App\Events\TransactionStatusUpdated($transaction->fresh()));

        return back()->with(
            'success',
            'Transaksi berhasil ditolak.'
        );
    }
}