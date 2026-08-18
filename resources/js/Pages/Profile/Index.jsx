import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import ContractFormModal from "@/Components/Popup/ContractFormModal";
import { User, Mail, Phone, FileText, LogOut, ChevronRight, ShieldCheck } from "lucide-react";

export default function Profile({ user, messages = [], notifications = [] }) {
    const [showForm, setShowForm] = useState(false);

    const initials = user.name ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() : "U";

    return (
        <>
            <Head title="Profil" />
            <AppLayout messages={messages} notifications={notifications}>
                <div className="max-w-xl mx-auto px-4 pb-10">

                    {/* Hero Card */}
                    <div className="bg-gradient-to-br from-[#0057B8] to-[#0F6FFF] rounded-3xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-5">
                            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold shadow-inner border border-white/30">
                                {initials}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                <p className="text-blue-100 text-sm mt-0.5">{user.email}</p>
                                <span className="inline-block mt-2 bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">
                                    Nasabah Aktif
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Akun */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-5 overflow-hidden">
                        <div className="px-5 pt-5 pb-3">
                            <h2 className="font-bold text-slate-800">Informasi Akun</h2>
                        </div>

                        {[
                            { icon: <User size={18} className="text-blue-600" />, label: "Nama Lengkap", value: user.name },
                            { icon: <Mail size={18} className="text-green-600" />, label: "Email", value: user.email },
                            { icon: <Phone size={18} className="text-yellow-600" />, label: "Nomor HP", value: user.phone ?? "-" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4 border-t border-gray-50">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">{item.label}</p>
                                    <p className="font-semibold text-slate-800 mt-0.5">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Menu */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mt-5 overflow-hidden">
                        <div className="px-5 pt-5 pb-3">
                            <h2 className="font-bold text-slate-800">Pengaturan</h2>
                        </div>

                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full flex items-center justify-between px-5 py-4 border-t border-gray-50 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <FileText size={18} className="text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-slate-800">Formulir</p>
                                    <p className="text-xs text-gray-400">Isi data identitas</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                        </button>

                        <button className="w-full flex items-center justify-between px-5 py-4 border-t border-gray-50 hover:bg-gray-50 transition">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                                    <ShieldCheck size={18} className="text-green-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-slate-800">Keamanan Akun</p>
                                    <p className="text-xs text-gray-400">Ubah password</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                        </button>

                        <Link
                            method="post"
                            href={route("logout")}
                            as="button"
                            className="w-full flex items-center justify-between px-5 py-4 border-t border-gray-50 hover:bg-red-50 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                    <LogOut size={18} className="text-red-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-red-600">Keluar</p>
                                    <p className="text-xs text-red-300">Logout dari akun</p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-red-300" />
                        </Link>
                    </div>

                </div>
            </AppLayout>

            <ContractFormModal show={showForm} onClose={() => setShowForm(false)} />
        </>
    );
}
