<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BalanceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Sahabat Chandra
|--------------------------------------------------------------------------
|
| API ini dibuat terpisah dari route web yang sekarang.
| Tidak mengganggu route Inertia/React yang sudah ada.
|
*/

/*
|--------------------------------------------------------------------------
| PUBLIC API
|--------------------------------------------------------------------------
*/

/**
 * Test API
 */
Route::get('/test', function () {
    return response()->json([
        'success' => true,
        'message' => 'API Sahabat Chandra berhasil terhubung.',
    ]);
});

/**
 * Login API
 */
Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| PROTECTED API
|--------------------------------------------------------------------------
|
| Semua route di bawah ini membutuhkan:
|
| Authorization: Bearer TOKEN
|
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

    /**
     * Data user yang sedang login
     */
    Route::get('/user', [AuthController::class, 'user']);

    /**
     * Logout
     */
    Route::post('/logout', [AuthController::class, 'logout']);


    /*
    |--------------------------------------------------------------------------
    | Balance
    |--------------------------------------------------------------------------
    */

    /**
     * Melihat saldo user yang sedang login
     */
    Route::get('/balance', [BalanceController::class, 'index']);

});