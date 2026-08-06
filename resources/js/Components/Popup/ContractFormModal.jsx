import Modal from "../Modal";

export default function ContractFormModal({ show, onClose }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="bg-white rounded-3xl p-6">

                {/* Header */}
                <div className="flex justify-between items-center">

                    <h2 className="text-2xl font-bold text-blue-900">
                        Formulir Perjanjian Kontra
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-3xl font-bold text-gray-700 hover:text-red-500"
                    >
                        ×
                    </button>

                </div>

                <hr className="my-5" />

                {/* Preview Form */}
                <div className="border-2 border-gray-300 rounded-2xl h-52 flex items-center justify-center bg-gray-50">

                    <span className="text-gray-500">
                        Gambar Formulir
                    </span>

                </div>

                {/* Tombol */}
                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-cyan-500 text-white font-semibold"
                >
                    Tutup
                </button>

            </div>
        </Modal>
    );
}