import { Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    MessageCircle,
    Bell,
    MapPin,
    Users,
    CreditCard,
    LogOut,
} from "lucide-react";

export default function AdminLayout({ children }) {
    const page = usePage();

    const auth = page.props.auth ?? {};

    const user = auth.user ?? {
        name: "Admin",
        email: "",
    };

    const menus = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            route: "admin.dashboard",
        },
        {
            title: "Forum",
            icon: MessageCircle,
            route: "admin.forum",
        },
        {
            title: "Notifikasi",
            icon: Bell,
            route: "notification.index",
        },
        {
            title: "Cabang",
            icon: MapPin,
            route: "branch.index",
        },
        {
            title: "Transaksi",
            icon: CreditCard,
            route: "admin.transaction.index",
        },
        {
            title: "User",
            icon: Users,
            route: "users.index",
        },
    ];

    return (
        <div className="bg-gray-100 min-h-screen">

            {/* Sidebar */}
            <aside className="fixed top-0 left-0 w-72 h-screen bg-[#0057B8] text-white flex flex-col overflow-y-auto shadow-xl z-50">

                {/* Logo */}
                <div className="p-8 border-b border-blue-400">
                    <h1 className="text-2xl font-bold">
                        Sahabat Chandra
                    </h1>

                    <p className="text-blue-100 mt-1">
                        Admin Panel
                    </p>
                </div>

                {/* Menu */}
                <div className="flex-1 py-6">
                    {menus.map((menu) => {
                        const Icon = menu.icon;

                        return (
                            <Link
                                key={menu.route}
                                href={route(menu.route)}
                                className={`flex items-center gap-4 px-8 py-4 transition-all duration-200 hover:bg-blue-700 ${
                                    route().current(menu.route)
                                        ? "bg-blue-800"
                                        : ""
                                }`}
                            >
                                <Icon size={22} />

                                <span className="font-medium">
                                    {menu.title}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* User */}
                <div className="border-t border-blue-400 p-6">

                    <div className="mb-5">

                        <h3 className="font-semibold">
                            {user.name}
                        </h3>

                        <p className="text-sm text-blue-100">
                            {user.email}
                        </p>

                    </div>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 transition"
                    >
                        <LogOut size={18} />

                        Logout
                    </Link>

                </div>

            </aside>

            {/* Content */}
            <main className="ml-72 min-h-screen p-8 overflow-x-hidden">
                {children}
            </main>

        </div>
    );
}