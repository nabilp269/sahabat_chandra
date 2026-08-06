<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        Branch::insert([
            [
                'name' => 'Sahabat Chandra Surabaya',
                'address' => 'Jl. Ahmad Yani No.45 Surabaya',
                'phone' => '031888888',
                'latitude' => -7.3305000,
                'longitude' => 112.7345000,
                'open_time' => '08:00:00',
                'close_time' => '16:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sahabat Chandra Sidoarjo',
                'address' => 'Jl. Pahlawan No.20 Sidoarjo',
                'phone' => '031777777',
                'latitude' => -7.4468000,
                'longitude' => 112.7183000,
                'open_time' => '08:00:00',
                'close_time' => '16:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sahabat Chandra Malang',
                'address' => 'Jl. Soekarno Hatta No.10 Malang',
                'phone' => '034188888',
                'latitude' => -7.9666000,
                'longitude' => 112.6326000,
                'open_time' => '08:00:00',
                'close_time' => '16:00:00',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}