<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Balance;

class BalanceSeeder extends Seeder
{
    public function run(): void
    {
        Balance::create([
            'user_id' => 1,
            'amount' => 2500000,
        ]);
    }
}