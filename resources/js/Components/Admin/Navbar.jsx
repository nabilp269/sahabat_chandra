import { usePage } from "@inertiajs/react";
import {
    Search,
    Bell,
    UserCircle,
} from "lucide-react";

export default function Navbar() {
    const { auth } = usePage().props;

    return (
        <header className="h-20 bg-white shadow flex items-center justify-between px-8">

            {/* Kiri */}
            <div>

                <h1 className="text-2xl font-bold text-slate-800">
                    Dashboard Admin
                </h1>

                <p className="text-gray-500 text-sm">
                    Selamat datang di Admin Panel Sahabat Chandra
                </p>

            </div>

            {/* Kanan */}
            <div className="flex items-center gap-5">

                {/* Search */}
                <div className="relative">

                    <Search
                        className="absolute left-3 top-3 text-gray-400"
                        size={18}
                    />

                    <input
                        type="text"
                        placeholder="Cari..."
                        className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
                    />

                </div>

                {/* Notifikasi */}
                <button className="relative">

                    <Bell
                        size={22}
                        className="text-slate-600"
                    />

                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>

                </button>

                {/* Admin */}
                <div className="flex items-center gap-3">

                    <UserCircle
                        size={40}
                        className="text-[#0057B8]"
                    />

                    <div>

                        <h3 className="font-semibold text-slate-800">
                            {auth.user.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                            Administrator
                        </p>

                    </div>

                </div>

            </div>

        </header>
    );
}