<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Daftar semua user
     */
    public function index()
    {
        $users = User::with([
            'balance',
            'branches',
        ])
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Tidak dipakai
     */
    public function create()
    {
        return redirect()->route('users.index');
    }

    /**
     * Admin tidak membuat user manual
     */
    public function store(Request $request)
    {
        return redirect()->route('users.index');
    }

    /**
     * Detail user
     */
    public function show(User $user)
    {
        $user->load([
            'balance',
            'branches',
        ]);

        return Inertia::render('Admin/User/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Form Edit User
     */
    public function edit(User $user)
    {
        $user->load('branches');

        $branches = Branch::orderBy('name')->get();

        return Inertia::render('Admin/User/Edit', [
            'user' => $user,
            'branches' => $branches,
        ]);
    }

    /**
     * Update User
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email,' . $user->id,
            'phone'     => 'nullable|string|max:20',
            'role'      => 'required|in:user,admin',

            // many to many
            'branches'      => 'nullable|array',
            'branches.*'    => 'exists:branches,id',
        ]);

        $user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'role'  => $validated['role'],
        ]);

        // Simpan relasi cabang
        $user->branches()->sync(
            $validated['branches'] ?? []
        );

        return redirect()
            ->route('users.index')
            ->with(
                'success',
                'Data user berhasil diperbarui.'
            );
    }

    /**
     * Hapus User
     */
    public function destroy(User $user)
    {
        if ($user->id == auth()->id()) {

            return back()->with(
                'error',
                'Anda tidak dapat menghapus akun sendiri.'
            );

        }

        $user->delete();

        return redirect()
            ->route('users.index')
            ->with(
                'success',
                'User berhasil dihapus.'
            );
    }
}