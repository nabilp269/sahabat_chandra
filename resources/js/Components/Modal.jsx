import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from "@headlessui/react";

export default function Modal({
    children,
    show = false,
    closeable = true,
    onClose = () => {},
}) {
    const close = () => {
        if (closeable) onClose();
    };

    return (
        <Transition show={show}>
            <Dialog
                as="div"
                className="fixed inset-0 z-[9999]"
                onClose={close}
            >
                {/* Background */}
                <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </TransitionChild>

                {/* Modal */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel
                            className="
                                w-full
                                max-w-[420px]
                                max-h-[92vh]
                                bg-white
                                rounded-[28px]
                                shadow-2xl
                                overflow-y-auto
                            "
                        >
                            {children}
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}