import { useEffect, useState, Fragment } from "react";
import { CashIcon, ArchiveIcon } from "@heroicons/react/outline";

import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "./apiService";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";
import { set } from "react-hook-form";

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

const InventoryCurrentStats = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [currentStats, setCurrentStats] = useState(null);
  const [locationStatsLoading, setLocationStatsLoading] = useState(false);
  const [locationStats, setLocationStats] = useState([]);
  const [outOfStockLocations, setOutOfStockLocations] = useState([]);
  const [lowStockLocations, setLowStockLocations] = useState([]);
  const [showOutofStockLocations, setShowOutofStockLocations] = useState(false);
  const [showLowStockLocations, setShowLowStockLocations] = useState(false);

  useEffect(() => {
    getInventoryStats();
  }, []);

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

  const getOutOfStockLocationStats = async () => {
    setLocationStatsLoading(true);

    const request = {
      outOfStock: true,
    };

    try {
      const { data } = await api.getLocationsStats(request);

      setOutOfStockLocations(data);
    } catch (err) {
      toast.error("Unable to get location stats");
    }

    setLocationStatsLoading(false);
  };

  const getLowInStockLocationStats = async () => {
    setLocationStatsLoading(true);

    const request = {
      lowStock: true,
    };

    try {
      const { data } = await api.getLocationsStats(request);

      setLowStockLocations(data);
    } catch (err) {
      toast.error("Unable to get location stats");
    }

    setLocationStatsLoading(false);
  };

  const handleShowOutofStockLocations = () => {
    if (!showOutofStockLocations) {
      getOutOfStockLocationStats();
    } else {
      setLocationStats([]);
    }

    setShowOutofStockLocations(!showOutofStockLocations);
  };

  const handleShowLowStockLocations = () => {
    if (!showLowStockLocations) {
      getLowInStockLocationStats();
    } else {
      setLocationStats([]);
    }

    setShowLowStockLocations(!showLowStockLocations);
  };

  const handleOutOfStockGoToInventory = (location) => {
    localStorage.setItem("locationSelected", JSON.stringify(location));
    localStorage.setItem("outOfStockMet", JSON.stringify(true));
    localStorage.setItem("lowStockMet", JSON.stringify(false));

    navigate("/inventory");
  };

  const handleLowStockGoToInventory = (location) => {
    localStorage.setItem("locationSelected", JSON.stringify(location));
    localStorage.setItem("lowStockMet", JSON.stringify(true));
    localStorage.setItem("outOfStockMet", JSON.stringify(false));

    navigate("/inventory");
  };

  return (
    <AnimatedPage>
      <div className="px-2 max-w-7xl m-auto">
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
                    Inventory Value
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
                <dd className="ml-16 flex justify-between items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {currentStats.total_low_stock}
                  </p>
                  <button
                    onClick={() => handleShowLowStockLocations()}
                    className="text-sm text-gray-500 cursor-pointer"
                  >
                    {showLowStockLocations
                      ? "Hide Locations"
                      : "Show Locations"}
                  </button>
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
                <dd className="ml-16 flex justify-between items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {currentStats.total_out_of_stock}
                  </p>
                  <button
                    onClick={() => handleShowOutofStockLocations()}
                    className="text-sm text-gray-500 cursor-pointer"
                  >
                    {showOutofStockLocations
                      ? "Hide Locations"
                      : "Show Locations"}
                  </button>
                </dd>
              </div>
            </dl>

            {showLowStockLocations && (
              <div className="mt-6">
                <div className="flex justify-between">
                  <div className="text-lg font-medium tracking-tight">
                    Low Stock Locations
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="whitespace-nowrap py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Location
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Items
                          </th>
                          <th
                            scope="col"
                            className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                          ></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {lowStockLocations.map((location) => (
                          <tr key={location.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap py-2  pr-3 text-sm text-gray-500 sm:pl-0">
                              {location.name}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                              {location.count}
                            </td>
                            <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm sm:pr-0">
                              <button
                                onClick={() =>
                                  handleLowStockGoToInventory(location)
                                }
                                className="text-blue-500"
                              >
                                <div className="hidden xl:block lg:block md:block">
                                  Go to Inventory
                                </div>
                                <div className="xl:hidden lg:hidden md:hidden">
                                  Go
                                </div>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {showOutofStockLocations && (
              <div className="mt-6">
                <div className="flex justify-between">
                  <div className="text-lg font-medium tracking-tight">
                    Out of Stock Locations
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="whitespace-nowrap py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            Location
                          </th>
                          <th
                            scope="col"
                            className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Items
                          </th>
                          <th
                            scope="col"
                            className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0"
                          ></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {outOfStockLocations.map((location) => (
                          <tr key={location.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap py-2 pr-3 text-sm text-gray-500 sm:pl-0">
                              {location.name}
                            </td>
                            <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                              {location.count}
                            </td>
                            <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm sm:pr-0">
                              <button
                                onClick={() =>
                                  handleOutOfStockGoToInventory(location)
                                }
                                className="text-blue-500"
                              >
                                <div className="hidden xl:block lg:block md:block">
                                  Go to Inventory
                                </div>
                                <div className="xl:hidden lg:hidden md:hidden">
                                  Go
                                </div>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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
                      Locations by Accuracy
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
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default InventoryCurrentStats;
