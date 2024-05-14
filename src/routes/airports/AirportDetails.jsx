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
  PlusIcon,
  StarIcon,
} from "@heroicons/react/solid";

import AddVendorModal from "./AddVendorModal";

import Loader from "../../components/loader/Loader";
import CreateFBOModal from "./CreateFBOModal";
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

  const [isCreateFboModalOpen, setCreateFboModalOpen] = useState(false);

  const [isAddVendorModalOpen, setAddVendorModalOpen] = useState(false);

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

  const handleToggleCreateFboModal = () => {
    setCreateFboModalOpen(!isCreateFboModalOpen);
  };

  const handleToggleAddVendorModal = () => {
    setAddVendorModalOpen(!isAddVendorModalOpen);
  };

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
    setLoading(true);

    try {
      const { data } = await api.getAirportAvailableUsers(Number(airportId));

      data.forEach((vendor) => {
        vendor.open = true;
      });

      setAvailableVendors(data);
    } catch (err) {
      toast.error("Unable to get available users");
    }

    setLoading(false);
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

  const handleCreateFbo = async (fbo) => {
    const request = {
      airport_id: airportId,
      name: fbo.name,
      is_public: fbo.public,
    };

    try {
      const { data } = await api.createFBO(request);

      setAvailableFbos([...availableFbos, data]);

      toast.success("FBO added!");
    } catch (err) {
      alert("FBO already exists");
      return;
    }

    setCreateFboModalOpen(false);
  };

  const handleAddVendor = async (userId) => {
    const request = {
      airport_id: Number(airportId),
      user_id: Number(userId),
    };

    try {
      await api.addAirportAvailableUser(request);

      toast.success("Vendor added!");
    } catch (err) {
      toast.error("Unable to add vendor");
    }

    setAddVendorModalOpen(false);

    getAirportAvailableUsers();
  };

  const handleRemoveUser = async (userId) => {
    const request = {
      airport_id: Number(airportId),
      user_id: Number(userId),
    };

    try {
      await api.removeAirportAvailableUser(request);

      const newVendors = availableVendors.map((vendor) => {
        const newUsers = vendor.users.filter((user) => user.id !== userId);

        return { ...vendor, users: newUsers };
      });

      setAvailableVendors(newVendors);

      toast.success("User removed");
    } catch (err) {
      toast.error("Unable to remove user");
    }
  };

  const handleToggleSetAsPreferred = async (userId) => {
    const request = {
      user_id: userId,
      airport_id: Number(airportId),
    };

    try {
      await api.togglePreferredProjectManager(request);

      //iterate throug available vendors and set the user as preferred
      const newVendors = availableVendors.map((vendor) => {
        const newUsers = vendor.users.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              is_preferred_project_manager: !user.is_preferred_project_manager,
            };
          } else {
            return { ...user, is_preferred_project_manager: false };
          }
        });

        return { ...vendor, users: newUsers };
      });

      setAvailableVendors(newVendors);

      toast.success("Vendor set as preferred");
    } catch (err) {
      toast.error("Unable to set as preferred");
    }
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
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold">
                    Associated Vendors
                  </div>
                  <div className="text-md text-gray-500 mt-1">
                    Only users from associated vendors will be eligible for job
                    assignments for the selected airport.
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleToggleAddVendorModal()}
                    className="inline-flex items-center justify-center 
                              rounded-md border border-transparent bg-red-600 px-4 py-2
                              text-md font-medium text-white shadow-sm hover:bg-red-700
                              focus:outline-none focus:ring-2 focus:ring-red-500
                              focus:ring-offset-2 sm:w-auto mt-4"
                  >
                    Add Vendor
                  </button>
                </div>
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
                            <ul
                              className={`relative z-0 divide-y  divide-gray-200 `}
                            >
                              <li
                                className={`my-2 border border-gray-200 rounded-md px-2 ${
                                  user.is_preferred_project_manager
                                    ? "bg-green-50 border border-green-200 rounded-md"
                                    : ""
                                }`}
                              >
                                <div
                                  className={`relative flex flex-wrap items-center space-x-3 gap-6 py-5 ${
                                    user.is_preferred_project_manager
                                      ? ""
                                      : "hover:bg-gray-50"
                                  } `}
                                >
                                  <div className="">
                                    <img
                                      className="h-10 w-10 rounded-full"
                                      src={user.avatar}
                                      alt=""
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="focus:outline-none">
                                      <p className="text-md font-medium text-gray-900">
                                        {user.first_name} {user.last_name}
                                      </p>
                                      <p className="truncate text-sm text-gray-500">
                                        {user.email
                                          ? user.email
                                          : "No email specified"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    {!user.is_preferred_project_manager && (
                                      <button
                                        onClick={() =>
                                          handleToggleSetAsPreferred(user.id)
                                        }
                                        className="rounded-md bg-white px-2.5 py-1.5 text-sm
                                                        font-semibold text-gray-900 ring-1 ring-inset ring-gray-300
                                                        hover:bg-gray-50 sm:block cursor-pointer"
                                      >
                                        Set as Preferred
                                      </button>
                                    )}
                                    {user.is_preferred_project_manager && (
                                      <div
                                        onClick={() =>
                                          handleToggleSetAsPreferred(user.id)
                                        }
                                        className="inline-flex items-center rounded-md p-2 px-4 text-md
                                                         font-medium bg-green-100 text-green-700 capitalize cursor-pointer"
                                      >
                                        <StarIcon className="h-4 w-4 mr-2" />
                                        Preferred Vendor
                                      </div>
                                    )}
                                    <button
                                      onClick={() => handleRemoveUser(user.id)}
                                      className="rounded-md bg-white px-2.5 py-1.5 text-sm ml-2
                                                        font-semibold text-gray-900 ring-1 ring-inset ring-gray-300
                                                        hover:bg-gray-50 sm:block cursor-pointer"
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
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
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
                  <div className="flex justify-between gap-2">
                    <div className="font-medium text-md">
                      Available FBOs
                      <span
                        className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                        rounded-full text-md font-medium inline-block"
                      >
                        {availableFbos.length}
                      </span>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => handleToggleCreateFboModal()}
                        className="inline-flex items-center justify-center 
                              rounded-md border border-transparent bg-red-600 px-4 py-2
                              text-md font-medium text-white shadow-sm hover:bg-red-700
                              focus:outline-none focus:ring-2 focus:ring-red-500
                              focus:ring-offset-2 sm:w-auto"
                      >
                        Create New FBO
                      </button>
                    </div>
                  </div>
                  <div className="text-md mt-6">
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

      {isCreateFboModalOpen && (
        <CreateFBOModal
          isOpen={isCreateFboModalOpen}
          handleClose={handleToggleCreateFboModal}
          addFBO={handleCreateFbo}
        />
      )}

      {isAddVendorModalOpen && (
        <AddVendorModal
          isOpen={isAddVendorModalOpen}
          handleClose={handleToggleAddVendorModal}
          addVendor={handleAddVendor}
        />
      )}
    </AnimatedPage>
  );
};

export default AirportDetails;
