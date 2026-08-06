import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import ContractFormModal from "@/Components/Popup/ContractFormModal";

import {
    User,
    Mail,
    Phone,
    FileText,
    LogOut,
    ChevronRight,
    ShieldCheck,
    CreditCard,
    Upload,
} from "lucide-react";

const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center gap-4">
        <div className="bg-gray-100 p-3 rounded-xl shrink-0">{icon}</div>

        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <h3 className="font-semibold">{value}</h3>
        </div>
    </div>
);

const MenuItem = ({ onClick, href, children, danger = false }) => {
    const base = "w-full flex justify-between items-center p-5 border-b hover:bg-gray-50 transition";
    return href ? (
        <Link href={href} className={base + (danger ? " text-red-600" : "")}>
            {children}
            <ChevronRight />
        </Link>
    ) : (
        <button onClick={onClick} className={base + (danger ? " text-red-600" : "") } aria-label="menu item">
            {children}
            <ChevronRight />
        </button>
    );
};

export default function Profile({
    user,
    messages = [],
    notifications = [],
}) {

    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing } = useForm({
        identity_type: user.identity_type || "",
        identity_number: user.identity_number || "",
        identity_photo: null,
    });

    const [preview, setPreview] = useState(
        user.identity_photo
            ? `/storage/${user.identity_photo}`
            : null
    );

    const submitIdentity = (e) => {

        e.preventDefault();

        post(route("profile.identity"));

    };

    return (
        <>

            <Head title="Profil" />

            <AppLayout messages={messages} notifications={notifications}>
                <div className="max-w-3xl mx-auto px-4 pt-6">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#0057B8] to-[#0F6FFF] rounded-3xl p-6 text-white shadow-lg">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-white text-[#0057B8] flex items-center justify-center text-3xl font-bold shadow" aria-hidden>
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>

                            <div>
                                <h1 className="text-xl font-bold">{user.name}</h1>
                                <p className="text-blue-100">Nasabah Aktif</p>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Akun */}
                    <div className="bg-white rounded-2xl shadow mt-6 p-5">
                        <h2 className="font-bold text-lg mb-5">Informasi Akun</h2>

                        <div className="space-y-4">
                            <InfoRow icon={<User className="text-blue-600" />} label="Nama" value={user.name} />
                            <InfoRow icon={<Mail className="text-green-600" />} label="Email" value={user.email} />
                            <InfoRow icon={<Phone className="text-yellow-600" />} label="Nomor HP" value={user.phone ?? "-"} />
                        </div>
                    </div>

                        

{/* Menu */}
<div className="bg-white rounded-2xl shadow mt-6">
    <MenuItem onClick={() => setShowForm(true)}>
        <div className="flex items-center gap-3">
            <FileText className="text-blue-600" />
            <span>Formulir</span>
        </div>
    </MenuItem>

    <MenuItem href="#">
        <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-600" />
            <span>Keamanan Akun</span>
        </div>
    </MenuItem>

    <Link
        method="post"
        href={route("logout")}
        as="button"
        className="w-full flex justify-between items-center p-5 text-red-600 hover:bg-red-50 transition"
    >
        <div className="flex items-center gap-3">
            <LogOut />
            <span>Keluar</span>
        </div>

        <ChevronRight />
    </Link>
</div>

                    </div>
                </AppLayout>

<ContractFormModal
    show={showForm}
    onClose={() => setShowForm(false)}
/>

</>
);
}   