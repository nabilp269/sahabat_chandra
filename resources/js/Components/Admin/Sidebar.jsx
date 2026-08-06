import {
    LayoutDashboard,
    MessageCircle,
    Bell,
    MapPin,
    Users,
    LogOut,
} from "lucide-react";

import { Link } from "@inertiajs/react";

export default function Sidebar() {
    const menus = [
        {
            name: "Dashboard",
            icon: LayoutDashboard,
            route: route("admin.dashboard"),
        },
        {
            name: "Forum",
            icon: MessageCircle,
            route: route("admin.forum"),
        },
        {
            name: "Notifikasi",
            icon: Bell,
            route: route("notification.index"),
        },
        {
            name: "Lokasi",
            icon: MapPin,
            route: route("branch.index"),
        },
        {
            name: "User",
            icon: Users,
            route: route("users.index"),
        },
    ];

    return (
        <aside className="w-72 bg-[#0F172A] text-white min-h-screen shadow-xl flex flex-col">

            {/* Logo */}
            <div className="h-20 flex items-center justify-center border-b border-slate-700">

                <div className="text-center">

                    <h1 className="text-2xl font-bold">
                        Sahabat Chandra
                    </h1>

                    <p className="text-sm text-slate-300">
                        Admin Panel
                    </p>

                </div>

            </div>

            {/* Menu */}
            <nav className="flex-1 mt-6 px-4">

                {menus.map((menu) => {
                    const Icon = menu.icon;

                    return (
                        <Link
                            key={menu.name}
                            href={menu.route}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl mb-2 hover:bg-[#0057B8] transition-all duration-200"
                        >
                            <Icon size={22} />

                            <span className="font-medium">
                                {menu.name}
                            </span>

                        </Link>
                    );
                })}

            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-700">

                <Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-3 bg-red-500 hover:bg-red-600 rounded-xl px-4 py-3 justify-center transition"
                >
                    <LogOut size={20} />

                    Logout

                </Link>

            </div>

        </aside>
    );
}