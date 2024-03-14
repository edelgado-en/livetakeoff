import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Dialog, Transition, Switch, Menu } from "@headlessui/react";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import {
  PencilIcon,
  ChartBarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/solid";

import ReactTimeAgo from "react-time-ago";

import Loader from "../../components/loader/Loader";

import * as api from "./apiService";

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

const AirportDetails = () => {
  const { airportId } = useParams();
  const [airportDetails, setAirportDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [fbos, setFbos] = useState([]);
  const [totalFbos, setTotalFbos] = useState(0);
  const [loadingFbos, setLoadingFbos] = useState(false);
  const [fboSearchText, setFboSearchText] = useState("");
  const [fboAlreadyAdded, setFboAlreadyAdded] = useState(false);

  const [availableFbos, setAvailableFbos] = useState([]);

  const [availableVendors, setAvailableVendors] = useState([]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchFbos();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [fboSearchText]);

  useEffect(() => {
    getAirportDetails();
    getAvailableFbos();
    getAirportAvailableUsers();
    setFboAlreadyAdded(false);
  }, [airportId]);

  const searchFbos = async () => {
    setLoadingFbos(true);
    try {
      const request = {
        name: fboSearchText,
      };

      const { data } = await api.searchFbos(request);

      setFbos(data.results);
      setTotalFbos(data.count);
      setFboAlreadyAdded(false);

      setLoadingFbos(false);
    } catch (error) {
      setLoadingFbos(false);
    }
  };

  const getAirportAvailableUsers = async () => {
    try {
      const { data } = await api.getAirportAvailableUsers(Number(airportId));

      setAvailableVendors(data);
    } catch (err) {
      toast.error("Unable to get available users");
    }
  };

  const getAirportDetails = async () => {
    setLoading(true);

    try {
      const { data } = await api.getAirportDetails(airportId);

      setAirportDetails(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getAvailableFbos = async () => {
    try {
      const { data } = await api.getAirportAvailableFbos(airportId);

      setAvailableFbos(data);
    } catch (err) {
      toast.error("Unable to get available fbos");
    }
  };

  const addAvailableFbo = async (fboId) => {
    const request = {
      fbo_id: fboId,
      airport_id: airportId,
      action: "add",
    };

    try {
      // check if airportId already exists in available airports array
      const fboExists = availableFbos.find((fbo) => fbo.id === fboId);

      if (fboExists) {
        setFboAlreadyAdded(true);
      } else {
        const { data } = await api.updateAirportAvailableFbo(request);
        setFboAlreadyAdded(false);
        setAvailableFbos([...availableFbos, data]);
      }
    } catch (error) {
      setFboAlreadyAdded(false);
    }
  };

  const deleteAvailableFbo = async (fboId) => {
    try {
      const request = {
        fbo_id: fboId,
        airport_id: airportId,
        action: "delete",
      };

      await api.updateAirportAvailableFbo(request);

      setFboAlreadyAdded(false);

      setAvailableFbos(availableFbos.filter((airport) => airport.id !== fboId));
    } catch (error) {}
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchFbos();
    }
  };

  const handleToggleVendor = (vendor) => {
    const newVendors = availableVendors.map((v) => {
      if (v.name === vendor.name) {
        return { ...v, open: !v.open };
      }
      return v;
    });

    setAvailableVendors(newVendors);
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <div className="xl:px-16 px-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-3xl font-semibold text-gray-900">
              {airportDetails.name}
            </h3>
            <div className="mt-1 text-2xl text-gray-500 ">
              {airportDetails.initials}
            </div>
          </div>
          <div className="grid 2xl:grid-cols-1 xl:grid-cols-1 lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 mt-6 gap-16">
            <div className="">
              <div className="text-xl font-semibold">Associated Vendors</div>
              <div className="text-md text-gray-500 mt-1">
                Only users from associated vendors will be eligible for job
                assignments for the selected airport.
              </div>

              <div className="mt-8">
                {availableVendors.map((vendor, index) => (
                  <div className="border border-gray-200 rounded-md p-6 pb-8 mb-4">
                    <div
                      className="flex justify-between gap-4 cursor-pointer"
                      onClick={() => handleToggleVendor(vendor)}
                    >
                      <div className="flex-1 font-semibold"> {vendor.name}</div>
                      <div>
                        {vendor.open && (
                          <ChevronUpIcon className="h-5 w-5 relative top-2" />
                        )}
                        {!vendor.open && (
                          <ChevronDownIcon className="h-5 w-5 relative top-2" />
                        )}
                      </div>
                    </div>

                    {vendor.open && (
                      <div className="mt-4">
                        {vendor.users.map((user) => (
                          <div key={user.id} className="relative">
                            <ul className="relative z-0 divide-y divide-gray-200">
                              <li>
                                <div className="relative flex items-center space-x-3 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 hover:bg-gray-50">
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
                                        {user.first_name} {user.last_name}
                                      </p>
                                      <p className="truncate text-sm text-gray-500">
                                        {user.email
                                          ? user.email
                                          : "No email specified"}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <span
                                      className={`inline-flex items-center rounded-full
                                          px-2 py-0.5 text-xs
                                          ${
                                            user.is_staff || user.is_super_user
                                              ? "text-green-800 bg-green-100"
                                              : ""
                                          }
                                          ${
                                            user.is_account_manager
                                              ? "text-blue-800 bg-blue-100"
                                              : ""
                                          }
                                          ${
                                            user.is_project_manager
                                              ? "text-violet-800 bg-violet-100"
                                              : ""
                                          }
                                          ${
                                            user.is_internal_coordinator
                                              ? "text-orange-800 bg-orange-100"
                                              : ""
                                          }
                                          ${
                                            user.customer_name
                                              ? "text-sky-800 bg-sky-100"
                                              : ""
                                          } `}
                                    >
                                      {(user.is_staff || user.is_super_user) &&
                                        "Admin"}
                                      {user.is_project_manager && "P. Manager"}
                                      {user.is_account_manager && "A. Manager"}
                                      {user.is_internal_coordinator &&
                                        "Coordinator"}
                                      {user.customer_name && "Customer"}
                                    </span>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="">
              <div className="text-xl font-semibold">Associated FBOs</div>
              <div className="text-md text-gray-500 mt-1">
                Only associated FBOs will be shown when selecting this airport
                at the creation job view.
              </div>

              <div className="mt-8 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                <div
                  className="border border-gray-200 rounded-md p-4"
                  style={{ height: "900px" }}
                >
                  <div className="font-medium text-md">
                    <div className="flex justify-between">
                      <div>
                        All FBOs
                        <span
                          className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                            rounded-full text-md font-medium inline-block"
                        >
                          {totalFbos}
                        </span>
                      </div>
                      <div>
                        {fboAlreadyAdded && (
                          <div className="text-red-500 text-md relative top-1">
                            FBO already added
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 my-2">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div
                          onClick={() => searchFbos()}
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
                          value={fboSearchText}
                          onChange={(event) =>
                            setFboSearchText(event.target.value)
                          }
                          onKeyDown={handleKeyDown}
                          className="block w-full rounded-md border-gray-300 pl-10
                                                                    focus:border-sky-500 text-md
                                                                    focus:ring-sky-500  font-normal"
                          placeholder="Search name..."
                        />
                      </div>
                    </div>
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "700px" }}
                    >
                      {fbos.map((fbo) => (
                        <div key={fbo.id} className="relative">
                          <ul className="">
                            <li className="">
                              <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                <div className="min-w-0 flex-1">
                                  <p className="text-md text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                    {fbo.name}
                                  </p>
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => addAvailableFbo(fbo.id)}
                                    className="inline-flex items-center rounded border
                                                border-gray-300 bg-white px-2 py-1 text-sm
                                                text-gray-700 shadow-sm
                                                hover:bg-gray-50 focus:outline-none focus:ring-2
                                                                                            "
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className="border border-gray-200 rounded-md p-4"
                  style={{ height: "900px" }}
                >
                  <div className="font-medium text-md">
                    Available FBOs
                    <span
                      className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-md font-medium inline-block"
                    >
                      {availableFbos.length}
                    </span>
                  </div>
                  <div className="text-md">
                    {availableFbos.length === 0 && (
                      <div className="text-center m-auto mt-24 text-md">
                        No available FBOs set.
                      </div>
                    )}

                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "700px" }}
                    >
                      {availableFbos.map((fbo) => (
                        <div key={fbo.id} className="relative">
                          <ul className="">
                            <li className="">
                              <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                <div className="min-w-0 flex-1">
                                  <p className="text-md text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                    {fbo.name}
                                  </p>
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => deleteAvailableFbo(fbo.id)}
                                    className="inline-flex items-center rounded border
                                            border-gray-300 bg-white px-2 py-1 text-sm
                                            text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2
                                            "
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};

export default AirportDetails;
