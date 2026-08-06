<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Balance;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        Log::info('REGISTER MASUK');

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:users,phone',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Rules\Password::defaults(),
            ],
        ]);

        Log::info('VALIDASI BERHASIL');

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),

            'role' => 'user',
            'verification_status' => 'pending',
            'identity_type' => null,
            'identity_number' => null,
            'identity_photo' => null,
        ]);

        Log::info('USER BERHASIL DIBUAT', [
            'id' => $user->id,
            'email' => $user->email,
        ]);

        Balance::create([
            'user_id' => $user->id,
            'balance' => 0,
        ]);

        Log::info('BALANCE BERHASIL DIBUAT');

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('dashboard');
    }
}