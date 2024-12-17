import { useEffect, useState, Fragment } from "react";
import {
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Listbox, Transition, Switch } from "@headlessui/react";

import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import * as api from "./apiService";

import { toast } from "react-toastify";

import Pagination from "react-js-pagination";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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

const PricePlanDetails = () => {
  const { pricePlanId } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mappingsLoading, setMappingsLoading] = useState(true);

  const [nameAlreadyExists, setNameAlreadyExists] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [is_vendor, setIsVendor] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [vendorSelected, setVendorSelected] = useState(null);
  const [vendorSearchName, setVendorSearchName] = useState("");
  const [totalVendors, setTotalVendors] = useState(0);

  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(null);
  const [customerSearchName, setCustomerSearchName] = useState("");
  const [totalCustomers, setTotalCustomers] = useState(0);

  const [vendorAlreadyAdded, setVendorAlreadyAdded] = useState(false);

  const [availableVendors, setAvailableVendors] = useState([]);

  const [mappingAvailableVendors, setMappingAvailableVendors] = useState([]);

  const [showAddMappingSection, setShowAddMappingSection] = useState(false);

  const [mappings, setMappings] = useState([]);

  useEffect(() => {
    getPricePlanDetails();
  }, []);

  useEffect(() => {
    getPriceListMappings();
  }, []);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchVendors();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [vendorSearchName]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchCustomers();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [customerSearchName]);

  const getPricePlanDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.getPricePlanDetails(pricePlanId);
      setName(data.name);
      setDescription(data.description);
      setIsVendor(data.is_vendor);
    } catch (error) {
      toast.error("Unable to get price list details");
    }

    setLoading(false);
  };

  const getPriceListMappings = async () => {
    setMappingsLoading(true);
    try {
      const { data } = await api.getPriceListMappings(pricePlanId);
      setMappings(data);
    } catch (error) {
      toast.error("Unable to get price list mappings");
    }

    setMappingsLoading(false);
  };

  const updatePricePlan = async () => {
    if (name === "") {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      await api.editPricePlan(pricePlanId, { name, description });
      toast.success("Price list updated successfully");
    } catch (error) {
      if (error.response.status === 400) {
        setNameAlreadyExists(true);
      } else {
        toast.error("Unable to update price list");
      }
    }

    setLoading(false);
  };

  const searchVendors = async () => {
    const request = {
      name: vendorSearchName,
    };

    try {
      const { data } = await api.searchVendors(request);

      setVendors(data.results);
      setTotalVendors(data.count);
    } catch (err) {
      toast.error("Unable to search vendors");
    }
  };

  const searchCustomers = async () => {
    const request = {
      name: customerSearchName,
    };

    try {
      const { data } = await api.searchCustomers(request);

      setCustomers(data.results);
      setTotalCustomers(data.count);
    } catch (err) {
      toast.error("Unable to search customers");
    }
  };

  const handleKeyDownCustomers = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchCustomers();
    }
  };

  const handleKeyDownVendors = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchVendors();
    }
  };

  const addAvailableVendor = (vendorId) => {
    try {
      const vendorExists = availableVendors.find(
        (vendor) => vendor.id === vendorId
      );

      if (vendorExists) {
        setVendorAlreadyAdded(true);
      } else {
        // append the vendor to the availableVendors array
        const vendor = vendors.find((v) => v.id === vendorId);

        setAvailableVendors([...availableVendors, vendor]);
        setVendorAlreadyAdded(false);
      }
    } catch (err) {
      toast.error("Unable to add vendor");
    }
  };

  const handleAddAllVendors = () => {
    try {
      const newAvailableVendors = [...availableVendors];

      vendors.forEach((vendor) => {
        const vendorExists = availableVendors.find((v) => v.id === vendor.id);

        if (!vendorExists) {
          newAvailableVendors.push(vendor);
        }
      });

      setAvailableVendors(newAvailableVendors);
    } catch (err) {
      toast.error("Unable to add vendors");
    }
  };

  const handleCreateMapping = async () => {
    if (!customerSelected) {
      toast.error("Please select a customer");

      return;
    }

    if (availableVendors.length === 0) {
      toast.error("Please select at least one vendor");

      return;
    }

    const request = {
      price_list_id: pricePlanId,
      customer_id: customerSelected.id,
      vendor_ids: availableVendors.map((vendor) => vendor.id),
      action: "add",
    };

    try {
      await api.createPriceListMapping(request);
      toast.success("Mapping created successfully");

      handleCancelAddMapping();
    } catch (err) {
      toast.error("Mapping might already exist");
    }

    getPriceListMappings();
  };

  const handleDeleteMapping = async (customerId) => {
    const request = {
      price_list_id: pricePlanId,
      customer_id: customerId,
      action: "delete",
    };

    try {
      await api.deleteMapping(request);
      toast.success("Mapping deleted successfully");

      getPriceListMappings();
    } catch (err) {
      toast.error("Unable to delete mapping");
    }
  };

  const removeAvailableVendor = (vendorId) => {
    try {
      const newAvailableVendors = availableVendors.filter(
        (vendor) => vendor.id !== vendorId
      );

      setAvailableVendors(newAvailableVendors);
    } catch (err) {
      toast.error("Unable to remove vendor");
    }
  };

  const fetchAvailableMappingVendors = async (customerId) => {
    const request = {
      price_list_id: pricePlanId,
      customer_id: customerId,
      action: "fetch",
    };

    try {
      const { data } = await api.fetchAvailableVendors(request);

      setMappingAvailableVendors(data);
    } catch (err) {
      toast.error("Unable to fetch vendors");
    }
  };

  const removeAvailableMappingVendor = async (customerId, vendorId) => {
    const request = {
      price_list_id: pricePlanId,
      customer_id: customerId,
      vendor_id: vendorId,
      action: "delete",
    };

    try {
      await api.updateAvailableVendor(request);
      toast.success("Mapping deleted successfully");

      const newMappingAvailableVendors = mappingAvailableVendors.filter(
        (vendor) => vendor.id !== vendorId
      );

      setMappingAvailableVendors(newMappingAvailableVendors);
    } catch (err) {
      toast.error("Unable to delete mapping");
    }
  };

  const addAvailableMappingVendor = async (customerId, vendorId) => {
    const request = {
      price_list_id: pricePlanId,
      customer_id: customerId,
      vendor_id: vendorId,
      action: "add",
    };

    try {
      await api.updateAvailableVendor(request);
      toast.success("Mapping added successfully");

      const vendor = vendors.find((v) => v.id === vendorId);
      setMappingAvailableVendors([...mappingAvailableVendors, vendor]);
    } catch (err) {
      toast.error("Unable to add mapping");
    }
  };

  const handleCancelAddMapping = () => {
    setShowAddMappingSection(false);
    setAvailableVendors([]);
    setVendorAlreadyAdded(false);
    setVendorSearchName("");
  };

  const handleToggleMappingEditView = (mappingId, customerId) => {
    const updatedMappings = mappings.map((mapping) => {
      if (mapping.id === mappingId) {
        return { ...mapping, isEditing: !mapping.isEditing };
      } else {
        return { ...mapping, isEditing: false };
      }
    });

    console.log(updatedMappings);

    setMappings(updatedMappings);

    // call fetchAvailableMappingVendors if the mapping is being edited
    if (updatedMappings.find((mapping) => mapping.id === mappingId).isEditing) {
      fetchAvailableMappingVendors(customerId);
    }
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <main className="mx-auto max-w-7xl px-4 pb-16 lg:pb-12">
          <div className="space-y-6 mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-600">
                Price List Details
              </h1>
              <p className="mt-1 text-md text-gray-500">
                You can update any information associated with this price list.
              </p>
            </div>
          </div>
          <div>
            <div className="text-xl font-semibold text-gray-600 mb-4">
              Basic Information
            </div>
            <div>
              <label
                htmlFor="itemName"
                className="block text-md font-medium text-gray-700"
              >
                Name{" "}
                <span className=" text-red-400 text-md">(Must be unique)</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="itemName"
                  id="itemName"
                  className="block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-sky-500 focus:ring-sky-500 text-md"
                />
                {nameAlreadyExists && (
                  <p className="text-red-500 text-md font-semibold mt-2">
                    A price list with this name already exists.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="itemDescription"
                className="block text-md text-gray-500"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="itemDescription"
                  id="itemDescription"
                  className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 text-md"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end my-6">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-md font-medium
                            text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                              focus:ring-red-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => updatePricePlan()}
              className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-md font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
            >
              Update
            </button>
          </div>

          {name !== "Standard - Vendor" && is_vendor && (
            <>
              <div className="w-full border-t border-gray-300 py-2"></div>

              <div className="mt-4 flex justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xl font-semibold text-gray-600 mb-2">
                    Vendor Mappings
                  </div>
                  <p className="text-md text-gray-500">
                    Associate this price list with as many vendors as you want
                    for each customer. A price list must be associated with a
                    customer and multiple vendors.
                  </p>
                  <p className="text-md text-gray-500">
                    If no mapping is found for a particular customer, the vendor
                    will be associated with the default Standard-Vendor price
                    list.
                  </p>
                </div>
                <div className="text-right">
                  {showAddMappingSection && (
                    <button
                      onClick={() =>
                        setShowAddMappingSection(!showAddMappingSection)
                      }
                      type="button"
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-md font-medium
                                        text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                        focus:ring-red-500 focus:ring-offset-2"
                    >
                      Hide Mapping
                    </button>
                  )}

                  {!showAddMappingSection && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAddMappingSection(!showAddMappingSection)
                      }
                      className="ml-3 inline-flex justify-center rounded-md border
                                        border-transparent bg-red-600 py-2 px-4 text-md font-medium
                                            text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                            focus:ring-red-500 focus:ring-offset-2"
                    >
                      Add Mapping
                    </button>
                  )}
                </div>
              </div>
              {showAddMappingSection && (
                <>
                  <div className="mt-8 border border-gray-200 rounded-md p-6 pb-8">
                    <div className="flex justify-between cursor-pointer">
                      <div className="flex-1">
                        <div className="font-medium text-xl">
                          Add New Mapping
                        </div>
                      </div>
                      <div className="">
                        <button
                          onClick={() => handleCancelAddMapping()}
                          type="button"
                          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-md font-medium
                                        text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                        focus:ring-red-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCreateMapping()}
                          className="ml-3 inline-flex justify-center rounded-md border
                                    border-transparent bg-red-600 py-2 px-4 text-md font-medium
                                        text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                        focus:ring-red-500 focus:ring-offset-2"
                        >
                          Create Mapping
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2">
                      <div>
                        <div className="text-md font-medium">
                          Select a Customer
                        </div>
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
                                                                            focus:ring-1 focus:ring-sky-500 sm:text-lg"
                                >
                                  <span className="block truncate">
                                    {customerSelected
                                      ? customerSelected.name
                                      : "Customers"}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDownIcon
                                      className="h-4 w-4 text-gray-400"
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
                                                                                ring-black ring-opacity-5 focus:outline-none text-md"
                                  >
                                    <div className="relative">
                                      <div className="sticky top-0 z-20  px-1">
                                        <div className="mt-1 block  items-center">
                                          <input
                                            type="search"
                                            name="search"
                                            id="search"
                                            value={customerSearchName}
                                            onChange={(e) =>
                                              setCustomerSearchName(
                                                e.target.value
                                              )
                                            }
                                            onKeyDown={handleKeyDownCustomers}
                                            className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                                focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-lg
                                                                                border-gray-300 rounded-md"
                                          />
                                          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                            {customerSearchName && (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-blue-500 font-bold mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                onClick={() => {
                                                  setCustomerSearchName("");
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
                      <div></div>
                    </div>

                    <div className="mt-8 mb-4 text-md font-medium">
                      Select all vendors you want to associated this customer
                      with.
                    </div>
                    <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                      <div
                        className="border border-gray-200 rounded-md p-4"
                        style={{ height: "680px" }}
                      >
                        <div className="font-medium text-md">
                          <div className="flex justify-between">
                            <div>
                              All Vendors
                              <span
                                className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                            rounded-full text-md font-medium inline-block"
                              >
                                {totalVendors}
                              </span>
                            </div>
                            <div>
                              {vendorAlreadyAdded && (
                                <div className="text-red-500 text-md relative top-1">
                                  Vendor already added
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 my-2">
                            <div className="relative rounded-md shadow-sm flex-1">
                              <div
                                onClick={() => searchVendors()}
                                className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                              >
                                <MagnifyingGlassIcon
                                  className="h-5 w-5 text-gray-400 cursor-pointer"
                                  aria-hidden="true"
                                />
                              </div>
                              <input
                                type="search"
                                name="searchCustomer"
                                id="searchCustomer"
                                value={vendorSearchName}
                                onChange={(event) =>
                                  setVendorSearchName(event.target.value)
                                }
                                onKeyDown={handleKeyDownVendors}
                                className="block w-full rounded-md border-gray-300 pl-10
                                                                    focus:border-sky-500 text-md
                                                                    focus:ring-sky-500  font-normal"
                                placeholder="Search name..."
                              />
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => handleAddAllVendors()}
                                className="inline-flex items-center rounded border
                                            border-gray-300 bg-white px-2 py-2 text-md
                                            text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2
                                            "
                              >
                                Add all vendors
                              </button>
                            </div>
                          </div>
                          <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "560px" }}
                          >
                            {vendors.map((vendor) => (
                              <div key={vendor.id} className="relative">
                                <ul className="">
                                  <li className="">
                                    <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                      <div className="min-w-0 flex-1">
                                        <p className="text-md text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                          {vendor.name}
                                        </p>
                                      </div>
                                      <div>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            addAvailableVendor(vendor.id)
                                          }
                                          className="inline-flex items-center rounded border
                                                                                            border-gray-300 bg-white px-2 py-1 text-md
                                                                                            text-gray-700 shadow-sm
                                                                                            hover:bg-gray-50 focus:outline-none focus:ring-2
                                                                                            "
                                        >
                                          Add
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div
                        className="border border-gray-200 rounded-md p-4"
                        style={{ height: "680px" }}
                      >
                        <div className="font-medium text-md">
                          Available Vendors
                          <span
                            className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-md font-medium inline-block"
                          >
                            {availableVendors.length}
                          </span>
                        </div>
                        <div className="text-md">
                          {availableVendors.length === 0 && (
                            <div className="text-center m-auto mt-24 text-md">
                              No available vendors set.
                            </div>
                          )}

                          <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "560px" }}
                          >
                            {availableVendors.map((vendor) => (
                              <div key={vendor.id} className="relative">
                                <ul className="">
                                  <li className="">
                                    <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                      <div className="min-w-0 flex-1">
                                        <p className="text-md text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                          {vendor.name}
                                        </p>
                                      </div>
                                      <div>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeAvailableVendor(vendor.id)
                                          }
                                          className="inline-flex items-center rounded border
                                                                                                border-gray-300 bg-white px-2 py-1 text-md
                                                                                                text-gray-700 shadow-sm
                                                                                                hover:bg-gray-100 focus:outline-none focus:ring-2
                                                                                                "
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {mappingsLoading && <Loader />}

              {!mappingsLoading && (
                <div className="mt-8 flow-root">
                  {mappings.length > 0 && (
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-md font-semibold text-gray-900 sm:pl-0"
                              >
                                Customer
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-md font-semibold text-gray-900"
                              >
                                Vendors
                              </th>
                              <th
                                scope="col"
                                className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                              >
                                <span className="sr-only">Remove</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {mappings.map((mapping) => (
                              <>
                                <tr key={mapping.id}>
                                  <td className="whitespace-nowrap py-5 pl-4 pr-3 text-md sm:pl-0">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0">
                                        <img
                                          className="h-10 w-10 rounded-full"
                                          src={mapping.customer.logo}
                                          alt=""
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <div className="font-medium text-gray-900">
                                          {mapping.customer.name}
                                        </div>
                                        <div className="mt-1 text-gray-500">
                                          {mapping.customer.emailAddress}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap px-3 py-5 text-md text-gray-500">
                                    <div className="text-gray-900">
                                      {mapping.vendor_count} vendors
                                    </div>
                                  </td>
                                  <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-md font-medium sm:pr-0">
                                    <button
                                      onClick={() =>
                                        handleToggleMappingEditView(
                                          mapping.id,
                                          mapping.customer.id
                                        )
                                      }
                                      className="text-blue-600 hover:text-blue-900 mr-4"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteMapping(mapping.customer.id)
                                      }
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      Remove
                                    </button>
                                  </td>
                                </tr>
                                {mapping.isEditing && (
                                  <tr>
                                    <td colSpan={3}>
                                      <div className="p-8">
                                        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                                          <div
                                            className="border border-gray-200 rounded-md p-4"
                                            style={{ height: "680px" }}
                                          >
                                            <div className="font-medium text-md">
                                              <div className="flex justify-between">
                                                <div>
                                                  All Vendors
                                                  <span
                                                    className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                            rounded-full text-md font-medium inline-block"
                                                  >
                                                    {totalVendors}
                                                  </span>
                                                </div>
                                                <div>
                                                  {vendorAlreadyAdded && (
                                                    <div className="text-red-500 text-md relative top-1">
                                                      Vendor already added
                                                    </div>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="relative rounded-md shadow-sm flex-1">
                                                <div
                                                  onClick={() =>
                                                    searchVendors()
                                                  }
                                                  className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                                                >
                                                  <MagnifyingGlassIcon
                                                    className="h-5 w-5 text-gray-400 cursor-pointer"
                                                    aria-hidden="true"
                                                  />
                                                </div>
                                                <input
                                                  type="search"
                                                  name="searchCustomer"
                                                  id="searchCustomer"
                                                  value={vendorSearchName}
                                                  onChange={(event) =>
                                                    setVendorSearchName(
                                                      event.target.value
                                                    )
                                                  }
                                                  onKeyDown={
                                                    handleKeyDownVendors
                                                  }
                                                  className="block w-full rounded-md border-gray-300 pl-10
                                                                focus:border-sky-500 text-md
                                                                focus:ring-sky-500  font-normal"
                                                  placeholder="Search name..."
                                                />
                                              </div>
                                              <div
                                                className="overflow-y-auto"
                                                style={{ maxHeight: "560px" }}
                                              >
                                                {vendors.map((vendor) => (
                                                  <div
                                                    key={vendor.id}
                                                    className="relative"
                                                  >
                                                    <ul className="">
                                                      <li className="">
                                                        <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                                          <div className="min-w-0 flex-1">
                                                            <p className="text-md text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                                              {vendor.name}
                                                            </p>
                                                          </div>
                                                          <div>
                                                            <button
                                                              type="button"
                                                              onClick={() =>
                                                                addAvailableMappingVendor(
                                                                  mapping
                                                                    .customer
                                                                    .id,
                                                                  vendor.id
                                                                )
                                                              }
                                                              className="inline-flex items-center rounded border
                                                                                            border-gray-300 bg-white px-2 py-1 text-md
                                                                                            text-gray-700 shadow-sm
                                                                                            hover:bg-gray-50 focus:outline-none focus:ring-2
                                                                                            "
                                                            >
                                                              Add
                                                            </button>
                                                          </div>
                                                        </div>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                          <div
                                            className="border border-gray-200 rounded-md p-4"
                                            style={{ height: "680px" }}
                                          >
                                            <div className="font-medium text-md">
                                              Available Vendors
                                              <span
                                                className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-md font-medium inline-block"
                                              >
                                                {mappingAvailableVendors.length}
                                              </span>
                                            </div>
                                            <div className="text-md">
                                              {mappingAvailableVendors.length ===
                                                0 && (
                                                <div className="text-center m-auto mt-24 text-md">
                                                  No available vendors set.
                                                </div>
                                              )}

                                              <div
                                                className="overflow-y-auto"
                                                style={{ maxHeight: "560px" }}
                                              >
                                                {mappingAvailableVendors.map(
                                                  (vendor) => (
                                                    <div
                                                      key={vendor.id}
                                                      className="relative"
                                                    >
                                                      <ul className="">
                                                        <li className="">
                                                          <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                                            <div className="min-w-0 flex-1">
                                                              <p className="text-md text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                                                {vendor.name}
                                                              </p>
                                                            </div>
                                                            <div>
                                                              <button
                                                                type="button"
                                                                onClick={() =>
                                                                  removeAvailableMappingVendor(
                                                                    mapping
                                                                      .customer
                                                                      .id,
                                                                    vendor.id
                                                                  )
                                                                }
                                                                className="inline-flex items-center rounded border
                                                                                                border-gray-300 bg-white px-2 py-1 text-md
                                                                                                text-gray-700 shadow-sm
                                                                                                hover:bg-gray-100 focus:outline-none focus:ring-2
                                                                                                "
                                                              >
                                                                Remove
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </li>
                                                      </ul>
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      )}
    </AnimatedPage>
  );
};

export default PricePlanDetails;
