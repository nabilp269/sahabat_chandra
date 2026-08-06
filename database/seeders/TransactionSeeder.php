<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        Transaction::insert([

            [
                'user_id' => 1,
                'branch_id' => 1,
                'transaction_code' => 'TRX001',
                'type' => 'transfer',
                'receiver_name' => 'Budi Santoso',
                'receiver_bank' => 'BCA',
                'receiver_account' => '123456789',
                'amount' => 50000,
                'status' => 'success',
                'description' => 'Transfer ke BCA',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'user_id' => 1,
                'branch_id' => 2,
                'transaction_code' => 'TRX002',
                'type' => 'deposit',
                'receiver_name' => null,
                'receiver_bank' => null,
                'receiver_account' => null,
                'amount' => 100000,
                'status' => 'success',
                'description' => 'Top Up Saldo',
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}