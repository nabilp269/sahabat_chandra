import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Swal from "sweetalert2";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    // Ambil pesan error pertama yang tersedia, tidak peduli key-nya apa
    // (login, email, password, dst). Backend Laravel sering mengembalikan
    // error di key "email" walau field di form namanya "login".
    const firstErrorMessage = () => {
        const values = Object.values(errors || {});
        return values.length > 0 ? values[0] : "Email / Nomor HP atau Password salah.";
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            preserveScroll: true,
            preserveState: true,

            onError: (errors) => {
                console.log("LOGIN ERROR", errors); // sementara, buat debug. hapus kalau sudah fix

                Swal.fire({
                    icon: "error",
                    title: "Login Gagal",
                    text: Object.values(errors)[0] ?? "Email / Nomor HP atau Password salah.",
                    confirmButtonColor: "#d33",
                });
            },

            onFinish: () => {
                reset("password");
            },
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-6 sm:py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0D3B8E] text-white flex items-center justify-center mx-auto text-3xl sm:text-4xl font-extrabold shadow-md">
                            SC
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D3B8E] mt-4">
                            Sahabat Chandra
                        </h1>

                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            Masuk menggunakan Email atau Nomor HP
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 rounded-xl bg-green-100 text-green-700 px-4 py-3 text-sm">
                            {status}
                        </div>
                    )}

                    <form
                        onSubmit={submit}
                        className="bg-white rounded-3xl shadow-xl p-6 sm:p-8"
                    >
                        <label className="text-sm font-semibold text-gray-700">
                            Email / Nomor HP
                        </label>

                        <div className="mt-2 flex items-center border border-gray-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-[#0D3B8E]">
                            <FiUser className="text-gray-400 text-lg mr-2" />

                            <input
                                type="text"
                                required
                                autoFocus
                                autoComplete="username"
                                className="w-full py-3 px-2 outline-none text-sm"
                                placeholder="Masukkan Email atau Nomor HP"
                                value={data.login}
                                onChange={(e) =>
                                    setData("login", e.target.value)
                                }
                            />
                        </div>

                        {/* Tampilkan error dari key manapun yang berkaitan dengan login/email/phone */}
                        {(errors.login || errors.email || errors.phone) && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.login || errors.email || errors.phone}
                            </p>
                        )}

                        <label className="text-sm font-semibold text-gray-700 mt-5 block">
                            Password
                        </label>

                        <div className="mt-2 flex items-center border border-gray-200 rounded-xl px-3 focus-within:ring-2 focus-within:ring-[#0D3B8E]">
                            <FiLock className="text-gray-400 text-lg mr-2" />

                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                className="w-full py-3 px-2 outline-none text-sm"
                                placeholder="Masukkan Password"
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
                                className="text-gray-500 ml-2 p-2"
                            >
                                {showPassword ? (
                                    <FiEyeOff className="text-lg" />
                                ) : (
                                    <FiEye className="text-lg" />
                                )}
                            </button>
                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.password}
                            </p>
                        )}

                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData(
                                            "remember",
                                            e.target.checked
                                        )
                                    }
                                />
                                Ingat Saya
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Lupa Password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-6 bg-[#0D3B8E] hover:bg-blue-900 text-white py-3.5 rounded-xl font-semibold"
                        >
                            {processing ? "Memproses..." : "Masuk"}
                        </button>

                        <div className="text-center mt-6 text-sm text-gray-600">
                            Belum punya akun?

                            <Link
                                href={route("register")}
                                className="ml-1 font-semibold text-[#0D3B8E] hover:underline"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}