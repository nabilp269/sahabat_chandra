import { useState, useEffect, useRef, useMemo } from "react";
import { useForm, router, Link } from "@inertiajs/react";
import Modal from "../Modal";
import {
    Send,
    Paperclip,
    X,
    Bell,
    MessageCircle,
    ArrowRight,
} from "lucide-react";

export default function NotificationModal({
    show,
    onClose,
    messages = [],
    notifications = [],
}) {

    const [tab, setTab] = useState("notification");
    const [preview, setPreview] = useState(null);

    const chatRef = useRef(null);
    const bottomRef = useRef(null);

    const {
        data,
        setData,
        post,
        processing,
        reset,
    } = useForm({
        message: "",
        image: null,
    });

    /*
    |--------------------------------------------------------------------------
    | Urutkan chat lama -> baru
    |--------------------------------------------------------------------------
    */

    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });
    }, [messages]);

    /*
    |--------------------------------------------------------------------------
    | Reload forum tiap 3 detik
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!show) return;
        if (tab !== "forum") return;

        const interval = setInterval(() => {
            router.reload({
                only: ["messages"],
                preserveState: true,
                preserveScroll: true,
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [show, tab]);

    /*
    |--------------------------------------------------------------------------
    | Auto scroll ke bawah
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!show) return;
        if (tab !== "forum") return;

        setTimeout(() => {
            bottomRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        }, 100);
    }, [sortedMessages, tab, show]);

    /*
    |--------------------------------------------------------------------------
    | Kirim Pesan
    |--------------------------------------------------------------------------
    */

    const submit = (e) => {
        e.preventDefault();

        if (data.message.trim() === "" && !data.image) {
            return;
        }

        post(route("forum.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset("message", "image");
                setPreview(null);
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="w-full max-w-md h-[78vh] bg-white rounded-[28px] overflow-hidden flex flex-col">
                {/* HEADER */}
                <div className="bg-gradient-to-r from-[#0057B8] to-[#0F6FFF] px-5 h-20 flex items-center justify-between text-white">
                    <div>
                        <h2 className="font-bold text-lg">
                            Sahabat Chandra
                        </h2>
                        <p className="text-xs opacity-80">
                            Forum Komunitas
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 rounded-full hover:bg-white/20 flex items-center justify-center transition"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* TAB */}
                <div className="flex bg-white border-b">
                    <button
                        onClick={() => setTab("notification")}
                        className={`flex-1 h-12 flex items-center justify-center gap-2 font-semibold text-sm transition ${
                            tab === "notification"
                                ? "text-[#0057B8] border-b-2 border-[#0057B8]"
                                : "text-gray-500"
                        }`}
                    >
                        <Bell size={16} />
                        Notifikasi
                    </button>

                    <button
                        onClick={() => setTab("forum")}
                        className={`flex-1 h-12 flex items-center justify-center gap-2 font-semibold text-sm transition ${
                            tab === "forum"
                                ? "text-[#0057B8] border-b-2 border-[#0057B8]"
                                : "text-gray-500"
                        }`}
                    >
                        <MessageCircle size={16} />
                        Forum
                    </button>
                </div>

                {/* ======================= NOTIFIKASI ======================= */}
                {tab === "notification" ? (
                    <div className="flex-1 overflow-y-auto bg-[#F5F7FB] p-4">
                        {notifications.length > 0 ? (
                            <div className="space-y-3">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-[#0057B8]">
                                                    {notif.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                                                    {notif.message}
                                                </p>
                                            </div>
                                            <Bell
                                                size={18}
                                                className="text-[#0057B8]"
                                            />
                                        </div>
                                        <div className="mt-3 text-right text-xs text-gray-400">
                                            {new Date(
                                                notif.created_at
                                            ).toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Bell
                                    size={55}
                                    className="mb-4 opacity-40"
                                />
                                <p className="font-semibold">
                                    Belum ada notifikasi
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ======================= FORUM ======================= */
                    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-6">
                        <div className="text-center">
                            <MessageCircle size={64} className="mx-auto text-blue-600 mb-4 opacity-80" />
                            <h3 className="font-bold text-lg text-slate-800 mb-2">
                                Forum Komunitas
                            </h3>
                            <p className="text-sm text-slate-600 mb-6">
                                Bagikan pengalaman dan berita Anda dengan komunitas Sahabat Chandra
                            </p>
                            <Link
                                href={route("forum.index")}
                                onClick={onClose}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition"
                            >
                                Buka Forum Lengkap
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
