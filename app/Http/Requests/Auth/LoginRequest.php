<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Validation Rules
     */
    public function rules(): array
    {
        return [
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Login menggunakan Email atau Nomor HP
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $login = $this->input('login');

        // Cek apakah login berupa email atau nomor HP
        $field = filter_var($login, FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'phone';

        Log::info('Percobaan Login', [
            'login' => $login,
            'field' => $field,
        ]);

        $user = User::where($field, $login)->first();

        if (! $user) {
            Log::warning('USER TIDAK DITEMUKAN');
        }

        if (! Auth::attempt([
            $field => $login,
            'password' => $this->input('password'),
        ], $this->boolean('remember'))) {

            Log::warning('LOGIN GAGAL', [
                'login' => $login,
            ]);

            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'login' => 'Email / Nomor HP atau Password salah.',
            ]);
        }

        Log::info('LOGIN BERHASIL', [
            'user_id' => Auth::id(),
            'user_name' => Auth::user()->name,
        ]);

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Rate Limit
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'login' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Key Rate Limit
     */
    public function throttleKey(): string
    {
        return Str::transliterate(
            Str::lower($this->input('login')) . '|' . $this->ip()
        );
    }
}