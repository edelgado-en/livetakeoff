import { useEffect, useState, Fragment } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { Listbox, Transition } from "@headlessui/react";

import { toast } from "react-toastify";
import * as api from "./apiService";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";

import ReactTimeAgo from "react-time-ago";
import Pagination from "react-js-pagination";

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

const dateOptions = [
  { id: "today", name: "Today" },
  { id: "yesterday", name: "Yesterday" },
  { id: "last7Days", name: "Last 7 Days" },
  { id: "lastWeek", name: "Last Week" },
  { id: "MTD", name: "Month to Date" },
  { id: "lastMonth", name: "Last Month" },
  { id: "lastQuarter", name: "Last Quarter" },
  { id: "YTD", name: "Year to Date" },
  { id: "lastYear", name: "Last Year" },
];

const activityTypes = [
  { id: null, name: "All" },
  { id: "A", name: "Added" },
  { id: "S", name: "Subtracted" },
  { id: "M", name: "Moved" },
  { id: "C", name: "Confirmed" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const InventoryHistoricalStats = () => {
  const [historyLoading, setHistoryLoading] = useState(true);
  const [dateSelected, setDateSelected] = useState(dateOptions[4]);

  const [historyStats, setHistoryStats] = useState(null);

  const [itemActivities, setItemActivities] = useState([]);
  const [totalItemActivities, setTotalItemActivities] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityTypeSelected, setActivityTypeSelected] = useState(
    activityTypes[0]
  );
  const [searchItemName, setSearchItemName] = useState("");

  const [locations, setLocations] = useState([]);
  const [locationSelected, setLocationSelected] = useState(null);

  useEffect(() => {
    getInventoryHistoryStats();
  }, [dateSelected]);

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    let timeoutID = setTimeout(() => {
      getLocationItemActivities();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [
    dateSelected,
    currentPage,
    searchItemName,
    activityTypeSelected,
    locationSelected,
  ]);

  const getLocations = async () => {
    try {
      const { data } = await api.getLocations();

      data.results.unshift({ id: null, name: "All My locations" });

      setLocations(data.results);
      setLocationSelected(data.results[0]);
    } catch (err) {
      toast.error("Unable to get locations");
    }
  };

  const getInventoryHistoryStats = async () => {
    setHistoryLoading(true);

    try {
      const { data } = await api.getInventoryHistoryStats({
        dateSelected: dateSelected.id,
      });

      setHistoryStats(data);
    } catch (error) {
      toast.error("Unable to get history stats");
    }

    setHistoryLoading(false);
  };

  const getLocationItemActivities = async () => {
    setActivityLoading(true);

    const request = {
      dateSelected: dateSelected.id,
      item_name: searchItemName,
      activity_type: activityTypeSelected.id,
      location_id: locationSelected?.id,
    };

    try {
      const { data } = await api.getItemActivity(request, currentPage);

      setItemActivities(data.results);
      setTotalItemActivities(data.count);
    } catch (err) {
      toast.error("Unable to load item activities");
    }

    setActivityLoading(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      getLocationItemActivities();
    }
  };

  const handleSetLocationSelected = (location) => {
    setLocationSelected(location);
  };

  return (
    <AnimatedPage>
      <div className="px-2 max-w-7xl m-auto">
        {historyLoading && <Loader />}

        {!historyLoading && (
          <>
            <div className="flex flex-wrap justify-between gap-4 mt-8">
              <div className="">
                <Listbox value={dateSelected} onChange={setDateSelected}>
                  {({ open }) => (
                    <>
                      <div className="relative" style={{ width: "340px" }}>
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md 
                                                            bg-white py-2 px-3 pr-8 text-left
                                                            shadow-sm border-gray-200 border focus:border-gray-200 focus:ring-0 focus:outline-none
                                                            text-lg font-medium leading-6 text-gray-900"
                        >
                          <span className="block truncate">
                            {dateSelected.name}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                            <ChevronDownIcon
                              className="h-4 w-4 text-gray-500"
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
                            className="absolute left-0 z-10 mt-1 max-h-96 w-full overflow-auto
                                                                rounded-md bg-white py-1 shadow-lg ring-1
                                                                ring-black ring-opacity-5 focus:outline-none text-sm"
                          >
                            {dateOptions.map((sort) => (
                              <Listbox.Option
                                key={sort.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative select-none py-2 pl-3 pr-9 cursor-pointer text-md"
                                  )
                                }
                                value={sort}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "block truncate text-md"
                                      )}
                                    >
                                      {sort.name}
                                    </span>
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
              </div>
            </div>

            <div className="pb-32 mt-8">
              <div className="mx-auto max-w-7xl">
                <div className="text-2xl font-semibold tracking-tight">
                  Total Expense: $
                  {historyStats.total_inventory_expense?.toLocaleString()}
                </div>

                {historyStats.total_inventory_expense > 0 && (
                  <div
                    className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2
                                     sm:grid-cols-1 xs:grid-cols-1 gap-8 gap-y-8 gap-x-28 my-8"
                  >
                    <div className="">
                      <div className="text-lg font-medium tracking-tight">
                        Expenses by Items
                      </div>
                      <div className="pr-2 text-gray-500">
                        {historyStats.items_with_highest_expense.map(
                          (item, index) => (
                            <div key={index}>
                              <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                                <div className="truncate overflow-ellipsis w-64">
                                  {item.name}
                                </div>
                                <div className="text-right">
                                  <div>
                                    <span>${item.cost?.toLocaleString()}</span>
                                  </div>
                                  <div>{item.percentage + "%"}</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                                <div
                                  className="h-1.5 rounded-full bg-blue-500"
                                  style={{ width: item.percentage + "%" }}
                                ></div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="">
                      <div className="text-lg font-medium tracking-tight">
                        Expenses by Location
                      </div>
                      <div className="pr-2 text-gray-500">
                        {historyStats.locations_with_expense.map(
                          (location, index) => (
                            <div key={index}>
                              <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                                <div className="truncate overflow-ellipsis w-64">
                                  {location.name}
                                </div>
                                <div className="text-right">
                                  <div>
                                    <span>
                                      $
                                      {location.total_expense?.toLocaleString()}
                                    </span>
                                  </div>
                                  <div>{location.percentage + "%"}</div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                                <div
                                  className="h-1.5 rounded-full bg-blue-500"
                                  style={{ width: location.percentage + "%" }}
                                ></div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {historyStats.popular_items?.length > 0 && (
                  <div className="mt-8">
                    <div className="">
                      <div className="text-lg font-medium tracking-tight">
                        Most Popular Items
                      </div>
                      <div className="pr-2 text-gray-500">
                        {historyStats.popular_items.map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                              <div className="truncate overflow-ellipsis w-64">
                                {item.name}
                              </div>
                              <div className="text-right">
                                <div>
                                  <span>{item.total_transactions}</span>
                                  <span className="text-xs ml-1">
                                    transactions
                                  </span>
                                </div>
                                <div>{item.percentage + "%"}</div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                              <div
                                className="h-1.5 rounded-full bg-blue-500"
                                style={{ width: item.percentage + "%" }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {historyStats?.users_with_stats?.length > 0 && (
                  <div className="space-y-8 mt-12">
                    <h2 className="text-lg font-medium tracking-tight">
                      Project Managers
                      <span
                        className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                                    rounded-full text-xs font-medium md:inline-block"
                      >
                        {historyStats?.users_with_stats?.length}
                      </span>
                    </h2>

                    <ul className="space-y-12 lg:grid lg:grid-cols-3 lg:items-start lg:gap-x-12 lg:gap-y-12 lg:space-y-0">
                      {historyStats?.users_with_stats?.map((user, index) => (
                        <li key={index}>
                          <div className="flex gap-4 flex-start">
                            <div className="flex-shrink-0">
                              <img
                                className="rounded-lg h-40 w-40 mt-5"
                                src={user.avatar}
                                alt=""
                              />
                            </div>
                            <div className="w-full">
                              <div className="space-y-2">
                                <div className="space-y-1 text-md font-medium leading-6">
                                  <h3>
                                    {user.first_name} {user.last_name}
                                  </h3>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                  <div className="flex-1">Total Additions</div>
                                  <div className="text-right">
                                    {user.total_additions}
                                  </div>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                  <div className="flex-1">
                                    Total Substractions
                                  </div>
                                  <div className="text-right font-medium">
                                    {user.total_subtractions}
                                  </div>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                  <div className="flex-1">Total Moves</div>
                                  <div className="text-right font-medium">
                                    {user.total_moves}
                                  </div>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                  <div className="flex-1">
                                    Total Confirmations
                                  </div>
                                  <div className="text-right font-medium">
                                    {user.total_confirmations}
                                  </div>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm border-t border-gray-200 pt-2">
                                  <div className="flex-1">
                                    Total Transactions
                                  </div>
                                  <div className="text-right">
                                    {user.total_transactions}
                                  </div>
                                </div>
                                <div className="flex justify-between text-gray-500 text-sm">
                                  <div className="flex-1">Total Expense</div>
                                  <div className="text-right font-medium">
                                    ${user.inventory_expense?.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-12">
                  <h2 className="text-lg font-medium tracking-tight">
                    Item Activity
                    <span
                      className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                                    rounded-full text-xs font-medium md:inline-block"
                    >
                      {totalItemActivities}
                    </span>
                  </h2>
                  <div className="mt-4">
                    <div className="relative border-gray-200 flex flex-wrap gap-4">
                      <div className="">
                        <div
                          onClick={() => getLocationItemActivities()}
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
                          value={searchItemName}
                          onChange={(event) =>
                            setSearchItemName(event.target.value)
                          }
                          onKeyDown={handleKeyDown}
                          className="block w-full  pl-10 focus:border-sky-500 focus:ring-sky-500 border border-gray-300 py-3 rounded-md 
                                        text-sm"
                          placeholder="Search by item"
                        />
                      </div>
                      <Listbox
                        value={activityTypeSelected}
                        onChange={setActivityTypeSelected}
                      >
                        {({ open }) => (
                          <>
                            <div
                              className="relative"
                              style={{ width: "150px" }}
                            >
                              <Listbox.Button
                                className="relative w-full cursor-default rounded-md 
                                            bg-white py-2.5 px-3 pr-8 text-left
                                            shadow-sm border-gray-300 border focus:border-sky-500 focus:ring-sky-500
                                            text-md text-gray-500"
                              >
                                <span className="block truncate">
                                  {activityTypeSelected.name}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                  <ChevronDownIcon
                                    className="h-4 w-4 text-gray-500"
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
                                  className="absolute left-0 z-10 mt-1 max-h-96 w-full overflow-auto
                                                                        rounded-md bg-white py-1 shadow-lg ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none text-sm"
                                >
                                  {activityTypes.map((activityType) => (
                                    <Listbox.Option
                                      key={activityType.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "text-white bg-red-600"
                                            : "text-gray-900",
                                          "relative select-none py-2 pl-3 pr-9 cursor-pointer text-md"
                                        )
                                      }
                                      value={activityType}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate text-md"
                                            )}
                                          >
                                            {activityType.name}
                                          </span>
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

                      <Listbox
                        value={locationSelected}
                        onChange={(location) =>
                          handleSetLocationSelected(location)
                        }
                      >
                        {({ open }) => (
                          <>
                            <div style={{ width: "300px" }}>
                              <Listbox.Button
                                className="relative w-full cursor-default rounded-md 
                                bg-white py-2.5 px-3 pr-8 text-left
                                shadow-sm border-gray-300 border focus:border-sky-500 focus:ring-sky-500
                                text-md text-gray-500"
                              >
                                <span className="block truncate">
                                  {locationSelected
                                    ? locationSelected.name
                                    : "Select a location"}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronDownIcon
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
                                  className="absolute z-10 mt-1 max-h-96 overflow-auto
                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                >
                                  {locations.map((location) => (
                                    <Listbox.Option
                                      key={location.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "text-white bg-red-600"
                                            : "text-gray-900",
                                          "relative select-none py-2 pl-3 pr-9 cursor-pointer text-md"
                                        )
                                      }
                                      value={location}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate"
                                            )}
                                          >
                                            {location.name}
                                          </span>
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
                      {/* <div className="xl:hidden lg:hidden">
                  <button
                    type="button"
                    className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 relative top-2 mr-2"
                    onClick={() => setOpen(true)}
                  >
                    Filters
                  </button>
                </div> */}
                    </div>
                  </div>
                  <div className="mt-2 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {activityLoading && <Loader />}

                        {!activityLoading && itemActivities.length === 0 && (
                          <div className="text-gray-500 mt-20 font-medium m-auto w-96 text-center pb-20">
                            No activities found.
                          </div>
                        )}

                        {!activityLoading && itemActivities.length > 0 && (
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-sm
                                        font-semibold text-gray-900 sm:pl-0"
                                >
                                  User
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Type
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Item
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Location
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Quantity
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Cost
                                </th>
                                <th
                                  scope="col"
                                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                >
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {itemActivities.map((activity) => (
                                <tr
                                  key={activity.id}
                                  className="hover:bg-gray-50"
                                >
                                  <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm sm:pl-0">
                                    <div className="flex items-center">
                                      <div className="h-11 w-11 flex-shrink-0">
                                        <img
                                          className="h-11 w-11 rounded-full"
                                          src={activity.user?.profile?.avatar}
                                          alt=""
                                        />
                                      </div>
                                      <div className="ml-3">
                                        <div className=" text-gray-700">
                                          {activity.user.first_name}{" "}
                                          {activity.user.last_name}
                                        </div>
                                        <div className="mt-1 text-gray-500">
                                          {activity.email}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700">
                                    <div
                                      className={`inline-flex items-center rounded-md
                                            px-2 py-1 text-xs font-medium ring-1 ring-inset
                                        ${
                                          activity.activity_type === "A" &&
                                          "text-green-700 bg-green-50 ring-green-600/20"
                                        }
                                        ${
                                          activity.activity_type === "C" &&
                                          "text-blue-700 bg-blue-50 ring-blue-600/20"
                                        }
                                        ${
                                          activity.activity_type === "S" &&
                                          "text-red-700 bg-red-50 ring-red-600/20"
                                        }
                                        ${
                                          activity.activity_type === "M" &&
                                          "text-fuchsia-700 bg-fuchsia-50 ring-fuchsia-600/20"
                                        } `}
                                    >
                                      {activity.activity_type === "C" &&
                                        "Confirmed"}
                                      {activity.activity_type === "A" &&
                                        "Added"}
                                      {activity.activity_type === "M" &&
                                        "Moved"}
                                      {activity.activity_type === "S" &&
                                        "Removed"}
                                    </div>

                                    {activity.activity_type === "M" && (
                                      <div className="flex gap-2 mt-2">
                                        <div>{activity.moved_from?.name}</div>
                                        <div>{"->"}</div>
                                        <div>{activity.moved_to?.name}</div>
                                      </div>
                                    )}
                                  </td>
                                  <td
                                    className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 truncate"
                                    style={{ maxWidth: "170px" }}
                                  >
                                    {activity.location_item?.item?.name}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                    {activity.location_item?.location?.name}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700 font-medium">
                                    {activity.quantity}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-700 font-medium">
                                    {activity.cost && "$"}
                                    {activity.cost?.toLocaleString()}
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                                    <ReactTimeAgo
                                      date={new Date(activity.timestamp)}
                                      locale="en-US"
                                      timeStyle="twitter"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>

                    {!activityLoading && totalItemActivities > 100 && (
                      <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
                        <div>
                          <Pagination
                            innerClass="pagination pagination-custom"
                            activePage={currentPage}
                            hideDisabled
                            itemClass="page-item page-item-custom"
                            linkClass="page-link page-link-custom"
                            itemsCountPerPage={100}
                            totalItemsCount={totalItemActivities}
                            pageRangeDisplayed={3}
                            onChange={handlePageChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default InventoryHistoricalStats;
