import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function Modal({ children, show = false, maxWidth = '2xl', closeable = true, onClose = () => {} }) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} onClose={onClose}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
                onClose={close}
            >
                <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <div
                        className={`relative bg-white rounded-lg shadow-lg overflow-auto w-full mx-4 ${maxWidthClass}`}
                        style={{ maxHeight: '95vh' }}
                    >
                        <div className="px-4 py-5 sm:p-6">
                            {children}
                        </div>
                    </div>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
