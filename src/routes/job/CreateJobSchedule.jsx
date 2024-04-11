import { useState, useEffect, Fragment } from "react";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Listbox, Transition, RadioGroup } from "@headlessui/react";
import {
  CheckIcon,
  CheckCircleIcon,
  InboxIcon,
  XCircleIcon,
} from "@heroicons/react/outline";
import { InformationCircleIcon } from "@heroicons/react/solid";
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

const availableSteps = [
  { id: 1, name: "Job Details", status: "current", selected: true },
  { id: 2, name: "Services & Retainers", status: "upcoming", selected: false },
  { id: 3, name: "Schedule Details", status: "upcoming", selected: false },
];

const scheduleTypes = [
  {
    id: 1,
    title: "Recurrent",
    description:
      "Creates a job every x number of days. The schedule will start on the specified start date.",
  },
  {
    id: 2,
    title: "One Time",
    description: "Creates one job on the specified start date",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CreateJobSchedule = () => {
  const { estimateId } = useParams();

  const [steps, setSteps] = useState(availableSteps);
  const isStepOneSelected = steps[0].selected;
  const isStepTwoSelected = steps[1].selected;
  const isStepThreeSelected = steps[2].selected;

  const [showTailAlert, setShowTailAlert] = useState(false);
  const [showTailOpenJobAlert, setShowTailOpenJobAlert] = useState(false);
  const [tailAlert, setTailAlert] = useState(null);
  const [tailOpenJobAlert, setTailOpenJobAlert] = useState(null);

  const [loading, setLoading] = useState(false);
  const [createJobMessage, setCreateJobMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [tailNumber, setTailNumber] = useState("");
  const [tailNumberErrorMessage, setTailNumberErrorMessage] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [fbos, setFbos] = useState([]);
  const [allFbos, setAllFbos] = useState([]);

  const [interiorServices, setInteriorServices] = useState([]);
  const [exteriorServices, setExteriorServices] = useState([]);
  const [otherServices, setOtherServices] = useState([]);

  const [interiorRetainerServices, setInteriorRetainerServices] = useState([]);
  const [exteriorRetainerServices, setExteriorRetainerServices] = useState([]);
  const [otherRetainerServices, setOtherRetainerServices] = useState([]);

  const [tags, setTags] = useState([]);

  const [customerSelected, setCustomerSelected] = useState(null);
  const [aircraftTypeSelected, setAircraftTypeSelected] = useState(null);
  const [airportSelected, setAirportSelected] = useState(null);
  const [fboSelected, setFboSelected] = useState(null);

  const [startDate, setStartDate] = useState(null);
  const [comment, setComment] = useState("");

  const [startDateOpen, setStartDateOpen] = useState(false);

  const [selectedScheduleType, setSelectedScheduleType] = useState(
    scheduleTypes[0]
  );

  const [repeatEvery, setRepeatEvery] = useState();

  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [aircraftSearchTerm, setAircraftSearchTerm] = useState("");
  const [airportSearchTerm, setAirportSearchTerm] = useState("");
  const [fboSearchTerm, setFboSearchTerm] = useState("");

  const currentUser = useAppSelector(selectUser);

  const navigate = useNavigate();

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

  useEffect(() => {
    const newSteps = [...steps];

    newSteps[0].selected = true;
    newSteps[0].status = "current";
    newSteps[1].status = "upcoming";
    newSteps[2].status = "upcoming";

    newSteps[1].selected = false;
    newSteps[2].selected = false;

    setSteps(newSteps);

    setSelectedScheduleType(scheduleTypes[0]);
  }, []);

  useEffect(() => {
    getJobInfo();
  }, []);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getTailLookups();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [tailNumber]);

  const getTailLookups = async () => {
    if (tailNumber?.length > 2 && !estimateId) {
      const { data } = await api.getTailAircraftLookup(tailNumber);

      if (data) {
        setAircraftTypeSelected({
          id: data.aircraft_id,
          name: data.aircraft_name,
        });
        setAircraftSearchTerm(data.aircraft_name);

        setCustomerSelected({ id: data.customer_id, name: data.customer_name });
        setCustomerSearchTerm(data.customer_name);

        if (data.services.length > 0 && !currentUser.isCustomer) {
          const updatedInteriorServices = interiorServices.map((s) => {
            if (
              data.services.some(
                (service) => service.id === s.id && service.category === "I"
              )
            ) {
              return { ...s, selected: true };
            } else {
              return { ...s, selected: false };
            }
          });

          setInteriorServices(updatedInteriorServices);

          const updatedExteriorServices = exteriorServices.map((s) => {
            if (
              data.services.some(
                (service) => service.id === s.id && service.category === "E"
              )
            ) {
              return { ...s, selected: true };
            } else {
              return { ...s, selected: false };
            }
          });

          setExteriorServices(updatedExteriorServices);

          const updatedOtherServices = otherServices.map((s) => {
            if (
              data.services.some(
                (service) => service.id === s.id && service.category === "O"
              )
            ) {
              return { ...s, selected: true };
            } else {
              return { ...s, selected: false };
            }
          });

          setOtherServices(updatedOtherServices);
        }

        // Do not update retainer services for customer users
        if (data.retainer_services.length > 0 && !currentUser.isCustomer) {
          const updatedInteriorRetainerServices = interiorRetainerServices.map(
            (s) => {
              if (
                data.retainer_services.some(
                  (service) => service.id === s.id && service.category === "I"
                )
              ) {
                return { ...s, selected: true };
              } else {
                return { ...s, selected: false };
              }
            }
          );

          setInteriorRetainerServices(updatedInteriorRetainerServices);

          const updatedExteriorRetainerServices = exteriorRetainerServices.map(
            (s) => {
              if (
                data.retainer_services.some(
                  (service) => service.id === s.id && service.category === "E"
                )
              ) {
                return { ...s, selected: true };
              } else {
                return { ...s, selected: false };
              }
            }
          );

          setExteriorRetainerServices(updatedExteriorRetainerServices);

          const updatedOtherRetainerServices = otherRetainerServices.map(
            (s) => {
              if (
                data.retainer_services.some(
                  (service) => service.id === s.id && service.category === "O"
                )
              ) {
                return { ...s, selected: true };
              } else {
                return { ...s, selected: false };
              }
            }
          );

          setOtherRetainerServices(updatedOtherRetainerServices);
        }
      }

      if (
        currentUser.isAdmin ||
        currentUser.isSuperUser ||
        currentUser.isAccountManager ||
        currentUser.isInternalCoordinator
      ) {
        const response = await api.getTailAlertLookup(tailNumber);
        if (response.data?.id > 0) {
          setShowTailAlert(true);
          setTailAlert(response.data);
        } else {
          setShowTailAlert(false);
          setTailAlert(null);
        }

        const r = await api.getTailOpenJobLookup(tailNumber);
        if (r.data?.jobId > 0) {
          setShowTailOpenJobAlert(true);
          setTailOpenJobAlert(r.data);
        } else {
          setShowTailOpenJobAlert(false);
          setTailOpenJobAlert(null);
        }
      }
    }
  };

  const getJobInfo = async () => {
    setLoading(true);

    try {
      const { data } = await api.getJobFormInfo();
      setCustomers(data.customers);
      setAircraftTypes(data.aircraft_types);
      setAirports(data.airports);
      setAllFbos(data.fbos);
      setFbos(data.fbos);
      setTags(data.tags);
    } catch (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  const createJobSchedule = async (routeName) => {
    let selectedServices = [];
    selectedServices = selectedServices.concat(
      interiorServices.filter((service) => service.selected === true)
    );
    selectedServices = selectedServices.concat(
      exteriorServices.filter((service) => service.selected === true)
    );
    selectedServices = selectedServices.concat(
      otherServices.filter((service) => service.selected === true)
    );

    let selectedRetainerServices = [];
    selectedRetainerServices = selectedRetainerServices.concat(
      interiorRetainerServices.filter((service) => service.selected === true)
    );
    selectedRetainerServices = selectedRetainerServices.concat(
      exteriorRetainerServices.filter((service) => service.selected === true)
    );
    selectedRetainerServices = selectedRetainerServices.concat(
      otherRetainerServices.filter((service) => service.selected === true)
    );

    const selectedTags = tags.filter((tag) => tag.selected === true);

    let selectedCustomer = customerSelected;

    if (currentUser.customerId) {
      selectedCustomer = {
        id: currentUser.customerId,
      };
    }

    setTailNumberErrorMessage(null);

    if (tailNumber.length === 0) {
      alert("Tail number is required");
      return;
    }

    if (!selectedCustomer) {
      alert("Customer is required");
      return;
    }

    if (!aircraftTypeSelected) {
      alert("Aircraft type is required");
      return;
    }

    if (!airportSelected) {
      alert("Airport is required");
      return;
    }

    if (!fboSelected) {
      alert("FBO is required");
      return;
    }

    if (
      selectedServices.length === 0 &&
      selectedRetainerServices.length === 0
    ) {
      alert("Select at least one service or retainer");
      return;
    }

    //if start date is null or start date is before today's date, alert user
    if (!startDate) {
      alert("Start date is required");
      return;
    }

    //if start date is before today's date, alert user. IGNORE minutes and seconds
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate && startDate < today) {
      alert("Start date cannot be before today's date");
      return;
    }

    const selectedServiceIds = selectedServices.map((service) => service.id);
    const selectedRetainerServiceIds = selectedRetainerServices.map(
      (service) => service.id
    );
    const selectedTagIds = selectedTags.map((tag) => tag.id);

    const request = {
      tailNumber: tailNumber,
      customer_id: selectedCustomer.id,
      aircraft_type_id: aircraftTypeSelected.id,
      airport_id: airportSelected.id,
      fbo_id: fboSelected.id,
      services: selectedServiceIds,
      retainer_services: selectedRetainerServiceIds,
      tags: selectedTagIds,
      comment: comment,
      is_recurrent: selectedScheduleType.id === 1,
      repeat_every: repeatEvery,
      start_date: startDate,
    };

    setLoading(true);

    setCreateJobMessage("Creating job schedule. Please wait...");

    try {
      const { data } = await api.createJobSchedule(request);

      setLoading(false);
      setCreateJobMessage(`A new job schedule has been created.`);
    } catch (error) {
      setLoading(false);
      setCreateJobMessage(null);
      toast.error("Unable to create job schedule");
    }
  };

  const handleToggleStartDate = () => {
    setStartDateOpen(!startDateOpen);
  };

  const handleServiceChange = (service) => {
    if (service.category === "I") {
      const interiorServicesUpdated = interiorServices.map((el) => {
        if (el.id === service.id) {
          el.selected = !el.selected;
        }
        return el;
      });

      setInteriorServices(interiorServicesUpdated);
    } else if (service.category === "E") {
      const exteriorServicesUpdated = exteriorServices.map((el) => {
        if (el.id === service.id) {
          el.selected = !el.selected;
        }
        return el;
      });

      setExteriorServices(exteriorServicesUpdated);
    } else {
      const otherServicesUpdated = otherServices.map((el) => {
        if (el.id === service.id) {
          el.selected = !el.selected;
        }
        return el;
      });

      setOtherServices(otherServicesUpdated);
    }
  };

  const handleRetainerServiceChange = (retainerService) => {
    if (retainerService.category === "I") {
      const interiorRetainerServicesUpdated = interiorRetainerServices.map(
        (el) => {
          if (el.id === retainerService.id) {
            el.selected = !el.selected;
          }
          return el;
        }
      );

      setInteriorRetainerServices(interiorRetainerServicesUpdated);
    } else if (retainerService.category === "E") {
      const exteriorRetainerServicesUpdated = exteriorRetainerServices.map(
        (el) => {
          if (el.id === retainerService.id) {
            el.selected = !el.selected;
          }
          return el;
        }
      );

      setExteriorRetainerServices(exteriorRetainerServicesUpdated);
    } else {
      const otherRetainerServicesUpdated = otherRetainerServices.map((el) => {
        if (el.id === retainerService.id) {
          el.selected = !el.selected;
        }
        return el;
      });

      setOtherRetainerServices(otherRetainerServicesUpdated);
    }
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

  const addAnotherSchedule = () => {
    setLoading(true);
    setCreateJobMessage(null);
    setTailNumber("");
    const newSteps = [...steps];

    newSteps[0].selected = true;
    newSteps[0].status = "current";
    newSteps[1].status = "upcoming";

    newSteps[1].selected = false;
    newSteps[2].selected = false;

    setSteps(newSteps);

    window.location.reload();
    setLoading(false);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const deleteTailAlert = async () => {
    await api.deleteTailAlert(tailAlert.id);
    setShowTailAlert(false);
  };

  const handleGoToNextStep = (currentStep) => {
    let selectedServices = [];
    selectedServices = selectedServices.concat(
      interiorServices.filter((service) => service.selected === true)
    );
    selectedServices = selectedServices.concat(
      exteriorServices.filter((service) => service.selected === true)
    );
    selectedServices = selectedServices.concat(
      otherServices.filter((service) => service.selected === true)
    );

    let selectedRetainerServices = [];
    selectedRetainerServices = selectedRetainerServices.concat(
      interiorRetainerServices.filter((service) => service.selected === true)
    );
    selectedRetainerServices = selectedRetainerServices.concat(
      exteriorRetainerServices.filter((service) => service.selected === true)
    );
    selectedRetainerServices = selectedRetainerServices.concat(
      otherRetainerServices.filter((service) => service.selected === true)
    );

    let selectedCustomer = customerSelected;

    if (currentUser.customerId) {
      selectedCustomer = {
        id: currentUser.customerId,
      };
    }

    if (currentStep.id === 1) {
      if (tailNumber.length === 0) {
        alert("Tail number is required");
        return;
      }

      if (!selectedCustomer) {
        alert("Customer is required");
        return;
      }

      if (!aircraftTypeSelected) {
        alert("Aircraft type is required");
        return;
      }

      if (!airportSelected) {
        alert("Airport is required");
        return;
      }

      if (!fboSelected) {
        alert("FBO is required");
        return;
      }
    } else if (currentStep.id === 2) {
      if (
        selectedServices.length === 0 &&
        selectedRetainerServices.length === 0
      ) {
        alert("Select at least one service or retainer");
        return;
      }
    }

    const newSteps = [...steps];

    newSteps[0].selected = false;
    newSteps[1].selected = false;
    newSteps[2].selected = false;

    if (currentStep.id === 1) {
      newSteps[1].selected = true;
      newSteps[1].status = "current";
      newSteps[0].status = "complete";
    } else if (currentStep.id === 2) {
      newSteps[2].selected = true;
      newSteps[2].status = "current";
      newSteps[1].status = "complete";
    }

    setSteps(newSteps);

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const handleGotoPreviousStep = (currentStep) => {
    const newSteps = [...steps];

    newSteps[0].selected = false;
    newSteps[1].selected = false;
    newSteps[2].selected = false;

    if (currentStep.id === 2) {
      newSteps[0].selected = true;
      newSteps[0].status = "current";
      newSteps[1].status = "upcoming";
    } else if (currentStep.id === 3) {
      newSteps[1].selected = true;
      newSteps[1].status = "current";
      newSteps[2].status = "upcoming";
    }

    setSteps(newSteps);

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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

  const handleStartDateChange = (date, event) => {
    setStartDate(date);
  };

  const handleSetRepeatEvery = (value) => {
    //only allow positive numbers. letters or symbols are not allowed
    if (/^\d+$/.test(value) || value === "") {
      //value cannot be bigger than 3 digits
      if (value.length <= 3) {
        setRepeatEvery(value);
      }
    }
  };

  const handleCustomerSelectedChange = (customer) => {
    setCustomerSelected(customer);
    getServicesAndRetainers(customer.id);
  };

  const getServicesAndRetainers = async (customerId) => {
    try {
      const { data } = await api.getCustomerRetainerServices(customerId);

      const interior = [];
      const exterior = [];
      const other = [];

      data.services.forEach((service) => {
        if (service.category === "I") {
          interior.push(service);
        } else if (service.category === "E") {
          exterior.push(service);
        } else {
          other.push(service);
        }
      });

      setInteriorServices(interior);
      setExteriorServices(exterior);
      setOtherServices(other);

      const interiorRetainer = [];
      const exteriorRetainer = [];
      const otherRetainer = [];

      data.retainer_services.forEach((retainerService) => {
        if (retainerService.category === "I") {
          interiorRetainer.push(retainerService);
        } else if (retainerService.category === "E") {
          exteriorRetainer.push(retainerService);
        } else {
          otherRetainer.push(retainerService);
        }
      });

      setInteriorRetainerServices(interiorRetainer);
      setExteriorRetainerServices(exteriorRetainer);
      setOtherRetainerServices(otherRetainer);
    } catch (err) {
      toast.error("Unable to get customer services");
    }
  };

  return (
    <AnimatedPage>
      {loading && (
        <>
          <Loader />
          {createJobMessage && (
            <div className="text-gray-500 text-lg m-auto text-center">
              {createJobMessage}
            </div>
          )}
        </>
      )}

      {!loading && createJobMessage && (
        <div className="mx-auto max-w-lg px-4 pb-16 lg:pb-12 mt-40 text-center">
          <div className=" flex justify-center">
            <CheckCircleIcon
              className="h-16 w-16 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="">
            <p className="text-2xl font-medium text-gray-900 mt-2">
              Job Schedule created!
            </p>
          </div>
          <div className=" mt-6 flex justify-center gap-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="inline-flex items-center rounded-md border
                                         border-gray-300 bg-white px-3 py-2 text-lg leading-4
                                          text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                           focus:ring-red-500 focus:ring-offset-2"
            >
              Back to Home
            </button>
            <button
              type="button"
              onClick={() => addAnotherSchedule()}
              className="inline-flex justify-center rounded-md
                                    border border-transparent bg-red-600 py-2 px-4
                                    text-lg font-medium text-white shadow-sm hover:bg-red-600
                                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Add another Schedule
            </button>
          </div>
        </div>
      )}

      {!loading && errorMessage && (
        <div className="text-gray-500 m-auto text-center mt-20">
          {errorMessage}
        </div>
      )}

      {!loading && errorMessage == null && createJobMessage == null && (
        <main className="mx-auto max-w-7xl px-4 pb-16 lg:pb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">
              Create Job Schedule
            </h1>
            <p className="mt-1 text-lg text-gray-500">
              Let’s get started by filling in the information below to create a
              new job schedule.
            </p>
          </div>
          <nav aria-label="Progress" className="mt-6">
            <ol className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="relative md:flex md:flex-1">
                  {step.status === "complete" ? (
                    <button className="group flex w-full items-center">
                      <span className="flex items-center px-6 py-4 text-sm font-medium">
                        <span
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center
                                         rounded-full bg-red-600 group-hover:bg-red-800"
                        >
                          <CheckIcon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="ml-4 text-xl font-medium text-gray-900">
                          {step.name}
                        </span>
                      </span>
                    </button>
                  ) : step.status === "current" ? (
                    <button
                      className="flex items-center px-6 py-4 text-sm font-medium"
                      aria-current="step"
                    >
                      <span
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center
                                                rounded-full border-2 border-red-600"
                      >
                        <span className="text-red-600">{step.id}</span>
                      </span>
                      <span className="ml-4 text-xl font-medium text-red-600">
                        {step.name}
                      </span>
                    </button>
                  ) : (
                    <button className="group flex items-center">
                      <span className="flex items-center px-6 py-4 text-sm font-medium">
                        <span
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full
                                                    border-2 border-gray-300 group-hover:border-gray-400"
                        >
                          <span className="text-gray-500 group-hover:text-gray-900">
                            {step.id}
                          </span>
                        </span>
                        <span className="ml-4 text-xl font-medium text-gray-500 group-hover:text-gray-900">
                          {step.name}
                        </span>
                      </span>
                    </button>
                  )}

                  {stepIdx !== steps.length - 1 ? (
                    <>
                      <div
                        className="absolute top-0 right-0 hidden h-full w-5 md:block"
                        aria-hidden="true"
                      >
                        <svg
                          className="h-full w-full text-gray-300"
                          viewBox="0 0 22 80"
                          fill="none"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0 -2L20 40L0 82"
                            vectorEffect="non-scaling-stroke"
                            stroke="currentcolor"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </>
                  ) : null}
                </li>
              ))}
            </ol>
          </nav>

          {isStepOneSelected && (
            <>
              <div className="mt-6 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-6 gap-x-24">
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="tailNumber"
                      className="text-lg font-bold text-gray-600 uppercase tracking-wide"
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
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm py-3"
                      />
                      {tailNumberErrorMessage && (
                        <p className="text-red-500 text-xs font-semibold mt-2">
                          {tailNumberErrorMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  {!currentUser.isCustomer && (
                    <div className="mt-1">
                      <Listbox
                        value={customerSelected}
                        onChange={handleCustomerSelectedChange}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="text-lg font-bold text-gray-600 uppercase tracking-wide">
                              Customer
                            </Listbox.Label>
                            <div className="relative mt-1">
                              <Listbox.Button
                                className="relative w-full cursor-default rounded-md border
                                                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                        shadow-sm focus:border-sky-500 focus:outline-none
                                                                        focus:ring-1 focus:ring-sky-500 sm:text-lg"
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
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-lg"
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
                                            setCustomerSearchTerm(
                                              e.target.value
                                            )
                                          }
                                          className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-lg
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
                  )}

                  <div className="mt-1">
                    <Listbox value={fboSelected} onChange={setFboSelected}>
                      {({ open }) => (
                        <>
                          <Listbox.Label className="text-lg font-bold text-gray-600 uppercase tracking-wide">
                            FBO
                          </Listbox.Label>
                          <div className="relative mt-1">
                            <Listbox.Button
                              className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-lg"
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
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-lg"
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
                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-lg
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
                </div>
                <div className="space-y-6">
                  <div className="">
                    <Listbox
                      value={aircraftTypeSelected}
                      onChange={setAircraftTypeSelected}
                    >
                      {({ open }) => (
                        <>
                          <Listbox.Label className="text-lg font-bold text-gray-600 uppercase tracking-wide">
                            Aircraft Type
                          </Listbox.Label>
                          <div className="relative mt-1">
                            <Listbox.Button
                              className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-lg"
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
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-lg"
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
                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-lg
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
                          <Listbox.Label className="text-lg font-bold text-gray-600 uppercase tracking-wide">
                            Airport
                          </Listbox.Label>
                          <div className="relative mt-1">
                            <Listbox.Button
                              className="relative w-full cursor-default rounded-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-lg"
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
                                                                        ring-black ring-opacity-5 focus:outline-none sm:text-lg"
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
                                                                        focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-lg
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
                  {/* <div>
                    <div className="text-lg font-bold text-gray-400 uppercase tracking-wide flex justify-between">
                      Estimated Arrival
                      
                      {estimatedArrivalDate && (
                        <span
                          onClick={() => setEstimatedArrivalDate(null)}
                          className="ml-2 underline text-xs text-red-500 cursor-pointer relative top-1"
                        >
                          clear
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleEstimatedArrivalDate}
                      className="inline-flex items-center rounded-md border mt-1
                                           w-full h-10
                                          border-gray-300 bg-white px-4 py-2 text-lg
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
                  </div> */}
                </div>
              </div>
              <div className="mt-8 m-auto flex justify-center">
                <button
                  onClick={() => handleGoToNextStep(steps[0])}
                  className={`relative inline-flex items-center rounded-md border border-transparent
                           bg-red-600 px-4 py-2 text-2xl front-medium text-white shadow-sm
                            hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2`}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {isStepTwoSelected && (
            <>
              <div className="mt-6 text-center m-auto max-w-7xl">
                <div className="text-3xl font-bold tracking-wide">Services</div>
                <div className="text-xl text-gray-500 tracking-wide">
                  Click on the services you want to include
                </div>
                <div className="mt-6 font-bold text-xl mb-4">INTERIOR</div>
                <div className="text-left grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-6">
                  {interiorServices.map((service, index) => (
                    <div
                      key={index}
                      onClick={() => handleServiceChange(service)}
                      className={`relative cursor-pointer hover:bg-gray-50 border 
                                    ${
                                      service.selected
                                        ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                        : "border-gray-300"
                                    }           
                      rounded-lg p-4 py-7 focus:outline-none`}
                    >
                      <div className="text-md">{service.name}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-300 my-8"></div>

                <div className="mt-8 font-bold text-xl mb-4">EXTERIOR</div>
                <div className="text-left grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-6">
                  {exteriorServices.map((service, index) => (
                    <div
                      key={index}
                      onClick={() => handleServiceChange(service)}
                      className={`relative cursor-pointer hover:bg-gray-50 border 
                                    ${
                                      service.selected
                                        ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                        : "border-gray-300"
                                    }           
                      rounded-lg p-4 py-7 focus:outline-none`}
                    >
                      <div className="text-md">{service.name}</div>
                    </div>
                  ))}
                </div>

                {otherServices.length > 0 && (
                  <>
                    <div className="border-t-2 border-gray-300 my-8"></div>
                    <div className="mt-8 font-bold text-xl mb-4">OTHER</div>
                    <div className="text-left grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-6">
                      {otherServices.map((service, index) => (
                        <div
                          key={index}
                          onClick={() => handleServiceChange(service)}
                          className={`relative cursor-pointer hover:bg-gray-50 border 
                                            ${
                                              service.selected
                                                ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                                : "border-gray-300"
                                            }           
                            rounded-lg p-4 py-7 focus:outline-none`}
                        >
                          <div className="flex-1 text-md">{service.name}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {(currentUser.isAdmin ||
                  currentUser.isSuperUser ||
                  currentUser.isAccountManager ||
                  currentUser.isInternalCoordinator ||
                  (currentUser.isCustomer && currentUser.isPremiumMember)) && (
                  <>
                    <div className="border-t-2 border-gray-300 my-8"></div>
                    <div className="text-3xl font-bold tracking-wide">
                      Retainers
                    </div>
                    <div className="text-xl text-gray-500 tracking-wide">
                      Click on the retainers you want to include
                    </div>
                    <div className="mt-6 font-bold text-xl mb-4">INTERIOR</div>
                    <div className="text-left grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-6">
                      {interiorRetainerServices.map((service, index) => (
                        <div
                          key={index}
                          onClick={() => handleRetainerServiceChange(service)}
                          className={`relative cursor-pointer hover:bg-gray-50 border 
                                    ${
                                      service.selected
                                        ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                        : "border-gray-300"
                                    }           
                                    rounded-lg p-4 py-7 focus:outline-none`}
                        >
                          <div className="flex-1 text-md">{service.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 font-bold text-xl mb-4">EXTERIOR</div>
                    <div className="text-left grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-6">
                      {exteriorRetainerServices.map((service, index) => (
                        <div
                          key={index}
                          onClick={() => handleRetainerServiceChange(service)}
                          className={`relative cursor-pointer hover:bg-gray-50 border 
                                    ${
                                      service.selected
                                        ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                        : "border-gray-300"
                                    }           
                                    rounded-lg p-4 py-7 focus:outline-none`}
                        >
                          <div className="flex-1 text-md">{service.name}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 font-bold text-xl mb-4">OTHER</div>
                    <div className="text-left grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-6">
                      {otherRetainerServices.map((service, index) => (
                        <div
                          key={index}
                          onClick={() => handleRetainerServiceChange(service)}
                          className={`relative cursor-pointer hover:bg-gray-50 border 
                                    ${
                                      service.selected
                                        ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                        : "border-gray-300"
                                    }           
                                    rounded-lg p-4 py-7 focus:outline-none`}
                        >
                          <div className="flex-1 text-md">{service.name}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex gap-6 mt-8 m-auto text-center justify-center">
                  <button
                    onClick={() => handleGotoPreviousStep(steps[1])}
                    className="inline-flex items-center justify-center rounded-md border
                                      border-gray-300 bg-white px-4 py-2 text-xl
                                      text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleGoToNextStep(steps[1])}
                    className={`relative inline-flex items-center rounded-md border border-transparent
                            bg-red-600 px-4 py-2 text-2xl front-medium text-white shadow-sm
                                hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}

          {isStepThreeSelected && (
            <div className="m-auto max-w-7xl mt-8">
              <RadioGroup
                value={selectedScheduleType}
                onChange={setSelectedScheduleType}
              >
                <RadioGroup.Label className="text-lg font-bold text-gray-600 uppercase tracking-wide">
                  Select a schedule type
                </RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  {scheduleTypes.map((scheduleType) => (
                    <RadioGroup.Option
                      key={scheduleType.id}
                      value={scheduleType}
                      className={({ active }) =>
                        classNames(
                          active
                            ? "border-red-600 ring-2 ring-red-600"
                            : "border-gray-300",
                          "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <RadioGroup.Label
                                as="span"
                                className="block text-lg font-medium text-gray-900"
                              >
                                {scheduleType.title}
                              </RadioGroup.Label>
                              <RadioGroup.Description
                                as="span"
                                className="mt-1 flex items-center text-md text-gray-500"
                              >
                                {scheduleType.description}
                              </RadioGroup.Description>
                            </span>
                          </span>
                          <CheckCircleIcon
                            className={classNames(
                              !checked ? "invisible" : "",
                              "h-7 w-7 text-red-600"
                            )}
                            aria-hidden="true"
                          />
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

              <div className="border-t-2 border-gray-300 my-8"></div>

              <div className="mt-8">
                <label
                  htmlFor="comment"
                  className="text-lg font-bold text-gray-600 uppercase tracking-wide"
                >
                  Recurrence
                </label>

                <div
                  className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-3
                                 sm:grid-cols-1 xs:grid-cols-1 gap-12 mt-4"
                >
                  <div>
                    <div className="text-lg font-bold text-gray-500 uppercase tracking-wide flex justify-between">
                      Start Date
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleStartDate}
                      className="inline-flex items-center rounded-md border mt-1
                                            w-56 h-10
                                            border-gray-300 bg-white px-4 py-2 text-lg
                                                text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      {startDate?.toLocaleString("en-US", {
                        hour12: false,
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </button>
                    {startDateOpen && (
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => handleStartDateChange(date)}
                        dateFormat="Pp"
                        inline
                      />
                    )}
                  </div>

                  {selectedScheduleType.id === 1 && (
                    <div>
                      <div className="text-lg font-bold text-gray-500 uppercase tracking-wide flex justify-between">
                        Repeat every x days
                      </div>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={repeatEvery}
                          onChange={(e) => handleSetRepeatEvery(e.target.value)}
                          name="repeatEvery"
                          id="repeatEvery"
                          className="block  rounded-md border-gray-300 shadow-sm w-52
                                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm py-3"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t-2 border-gray-300 my-8"></div>

              <div className="mt-8">
                <label
                  htmlFor="comment"
                  className="text-lg font-bold text-gray-600 uppercase tracking-wide"
                >
                  Add a comment
                </label>
                <div className="mt-1">
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    name="comment"
                    id="comment"
                    placeholder="This comment will be added to every job created from this schedule"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                             focus:border-sky-500 focus:ring-sky-500 text-lg"
                  />
                </div>
              </div>

              <div className="border-t-2 border-gray-300 my-8"></div>

              {(currentUser.isAdmin ||
                currentUser.isSuperUser ||
                currentUser.isInternalCoordinator ||
                currentUser.isAccountManager) && (
                <>
                  <label className="text-lg font-bold text-gray-600 uppercase tracking-wide">
                    Tags
                  </label>

                  <div className="flex flex-wrap gap-4 mt-6">
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

                  <div className="border-t-2 border-gray-300 my-8"></div>
                </>
              )}

              <div className="flex flex-wrap gap-6 mt-10 m-auto text-center justify-center">
                <button
                  onClick={() => handleGotoPreviousStep(steps[2])}
                  className="inline-flex items-center justify-center rounded-md border
                                      border-gray-300 bg-white px-4 py-2 text-xl
                                      text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  Back
                </button>
                <button
                  onClick={() => createJobSchedule()}
                  className={`relative inline-flex items-center rounded-md border border-transparent
                            bg-red-600 px-4 py-2 text-2xl front-medium text-white shadow-sm
                                hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2`}
                >
                  Create Schedule
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Tail Alert Notification */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={showTailAlert}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <InboxIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-lg font-medium text-gray-900">
                      Tail Number Alert
                    </p>
                    <p className="mt-1 text-lg text-gray-500">
                      {tailAlert?.message}
                    </p>
                    <div className="mt-3 flex space-x-7">
                      <button
                        type="button"
                        onClick={() => deleteTailAlert()}
                        className="rounded-md bg-white text-lg font-medium
                                            text-red-600 hover:text-red-500 focus:outline-none
                                            focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setShowTailAlert(false);
                        }}
                        type="button"
                        className="rounded-md bg-white text-lg font-medium
                                                 text-gray-700 hover:text-gray-500 focus:outline-none
                                                  focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShowTailAlert(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
          <Transition
            show={showTailOpenJobAlert}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <InboxIcon
                      className="h-6 w-6 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-lg font-medium text-gray-900">
                      Tail Open Job Alert
                    </p>
                    <p className="mt-1 text-lg text-gray-500">
                      There is an open job for this tail. Refer to Job{" "}
                      <Link
                        to={`/jobs/${tailOpenJobAlert?.jobId}/details`}
                        className="text-blue-500 font-medium"
                      >
                        {tailOpenJobAlert?.purchaseOrder}
                      </Link>
                    </p>
                    <div className="mt-3 flex space-x-7">
                      <button
                        onClick={() => {
                          setShowTailOpenJobAlert(false);
                        }}
                        type="button"
                        className="rounded-md bg-white text-lg font-medium
                                                 text-gray-700 hover:text-gray-500 focus:outline-none
                                                  focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShowTailOpenJobAlert(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CreateJobSchedule;
