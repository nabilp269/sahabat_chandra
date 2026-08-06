import AdminLayout from "@/Layouts/AdminLayout";
import { useForm } from "@inertiajs/react";

export default function Edit({ user, branches }) {

    const { data, setData, put, processing } = useForm({

        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,

        branches: user.branches
            ? user.branches.map((b) => b.id)
            : [],

    });

    const submit = (e) => {

        e.preventDefault();

        // ensure the PUT target includes the user id
        // route("users.update", user.id) may resolve incorrectly in some setups,
        // so use explicit URL to avoid MethodNotAllowed errors when id is missing
        put(`/admin/users/${user.id}`);

    };

    const toggleBranch = (id) => {

        if (data.branches.includes(id)) {

            setData(
                "branches",
                data.branches.filter((item) => item !== id)
            );

        } else {

            setData(
                "branches",
                [...data.branches, id]
            );

        }

    };

    return (

        <AdminLayout>

            <div className="bg-white rounded-2xl shadow p-6 max-w-3xl">

                <h1 className="text-2xl font-bold mb-6">
                    Edit User
                </h1>

                <form
                    onSubmit={submit}
                    className="space-y-5"
                >

                    {/* Nama */}

                    <div>

                        <label className="font-semibold block mb-2">
                            Nama
                        </label>

                        <input
                            className="w-full border rounded-lg p-3"
                            value={data.name}
                            onChange={(e) =>
                                setData("name", e.target.value)
                            }
                        />

                    </div>

                    {/* Email */}

                    <div>

                        <label className="font-semibold block mb-2">
                            Email
                        </label>

                        <input
                            className="w-full border rounded-lg p-3"
                            value={data.email}
                            onChange={(e) =>
                                setData("email", e.target.value)
                            }
                        />

                    </div>

                    {/* Telepon */}

                    <div>

                        <label className="font-semibold block mb-2">
                            No Telepon
                        </label>

                        <input
                            className="w-full border rounded-lg p-3"
                            value={data.phone}
                            onChange={(e) =>
                                setData("phone", e.target.value)
                            }
                        />

                    </div>

                    {/* Role */}

                    <div>

                        <label className="font-semibold block mb-2">
                            Role
                        </label>

                        <select
                            className="w-full border rounded-lg p-3"
                            value={data.role}
                            onChange={(e) =>
                                setData("role", e.target.value)
                            }
                        >

                            <option value="user">
                                User
                            </option>

                            <option value="admin">
                                Admin
                            </option>

                        </select>

                    </div>

                    {/* MANY TO MANY CABANG */}

                    <div>

                        <label className="font-semibold text-lg block mb-3">
                            Cabang Yang Dapat Diakses
                        </label>

                        <div className="grid grid-cols-2 gap-3">

                            {branches.map((branch) => (

                                <label
                                    key={branch.id}
                                    className="border rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50"
                                >

                                    <input
                                        type="checkbox"
                                        checked={data.branches.includes(branch.id)}
                                        onChange={() =>
                                            toggleBranch(branch.id)
                                        }
                                    />

                                    <div>

                                        <div className="font-semibold">
                                            {branch.name}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {branch.address}
                                        </div>

                                    </div>

                                </label>

                            ))}

                        </div>

                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >

                        {processing
                            ? "Menyimpan..."
                            : "Simpan Perubahan"}

                    </button>

                </form>

            </div>

        </AdminLayout>

    );

}