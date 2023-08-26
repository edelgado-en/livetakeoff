import { useEffect, useState, Fragment } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { Listbox, Transition } from "@headlessui/react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "./apiService";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";

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

const InventoryHistoricalStats = () => {
  const [historyLoading, setHistoryLoading] = useState(true);
  const [dateSelected, setDateSelected] = useState(dateOptions[4]);

  const [historyStats, setHistoryStats] = useState(null);

  useEffect(() => {
    getInventoryHistoryStats();
  }, [dateSelected]);

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
              </div>
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default InventoryHistoricalStats;
