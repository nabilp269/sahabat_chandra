import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { X, MessageSquare, ArrowRight } from "lucide-react";

export default function ForumNotificationPopup() {
    const [popup, setPopup] = useState(null);

    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.channel("forums");

        channel.listen(".ForumMessageCreated", (e) => {
            const msg = e.message;
            if (!msg) return;

            const dismissedId = localStorage.getItem("forum_dismissed_post_id");
            if (String(msg.id) === dismissedId) return;

            setPopup(msg);
        });

        return () => {
            channel.stopListening(".ForumMessageCreated");
            window.Echo.leave("forums");
        };
    }, []);

    const handleClose = () => {
        if (popup) localStorage.setItem("forum_dismissed_post_id", String(popup.id));
        setPopup(null);
    };

    const handleGoToForum = () => {
        if (popup) localStorage.setItem("forum_dismissed_post_id", String(popup.id));
        fetch(route("forum.mark-seen"), {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content,
                Accept: "application/json",
            },
        });
        setPopup(null);
        router.visit(route("forum.index"));
    };

    if (!popup) return null;

    return (
        <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-80 animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#0057B8] to-[#0F6FFF] px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <MessageSquare size={18} />
                        <span className="font-semibold text-sm">Postingan Baru dari Admin</span>
                    </div>
                    <button onClick={handleClose} className="text-white/80 hover:text-white transition">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-4">
                    {popup.image && (
                        <img
                            src={`/storage/${popup.image}`}
                            alt=""
                            className="w-full h-32 object-cover rounded-xl mb-3"
                        />
                    )}
                    {popup.message && (
                        <p className="text-sm text-slate-700 line-clamp-3">{popup.message}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">
                        {new Date(popup.created_at).toLocaleString("id-ID")}
                    </p>
                </div>

                <div className="px-4 pb-4">
                    <button
                        onClick={handleGoToForum}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                    >
                        Lihat di Forum
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
