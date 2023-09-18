import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/outline";

import { Link } from "react-router-dom";

import * as api from "./apiService";
import Pagination from "react-js-pagination";
import Loader from "../../../components/loader/Loader";
import { toast } from "react-toastify";
import AnimatedPage from "../../../components/animatedPage/AnimatedPage";

import { selectUser } from "../../../routes/userProfile/userSlice";
import { useAppSelector } from "../../../app/hooks";
import { set } from "react-hook-form";

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

const dateOptions = [
  { id: "yesterday", name: "Yesterday" },
  { id: "last7Days", name: "Last 7 Days" },
  { id: "lastWeek", name: "Last Week" },
  { id: "MTD", name: "Month to Date" },
  { id: "lastMonth", name: "Last Month" },
  { id: "lastQuarter", name: "Last Quarter" },
  { id: "YTD", name: "Year to Date" },
  { id: "lastYear", name: "Last Year" },
];

const ExportIcon = () => {
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
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
      />
    </svg>
  );
};

const ChevronUpDownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-500 cursor-pointer"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

const XMarkIcon = () => {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

const serviceTypes = [
  { type: "E", name: "Exterior" },
  { type: "I", name: "Interior" },
  { type: "O", name: "Other" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function CustomerServiceReport() {
  const currentUser = useAppSelector(selectUser);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const [showRetainers, setShowRetainers] = useState(false);

  const [showSpendingInfo, setShowSpendingInfo] = useState(false);

  const [isStandardServicesSelected, setIsStandardServicesSelected] =
    useState(true);
  const [isRetainerServicesSelected, setIsRetainerServicesSelected] =
    useState(false);

  const [selectedServiceType, setSelectedServiceType] = useState({});

  const [selectedService, setSelectedService] = useState();
  const [selectedRetainerService, setSelectedRetainerService] = useState();

  const [dateSelected, setDateSelected] = useState(dateOptions[4]);
  const [searchText, setSearchText] = useState("");

  const [interiorServices, setInteriorServices] = useState([]);
  const [exteriorServices, setExteriorServices] = useState([]);
  const [otherServices, setOtherServices] = useState([]);
  const [retainerServices, setRetainerServices] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const [serviceActivities, setServiceActivities] = useState([]);
  const [totalServiceActivities, setTotalServiceActivities] = useState(0);

  const [retainerServiceActivities, setRetainerServiceActivities] = useState(
    []
  );
  const [totalRetainerServiceActivities, setTotalRetainerServiceActivities] =
    useState(0);

  const [numberOfServices, setNumberOfServices] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [numberOfTails, setNumberOfTails] = useState(0);
  const [numberOfLocations, setNumberOfLocations] = useState(0);

  const [airportSelected, setAirportSelected] = useState(null);
  const [fboSelected, setFboSelected] = useState(null);
  const [customerSelected, setCustomerSelected] = useState(null);

  const [airports, setAirports] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [fbos, setFbos] = useState([]);
  const [allFbos, setAllFbos] = useState([]);

  const [airportSearchTerm, setAirportSearchTerm] = useState("");
  const [fboSearchTerm, setFboSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  const [sortByPriceDesc, setSortByPriceDesc] = useState(false);
  const [sortByPriceAsc, setSortByPriceAsc] = useState(false);
  const [sortByTimestampAsc, setSortByTimestampAsc] = useState(false);
  const [sortByTimestampDesc, setSortByTimestampDesc] = useState(true);

  const filteredAirports = airportSearchTerm
    ? airports.filter((item) =>
        item.name.toLowerCase().includes(airportSearchTerm.toLowerCase())
      )
    : airports;

  const filteredFbos = fboSearchTerm
    ? fbos.filter((item) =>
        item.name.toLowerCase().includes(fboSearchTerm.toLowerCase())
      )
    : fbos;

  const filteredCustomers = customerSearchTerm
    ? customers.filter((item) =>
        item.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
      )
    : customers;

  useEffect(() => {
    getServices();
    setSelectedService({ id: null, name: "All Services" });
  }, []);

  useEffect(() => {
    getRetainerServices();
  }, []);

  useEffect(() => {
    getAirports();
  }, []);

  useEffect(() => {
    getFbos();
  }, []);

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      generateServiceReport();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [
    selectedService,
    dateSelected,
    searchText,
    airportSelected,
    fboSelected,
    customerSelected,
  ]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      generateRetainerServiceReport();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [
    selectedRetainerService,
    dateSelected,
    searchText,
    airportSelected,
    fboSelected,
    customerSelected,
  ]);

  useEffect(() => {
    searchServiceActivities();
  }, [
    currentPage,
    sortByPriceAsc,
    sortByPriceDesc,
    sortByTimestampAsc,
    sortByTimestampDesc,
  ]);

  const getAirports = async () => {
    try {
      const { data } = await api.getAirports();

      data.results.unshift({ id: null, name: "All Airports" });

      setAirports(data.results);
    } catch (err) {
      toast.error("Unable to get airports");
    }
  };

  const getFbos = async () => {
    try {
      const { data } = await api.getFbos();

      data.results.unshift({ id: null, name: "All FBOs" });

      setAllFbos(data.results);
      setFbos(data.results);
    } catch (err) {
      toast.error("Unable to get fbos");
    }
  };

  const getCustomers = async () => {
    const { data } = await api.getCustomers({ name: "" });

    data.results.unshift({ id: null, name: "All Customers" });
    setCustomers(data.results);
  };

  const getServices = async () => {
    try {
      const { data } = await api.getServices();

      setInteriorServices(
        data.results.filter((service) => service.category === "I")
      );
      setExteriorServices(
        data.results.filter((service) => service.category === "E")
      );
      setOtherServices(
        data.results.filter((service) => service.category === "O")
      );
    } catch (err) {
      toast.error("Unable to get services");
    }
  };

  const getRetainerServices = async () => {
    try {
      const { data } = await api.getRetainerServices();

      setRetainerServices(data.results);
    } catch (err) {
      toast.error("Unable to get retainers");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      generateServiceReport();
    }
  };

  const handleServiceTypeChange = (serviceType) => {
    //if serviceType is the same as the selected one, then clear it
    if (selectedServiceType.type === serviceType.type) {
      setSelectedServiceType({});
    } else {
      setSelectedServiceType(serviceType);
    }
  };

  const handleServiceChange = (service) => {
    setSelectedService(service);
    setSelectedRetainerService(null);
    setIsRetainerServicesSelected(false);
    setIsStandardServicesSelected(true);
  };

  const handleRetainerServiceChange = (service) => {
    setSelectedRetainerService(service);
    setSelectedService(null);
    setIsStandardServicesSelected(false);
    setIsRetainerServicesSelected(true);
  };

  const generateServiceReport = async () => {
    setLoading(true);

    const request = {
      service_id: selectedService.id,
      dateSelected: dateSelected.id,
      tail_number: searchText,
      airport_id: airportSelected?.id,
      fbo_id: fboSelected?.id,
      customer_id: customerSelected?.id,
    };

    try {
      const { data } = await api.generateServiceReport(request);

      setNumberOfServices(data.number_of_services_completed);
      setTotalSpent(data.total_jobs_revenue);
      setNumberOfTails(data.number_of_unique_tail_numbers);
      setNumberOfLocations(data.number_of_unique_locations);
      setShowSpendingInfo(data.show_spending_info);
      setShowRetainers(data.show_retainers);

      if (data.show_retainers) {
        //only add it if it doesn't exist
        if (!serviceTypes.find((serviceType) => serviceType.type === "R")) {
          serviceTypes.push({ type: "R", name: "Retainer" });
        }
      }
    } catch (err) {
      toast.error("Unable to generate service report");
    }

    setLoading(false);

    searchServiceActivities(1);
  };

  const generateRetainerServiceReport = async () => {
    if (selectedRetainerService) {
      setLoading(true);

      const request = {
        service_id: selectedRetainerService.id,
        dateSelected: dateSelected.id,
        tail_number: searchText,
        airport_id: airportSelected?.id,
        fbo_id: fboSelected?.id,
        customer_id: customerSelected?.id,
      };

      try {
        const { data } = await api.generateRetainerServiceReport(request);

        setNumberOfServices(data.number_of_services_completed);
        setNumberOfTails(data.number_of_unique_tail_numbers);
        setNumberOfLocations(data.number_of_unique_locations);
      } catch (err) {
        toast.error("Unable to generate service report");
      }

      setLoading(false);
      setIsRetainerServicesSelected(true);
      setIsStandardServicesSelected(false);
      searchRetainerServiceActivities(1);
    }
  };

  const searchServiceActivities = async (page) => {
    setActivitiesLoading(true);

    const request = {
      service_id: selectedService?.id,
      dateSelected: dateSelected.id,
      tail_number: searchText,
      airport_id: airportSelected?.id,
      fbo_id: fboSelected?.id,
      customer_id: customerSelected?.id,
      sort_by_price_asc: sortByPriceAsc,
      sort_by_price_desc: sortByPriceDesc,
      sort_by_timestamp_asc: sortByTimestampAsc,
      sort_by_timestamp_desc: sortByTimestampDesc,
    };

    let cPage = currentPage;

    if (page) {
      cPage = page;
    }

    try {
      const { data } = await api.searchServiceActivities(request, cPage);

      setServiceActivities(data.results);
      setTotalServiceActivities(data.count);
    } catch (err) {
      toast.error("Unable to search service activities");
    }

    setActivitiesLoading(false);
  };

  const searchRetainerServiceActivities = async (page) => {
    setActivitiesLoading(true);

    const request = {
      service_id: selectedRetainerService?.id,
      dateSelected: dateSelected.id,
      tail_number: searchText,
      airport_id: airportSelected?.id,
      fbo_id: fboSelected?.id,
      customer_id: customerSelected?.id,
      sort_by_price_asc: sortByPriceAsc,
      sort_by_price_desc: sortByPriceDesc,
      sort_by_timestamp_asc: sortByTimestampAsc,
      sort_by_timestamp_desc: sortByTimestampDesc,
    };

    let cPage = currentPage;

    if (page) {
      cPage = page;
    }

    try {
      const { data } = await api.searchRetainerServiceActivities(
        request,
        cPage
      );

      setRetainerServiceActivities(data.results);
      setTotalRetainerServiceActivities(data.count);
    } catch (err) {
      toast.error("Unable to search retainer service activities");
    }

    setActivitiesLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortByPrice = () => {
    //toggle sort by price
    if (sortByPriceDesc) {
      setSortByPriceDesc(false);
      setSortByPriceAsc(true);
    } else {
      setSortByPriceDesc(true);
      setSortByPriceAsc(false);
    }

    //set alll other sorts to false
    setSortByTimestampAsc(false);
    setSortByTimestampDesc(false);
  };

  const handleSortByTimestamp = () => {
    //toggle sort by timestamp
    if (sortByTimestampDesc) {
      setSortByTimestampDesc(false);
      setSortByTimestampAsc(true);
    } else {
      setSortByTimestampDesc(true);
      setSortByTimestampAsc(false);
    }

    //set alll other sorts to false
    setSortByPriceAsc(false);
    setSortByPriceDesc(false);
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

      data.results.unshift({ id: null, name: "All FBOs" });
    } catch (err) {
      toast.error("Unable to get Fbos");
    }
  };

  const handleSelectStandServices = () => {
    setCurrentPage(1);
    setIsStandardServicesSelected(true);
    setIsRetainerServicesSelected(false);
    searchServiceActivities(1);
  };

  const handleSelectRetainerServices = () => {
    setCurrentPage(1);
    setIsStandardServicesSelected(false);
    setIsRetainerServicesSelected(true);
    searchRetainerServiceActivities(1);
  };

  return (
    <AnimatedPage>
      <div
        className={`px-4 m-auto max-w-7xl flex flex-wrap -mt-6`}
        style={{ maxWidth: "1800px" }}
      >
        {/* Static sidebar for desktop */}
        <div className="hidden xl:flex w-80 xl:flex-col min-h-full">
          <div className="flex grow flex-col overflow-y-auto bg-gray-100 px-6 ring-1 ring-white/5">
            <div className="flex h-16 shrink-0 items-center text-3xl font-semibold tracking-tight text-gray-700 mt-1">
              Service Report
            </div>
            <nav className="flex flex-1 flex-col mt-2">
              <ul className="flex flex-1 flex-col gap-y-4">
                <li>
                  <ul className="-mx-2 space-y-1">
                    <li>
                      <div
                        onClick={() =>
                          handleServiceChange({
                            id: null,
                            name: "All Services",
                          })
                        }
                        className={classNames(
                          selectedService?.id === null &&
                            !selectedRetainerService
                            ? "bg-red-600 text-white font-semibold"
                            : "text-gray-600 hover:text-red-700 hover:border-red-600",
                          "group flex justify-between gap-x-3 rounded-md p-2 text-lg leading-6 cursor-pointer border border-transparent"
                        )}
                      >
                        <div className="truncate flex gap-x-3">
                          <div>All Services</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="text-md font-semibold leading-6 text-gray-500 uppercase tracking-wide mt-4">
                    Service Types
                  </div>
                  <ul className="-mx-2 mt-2 space-y-1">
                    {serviceTypes.map((serviceType) => (
                      <li key={serviceType.name}>
                        <div
                          onClick={() => handleServiceTypeChange(serviceType)}
                          className={classNames(
                            selectedServiceType.type === serviceType.type
                              ? "border border-red-600 text-red-600"
                              : "text-gray-600 hover:text-red-700 hover:border-red-700",
                            " flex justify-between gap-x-3 rounded-md p-2 text-lg leading-6 cursor-pointer"
                          )}
                        >
                          <div>{serviceType.name}</div>
                          <div>
                            {selectedServiceType.type !== serviceType.type && (
                              <ChevronDownIcon className="h-4 w-4" />
                            )}
                            {selectedServiceType.type === serviceType.type && (
                              <ChevronUpIcon className="h-4 w-4" />
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>

                <li>
                  {selectedServiceType.type && (
                    <div className="text-md font-semibold leading-6 text-gray-500 uppercase tracking-wide">
                      {selectedServiceType.type === "E" && "Exterior"}
                      {selectedServiceType.type === "I" && "Interior"}
                      {selectedServiceType.type === "O" && "Other"}
                      {selectedServiceType.type === "R" && "Retainer"} Services
                    </div>
                  )}

                  {selectedServiceType.type === "E" && (
                    <ul className="mt-2 space-y-1">
                      {exteriorServices.map((service) => (
                        <li key={service.id}>
                          <div
                            onClick={() => handleServiceChange(service)}
                            className={classNames(
                              service.id === selectedService?.id
                                ? "bg-red-600 text-white font-semibold"
                                : "text-gray-600 hover:text-red-700 hover:border-red-700",
                              "group flex justify-between gap-x-3 rounded-md p-2 text-md leading-6 cursor-pointer border border-transparent"
                            )}
                          >
                            <div className="truncate">{service.name}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedServiceType.type === "I" && (
                    <ul className="mt-2 space-y-1">
                      {interiorServices.map((service) => (
                        <li key={service.id}>
                          <div
                            onClick={() => handleServiceChange(service)}
                            className={classNames(
                              service.id === selectedService?.id
                                ? "bg-red-600 text-white font-semibold"
                                : "text-gray-600 hover:text-red-700 hover:border-red-700",
                              "group flex justify-between gap-x-3 rounded-md p-2 text-md leading-6 cursor-pointer border border-transparent"
                            )}
                          >
                            <div className="truncate">{service.name}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedServiceType.type === "O" && (
                    <ul className="mt-2 space-y-1">
                      {otherServices.map((service) => (
                        <li key={service.id}>
                          <div
                            onClick={() => handleServiceChange(service)}
                            className={classNames(
                              service.id === selectedService?.id
                                ? "bg-red-600 text-white font-semibold"
                                : "text-gray-600 hover:text-red-700 hover:border-red-700",
                              "group flex justify-between gap-x-3 rounded-md p-2 text-md leading-6 cursor-pointer border border-transparent"
                            )}
                          >
                            <div className="truncate">{service.name}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedServiceType.type === "R" && (
                    <ul className="mt-2 space-y-1">
                      {retainerServices.map((retainerService) => (
                        <li key={retainerService.id}>
                          <div
                            onClick={() =>
                              handleRetainerServiceChange(retainerService)
                            }
                            className={classNames(
                              retainerService.id === selectedRetainerService?.id
                                ? "bg-red-600 text-white font-semibold"
                                : "text-gray-600 hover:text-red-700 hover:border-red-700",
                              "group flex justify-between gap-x-3 rounded-md p-2 text-md leading-6 cursor-pointer border border-transparent"
                            )}
                          >
                            <div className="truncate">
                              {retainerService.name}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
                <li>
                  <div className="py-10"></div>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile filter Slide over */}
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-40" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel
                  className="relative ml-auto flex h-full w-full max-w-xs
                                                        flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl"
                >
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-medium text-gray-900">
                      Services
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center
                                                    rounded-md  p-2 text-gray-500"
                      onClick={() => setOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                  <div className="mt-4 px-4">
                    <ul className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul className="-mx-2 mt-2 space-y-1">
                          <li>
                            <div
                              onClick={() =>
                                handleServiceChange({
                                  id: null,
                                  name: "All Services",
                                })
                              }
                              className={classNames(
                                selectedService?.id === null
                                  ? "bg-red-600 text-white font-semibold"
                                  : "text-gray-600 hover:text-red-700 hover:border-red-600",
                                "group flex justify-between gap-x-3 rounded-md p-2 text-lg leading-6 cursor-pointer border border-transparent"
                              )}
                            >
                              <div className="truncate flex gap-x-3">
                                <div>All Services</div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div className="text-md font-semibold leading-6 text-gray-500 uppercase tracking-wide">
                          Service Types
                        </div>
                        <ul className="-mx-2 mt-2 space-y-1">
                          {serviceTypes.map((serviceType) => (
                            <li key={serviceType.name}>
                              <div
                                onClick={() =>
                                  handleServiceTypeChange(serviceType)
                                }
                                className={classNames(
                                  selectedServiceType.type === serviceType.type
                                    ? "border border-red-600 text-red-600"
                                    : "text-gray-600 hover:text-red-700 hover:border-red-700",
                                  "group flex gap-x-3 rounded-md p-2 text-lg leading-6 cursor-pointer"
                                )}
                              >
                                {serviceType.name}
                              </div>
                            </li>
                          ))}
                        </ul>

                        {selectedServiceType.type && (
                          <div className="text-md font-semibold leading-6 text-gray-500 uppercase tracking-wide mt-3">
                            {selectedServiceType.type === "E" && "Exterior"}
                            {selectedServiceType.type === "I" && "Interior"}
                            {selectedServiceType.type === "O" && "Other"}
                            {selectedServiceType.type === "R" &&
                              "Retainer"}{" "}
                            Services
                          </div>
                        )}

                        {selectedServiceType.type === "E" && (
                          <ul className="mt-2 space-y-1">
                            {exteriorServices.map((service) => (
                              <li key={service.id}>
                                <div
                                  onClick={() => handleServiceChange(service)}
                                  className={classNames(
                                    service.id === selectedService?.id
                                      ? "bg-red-600 text-white font-semibold"
                                      : "text-gray-600 hover:text-red-700 hover:border-red-700",
                                    "group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 cursor-pointer border border-transparent"
                                  )}
                                >
                                  <div className="truncate">{service.name}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        {selectedServiceType.type === "I" && (
                          <ul className="mt-2 space-y-1">
                            {interiorServices.map((service) => (
                              <li key={service.id}>
                                <div
                                  onClick={() => handleServiceChange(service)}
                                  className={classNames(
                                    service.id === selectedService?.id
                                      ? "bg-red-600 text-white font-semibold"
                                      : "text-gray-600 hover:text-red-700 hover:border-red-700",
                                    "group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 cursor-pointer border border-transparent"
                                  )}
                                >
                                  <div className="truncate">{service.name}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        {selectedServiceType.type === "O" && (
                          <ul className="mt-2 space-y-1">
                            {otherServices.map((service) => (
                              <li key={service.id}>
                                <div
                                  onClick={() => handleServiceChange(service)}
                                  className={classNames(
                                    service.id === selectedService?.id
                                      ? "bg-red-600 text-white font-semibold"
                                      : "text-gray-600 hover:text-red-700 hover:border-red-700",
                                    "group flex justify-between gap-x-3 rounded-md p-2 text-sm leading-6 cursor-pointer border border-transparent"
                                  )}
                                >
                                  <div className="truncate">{service.name}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                      <li>
                        <div className="py-10"></div>
                      </li>
                    </ul>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className=" flex-1">
          <div className="xl:hidden  mb-5">
            <button
              type="button"
              className="flex gap-2 text-xl font-medium text-gray-700 hover:text-gray-900 mt-2"
              onClick={() => setOpen(true)}
            >
              <div>Services</div>
              <ChevronDoubleRightIcon className="h-4 w-4 text-gray-500 relative top-2" />
            </button>
          </div>
          <main>
            <div className="flex w-full ml-0 xl:ml-8 mt-2">
              <div className="text-2xl tracking-wide font-semibold relative top-1">
                {selectedService && selectedService.name}
                {selectedRetainerService && selectedRetainerService.name}
              </div>
            </div>
            <div className="xs:p-0 xl:px-8 grid xs:grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 mt-4">
              <div>
                <Listbox value={dateSelected} onChange={setDateSelected}>
                  {({ open }) => (
                    <>
                      <div className="relative">
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
                                                            ring-black ring-opacity-5 focus:outline-none text-lg"
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
              <div>
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div
                    onClick={() => generateServiceReport()}
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
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="block w-full rounded-md border-gray-200 pl-10 focus:border-sky-500
                                 focus:ring-sky-500 text-md"
                    placeholder="Search by tail..."
                  />
                </div>
              </div>
              <div>
                <Listbox
                  value={airportSelected}
                  onChange={handleAirportSelectedChange}
                >
                  {({ open }) => (
                    <>
                      <div className="relative">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border text-gray-500
                                                                    border-gray-200 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-md"
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
                            className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
                                                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-md"
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
                                                                        focus:border-sky-500 block w-full py-2 pr-12 sm:text-md
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
                            {filteredAirports.map((airport) => (
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
              <div>
                <Listbox value={fboSelected} onChange={setFboSelected}>
                  {({ open }) => (
                    <>
                      <div className="relative">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border text-gray-500
                                                                    border-gray-200 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-md"
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
                            className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
                                                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-md"
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
                                                                        focus:border-sky-500 block w-full py-2 pr-12 sm:text-md
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
              <div>
                {customers.length > 1 && (
                  <Listbox
                    value={customerSelected}
                    onChange={setCustomerSelected}
                  >
                    {({ open }) => (
                      <>
                        <div className="relative">
                          <Listbox.Button
                            className="relative w-full cursor-default rounded-md border text-gray-500
                                                                    border-gray-200 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-md"
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
                              className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
                                                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-md"
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
                                                                        focus:border-sky-500 block w-full py-2 pr-12 sm:text-md
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
                              {filteredCustomers.map((customer) => (
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
                )}
              </div>
            </div>
            <header>
              <div className="bg-gray-50 px-4 pt-4 sm:items-center sm:px-6 lg:px-8 flex flex-wrap justify-between mt-4">
                <div className="text-2xl leading-6 text-gray-500 mb-3">
                  {dateSelected.name}
                </div>
                <div></div>
              </div>
              {loading && <Loader />}
              {!loading && (
                <div className="grid grid-cols-1 bg-gray-50 sm:grid-cols-2 lg:grid-cols-4">
                  {showSpendingInfo && !selectedRetainerService && (
                    <div className="border-t border-white/5 pb-6 pt-2 px-4 sm:px-6 lg:px-8">
                      <p className="text-lg font-medium leading-6 text-gray-400">
                        Total Spent
                      </p>
                      <p className="mt-2 flex items-baseline gap-x-2">
                        <span className="text-4xl font-semibold tracking-tight text-gray-500">
                          ${totalSpent.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  )}
                  <div className="border-t border-white/5 pb-6 pt-2 px-4 sm:px-6 lg:px-8">
                    <p className="text-lg font-medium leading-6 text-gray-400">
                      Number of Services
                    </p>
                    <p className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-semibold tracking-tight text-gray-500">
                        {numberOfServices.toLocaleString()}
                      </span>
                    </p>
                  </div>
                  <div className="border-t border-white/5 pb-6 pt-2 px-4 sm:px-6 lg:px-8">
                    <p className="text-lg font-medium leading-6 text-gray-400">
                      Number of Tails
                    </p>
                    <p className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-semibold tracking-tight text-gray-500">
                        {numberOfTails.toLocaleString()}
                      </span>
                    </p>
                  </div>

                  <div className="border-t border-white/5 pb-6 pt-2 px-4 sm:px-6 lg:px-8">
                    <p className="text-lg font-medium leading-6 text-gray-400">
                      Number of Airports
                    </p>
                    <p className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-semibold tracking-tight text-gray-500">
                        {numberOfLocations.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </header>

            {selectedService?.name === "All Services" && (
              <div className="px-2 xl:px-6 lg:px-6 md:px-4 mt-2">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <div
                      onClick={() => handleSelectStandServices()}
                      className={classNames(
                        isStandardServicesSelected
                          ? "border-red-500 text-red-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium uppercase tracking-wide cursor-pointer"
                      )}
                    >
                      Standard Services
                    </div>
                    <div
                      onClick={() => handleSelectRetainerServices()}
                      className={classNames(
                        isRetainerServicesSelected
                          ? "border-red-500 text-red-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium uppercase tracking-wide cursor-pointer"
                      )}
                    >
                      Retainer Services
                    </div>
                  </nav>
                </div>
              </div>
            )}

            {isStandardServicesSelected && (
              <>
                <div className="px-2 sm:px-6 lg:px-8 mt-6">
                  {totalServiceActivities === 0 && !activitiesLoading && (
                    <div className="text-center m-auto mt-14">
                      <div className="font-medium text-xl">
                        No services found.
                      </div>
                      <div className="text-gray-500 text-md">
                        Try changing your search criteria.
                      </div>
                    </div>
                  )}

                  {totalServiceActivities > 0 && (
                    <>
                      <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                          <h1 className="text-xl font-semibold leading-6 text-gray-600 tracking-wide">
                            Services Completed
                          </h1>
                          <p className="mt-2 text-md text-gray-500">
                            Checkout all services completed during the time
                            period selected.
                          </p>
                        </div>
                      </div>
                      {/* DESKTOP */}
                      <div className="hidden md:block lg:block xl:block max-w-screen-xl mt-2">
                        <div className="overflow-x-auto w-80 xl:w-full lg:w-full md:w-full sm:w-80">
                          <table className="min-w-full table-auto">
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-0 uppercase tracking-wide"
                                >
                                  <div
                                    className="flex gap-1"
                                    onClick={() => handleSortByTimestamp()}
                                  >
                                    Date <ChevronUpDownIcon />
                                  </div>
                                </th>
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  Purchase Order
                                </th>
                                {!currentUser.isCustomer && (
                                  <th
                                    scope="col"
                                    className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                  >
                                    Customer
                                  </th>
                                )}
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  Tail
                                </th>
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  Airport
                                </th>
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  FBO
                                </th>
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  Service
                                </th>
                              </tr>
                            </thead>
                            {activitiesLoading && <Loader />}
                            {!activitiesLoading && (
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {serviceActivities.map((service) => (
                                  <tr key={service.id}>
                                    <td className="px-2 py-2 text-sm text-gray-500 sm:pl-0">
                                      {service.timestamp}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-sky-500 font-semibold cursor-pointer">
                                      <Link
                                        to={`/report/review/${service.job_id}`}
                                      >
                                        {service.purchase_order}
                                      </Link>
                                    </td>
                                    {!currentUser.isCustomer && (
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <div className="truncate overflow-ellipsis w-40">
                                          {service.customer_name}
                                        </div>
                                      </td>
                                    )}
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {service.tail_number}
                                    </td>
                                    <td className="px-2 py-2 text-sm text-gray-500">
                                      <div className="truncate overflow-ellipsis w-40">
                                        {service.airport_name}
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {service.fbo_name}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <div className=" truncate overflow-ellipsis w-80">
                                        {service.service_name}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            )}
                          </table>
                        </div>
                      </div>

                      {/* MOBILE */}
                      <div className="xs:block sm:block xl:hidden lg:hidden md:hidden bg-white shadow sm:rounded-md my-4">
                        {activitiesLoading && <Loader />}
                        {!activitiesLoading && (
                          <ul className="divide-y divide-gray-200 text-md text-gray-500">
                            {serviceActivities.map((service) => (
                              <li key={service.id}>
                                <div className="px-2 py-8">
                                  <div className="flex justify-between gap-2">
                                    <div>{service.timestamp}</div>
                                    <div className="text-sky-500">
                                      <Link
                                        to={`/report/review/${service.job_id}`}
                                      >
                                        {service.purchase_order}
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="font-semibold mt-2">
                                    {service.service_name}
                                  </div>
                                  <div className="flex justify-between gap-2 mt-1">
                                    <div>
                                      <div className="bg-gray-100 p-1 rounded-md">
                                        {service.airport_name}
                                      </div>
                                    </div>
                                    <div className="relative top-1">
                                      {service.fbo_name}
                                    </div>
                                    <div className="italic relative top-1">
                                      {service.tail_number}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}

                  {!activitiesLoading && totalServiceActivities > 200 && (
                    <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
                      <div>
                        <Pagination
                          innerClass="pagination pagination-custom"
                          activePage={currentPage}
                          hideDisabled
                          itemClass="page-item page-item-custom"
                          linkClass="page-link page-link-custom"
                          itemsCountPerPage={200}
                          totalItemsCount={totalServiceActivities}
                          pageRangeDisplayed={3}
                          onChange={handlePageChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {!activitiesLoading && totalServiceActivities > 200 && (
                  <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
                    <div>
                      <Pagination
                        innerClass="pagination pagination-custom"
                        activePage={currentPage}
                        hideDisabled
                        itemClass="page-item page-item-custom"
                        linkClass="page-link page-link-custom"
                        itemsCountPerPage={200}
                        totalItemsCount={totalServiceActivities}
                        pageRangeDisplayed={3}
                        onChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {isRetainerServicesSelected && (
              <>
                <div className="px-2 sm:px-6 lg:px-8 mt-6">
                  {totalRetainerServiceActivities === 0 &&
                    !activitiesLoading && (
                      <div className="text-center m-auto mt-14">
                        <div className="font-medium text-xl">
                          No retainer services found.
                        </div>
                        <div className="text-gray-500 text-md">
                          Try changing your search criteria.
                        </div>
                      </div>
                    )}

                  {totalRetainerServiceActivities > 0 && (
                    <>
                      <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                          <h1 className="text-xl font-semibold leading-6 text-gray-600 tracking-wide">
                            Retainer Services Completed
                          </h1>
                          <p className="mt-2 text-md text-gray-500">
                            Checkout all retainer services completed during the
                            time period selected.
                          </p>
                        </div>
                      </div>
                      {/* DESKTOP */}
                      <div className="hidden md:block lg:block xl:block max-w-screen-xl mt-2">
                        <div className="overflow-x-auto w-80 xl:w-full lg:w-full md:w-full sm:w-80">
                          <table className="min-w-full table-auto">
                            <thead>
                              <tr>
                                <th
                                  scope="col"
                                  className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold text-gray-900 sm:pl-0 uppercase tracking-wide"
                                >
                                  <div
                                    className="flex gap-1"
                                    onClick={() => handleSortByTimestamp()}
                                  >
                                    Date <ChevronUpDownIcon />
                                  </div>
                                </th>
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  Purchase Order
                                </th>
                                {!currentUser.isCustomer && (
                                  <th
                                    scope="col"
                                    className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                  >
                                    Customer
                                  </th>
                                )}
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  Tail
                                </th>
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  Airport
                                </th>
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  FBO
                                </th>
                                <th
                                  scope="col"
                                  className="px-2 py-3.5 text-left text-xs font-semibold text-gray-900 uppercase tracking-wide"
                                >
                                  Service
                                </th>
                              </tr>
                            </thead>
                            {activitiesLoading && <Loader />}
                            {!activitiesLoading && (
                              <tbody className="divide-y divide-gray-200 bg-white">
                                {retainerServiceActivities.map((service) => (
                                  <tr key={service.id}>
                                    <td className="px-2 py-2 text-sm text-gray-500 sm:pl-0">
                                      {service.timestamp}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-sky-500 font-semibold cursor-pointer">
                                      <Link
                                        to={`/report/review/${service.job_id}`}
                                      >
                                        {service.purchase_order}
                                      </Link>
                                    </td>
                                    {!currentUser.isCustomer && (
                                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                        <div className="truncate overflow-ellipsis w-40">
                                          {service.customer_name}
                                        </div>
                                      </td>
                                    )}
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {service.tail_number}
                                    </td>
                                    <td className="px-2 py-2 text-sm text-gray-500">
                                      <div className="truncate overflow-ellipsis w-40">
                                        {service.airport_name}
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      {service.fbo_name}
                                    </td>
                                    <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-500">
                                      <div className=" truncate overflow-ellipsis w-80">
                                        {service.service_name}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            )}
                          </table>
                        </div>
                      </div>

                      {/* MOBILE */}
                      <div className="xs:block sm:block xl:hidden lg:hidden md:hidden bg-white shadow sm:rounded-md my-4">
                        {activitiesLoading && <Loader />}
                        {!activitiesLoading && (
                          <ul className="divide-y divide-gray-200 text-md text-gray-500">
                            {retainerServiceActivities.map((service) => (
                              <li key={service.id}>
                                <div className="px-2 py-8">
                                  <div className="flex justify-between gap-2">
                                    <div>{service.timestamp}</div>
                                    <div className="text-sky-500">
                                      <Link
                                        to={`/report/review/${service.job_id}`}
                                      >
                                        {service.purchase_order}
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="font-semibold mt-2">
                                    {service.service_name}
                                  </div>
                                  <div className="flex justify-between gap-2 mt-1">
                                    <div>
                                      <div className="bg-gray-100 p-1 rounded-md">
                                        {service.airport_name}
                                      </div>
                                    </div>
                                    <div className="relative top-1">
                                      {service.fbo_name}
                                    </div>
                                    <div className="italic relative top-1">
                                      {service.tail_number}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {!activitiesLoading && totalRetainerServiceActivities > 200 && (
                  <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
                    <div>
                      <Pagination
                        innerClass="pagination pagination-custom"
                        activePage={currentPage}
                        hideDisabled
                        itemClass="page-item page-item-custom"
                        linkClass="page-link page-link-custom"
                        itemsCountPerPage={200}
                        totalItemsCount={totalRetainerServiceActivities}
                        pageRangeDisplayed={3}
                        onChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </AnimatedPage>
  );
}
