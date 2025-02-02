import { useState, useEffect, Fragment } from "react";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { Listbox, Transition, Switch, RadioGroup } from "@headlessui/react";
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
  { id: "A", name: "Confirmed" },
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

  const [vendors, setVendors] = useState([]);

  const [tags, setTags] = useState([]);

  const [customerFollowerEmails, setCustomerFollowerEmails] = useState([]);
  const [jobFollowerEmails, setJobFollowerEmails] = useState([]);
  const [customerFollowerEmailSearchTerm, setCustomerFollowerEmailSearchTerm] =
    useState("");

  const [customerSelected, setCustomerSelected] = useState({});
  const [aircraftTypeSelected, setAircraftTypeSelected] = useState({});
  const [airportSelected, setAirportSelected] = useState({});
  const [fboSelected, setFboSelected] = useState({});
  const [vendorSelected, setVendorSelected] = useState({});

  const [estimatedArrivalDate, setEstimatedArrivalDate] = useState(null);
  const [estimatedDepartureDate, setEstimatedDepartureDate] = useState(null);
  const [completeByDate, setCompleteByDate] = useState(null);

  const [hoursWorked, setHoursWorked] = useState(0);
  const [minutesWorked, setMinutesWorked] = useState(0);
  const [numberOfWorkers, setNumberOfWorkers] = useState(1);

  const [vendorName, setVendorName] = useState("");
  const [vendorCharge, setVendorCharge] = useState(0);
  const [vendorAdditionalCost, setVendorAdditionalCost] = useState(0);
  const [internalAdditionalCost, setInternalAdditionalCost] = useState(0);

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
  const [vendorSearchTerm, setVendorSearchTerm] = useState("");

  const [ident, setIdent] = useState("");

  const [enableFlightawareTracking, setEnableFlightawareTracking] =
    useState(false);

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

  useEffect(() => {
    if (customerSelected) {
      let timeoutID = setTimeout(() => {
        searchCustomerFollowerEmails();
      }, 500);

      return () => {
        clearTimeout(timeoutID);
      };
    }
  }, [customerFollowerEmailSearchTerm, customerSelected]);

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

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchVendors();
    }, 200);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [vendorSearchTerm]);

  const searchCustomerFollowerEmails = async () => {
    try {
      const { data } = await api.searchCustomerFollowerEmails({
        customer_id: customerSelected?.id,
        email: customerFollowerEmailSearchTerm,
      });

      setCustomerFollowerEmails(data.results);
    } catch (err) {
      toast.error("Unable to search customer follower emails");
    }
  };

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

  const searchVendors = async () => {
    try {
      const { data } = await api.searchVendors({ name: vendorSearchTerm });

      data.results.unshift({ id: null, name: "None" });

      setVendors(data.results);
    } catch (err) {
      toast.error("Unable to fetch vendors");
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

    const allVendors = [{ id: null, name: "None" }];

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

      data.vendors.forEach((vendor) => {
        allVendors.push(vendor);
      });

      const response = await api.getJobDetails(jobId);

      setTailNumber(response.data.tailNumber);
      setPrice(response.data.price);
      setCustomerPurchaseOrder(response.data.customer_purchase_order);
      setHoursWorked(
        response.data.hours_worked ? response.data.hours_worked : 0
      );
      setMinutesWorked(
        response.data.minutes_worked ? response.data.minutes_worked : 0
      );
      setNumberOfWorkers(
        response.data.number_of_workers ? response.data.number_of_workers : 0
      );

      if (response.data.requested_by) {
        setRequestedBy(response.data.requested_by);
      }

      if (location.pathname.includes("review")) {
        // only add Invoiced if it is not part of the availableStatuses array already
        if (!availableStatuses.find((status) => status.id === "I")) {
          availableStatuses.push({ id: "I", name: "Invoiced" });
        }
        //Only add Not Invoice if it is not part of the availableStatuses array already
        if (!availableStatuses.find((status) => status.id === "N")) {
          availableStatuses.push({ id: "N", name: "Not Invoiced" });
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

      setJobFollowerEmails(response.data.follower_emails);

      setEnableFlightawareTracking(response.data.enable_flightaware_tracking);

      const request = {
        airport_id: response.data.airport.id,
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

      try {
        const r1 = await api.getUserDetails();

        if (r1.data.isCustomer) {
          navigate(-1);
        }

        if (
          r1.data.isAdmin ||
          r1.data.isSuperUser ||
          r1.data.isAccountManager
        ) {
          const r = await api.getJobInvoiceDetails(Number(jobId));

          setInternalAdditionalCost(r.data.internal_additional_cost);

          let selectedVendor = { id: null, name: "None" };

          if (r.data.vendor) {
            selectedVendor = allVendors.find((v) => v.id === r.data.vendor.id);

            setVendorCharge(r.data.vendor.charge);
            setVendorAdditionalCost(r.data.vendor.additional_cost);
          }

          setVendorSelected(selectedVendor);

          const response3 = await api.getIdentTailLookup(
            response.data.tailNumber
          );

          if (response3) {
            setIdent(response3.data);
          } else {
            setIdent("");
          }
        }
      } catch (err) {
        toast.error("Unable to get invoice details");
      }

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
    const selectedJobFollowerEmails = jobFollowerEmails.map(
      (email) => email.email
    );

    const totalMinutes = parseInt(hoursWorked) * 60 + parseInt(minutesWorked);
    const totalHours = totalMinutes / 60;
    const laborTime = totalHours * numberOfWorkers;

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
      followerEmails: selectedJobFollowerEmails,
      hours_worked: parseInt(hoursWorked),
      minutes_worked: parseInt(minutesWorked),
      number_of_workers: parseInt(numberOfWorkers),
      labor_time: laborTime,
      internal_additional_cost: Number(internalAdditionalCost),
      vendor: vendorSelected.id,
      vendor_charge: Number(vendorCharge),
      vendor_additional_cost: Number(vendorAdditionalCost),
      enable_flightaware_tracking: enableFlightawareTracking,
      ident,
    };

    try {
      await api.updateJob(jobId, request);

      navigate(-1);
    } catch (e) {
      toast.error("Unable to edit job");
    }
  };

  const handleAddFollowerEmail = (email) => {
    if (email) {
      //only add email if email.email does not exist in jobFollowerEmails
      if (
        jobFollowerEmails.filter((e) => e.email === email.email).length === 0
      ) {
        setJobFollowerEmails([...jobFollowerEmails, email]);
      }
    } else {
      if (customerFollowerEmailSearchTerm) {
        // customerFollowerEmailSearchTerm must be a valid email address and not have commas
        if (
          !customerFollowerEmailSearchTerm.includes(",") &&
          validateEmail(customerFollowerEmailSearchTerm)
        ) {
          const newEmail = {
            email: customerFollowerEmailSearchTerm,
          };

          //only add email if email.email does not exist in jobFollowerEmails
          if (
            jobFollowerEmails.filter((e) => e.email === newEmail.email)
              .length === 0
          ) {
            setJobFollowerEmails([...jobFollowerEmails, newEmail]);
          }
        }
      }
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
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

  const handleSetNumberOfWorkers = (value) => {
    //it can only be a positive number
    if (value >= 0) {
      setNumberOfWorkers(value);
    }
  };

  const handleSetHoursWorked = (value) => {
    //it can only be a positive number
    if (value >= 0) {
      setHoursWorked(value);
    }
  };

  const handleSetInternalAdditionalCost = (value) => {
    //it can only be a positive number
    if (value >= 0) {
      setInternalAdditionalCost(value);
    }
  };

  const handleSetVendorCharge = (value) => {
    //it can only be a positive number
    if (value >= 0) {
      setVendorCharge(value);
    }
  };

  const handleSetVendorAdditionalCost = (value) => {
    //it can only be a positive number
    if (value >= 0) {
      setVendorAdditionalCost(value);
    }
  };

  const handleSetMinutesWorked = (value) => {
    //it can only be a positive number
    if (value >= 0) {
      setMinutesWorked(value);
    }
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

  const handleRemoveFollowerEmail = (email) => {
    const updatedEmails = jobFollowerEmails.filter(
      (e) => e.email !== email.email
    );

    setJobFollowerEmails(updatedEmails);
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

      <h1 className="text-xl xl:text-2xl font-bold text-gray-700 flex gap-2 mt-4">
        Edit Job
      </h1>
      <div
        className="grid 3xl:grid-cols-4 2xl:grid-cols-3 xl:grid-cols-2
                          lg:grid-cols-2 md:grid-cols-2
                          sm:grid-cols-1 xs:grid-cols-1 mt-2 gap-6"
      >
        {/* LOCATION AND TIMES */}
        <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
          <div className="p-4 bg-gray-100">
            <h3 className="text-base font-bold leading-7 text-gray-900 uppercase">
              Location and Times
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex flex-wrap gap-4">
                <dt className="text-md font-bold text-gray-900 relative top-2 w-20">
                  Airport:
                </dt>
                <dd className="text-md text-gray-700 flex-1">
                  <Listbox
                    value={airportSelected}
                    onChange={handleAirportSelectedChange}
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
                </dd>
              </div>
              <div className="px-4 py-3 flex gap-4">
                <dt className="text-md font-bold text-gray-900 relative top-2 w-20">
                  FBO:
                </dt>
                <dd className="text-md text-gray-700 flex-1">
                  <Listbox value={fboSelected} onChange={setFboSelected}>
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
                </dd>
              </div>
              <div className="px-4 py-3 gap-4 pr-2">
                <dt className="flex justify-between gap-4text-md font-bold text-gray-900 relative">
                  <div>Arrival:</div>
                  <div className="text-sm  text-gray-500 mb-1 flex justify-between text-right">
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
                        className="ml-2 underline text-sm text-red-500 cursor-pointer"
                      >
                        clear
                      </span>
                    )}
                  </div>
                </dt>
                <dd className="text-md text-gray-700 mt-1">
                  <div>
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
                        onChange={(date) =>
                          handleEstimatedArrivalDateChange(date)
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
                </dd>
              </div>
              <div className="px-4 py-3 gap-4 pr-2">
                <dt className="flex justify-between gap-4 text-md font-bold text-gray-900">
                  <div>Departure:</div>
                  <label className="block text-sm text-gray-500 mb-1">
                    {estimatedDepartureDate && (
                      <span
                        onClick={() => setEstimatedDepartureDate(null)}
                        className="ml-2 underline text-sm text-red-500 cursor-pointer"
                      >
                        clear
                      </span>
                    )}
                  </label>
                </dt>
                <dd className="text-md text-gray-700 mt-1">
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
                </dd>
              </div>
              <div className="px-4 py-3 gap-4 pr-2">
                <dt className="flex justify-between gap-4 text-md font-bold text-gray-900 relative">
                  <div>Complete Before:</div>
                  <label className="block text-sm  text-gray-500 mb-1">
                    {completeByDate && (
                      <span
                        onClick={() => setCompleteByDate(null)}
                        className="ml-2 underline text-sm text-red-500 cursor-pointer"
                      >
                        clear
                      </span>
                    )}
                  </label>
                </dt>
                <dd className="text-md text-gray-700 mt-1">
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
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* JOB INFO */}
        <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
          <div className="px-4 py-3 bg-gray-100">
            <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
              Job Info
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-3 flex gap-4">
                <dt className="text-md font-bold text-gray-900 relative top-2 w-32">
                  Tail Number:
                </dt>
                <dd className="text-md text-gray-700 flex-1">
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
                </dd>
              </div>
              {currentUser.canSeePrice && (
                <div className="px-4 py-3 flex gap-4">
                  <dt className="text-md font-bold text-gray-900 relative top-2 w-32">
                    Price:
                  </dt>
                  <dd className="text-md text-gray-700 flex-1">
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => handleSetPrice(e.target.value)}
                      name="price"
                      id="price"
                      className="block w-full rounded-md border-gray-300 shadow-sm
                                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </dd>
                </div>
              )}
              <div className="px-4 py-3 flex gap-4">
                <dt className="text-md font-bold text-gray-900 relative top-2 w-32">
                  Status:
                </dt>
                <dd className="text-md text-gray-700 flex-1">
                  <Listbox value={selectedStatus} onChange={setSelectedStatus}>
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
                </dd>
              </div>
              <div className="px-4 py-3 flex gap-4">
                <dt className="text-md font-bold text-gray-900 relative top-2 w-32">
                  Customer:
                </dt>
                <dd className="text-md text-gray-700 flex-1">
                  <Listbox
                    value={customerSelected}
                    onChange={setCustomerSelected}
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
                </dd>
              </div>
              <div className="px-4 py-3 flex gap-4">
                <dt className="text-md font-bold text-gray-900 relative top-2 w-32">
                  Aircraft Type:
                </dt>
                <dd className="text-md text-gray-700 flex-1">
                  <Listbox
                    value={aircraftTypeSelected}
                    onChange={setAircraftTypeSelected}
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
                </dd>
              </div>
              <div className="px-4 py-3 flex gap-4">
                <dt className="text-md font-bold text-gray-900 relative top-2 w-32">
                  Customer PO:
                </dt>
                <dd className="text-md text-gray-700 flex-1">
                  <input
                    type="text"
                    value={customerPurchaseOrder}
                    onChange={(e) => setCustomerPurchaseOrder(e.target.value)}
                    name="customer_purchase_order"
                    id="customer_purchase_order"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </dd>
              </div>
              <div className="px-4 py-3 flex gap-4">
                <dt className="text-md font-bold text-gray-900 relative top-2 w-32">
                  Requested By:
                </dt>
                <dd className="text-md text-gray-700 flex-1">
                  <input
                    type="text"
                    value={requestedBy}
                    onChange={(e) => setRequestedBy(e.target.value)}
                    name="requestedBy"
                    id="requestedBy"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </dd>
              </div>
              {(currentUser.isAdmin ||
                currentUser.isSuperUser ||
                currentUser.isInternalCoordinator ||
                currentUser.isAccountManager) && (
                <>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900 relative top-2 w-32">
                      FA Tracking:
                    </dt>
                    <dd className="text-md text-gray-700 flex-1">
                      <Switch.Group
                        as="li"
                        className="flex items-center justify-center mt-2"
                      >
                        <div className="flex flex-col">
                          <Switch.Label
                            as="p"
                            className="text-md text-gray-500"
                            passive
                          >
                            {enableFlightawareTracking
                              ? "Disable Flightaware Tracking"
                              : "Enable Flightaware Tracking"}
                          </Switch.Label>
                        </div>
                        <Switch
                          checked={enableFlightawareTracking}
                          onChange={setEnableFlightawareTracking}
                          className={classNames(
                            enableFlightawareTracking
                              ? "bg-red-500"
                              : "bg-gray-200",
                            "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              enableFlightawareTracking
                                ? "translate-x-5"
                                : "translate-x-0",
                              "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            )}
                          />
                        </Switch>
                      </Switch.Group>
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900 relative top-2 w-32">
                      Call Sign:
                    </dt>
                    <dd className="text-md text-gray-700 flex-1">
                      <input
                        type="text"
                        value={ident}
                        onChange={(e) => setIdent(e.target.value)}
                        name="ident"
                        id="ident"
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>

        {(currentUser.isAdmin ||
          currentUser.isSuperUser ||
          currentUser.isInternalCoordinator ||
          currentUser.isAccountManager) && (
          <>
            {/* LABOR */}
            <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
              <div className="px-4 py-3 bg-gray-100">
                <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                  Labor
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900 relative top-2 w-48">
                      Hours Worked:
                    </dt>
                    <dd className="text-md text-gray-700 flex-1">
                      <input
                        type="text"
                        value={hoursWorked}
                        onChange={(e) => handleSetHoursWorked(e.target.value)}
                        name="hours"
                        id="hours"
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900 relative top-2 w-48">
                      Minutes Worked:
                    </dt>
                    <dd className="text-md text-gray-700 flex-1">
                      <input
                        type="text"
                        value={minutesWorked}
                        onChange={(e) => handleSetMinutesWorked(e.target.value)}
                        name="minutes"
                        id="minutes"
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900 relative top-2 w-48">
                      Number of Workers:
                    </dt>
                    <dd className="text-md text-gray-700 flex-1">
                      <input
                        type="text"
                        value={numberOfWorkers}
                        onChange={(e) =>
                          handleSetNumberOfWorkers(e.target.value)
                        }
                        name="workers"
                        id="workers"
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </>
        )}

        {(currentUser.isAdmin ||
          currentUser.isSuperUser ||
          currentUser.isAccountManager) && (
          <>
            {/* INVOICE DETAILS */}
            <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
              <div className="px-4 py-3 bg-gray-100">
                <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                  Invoice Details
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900 relative top-2 w-48">
                      Internal Additional Cost:
                    </dt>
                    <dd className="text-md text-gray-700 flex-1">
                      <input
                        type="text"
                        value={internalAdditionalCost}
                        onChange={(e) =>
                          handleSetInternalAdditionalCost(e.target.value)
                        }
                        name="internalAdditionalCost"
                        id="internalAdditionalCost"
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900 relative top-2 w-48">
                      Vendor:
                    </dt>
                    <dd className="text-md text-gray-700 flex-1">
                      <Listbox
                        value={vendorSelected}
                        onChange={setVendorSelected}
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
                                  {vendorSelected.name}
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
                                          value={vendorSearchTerm}
                                          onChange={(e) =>
                                            setVendorSearchTerm(e.target.value)
                                          }
                                          className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                                        border-gray-300 rounded-md"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                          {vendorSearchTerm && (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-6 w-6 text-blue-500 font-bold mr-1"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                              onClick={() => {
                                                setVendorSearchTerm("");
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
                                  {vendors.map((vendor) => (
                                    <Listbox.Option
                                      key={vendor.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "text-white bg-red-600"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                      value={vendor}
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
                                            {vendor.name}
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
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900 relative top-2 w-48">
                      Vendor Charge:
                    </dt>
                    <dd className="text-md text-gray-700 flex-1">
                      <input
                        type="text"
                        value={vendorCharge}
                        onChange={(e) => handleSetVendorCharge(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900 relative top-2 w-48">
                      Vendor Additional Cost:
                    </dt>
                    <dd className="text-md text-gray-700 flex-1">
                      <input
                        type="text"
                        value={vendorAdditionalCost}
                        onChange={(e) =>
                          handleSetVendorAdditionalCost(e.target.value)
                        }
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </>
        )}
      </div>

      {(currentUser.isAdmin ||
        currentUser.isSuperUser ||
        currentUser.isInternalCoordinator ||
        currentUser.isAccountManager) && (
        <>
          <div className="grid grid-cols-1 mt-2 gap-6">
            {/* TAGS */}
            <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
              <div className="px-4 py-3 bg-gray-100">
                <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                  Tags
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <div className="flex flex-wrap gap-4 mt-6 px-4 pb-6">
                  {tags.map((tag) => (
                    <div
                      key={tag.id}
                      onClick={() => handleTagChange(tag)}
                      className={`${
                        tag.selected
                          ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                          : "hover:bg-gray-50"
                      } rounded-md cursor-pointer border border-gray-300
                                                py-3 px-3 flex items-center justify-center text-md
                                                uppercase `}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 mt-2">
            {/* FOLLOWER EMAILS */}
            <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
              <div className="px-4 py-3 bg-gray-100">
                <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                  Follower Emails
                </h3>
              </div>
              <div className="border-t border-gray-200 grid xl:grid-cols-2 xs:grid-cols-1 gap-12 px-4 py-3">
                <div>
                  <div className="text-lg text-gray-500 tracking-wide">
                    Add Email
                  </div>
                  <div className="mt-1 flex">
                    <div className="-mr-px grid grow grid-cols-1 focus-within:relative">
                      <input
                        type="text"
                        value={customerFollowerEmailSearchTerm}
                        onChange={(e) =>
                          setCustomerFollowerEmailSearchTerm(e.target.value)
                        }
                        placeholder="Enter one valid email address"
                        className="col-start-1 row-start-1  rounded-l-md
                                     block w-full rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddFollowerEmail()}
                      className="flex shrink-0 items-center gap-x-1.5 rounded-r-md
                                 bg-white px-3 py-2 text-sm font-semibold text-gray-900
                                  outline outline-1 -outline-offset-1 outline-gray-300
                                hover:bg-gray-50 focus:relative focus:outline focus:outline-2
                                 focus:-outline-offset-2 focus:outline-sky-500"
                    >
                      Add
                    </button>
                  </div>
                  {customerFollowerEmails.length > 0 && (
                    <div className="mt-2 text-lg text-gray-500 tracking-wide">
                      Suggestions
                    </div>
                  )}
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "700px" }}
                  >
                    <ul role="list" className="divide-y divide-gray-100">
                      {customerFollowerEmails.map((email) => (
                        <li
                          key={email.id}
                          className="flex items-center justify-between gap-x-6 py-2 hover:bg-gray-50"
                        >
                          <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                              <p className="mt-1 truncate text-xs/5 text-gray-500">
                                {email.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddFollowerEmail(email)}
                            className="rounded-md bg-white px-2.5 py-1.5 text-sm
                                                    font-semibold text-gray-900 shadow-sm ring-1
                                                    ring-inset ring-gray-300 hover:bg-gray-50 block"
                          >
                            Add
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  {jobFollowerEmails.length > 0 && (
                    <div className="text-lg text-gray-500 tracking-wide">
                      Selected Emails
                    </div>
                  )}
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "700px" }}
                  >
                    <ul role="list" className="divide-y divide-gray-100">
                      {jobFollowerEmails.map((email, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between gap-x-6 py-2 hover:bg-gray-50"
                        >
                          <div className="flex min-w-0 gap-x-4">
                            <div className="min-w-0 flex-auto">
                              <p className="mt-1 truncate text-xs/5 text-gray-500">
                                {email.email}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFollowerEmail(email)}
                            className="rounded-md bg-white px-2.5 py-1.5 text-sm
                                                font-semibold text-gray-900 shadow-sm ring-1
                                                ring-inset ring-gray-300 hover:bg-gray-50 block"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-6 mt-10 m-auto text-center justify-center">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center justify-center rounded-md border
                                      border-gray-300 bg-white px-4 py-2 text-xl
                                      text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => updateJob()}
          className={`relative inline-flex items-center rounded-md border border-transparent
                            bg-red-600 px-4 py-2 text-2xl front-medium text-white shadow-sm
                                hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2`}
        >
          Save Changes
        </button>
      </div>
    </AnimatedPage>
  );
};

export default EditJob;
