import { useState, useEffect } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Transition } from "@headlessui/react";

const ExclamationTriangule = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-red-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      />
    </svg>
  );
};

const PricePlanDeleteModal = ({
  isOpen,
  handleClose,
  deletePriceList,
  priceList,
}) => {
  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangule
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-xl font-medium leading-6 text-gray-900 relative top-1"
            >
              Delete Price List
            </Dialog.Title>

            <div className="mt-6 pb-2">
              <div className="text-gray-500 text-lg font-semibold">
                {priceList?.name}
              </div>
              <p className="text-md text-gray-500 py-3">
                Deleting a price list is permanent. All customers using this
                price list will be moved to the default price list.
              </p>
              <p className="text-md text-gray-500 py-3">
                Are you sure you want to delete this price list?
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => deletePriceList(priceList)}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-md"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="mt-3 inline-flex w-full justify-center rounded-md border
                                 border-gray-300 bg-white px-4 py-2 text-base font-medium
                                  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                   focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalFrame>
  );
};

export default PricePlanDeleteModal;
