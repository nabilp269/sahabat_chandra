<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteBranchController extends Controller
{
    /**
     * Menampilkan semua cabang favorit user login
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $branches = $user->favoriteBranches()
            ->orderBy('name')
            ->get();

        return Inertia::render('Favorite/Index', [
            'branches' => $branches,
        ]);
    }

    /**
     * Tambah cabang ke favorit
     */
    public function store(Request $request, Branch $branch)
    {
        $user = $request->user();

        if (!$user->favoriteBranches()->where('branch_id', $branch->id)->exists()) {
            $user->favoriteBranches()->attach($branch->id);
        }

        return back()->with('success', 'Cabang berhasil ditambahkan ke favorit.');
    }

    /**
     * Hapus cabang dari favorit
     */
    public function destroy(Request $request, Branch $branch)
    {
        $request->user()
            ->favoriteBranches()
            ->detach($branch->id);

        return back()->with('success', 'Cabang dihapus dari favorit.');
    }
}