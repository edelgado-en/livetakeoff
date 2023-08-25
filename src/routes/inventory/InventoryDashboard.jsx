import { useEffect, useState, Fragment } from "react";
import {
  UsersIcon,
  CashIcon,
  BriefcaseIcon,
  ArrowSmRightIcon,
  CheckIcon,
  ChevronDownIcon,
  ArchiveIcon,
} from "@heroicons/react/outline";
import {
  Listbox,
  Transition,
  Menu,
  Popover,
  Disclosure,
  Dialog,
} from "@headlessui/react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "./apiService";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";

const WrenchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-blue-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
      />
    </svg>
  );
};

const LowStockIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-yellow-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  );
};

const QuantityIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-blue-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
      />
    </svg>
  );
};

const Wrench2Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-indigo-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.867 19.125h.008v.008h-.008v-.008z"
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const InventoryDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [dateSelected, setDateSelected] = useState(dateOptions[0]);
  const [currentStats, setCurrentStats] = useState(null);

  const [historyStats, setHistoryStats] = useState(null);

  useEffect(() => {
    getInventoryStats();
  }, []);

  useEffect(() => {
    getInventoryHistoryStats();
  }, [dateSelected]);

  const getInventoryStats = async () => {
    setLoading(true);

    try {
      const { data } = await api.getInventoryCurrentStats();

      setCurrentStats(data);
    } catch (error) {
      toast.error("Unable to get current stats");
    }
    setLoading(false);
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

  return (
    <AnimatedPage>
      <div className="px-4 max-w-7xl m-auto">
        <h2 className="text-3xl font-bold tracking-tight sm:text-3xl pb-5">
          Inventory Dashboard
        </h2>

        <h3 className="text-2xl font-semibold tracking-tight">
          Current Statistics
        </h3>

        {loading && <Loader />}

        {!loading && (
          <>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative overflow-hidden rounded-lg px-4 pt-5 border border-gray-200 sm:px-6 sm:pt-6">
                <dt>
                  <div className="absolute rounded-md p-3 border-green-400 border-2">
                    <CashIcon className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-600">
                    Value in Stock
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    ${currentStats?.total_value_in_stock.toLocaleString()}
                  </p>
                </dd>
              </div>
              <div className="relative overflow-hidden rounded-lg px-4 pt-5 border border-gray-200 sm:px-6 sm:pt-6">
                <dt>
                  <div className="absolute rounded-md p-3 border-blue-400 border-2">
                    <QuantityIcon />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-600">
                    Total Quantity
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {currentStats.total_quantity_in_stock}
                  </p>
                </dd>
              </div>
              <div className="relative overflow-hidden rounded-lg px-4 pt-5 border border-gray-200 sm:px-6 sm:pt-6">
                <dt>
                  <div className="absolute rounded-md p-3 border-yellow-400 border-2">
                    <LowStockIcon />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-600">
                    Low in Stock
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {currentStats.total_out_of_stock}
                  </p>
                </dd>
              </div>
              <div className="relative overflow-hidden rounded-lg px-4 pt-5 border border-gray-200 sm:px-6 sm:pt-6">
                <dt>
                  <div className="absolute rounded-md p-3 border-rose-400 border-2">
                    <ArchiveIcon className="h-6 w-6 text-rose-500" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-600">
                    Out of Stock
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {currentStats.total_low_stock}
                  </p>
                </dd>
              </div>
            </dl>

            <div
              className="grid grid-cols-1
                          gap-8 gap-y-8 gap-x-28 my-8 mb-12"
            >
              <div>
                <div className="text-lg font-medium tracking-tight">
                  Accuracy Across Locations
                </div>
                <div
                  className="rounded-lg px-4 gap-y-4
                                 border border-gray-200 sm:px-6 mt-2
                                grid xl:grid-cols-2 xs:grid-cols-1 py-12"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className=" text-5xl">
                      {currentStats.inventory_accuracy}%
                    </div>
                    <div className="text-md text-gray-500 mt-1">
                      Across all locations
                    </div>
                    <div className="text-md text-gray-500 mt-1">
                      Confirmed:{" "}
                      <span className="font-semibold">
                        {currentStats.total_confirmed}
                      </span>
                    </div>
                    <div className="text-md text-gray-500 mt-1">
                      Unconfirmed:{" "}
                      <span className="font-semibold">
                        {currentStats.total_unconfirmed}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-medium tracking-tight">
                      Top 5 Locations with Lowest Accuracy
                    </div>
                    <div className="pr-2 text-gray-500">
                      {currentStats.location_accuracy_stats.map(
                        (location, index) => (
                          <div key={index}>
                            <div className="grid xl:grid-cols-2 xs:grid-cols-1 py-3 pb-1 text-sm gap-3">
                              <div className="truncate overflow-ellipsis w-64">
                                {location.location}
                              </div>
                              <div className="text-right">
                                <div>
                                  {location.total_unconfirmed} unconfirmed out
                                  of{" "}
                                  {location.total_unconfirmed +
                                    location.total_confirmed}{" "}
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
              </div>
            </div>

            <div
              className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1
                          gap-8 gap-y-8 gap-x-28 my-8 mb-12"
            >
              <div className="">
                <div className="text-lg font-medium tracking-tight">
                  Quantities by Locations
                </div>
                <div className="pr-2 text-gray-500">
                  {currentStats.location_current_stats.map(
                    (location, index) => (
                      <div key={index}>
                        <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                          <div className="truncate overflow-ellipsis w-64">
                            {location.location}
                          </div>
                          <div className="text-right">
                            <div>
                              <span>
                                ${location.total_cost?.toLocaleString()}
                              </span>
                              <span className="font-medium ml-4">
                                {location.total_quantity}
                              </span>
                              <span className="text-xs ml-1">qt</span>
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

              <div className="">
                <div className="text-lg font-medium tracking-tight">
                  Quantities by Areas
                </div>
                <div className="pr-2 text-gray-500">
                  {currentStats.area_current_stats.map((area, index) => (
                    <div key={index}>
                      <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                        <div className="truncate overflow-ellipsis w-64">
                          {area.area === "B" && "Interior and Exterior"}
                          {area.area === "I" && "Interior"}
                          {area.area === "E" && "Exterior"}
                          {area.area === "O" && "Office"}
                        </div>
                        <div className="text-right">
                          <div>
                            <span>${area.total_cost?.toLocaleString()}</span>
                            <span className="font-medium ml-4">
                              {area.total_quantity}
                            </span>
                            <span className="text-xs ml-1">qt</span>
                          </div>
                          <div>{area.percentage + "%"}</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                        <div
                          className="h-1.5 rounded-full bg-blue-500"
                          style={{ width: area.percentage + "%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full border-t border-gray-300"></div>

            <div className="flex flex-wrap justify-between gap-4 mt-8">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Historical Statistics
                </h3>
              </div>
              <div className="text-right">
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
                <div className="space-y-8">
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
                              className="rounded-lg h-40 w-40"
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
                                <div className="flex-1">Total Transactions</div>
                                <div className="text-right">
                                  {user.total_transactions}
                                </div>
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
              </div>
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default InventoryDashboard;
