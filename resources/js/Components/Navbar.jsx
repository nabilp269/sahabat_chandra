import { Bell, Sparkles } from "lucide-react";
import { useState } from "react";
import NotificationModal from "@/Components/Popup/NotificationModal";

export default function Navbar({
    messages = [],
    notifications = [],
}) {
    const [showNotification, setShowNotification] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-gradient-to-br from-[#00428c] via-[#0057B8] to-[#0165fb] rounded-b-[2rem] shadow-[0_12px_40px_-12px_rgba(15,111,255,0.6)] border-b border-white/10 overflow-hidden">
                {/* Modern subtle ambient glow effects in the background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                </div>

                <div className="relative flex items-center justify-between px-6 pt-12 pb-7">

                    <div className="flex items-center gap-3 cursor-pointer group">
                        {/* <div className="flex items-center justify-center w-10 h-10 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                            <Sparkles className="text-white w-5 h-5 drop-shadow-sm" />
                        </div> */}
                        <div className="flex flex-col">
                            <h2 className="text-white text-2xl font-extrabold tracking-tight drop-shadow-md">
                                Sahabat Chandra
                            </h2>
                            <p className="text-blue-100 text-[10px] font-semibold opacity-90 tracking-widest mt-0.5">
                                SELAMAT DATANG KEMBALI
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowNotification(true)}
                        className="relative p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        <Bell size={22} className="drop-shadow-md" />

                        {notifications.length > 0 && (
                            <>
                                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-[#0057B8] shadow-sm z-10 transition-transform"></span>
                                <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-400 animate-ping opacity-80"></span>
                            </>
                        )}
                    </button>

                </div>

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