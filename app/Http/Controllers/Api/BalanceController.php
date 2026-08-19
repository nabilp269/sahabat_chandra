<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BalanceController extends Controller
{
    /**
     * Menampilkan saldo user yang sedang login.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $balance = $user->balance;

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $user->id,
                'balance' => $balance ? $balance->balance : 0,
            ],
        ]);
    }
}