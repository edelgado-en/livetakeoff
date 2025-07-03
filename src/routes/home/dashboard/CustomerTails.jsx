import { useEffect, useState, Fragment } from "react";
import {
  UsersIcon,
  CashIcon,
  BriefcaseIcon,
  ArrowSmRightIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  NewspaperIcon,
} from "@heroicons/react/outline";
import { Listbox, Transition } from "@headlessui/react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "./apiService";

import AnimatedPage from "../../../components/animatedPage/AnimatedPage";
import Loader from "../../../components/loader/Loader";

import Pagination from "react-js-pagination";

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

const ChevronUpDownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 cursor-pointer"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

const statuses = [
  { id: "All", name: "All" },
  { id: "O", name: "OK" },
  { id: "I", name: "In Maintenance" },
  { id: "S", name: "Service Due" },
  { id: "N", name: "No Flight History" },
];

const due_service_options = [
  { id: "All", name: "All" },
  { id: "intLvl1Due", name: "Interior Level 1 Due" },
  { id: "intLvl2Due", name: "Interior Level 2 Due" },
  { id: "extLvl1Due", name: "Exterior Level 1 Due" },
  { id: "extLvl2Due", name: "Exterior Level 2 Due" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CustomerTails = () => {
  const [loading, setLoading] = useState(true);

  const [tails, setTails] = useState([]);
  const [totalTails, setTotalTails] = useState(0);

  const [stats, setStats] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchText, setSearchText] = useState("");

  const [statusSelected, setStatusSelected] = useState(statuses[0]);

  const [dueServiceSelected, setDueServiceSelected] = useState(
    due_service_options[0]
  );

  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState({
    id: "All",
    name: "All Customers",
  });
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getCustomers();
    }, 200);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [customerSearchTerm]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getCustomerTails();
    }, 200);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [
    dueServiceSelected,
    statusSelected,
    customerSelected,
    searchText,
    currentPage,
  ]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getCustomerTailStats();
    }, 200);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [dueServiceSelected, statusSelected, customerSelected, searchText]);

  const handleClearCustomerSearchFilter = () => {
    setCustomerSearchTerm("");
    setCustomerSelected(null);
  };

  const getCustomers = async () => {
    const request = {
      name: customerSearchTerm,
      status: statusSelected.id,
    };

    try {
      const { data } = await api.getCustomers(request);

      data.results.unshift({ id: null, name: "All Customers" });

      setCustomers(data.results);
    } catch (err) {
      toast.error("Unable to get customers");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      getCustomerTails();
    }
  };

  const getCustomerTails = async () => {
    setLoading(true);
    const request = {
      searchText,
      customerId: customerSelected.id,
      status: statusSelected.id,
      service_due: dueServiceSelected.id,
    };

    try {
      const { data } = await api.getCustomerTails(request);

      setTails(data.results);
      setTotalTails(data.count);
    } catch (err) {
      toast.error("Unable to get customer tails");
    } finally {
      setLoading(false);
    }
  };

  const getCustomerTailStats = async () => {
    setLoading(true);
    const request = {
      searchText,
      customerId: customerSelected.id,
      status: statusSelected.id,
      service_due: dueServiceSelected.id,
    };

    try {
      const { data } = await api.getCustomerTailStats(request);

      const stats = [
        { label: "Total Tails Tracked", value: data.total_tails },
        {
          label: "Tails with Service Due",
          value: data.total_tails_w_service_due,
        },
        { label: "Tails Ok", value: data.total_tails_ok },
        {
          label: "Tails with No Flight History",
          value: data.total_tails_w_no_flight_history,
        },
      ];

      setStats(stats);
    } catch (err) {
      toast.error("Unable to get customer tail stats");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <AnimatedPage>
      <div className="px-4 max-w-7xl m-auto" style={{ maxWidth: "1800px" }}>
        <h2 className="text-3xl font-bold tracking-tight sm:text-3xl pb-5">
          Flight Based Cleaning Dashboard
        </h2>

        <div className="grid xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-4">
          <div>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div
                onClick={() => getCustomerTails()}
                className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
              >
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400 cursor-pointer"
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
                className={`block w-full rounded-md pl-10 text-md ${
                  searchText.length > 0
                    ? "border-sky-500 focus:border-sky-500 focus:ring-sky-500 border-2"
                    : "border-gray-200  focus:border-sky-500 focus:ring-sky-500"
                } 
                                     `}
                placeholder="tail or aircraft..."
              />
            </div>
          </div>
          <div>
            <Listbox
              value={dueServiceSelected}
              onChange={setDueServiceSelected}
            >
              {({ open }) => (
                <>
                  <div className="relative">
                    <Listbox.Button
                      className={`relative w-full cursor-default rounded-md border 
                                ${
                                  dueServiceSelected &&
                                  dueServiceSelected.name !== "All"
                                    ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                    : " border-gray-200 bg-white text-gray-500"
                                }                          
                                          py-2 pl-3 pr-10 text-left
                                            shadow-sm  sm:text-md`}
                    >
                      <span className="block truncate">
                        {dueServiceSelected
                          ? dueServiceSelected.name
                          : "Select Service Due"}
                      </span>
                      <span
                        className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ${
                          dueServiceSelected &&
                          dueServiceSelected.name !== "All"
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        <ChevronUpDownIcon
                          className="h-5 w-5"
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
                        className="absolute z-20 mt-1 max-h-96 w-full overflow-auto
                                                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-md"
                      >
                        {due_service_options.map((due_service) => (
                          <Listbox.Option
                            key={due_service.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "text-white bg-red-600"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={due_service}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {due_service.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-red-600",
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
          </div>
          <div>
            <Listbox value={statusSelected} onChange={setStatusSelected}>
              {({ open }) => (
                <>
                  <div className="relative">
                    <Listbox.Button
                      className={`relative w-full cursor-default rounded-md border 
                                ${
                                  statusSelected &&
                                  statusSelected.name !== "All"
                                    ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                    : " border-gray-200 bg-white text-gray-500"
                                }                          
                                          py-2 pl-3 pr-10 text-left
                                            shadow-sm  sm:text-md`}
                    >
                      <span className="block truncate">
                        {statusSelected ? statusSelected.name : "Select Status"}
                      </span>
                      <span
                        className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ${
                          statusSelected && statusSelected.name !== "All"
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        <ChevronUpDownIcon
                          className="h-5 w-5"
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
                        className="absolute z-20 mt-1 max-h-96 w-full overflow-auto
                                                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-md"
                      >
                        {statuses.map((status) => (
                          <Listbox.Option
                            key={status.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "text-white bg-red-600"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={status}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {status.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-red-600",
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
          </div>
          <div>
            <Listbox value={customerSelected} onChange={setCustomerSelected}>
              {({ open }) => (
                <>
                  <div className="relative">
                    <Listbox.Button
                      className={`relative w-full cursor-default rounded-md border 
                                ${
                                  customerSelected &&
                                  customerSelected.name !== "All Customers"
                                    ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                    : " border-gray-200 bg-white text-gray-500"
                                }                          
                                          py-2 pl-3 pr-10 text-left
                                            shadow-sm  sm:text-md`}
                    >
                      <span className="block truncate">
                        {customerSelected
                          ? customerSelected.name
                          : "Select customer"}
                      </span>
                      <span
                        className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ${
                          customerSelected &&
                          customerSelected.name !== "All Customers"
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        <ChevronUpDownIcon
                          className="h-5 w-5"
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
                        className="absolute z-20 mt-1 max-h-96 w-full overflow-auto
                                                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-md"
                      >
                        <div className="relative">
                          <div className="sticky top-0 z-20  px-1">
                            <div className="mt-1 block  items-center">
                              <input
                                type="text"
                                name="search"
                                id="search"
                                value={customerSearchTerm}
                                onChange={(e) =>
                                  setCustomerSearchTerm(e.target.value)
                                }
                                className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 sm:text-md
                                                                            border-gray-300 rounded-md"
                              />
                              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                {customerSearchTerm && (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-blue-500 font-bold mr-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    onClick={() => {
                                      handleClearCustomerSearchFilter();
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
                        {customers.map((customer) => (
                          <Listbox.Option
                            key={customer.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "text-white bg-red-600"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={customer}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {customer.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={classNames(
                                      active ? "text-white" : "text-red-600",
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
          </div>
        </div>

        {loading && <Loader />}

        {!loading && tails.length === 0 && (
          <div className="my-40 text-center">
            <div className="text-gray-500">
              No tails found for the selected filters.
            </div>
          </div>
        )}

        {!loading && tails.length > 0 && (
          <>
            <dl
              className="my-12 grid grid-cols-1 gap-x-8 gap-y-12 
                             sm:grid-cols-2 sm:gap-y-16  lg:grid-cols-4"
            >
              {stats.map((stat, statIdx) => (
                <div
                  key={statIdx}
                  className="flex flex-col-reverse gap-y-3 border-l border-gray pl-6"
                >
                  <dt className="text-base/7 text-gray-700">{stat.label}</dt>
                  <dd className="text-3xl font-semibold tracking-tight ">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            {/* DESKTOP */}
            <div className="hidden md:block lg:block xl:block mt-8">
              <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 bg-gray-50 py-3.5 pr-3 pl-4
                                         text-left text-sm font-semibold text-gray-900"
                        >
                          Tail
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Int Lvl 1
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Int Lvl 2
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Ext Lvl 1
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Ext Lvl 2
                        </th>
                        <th
                          scope="col"
                          className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {tails.map((tail) => (
                        <tr
                          key={tail.id}
                          className={`${
                            !tail.is_active
                              ? "bg-gray-100"
                              : tail.status === "S"
                              ? "bg-red-100"
                              : tail.status === "I"
                              ? "bg-yellow-100"
                              : tail.status === "N"
                              ? "bg-indigo-100"
                              : tail.status === "O"
                              ? "bg-green-100"
                              : ""
                          }`}
                        >
                          <td className="py-5 pr-3 pl-2 text-sm whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="">
                                <div className="font-medium text-gray-900">
                                  {tail.tail_number}
                                </div>
                                <div className=" text-gray-500">
                                  {tail.aircraft_type_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <div className="text-gray-900">
                              {tail.customer_name}
                            </div>
                          </td>
                          <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <div>
                              Last serv:{" "}
                              {tail.last_interior_level_1_service_date
                                ? tail.last_interior_level_1_service_date +
                                  " " +
                                  tail.last_interior_level_1_location
                                : "None"}
                            </div>
                            <div>
                              Flights since:{" "}
                              {tail.flights_since_last_interior_level_1_service}
                              {tail.is_interior_level_1_service_due && (
                                <span
                                  className="ml-6 inline-flex items-center
                                                rounded-md bg-red-100 py-1 px-2 text-xs
                                                font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"
                                >
                                  DUE
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <div>
                              Last serv:{" "}
                              {tail.last_interior_level_2_service_date
                                ? tail.last_interior_level_2_service_date +
                                  " " +
                                  tail.last_interior_level_2_location
                                : "None"}
                            </div>
                            <div>
                              Flights since:{" "}
                              {tail.flights_since_last_interior_level_2_service}
                              {tail.is_interior_level_2_service_due && (
                                <span
                                  className="ml-6 inline-flex items-center
                                                rounded-md bg-red-100 py-1 px-2 text-xs
                                                font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"
                                >
                                  DUE
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <div>
                              Last serv:{" "}
                              {tail.last_exterior_level_1_service_date
                                ? tail.last_exterior_level_1_service_date +
                                  " " +
                                  tail.last_exterior_level_1_location
                                : "None"}
                            </div>
                            <div>
                              Flights since:{" "}
                              {tail.flights_since_last_exterior_level_1_service}
                              {tail.is_interior_level_1_service_due && (
                                <span
                                  className="ml-6 inline-flex items-center
                                                rounded-md bg-red-100 py-1 px-2 text-xs
                                                font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"
                                >
                                  DUE
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <div>
                              Last serv:{" "}
                              {tail.last_exterior_level_2_service_date
                                ? tail.last_exterior_level_2_service_date +
                                  " " +
                                  tail.last_exterior_level_2_location
                                : "None"}
                            </div>
                            <div>
                              Flights since:{" "}
                              {tail.flights_since_last_exterior_level_2_service}
                              {tail.is_exterior_level_2_service_due && (
                                <span
                                  className="ml-6 inline-flex items-center
                                                rounded-md bg-red-100 px-2 text-xs
                                                font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"
                                >
                                  DUE
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                            <p
                              className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                                    ${
                                                      tail.status === "S" &&
                                                      "bg-red-400 "
                                                    }
                                                    ${
                                                      tail.status === "I" &&
                                                      "bg-yellow-500 "
                                                    }
                                                    ${
                                                      tail.status === "N" &&
                                                      "bg-indigo-500 "
                                                    }

                                                    ${
                                                      tail.status === "O" &&
                                                      "bg-green-500 "
                                                    }
                                                `}
                            >
                              {tail.status === "O" && "OK"}
                              {tail.status === "I" && "In Maintenance"}
                              {tail.status === "N" && "No Flight History"}
                              {tail.status === "S" && "Service Due"}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* MOBILE */}
            <div className="xs:block sm:block xl:hidden lg:hidden md:hidden overflow-hidden bg-white shadow sm:rounded-md mt-2 mb-4">
              <ul className="divide-y divide-gray-200">
                {tails.map((tail) => (
                  <li key={tail.id}>
                    <div className="block hover:bg-gray-50">
                      <div className="relative flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="flex justify-between">
                            <div>
                              <span className="font-medium text-red-600 text-sm">
                                {tail.tail_number}
                              </span>
                              <span className="ml-2 text-sm text-gray-700">
                                {tail.aircraft_type_name}
                              </span>
                            </div>
                            <div>
                              <p
                                className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                                    ${
                                                      tail.status === "S" &&
                                                      "bg-red-400 "
                                                    }
                                                    ${
                                                      tail.status === "I" &&
                                                      "bg-yellow-500 "
                                                    }
                                                    ${
                                                      tail.status === "N" &&
                                                      "bg-indigo-500 "
                                                    }

                                                    ${
                                                      tail.status === "O" &&
                                                      "bg-green-500 "
                                                    }
                                                `}
                              >
                                {tail.status === "O" && "OK"}
                                {tail.status === "I" && "In Maintenance"}
                                {tail.status === "N" && "No Flight History"}
                                {tail.status === "S" && "Service Due"}
                              </p>
                            </div>
                          </div>

                          {tail.is_interior_level_1_service_due && (
                            <div className="mt-2 text-sm flex justify-between">
                              <div>
                                <div>Last Int lvl 1 Service:</div>
                                <div className="mt-1">Flights Since:</div>
                              </div>
                              <div className="text-align-right">
                                <div>
                                  {tail.last_interior_level_1_service_date
                                    ? tail.last_interior_level_1_service_date +
                                      " " +
                                      tail.last_interior_level_1_location
                                    : "None"}
                                </div>
                                <div className="mt-1 flex justify-end">
                                  {
                                    tail.flights_since_last_interior_level_1_service
                                  }
                                  {tail.is_interior_level_1_service_due && (
                                    <span
                                      className="ml-2 inline-flex items-center
                                                    rounded-md bg-red-100 px-2 text-xs
                                                    font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"
                                    >
                                      DUE
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {tail.is_interior_level_2_service_due && (
                            <div className="mt-2 text-sm flex justify-between">
                              <div>
                                <div>Last Int lvl 2 Service:</div>
                                <div className="mt-1">Flights Since:</div>
                              </div>
                              <div className="text-align-right">
                                <div>
                                  {tail.last_interior_level_2_service_date
                                    ? tail.last_interior_level_2_service_date +
                                      " " +
                                      tail.last_interior_level_2_location
                                    : "None"}
                                </div>
                                <div className="mt-1 flex justify-end">
                                  {
                                    tail.flights_since_last_interior_level_2_service
                                  }
                                  {tail.is_interior_level_2_service_due && (
                                    <span
                                      className="ml-2 inline-flex items-center
                                                    rounded-md bg-red-100 px-2 text-xs
                                                    font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"
                                    >
                                      DUE
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {tail.is_exterior_level_1_service_due && (
                            <div className="mt-2 text-sm flex justify-between">
                              <div>
                                <div>Last Ext lvl 1 Service:</div>
                                <div className="mt-1">Flights Since:</div>
                              </div>
                              <div className="text-align-right">
                                <div>
                                  {tail.last_exterior_level_1_service_date
                                    ? tail.last_exterior_level_1_service_date +
                                      " " +
                                      tail.last_exterior_level_1_location
                                    : "None"}
                                </div>
                                <div className="mt-1 flex justify-end">
                                  {
                                    tail.flights_since_last_exterior_level_1_service
                                  }
                                  {tail.is_exterior_level_1_service_due && (
                                    <span
                                      className="ml-2 inline-flex items-center
                                                    rounded-md bg-red-100 px-2 text-xs
                                                    font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"
                                    >
                                      DUE
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {tail.is_exterior_level_2_service_due && (
                            <div className="mt-2 text-sm flex justify-between">
                              <div>
                                <div>Last Ext lvl 2 Service:</div>
                                <div className="mt-1">Flights Since:</div>
                              </div>
                              <div className="text-align-right">
                                <div>
                                  {tail.last_exterior_level_2_service_date
                                    ? tail.last_exterior_level_2_service_date +
                                      " " +
                                      tail.last_exterior_level_2_location
                                    : "None"}
                                </div>
                                <div className="mt-1 flex justify-end">
                                  {
                                    tail.flights_since_last_exterior_level_2_service
                                  }
                                  {tail.is_exterior_level_2_service_due && (
                                    <span
                                      className="ml-2 inline-flex items-center
                                                    rounded-md bg-red-100 px-2 text-xs
                                                    font-medium text-red-700 ring-1 ring-red-600/20 ring-inset"
                                    >
                                      DUE
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {!loading && totalTails > 200 && (
              <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
                <div>
                  <Pagination
                    innerClass="pagination pagination-custom"
                    activePage={currentPage}
                    hideDisabled
                    itemClass="page-item page-item-custom"
                    linkClass="page-link page-link-custom"
                    itemsCountPerPage={200}
                    totalItemsCount={totalTails}
                    pageRangeDisplayed={3}
                    onChange={handlePageChange}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default CustomerTails;
