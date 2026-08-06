import { useState, useEffect, useRef, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import Modal from "../Modal";
import {
    Send,
    Paperclip,
    X,
    Bell,
    MessageCircle,
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

        if (
            data.message.trim() === "" &&
            !data.image
        ) {
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

        <Modal
            show={show}
            onClose={onClose}
            maxWidth="md"
        >

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

<>
    {/* ======================= FORUM ======================= */}

    <div
        ref={chatRef}
        className="flex-1 overflow-y-auto bg-[#ECE5DD] px-4 py-5"
    >

        <div className="space-y-4">

            {sortedMessages.length > 0 ? (

                sortedMessages.map((msg) => (

                    <div
                        key={msg.id}
                        className={`flex ${
                            msg.is_admin
                                ? "justify-start"
                                : "justify-end"
                        }`}
                    >

                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                                msg.is_admin
                                    ? "bg-white rounded-bl-sm"
                                    : "bg-[#DCF8C6] rounded-br-sm"
                            }`}
                        >

                            <div className="font-bold text-[#0057B8] text-sm">

                                {msg.is_admin
                                    ? "Admin"
                                    : msg.user?.name}

                            </div>

                            {msg.message && (

                                <p className="mt-2 text-[15px] whitespace-pre-wrap break-words">

                                    {msg.message}

                                </p>

                            )}

                            {msg.image && (

                                <img
                                    src={`/storage/${msg.image}`}
                                    className="mt-3 rounded-xl w-full max-h-64 object-cover"
                                    alt=""
                                />

                            )}

                            <div className="mt-2 text-right text-[10px] text-gray-400">

                                {new Date(
                                    msg.created_at
                                ).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}

                            </div>

                        </div>

                    </div>

                ))

            ) : (

                <div className="h-full flex flex-col items-center justify-center text-gray-400">

                    <MessageCircle
                        size={55}
                        className="opacity-40 mb-4"
                    />

                    <p>Belum ada percakapan</p>

                </div>

            )}

            <div ref={bottomRef}></div>

        </div>

    </div>

    {preview && (

        <div className="border-t bg-white p-3">

            <img
                src={preview}
                alt=""
                className="w-32 rounded-xl border shadow"
            />

        </div>

    )}

    {/* ======================= INPUT CHAT ======================= */}

<form
    onSubmit={submit}
    className="border-t bg-white px-3 py-3 flex items-end gap-3 flex-shrink-0"
>

    {/* Upload Gambar */}
    <label className="cursor-pointer flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 hover:bg-gray-200 transition">

        <Paperclip
            size={20}
            className="text-gray-600"
        />

        <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {

                const file = e.target.files[0];

                if (!file) return;

                setData("image", file);

                setPreview(
                    URL.createObjectURL(file)
                );

            }}
        />

    </label>

    {/* Input */}
    <input
        type="text"
        value={data.message}
        onChange={(e) =>
            setData("message", e.target.value)
        }
        placeholder="Tulis pesan..."
        className="flex-1 h-11 border border-gray-200 rounded-full px-5 text-sm outline-none focus:ring-2 focus:ring-[#0057B8] focus:border-transparent"
    />

    {/* Tombol Kirim */}
    <button
        type="submit"
        disabled={processing}
        className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
            processing
                ? "bg-gray-300"
                : "bg-[#0057B8] hover:bg-[#00449A]"
        } text-white`}
    >

        <Send size={18} />

    </button>

</form>

</>

)}

</div>

</Modal>

);
}   