<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use App\Events\BranchChanged;
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
            'branches' => Branch::with('users')
                ->latest()
                ->get(),
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

        /*
        |--------------------------------------------------------------------------
        | BUAT CABANG
        |--------------------------------------------------------------------------
        */

        $branch = Branch::create($validated);

        /*
        |--------------------------------------------------------------------------
        | MANY TO MANY
        |--------------------------------------------------------------------------
        | Cabang baru otomatis dimiliki semua user
        |--------------------------------------------------------------------------
        */

        $users = User::all();

        foreach ($users as $user) {
            $user->branches()->syncWithoutDetaching([
                $branch->id,
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | LOAD DATA RELATION
        |--------------------------------------------------------------------------
        | Penting supaya data yang dikirim ke Reverb lengkap.
        |--------------------------------------------------------------------------
        */

        $branch->load('users');

        /*
        |--------------------------------------------------------------------------
        | BROADCAST REALTIME
        |--------------------------------------------------------------------------
        */

        event(new BranchChanged(
            branch: $branch,
            action: 'created'
        ));

        /*
        |--------------------------------------------------------------------------
        | RESPONSE ADMIN
        |--------------------------------------------------------------------------
        */

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
            'branch' => $branch->load('users'),
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

        /*
        |--------------------------------------------------------------------------
        | UPDATE
        |--------------------------------------------------------------------------
        */

        $branch->update($validated);

        /*
        |--------------------------------------------------------------------------
        | LOAD RELATION TERBARU
        |--------------------------------------------------------------------------
        */

        $branch->load('users');

        /*
        |--------------------------------------------------------------------------
        | BROADCAST REALTIME
        |--------------------------------------------------------------------------
        */

        event(new BranchChanged(
            branch: $branch,
            action: 'updated'
        ));

        /*
        |--------------------------------------------------------------------------
        | RESPONSE ADMIN
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route('branch.index')
            ->with('success', 'Cabang berhasil diperbarui.');
    }

    /**
     * Hapus cabang
     */
    public function destroy(Branch $branch)
    {
        /*
        |--------------------------------------------------------------------------
        | SIMPAN ID SEBELUM DELETE
        |--------------------------------------------------------------------------
        */

        $branchId = $branch->id;

        /*
        |--------------------------------------------------------------------------
        | HAPUS RELASI USER ↔ CABANG
        |--------------------------------------------------------------------------
        */

        $branch->users()->detach();

        /*
        |--------------------------------------------------------------------------
        | HAPUS CABANG
        |--------------------------------------------------------------------------
        */

        $branch->delete();

        /*
        |--------------------------------------------------------------------------
        | BROADCAST REALTIME
        |--------------------------------------------------------------------------
        | Untuk delete kita kirim ID saja karena record sudah dihapus.
        |--------------------------------------------------------------------------
        */

        event(new BranchChanged(
            branch: null,
            action: 'deleted',
            branchId: $branchId
        ));

        /*
        |--------------------------------------------------------------------------
        | RESPONSE ADMIN
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route('branch.index')
            ->with('success', 'Cabang berhasil dihapus.');
    }
}