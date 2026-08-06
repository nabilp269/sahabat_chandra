<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    /**
     * Tampilkan daftar cabang
     */
    public function index()
    {
        return Inertia::render('Admin/Branch/Index', [
            'branches' => Branch::latest()->get(),
        ]);
    }

    /**
     * Simpan cabang baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'address'    => ['required', 'string'],
            'phone'      => ['nullable', 'string', 'max:30'],
            'latitude'   => ['required', 'numeric', 'between:-90,90'],
            'longitude'  => ['required', 'numeric', 'between:-180,180'],
            'open_time'  => ['required'],
            'close_time' => ['required'],
        ]);

        $branch = Branch::create($validated);

        /*
        |--------------------------------------------------------------------------
        | MANY TO MANY
        | Cabang baru otomatis dimiliki semua user
        |--------------------------------------------------------------------------
        */

        $users = User::all();

        foreach ($users as $user) {
            $user->branches()->syncWithoutDetaching([
                $branch->id,
            ]);
        }

        return redirect()
            ->route('branch.index')
            ->with('success', 'Cabang berhasil ditambahkan.');
    }

    /**
     * Form edit cabang
     */
    public function edit(Branch $branch)
    {
        return Inertia::render('Admin/Branch/Edit', [
            'branch' => $branch,
        ]);
    }

    /**
     * Update cabang
     */
    public function update(Request $request, Branch $branch)
    {
        $validated = $request->validate([
            'name'       => ['required', 'string', 'max:255'],
            'address'    => ['required', 'string'],
            'phone'      => ['nullable', 'string', 'max:30'],
            'latitude'   => ['required', 'numeric', 'between:-90,90'],
            'longitude'  => ['required', 'numeric', 'between:-180,180'],
            'open_time'  => ['required'],
            'close_time' => ['required'],
        ]);

        $branch->update($validated);

        return redirect()
            ->route('branch.index')
            ->with('success', 'Cabang berhasil diperbarui.');
    }

    /**
     * Hapus cabang
     */
    public function destroy(Branch $branch)
    {
        // Hapus semua relasi user ↔ cabang
        $branch->users()->detach();

        // Hapus cabang
        $branch->delete();

        return redirect()
            ->route('branch.index')
            ->with('success', 'Cabang berhasil dihapus.');
    }
}