import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface IProps {
    isModalOpen: boolean;
    cancelButtonRef: React.MutableRefObject<null>;
    children: React.ReactNode;
}

/**
 * Abstraction to create modal dialogs. You need to pass the children of the modal
 * 
 * @param IProps 
 * @returns the modal frame
 */
const ModalFrame = ({ isModalOpen, cancelButtonRef, children } : IProps) => {
    return (
      <Transition.Root show={isModalOpen} as={Fragment}>
        {/* by setting the onClose to undefined we prevent the modal from closing when clicking outside of it or hitting escape */}
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => undefined}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
  
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end sm:items-center justify-center p-4 text-center sm:p-0 mt-32">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-100"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg
                                      bg-white px-4 pt-5 pb-4 text-left shadow-xl
                                        transition-all sm:my-8 w-full sm:max-w-lg sm:p-6">
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }

export default ModalFrame;