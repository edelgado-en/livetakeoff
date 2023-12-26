import { useState, useEffect } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Transition } from "@headlessui/react";

import * as api from "./apiService";

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

const JobCompleteModal = ({ isOpen, handleClose, completeJob, jobDetails }) => {
  const [loading, setLoading] = useState(true);
  const [otherPMsWorkingOnIt, setOtherPMsWorkingOnIt] = useState(false);
  const [photosCount, setPhotosCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [minutesWorked, setMinutesWorked] = useState(0);

  useEffect(() => {
    canCompleteJob();
  }, []);

  // get the non-customer provided photos count for this job
  // check if there are other project managers assigned to this job
  // make api call to see if job can be completed: /jobs/can-complete/{jobId}
  const canCompleteJob = async () => {
    try {
      const { data } = await api.canCompleteJob(jobDetails.id);

      setOtherPMsWorkingOnIt(data.other_pms_working_on_it);
      setPhotosCount(data.photos_count);
      setIsAdmin(data.is_admin);
      setHoursWorked(data.hours);
      setMinutesWorked(data.minutes);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSetNumberOfPeople = (value) => {
    //it can only be a positive number
    if (value >= 0) {
      setNumberOfPeople(value);
    }
  };

  const handleSetHoursWorked = (value) => {
    //it can only be a positive number
    if (value >= 0) {
      //value can only be an integer
      value = Math.floor(value);

      setHoursWorked(value);
    }
  };

  const handleSetMinutesWorked = (value) => {
    //it can only be a positive number
    if (value >= 0 && value < 60) {
      value = Math.floor(value);
      setMinutesWorked(value);
    }
  };

  const handleCompleteJob = () => {
    if (numberOfPeople === 0) {
      alert("Please enter the number of people that worked on this job.");
      return;
    }

    //if numberOfPeople is empty
    if (numberOfPeople === "") {
      alert("Please enter the number of people that worked on this job.");
      return;
    }

    const totalMinutes = hoursWorked * 60 + minutesWorked;
    const totalHours = totalMinutes / 60;
    const laborTime = totalHours * numberOfPeople;

    completeJob("C", hoursWorked, minutesWorked, numberOfPeople, laborTime);
  };

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
              className="text-2xl font-medium leading-6 text-gray-900 relative top-1"
            >
              Complete Job{" "}
              <span className="text-gray-500 text-sm">
                {jobDetails.purchase_order}
              </span>
            </Dialog.Title>

            <div className="mt-4">
              <p className="text-lg text-gray-500 py-3 text-center">
                Completing a job will complete all services associated with it.
                You won't have access to the job after it is completed.
              </p>

              <div
                className=" border-t-2 border-gray-200 my-4"
                style={{ borderTopWidth: "1px" }}
              ></div>

              <h1 className="font-medium text-xl text-gray-500 text-center">
                Time Spent
              </h1>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="flex gap-2 justify-center">
                  <input
                    type="text"
                    value={hoursWorked}
                    onChange={(e) => handleSetHoursWorked(e.target.value)}
                    name="hoursWorked"
                    id="hoursWorked"
                    className="block rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm w-14"
                  />
                  <div className="relative top-1" style={{ top: "6px" }}>
                    hours
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <input
                    type="text"
                    value={minutesWorked}
                    onChange={(e) => handleSetMinutesWorked(e.target.value)}
                    name="minutesWorked"
                    id="minutesWorked"
                    className="block rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm w-14"
                  />
                  <div className="relative top-1" style={{ top: "6px" }}>
                    minutes
                  </div>
                </div>
              </div>

              <div
                className=" border-t-2 border-gray-200 my-4"
                style={{ borderTopWidth: "1px" }}
              ></div>

              <h1 className="font-medium text-xl text-gray-500 text-center">
                How many people worked on this job?
              </h1>

              <div className="mt-3 flex justify-center m-auto w-11/12">
                <input
                  type="text"
                  value={numberOfPeople}
                  onChange={(e) => handleSetNumberOfPeople(e.target.value)}
                  name="numberOfPeople"
                  id="numberOfPeople"
                  className="block rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm w-14"
                />
              </div>

              <div
                className=" border-t-2 border-gray-200 my-4"
                style={{ borderTopWidth: "1px" }}
              ></div>

              {photosCount === 0 && (
                <p className="text-lg text-red-500 py-2 font-medium text-center">
                  There are no closeout photos for this job.
                </p>
              )}

              {!isAdmin && otherPMsWorkingOnIt && (
                <p className="text-lg text-red-500 pb-4 font-medium">
                  You cannot complete the job yet because there are other
                  project managers working on it.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex w-full justify-center rounded-md border
                                 border-gray-300 bg-white px-4 py-2 font-medium
                                  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                   focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto text-lg"
          >
            Cancel
          </button>
          {(isAdmin || !otherPMsWorkingOnIt) && (
            <button
              type="button"
              onClick={() => handleCompleteJob()}
              className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto text-lg"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </ModalFrame>
  );
};

export default JobCompleteModal;
