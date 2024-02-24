import { Fragment, useState, useEffect } from "react";
import {
  Link,
  useParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/outline";
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

const CustomerServices = () => {
  const { customerId } = useParams();

  const [showServiceSection, setShowServiceSection] = useState(false);
  const [showRetainerSection, setShowRetainerSection] = useState(false);

  const [loading, setLoading] = useState(false);

  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [servicesSearchText, setServicesSearchText] = useState("");
  const [serviceAlreadyAdded, setServiceAlreadyAdded] = useState(false);
  const [availableServices, setAvailableServices] = useState([]);

  const [retainers, setRetainers] = useState([]);
  const [totalRetainers, setTotalRetainers] = useState(0);
  const [retainersSearchText, setRetainersSearchText] = useState("");
  const [retainerAlreadyAdded, setRetainerAlreadyAdded] = useState(false);
  const [availableRetainers, setAvailableRetainers] = useState([]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getServices();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [servicesSearchText]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getRetainers();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [retainersSearchText]);

  useEffect(() => {
    getAvailableServices();
  }, [customerId]);

  useEffect(() => {
    getAvailableRetainers();
  }, [customerId]);

  const getServices = async () => {
    setLoading(true);

    const request = {
      name: servicesSearchText,
    };

    try {
      const { data } = await api.getServices(request);
      setServices(data.results);
      setTotalServices(data.count);
      setServiceAlreadyAdded(false);
    } catch (err) {
      toast.error("Unable to get services");
    }

    setLoading(false);
  };

  const getRetainers = async () => {
    setLoading(true);

    const request = {
      name: retainersSearchText,
    };

    try {
      const { data } = await api.getRetainers(request);
      setRetainers(data.results);
      setTotalRetainers(data.count);
      setRetainerAlreadyAdded(false);
    } catch (err) {
      toast.error("Unable to get retainers");
    }

    setLoading(false);
  };

  const getAvailableServices = async () => {
    try {
      const { data } = await api.getCustomerAvailableServices(
        Number(customerId)
      );

      setAvailableServices(data);
    } catch (err) {
      toast.error("Unable to get services for customer");
    }
  };

  const getAvailableRetainers = async () => {
    try {
      const { data } = await api.getCustomerAvailableRetainers(
        Number(customerId)
      );

      setAvailableRetainers(data);
    } catch (err) {
      toast.error("Unable to get services for customer");
    }
  };

  const addAvailableService = async (serviceId) => {
    const request = {
      customer_id: customerId,
      service_id: serviceId,
      action: "add",
    };

    try {
      // check if serviceId already exists in available services array
      const serviceExists = availableServices.find(
        (service) => service.id === serviceId
      );

      if (serviceExists) {
        setServiceAlreadyAdded(true);
      } else {
        const { data } = await api.updateCustomerAvailableService(request);
        setServiceAlreadyAdded(false);
        setAvailableServices([...availableServices, data]);

        toast.success("service added");
      }
    } catch (error) {
      setServiceAlreadyAdded(false);
    }
  };

  const addAvailableRetainer = async (retainerId) => {
    const request = {
      customer_id: customerId,
      retainer_id: retainerId,
      action: "add",
    };

    try {
      // check if retainerId already exists in available retainers array
      const retainerExists = availableRetainers.find(
        (retainer) => retainer.id === retainerId
      );

      if (retainerExists) {
        setRetainerAlreadyAdded(true);
      } else {
        const { data } = await api.updateCustomerAvailableRetainer(request);
        setRetainerAlreadyAdded(false);
        setAvailableRetainers([...availableRetainers, data]);

        toast.success("retainer added");
      }
    } catch (error) {
      setRetainerAlreadyAdded(false);
    }
  };

  const deleteAvailableService = async (serviceId) => {
    try {
      const request = {
        customer_id: customerId,
        service_id: serviceId,
        action: "delete",
      };

      await api.updateCustomerAvailableService(request);

      setServiceAlreadyAdded(false);

      setAvailableServices(
        availableServices.filter((service) => service.id !== serviceId)
      );

      toast.success("service removed");
    } catch (error) {
      toast.error("Unable to remove service");
    }
  };

  const deleteAvailableRetainer = async (retainerId) => {
    try {
      const request = {
        customer_id: customerId,
        retainer_id: retainerId,
        action: "delete",
      };

      await api.updateCustomerAvailableRetainer(request);

      setRetainerAlreadyAdded(false);

      setAvailableRetainers(
        availableRetainers.filter((retainer) => retainer.id !== retainerId)
      );

      toast.success("retainer removed");
    } catch (error) {
      toast.error("Unable to remove retainer");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      getServices();
    }
  };

  const handleKeyDownRetainer = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      getRetainers();
    }
  };

  return (
    <AnimatedPage>
      <div className="mx-auto mt-2 max-w-7xl px-4 sm:px-6 lg:px-8 lg:pr-52">
        {loading && <Loader />}

        {!loading && (
          <>
            <div className="mt-8 border border-gray-200 rounded-md p-6 pb-8">
              <div
                className="flex justify-between cursor-pointer"
                onClick={() => setShowServiceSection(!showServiceSection)}
              >
                <div className="flex-1">
                  <div className="font-medium text-xl">Services</div>
                  <div className="text-md text-gray-500 mt-1">
                    <p>
                      Manage services. Only the specified services will be
                      taking into consideration when creating jobs.
                    </p>
                    <p>
                      If none specified, all services will be taking into
                      consideration.
                    </p>
                  </div>
                </div>
                <div>
                  {showServiceSection && (
                    <ChevronUpIcon className="h-5 w-5 relative top-4" />
                  )}
                  {!showServiceSection && (
                    <ChevronDownIcon className="h-5 w-5 relative top-4" />
                  )}
                </div>
              </div>

              {showServiceSection && (
                <div className="mt-8 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                  <div
                    className="border border-gray-200 rounded-md p-4"
                    style={{ height: "680px" }}
                  >
                    <div className="font-medium text-sm">
                      <div className="flex justify-between">
                        <div>
                          All Services
                          <span
                            className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                            rounded-full text-sm font-medium inline-block"
                          >
                            {totalServices}
                          </span>
                        </div>
                        <div>
                          {serviceAlreadyAdded && (
                            <div className="text-red-500 text-sm relative top-1">
                              Service already added
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
                            onClick={() => getServices()}
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
                            value={servicesSearchText}
                            onChange={(event) =>
                              setServicesSearchText(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            className="block w-full rounded-md border-gray-300 pl-10
                                                                    focus:border-sky-500 text-sm
                                                                    focus:ring-sky-500  font-normal"
                            placeholder="Search name..."
                          />
                        </div>
                      </div>
                      <div
                        className="overflow-y-auto"
                        style={{ maxHeight: "560px" }}
                      >
                        {services.map((service) => (
                          <div key={service.id} className="relative">
                            <ul className="">
                              <li className="">
                                <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                      {service.name}
                                    </p>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addAvailableService(service.id)
                                      }
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
                    style={{ height: "680px" }}
                  >
                    <div className="font-medium text-sm">
                      Available Services
                      <span
                        className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-sm font-medium inline-block"
                      >
                        {availableServices.length}
                      </span>
                    </div>
                    <div className="text-sm">
                      {availableServices.length === 0 && (
                        <div className="text-center m-auto mt-24 text-sm">
                          No available services set.
                        </div>
                      )}

                      <div
                        className="overflow-y-auto"
                        style={{ maxHeight: "560px" }}
                      >
                        {availableServices.map((service) => (
                          <div key={service.id} className="relative">
                            <ul className="">
                              <li className="">
                                <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                      {service.name}
                                    </p>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteAvailableService(service.id)
                                      }
                                      className="inline-flex items-center rounded border
                                                                                                border-gray-300 bg-white px-2 py-1 text-sm
                                                                                                text-gray-700 shadow-sm
                                                                                                hover:bg-gray-100 focus:outline-none focus:ring-2
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
              )}
            </div>

            <div className="mt-8 border border-gray-200 rounded-md p-6 pb-8">
              <div
                className="flex justify-between cursor-pointer"
                onClick={() => setShowRetainerSection(!showRetainerSection)}
              >
                <div className="flex-1">
                  <div className="font-medium text-xl">Retainers</div>
                  <div className="text-md text-gray-500 mt-1">
                    <p>
                      Manage retainers. Only the specified retainers will be
                      taking into consideration when creating jobs.
                    </p>
                    <p>
                      If none specified, all retainers will be taking into
                      consideration.
                    </p>
                  </div>
                </div>
                <div>
                  {showRetainerSection && (
                    <ChevronUpIcon className="h-5 w-5 relative top-4" />
                  )}
                  {!showRetainerSection && (
                    <ChevronDownIcon className="h-5 w-5 relative top-4" />
                  )}
                </div>
              </div>

              {showRetainerSection && (
                <div className="mt-8 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                  <div
                    className="border border-gray-200 rounded-md p-4"
                    style={{ height: "680px" }}
                  >
                    <div className="font-medium text-sm">
                      <div className="flex justify-between">
                        <div>
                          All Retainers
                          <span
                            className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                            rounded-full text-sm font-medium inline-block"
                          >
                            {totalRetainers}
                          </span>
                        </div>
                        <div>
                          {retainerAlreadyAdded && (
                            <div className="text-red-500 text-sm relative top-1">
                              Retainer already added
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
                            onClick={() => getRetainers()}
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
                            value={retainersSearchText}
                            onChange={(event) =>
                              setRetainersSearchText(event.target.value)
                            }
                            onKeyDown={handleKeyDownRetainer}
                            className="block w-full rounded-md border-gray-300 pl-10
                                                                    focus:border-sky-500 text-sm
                                                                    focus:ring-sky-500  font-normal"
                            placeholder="Search name..."
                          />
                        </div>
                      </div>
                      <div
                        className="overflow-y-auto"
                        style={{ maxHeight: "560px" }}
                      >
                        {retainers.map((retainer) => (
                          <div key={retainer.id} className="relative">
                            <ul className="">
                              <li className="">
                                <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                      {retainer.name}
                                    </p>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        addAvailableRetainer(retainer.id)
                                      }
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
                    style={{ height: "680px" }}
                  >
                    <div className="font-medium text-sm">
                      Available Retainers
                      <span
                        className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-sm font-medium inline-block"
                      >
                        {availableRetainers.length}
                      </span>
                    </div>
                    <div className="text-sm">
                      {availableRetainers.length === 0 && (
                        <div className="text-center m-auto mt-24 text-sm">
                          No available retainers set.
                        </div>
                      )}

                      <div
                        className="overflow-y-auto"
                        style={{ maxHeight: "560px" }}
                      >
                        {availableRetainers.map((retainer) => (
                          <div key={retainer.id} className="relative">
                            <ul className="">
                              <li className="">
                                <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                      {retainer.name}
                                    </p>
                                  </div>
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        deleteAvailableRetainer(retainer.id)
                                      }
                                      className="inline-flex items-center rounded border
                                                                                                border-gray-300 bg-white px-2 py-1 text-sm
                                                                                                text-gray-700 shadow-sm
                                                                                                hover:bg-gray-100 focus:outline-none focus:ring-2
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
              )}
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default CustomerServices;
