<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\ForumMessage;
use App\Models\Notification;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $months = [
            1 => "Jan",
            2 => "Feb",
            3 => "Mar",
            4 => "Apr",
            5 => "Mei",
            6 => "Jun",
            7 => "Jul",
            8 => "Agu",
            9 => "Sep",
            10 => "Okt",
            11 => "Nov",
            12 => "Des",
        ];

        /*
        |--------------------------------------------------------------------------
        | Grafik Transaksi
        |--------------------------------------------------------------------------
        */

        $transactionResult = Transaction::select(
                DB::raw("EXTRACT(MONTH FROM created_at) as month"),
                DB::raw("COUNT(*) as total")
            )
            ->groupBy("month")
            ->pluck("total", "month")
            ->toArray();

        /*
        |--------------------------------------------------------------------------
        | Grafik User
        |--------------------------------------------------------------------------
        */

        $userResult = User::select(
                DB::raw("EXTRACT(MONTH FROM created_at) as month"),
                DB::raw("COUNT(*) as total")
            )
            ->groupBy("month")
            ->pluck("total", "month")
            ->toArray();

        $chart = [];

        foreach ($months as $number => $name) {

            $chart[] = [

                "bulan" => $name,

                "transaksi" => (int) ($transactionResult[$number] ?? 0),

                "user" => (int) ($userResult[$number] ?? 0),

            ];

        }

        return Inertia::render("Admin/Dashboard", [

            /*
            |--------------------------------------------------------------------------
            | Card Statistik
            |--------------------------------------------------------------------------
            */

            "users" => User::count(),

            "transactions" => Transaction::count(),

            "forums" => ForumMessage::count(),

            "notifications" => Notification::count(),

            "branches" => Branch::count(),

            /*
            |--------------------------------------------------------------------------
            | Ringkasan
            |--------------------------------------------------------------------------
            */

            "todayTransactions" => Transaction::whereDate(
                "created_at",
                today()
            )->count(),

            "totalAmount" => Transaction::sum("amount"),

            /*
            |--------------------------------------------------------------------------
            | Aktivitas Terbaru
            |--------------------------------------------------------------------------
            */

            "latestUsers" => User::latest()
                ->take(5)
                ->get(),

            "latestTransactions" => Transaction::with("user")
                ->latest()
                ->take(5)
                ->get(),

            "latestForums" => ForumMessage::with("user")
                ->latest()
                ->take(5)
                ->get(),

            "latestNotifications" => Notification::latest()
                ->take(5)
                ->get(),

            "latestBranches" => Branch::latest()
                ->take(5)
                ->get(),

            /*
            |--------------------------------------------------------------------------
            | Grafik Dashboard
            |--------------------------------------------------------------------------
            */

            "chart" => $chart,

        ]);
    }
}