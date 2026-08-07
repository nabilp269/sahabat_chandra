// import { Bell, Sparkles } from "lucide-react";
// import { useState } from "react";
// import NotificationModal from "@/Components/Popup/NotificationModal";

// export default function Navbar({
//     messages = [],
//     notifications = [],
// }) {
//     const [showNotification, setShowNotification] = useState(false);

//     return (
//         <>
//             <header className="sticky top-0 z-40 w-full bg-gradient-to-br from-[#00428c] via-[#0057B8] to-[#0165fb] rounded-b-[2rem] shadow-[0_12px_40px_-12px_rgba(15,111,255,0.6)] border-b border-white/10 overflow-hidden">
//                 {/* Modern subtle ambient glow effects in the background */}
//                 <div className="absolute inset-0 pointer-events-none">
//                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
//                     <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
//                 </div>

//                 <div className="relative flex items-center justify-between px-6 pt-12 pb-7">

//                     <div className="flex items-center gap-3 cursor-pointer group">
                 
//                         <div className="flex flex-col">
//                             <h2 className="text-white text-2xl font-extrabold tracking-tight drop-shadow-md">
//                                 Sahabat Chandra
//                             </h2>
//                             <p className="text-blue-100 text-[10px] font-semibold opacity-90 tracking-widest mt-0.5">
//                                 SELAMAT DATANG KEMBALI
//                             </p>
//                         </div>
//                     </div>

//                     <button
//                         onClick={() => setShowNotification(true)}
//                         className="relative p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
//                     >
//                         <Bell size={22} className="drop-shadow-md" />

//                         {notifications.length > 0 && (
//                             <>
//                                 <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-[#0057B8] shadow-sm z-10 transition-transform"></span>
//                                 <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-400 animate-ping opacity-80"></span>
//                             </>
//                         )}
//                     </button>

//                 </div>

//             </header>

//             <NotificationModal
//                 show={showNotification}
//                 onClose={() => setShowNotification(false)}
//                 messages={messages}
//                 notifications={notifications}
//             />
//         </>
//     );
// }

import { Bell, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import NotificationModal from "@/Components/Popup/NotificationModal";

export default function Navbar({
    messages = [],
    notifications = [],
}) {
    const [showNotification, setShowNotification] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const menus = [
        {
            name: "Dashboard",
            route: route("dashboard"),
        },
        {
            name: "Lokasi",
            route: route("location"),
        },
        {
            name: "Riwayat",
            route: route("history"),
        },
        {
            name: "Profil",
            route: route("profile"),
        },
    ];

    return (
        <>
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">

                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* Logo */}
                    <Link
                        href={route("dashboard")}
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#0057B8] flex items-center justify-center text-white font-bold text-lg shadow">
                            SC
                        </div>

                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                Sahabat Chandra
                            </h1>

                            <p className="text-xs text-gray-500">
                                Money Transfer
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    {!isMobile && (
                        <nav className="flex items-center gap-8">

                            {menus.map((menu) => (
                                <Link
                                    key={menu.name}
                                    href={menu.route}
                                    className="text-gray-600 hover:text-[#0057B8] font-medium transition"
                                >
                                    {menu.name}
                                </Link>
                            ))}

                        </nav>
                    )}

                    {/* Right */}
                    <div className="flex items-center gap-3">

                        <button
                            onClick={() => setShowNotification(true)}
                            className="relative w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                        >
                            <Bell size={20} />

                            {notifications.length > 0 && (
                                <>
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                                </>
                            )}
                        </button>

                        <div className="hidden sm:flex md:hidden">
                            <button
                                onClick={() => setMobileMenu(!mobileMenu)}
                                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                            >
                                {mobileMenu ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>

                    </div>

                </div>

                {/* Mobile Menu */}
                {isMobile && mobileMenu && (

                    <div className="border-t bg-white">

                        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col">

                            {menus.map((menu) => (
                                <Link
                                    key={menu.name}
                                    href={menu.route}
                                    onClick={() =>
                                        setMobileMenu(false)
                                    }
                                    className="py-3 text-gray-700 hover:text-[#0057B8] font-medium"
                                >
                                    {menu.name}
                                </Link>
                            ))}

                        </div>

                    </div>

                )}

            </header>

            <NotificationModal
                show={showNotification}
                onClose={() => setShowNotification(false)}
                messages={messages}
                notifications={notifications}
            />
        </>
    );
}