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

import { PencilIcon, ChartBarIcon } from "@heroicons/react/solid";

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

  const [availableUsers, setAvailableUsers] = useState([]);

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

      setAvailableUsers(data);
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

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <div className="max-w-7xl m-auto px-6">
          <div className="">
            <div className="">
              <h3 className="text-2xl font-semibold text-center text-gray-900">
                {airportDetails.name}
              </h3>
              <div className="mt-1 text-xl text-gray-500 text-center">
                {airportDetails.initials}
              </div>

              <div className="mt-4">
                <div className="text-md text-gray-500 px-4">
                  Associate FBOs to this airport. Only associated FBOs will be
                  shown when selecting this airport at the creation job view.
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
                                                                                    border-gray-300 bg-white px-2 py-1 text-md
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
                                    <p className="text-lg text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                      {fbo.name}
                                    </p>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => deleteAvailableFbo(fbo.id)}
                                      className="inline-flex items-center rounded border
                                      border-gray-300 bg-white px-2 py-1 text-md
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
        </div>
      )}
    </AnimatedPage>
  );
};

export default AirportDetails;
