import { useState, useEffect, Fragment } from "react";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
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

const availableStatuses = [
  { id: "U", name: "Submitted" },
  { id: "A", name: "Accepted" },
  { id: "S", name: "Assigned" },
  { id: "W", name: "In Progress" },
  { id: "R", name: "Review" },
  { id: "T", name: "Canceled" },
  { id: "C", name: "Complete" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const EditJob = () => {
  const { jobId } = useParams();

  const location = useLocation();

  const currentUser = useAppSelector(selectUser);

  const [loading, setLoading] = useState(false);
  const [createJobMessage, setCreateJobMessage] = useState(null);
  const [jobDetails, setJobDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const [tailNumber, setTailNumber] = useState("");
  const [price, setPrice] = useState("");
  const [statuses, setStatuses] = useState(availableStatuses);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [tailNumberErrorMessage, setTailNumberErrorMessage] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [fbos, setFbos] = useState([]);
  const [allFbos, setAllFbos] = useState([]);
  const [services, setServices] = useState([]);
  const [retainerServices, setRetainerServices] = useState([]);

  const [tags, setTags] = useState([]);

  const [customerSelected, setCustomerSelected] = useState({});
  const [aircraftTypeSelected, setAircraftTypeSelected] = useState({});
  const [airportSelected, setAirportSelected] = useState({});
  const [fboSelected, setFboSelected] = useState({});

  const [estimatedArrivalDate, setEstimatedArrivalDate] = useState(null);
  const [estimatedDepartureDate, setEstimatedDepartureDate] = useState(null);
  const [completeByDate, setCompleteByDate] = useState(null);

  const [estimatedArrivalDateOpen, setEstimatedArrivalDateOpen] =
    useState(false);
  const [estimatedDepartureDateOpen, setEstimatedDepartureDateOpen] =
    useState(false);
  const [completeByDateOpen, setCompleteByDateOpen] = useState(false);

  const [requestedBy, setRequestedBy] = useState("");
  const [customerPurchaseOrder, setCustomerPurchaseOrder] = useState("");

  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [aircraftSearchTerm, setAircraftSearchTerm] = useState("");
  const [airportSearchTerm, setAirportSearchTerm] = useState("");
  const [fboSearchTerm, setFboSearchTerm] = useState("");

  const filteredAircraftTypes = aircraftSearchTerm
    ? aircraftTypes.filter((item) =>
        item.name.toLowerCase().includes(aircraftSearchTerm.toLowerCase())
      )
    : aircraftTypes;

  const filteredCustomers = customerSearchTerm
    ? customers.filter((item) =>
        item.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
      )
    : customers;

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

  const [onSite, setOnSite] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getJobInfo();
  }, []);

  const getJobInfo = async () => {
    setLoading(true);

    try {
      const { data } = await api.getJobFormInfo();
      setCustomers(data.customers);
      setAircraftTypes(data.aircraft_types);
      setAirports(data.airports);
      setFbos(data.fbos);
      setAllFbos(data.fbos);
      setServices(data.services);
      setRetainerServices(data.retainer_services);
      setTags(data.tags);

      const response = await api.getJobDetails(jobId);

      setTailNumber(response.data.tailNumber);
      setPrice(response.data.price);
      setCustomerPurchaseOrder(response.data.customer_purchase_order);

      if (response.data.requested_by) {
        setRequestedBy(response.data.requested_by);
      }

      if (location.pathname.includes("review")) {
        // only add Invoiced if it is not part of the availableStatuses array already
        if (!availableStatuses.find((status) => status.id === "I")) {
          availableStatuses.push({ id: "I", name: "Invoiced" });
        }
      }

      setSelectedStatus(
        availableStatuses.find((a) => a.id === response.data.status)
      );
      setCustomerSelected(
        data.customers.find((c) => c.id === response.data.customer.id)
      );
      setAircraftTypeSelected(
        data.aircraft_types.find((a) => a.id === response.data.aircraftType.id)
      );
      setAirportSelected(
        data.airports.find((a) => a.id === response.data.airport.id)
      );
      setFboSelected(data.fbos.find((f) => f.id === response.data.fbo.id));

      if (response.data.completeBy) {
        setCompleteByDate(new Date(response.data.completeBy));
      }

      if (response.data.on_site) {
        setOnSite(true);
      } else {
        if (response.data.estimatedETA) {
          setEstimatedArrivalDate(new Date(response.data.estimatedETA));
        }
      }

      if (response.data.estimatedETD) {
        setEstimatedDepartureDate(new Date(response.data.estimatedETD));
      }

      // update tags with the selected tags
      const updatedTags = data.tags.map((tag) => {
        if (response.data.tags.find((t) => t.tag_name === tag.name)) {
          return { ...tag, selected: true };
        } else {
          return { ...tag, selected: false };
        }
      });

      setTags(updatedTags);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  let requested_by = null;

  if (requestedBy !== "") {
    requested_by = requestedBy;
  }

  let customer_purchase_order = null;

  if (customerPurchaseOrder !== "") {
    customer_purchase_order = customerPurchaseOrder;
  }

  const updateJob = async () => {
    const selectedTags = tags.filter((tag) => tag.selected === true);
    const selectedTagIds = selectedTags.map((tag) => tag.id);

    const request = {
      tailNumber,
      price,
      customer: customerSelected.id,
      aircraftType: aircraftTypeSelected.id,
      airport: airportSelected.id,
      fbo: fboSelected.id,
      status: selectedStatus.id,
      estimatedETA: estimatedArrivalDate,
      estimatedETD: estimatedDepartureDate,
      completeBy: completeByDate,
      on_site: onSite,
      requested_by: requested_by,
      customer_purchase_order: customer_purchase_order,
      tags: selectedTagIds,
    };

    try {
      await api.updateJob(jobId, request);

      navigate(-1);
    } catch (e) {
      toast.error("Unable to edit job");
    }
  };

  const handleToggleEstimatedArrivalDate = () => {
    setEstimatedArrivalDateOpen(!estimatedArrivalDateOpen);
  };

  const handleToggleEstimatedDepartureDate = () => {
    setEstimatedDepartureDateOpen(!estimatedDepartureDateOpen);
  };

  const handleToggleCompleteByDate = () => {
    setCompleteByDateOpen(!completeByDateOpen);
  };

  const handleEstimatedArrivalDateChange = (date, event) => {
    setOnSite(false);
    setEstimatedArrivalDate(date);
  };

  const handleEstimatedDepartureDateChange = (date, event) => {
    setEstimatedDepartureDate(date);
  };

  const handleCompleteByDateChange = (date, event) => {
    setCompleteByDate(date);
  };

  const handleSetPrice = (e) => {
    const value = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setPrice(value);
  };

  const handleSetOnSite = () => {
    setOnSite(!onSite);
    setEstimatedArrivalDate(null);
  };

  const handleTagChange = (tag) => {
    const tagsUpdated = tags.map((el) => {
      if (el.id === tag.id) {
        el.selected = !el.selected;
      }
      return el;
    });

    setTags(tagsUpdated);
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

  return (
    <AnimatedPage>
      {loading && (
        <>
          <Loader />
          {createJobMessage && (
            <div className="text-gray-500 text-sm m-auto text-center">
              {createJobMessage}
            </div>
          )}
        </>
      )}

      {!loading && errorMessage && (
        <div className="text-gray-500 m-auto text-center mt-20">
          {errorMessage}
        </div>
      )}

      {!loading && errorMessage == null && (
        <main className="mx-auto max-w-lg px-4 pb-16 lg:pb-12">
          <div>
            <div className="space-y-6">
              <div className="mt-6">
                <h1 className="text-2xl font-semibold text-gray-600">
                  Edit Job
                </h1>
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
                    onChange={(e) =>
                      setTailNumber(e.target.value.toLocaleUpperCase())
                    }
                    name="tailNumber"
                    id="tailNumber"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                  {tailNumberErrorMessage && (
                    <p className="text-red-500 text-xs mt-2">
                      {tailNumberErrorMessage}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => handleSetPrice(e.target.value)}
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-1">
                <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-sm font-medium text-gray-700">
                        Status
                      </Listbox.Label>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm"
                        >
                          <span className="block truncate">
                            {selectedStatus?.name}
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
                            {availableStatuses.map((status) => (
                              <Listbox.Option
                                key={status.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={status}
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
                                      {status.name}
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
                  value={customerSelected}
                  onChange={setCustomerSelected}
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
                            {customerSelected.name}
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
              </div>

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
                            {aircraftTypeSelected.name}
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

                            {filteredAircraftTypes.map((aircraftType) => (
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
                            {airportSelected.name}
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
                            {fboSelected.name}
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

              <div>
                <div className="text-sm  text-gray-500 mb-1 flex justify-between">
                  Estimated Arrival
                  <div className="flex gap-2">
                    <div className="flex h-5 items-center">
                      <input
                        id="onSite"
                        checked={onSite}
                        value={onSite}
                        onClick={handleSetOnSite}
                        name="onSite"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>
                    <label htmlFor="onSite" className=" text-gray-500">
                      On site
                    </label>
                  </div>
                  {estimatedArrivalDate && (
                    <span
                      onClick={() => setEstimatedArrivalDate(null)}
                      className="ml-2 underline text-xs text-red-500 cursor-pointer"
                    >
                      clear
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleToggleEstimatedArrivalDate}
                  className="inline-flex items-center rounded-md border
                                           w-full h-10
                                          border-gray-300 bg-white px-4 py-2 text-sm
                                            text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {estimatedArrivalDate?.toLocaleString("en-US", {
                    hour12: false,
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
                {estimatedArrivalDateOpen && (
                  <DatePicker
                    selected={estimatedArrivalDate}
                    onChange={(date) => handleEstimatedArrivalDateChange(date)}
                    locale="pt-BR"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    dateFormat="Pp"
                    inline
                  />
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Estimated Departure
                  {estimatedDepartureDate && (
                    <span
                      onClick={() => setEstimatedDepartureDate(null)}
                      className="ml-2 underline text-xs text-red-500 cursor-pointer"
                    >
                      clear
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={handleToggleEstimatedDepartureDate}
                  className="inline-flex items-center rounded-md border
                                           w-full h-10
                                          border-gray-300 bg-white px-4 py-2 text-sm
                                            text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {estimatedDepartureDate?.toLocaleString("en-US", {
                    hour12: false,
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
                {estimatedDepartureDateOpen && (
                  <DatePicker
                    selected={estimatedDepartureDate}
                    onChange={(date) =>
                      handleEstimatedDepartureDateChange(date)
                    }
                    locale="pt-BR"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    dateFormat="Pp"
                    inline
                  />
                )}
              </div>

              <div>
                <label className="block text-sm  text-gray-500 mb-1">
                  Complete Before
                  {completeByDate && (
                    <span
                      onClick={() => setCompleteByDate(null)}
                      className="ml-2 underline text-xs text-red-500 cursor-pointer"
                    >
                      clear
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={handleToggleCompleteByDate}
                  className="inline-flex items-center rounded-md border
                                           w-full h-10
                                          border-gray-300 bg-white px-4 py-2 text-sm
                                            text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {completeByDate?.toLocaleString("en-US", {
                    hour12: false,
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </button>
                {completeByDateOpen && (
                  <DatePicker
                    selected={completeByDate}
                    onChange={(date) => handleCompleteByDateChange(date)}
                    locale="pt-BR"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={5}
                    dateFormat="Pp"
                    inline
                  />
                )}
              </div>

              <div>
                <label
                  htmlFor="requestedBy"
                  className="block text-sm text-gray-500"
                >
                  Requested By
                </label>
                <span className="text-xs text-gray-500">
                  Enter a name when creating a job on behalf of someone else
                </span>
                <div className="mt-1">
                  <input
                    type="text"
                    value={requestedBy}
                    onChange={(e) => setRequestedBy(e.target.value)}
                    name="requestedBy"
                    id="requestedBy"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="customer_purchase_order"
                  className="block text-sm text-gray-500"
                >
                  Customer Purchase Order
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={customerPurchaseOrder}
                    onChange={(e) => setCustomerPurchaseOrder(e.target.value)}
                    name="customer_purchase_order"
                    id="customer_purchase_order"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>

              {(currentUser.isAdmin ||
                currentUser.isSuperUser ||
                currentUser.isInternalCoordinator ||
                currentUser.isAccountManager) && (
                <>
                  <div className="text-sm leading-5 font-medium text-gray-700">
                    Tags
                  </div>
                  {tags.map((tag) => (
                    <div key={tag.id} className="relative flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id={"tag" + tag.id}
                          name={tag.name}
                          checked={tag.selected}
                          onChange={() => handleTagChange(tag)}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor={"tag" + tag.id}
                          className="text-gray-700"
                        >
                          {tag.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="flex flex-col py-4 pb-20 gap-4">
                <button
                  type="button"
                  onClick={() => updateJob()}
                  className="inline-flex justify-center rounded-md
                                        border border-transparent bg-red-600 py-2 px-4
                                        text-sm font-medium text-white shadow-sm hover:bg-red-600
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-md border border-gray-300 bg-white w-full
                                        py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                        hover:bg-gray-50 focus:outline-none focus:ring-2
                                            focus:ring-red-500 focus:ring-offset-2"
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

export default EditJob;
