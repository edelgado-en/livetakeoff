import { useState, useEffect, Fragment } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Transition, Listbox } from "@headlessui/react";

import { CheckIcon } from "@heroicons/react/outline";

import * as api from "./apiService";

import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ChevronUpDownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

const JobCompleteModal = ({
  isOpen,
  handleClose,
  completeJob,
  jobDetails,
  currentUser,
}) => {
  const [loading, setLoading] = useState(true);
  const [otherPMsWorkingOnIt, setOtherPMsWorkingOnIt] = useState(false);
  const [photosCount, setPhotosCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [hoursWorked, setHoursWorked] = useState(0);
  const [minutesWorked, setMinutesWorked] = useState(0);
  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState();
  const [userSearchText, setUserSearchText] = useState("");

  useEffect(() => {
    canCompleteJob();
  }, []);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [userSearchText]);

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
    if (
      (currentUser.isAdmin ||
        currentUser.isSuperUser ||
        currentUser.isAccountManager) &&
      !userSelected
    ) {
      alert("Please select a user to complete the job on behalf of.");
      return;
    }

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

    completeJob(
      "C",
      hoursWorked,
      minutesWorked,
      numberOfPeople,
      laborTime,
      userSelected
    );
  };

  const searchUsers = async () => {
    const request = {
      name: userSearchText,
      role: "Project Managers",
    };

    try {
      const { data } = await api.searchUsers(request);

      setUsers(data.results);
    } catch (err) {}
  };

  const handleSelectMyself = () => {
    setUserSelected(currentUser);
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2">
        <div className="">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-2xl font-medium text-center flex flex-col gap-y-2 justify-center leading-6 text-gray-900 relative top-1"
            >
              Complete Job
              <div className="text-gray-500 text-sm">
                {jobDetails.purchase_order}
              </div>
            </Dialog.Title>

            <div className="mt-2">
              <p className="text-lg text-gray-500 py-3 text-center">
                Completing a job will complete all services associated with it.
                {!isAdmin && (
                  <span>
                    You won't have access to the job after it is completed.
                  </span>
                )}
              </p>

              {(currentUser.isAdmin ||
                currentUser.isSuperUser ||
                currentUser.isAccountManager) && (
                <div className="mb-4 px-4">
                  <div
                    className=" border-t-2 border-gray-200 my-4"
                    style={{ borderTopWidth: "1px" }}
                  ></div>
                  <h1 className="font-medium text-xl text-gray-500 text-center">
                    Complete the job on behalf of someone else?
                  </h1>
                  <div className="text-md text-gray-500 py-3 text-center">
                    {" "}
                    The job activity will be recorded with the selected user.
                  </div>
                  <div className="mt-1">
                    <Listbox value={userSelected} onChange={setUserSelected}>
                      {({ open }) => (
                        <>
                          <div className="relative mt-1">
                            <Listbox.Button
                              className="relative w-full cursor-default rounded-md border
                                                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                        shadow-sm focus:border-sky-500 focus:outline-none
                                                                        focus:ring-1 focus:ring-sky-500 text-md"
                            >
                              <span className="block truncate">
                                {userSelected
                                  ? userSelected.first_name +
                                    " " +
                                    userSelected.last_name
                                  : "Select user"}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </span>
                            </Listbox.Button>

                            <Transition
                              show={open}
                              as={Fragment}
                              leave="transition ease-in duration-100"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <Listbox.Options
                                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-lg"
                              >
                                <div className="relative">
                                  <div className="sticky top-0 z-20  px-1">
                                    <div className="mt-1 block  items-center">
                                      <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        value={userSearchText}
                                        onChange={(e) =>
                                          setUserSearchText(e.target.value)
                                        }
                                        className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 text-md
                                                                            border-gray-300 rounded-md"
                                      />
                                      <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                        {userSearchText && (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-500 font-bold mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            onClick={() => {
                                              setUserSearchText("");
                                            }}
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        )}
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-500 mr-1"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {users.map((user) => (
                                  <Listbox.Option
                                    key={user.id}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "text-white bg-gray-100"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={user}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <div className="relative flex items-center space-x-3 py-1 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-100 hover:bg-gray-50">
                                          <div className="flex-shrink-0">
                                            <img
                                              className="h-10 w-10 rounded-full"
                                              src={user.avatar}
                                              alt=""
                                            />
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div className="focus:outline-none">
                                              {/* Extend touch target to entire panel */}
                                              <span
                                                className="absolute inset-0"
                                                aria-hidden="true"
                                              />
                                              <p className="text-sm font-medium text-gray-900">
                                                {user.first_name}{" "}
                                                {user.last_name}
                                              </p>
                                              <p className="truncate text-xs text-gray-500">
                                                {user.email
                                                  ? user.email
                                                  : "No email specified"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                        {selected ? (
                                          <span
                                            className={classNames(
                                              active
                                                ? "text-white"
                                                : "text-red-600",
                                              "absolute inset-y-0 right-0 flex items-center pr-4"
                                            )}
                                          >
                                            <CheckIcon
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </>
                      )}
                    </Listbox>
                    <div className="mt-2 ml-2">
                      <div
                        onClick={() => handleSelectMyself()}
                        className="cursor-pointer text-blue-500 text-md"
                      >
                        Select myself
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div
                className=" border-t-2 border-gray-200 my-4 mt-8"
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
                <p className="text-lg text-red-500 pb-4 font-medium text-center">
                  You cannot complete the job yet because there are other
                  project managers working on it.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4">
          {otherPMsWorkingOnIt && (
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
          )}
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
