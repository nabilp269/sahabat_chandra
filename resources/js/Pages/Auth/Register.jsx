import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import {
    FiUser,
    FiMail,
    FiPhone,
    FiLock,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";
import Swal from "sweetalert2";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            preserveScroll: true,

            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Registrasi Berhasil",
                    text: "Data berhasil disimpan.",
                    confirmButtonColor: "#0057B8",
                });
            },

            onError: (errors) => {
                // Debug sementara — lihat di console browser (F12) key error
                // apa yang sebenarnya dikirim backend. Hapus setelah fix.
                console.log("REGISTER ERROR", errors);

                // Ambil pesan error pertama dari key manapun, jangan cuma
                // name/email/phone/password saja, supaya tidak ada error
                // yang "hilang" kalau backend kirim key lain.
                const pesan =
                    Object.values(errors)[0] ??
                    "Silakan periksa kembali data Anda.";

                Swal.fire({
                    icon: "error",
                    title: "Registrasi Gagal",
                    text: pesan,
                    confirmButtonColor: "#d33",
                });
            },

            onFinish: () => {
                reset("password", "password_confirmation");
            },
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-6">
                <div className="w-full max-w-md">

                    <div className="text-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-[#0D3B8E] text-white flex items-center justify-center mx-auto text-3xl font-bold">
                            SC
                        </div>

                        <h1 className="text-3xl font-bold text-[#0D3B8E] mt-4">
                            Sahabat Chandra
                        </h1>

                        <p className="text-gray-500">
                            Buat akun baru
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="bg-white rounded-3xl shadow-xl p-8"
                    >
                        <label className="font-semibold">
                            Nama Lengkap
                        </label>

                        <div className="mt-2 flex items-center border rounded-xl px-3">
                            <FiUser className="mr-2 text-gray-400" />

                            <input
                                type="text"
                                required
                                className="w-full py-3 outline-none"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </div>

                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name}
                            </p>
                        )}

                        <label className="font-semibold block mt-4">
                            Email
                        </label>

                        <div className="mt-2 flex items-center border rounded-xl px-3">
                            <FiMail className="mr-2 text-gray-400" />

                            <input
                                type="email"
                                required
                                className="w-full py-3 outline-none"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </div>

                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email}
                            </p>
                        )}

                        <label className="font-semibold block mt-4">
                            Nomor HP
                        </label>

                        <div className="mt-2 flex items-center border rounded-xl px-3">
                            <FiPhone className="mr-2 text-gray-400" />

                            <input
                                type="text"
                                required
                                className="w-full py-3 outline-none"
                                value={data.phone}
                                onChange={(e) =>
                                    setData("phone", e.target.value)
                                }
                            />
                        </div>

                        {errors.phone && (
                            <p className="text-red-500 text-sm">
                                {errors.phone}
                            </p>
                        )}

                        <label className="font-semibold block mt-4">
                            Password
                        </label>

                        <div className="mt-2 flex items-center border rounded-xl px-3">
                            <FiLock className="mr-2 text-gray-400" />

                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full py-3 outline-none"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-sm">
                                {errors.password}
                            </p>
                        )}

                        <label className="font-semibold block mt-4">
                            Konfirmasi Password
                        </label>

                        <div className="mt-2 flex items-center border rounded-xl px-3">
                            <FiLock className="mr-2 text-gray-400" />

                            <input
                                type={
                                    showPasswordConfirm
                                        ? "text"
                                        : "password"
                                }
                                required
                                className="w-full py-3 outline-none"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswordConfirm(
                                        !showPasswordConfirm
                                    )
                                }
                            >
                                {showPasswordConfirm ? (
                                    <FiEyeOff />
                                ) : (
                                    <FiEye />
                                )}
                            </button>
                        </div>

                        {errors.password_confirmation && (
                            <p className="text-red-500 text-sm">
                                {errors.password_confirmation}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-6 bg-[#0D3B8E] text-white py-3 rounded-xl"
                        >
                            {processing
                                ? "Memproses..."
                                : "Daftar"}
                        </button>

                        <div className="text-center mt-5">
                            Sudah punya akun?

                            <Link
                                href={route("login")}
                                className="ml-2 text-[#0D3B8E] font-semibold"
                            >
                                Masuk
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}