// import { Link, usePage } from "@inertiajs/react";
// import { FaHome, FaMapMarkerAlt, FaUser } from "react-icons/fa";

// export default function BottomNavigation() {
//     const { url } = usePage();

//     const menus = [
//         {
//             name: "Beranda",
//             href: "/dashboard",
//             icon: FaHome,
//         },
//         {
//             name: "Lokasi",
//             href: "/location",
//             icon: FaMapMarkerAlt,
//         },
//         {
//             name: "Profil",
//             href: "/profile",
//             icon: FaUser,
//         },
//     ];

//     return (
//         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
//             <div className="relative bg-white/70 backdrop-blur-2xl rounded-full shadow-[0_12px_45px_-12px_rgba(0,0,0,0.2)] border border-white p-1.5">

//                 {/* Optional inner subtle glow */}
//                 <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent rounded-full pointer-events-none"></div>

//                 <div className="relative flex items-center justify-between px-1">
//                     {menus.map((menu) => {
//                         const Icon = menu.icon;
//                         const active = url === menu.href;

//                         return (
//                             <Link
//                                 key={menu.href}
//                                 href={menu.href}
//                                 className={`group flex items-center justify-center transition-all duration-500 ease-out ${active
//                                         ? "h-[50px] px-6 bg-gradient-to-r from-[#00428c] to-[#0165fb] text-white rounded-full shadow-[0_8px_20px_-6px_rgba(1,101,251,0.6)]"
//                                         : "h-[50px] w-[50px] rounded-full text-slate-400 hover:bg-slate-100/80 hover:text-[#0057B8] hover:scale-105 active:scale-95"
//                                     }`}
//                             >
//                                 <Icon
//                                     size={20}
//                                     className={`transition-all duration-300 ${active ? 'scale-110 drop-shadow-md' : 'group-hover:-translate-y-1 group-hover:scale-110'}`}
//                                 />

//                                 {active && (
//                                     <span className="ml-2.5 font-bold text-[13px] tracking-wide whitespace-nowrap drop-shadow-sm">
//                                         {menu.name}
//                                     </span>
//                                 )}
//                             </Link>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// }

import { Link, usePage } from "@inertiajs/react";
import {
    FaHome,
    FaMapMarkerAlt,
    FaUser,
    FaHistory,
    FaComments,
} from "react-icons/fa";

export default function BottomNavigation() {
    const { url } = usePage();

    const menus = [
        {
            name: "Beranda",
            href: route("dashboard"),
            icon: FaHome,
        },
        {
            name: "Forum",
            href: route("forum.index"),
            icon: FaComments,
        },
        {
            name: "Lokasi",
            href: route("location"),
            icon: FaMapMarkerAlt,
        },
        {
            name: "Riwayat",
            href: route("history"),
            icon: FaHistory,
        },
        {
            name: "Profil",
            href: route("profile"),
            icon: FaUser,
        },
    ];

    return (
        <>
            {/* Bottom Navigation hanya untuk Mobile */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">

                <div className="bg-white border-t border-gray-200 shadow-lg">

                    <div className="grid grid-cols-5 h-16">

                        {menus.map((menu) => {
                            const Icon = menu.icon;

                            const active =
                                url === new URL(menu.href).pathname;

                            return (
                                <Link
                                    key={menu.name}
                                    href={menu.href}
                                    className={`flex flex-col items-center justify-center transition ${
                                        active
                                            ? "text-[#0057B8] font-semibold"
                                            : "text-gray-500 hover:text-[#0057B8]"
                                    }`}
                                >
                                    <Icon size={20} />

                                    <span className="text-[11px] mt-1">
                                        {menu.name}
                                    </span>
                                </Link>
                            );
                        })}

                    </div>

                </div>

            </div>
        </>
    );
}