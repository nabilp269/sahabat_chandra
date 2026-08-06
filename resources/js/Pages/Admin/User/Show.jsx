import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";

export default function Show({ user }) {
    return (
        <AdminLayout>

            <div className="bg-white rounded-2xl shadow p-6 max-w-2xl">

                <h1 className="text-2xl font-bold mb-6">
                    Detail User
                </h1>

                <div className="space-y-4">

                    <div>
                        <label className="font-semibold">
                            Nama
                        </label>

                        <p className="mt-1 border rounded-lg p-3">
                            {user.name}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold">
                            Email
                        </label>

                        <p className="mt-1 border rounded-lg p-3">
                            {user.email}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold">
                            No. Telepon
                        </label>

                        <p className="mt-1 border rounded-lg p-3">
                            {user.phone || "-"}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold">
                            Role
                        </label>

                        <p className="mt-1 border rounded-lg p-3">
                            {user.role}
                        </p>
                    </div>

                    <div>
                        <label className="font-semibold">
                            Terdaftar
                        </label>

                        <p className="mt-1 border rounded-lg p-3">
                            {new Date(user.created_at).toLocaleString("id-ID")}
                        </p>
                    </div>

                </div>

                <div className="mt-6">

                    <Link
                        href={route("users.index")}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Kembali
                    </Link>

                </div>

            </div>

        </AdminLayout>
    );
}