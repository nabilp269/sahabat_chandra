import AdminLayout from "@/Layouts/AdminLayout";
import { useForm, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Bell,
    X,
} from "lucide-react";

export default function Index({ notifications = [] }) {

    const [open, setOpen] = useState(false);

    const [editId, setEditId] = useState(null);

    const { data, setData, post, put, reset } = useForm({

        title: "",

        message: "",

    });

    function save(e){

        e.preventDefault();

        if(editId){

            put(route("notification.update", editId),{

                onSuccess(){

                    reset();

                    setOpen(false);

                    setEditId(null);

                }

            });

        }else{

            post(route("notification.store"),{

                onSuccess(){

                    reset();

                    setOpen(false);

                }

            });

        }

    }

    function edit(item){

        setEditId(item.id);

        setData({

            title:item.title,

            message:item.message

        });

        setOpen(true);

    }

    function hapus(id){

        if(confirm("Hapus notifikasi?")){

            router.delete(route("notification.destroy",id));

        }

    }

    return(

        <AdminLayout>

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold">

                        Notifikasi

                    </h1>

                    <p className="text-gray-500">

                        Kelola notifikasi aplikasi

                    </p>

                </div>

                <button

                    onClick={()=>{

                        reset();

                        setEditId(null);

                        setOpen(true);

                    }}

                    className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"

                >

                    <Plus size={18}/>

                    Tambah

                </button>

            </div>

            <div className="bg-white rounded-2xl shadow">

                <table className="w-full">

                    <thead className="border-b">

                        <tr>

                            <th className="p-4 text-left">

                                Judul

                            </th>

                            <th className="p-4 text-left">

                                Pesan

                            </th>

                            <th className="p-4 w-44">

                                Aksi

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {notifications.map(item=>(

                            <tr
                                key={item.id}
                                className="border-b hover:bg-slate-50"
                            >

                                <td className="p-4">

                                    {item.title}

                                </td>

                                <td className="p-4">

                                    {item.message}

                                </td>

                                <td className="p-4">

                                    <div className="flex justify-center gap-2">

                                        <button

                                            onClick={()=>edit(item)}

                                            className="bg-yellow-500 text-white p-2 rounded"

                                        >

                                            <Pencil size={16}/>

                                        </button>

                                        <button

                                            onClick={()=>hapus(item.id)}

                                            className="bg-red-600 text-white p-2 rounded"

                                        >

                                            <Trash2 size={16}/>

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {open && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl w-[600px] p-8">

                        <div className="flex justify-between items-center mb-6">

                            <h2 className="text-2xl font-bold">

                                {editId?"Edit":"Tambah"} Notifikasi

                            </h2>

                            <button

                                onClick={()=>setOpen(false)}

                            >

                                <X/>

                            </button>

                        </div>

                        <form
                            onSubmit={save}
                            className="space-y-5"
                        >

                            <div>

                                <label>

                                    Judul

                                </label>

                                <input

                                    value={data.title}

                                    onChange={(e)=>setData("title",e.target.value)}

                                    className="w-full border rounded-xl p-3"

                                />

                            </div>

                            <div>

                                <label>

                                    Pesan

                                </label>

                                <textarea

                                    rows="5"

                                    value={data.message}

                                    onChange={(e)=>setData("message",e.target.value)}

                                    className="w-full border rounded-xl p-3"

                                />

                            </div>

                            <button

                                className="bg-blue-600 text-white px-6 py-3 rounded-xl"

                            >

                                Simpan

                            </button>

                        </form>

                    </div>

                </div>

            )}

        </AdminLayout>

    );

}