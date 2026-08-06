<?php

use Illuminate\Support\Facades\Route;

// USER CONTROLLER
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\FavoriteBranchController;

// ADMIN CONTROLLER
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ForumController as AdminForumController;
use App\Http\Controllers\Admin\NotificationController as AdminNotificationController;
use App\Http\Controllers\Admin\BranchController as AdminBranchController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;

/*
|--------------------------------------------------------------------------
| WEB ROUTES
|--------------------------------------------------------------------------
*/

Route::redirect('/', '/login');


/*
|--------------------------------------------------------------------------
| USER
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'index'])
        ->name('profile');

    Route::post('/profile/identity', [ProfileController::class, 'uploadIdentity'])
        ->name('profile.identity');

    Route::get('/location', [LocationController::class, 'index'])
        ->name('location');

    Route::post('/transaction', [TransactionController::class, 'store'])
        ->name('transaction.store');

    Route::get('/history', [TransactionController::class, 'history'])
        ->name('history');

    Route::post('/discussion/store', [DiscussionController::class, 'store'])
        ->name('discussion.store');

    Route::post('/forum/store', [ForumController::class, 'store'])
        ->name('forum.store');
});


/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::prefix('admin')
    ->middleware(['auth', 'admin'])
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | Dashboard
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('admin.dashboard');

        /*
        |--------------------------------------------------------------------------
        | Transaction
        |--------------------------------------------------------------------------
        */

        Route::get('/transactions', [AdminTransactionController::class, 'index'])
            ->name('admin.transaction.index');

        Route::get('/transactions/{transaction}', [AdminTransactionController::class, 'show'])
            ->name('admin.transaction.show');

        Route::patch('/transactions/{transaction}/approve', [AdminTransactionController::class, 'approve'])
            ->name('admin.transaction.approve');

        Route::patch('/transactions/{transaction}/reject', [AdminTransactionController::class, 'reject'])
            ->name('admin.transaction.reject');

        /*
        |--------------------------------------------------------------------------
        | Forum
        |--------------------------------------------------------------------------
        */

        Route::get('/forum', [AdminForumController::class, 'index'])
            ->name('admin.forum');

        Route::post('/forum/store', [AdminForumController::class, 'store'])
            ->name('admin.forum.store');

        Route::delete('/forum/{forumMessage}', [AdminForumController::class, 'destroy'])
            ->name('admin.forum.destroy');

        /*
        |--------------------------------------------------------------------------
        | Notification
        |--------------------------------------------------------------------------
        */

        Route::resource('notification', AdminNotificationController::class);

        /*
        |--------------------------------------------------------------------------
        | Branch (CRUD)
        |--------------------------------------------------------------------------
        */

        Route::resource('branch', AdminBranchController::class);

        /*
        |--------------------------------------------------------------------------
        | Users
        |--------------------------------------------------------------------------
        */

        Route::resource('users', AdminUserController::class);

        Route::post('/users/{user}/topup', [AdminUserController::class, 'topUp'])
            ->name('users.topup');

    });

            /*
        |--------------------------------------------------------------------------
        | Favorite many to many lokasi Users
        |--------------------------------------------------------------------------
        */

    Route::middleware(['auth'])->group(function () {

    Route::get('/favorite-branches', [FavoriteBranchController::class, 'index'])
        ->name('favorite.index');

    Route::post('/favorite-branches/{branch}', [FavoriteBranchController::class, 'store'])
        ->name('favorite.store');

    Route::delete('/favorite-branches/{branch}', [FavoriteBranchController::class, 'destroy'])
        ->name('favorite.destroy');

});

require __DIR__.'/auth.php';