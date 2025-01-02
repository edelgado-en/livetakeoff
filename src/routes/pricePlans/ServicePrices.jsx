import { useState, useEffect, Fragment } from "react";
import {
  ChevronLeftIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
  ShareIcon,
  CheckCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";
import { useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import { Dialog, Transition, Listbox, RadioGroup } from "@headlessui/react";
import { Link } from "react-router-dom";
import * as api from "./apiService";
import { toast } from "react-toastify";

import { fetchUser, selectUser } from "../../routes/userProfile/userSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

const groupOptions = [{ name: "By Aircraft" }, { name: "By Service" }];

const XMarkIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-white"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
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
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ServicePrices = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const { pricePlanId } = useParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [totalAircraftTypes, setTotalAircraftTypes] = useState(0);
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [aircraftTypeSelected, setAircraftTypeSelected] = useState(null);
  const [aircraftSearchName, setAircraftSearchName] = useState("");
  const [estimatedCompletionTime, setEstimatedCompletionTime] = useState("");
  const [pricePlans, setPricePlans] = useState([]);
  const [priceListing, setPriceListing] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [serviceSearchName, setServiceSearchName] = useState("");
  const [services, setServices] = useState([]);
  const [serviceSelected, setServiceSelected] = useState(null);
  const [totalServices, setTotalServices] = useState(0);

  const [groupOptionSelected, setGroupOptionSelected] = useState(
    groupOptions[0]
  );

  const [pricePlansSelected, setPricePlansSelected] = useState([]);

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  useEffect(() => {
    searchPricePlans();
  }, []);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchAircrafts();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [aircraftSearchName]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchServices();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [serviceSearchName]);

  const searchAircrafts = async () => {
    setLoading(true);

    const request = {
      name: aircraftSearchName,
    };

    const { data } = await api.getAircraftTypes(request);

    setTotalAircraftTypes(data.count);
    setAircraftTypes(data.results);

    setLoading(false);
  };

  const searchServices = async () => {
    setLoading(true);

    const request = {
      name: serviceSearchName,
    };

    try {
      const { data } = await api.getServices(request);
      setServices(data.results);
      setTotalServices(data.count);
    } catch (err) {
      toast.error("Unable to get services");
    }
    setLoading(false);
  };

  const searchPricePlans = async () => {
    const response = await api.getPricingPlans();

    setPricePlans(response.data.results);

    //find the pricePlan with id selectedPricePlanId
    const pricePlan = response.data.results.find(
      (item) => item.id === parseInt(pricePlanId)
    );

    if (pricePlan) {
      setPricePlansSelected([pricePlan]);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchAircrafts();
    }
  };

  const handleKeyDownServices = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchServices();
    }
  };

  const getAircraftDetails = async (aircraftType) => {
    const newAircraftTypes = aircraftTypes.map((item) => {
      if (item.id === aircraftType.id) {
        item.showDetails = !item.showDetails;
      } else {
        item.showDetails = false;
      }

      return item;
    });

    setAircraftTypes(newAircraftTypes);
    setAircraftTypeSelected(aircraftType);

    const request = {
      aircraft_type_id: aircraftType.id,
      price_list_ids: pricePlansSelected.map((item) => item.id),
    };

    const response = await api.getPricesListing(request);

    setPriceListing(response.data);
  };

  const getServiceDetails = async (service) => {
    const newServices = services.map((item) => {
      if (item.id === service.id) {
        item.showDetails = !item.showDetails;
      } else {
        item.showDetails = false;
      }

      return item;
    });

    setServices(newServices);
    setServiceSelected(service);

    const request = {
      service_id: service.id,
      price_list_ids: pricePlansSelected.map((item) => item.id),
    };

    const response = await api.getPricesListingByService(request);

    setPriceListing(response.data);
  };

  const updateServicePrice = (serviceName, priceListName, updatedPrice) => {
    const price = updatedPrice
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

    const updatedPriceListing = priceListing.map((priceList) => {
      if (priceList.service === serviceName) {
        const updatedPriceListEntries = priceList.price_list_entries.map(
          (entry) => {
            if (entry.price_list === priceListName) {
              return {
                ...entry,
                price: price,
              };
            }

            return entry;
          }
        );

        return {
          ...priceList,
          price_list_entries: updatedPriceListEntries,
        };
      }

      return priceList;
    });

    setPriceListing(updatedPriceListing);
  };

  const updateAircraftPrice = (
    aircraftTypeName,
    priceListName,
    updatedPrice
  ) => {
    const price = updatedPrice
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

    const updatedPriceListing = priceListing.map((priceList) => {
      if (priceList.aircraft_type === aircraftTypeName) {
        const updatedPriceListEntries = priceList.price_list_entries.map(
          (entry) => {
            if (entry.price_list === priceListName) {
              return {
                ...entry,
                price: price,
              };
            }

            return entry;
          }
        );

        return {
          ...priceList,
          price_list_entries: updatedPriceListEntries,
        };
      }

      return priceList;
    });

    setPriceListing(updatedPriceListing);
  };

  const saveChangesForPricePlan = async (pricePlanName) => {
    const priceListEntries = priceListing.map((priceList) => {
      const priceListEntry = priceList.price_list_entries.find(
        (entry) => entry.price_list === pricePlanName
      );

      return {
        service: priceList.service,
        price: priceListEntry.price,
      };
    });

    const request = {
      name: pricePlanName,
      price_list_entries: priceListEntries,
      aircraft_type_id: aircraftTypeSelected?.id,
    };

    setUpdateLoading(true);

    try {
      await api.updatePricePlan(aircraftTypeSelected?.id, request);

      toast.success("Price list updated successfully");

      setUpdateLoading(false);
    } catch (error) {
      setUpdateLoading(false);
    }
  };

  const saveChangesForPricePlanByService = async (pricePlanName) => {
    const priceListEntries = priceListing.map((priceList) => {
      const priceListEntry = priceList.price_list_entries.find(
        (entry) => entry.price_list === pricePlanName
      );

      return {
        aircraft_type: priceList.aircraft_type,
        price: priceListEntry.price,
      };
    });

    const request = {
      name: pricePlanName,
      price_list_entries: priceListEntries,
      service_id: serviceSelected?.id,
    };

    setUpdateLoading(true);

    try {
      await api.updatePricePlanByService(serviceSelected?.id, request);

      toast.success("Price list updated successfully");

      setUpdateLoading(false);
    } catch (error) {
      setUpdateLoading(false);
    }
  };

  const handleGroupOptionChange = async (event) => {
    setGroupOptionSelected(event);

    setAircraftTypeSelected(null);
    setServiceSelected(null);

    //iterate through the aircraft types and set showDetails to false
    const newAircraftTypes = aircraftTypes.map((item) => {
      item.showDetails = false;
      return item;
    });

    setAircraftTypes(newAircraftTypes);

    //iterate through the services and set showDetails to false
    const newServices = services.map((item) => {
      item.showDetails = false;
      return item;
    });

    setServices(newServices);
  };

  const handleSetPricePlansSelected = async (event) => {
    setPricePlansSelected(event);

    const request = {
      aircraft_type_id: aircraftTypeSelected?.id,
      service_id: serviceSelected?.id,
      price_list_ids: event.map((item) => item.id),
    };

    if (groupOptionSelected.name === "By Aircraft") {
      if (aircraftTypeSelected) {
        const response = await api.getPricesListing(request);

        setPriceListing(response.data);
      }
    }

    if (groupOptionSelected.name === "By Service") {
      if (serviceSelected) {
        const response = await api.getPricesListingByService(request);

        setPriceListing(response.data);
      }
    }
  };

  return (
    <div className="flex h-full -mt-8">
      {/* Side bar for mobile */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full
                                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white border-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex-shrink-0 border-t border-gray-200 p-4">
                  <div className="flex justify-between">
                    <h2 className="text-2xl font-medium text-gray-900">
                      Aircrafts
                    </h2>
                    <div></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    Search list of {totalAircraftTypes} aircrafts types
                  </p>
                  <form className="mt-6 flex space-x-4" action="#">
                    <div className="min-w-0 flex-1">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div
                          onClick={() => searchAircrafts()}
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
                          value={aircraftSearchName}
                          onChange={(event) =>
                            setAircraftSearchName(event.target.value)
                          }
                          onKeyDown={handleKeyDown}
                          className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                    focus:ring-sky-500 sm:text-sm"
                          placeholder="Search name..."
                        />
                      </div>
                    </div>
                  </form>
                  {/* Directory list Mobile */}
                  <nav
                    className="min-h-0 flex-1 overflow-y-auto mt-5"
                    style={{ height: "800px", paddingBottom: "250px" }}
                  >
                    {loading && <Loader />}

                    {!loading && totalAircraftTypes === 0 && (
                      <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                        <p className="font-semibold">No aircrafts found.</p>
                        <p>
                          You can add an aircraft by clicking on the plus icon.
                        </p>
                      </div>
                    )}
                    <ul
                      role="list"
                      className="relative z-0 divide-y divide-gray-200"
                    >
                      {aircraftTypes.map((aircraft) => (
                        <li
                          key={aircraft.id}
                          onClick={() => getAircraftDetails(aircraft)}
                        >
                          <div
                            className={`${
                              aircraft.showDetails
                                ? " border-2 border-red-500"
                                : ""
                            } cursor-pointer relative flex items-center space-x-3 px-6 py-5 hover:bg-gray-50`}
                          >
                            <div className="min-w-0 flex-1">
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              <p className="text-sm font-medium text-gray-900">
                                {aircraft.name}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-0 flex flex-1 overflow-hidden">
          <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
            {/* Mobile only */}
            <nav
              className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden"
              aria-label="Breadcrumb"
            >
              <div
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
              >
                <ChevronLeftIcon
                  className="-ml-2 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Aircrafts</span>
              </div>
            </nav>

            <article className="m-auto max-w-full px-4">
              <div>
                {updateLoading && (
                  <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                    <div
                      className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                      aria-hidden="true"
                    >
                      <div
                        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                        style={{
                          clipPath:
                            "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                        }}
                      />
                    </div>
                    <div
                      className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                      aria-hidden="true"
                    >
                      <div
                        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                        style={{
                          clipPath:
                            "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                        }}
                      />
                    </div>
                    <p className="text-lg leading-6 py-2 text-gray-900 font-medium">
                      Updating open jobs...
                    </p>
                    <div className="flex flex-1 justify-end"></div>
                  </div>
                )}
                {/* Comparison table */}
                <div className="mx-auto max-w-full bg-white pb-16 sm:pb-16 lg:max-w-full pt-1">
                  <div className="" style={{ minWidth: "820px" }}>
                    <div className="mt-2" style={{ width: "350px" }}>
                      <Listbox
                        multiple
                        value={pricePlansSelected}
                        onChange={handleSetPricePlansSelected}
                      >
                        {({ open }) => (
                          <>
                            <div className="relative">
                              <Listbox.Button
                                className="relative w-full cursor-default rounded-md border
                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                    shadow-sm focus:border-sky-500 focus:outline-none
                                    focus:ring-1 focus:ring-sky-500 text-md"
                              >
                                <span className="block truncate">
                                  {pricePlansSelected.length > 0 &&
                                    pricePlansSelected
                                      .map((pricePlan) => pricePlan.name)
                                      .join(", ")}

                                  {pricePlansSelected.length === 0 &&
                                    "Select price list"}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronDownIcon
                                    className="h-4 w-4 text-gray-400"
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
                                  className="absolute left-0 z-150 mt-1 max-h-72 w-full overflow-auto
                                                                    rounded-md bg-white py-1 shadow-lg ring-1
                                                                    ring-black ring-opacity-5 focus:outline-none text-md"
                                >
                                  {pricePlans.map((pricePlan) => (
                                    <Listbox.Option
                                      key={pricePlan.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "text-white bg-red-600"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                      value={pricePlan}
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
                                            {pricePlan.name}
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
                    {groupOptionSelected.name === "By Aircraft" &&
                      aircraftTypeSelected === null && (
                        <div className="text-lg text-gray-700 mt-4">
                          Select an aircraft.
                        </div>
                      )}

                    {groupOptionSelected.name === "By Service" &&
                      serviceSelected === null && (
                        <div className="text-lg text-gray-700 mt-4">
                          Select a service.
                        </div>
                      )}

                    {groupOptionSelected.name === "By Aircraft" &&
                      aircraftTypeSelected !== null && (
                        <table className="mt-2 min-w-full divide-y divide-gray-300 table-fixed">
                          <thead>
                            <tr>
                              <th
                                className="pb-1 text-left text-sm font-medium text-gray-900"
                                scope="col"
                              >
                                Aircraft
                              </th>
                              {pricePlansSelected.map((pricePlan) => (
                                <th
                                  key={pricePlan.name}
                                  className="px-6 pb-1 text-left text-sm font-medium leading-6 text-gray-900"
                                  scope="col"
                                >
                                  {pricePlan.name} - {pricePlan.id}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                            {priceListing.map((entry) => (
                              <tr
                                key={entry.service}
                                className="hover:bg-gray-100"
                              >
                                <th
                                  className="py-2 text-left text-sm font-normal text-gray-600"
                                  style={{ width: "500px" }}
                                  scope="row"
                                >
                                  {entry.service}
                                </th>
                                {entry.price_list_entries.map((priceList) => (
                                  <td
                                    key={priceList.price_list}
                                    className="py-1 px-6"
                                  >
                                    <input
                                      type="text"
                                      name="price"
                                      id="price"
                                      value={priceList.price}
                                      onChange={(e) =>
                                        updateServicePrice(
                                          entry.service,
                                          priceList.price_list,
                                          e.target.value
                                        )
                                      }
                                      style={{ width: "80px" }}
                                      className="block border-gray-300 py-2
                                                         focus:border-gray-500 focus:ring-gray-500
                                                      text-xs"
                                    ></input>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                          {(currentUser.isAdmin ||
                            currentUser.isSuperUser ||
                            currentUser.isAccountManager) && (
                            <tfoot>
                              <tr className="border-t border-gray-200">
                                <th className="sr-only" scope="row"></th>
                                {pricePlansSelected.map((pricePlan) => (
                                  <td
                                    key={pricePlan.name}
                                    className="px-6 pt-5"
                                  >
                                    <button
                                      disabled={updateLoading}
                                      onClick={() =>
                                        saveChangesForPricePlan(pricePlan.name)
                                      }
                                      className="block w-24 rounded-md border
                                                    border-transparent bg-red-500
                                                    py-2 px-1 text-center text-xs font-semibold
                                                    text-white shadow hover:to-pink-600"
                                    >
                                      Save Changes
                                    </button>
                                  </td>
                                ))}
                              </tr>
                            </tfoot>
                          )}
                        </table>
                      )}

                    {groupOptionSelected.name === "By Service" &&
                      serviceSelected !== null && (
                        <table className="mt-2 min-w-full divide-y divide-gray-300 table-fixed">
                          <thead>
                            <tr>
                              <th
                                className="pb-1 text-left text-sm font-medium text-gray-900"
                                scope="col"
                              >
                                Service
                              </th>
                              {pricePlansSelected.map((pricePlan) => (
                                <th
                                  key={pricePlan.name}
                                  className="px-6 pb-1 text-left text-sm font-medium leading-6 text-gray-900"
                                  scope="col"
                                >
                                  {pricePlan.name} - {pricePlan.id}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 border-t border-gray-200">
                            {priceListing.map((entry) => (
                              <tr
                                key={entry.aircraft_type}
                                className="hover:bg-gray-100"
                              >
                                <th
                                  className="py-2 text-left text-sm font-normal text-gray-600"
                                  style={{ width: "500px" }}
                                  scope="row"
                                >
                                  {entry.aircraft_type}
                                </th>
                                {entry.price_list_entries.map((priceList) => (
                                  <td
                                    key={priceList.price_list}
                                    className="py-1 px-6"
                                  >
                                    <input
                                      type="text"
                                      name="price"
                                      id="price"
                                      value={priceList.price}
                                      onChange={(e) =>
                                        updateAircraftPrice(
                                          entry.aircraft_type,
                                          priceList.price_list,
                                          e.target.value
                                        )
                                      }
                                      style={{ width: "80px" }}
                                      className="block border-gray-300 py-2
                                                         focus:border-gray-500 focus:ring-gray-500
                                                      text-xs"
                                    ></input>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-gray-200">
                              <th className="sr-only" scope="row"></th>
                              {pricePlansSelected.map((pricePlan) => (
                                <td key={pricePlan.name} className="px-6 pt-5">
                                  <button
                                    disabled={updateLoading}
                                    onClick={() =>
                                      saveChangesForPricePlanByService(
                                        pricePlan.name
                                      )
                                    }
                                    className="block w-24 rounded-md border
                                                border-transparent bg-red-500
                                                  py-2 px-1 text-center text-xs font-semibold
                                                  text-white shadow hover:to-pink-600"
                                  >
                                    Save Changes
                                  </button>
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </table>
                      )}
                  </div>
                </div>
              </div>
            </article>
          </main>
          <aside className="hidden w-72 flex-shrink-0 border-r border-gray-200 xl:order-first xl:flex xl:flex-col">
            <div className="px-2 pt-1 pb-4">
              <RadioGroup
                value={groupOptionSelected}
                onChange={(e) => handleGroupOptionChange(e)}
              >
                <div className="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  {groupOptions.map((groupOption) => (
                    <RadioGroup.Option
                      key={groupOption.name}
                      value={groupOption}
                      className={({ active }) =>
                        classNames(
                          active
                            ? "border-red-500 ring-2 ring-red-500"
                            : "border-gray-300",
                          "relative cursor-pointer rounded-lg border bg-white p-3 shadow-sm focus:outline-none text-center"
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="text-center">
                            <span className="flex flex-col">
                              <RadioGroup.Label
                                as="span"
                                className="block text-md font-medium text-gray-900"
                              >
                                {groupOption.name}
                              </RadioGroup.Label>
                            </span>
                          </span>
                          <span
                            className={classNames(
                              active ? "border" : "border-2",
                              checked ? "border-red-600" : "border-transparent",
                              "pointer-events-none absolute -inset-px rounded-lg"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
              <div className="flex justify-between mt-4">
                <h2 className="text-2xl font-medium text-gray-900">
                  {groupOptionSelected.name === "By Aircraft" && "Aircrafts"}
                  {groupOptionSelected.name === "By Service" && "Services"}
                </h2>
              </div>
              <form className="mt-2 flex space-x-4" action="#">
                <div className="min-w-0 flex-1">
                  <label htmlFor="search" className="sr-only">
                    Search
                  </label>
                  {groupOptionSelected.name === "By Aircraft" && (
                    <div className="relative rounded-md shadow-sm">
                      <div
                        onClick={() => searchAircrafts()}
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
                        value={aircraftSearchName}
                        onChange={(event) =>
                          setAircraftSearchName(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                    focus:ring-sky-500 sm:text-sm"
                        placeholder="Search name..."
                      />
                    </div>
                  )}
                  {groupOptionSelected.name === "By Service" && (
                    <div className="relative rounded-md shadow-sm">
                      <div
                        onClick={() => searchServices()}
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
                        value={serviceSearchName}
                        onChange={(event) =>
                          setServiceSearchName(event.target.value)
                        }
                        onKeyDown={handleKeyDownServices}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                    focus:ring-sky-500 sm:text-sm"
                        placeholder="Search name..."
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Aircraft list */}
            <nav
              className="overflow-y-auto"
              style={{ height: "1000px", paddingBottom: "100px" }}
            >
              {loading && <Loader />}
              {groupOptionSelected.name === "By Aircraft" &&
                !loading &&
                totalAircraftTypes === 0 && (
                  <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                    <p className="font-semibold">No aircrafts found.</p>
                  </div>
                )}
              {groupOptionSelected.name === "By Service" &&
                !loading &&
                totalAircraftTypes === 0 && (
                  <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                    <p className="font-semibold">No services found.</p>
                  </div>
                )}
              {groupOptionSelected.name === "By Aircraft" && (
                <ul className="relative z-0 divide-y divide-gray-200">
                  {aircraftTypes.map((aircraft) => (
                    <li
                      key={aircraft.id}
                      onClick={() => getAircraftDetails(aircraft)}
                    >
                      <div
                        className={`${
                          aircraft.showDetails ? " border-2 border-red-500" : ""
                        } cursor-pointer relative flex items-center space-x-3 px-4 py-3
                                                hover:bg-gray-100`}
                      >
                        <div className="min-w-0 flex-1">
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm text-gray-900">
                            {aircraft.name}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {groupOptionSelected.name === "By Service" && (
                <ul className="relative z-0 divide-y divide-gray-200">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      onClick={() => getServiceDetails(service)}
                    >
                      <div
                        className={`${
                          service.showDetails ? " border-2 border-red-500" : ""
                        } cursor-pointer relative flex items-center space-x-3 px-4 py-3
                                                hover:bg-gray-100`}
                      >
                        <div className="min-w-0 flex-1">
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm text-gray-900">
                            {service.name}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ServicePrices;
