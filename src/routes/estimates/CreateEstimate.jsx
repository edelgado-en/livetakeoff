import { useState, useEffect, Fragment, useRef } from "react";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Listbox, Transition, Switch } from "@headlessui/react";
import { PlusIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/outline";
import { InformationCircleIcon } from "@heroicons/react/solid";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { TrashIcon, PencilIcon } from "@heroicons/react/outline";
import * as api from "./apiService";
import { toast } from "react-toastify";

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../routes/userProfile/userSlice";

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CreateEstimate = () => {
  const [loading, setLoading] = useState(false);

  const [tailNumber, setTailNumber] = useState("");
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [airports, setAirports] = useState([]);
  const [fbos, setFbos] = useState([]);
  const [allFbos, setAllFbos] = useState([]);
  const [services, setServices] = useState([]);

  const [customerSelected, setCustomerSelected] = useState(null);
  const [aircraftTypeSelected, setAircraftTypeSelected] = useState(null);
  const [airportSelected, setAirportSelected] = useState(null);
  const [fboSelected, setFboSelected] = useState(null);

  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [aircraftSearchTerm, setAircraftSearchTerm] = useState("");
  const [airportSearchTerm, setAirportSearchTerm] = useState("");
  const [fboSearchTerm, setFboSearchTerm] = useState("");

  const [showTotals, setShowTotals] = useState(true);

  const currentUser = useAppSelector(selectUser);

  const navigate = useNavigate();

  const filteredFbos = fboSearchTerm
    ? fbos.filter((item) =>
        item.name.toLowerCase().includes(fboSearchTerm.toLowerCase())
      )
    : fbos;

  useEffect(() => {
    getJobInfo();
  }, []);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchAirports();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [airportSearchTerm]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchCustomers();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [customerSearchTerm]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchAircrafts();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [aircraftSearchTerm]);

  const searchAirports = async () => {
    try {
      const { data } = await api.searchAirports({ name: airportSearchTerm });

      setAirports(data.results);
    } catch (err) {
      toast.error("Unable to search airports");
    }
  };

  const searchCustomers = async () => {
    try {
      const { data } = await api.getCustomers({ name: customerSearchTerm });

      setCustomers(data.results);
    } catch (err) {
      toast.error("Unable to search customers");
    }
  };

  const searchAircrafts = async () => {
    try {
      const { data } = await api.searchAircraftTypes({
        name: aircraftSearchTerm,
      });

      setAircraftTypes(data.results);
    } catch (err) {
      toast.error("Unable to search aircrafts");
    }
  };

  const getJobInfo = async () => {
    setLoading(true);

    try {
      const { data } = await api.getJobEstimateFormInfo();
      setAircraftTypes(data.aircraft_types);
      setAirports(data.airports);
      setAllFbos(data.fbos);
      setFbos(data.fbos);
      setCustomers(data.customers);

      if (data.customer_id) {
        getServicesAndRetainers(data.customer_id);
      }

      setLoading(false);
    } catch (error) {
      toast.error("Unable to load form data");
      setLoading(false);
    }
  };

  const createEstimate = async () => {
    const selectedServices = services.filter(
      (service) => service.selected === true
    );

    if (!tailNumber || tailNumber.length === 0) {
      alert("Please enter a Tail number");
      return;
    }

    if (!aircraftTypeSelected) {
      alert("Please select an aircrat type");
      return;
    }

    if (!airportSelected) {
      alert("Please select an airport");
      return;
    }

    if (!fboSelected) {
      alert("Please select an FBO");
      return;
    }

    if (selectedServices.length === 0) {
      alert("Please select at least one service");
      return;
    }

    setLoading(true);

    const request = {
      tail_number: tailNumber,
      aircraft_type_id: aircraftTypeSelected.id,
      services: selectedServices.map((service) => service.id),
      fbo_id: fboSelected.id,
      airport_id: airportSelected.id,
      customer_id: customerSelected ? customerSelected.id : null,
      show_totals: showTotals,
    };

    try {
      const { data } = await api.createEstimate(request);

      setLoading(false);

      navigate(`/estimates/${data.id}`);
    } catch (error) {
      setLoading(false);
      toast.error("Unable to create estimate");
    }
  };

  const handleServiceChange = (service) => {
    const servicesUpdated = services.map((el) => {
      if (el.id === service.id) {
        el.selected = !el.selected;
      }
      return el;
    });

    setServices(servicesUpdated);
  };

  const handleAirportSelectedChange = async (airport) => {
    setAirportSelected(airport);

    const request = {
      airport_id: airport.id,
    };

    try {
      const { data } = await api.searchFbos(request);

      if (data.results.length > 0) {
        setFbos(data.results);
      } else {
        setFbos(allFbos);
      }
    } catch (err) {
      toast.error("Unable to get Fbos");
    }
  };

  const getServicesAndRetainers = async (customerId) => {
    try {
      const { data } = await api.getCustomerRetainerServices(customerId);

      setServices(data.services);
    } catch (err) {
      toast.error("Unable to get customer services");
    }
  };

  const handleCustomerSelectedChange = async (customer) => {
    setCustomerSelected(customer);

    try {
      const { data } = await api.getCustomerRetainerServices(customer.id);

      setServices(data.services);
    } catch (err) {
      toast.error("Unable to get customer services");
    }
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <main className="mx-auto max-w-lg px-4 pb-16 lg:pb-12">
          <div>
            <div className="space-y-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-600">
                  Create Estimate
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Let’s get started by filling in the information below to
                  create a new estimate.
                </p>
              </div>

              <div>
                <label
                  htmlFor="tailNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tail Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={tailNumber}
                    onChange={(e) => setTailNumber(e.target.value)}
                    name="tailNumber"
                    id="tailNumber"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              {currentUser.isCustomer && (
                <p className="text-sm text-gray-500">
                  Is your aircraft, airport, FBO or service not listed?
                  <Link to="/contact" className="ml-2 text-blue-500">
                    Let us know
                  </Link>
                </p>
              )}

              {(!currentUser.isCustomer || currentUser.hasExtraCustomers) && (
                <div className="mt-1">
                  <Listbox
                    value={customerSelected}
                    onChange={handleCustomerSelectedChange}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium text-gray-700">
                          Customer
                        </Listbox.Label>
                        <div className="relative mt-1">
                          <Listbox.Button
                            className="relative w-full cursor-default rounded-md border
                                                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                        shadow-sm focus:border-sky-500 focus:outline-none
                                                                        focus:ring-1 focus:ring-sky-500 sm:text-sm"
                          >
                            <span className="block truncate">
                              {customerSelected
                                ? customerSelected.name
                                : "Select customer"}
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
                              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            >
                              <div className="relative">
                                <div className="sticky top-0 z-20  px-1">
                                  <div className="mt-1 block  items-center">
                                    <input
                                      type="text"
                                      name="search"
                                      id="search"
                                      value={customerSearchTerm}
                                      onChange={(e) =>
                                        setCustomerSearchTerm(e.target.value)
                                      }
                                      className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                            border-gray-300 rounded-md"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                      {customerSearchTerm && (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-blue-500 font-bold mr-1"
                                          viewBox="0 0 20 20"
                                          fill="currentColor"
                                          onClick={() => {
                                            setCustomerSearchTerm("");
                                          }}
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      )}
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-gray-500 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {customers.map((customer) => (
                                <Listbox.Option
                                  key={customer.id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "text-white bg-red-600"
                                        : "text-gray-900",
                                      "relative cursor-default select-none py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={customer}
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
                                        {customer.name}
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
              )}

              <div className="mt-1">
                <Listbox
                  value={aircraftTypeSelected}
                  onChange={setAircraftTypeSelected}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-sm font-medium text-gray-700">
                        Aircraft Type
                      </Listbox.Label>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm"
                        >
                          <span className="block truncate">
                            {aircraftTypeSelected
                              ? aircraftTypeSelected.name
                              : "Select aircraft type"}
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
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                          >
                            <div className="relative">
                              <div className="sticky top-0 z-20  px-1">
                                <div className="mt-1 block  items-center">
                                  <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    value={aircraftSearchTerm}
                                    onChange={(e) =>
                                      setAircraftSearchTerm(e.target.value)
                                    }
                                    className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                        border-gray-300 rounded-md"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                    {aircraftSearchTerm && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-500 font-bold mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() => {
                                          setAircraftSearchTerm("");
                                        }}
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-gray-500 mr-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {aircraftTypes.map((aircraftType) => (
                              <Listbox.Option
                                key={aircraftType.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={aircraftType}
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
                                      {aircraftType.name}
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

              <div className="mt-1">
                <Listbox
                  value={airportSelected}
                  onChange={handleAirportSelectedChange}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-sm font-medium text-gray-700">
                        Airport
                      </Listbox.Label>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm"
                        >
                          <span className="block truncate">
                            {airportSelected
                              ? airportSelected.name
                              : "Select airport"}
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
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                          >
                            <div className="relative">
                              <div className="sticky top-0 z-20  px-1">
                                <div className="mt-1 block  items-center">
                                  <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    value={airportSearchTerm}
                                    onChange={(e) =>
                                      setAirportSearchTerm(e.target.value)
                                    }
                                    className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                        border-gray-300 rounded-md"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                    {airportSearchTerm && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-500 font-bold mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() => {
                                          setAirportSearchTerm("");
                                        }}
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-gray-500 mr-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {airports.map((airport) => (
                              <Listbox.Option
                                key={airport.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={airport}
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
                                      {airport.name}
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

              <div className="mt-1">
                <Listbox value={fboSelected} onChange={setFboSelected}>
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-sm font-medium text-gray-700">
                        FBO
                      </Listbox.Label>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm"
                        >
                          <span className="block truncate">
                            {fboSelected ? fboSelected.name : "Select FBO"}
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
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                          >
                            <div className="relative">
                              <div className="sticky top-0 z-20  px-1">
                                <div className="mt-1 block  items-center">
                                  <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    value={fboSearchTerm}
                                    onChange={(e) =>
                                      setFboSearchTerm(e.target.value)
                                    }
                                    className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                        border-gray-300 rounded-md"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                    {fboSearchTerm && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-500 font-bold mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() => {
                                          setFboSearchTerm("");
                                        }}
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-gray-500 mr-1"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {filteredFbos.map((fbo) => (
                              <Listbox.Option
                                key={fbo.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={fbo}
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
                                      {fbo.name}
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

              <div className="text-sm leading-5 font-medium text-gray-700">
                Services
              </div>

              {services.map((service) => (
                <div key={service.id} className="relative flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id={service.id}
                      name={service.name}
                      checked={service.selected}
                      onChange={() => handleServiceChange(service)}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor={service.id} className="text-gray-700">
                      {service.name}
                    </label>
                  </div>
                </div>
              ))}

              {!currentUser.isCustomer && (
                <div className="divide-y divide-gray-200">
                  <div className="">
                    <ul role="list" className="mt-2 divide-y divide-gray-200">
                      <Switch.Group
                        as="li"
                        className="flex items-center justify-between py-4"
                      >
                        <div className="flex flex-col">
                          <Switch.Label
                            as="p"
                            className="text-sm leading-5 font-medium text-gray-700"
                            passive
                          >
                            Show Totals
                          </Switch.Label>
                          <Switch.Description className="text-sm text-gray-500">
                            Controls whether to show the "Total" and "Subtotal"
                            values.
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={showTotals}
                          onChange={setShowTotals}
                          className={classNames(
                            showTotals ? "bg-red-500" : "bg-gray-200",
                            "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              showTotals ? "translate-x-5" : "translate-x-0",
                              "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                    </ul>
                  </div>
                </div>
              )}

              {currentUser.isCustomer && (
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <InformationCircleIcon
                        className="h-5 w-5 text-blue-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-700">
                        Estimates are in BETA, if you see a service that shows
                        zero cost, please
                        <Link to="/contact" className="mx-1 font-semibold">
                          Contact Us
                        </Link>{" "}
                        or call
                        <a href="tel:+18555000538" className="ml-3">
                          +1 855-500-0538
                        </a>
                        so we can coordinate it for you.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col py-4 pb-20 gap-4">
                <button
                  type="button"
                  onClick={() => createEstimate()}
                  className="inline-flex justify-center rounded-md
                                        border border-transparent bg-red-600 py-2 px-4
                                        text-sm font-medium text-white shadow-sm hover:bg-red-600
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Create Estimate
                </button>
                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="rounded-md border border-gray-300 bg-white w-full
                                        py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>

              <div className="h-28"></div>
            </div>
          </div>
        </main>
      )}
    </AnimatedPage>
  );
};

export default CreateEstimate;
