import { useEffect, useState, Fragment } from "react";
import {
  UsersIcon,
  CashIcon,
  BriefcaseIcon,
  ArrowSmRightIcon,
  CheckIcon,
  ChevronDownIcon,
  ClockIcon,
  NewspaperIcon,
} from "@heroicons/react/outline";
import { Listbox, Transition } from "@headlessui/react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "./apiService";

import AnimatedPage from "../../../components/animatedPage/AnimatedPage";
import Loader from "../../../components/loader/Loader";

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

const ChevronUpDownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 cursor-pointer"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

const WrenchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-sky-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const TeamProductivity = () => {
  const [loading, setLoading] = useState(true);
  const [productivityData, setProductivityData] = useState({});
  const [internalProductivityData, setInternalProductivityData] = useState({});
  const [externalProductivityData, setExternalProductivityData] = useState({});
  const [users, setUsers] = useState([]);
  const [dateSelected, setDateSelected] = useState(dateOptions[3]);

  const [vendors, setVendors] = useState([]);
  const [vendorSearchName, setVendorSearchName] = useState("");
  const [vendorSelected, setVendorSelected] = useState(null);

  const [searchText, setSearchText] = useState("");

  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(null);
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  const filteredCustomers = customerSearchTerm
    ? customers.filter((item) =>
        item.name.toLowerCase().includes(customerSearchTerm.toLowerCase())
      )
    : customers;

  useEffect(() => {
    getCustomers();
  }, []);

  useEffect(() => {
    getVendors();
  }, []);

  useEffect(() => {
    getTeamProductivityStats();
  }, [dateSelected, customerSelected, searchText]);

  useEffect(() => {
    getUsersProductivityStats();
  }, [dateSelected, customerSelected, searchText, vendorSelected]);

  const getCustomers = async () => {
    try {
      const { data } = await api.getCustomers();

      data.results.unshift({ id: null, name: "All Customers" });

      setCustomers(data.results);
    } catch (err) {
      toast.error("Unable to get customers");
    }
  };

  const getTeamProductivityStats = async () => {
    setLoading(true);

    try {
      const { data } = await api.getTeamProductivityStats({
        dateSelected: dateSelected.id,
        customer_id: customerSelected ? customerSelected.id : null,
        tailNumber: searchText,
      });

      setProductivityData(data);
    } catch (error) {
      toast.error("Unable to get stats");
    }

    setLoading(false);

    try {
      const internalResponse = await api.getTeamProductivityStats({
        dateSelected: dateSelected.id,
        customer_id: customerSelected ? customerSelected.id : null,
        tailNumber: searchText,
        is_internal_report: true,
      });

      setInternalProductivityData(internalResponse.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const externalResponse = await api.getTeamProductivityStats({
        dateSelected: dateSelected.id,
        customer_id: customerSelected ? customerSelected.id : null,
        tailNumber: searchText,
        is_external_report: true,
      });
      setExternalProductivityData(externalResponse.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsersProductivityStats = async () => {
    setLoading(true);

    try {
      const { data } = await api.getUsersProductivityStats({
        dateSelected: dateSelected.id,
        customer_id: customerSelected ? customerSelected.id : null,
        tailNumber: searchText,
        vendor_id: vendorSelected ? vendorSelected.id : null,
      });

      setUsers(data.users);
    } catch (error) {
      toast.error("Unable to get stats");
    }

    setLoading(false);
  };

  const getVendors = async () => {
    let request = {
      name: vendorSearchName,
    };

    try {
      const { data } = await api.getVendors(request);

      data.results.unshift({ id: null, name: "All Vendors" });

      setVendors(data.results);
    } catch (err) {
      toast.error("Unable to get vendors");
    }
  };

  const handleClearCustomerSearchFilter = () => {
    setCustomerSearchTerm("");
    setCustomerSelected(null);
  };

  const handleClearVendorSearchFilter = () => {
    setVendorSearchName("");
    setVendorSelected(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      getTeamProductivityStats();
    }
  };

  return (
    <AnimatedPage>
      <div className="px-4 max-w-7xl m-auto" style={{ maxWidth: "1800px" }}>
        <h2 className="text-3xl font-bold tracking-tight sm:text-3xl pb-5">
          Productivity
        </h2>

        <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-4">
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
                                                    ring-black ring-opacity-5 focus:outline-none text-sm"
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
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate text-md"
                                  )}
                                >
                                  {sort.name}
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
          <div>
            <Listbox value={customerSelected} onChange={setCustomerSelected}>
              {({ open }) => (
                <>
                  <div className="relative">
                    <Listbox.Button
                      className={`relative w-full cursor-default rounded-md border 
                            ${
                              customerSelected &&
                              customerSelected.name !== "All Customers"
                                ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                : " border-gray-200 bg-white text-gray-500"
                            }                          
                                      py-2 pl-3 pr-10 text-left
                                        shadow-sm  sm:text-md`}
                    >
                      <span className="block truncate">
                        {customerSelected
                          ? customerSelected.name
                          : "Select customer"}
                      </span>
                      <span
                        className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ${
                          customerSelected &&
                          customerSelected.name !== "All Customers"
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        <ChevronUpDownIcon
                          className="h-5 w-5"
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
                                      handleClearCustomerSearchFilter();
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
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {customer.name}
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
          <div>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <div
                onClick={() => getTeamProductivityStats()}
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
                className={`block w-full rounded-md pl-10 text-md ${
                  searchText.length > 0
                    ? "border-sky-500 focus:border-sky-500 focus:ring-sky-500 border-2"
                    : "border-gray-200  focus:border-sky-500 focus:ring-sky-500"
                } 
                                 `}
                placeholder="Search by tail..."
              />
            </div>
          </div>
        </div>

        {loading && <Loader />}

        {!loading && (
          <>
            <div
              className="isolate mx-auto mt-10 grid max-w-md grid-cols-1
                             gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-7xl xl:mx-0 xl:max-w-none xl:grid-cols-3"
            >
              <div className="rounded-3xl p-8 ring-1 ring-gray-200">
                <h2 className="text-xl font-semibold leading-8 text-gray-900">
                  Internal
                </h2>
                <p className="mt-4 text-md leading-6 text-gray-600">
                  All jobs invoiced by Clean takeoff.
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    $
                    {internalProductivityData.total_jobs_price
                      ? internalProductivityData.total_jobs_price.toLocaleString()
                      : 0}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    Revenue
                  </span>
                  <span className="text-sm text-gray-500">(Services only)</span>
                </p>
                <ul className="mt-8 space-y-3 text-md leading-6 text-gray-700">
                  <li className="grid grid-cols-2 gap-4">
                    <div>Jobs Completed</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {internalProductivityData.total_jobs}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Services Completed</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {internalProductivityData.total_services}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Retainers Completed</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {internalProductivityData.total_retainer_services}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Not Invoiced</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {internalProductivityData.total_jobs_price_not_invoiced
                          ? internalProductivityData.total_jobs_price_not_invoiced.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Subcontractor Profit</div>
                    <div className="text-right">
                      <span className="font-semibold">NA</span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Labor Time</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {internalProductivityData.total_labor_time} hr
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4 border-t border-gray-200">
                    <div className="mt-4">Travel Fees</div>
                    <div className="text-right mt-4">
                      <span className="font-semibold">
                        $
                        {internalProductivityData.total_travel_fees_amount_applied
                          ? internalProductivityData.total_travel_fees_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>FBO Fees</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {internalProductivityData.total_fbo_fees_amount_applied
                          ? internalProductivityData.total_fbo_fees_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Management Fees</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {internalProductivityData.total_management_fees_amount_applied
                          ? internalProductivityData.total_management_fees_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Vendor Higher Price</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {internalProductivityData.total_vendor_higher_price_amount_applied
                          ? internalProductivityData.total_vendor_higher_price_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl p-8 ring-1 ring-gray-200">
                <h2 className="text-xl font-semibold leading-8 text-gray-900">
                  External
                </h2>
                <p className="mt-4 text-md leading-6 text-gray-600">
                  All jobs invoiced by external contractors.
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    $
                    {externalProductivityData.total_jobs_price
                      ? externalProductivityData.total_jobs_price.toLocaleString()
                      : 0}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    Revenue
                  </span>
                  <span className="text-sm text-gray-500">(Services only)</span>
                </p>
                <ul className="mt-8 space-y-3 text-md leading-6 text-gray-700">
                  <li className="grid grid-cols-2 gap-4">
                    <div>Jobs Completed</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {externalProductivityData.total_jobs}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Services Completed</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {externalProductivityData.total_services}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Retainers Completed</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {externalProductivityData.total_retainer_services}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Not Invoiced</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {externalProductivityData.total_jobs_price_not_invoiced
                          ? externalProductivityData.total_jobs_price_not_invoiced.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Subcontractor Profit</div>
                    <div className="text-right">
                      <span className="font-semibold">NA</span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Labor Time</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {externalProductivityData.total_labor_time} hr
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4 border-t border-gray-200">
                    <div className="mt-4">Travel Fees</div>
                    <div className="text-right mt-4">
                      <span className="font-semibold">
                        $
                        {externalProductivityData.total_travel_fees_amount_applied
                          ? externalProductivityData.total_travel_fees_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>FBO Fees</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {externalProductivityData.total_fbo_fees_amount_applied
                          ? externalProductivityData.total_fbo_fees_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Management Fees</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {externalProductivityData.total_management_fees_amount_applied
                          ? externalProductivityData.total_management_fees_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Vendor Higher Price</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {externalProductivityData.total_vendor_higher_price_amount_applied
                          ? externalProductivityData.total_vendor_higher_price_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl p-8 ring-2 ring-blue-600">
                <h2 className="text-xl font-semibold leading-8 text-blue-600">
                  Totals
                </h2>
                <p className="mt-4 text-md leading-6 text-gray-600">
                  All jobs invoiced combined.
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    $
                    {productivityData.total_jobs_price
                      ? productivityData.total_jobs_price.toLocaleString()
                      : 0}
                  </span>
                  <span className="text-sm font-semibold leading-6 text-gray-600">
                    Revenue
                  </span>
                  <span className="text-sm text-gray-500">(Services only)</span>
                </p>
                <ul className="mt-8 space-y-3 text-md leading-6 text-gray-700">
                  <li className="grid grid-cols-2 gap-4">
                    <div>Jobs Completed</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {productivityData.total_jobs}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Services Completed</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {productivityData.total_services}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Retainers Completed</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {productivityData.total_retainer_services}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Not Invoiced</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {productivityData.total_jobs_price_not_invoiced
                          ? productivityData.total_jobs_price_not_invoiced.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Subcontractor Profit</div>
                    <div className="text-right">
                      <span className="font-semibold">NA</span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Labor Time</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        {productivityData.total_labor_time} hr
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4 border-t border-gray-200">
                    <div className="mt-4">Travel Fees</div>
                    <div className="mt-4 text-right">
                      <span className="font-semibold">
                        $
                        {productivityData.total_travel_fees_amount_applied
                          ? productivityData.total_travel_fees_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>FBO Fees</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {productivityData.total_fbo_fees_amount_applied
                          ? productivityData.total_fbo_fees_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Management Fees</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {productivityData.total_management_fees_amount_applied
                          ? productivityData.total_management_fees_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                  <li className="grid grid-cols-2 gap-4">
                    <div>Vendor Higher Price</div>
                    <div className="text-right">
                      <span className="font-semibold">
                        $
                        {productivityData.total_vendor_higher_price_amount_applied
                          ? productivityData.total_vendor_higher_price_amount_applied.toLocaleString()
                          : 0}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className=" w-full border border-1 border-gray-200 my-10"></div>

            {/* VENDORS */}
            <div className="mt-8">
              <div className="mx-auto max-w-7xl" style={{ maxWidth: "1800px" }}>
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold tracking-wide sm:text-2xl">
                    Vendors
                    <span
                      className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                                rounded-full text-sm font-medium md:inline-block relative"
                      style={{ bottom: "2px" }}
                    >
                      {productivityData.vendors?.length}
                    </span>
                  </h2>
                </div>

                {productivityData.vendors?.length === 0 && (
                  <div className="text-center m-auto flex my-24 justify-center text-gray-500">
                    No Vendors found.
                  </div>
                )}

                {productivityData.vendors?.length > 0 && (
                  <div className="mt-2 flow-root">
                    <div
                      className="-mx-4 -my-2 overflow-x-auto overflow-y-auto  sm:-mx-6 lg:-mx-8"
                      style={{ maxHeight: "900px" }}
                    >
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                              ></th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Total Jobs
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Revenue
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Subcontractor Profit
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Profit %
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Total Services
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {productivityData.vendors?.map((vendor, index) => (
                              <tr key={vendor.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                  {index + 1}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700 font-medium">
                                  {vendor.name ? vendor.name : "Clean Takeoff"}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                                  {vendor.total_jobs}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                                  $
                                  {vendor.revenue
                                    ? vendor.revenue?.toLocaleString()
                                    : 0}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                                  {vendor.subcontractor_profit && vendor.name
                                    ? "$" +
                                      vendor.subcontractor_profit?.toLocaleString()
                                    : ""}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                                  {vendor.subcontractor_profit && vendor.name
                                    ? vendor.subcontractor_profit_percentage +
                                      "%"
                                    : ""}
                                </td>
                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                                  {vendor.total_services}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className=" w-full border border-1 border-gray-200 my-10"></div>

            {/* PROJECT MANAGERS */}
            <div className="mt-8">
              <div className="mx-auto max-w-7xl" style={{ maxWidth: "1800px" }}>
                <div className="space-y-8">
                  <div className="flex justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold tracking-wide sm:text-2xl">
                        Project Managers
                        <span
                          className="bg-gray-100 text-gray-700 ml-2 py-0.5 px-2.5
                                                            rounded-full text-sm font-medium md:inline-block relative"
                          style={{ bottom: "2px" }}
                        >
                          {users.length}
                        </span>
                      </h2>
                    </div>
                    <div className="w-96">
                      <Listbox
                        value={vendorSelected}
                        onChange={setVendorSelected}
                      >
                        {({ open }) => (
                          <>
                            <div className="relative">
                              <Listbox.Button
                                className={`relative w-full cursor-default rounded-md border 
                                            ${
                                              vendorSelected &&
                                              vendorSelected.name !==
                                                "All Vendors"
                                                ? "ring-1 ring-offset-1 ring-red-500 text-white bg-red-500 hover:bg-red-600"
                                                : " border-gray-200 bg-white text-gray-500"
                                            }                          
                                                    py-2 pl-3 pr-10 text-left
                                                        shadow-sm  sm:text-md`}
                              >
                                <span className="block truncate">
                                  {vendorSelected
                                    ? vendorSelected.name
                                    : "Select vendor"}
                                </span>
                                <span
                                  className={`pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 ${
                                    vendorSelected &&
                                    vendorSelected.name !== "All Vendors"
                                      ? "text-white"
                                      : "text-gray-400"
                                  }`}
                                >
                                  <ChevronUpDownIcon
                                    className="h-5 w-5"
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
                                          value={vendorSearchName}
                                          onChange={(e) =>
                                            setVendorSearchName(e.target.value)
                                          }
                                          className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                                        focus:border-sky-500 block w-full py-2 pr-12 sm:text-md
                                                                                        border-gray-300 rounded-md"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                          {vendorSearchName && (
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-6 w-6 text-blue-500 font-bold mr-1"
                                              viewBox="0 0 20 20"
                                              fill="currentColor"
                                              onClick={() => {
                                                handleClearVendorSearchFilter();
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
                    </div>
                  </div>

                  {users.length === 0 && (
                    <div className="text-center m-auto flex my-24 justify-center text-gray-500">
                      No Project Managers found.
                    </div>
                  )}

                  <ul className="space-y-12 lg:grid lg:grid-cols-4 lg:items-start lg:gap-x-12 lg:gap-y-12 lg:space-y-0">
                    {users.map((user, index) => (
                      <li key={index}>
                        <div className="flex gap-4 flex-start">
                          <div className="flex-shrink-0">
                            <img
                              className="rounded-lg h-32 w-32"
                              src={user.avatar}
                              alt=""
                            />
                          </div>
                          <div className="w-full">
                            <div className="space-y-2">
                              <div className="space-y-1 text-md font-medium leading-6">
                                <h3>
                                  {user.first_name} {user.last_name}
                                </h3>
                              </div>
                              <div className="flex justify-between text-gray-500 text-sm">
                                <div className="flex-1">Services Completed</div>
                                <div className="text-right">
                                  {user.total_services}
                                </div>
                              </div>
                              <div className="flex justify-between text-gray-500 text-sm">
                                <div className="flex-1">
                                  Retainers Completed
                                </div>
                                <div className="text-right">
                                  {user.total_retainer_services}
                                </div>
                              </div>
                              <div className="flex justify-between text-gray-500 text-sm">
                                <div className="flex-1">Labor Time</div>
                                <div className="text-right">
                                  {user.total_labor_time?.toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 1,
                                      maximumFractionDigits: 1,
                                    }
                                  )}{" "}
                                  hr
                                </div>
                              </div>
                              <div className="flex justify-between text-gray-500 text-sm">
                                <div className="flex-1">
                                  Revenue
                                  <span className="text-xs ml-1 text-gray-500">
                                    (services only)
                                  </span>
                                </div>
                                <div className="text-right font-medium">
                                  ${user.total_revenue?.toLocaleString()}
                                </div>
                              </div>
                              <div className="w-full text-right text-sm text-blue-500">
                                <Link
                                  to={`/user-productivity/${user.id}`}
                                  className="cursor-pointer"
                                >
                                  more{" "}
                                  <ArrowSmRightIcon className="h-4 w-4 inline-block" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className=" w-full border border-1 border-gray-200 my-10"></div>

            {/* SERVICES */}
            <div
              className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1
                          gap-8 gap-y-8 gap-x-28 my-8 pb-32"
            >
              <div className="">
                <div className="text-2xl font-bold tracking-wide sm:text-2xl">
                  Top 5 Services
                </div>
                <div className="pr-2 text-gray-500">
                  {productivityData.top_services?.length === 0 && (
                    <div className="text-center m-auto flex my-24 justify-center">
                      No Services found.
                    </div>
                  )}

                  {productivityData.top_services?.map((service, index) => (
                    <div key={index}>
                      <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                        <div className="truncate overflow-ellipsis w-64">
                          {service.name}
                        </div>
                        <div className="text-right">
                          <div>
                            <span className="font-medium">{service.total}</span>{" "}
                            <span className="text-xs">times</span>
                          </div>
                          <div>{service.percentage + "%"}</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                        <div
                          className="h-1.5 rounded-full bg-blue-500"
                          style={{ width: service.percentage + "%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="">
                <div className="text-2xl font-bold tracking-wide sm:text-2xl">
                  Top 5 Retainers
                </div>
                <div className="pr-2 text-gray-500">
                  {productivityData.top_retainer_services?.length === 0 && (
                    <div className="text-center m-auto flex my-24 justify-center">
                      No Retainer Services found.
                    </div>
                  )}

                  {productivityData.top_retainer_services?.map(
                    (service, index) => (
                      <div key={index}>
                        <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                          <div className="truncate overflow-ellipsis w-64">
                            {service.name}
                          </div>
                          <div className="text-right">
                            <div>
                              <span className="font-medium">
                                {service.total}
                              </span>{" "}
                              <span className="text-xs">times</span>
                            </div>
                            <div>{service.percentage + "%"}</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                          <div
                            className="h-1.5 rounded-full bg-blue-500"
                            style={{ width: service.percentage + "%" }}
                          ></div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  );
};

export default TeamProductivity;
