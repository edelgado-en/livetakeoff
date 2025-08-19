import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog } from "@headlessui/react";

const ExclamationTriangle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6 text-amber-600"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

type Props = {
  isOpen: boolean,
  handleClose: () => void,
  handleExport: () => void,
};

const ExportJobModal = ({ isOpen, handleClose, handleExport }: Props) => {
  return (
    <ModalFrame isModalOpen={isOpen} onClose={handleClose}>
      <div className="pt-2">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-50 sm:mx-0">
            <ExclamationTriangle />
          </div>

          <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-xl font-semibold leading-6 text-gray-900"
            >
              Start export
            </Dialog.Title>

            <div className="mt-3">
              <p className="text-md text-gray-600">
                We’ll queue your export using the filters currently applied. The
                export runs in the background so you can keep working.
              </p>

              <ul className="mt-4 space-y-2 text-md text-gray-600">
                <li>• You’ll receive an email when your file is ready.</li>
                <li>
                  • Track progress anytime in{" "}
                  <span className="font-medium">Exports</span>.
                </li>
                <li>• Large exports may take several minutes.</li>
              </ul>

              <div className="mt-4 rounded-md bg-gray-100 p-3 text-sm text-gray-500">
                Tip: You can continue browsing jobs while this runs.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-5 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex w-full justify-center rounded-md bg-red-600
                     px-4 py-2 text-md font-semibold text-white shadow-sm hover:bg-red-700
                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto"
          >
            Start export
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="mt-3 inline-flex w-full justify-center rounded-md border
                     border-gray-300 bg-white px-4 py-2 text-md font-medium
                      text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                       focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalFrame>
  );
};

export default ExportJobModal;
