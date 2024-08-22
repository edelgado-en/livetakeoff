import { useEffect, useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";
import { toast } from "react-toastify";

import Pagination from "react-js-pagination";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const amountTypes = [
  { id: "P", name: "Percentage" },
  { id: "F", name: "Fixed $" },
];

const XCircleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-5 h-5 relative"
      style={{ top: "2px" }}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
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
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
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

const Fees = () => {
  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState([]);
  const [airportSearchText, setAirportSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAirports, setTotalAirports] = useState(0);
  const [sortSelected, setSortSelected] = useState();
  const [addFeeMode, setAddFeeMode] = useState(false);
  const [selectedAmountType, setSelectedAmountType] = useState(amountTypes[0]);
  const [selectedAirports, setSelectedAirports] = useState([]);

  const [amount, setAmount] = useState();

  useEffect(() => {
    // Basic throttling
    const timeoutID = setTimeout(() => {
      searchAirports();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [airportSearchText, sortSelected, currentPage]);

  const searchAirports = async () => {
    setLoading(true);

    const request = {
      name: airportSearchText,
      sortSelected,
    };

    try {
      const { data } = await api.searchAirports(request, currentPage);

      setTotalAirports(data.count);
      setAirports(data.results);
      setLoading(false);
    } catch (err) {
      toast.error("Unable to get airports");
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchAirports();
    }
  };

  const handleAddSelectedAirport = (airport) => {
    //only add if not already in the list
    if (!selectedAirports.find((a) => a.id === airport.id)) {
      setSelectedAirports([...selectedAirports, airport]);
    }
  };

  const handleSortChange = () => {
    //if sortSelected not speficied, set it to descending. If specified specified, toggle it
    if (!sortSelected) {
      setSortSelected("desc");
    } else {
      setSortSelected(sortSelected === "asc" ? "desc" : "asc");
    }
  };

  const handleSetAmount = (e) => {
    const value = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setAmount(value);
  };

  const handleCancelAddFeeMode = () => {
    setSelectedAirports([]);
    setAmount("");
    setAddFeeMode(false);
  };

  const handleRemoveSelectedAirport = (airport) => {
    setSelectedAirports(selectedAirports.filter((a) => a.id !== airport.id));
  };

  const handleApplyFeeChanges = async () => {
    if (amount === "" || selectedAirports.length === 0) {
      toast.error("Amount and airports are required");
      return;
    }

    setLoading(true);

    const request = {
      amount: amount,
      amount_type: selectedAmountType.id,
      airport_ids: selectedAirports.map((a) => a.id),
    };

    try {
      await api.applyFeeChanges(request);
      toast.success("Fees applied successfully");
      setAddFeeMode(false);
      setSelectedAirports([]);
      setAmount("");
      setCurrentPage(1);
      searchAirports();
    } catch (err) {
      toast.error("Unable to apply fees");
    }

    setLoading(false);
  };

  return (
    <AnimatedPage>
      <div className="px-4 m-auto max-w-7xl pb-32">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold">Fees</h1>
        </div>

        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">
              Airports
              {!loading && (
                <span
                  className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                                    rounded-full text-sm font-medium md:inline-block relative"
                  style={{ bottom: "2px" }}
                >
                  {totalAirports}
                </span>
              )}
            </div>
            <div className="text-md text-gray-500 mt-1">
              You can specify fees for each airport. Customers with specified
              airport fees will override the default fees.
            </div>
          </div>
          <div className="text-right">
            {!addFeeMode && (
              <button
                type="button"
                onClick={() => setAddFeeMode(true)}
                className="inline-flex items-center justify-center 
                                rounded-md border border-transparent bg-red-600 px-4 py-2
                                text-md font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500
                                focus:ring-offset-2 sm:w-auto mt-4"
              >
                Add Fee
              </button>
            )}

            {addFeeMode && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCancelAddFeeMode()}
                  className="inline-flex items-center justify-center 
                                    rounded-md border bg-white px-4 py-2
                                    text-md font-medium shadow-sm hover:bg-gray-50
                                    focus:outline-none focus:ring-2 focus:ring-gray-500
                                    focus:ring-offset-2 sm:w-auto mt-4"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyFeeChanges()}
                  className="inline-flex items-center justify-center 
                                    rounded-md border border-transparent bg-red-600 px-4 py-2
                                    text-md font-medium text-white shadow-sm hover:bg-red-700
                                    focus:outline-none focus:ring-2 focus:ring-red-500
                                    focus:ring-offset-2 sm:w-auto mt-4"
                >
                  Apply Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {!addFeeMode && (
          <div className="w-full mt-8">
            <div className="relative border-b border-gray-200">
              <div
                onClick={() => searchAirports()}
                className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
              >
                <MagnifyingGlassIcon
                  className="h-4 w-4 text-gray-400 cursor-pointer"
                  aria-hidden="true"
                />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                value={airportSearchText}
                onChange={(event) => setAirportSearchText(event.target.value)}
                onKeyDown={handleKeyDown}
                className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                                        focus:ring-sky-500 text-md"
                placeholder="Search by initials or name"
              />
            </div>
          </div>
        )}

        <div className="mt-2">
          {addFeeMode && (
            <div>
              <div className="grid xl:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-8">
                <div>
                  <div className="w-full mt-8">
                    <div className="relative border-b border-gray-200">
                      <div
                        onClick={() => searchAirports()}
                        className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                      >
                        <MagnifyingGlassIcon
                          className="h-4 w-4 text-gray-400 cursor-pointer"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        type="search"
                        name="search"
                        id="search"
                        value={airportSearchText}
                        onChange={(event) =>
                          setAirportSearchText(event.target.value)
                        }
                        onKeyDown={handleKeyDown}
                        className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                                    focus:ring-sky-500 text-md"
                        placeholder="Search by initials or name"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 p-4 pr-6 font-semibold">
                    <div>Name</div>
                    <div className="text-right flex gap-1">
                      <div
                        className="cursor-pointer flex gap-1"
                        onClick={() => handleSortChange()}
                      >
                        <ChevronUpDownIcon /> Fee
                      </div>
                    </div>
                  </div>
                  <div
                    className="overflow-y-auto"
                    style={{ maxHeight: "700px" }}
                  >
                    {airports.map((airport) => (
                      <div
                        key={airport.id}
                        onClick={() => handleAddSelectedAirport(airport)}
                        className={`border 
                                   ${
                                     airport.fee > 0 && airport.fee_percentage
                                       ? "bg-green-50 border-green-200 hover:bg-green-100"
                                       : ""
                                   }
                                   ${
                                     airport.fee > 0 && !airport.fee_percentage
                                       ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                       : ""
                                   }
                                    ${
                                      !airport.fee || airport.fee === 0
                                        ? "border-gray-200 hover:bg-gray-50"
                                        : ""
                                    }
                                     rounded-md p-4 mb-2 cursor-pointer`}
                      >
                        <div className="flex justify-between gap-2">
                          <div className="flex-1">
                            {airport.initials} - {airport.name}
                          </div>
                          <div className="text-right">
                            {!airport.fee_percentage ? "$" : ""}
                            {airport.fee ? airport.fee : "0"}
                            {airport.fee_percentage ? "%" : ""}
                          </div>
                        </div>
                      </div>
                    ))}

                    {!loading && airports.length === 0 && (
                      <div className="text-center my-24">
                        No airports found.
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="mt-3">
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
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold mt-12">
                    Selected airports
                    <span
                      className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                                    rounded-full text-sm font-medium md:inline-block relative"
                      style={{ bottom: "2px" }}
                    >
                      {selectedAirports.length}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-500 mb-4">
                    Click on the airports you want to apply fee changes.
                  </div>
                  {selectedAirports.map((airport) => (
                    <div
                      key={airport.id}
                      className="border border-gray-200 rounded-md p-4 mb-2 hover:bg-gray-50"
                    >
                      <div className="flex justify-between gap-2">
                        <div className="flex-1">
                          {airport.initials} - {airport.name}
                        </div>
                        <div
                          onClick={() => handleRemoveSelectedAirport(airport)}
                          className="text-right cursor-pointer flex gap-4"
                        >
                          {!airport.fee_percentage ? "$" : ""}
                          {airport.fee ? airport.fee : "0"}
                          {airport.fee_percentage ? "%" : ""}
                          <XCircleIcon />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!addFeeMode && (
            <>
              <div className="flex justify-between gap-2 p-4 pr-6 font-semibold">
                <div>Name</div>
                <div className="text-right flex gap-1">
                  <div
                    className="cursor-pointer flex gap-1"
                    onClick={() => handleSortChange()}
                  >
                    <ChevronUpDownIcon /> Fee
                  </div>
                </div>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
                {airports.map((airport) => (
                  <div
                    key={airport.id}
                    className={`border 
                        ${
                          airport.fee > 0 && airport.fee_percentage
                            ? "bg-green-50 border-green-200 hover:bg-green-100"
                            : ""
                        }
                        ${
                          airport.fee > 0 && !airport.fee_percentage
                            ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                            : ""
                        }
                         ${
                           !airport.fee || airport.fee === 0
                             ? "border-gray-200 hover:bg-gray-50"
                             : ""
                         }
                          rounded-md p-4 mb-2 cursor-pointer`}
                  >
                    <div className="flex justify-between gap-2">
                      <div className="flex-1">
                        {airport.initials} - {airport.name}
                      </div>
                      <div className="text-right">
                        {!airport.fee_percentage ? "$" : ""}
                        {airport.fee ? airport.fee : "0"}
                        {airport.fee_percentage ? "%" : ""}
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && airports.length === 0 && (
                  <div className="text-center my-24">No airports found.</div>
                )}
              </div>
            </>
          )}
          {!loading && totalAirports > 200 && (
            <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
              <div>
                <Pagination
                  innerClass="pagination pagination-custom"
                  activePage={currentPage}
                  hideDisabled
                  itemClass="page-item page-item-custom"
                  linkClass="page-link page-link-custom"
                  itemsCountPerPage={200}
                  totalItemsCount={totalAirports}
                  pageRangeDisplayed={3}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Fees;
