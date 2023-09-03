import { useEffect, useState, Fragment } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { Listbox, Transition } from "@headlessui/react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "./apiService";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";

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

const years = [
  { id: 2023, name: "2023" },
  /* { id: 2024, name: "2024" }, */
];

const timeBreakdowns = [
  { id: 1, name: "Daily" },
  { id: 2, name: "Weekly" },
  { id: 3, name: "Monthly" },
];

const InventoryGrowth = () => {
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [locationSelected, setLocationSelected] = useState(null);
  const [yearSelected, setYearSelected] = useState(years[0]);
  const [timeBreakdownSelected, setTimeBreakdownSelected] = useState(
    timeBreakdowns[2]
  );

  const [dailyStats, setDailyStats] = useState([]);
  const [generalStats, setGeneralStats] = useState([]);

  const [lineGraphData, setLineGraphData] = useState([]);

  useEffect(() => {
    getGeneralStats();
  }, [yearSelected, locationSelected, timeBreakdownSelected]);

  useEffect(() => {
    getLocations();
  }, []);

  const getLocations = async () => {
    try {
      const { data } = await api.getLocations();

      data.results.unshift({ id: null, name: "All My locations" });

      setLocations(data.results);

      if (data.results.length > 0) {
        setLocationSelected(data.results[0]);
      }
    } catch (err) {
      toast.error("Unable to get locations");
    }
  };

  const getGeneralStats = async () => {
    const request = {
      year: yearSelected.id,
      location_id: locationSelected?.id,
      date_grouping: timeBreakdownSelected.name,
    };

    setLoading(true);

    try {
      const { data } = await api.getDailyGeneralStats(request);

      //const response = await api.getGeneralStats(request);

      setDailyStats(data.results);

      // Make a clone of data.results and revert the order of data.results
      const reversedData = [...data.results].reverse();

      let graphData = [];

      reversedData.forEach((result) => {
        graphData.push({
          name: result.date,
          total_value: result.total_cost,
          total_expense: result.total_expense,
        });
      });

      setLineGraphData(graphData);
    } catch (err) {
      toast.error("Unable to get general stats");
    }

    setLoading(false);
  };

  const handleSetLocationSelected = (location) => {
    setLocationSelected(location);
  };

  return (
    <AnimatedPage>
      <div className="mt-4 sm:flex sm:items-center">
        <div className="sm:flex-auto gap-y-4">
          <h1 className="text-lg font-medium">Total Value vs Total Expense</h1>
          <p className="mt-2 text-sm text-gray-700">
            Compare how much you are spending vs how much you have in stock
            across different time periods.
          </p>
        </div>
        <div className="mt-4">
          <Listbox
            value={yearSelected}
            onChange={(year) => setYearSelected(year)}
          >
            {({ open }) => (
              <>
                <div className="relative mt-1">
                  <Listbox.Button
                    className="relative w-full cursor-default rounded-md border
                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                        shadow-sm focus:border-sky-500 focus:outline-none
                                        focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  >
                    <span className="block truncate">
                      {yearSelected ? yearSelected.name : "Select a year"}
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
                      className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      {years.map((year) => (
                        <Listbox.Option
                          key={year.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "text-white bg-red-600"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={year}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {year.name}
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
      <div
        className="mt-4 grid xl:grid-cols-2 lg:grid-cols-2
                            md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-y-4 gap-x-40"
      >
        <div>
          {/* <Listbox
            value={timeBreakdownSelected}
            onChange={(timeBreakdown) =>
              setTimeBreakdownSelected(timeBreakdown)
            }
          >
            {({ open }) => (
              <>
                <div className="relative mt-1">
                  <Listbox.Button
                    className="relative w-full cursor-default rounded-md border
                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                        shadow-sm focus:border-sky-500 focus:outline-none
                                        focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  >
                    <span className="block truncate">
                      {timeBreakdownSelected
                        ? timeBreakdownSelected.name
                        : "Select a time breakdown"}
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
                      className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      {timeBreakdowns.map((timeBreakdown) => (
                        <Listbox.Option
                          key={timeBreakdown.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "text-white bg-red-600"
                                : "text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={timeBreakdown}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {timeBreakdown.name}
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
          </Listbox> */}
        </div>
        <div>
          <Listbox
            value={locationSelected}
            onChange={(location) => handleSetLocationSelected(location)}
          >
            {({ open }) => (
              <>
                <div className="relative mt-1">
                  <Listbox.Button
                    className="relative w-full cursor-default rounded-md border
                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                        shadow-sm focus:border-sky-500 focus:outline-none
                                        focus:ring-1 focus:ring-sky-500 sm:text-sm"
                  >
                    <span className="block truncate">
                      {locationSelected
                        ? locationSelected.name
                        : "Select a location"}
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
                      className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
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
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={location}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {location.name}
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

      <div className="mt-6">
        <ResponsiveContainer width="100%" aspect={2}>
          <LineChart
            width={1500}
            height={1300}
            data={lineGraphData}
            margin={{}}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              style={{
                fontSize: "13px",
              }}
              /* angle={-45}
              textAnchor="end" */
            />
            <YAxis
              style={{
                fontSize: "13px",
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_expense"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="total_value" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-lg font-medium">Inventory Tracking</h1>
            <p className="mt-2 text-sm text-gray-700">
              Checkout your inventory statistics across all locations or at a
              specific location.
            </p>
          </div>
          <div className="mt-4">
            <Listbox
              value={yearSelected}
              onChange={(year) => setYearSelected(year)}
            >
              {({ open }) => (
                <>
                  <div className="relative mt-1">
                    <Listbox.Button
                      className="relative w-full cursor-default rounded-md border
                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                        shadow-sm focus:border-sky-500 focus:outline-none
                                        focus:ring-1 focus:ring-sky-500 sm:text-sm"
                    >
                      <span className="block truncate">
                        {yearSelected ? yearSelected.name : "Select a year"}
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
                        className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      >
                        {years.map((year) => (
                          <Listbox.Option
                            key={year.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "text-white bg-red-600"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={year}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {year.name}
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
        <div
          className="mt-4 grid xl:grid-cols-2 lg:grid-cols-2
                            md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-y-4 gap-x-40"
        >
          <div>
            {/* <Listbox
              value={timeBreakdownSelected}
              onChange={(timeBreakdown) =>
                setTimeBreakdownSelected(timeBreakdown)
              }
            >
              {({ open }) => (
                <>
                  <div className="relative mt-1">
                    <Listbox.Button
                      className="relative w-full cursor-default rounded-md border
                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                        shadow-sm focus:border-sky-500 focus:outline-none
                                        focus:ring-1 focus:ring-sky-500 sm:text-sm"
                    >
                      <span className="block truncate">
                        {timeBreakdownSelected
                          ? timeBreakdownSelected.name
                          : "Select a time breakdown"}
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
                        className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                      >
                        {timeBreakdowns.map((timeBreakdown) => (
                          <Listbox.Option
                            key={timeBreakdown.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "text-white bg-red-600"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={timeBreakdown}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {timeBreakdown.name}
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
            </Listbox> */}
          </div>
          <div>
            <Listbox
              value={locationSelected}
              onChange={(location) => handleSetLocationSelected(location)}
            >
              {({ open }) => (
                <>
                  <div className="relative mt-1">
                    <Listbox.Button
                      className="relative w-full cursor-default rounded-md border
                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                        shadow-sm focus:border-sky-500 focus:outline-none
                                        focus:ring-1 focus:ring-sky-500 sm:text-sm"
                    >
                      <span className="block truncate">
                        {locationSelected
                          ? locationSelected.name
                          : "Select a location"}
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
                        className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
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
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={location}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {location.name}
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
        <div className="mt-2 flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Items
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Value
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Moved Items
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Moved Quantity
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Moved Value
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Additions
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Added Value
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Substractions
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Expense
                    </th>
                    <th
                      scope="col"
                      className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {dailyStats.map((stat) => (
                    <tr key={stat.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                        {stat.date}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                        {stat.total_items}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                        {stat.total_quantity}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 bg-green-100">
                        ${stat.total_cost.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {stat.total_moving_items}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {stat.total_moving_quantity}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        ${stat.total_moving_cost.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {stat.total_additions}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        ${stat.total_add_cost.toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                        {stat.total_subtractions}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500 bg-rose-50 ">
                        ${stat.total_expense.toLocaleString()}
                      </td>
                      <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm sm:pr-0">
                        <ChevronRightIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20 h-1 w-1"></div>
    </AnimatedPage>
  );
};

export default InventoryGrowth;
