import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog } from "@headlessui/react";
import ReactTimeAgo from "react-time-ago";

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

const DeleteScheduleModal = ({
  isOpen,
  handleClose,
  deleteSchedule,
  schedule,
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
              className="text-lg font-medium leading-6 text-gray-900 relative top-1 flex flex-col"
            >
              Delete Schedule
            </Dialog.Title>

            <div className="mt-8 mb-2">
              <div>
                <div className="">
                  <span className="font-medium text-red-600 text-sm">
                    {schedule.tailNumber}
                  </span>
                  <span className="text-sm">
                    {" "}
                    - {schedule?.aircraftType?.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {schedule.created_at}
                  </span>
                </div>

                <div className="text-sm text-gray-800 mt-2 flex gap-1">
                  {schedule.customer?.name}
                </div>

                <div className="mt-2 text-sm text-gray-500 mb-1">
                  {schedule.airport?.initials} - {schedule.fbo?.name}
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
        <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => deleteSchedule(schedule)}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                             bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="mt-3 inline-flex w-full justify-center rounded-md border
                                 border-gray-300 bg-white px-4 py-2 text-base font-medium
                                  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                   focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalFrame>
  );
};

export default DeleteScheduleModal;
