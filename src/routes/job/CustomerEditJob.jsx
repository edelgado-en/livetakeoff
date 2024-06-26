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

const CustomerEditJob = () => {
  const { jobId } = useParams();

  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [createJobMessage, setCreateJobMessage] = useState(null);
  const [jobDetails, setJobDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const [tailNumber, setTailNumber] = useState("");
  const [tailNumberErrorMessage, setTailNumberErrorMessage] = useState(null);
  const [aircraftTypes, setAircraftTypes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [fbos, setFbos] = useState([]);
  const [services, setServices] = useState([]);
  const [retainerServices, setRetainerServices] = useState([]);

  const [allFbos, setAllFbos] = useState([]);

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

  const [customerPurchaseOrder, setCustomerPurchaseOrder] = useState("");

  const [onSite, setOnSite] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getJobInfo();
  }, []);

  const getJobInfo = async () => {
    setLoading(true);

    try {
      const { data } = await api.getJobFormInfo();
      setAircraftTypes(data.aircraft_types);
      setAirports(data.airports);
      setFbos(data.fbos);
      setAllFbos(data.fbos);
      setServices(data.services);
      setRetainerServices(data.retainer_services);

      const response = await api.getJobDetails(jobId);

      setTailNumber(response.data.tailNumber);
      setCustomerPurchaseOrder(response.data.customer_purchase_order);

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

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  };

  const updateJob = async () => {
    let customer_purchase_order = null;

    if (customerPurchaseOrder !== "") {
      customer_purchase_order = customerPurchaseOrder;
    }

    const request = {
      tailNumber,
      aircraftType: aircraftTypeSelected.id,
      airport: airportSelected.id,
      fbo: fboSelected.id,
      estimatedETA: estimatedArrivalDate,
      estimatedETD: estimatedDepartureDate,
      completeBy: completeByDate,
      on_site: onSite,
      customer_purchase_order: customer_purchase_order,
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

  const handleSetOnSite = () => {
    setOnSite(!onSite);
    setEstimatedArrivalDate(null);
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
                    onChange={(e) => setTailNumber(e.target.value)}
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
                            {airportSelected?.name}
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
                            {fboSelected?.name}
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
                            {fbos.map((fbo) => (
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

export default CustomerEditJob;
