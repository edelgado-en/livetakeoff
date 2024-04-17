import { useEffect, useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import Loader from "../../components/loader/Loader";
import { CheckIcon, CheckCircleIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "./apiService";

import { toast } from "react-toastify";

const feeTypes = [
  { id: "G", name: "General" },
  { id: "F", name: "FBO Fee" },
  { id: "A", name: "Travel Fees" },
  { id: "V", name: "Vendor Price Difference" },
  { id: "M", name: "Management Fee" },
];

const amountTypes = [
  { id: "P", name: "Percentage" },
  { id: "F", name: "Fixed $" },
];

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

const CustomerAddFee = () => {
  const { customerId } = useParams();
  const [selectedFeeType, setSelectedFeeType] = useState(feeTypes[0]);
  const [fbos, setFbos] = useState([]);
  const [selectedFbos, setSelectedFbos] = useState([]);
  const [isFeesOpen, setIsFeesOpen] = useState(false);

  const [airports, setAirports] = useState([]);
  const [selectedAirports, setSelectedAirports] = useState([]);
  const [isAirportsOpen, setIsAirportsOpen] = useState(false);

  const [fboSearchName, setFboSearchName] = useState("");
  const [airportSearchName, setAirportSearchName] = useState("");

  const [fboLoading, setFboLoading] = useState(false);

  const [selectedAmountType, setSelectedAmountType] = useState(amountTypes[0]);

  const [amount, setAmount] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchFbos();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [fboSearchName]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchAirports();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [airportSearchName]);

  const searchFbos = async () => {
    setFboLoading(true);
    try {
      const { data } = await api.searchFbos({ name: fboSearchName });

      setFbos(data.results);
    } catch (err) {
      toast.error("Unable to search FBOs");
    }

    setFboLoading(false);
  };

  const searchAirports = async () => {
    try {
      const { data } = await api.searchAirports({ name: airportSearchName });

      setAirports(data.results);
    } catch (err) {
      toast.error("Unable to search airports");
    }
  };

  const handleSetAmount = (e) => {
    const value = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setAmount(value);
  };

  const handleSave = async () => {
    if (selectedFeeType.id === "F") {
      if (selectedFbos.length === 0) {
        alert("Please select at least one FBO");
        return;
      }
    }

    if (selectedFeeType.id === "A" || selectedFeeType.id === "V") {
      if (selectedAirports.length === 0) {
        alert("Please select at least one airport");
        return;
      }
    }

    if (!amount) {
      alert("Please enter an amount");
      return;
    }

    const data = {
      type: selectedFeeType.id,
      is_percentage: selectedAmountType.id === "P" ? true : false,
      fee: amount,
      fbos: selectedFbos,
      airports: selectedAirports,
    };

    await api.addFee(customerId, data);

    navigate(-1);
  };

  const isFboSelected = (value) => {
    return selectedFbos.find((el) => el.id === value.id) ? true : false;
  };

  const handleSelectFbo = (value) => {
    if (!isFboSelected(value)) {
      const selectedFbosUpdated = [
        ...selectedFbos,
        fbos.find((el) => el === value),
      ];

      setSelectedFbos(selectedFbosUpdated);
    } else {
      handleDeselectFee(value);
    }

    setIsFeesOpen(true);
  };

  const handleDeselectFee = (value) => {
    const selectedFeesUpdated = selectedFbos.filter((el) => el.id !== value.id);
    setSelectedFbos(selectedFeesUpdated);
    setIsFeesOpen(true);
  };

  const isAirportSelected = (value) => {
    return selectedAirports.find((el) => el.id === value.id) ? true : false;
  };

  const handleSelectAirport = (value) => {
    if (!isAirportSelected(value)) {
      const selectedAirportsUpdated = [
        ...selectedAirports,
        airports.find((el) => el === value),
      ];

      setSelectedAirports(selectedAirportsUpdated);
    } else {
      handleDeselectAirport(value);
    }

    setIsAirportsOpen(true);
  };

  const handleDeselectAirport = (value) => {
    const selectedAirportsUpdated = selectedAirports.filter(
      (el) => el.id !== value.id
    );
    setSelectedAirports(selectedAirportsUpdated);
    setIsAirportsOpen(true);
  };

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-md">
        <div className="font-medium text-md mb-4">Add new additional fee</div>
        <Listbox value={selectedFeeType} onChange={setSelectedFeeType}>
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700">
                Fee Type
              </Listbox.Label>
              <div className="relative mt-1">
                <Listbox.Button
                  className="relative w-full cursor-default rounded-md border
                                                border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1
                                                    focus:ring-sky-500 sm:text-sm"
                >
                  <span className="flex items-center">
                    <span className="block truncate">
                      {selectedFeeType.name}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
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
                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto
                                                rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black
                                                ring-opacity-5 focus:outline-none sm:text-sm"
                  >
                    {feeTypes.map((feeType) => (
                      <Listbox.Option
                        key={feeType.id}
                        className={({ active }) =>
                          classNames(
                            active ? "text-white bg-red-600" : "text-gray-900",
                            "relative cursor-default select-none py-2 pl-3 pr-9"
                          )
                        }
                        value={feeType}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "ml-3 block truncate"
                                )}
                              >
                                {feeType.name}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-red-600",
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

        {selectedFeeType.id === "F" && (
          <Listbox
            as="div"
            className="space-y-1 mt-5"
            value={selectedFbos}
            onChange={(value) => handleSelectFbo(value)}
            open={isFeesOpen}
          >
            {() => (
              <>
                <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                  FBO
                </Listbox.Label>
                <div className="relative">
                  <span className="inline-block w-full rounded-md shadow-sm">
                    <Listbox.Button
                      onClick={() => setIsFeesOpen(!isFeesOpen)}
                      open={isFeesOpen}
                      className="cursor-default relative w-full rounded-md border border-gray-300
                                                bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue
                                                focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    >
                      <span className="">
                        {selectedFbos.length <= 0 && "select FBOs"}

                        {selectedFbos.length > 0 && (
                          <span>
                            {selectedFbos.map((fbo) => {
                              return (
                                <span
                                  key={fbo.id}
                                  className="inline-block bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold mr-2"
                                >
                                  {fbo.name}
                                </span>
                              );
                            })}
                          </span>
                        )}
                      </span>
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Listbox.Button>
                  </span>
                  <Transition
                    unmount={false}
                    show={isFeesOpen}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="absolute mt-1 z-50 w-full rounded-md bg-white shadow-lg"
                  >
                    <Listbox.Options
                      static
                      className="max-h-70 rounded-md py-1 text-base leading-6 shadow-xs
                                                overflow-auto focus:outline-none sm:text-sm sm:leading-5 z-50"
                    >
                      <div className="relative">
                        <div className="sticky top-0 z-20  px-1">
                          <div className="mt-1 block  items-center">
                            <input
                              type="text"
                              name="search"
                              id="search"
                              value={fboSearchName}
                              onChange={(e) => setFboSearchName(e.target.value)}
                              className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 sm:text-lg
                                                                            border-gray-300 rounded-md"
                            />
                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                              {fboSearchName && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-blue-500 font-bold mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  onClick={() => {
                                    setFboSearchName("");
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

                      {!fboLoading &&
                        fbos.map((fbo) => {
                          const selected = isFboSelected(fbo);
                          return (
                            <Listbox.Option key={fbo.id} value={fbo}>
                              {({ active }) => (
                                <div
                                  className={`${
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900"
                                  }
                                                                    cursor-default select-none relative py-2 pl-8 pr-4`}
                                >
                                  <span
                                    className={`${
                                      selected ? "font-semibold" : "font-normal"
                                    } block truncate`}
                                  >
                                    {fbo.name}
                                  </span>
                                  {selected && (
                                    <span
                                      className={`${
                                        active ? "text-white" : "text-red-600"
                                      } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                    >
                                      <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              )}
                            </Listbox.Option>
                          );
                        })}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        )}

        {(selectedFeeType.id === "A" || selectedFeeType.id === "V") && (
          <Listbox
            as="div"
            className="space-y-1 mt-5"
            value={selectedAirports}
            onChange={(value) => handleSelectAirport(value)}
            open={isAirportsOpen}
          >
            {() => (
              <>
                <Listbox.Label className="block text-sm leading-5 font-medium text-gray-700">
                  Airports
                </Listbox.Label>
                <div className="relative">
                  <span className="inline-block w-full rounded-md shadow-sm">
                    <Listbox.Button
                      onClick={() => setIsAirportsOpen(!isAirportsOpen)}
                      open={isAirportsOpen}
                      className="cursor-default relative w-full rounded-md border border-gray-300
                                                bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue
                                                focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                    >
                      {selectedAirports.length <= 0 && "select airports"}

                      {selectedAirports.length > 0 && (
                        <span>
                          {selectedAirports.map((airport) => {
                            return (
                              <span
                                key={airport.id}
                                className="inline-block bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold mr-2"
                              >
                                {airport.name}
                              </span>
                            );
                          })}
                        </span>
                      )}
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                    </Listbox.Button>
                  </span>
                  <Transition
                    unmount={false}
                    show={isAirportsOpen}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="absolute mt-1 z-50 w-full rounded-md bg-white shadow-lg"
                  >
                    <Listbox.Options
                      static
                      className="max-h-70 rounded-md py-1 text-base leading-6 shadow-xs
                                                overflow-auto focus:outline-none sm:text-sm sm:leading-5 z-50"
                    >
                      <div className="relative">
                        <div className="sticky top-0 z-20  px-1">
                          <div className="mt-1 block  items-center">
                            <input
                              type="text"
                              name="search"
                              id="search"
                              value={airportSearchName}
                              onChange={(e) =>
                                setAirportSearchName(e.target.value)
                              }
                              className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 sm:text-lg
                                                                            border-gray-300 rounded-md"
                            />
                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                              {airportSearchName && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-blue-500 font-bold mr-1"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  onClick={() => {
                                    setFboSearchName("");
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
                      {airports.map((airport) => {
                        const selected = isAirportSelected(airport);
                        return (
                          <Listbox.Option key={airport.id} value={airport}>
                            {({ active }) => (
                              <div
                                className={`${
                                  active
                                    ? "text-white bg-red-600"
                                    : "text-gray-900"
                                }
                                                                    cursor-default select-none relative py-2 pl-8 pr-4`}
                              >
                                <span
                                  className={`${
                                    selected ? "font-semibold" : "font-normal"
                                  } block truncate`}
                                >
                                  {airport.name}
                                </span>
                                {selected && (
                                  <span
                                    className={`${
                                      active ? "text-white" : "text-red-600"
                                    } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}
                              </div>
                            )}
                          </Listbox.Option>
                        );
                      })}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        )}

        <div className="mt-5">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <div className="flex mt-1">
            <div>
              <Listbox
                value={selectedAmountType}
                onChange={setSelectedAmountType}
              >
                {({ open }) => (
                  <>
                    <div className="relative">
                      <Listbox.Button
                        className="relative w-full cursor-default rounded-l-md border
                                                                    border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                    shadow-sm focus:border-sky-500 focus:outline-none
                                                                    focus:ring-1 focus:ring-sky-500 sm:text-sm"
                      >
                        <span className="block truncate">
                          {selectedAmountType.name}
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
                          {amountTypes.map((amountType) => (
                            <Listbox.Option
                              key={amountType.id}
                              className={({ active }) =>
                                classNames(
                                  active
                                    ? "text-white bg-red-600"
                                    : "text-gray-900",
                                  "relative cursor-default select-none py-2 pl-3 pr-9"
                                )
                              }
                              value={amountType}
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
                                    {amountType.name}
                                  </span>
                                  {selected ? (
                                    <span
                                      className={classNames(
                                        active ? "text-white" : "text-red-600",
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
            <div className="flex-1">
              <input
                type="text"
                value={amount}
                onChange={(e) => handleSetAmount(e.target.value)}
                name="amount"
                style={{ borderLeft: "0px" }}
                className="block w-full rounded-r-md border-gray-300 shadow-sm
                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
              {/* {tailNumberErrorMessage && <p className="text-red-500 text-xs mt-2">{tailNumberErrorMessage}</p>} */}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pb-20 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-gray-300 bg-white
                                py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            className="inline-flex justify-center rounded-md 
                        border border-transparent bg-red-600 py-2 px-4
                        text-sm font-medium text-white shadow-sm hover:bg-red-600
                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Add Fee
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CustomerAddFee;
