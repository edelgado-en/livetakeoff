import { useEffect, useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import Loader from "../../components/loader/Loader";
import { CheckIcon, CheckCircleIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { useParams, useNavigate } from "react-router-dom";
import * as api from "./apiService";

const feeTypes = [
  { id: "G", name: "General" },
  { id: "F", name: "FBO Fee" },
  { id: "A", name: "Travel Fees" },
  { id: "V", name: "Higher Vendor Price" },
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

  const [selectedAmountType, setSelectedAmountType] = useState(amountTypes[0]);

  const [amount, setAmount] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    getAirports();
    getFbos();
  }, []);

  const getAirports = async () => {
    const { data } = await api.getAirports();
    setAirports(data.results);
  };

  const getFbos = async () => {
    const { data } = await api.getFbos();
    setFbos(data.results);
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
    return selectedFbos.find((el) => el === value) ? true : false;
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
    const selectedFeesUpdated = selectedFbos.filter((el) => el !== value);
    setSelectedFbos(selectedFeesUpdated);
    setIsFeesOpen(true);
  };

  const isAirportSelected = (value) => {
    return selectedAirports.find((el) => el === value) ? true : false;
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
      (el) => el !== value
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
                      <span className="block truncate">
                        {selectedFbos.length < 1
                          ? "Select FBOs"
                          : `Selected FBOs (${selectedFbos.length})`}
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
                      {fbos.map((fbo) => {
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
                      <span className="block truncate">
                        {selectedAirports.length < 1
                          ? "Select airports"
                          : `Selected airports (${selectedAirports.length})`}
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
