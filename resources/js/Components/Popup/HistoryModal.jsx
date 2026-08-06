import Modal from "../Modal";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function HistoryModal({

    show,
    onClose,
    branches = [],

}) {

    const [branch, setBranch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const tarikRiwayat = () => {

        router.get(route("history"), {

            branch,
            start_date: startDate,
            end_date: endDate,

        });

    };

    return (

        <Modal
            show={show}
            onClose={onClose}
            maxWidth="2xl"
        >

            <div className="bg-white rounded-3xl p-8">

                {/* HEADER */}

                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-bold text-blue-900">
                        Aktivitas Terakhir
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-3xl text-gray-500 hover:text-red-500"
                    >
                        ×
                    </button>

                </div>

                <hr className="mb-6" />

                <div className="space-y-5">

                    {/* CABANG */}

                    {branches.length > 1 && (

                        <div>

                            <label className="block mb-2 font-semibold">
                                Cabang
                            </label>

                            <select

                                value={branch}

                                onChange={(e) =>
                                    setBranch(e.target.value)
                                }

                                className="w-full rounded-xl border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 outline-none"

                            >

                                <option value="">
                                    Semua Cabang
                                </option>

                                {branches.map((item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>

                                ))}

                            </select>

                        </div>

                    )}

                    {/* TANGGAL */}

                    <div>

                        <label className="block mb-2 font-semibold">
                            Tanggal Mulai
                        </label>

                        <input

                            type="date"

                            value={startDate}

                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }

                            className="w-full rounded-xl border border-gray-300 p-3"

                        />

                    </div>

                    {/* SAMPAI */}

                    <div>

                        <label className="block mb-2 font-semibold">
                            Sampai Tanggal
                        </label>

                        <input

                            type="date"

                            value={endDate}

                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }

                            className="w-full rounded-xl border border-gray-300 p-3"

                        />

                    </div>

                    <button

                        onClick={tarikRiwayat}

                        className="w-full bg-blue-700 hover:bg-blue-800 transition text-white py-3 rounded-xl font-semibold"

                    >
                        Tarik Riwayat
                    </button>

                </div>

            </div>

        </Modal>

    );

}