import { Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { ChevronRightIcon, BriefcaseIcon } from "@heroicons/react/outline";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

import DeleteScheduleModal from "./DeleteScheduleModal";

import { toast } from "react-toastify";

const MagnifyingGlassIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
};

const JobSchedules = () => {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalSchedules, setTotalSchedules] = useState(0);
  const [isDeleteScheduleModalOpen, setDeleteScheduleModalOpen] =
    useState(false);
  const [scheduleToBeDeleted, setScheduleToBeDeleted] = useState(null);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchSchedules();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchText]);

  const searchSchedules = async () => {
    setLoading(true);

    const request = {
      tailNumber: searchText,
    };

    try {
      const { data } = await api.getJobSchedules(request);

      setSchedules(data.results);
      setTotalSchedules(data.count);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchSchedules();
    }
  };

  const handleToggleDeleteScheduleModal = (schedule) => {
    if (schedule) {
      setScheduleToBeDeleted(schedule);
    } else {
      setScheduleToBeDeleted(null);
    }

    setDeleteScheduleModalOpen(!isDeleteScheduleModalOpen);
  };

  const deleteSchedule = async (schedule) => {
    const request = {
      is_deleted: true,
    };

    await api.updateJobSchedule(schedule.id, request);

    toast.success("Schedule deleted!");

    setDeleteScheduleModalOpen(false);

    searchSchedules();
  };

  return (
    <AnimatedPage>
      <div className="xl:px-16 px-4 m-auto max-w-5xl -mt-3 pb-32">
        <div className="grid grid-cols-2">
          <div className="">
            <h1 className="text-2xl font-semibold text-gray-600">
              Job Schedules
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Total: <span className="text-gray-900">{totalSchedules}</span>
            </p>
          </div>
          <div className="text-right">
            <Link to="/create-schedule">
              <button
                type="button"
                className="inline-flex items-center justify-center 
                                        rounded-md border border-transparent bg-red-600 px-4 py-2
                                        text-sm font-medium text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500
                                        focus:ring-offset-2 sm:w-auto"
              >
                New Schedule
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full mt-4">
          <div className="relative border-b border-gray-200">
            <div
              onClick={() => searchSchedules()}
              className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
            >
              <MagnifyingGlassIcon
                className="h-4 w-4 text-gray-400 cursor-pointer"
                aria-hidden="true"
              />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              onKeyDown={handleKeyDown}
              className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                                    focus:ring-sky-500 text-sm"
              placeholder="search by tail"
            />
          </div>
        </div>

        {loading && <Loader />}

        {!loading && schedules.length === 0 && (
          <div className="text-center mt-14 ">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No schedules found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new job schedule.
            </p>
          </div>
        )}

        {!loading && (
          <div className="overflow-hidden bg-white shadow sm:rounded-md mt-2">
            <ul className="divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <li key={schedule.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="w-full grid xl:grid-cols-2 lg:grid-cols-2 md-grid-cols-2 xs:grid-cols-1">
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
                              {schedule?.airport?.initials} -{" "}
                              {schedule?.fbo?.name}
                            </div>
                          </div>
                          <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left">
                            {schedule.status !== "A" && (
                              <p
                                onClick={() =>
                                  handleToggleDeleteScheduleModal(schedule)
                                }
                                className={`cursor-pointer mr-3 inline-flex text-xs text-gray-700 rounded-md py-1 px-2 border b-gray-700 hover:bg-gray-100`}
                              >
                                Delete
                              </p>
                            )}
                            <p
                              className={`inline-flex text-xs text-white rounded-md py-1 px-2 font-medium
                                                                ${
                                                                  schedule.is_recurrent &&
                                                                  "bg-green-400 "
                                                                }
                                                                ${
                                                                  !schedule.is_recurrent &&
                                                                  "bg-blue-500 "
                                                                }

                                                                `}
                            >
                              {schedule.is_recurrent && "Recurrent"}
                              {!schedule.is_recurrent && "One Time"}
                            </p>
                            <div className="flex -space-x-1 overflow-hidden justify-start xl:justify-end lg:justify-end md:justify-end mt-2">
                              {schedule?.requested_by?.profile?.avatar && (
                                <img
                                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                  src={schedule?.requested_by?.profile?.avatar}
                                  alt="requested by"
                                />
                              )}
                              <div
                                className="text-gray-500 text-sm relative top-1"
                                style={{ marginLeft: "6px" }}
                              >
                                {schedule?.requested_by?.username}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 mt-2 flex-col xl:justify-end xs:justify-start">
                              Starts on: {schedule.start_date}
                              {schedule.is_recurrent && (
                                <div>
                                  Repeats every {schedule.repeat_every} days
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <Link
                        to={`/schedules/${schedule.id}`}
                        className="ml-5 flex-shrink-0"
                      >
                        <ChevronRightIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Link> */}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isDeleteScheduleModalOpen && (
          <DeleteScheduleModal
            isOpen={isDeleteScheduleModalOpen}
            handleClose={handleToggleDeleteScheduleModal}
            deleteSchedule={deleteSchedule}
            schedule={scheduleToBeDeleted}
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default JobSchedules;
