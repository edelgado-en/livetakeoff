import { useState, useEffect, Fragment } from "react";
import {
  Listbox,
  Transition,
  Menu,
  Popover,
  Disclosure,
  Dialog,
} from "@headlessui/react";

import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../userProfile/userSlice";
import { useNavigate, Link } from "react-router-dom";

import ReactTimeAgo from "react-time-ago";

import Loader from "../../../components/loader/Loader";

import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";

import { CheckIcon, PlusIcon } from "@heroicons/react/outline";

import * as api from "./apiService";

const XMarkIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RectangleStack = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-gray-400"
    >
      <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
    </svg>
  );
};

const CheckBadge = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-gray-400"
    >
      <path
        fillRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
};

const sortOptions = [
  { id: "requestDate", name: "Request Date" },
  { id: "completeBy", name: "Complete By" },
  { id: "arrivalDate", name: "Arrival Date" },
];

const availableStatuses = [
  { id: "All", name: "All Open Jobs" },
  { id: "U", name: "Submitted" },
  { id: "A", name: "Confirmed" },
  { id: "S", name: "Assigned" },
  { id: "W", name: "In Progress" },
];

const CustomerHome = () => {
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  const [activities, setActivities] = useState([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  const [tags, setTags] = useState([]);

  const [searchText, setSearchText] = useState(
    localStorage.getItem("searchText") || ""
  );
  const [statusSelected, setStatusSelected] = useState(
    JSON.parse(localStorage.getItem("statusSelected")) || availableStatuses[0]
  );
  const [sortSelected, setSortSelected] = useState(sortOptions[0]);
  const [airports, setAirports] = useState([]);
  const [airportSelected, setAirportSelected] = useState(
    JSON.parse(localStorage.getItem("airportSelected")) || {
      id: "All",
      name: "All",
    }
  );
  const [airportSearchTerm, setAirportSearchTerm] = useState("");

  const [open, setOpen] = useState(false);

  const [activeFilters, setActiveFilters] = useState([]);

  const currentUser = useAppSelector(selectUser);

  const navigate = useNavigate();

  const filteredAirports = airportSearchTerm
    ? airports.filter((item) =>
        item.name.toLowerCase().includes(airportSearchTerm.toLowerCase())
      )
    : airports;

  useEffect(() => {
    getJobActivities();
    getAirports();
  }, []);

  useEffect(() => {
    localStorage.setItem("searchText", searchText);
  }, [searchText]);

  useEffect(() => {
    localStorage.setItem("statusSelected", JSON.stringify(statusSelected));
  }, [statusSelected]);

  useEffect(() => {
    localStorage.setItem("airportSelected", JSON.stringify(airportSelected));
  }, [airportSelected]);

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchJobs();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchText, statusSelected, sortSelected, airportSelected, tags]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchJobs();
    }
  };

  const handleToggleTag = (tag) => {
    const newTags = [...tags];
    const index = newTags.findIndex((item) => item.id === tag.id);
    newTags[index].selected = !newTags[index].selected;

    setTags(newTags);
  };

  const getAirports = async () => {
    const request = {
      open_jobs: true,
      onlyIncludeCustomerJobs: true,
    };

    const { data } = await api.getAirports(request);

    data.results.unshift({ id: "All", name: "All" });

    setAirports(data.results);
  };

  const getTags = async () => {
    const { data } = await api.getTags();
    setTags(data.results);
  };

  const getJobActivities = async () => {
    setActivitiesLoading(true);

    try {
      const { data } = await api.getJobActivities();

      setActivities(data.results);
      setTotalActivities(data.count);

      setActivitiesLoading(false);
    } catch (error) {
      setActivitiesLoading(false);
    }
  };

  const removeActiveFilter = (activeFilterId) => {
    if (activeFilterId === "status") {
      setStatusSelected(availableStatuses[0]);
    } else if (activeFilterId === "searchText") {
      setSearchText("");
    } else if (activeFilterId === "airport") {
      setAirportSelected({ id: "All", name: "All" });
    }

    setActiveFilters(
      activeFilters.filter((filter) => filter.id !== activeFilterId)
    );
  };

  const searchJobs = async () => {
    setLoading(true);

    const request = {
      searchText: localStorage.getItem("searchText"),
      status: JSON.parse(localStorage.getItem("statusSelected")).id,
      sortField: sortSelected.id,
      airport: JSON.parse(localStorage.getItem("airportSelected")).id,
      tags: tags.filter((item) => item.selected).map((item) => item.id),
    };

    let statusName;

    if (request.status === "A") {
      statusName = "Confirmed";
    } else if (request.status === "S") {
      statusName = "Assigned";
    } else if (request.status === "W") {
      statusName = "In Progress";
    } else if (request.status === "U") {
      statusName = "Submitted";
    } else if (request.status === "R") {
      statusName = "Review";
    } else if (request.status === "T") {
      statusName = "Canceled";
    } else if (request.status === "I") {
      statusName = "Invoiced";
    } else if (request.status === "C") {
      statusName = "Complete";
    } else if (request.status === "O") {
      statusName = "All Open Jobs";
    }

    //set active filters
    let activeFilters = [];
    if (request.searchText) {
      activeFilters.push({
        id: "searchText",
        name: request.searchText,
      });
    }

    if (request.status !== "All") {
      activeFilters.push({
        id: "status",
        name: statusName,
      });
    }

    if (request.airport !== "All") {
      activeFilters.push({
        id: "airport",
        name: airportSelected.name,
      });
    }

    setActiveFilters(activeFilters);

    try {
      const { data } = await api.searchJobs(request);

      setJobs(data.results);
      setTotalJobs(data.count);

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <div
      className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8 -mt-8 pb-32"
      style={{ maxWidth: "1400px" }}
    >
      {/* Left sidebar & main wrapper */}
      <div className="min-w-0 flex-1 bg-white xl:flex">
        {/* Account profile */}
        <div className="bg-white xl:w-64 xl:flex-shrink-0 xl:border-r xl:border-gray-200">
          <div className="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-8">
                <div className="space-y-8 sm:flex sm:items-center sm:justify-between sm:space-y-0 xl:block xl:space-y-8">
                  {/* Profile */}
                  <Link
                    to="/user-settings/profile"
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    {currentUser.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={currentUser.avatar}
                        alt=""
                      />
                    ) : (
                      <div className="flex">
                        <span className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {currentUser.first_name} {currentUser.last_name}
                      </div>
                      <div className="group flex items-center space-x-2.5">
                        <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900">
                          {currentUser.customerName}
                        </span>
                      </div>
                    </div>
                  </Link>
                  {currentUser.isCustomer && (
                    <div className="flex flex-col sm:flex-row xl:flex-col">
                      <Link
                        to="/create-job"
                        className="inline-flex items-center justify-center rounded-md border
                                      border-transparent bg-red-600 px-4 py-2 text-sm font-medium
                                        text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                        focus:ring-red-500 focus:ring-offset-2 xl:w-full"
                      >
                        <PlusIcon
                          className="-ml-1 mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        New Job
                      </Link>

                      {currentUser.enableEstimates && (
                        <Link
                          to="/create-estimate"
                          className="mt-3 inline-flex items-center justify-center rounded-md border
                                      border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700
                                        shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                        focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 xl:ml-0 xl:mt-3 xl:w-full"
                        >
                          New Estimate
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                {currentUser.isCustomer && (
                  <div className="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-6">
                    <div className="flex items-center">
                      <CheckBadge />
                      <span className="text-sm font-medium text-gray-500 ml-2">
                        {currentUser.isPremiumMember
                          ? "Premium Member"
                          : "On-Demand Member"}
                      </span>
                      {!currentUser.isPremiumMember && (
                        <Link
                          to="/premium"
                          className="lg:hidden underline ml-6 text-xs relative"
                          style={{ top: "1px" }}
                        >
                          Go Premium
                        </Link>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <RectangleStack />
                      <span className="text-sm font-medium text-gray-500">
                        {totalJobs} Jobs
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="bg-white lg:min-w-0 lg:flex-1">
          <div
            className="border-b border-t border-gray-200 pl-4 pr-6 pt-4 pb-4 
                              sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-5"
          >
            <div className="flex items-center">
              <h1 className="flex-1 text-lg font-medium">Open Jobs</h1>
              <div className="">
                <button
                  type="button"
                  className="xl:hidden lg:hidden xs:flex sm:flex md:flex text-sm font-medium text-gray-500 hover:text-gray-900"
                  onClick={() => setOpen(true)}
                >
                  Filters
                </button>
              </div>

              <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-40" onClose={setOpen}>
                  <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                  </Transition.Child>

                  <div className="fixed inset-0 z-40 flex">
                    <Transition.Child
                      as={Fragment}
                      enter="transition ease-in-out duration-300 transform"
                      enterFrom="translate-x-full"
                      enterTo="translate-x-0"
                      leave="transition ease-in-out duration-300 transform"
                      leaveFrom="translate-x-0"
                      leaveTo="translate-x-full"
                    >
                      <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                        <div className="flex items-center justify-between px-4">
                          <h2 className="text-lg font-medium text-gray-900">
                            Filters
                          </h2>
                          <button
                            type="button"
                            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md  p-2 text-gray-400"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon
                              className="h-6 w-6 text-gray-500"
                              aria-hidden="true"
                            />
                          </button>
                        </div>

                        {/* Filters */}
                        <form className="mt-4">
                          <div className="border-t border-gray-200 px-4 py-6">
                            <h3 className="text-sm">
                              <span className="font-medium text-gray-900">
                                Status
                              </span>
                            </h3>
                            <div className="space-y-6">
                              <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                                {availableStatuses.map((status) => (
                                  <li key={status.id}>
                                    <div
                                      onClick={() =>
                                        setStatusSelected({
                                          id: status.id,
                                          name: status.name,
                                        })
                                      }
                                      className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                                                      hover:bg-gray-50"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <div className="focus:outline-none">
                                          <p className="text-sm text-gray-700 truncate overflow-ellipsis w-44">
                                            {status.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 px-4 py-6">
                            <div className="py-4">
                              <h2 className="font-medium text-sm text-gray-900">
                                Airports
                                <span className="text-gray-500 text-sm ml-1 font-normal">
                                  ({filteredAirports.length - 1})
                                </span>
                              </h2>
                              <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                                {filteredAirports.map((airport) => (
                                  <li key={airport.id}>
                                    <div
                                      onClick={() =>
                                        setAirportSelected({
                                          id: airport.id,
                                          name: airport.name,
                                        })
                                      }
                                      className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                                              hover:bg-gray-50"
                                    >
                                      <div className="min-w-0 flex-1">
                                        <div className="focus:outline-none">
                                          <p className="text-sm text-gray-700 truncate overflow-ellipsis w-60">
                                            {airport.name}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 px-4 py-6">
                            <h2 className="font-medium text-sm text-gray-900">
                              Tags
                            </h2>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {tags.map((tag) => (
                                <div
                                  key={tag.id}
                                  onClick={() => handleToggleTag(tag)}
                                  className={`${
                                    tag.selected
                                      ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                                      : "hover:bg-gray-50"
                                  }
                                                          rounded-md border border-gray-200 cursor-pointer
                                                        py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32`}
                                >
                                  {tag.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </form>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </Dialog>
              </Transition.Root>
            </div>
          </div>

          <div className="">
            <div className="w-full">
              <div className="relative border-b border-gray-200">
                <div
                  onClick={() => searchJobs()}
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
                  placeholder="search by tail or P.O"
                />
              </div>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="bg-gray-100">
              <div className="mx-auto max-w-7xl py-2 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
                <h3 className="text-xs font-medium text-gray-500">
                  Filters
                  <span className="sr-only">, active</span>
                </h3>

                <div
                  aria-hidden="true"
                  className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
                />

                <div className="mt-2 sm:mt-0 sm:ml-4">
                  <div className="-m-1 flex flex-wrap items-center">
                    {activeFilters.map((activeFilter) => (
                      <span
                        onClick={() => removeActiveFilter(activeFilter.id)}
                        key={activeFilter.id}
                        className="m-1 inline-flex items-center rounded-full cursor-pointer
                                      border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-xs font-medium text-gray-900"
                      >
                        <span>{activeFilter.name}</span>
                        <button
                          type="button"
                          className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                        >
                          <span className="sr-only">
                            Remove filter for {activeFilter.name}
                          </span>
                          <svg
                            className="h-2 w-2"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 8 8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeWidth="1.5"
                              d="M1 1l6 6m0-6L1 7"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading && <Loader />}

          {!loading && jobs.length === 0 && (
            <div className="text-center py-24">
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
                No jobs
              </h3>
              {currentUser.isCustomer && (
                <>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new job.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/create-job"
                      className="inline-flex items-center rounded-md border border-transparent
                                  bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                                    hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <PlusIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      New Job
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}

          {!loading && (
            <>
              <ul
                role="list"
                className="divide-y divide-gray-200 border-b border-gray-200"
              >
                {jobs.map((job) => (
                  <li key={job.id}>
                    <Link
                      to={`/jobs/${job.id}/details`}
                      className="block hover:bg-gray-50"
                    >
                      <div className="relative flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="w-full grid xl:grid-cols-2 lg:grid-cols-2 md-grid-cols-2 xs:grid-cols-1">
                            <div>
                              <div className="">
                                <span className="font-medium text-red-600 text-sm">
                                  {job.tailNumber}
                                </span>
                                <span className="ml-2 text-sm text-gray-700">
                                  {job.purchase_order}
                                </span>
                              </div>

                              <div className="mt-2 text-sm text-gray-500 mb-1">
                                <span className="font-medium">
                                  {job.airport.initials}
                                </span>{" "}
                                - {job.fbo.name} - {job.aircraftType.name}
                              </div>
                              <div className="flex justify-start my-2 gap-2">
                                {job.tags?.map((tag) => (
                                  <div
                                    key={tag.id}
                                    className={`text-xs inline-block rounded-md px-2 py-1 text-white border
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "red" &&
                                                                    "border-red-500 text-red-500"
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "orange" &&
                                                                    "border-orange-500 text-orange-500 "
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "amber" &&
                                                                    "border-amber-500 text-amber-500"
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "indigo" &&
                                                                    " border-indigo-500 text-indigo-500"
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "violet" &&
                                                                    " border-violet-500 text-violet-500"
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "fuchsia" &&
                                                                    "border-fuchsia-500 text-fuchsia-500"
                                                                  } 
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "pink" &&
                                                                    "border-pink-500 text-pink-500"
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "slate" &&
                                                                    "border-slate-500 text-gray-500"
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "lime" &&
                                                                    "border-lime-500 text-lime-500"
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "emerald" &&
                                                                    "border-emerald-500 text-emerald-500"
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "cyan" &&
                                                                    "border-cyan-500 text-cyan-500"
                                                                  }
                                                                  ${
                                                                    tag.tag_color ===
                                                                      "blue" &&
                                                                    "border-blue-500 text-blue-500"
                                                                  }
                                                                 `}
                                  >
                                    {tag.tag_short_name}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left">
                              <p
                                className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                                ${
                                                  job.status === "A" &&
                                                  "bg-blue-400 "
                                                }
                                                ${
                                                  job.status === "S" &&
                                                  "bg-yellow-500 "
                                                }
                                                ${
                                                  job.status === "U" &&
                                                  "bg-indigo-500 "
                                                }
                                                ${
                                                  job.status === "W" &&
                                                  "bg-green-500 "
                                                }
                                                ${
                                                  job.status === "C" &&
                                                  "bg-green-500 "
                                                }
                                                ${
                                                  job.status === "T" &&
                                                  "bg-gray-600 "
                                                }
                                                ${
                                                  job.status === "R" &&
                                                  "bg-purple-500 "
                                                }
                                                ${
                                                  job.status === "I" &&
                                                  "bg-blue-500 "
                                                }
                                              `}
                              >
                                {job.status === "A" && "Confirmed"}
                                {job.status === "S" && "Assigned"}
                                {job.status === "U" && "Submitted"}
                                {job.status === "W" && "In Progress"}
                                {job.status === "C" && "Completed"}
                                {job.status === "T" && "Canceled"}
                                {job.status === "R" && "Review"}
                                {job.status === "I" && "Invoiced"}
                              </p>

                              <div className="text-sm text-gray-500 mt-2">
                                {job.status === "C" || job.status === "I" ? (
                                  <span>
                                    Completed on{" "}
                                    <span className="text-gray-700">
                                      {job.completion_date}
                                    </span>
                                  </span>
                                ) : (
                                  <span>
                                    Complete before{" "}
                                    {job.completeBy ? (
                                      <span className="text-gray-700">
                                        {job.complete_before_formatted_date}
                                      </span>
                                    ) : (
                                      <span
                                        className="relative inline-flex items-center
                                                      rounded-full border border-gray-300 px-2 py-0.5 ml-2"
                                      >
                                        <div className="absolute flex flex-shrink-0 items-center justify-center">
                                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                        </div>
                                        <div className="ml-3 text-xs text-gray-700">
                                          TBD
                                        </div>
                                      </span>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <ChevronRightIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="">
                          {job.comments_count > 0 && (
                            <div
                              className="bg-red-500 text-white py-1 px-3 absolute top-3 right-3
                                                                    rounded-full text-md font-medium inline-block scale-90"
                            >
                              {job.comments_count}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      <div className="xs:pt-10 sm:pt-10 xl:pt-0 lg:pt-0 md:pt-0  px-4">
        <div className="hidden xl:block lg:block pb-4 mt-6">
          <h2 className="font-medium text-sm text-gray-900">Status</h2>
          <ul className="relative z-0 divide-y divide-gray-200 mt-2">
            {availableStatuses.map((status) => (
              <li key={status.id}>
                <div
                  onClick={() =>
                    setStatusSelected({ id: status.id, name: status.name })
                  }
                  className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                          hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                      <p className="text-sm text-gray-700 truncate overflow-ellipsis w-44">
                        {status.name}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden xl:block lg:block pb-4">
          <h2 className="font-medium text-sm text-gray-900">
            Airports
            <span className="text-gray-500 text-sm ml-1 font-normal">
              ({filteredAirports.length - 1})
            </span>
          </h2>
          <ul className="relative z-0 divide-y divide-gray-200 mt-2">
            {filteredAirports.map((airport) => (
              <li key={airport.id}>
                <div
                  onClick={() =>
                    setAirportSelected({ id: airport.id, name: airport.name })
                  }
                  className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                          hover:bg-gray-50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                      <p className="text-sm text-gray-700 truncate overflow-ellipsis w-60">
                        {airport.name}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden xl:block lg:block pb-8">
          <div className="pb-4">
            <h2 className="font-medium text-sm text-gray-900">Tags</h2>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleToggleTag(tag)}
                  className={`${
                    tag.selected
                      ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                      : "hover:bg-gray-50"
                  }
                                              rounded-md border border-gray-200 cursor-pointer
                                            py-2 px-2 text-sm hover:bg-gray-50 truncate overflow-ellipsis w-32`}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
