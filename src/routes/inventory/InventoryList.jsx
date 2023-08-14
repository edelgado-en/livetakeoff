import { Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import {
  ChevronRightIcon,
  PlusIcon,
  CheckIcon,
  ChevronDownIcon,
  PhotographIcon,
} from "@heroicons/react/outline";
import {
  Listbox,
  Transition,
  Menu,
  Popover,
  Disclosure,
  Dialog,
} from "@headlessui/react";
import { UserIcon } from "@heroicons/react/solid";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

import Pagination from "react-js-pagination";

import ConfirmItemModal from "./ConfirmItemModal";
import AdjustItemModal from "./AdjustItemModal";
import MoveItemModal from "./MoveItemModal";

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

const Bars4Icon = () => {
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
        d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
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

const SquaresIcon = () => {
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
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const availableMeasureByOptions = [
  { id: "U", name: "Unit" },
  { id: "G", name: "Gallons" },
  { id: "B", name: "Bottle" },
  { id: "O", name: "Box" },
  { id: "L", name: "Lb" },
  { id: "J", name: "Jar" },
  { id: "T", name: "Other" },
];

const availableAreaOptions = [
  { id: "I", name: "Interior" },
  { id: "E", name: "Exterior" },
  { id: "B", name: "Interior and Exterior" },
  { id: "O", name: "Office" },
];

const availableStatusOptions = [
  { id: "C", name: "Confirmed" },
  { id: "U", name: "Unconfirmed" },
];

const InventoryList = () => {
  const currentUser = useAppSelector(selectUser);

  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [locations, setLocations] = useState([]);
  const [locationSelected, setLocationSelected] = useState(null);

  const [activeFilters, setActiveFilters] = useState([]);

  const [measureBySelected, setMeasureBySelected] = useState(null);
  const [areaSelected, setAreaSelected] = useState(null);

  const [statusSelected, setStatusSelected] = useState(null);

  const [itemSelected, setItemSelected] = useState(null);

  const [isConfirmItemModalOpen, setConfirmItemModalOpen] = useState(false);
  const [isAdjustItemModalOpen, setAdjustItemModalOpen] = useState(false);
  const [isMoveItemModalOpen, setMoveItemModalOpen] = useState(false);

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [
    locationSelected,
    searchText,
    measureBySelected,
    areaSelected,
    statusSelected,
    currentPage,
  ]);

  const getLocations = async () => {
    try {
      const { data } = await api.getLocations();

      if (
        currentUser.isAdmin ||
        currentUser.isSuperUser ||
        currentUser.isAccountManager ||
        currentUser.isInternalCoordinator
      ) {
        data.results.unshift({ id: null, name: "All My locations" });
      }

      setLocations(data.results);

      if (data.results.length > 0) {
        setLocationSelected(data.results[0]);
      }
    } catch (err) {
      toast.error("Unable to get locations");
    }
  };

  const fetchItems = async () => {
    if (locations.length > 0) {
      setLoading(true);

      const request = {
        searchText,
        location: locationSelected?.id,
        measureById: measureBySelected?.id,
        areaId: areaSelected?.id,
        status: statusSelected?.id,
      };

      //set active filters
      let activeFilters = [];

      if (request.searchText) {
        activeFilters.push({
          id: "searchText",
          name: request.searchText,
        });
      }

      if (request.measureById) {
        activeFilters.push({
          id: "measureBy",
          name: measureBySelected?.name,
        });
      }

      if (request.areaId) {
        activeFilters.push({
          id: "area",
          name: areaSelected?.name,
        });
      }

      if (request.status) {
        activeFilters.push({
          id: "status",
          name: statusSelected?.name,
        });
      }

      setActiveFilters(activeFilters);

      try {
        const { data } = await api.getItems(request, currentPage);

        setTotalItems(data.count);
        //setItems(data.results);

        // set quantityToDisplay in each item. The quantity to display is the quantity of the item in the location selected
        if (locationSelected) {
          data.results.forEach((item) => {
            const itemLocation = item.location_items.find(
              (locationItem) => locationItem.location.id === locationSelected.id
            );

            if (itemLocation) {
              item.quantityToDisplay = itemLocation.quantity;
              item.statusToDisplay = itemLocation.status;
            } else {
              item.quantityToDisplay = null;
            }
          });
        }

        setItems(data.results);
      } catch (err) {
        setItems([]);
        setTotalItems(0);
        toast.error("Unable to get items");
      }

      setLoading(false);
    }
  };

  const handleToggleConfirmItemModal = (item) => {
    if (item) {
      setItemSelected(item);
    }
    setConfirmItemModalOpen(!isConfirmItemModalOpen);
  };

  const handleToggleAdjustItemModal = (item) => {
    if (item) {
      setItemSelected(item);
    }
    setAdjustItemModalOpen(!isAdjustItemModalOpen);
  };

  const handleToggleMoveItemModal = (item) => {
    if (item) {
      setItemSelected(item);
    }
    setMoveItemModalOpen(!isMoveItemModalOpen);
  };

  const moveItem = async (quantity, destinationLocationId) => {
    quantity = parseInt(quantity);

    let location_item_id = null;
    let adjustedQuantity = null;
    const updatedItems = items.map((item) => {
      if (item.id === itemSelected.id) {
        adjustedQuantity = item.quantityToDisplay - quantity;
        item.quantityToDisplay = adjustedQuantity;
        item.statusToDisplay = "U";

        location_item_id = item.location_items.find(
          (locationItem) => locationItem.location.id === locationSelected.id
        ).id;
      }

      return item;
    });

    const request = {
      action: "move",
      destinationLocationId,
      adjustedQuantity,
      movingQuantity: quantity,
    };

    try {
      await api.updateLocationItem(location_item_id, request);

      setMoveItemModalOpen(false);
      setItems(updatedItems);
      setItemSelected(null);

      toast.success("Item moved!");
    } catch (err) {
      toast.error("Unable to update move item");
    }
  };

  const adjustItemQuantity = async (quantity) => {
    let location_item_id = null;
    const updatedItems = items.map((item) => {
      if (item.id === itemSelected.id) {
        item.quantityToDisplay = quantity;
        item.statusToDisplay = "U";

        location_item_id = item.location_items.find(
          (locationItem) => locationItem.location.id === locationSelected.id
        ).id;
      }

      return item;
    });

    const request = {
      action: "adjust",
      quantity,
    };

    try {
      await api.updateLocationItem(location_item_id, request);

      setAdjustItemModalOpen(false);
      setItems(updatedItems);
      setItemSelected(null);

      toast.success("Item adjusted!");
    } catch (err) {
      toast.error("Unable to update adjust quantity");
    }
  };

  const updateItemStatus = async (status) => {
    let location_item_id = null;
    const updatedItems = items.map((item) => {
      if (item.id === itemSelected.id) {
        item.statusToDisplay = status;

        location_item_id = item.location_items.find(
          (locationItem) => locationItem.location.id === locationSelected.id
        ).id;
      }

      return item;
    });

    const request = {
      action: "confirm",
    };

    try {
      await api.updateLocationItem(location_item_id, request);

      setConfirmItemModalOpen(false);
      setItems(updatedItems);
      setItemSelected(null);

      toast.success("Item confirmed!");
    } catch (err) {
      toast.error("Unable to update item status");
    }
  };

  const removeActiveFilter = (activeFilterId) => {
    if (activeFilterId === "measureBy") {
      setMeasureBySelected(null);
    } else if (activeFilterId === "searchText") {
      setSearchText("");
    } else if (activeFilterId === "area") {
      setAreaSelected(null);
    } else if (activeFilterId === "status") {
      setStatusSelected(null);
    }

    setActiveFilters(
      activeFilters.filter((filter) => filter.id !== activeFilterId)
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      fetchItems();
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSetLocationSelected = (location) => {
    if (location.id === null) {
      setStatusSelected(null);
    }

    setLocationSelected(location);
  };

  return (
    <AnimatedPage>
      <div
        className={`px-4 m-auto ${
          currentUser.isAdmin ||
          currentUser.isSuperUser ||
          currentUser.isAccountManager ||
          currentUser.isInternalCoordinator
            ? "max-w-7xl"
            : "max-w-5xl"
        } -mt-3 flex flex-wrap`}
      >
        <div className="flex-1 xl:px-10 lg:px-10 md:px-10">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-2xl font-semibold leading-6 text-gray-900">
                Inventory
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Manage your inventory items for a specific location or across
                all your locations.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              {(currentUser.isAdmin ||
                currentUser.isSuperUser ||
                currentUser.isAccountManager ||
                currentUser.isCustomer ||
                currentUser.isInternalCoordinator) && (
                <Link to="/create-inventory-item">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center 
                                            rounded-md border border-transparent bg-red-600 px-4 py-2
                                            text-sm font-medium text-white shadow-sm hover:bg-red-700
                                            focus:outline-none focus:ring-2 focus:ring-red-500
                                            focus:ring-offset-2 sm:w-auto"
                  >
                    Create Item
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="mt-4">
            <div
              className="grid xl:grid-cols-2 lg:grid-cols-2
                            md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-y-4 gap-x-40"
            >
              <div>
                <Listbox
                  value={locationSelected}
                  onChange={(location) => handleSetLocationSelected(location)}
                >
                  {({ open }) => (
                    <>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-96 cursor-default rounded-md border
                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                        shadow-sm focus:border-sky-500 focus:outline-none
                                        focus:ring-1 focus:ring-sky-500 sm:text-sm"
                        >
                          <span className="block truncate">
                            {locationSelected
                              ? locationSelected.name
                              : "Select a location"}
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
                            className="absolute z-10 mt-1 max-h-96 w-96 overflow-auto
                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                          >
                            {locations.map((location) => (
                              <Listbox.Option
                                key={location.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={location}
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
                                      {location.name}
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
              <div className="relative border-gray-200 mt-1">
                <div
                  onClick={() => fetchItems()}
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
                  value={searchText}
                  onChange={(event) => setSearchText(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="block w-full  pl-10 focus:border-sky-500 border border-gray-300 py-3 rounded-md 
                                  focus:ring-sky-500 text-sm"
                  placeholder="Search by name"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-2">
            <div className="mt-3">Total Items: {totalItems}</div>
            <div className="ml-6 hidden items-center rounded-lg bg-gray-100 p-0.5 sm:flex">
              <button
                type="button"
                className="rounded-md p-1.5 text-gray-500 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <Bars4Icon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Use list view</span>
              </button>
              <button
                type="button"
                className="ml-0.5 rounded-md bg-white p-1.5 text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <SquaresIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Use grid view</span>
              </button>
            </div>
          </div>

          <div className="mt-1">
            {activeFilters.length > 0 && (
              <div className="bg-gray-100">
                <div className="mx-auto max-w-7xl py-2 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
                  <h3 className="text-xs font-medium text-gray-500">
                    Filters
                    <span className="sr-only">, active</span>
                  </h3>

                  <div
                    aria-hidden="true"
                    className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
                  />

                  <div className="mt-2 sm:mt-0 sm:ml-4">
                    <div className="-m-1 flex flex-wrap items-center">
                      {activeFilters.map((activeFilter) => (
                        <span
                          key={activeFilter.id}
                          onClick={() => removeActiveFilter(activeFilter.id)}
                          className="m-1 inline-flex items-center rounded-full cursor-pointer
                                     border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-xs font-medium text-gray-900"
                        >
                          <span>{activeFilter.name}</span>
                          <button
                            type="button"
                            className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                          >
                            <span className="sr-only">
                              Remove filter for {activeFilter.name}
                            </span>
                            <svg
                              className="h-2 w-2"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 8 8"
                            >
                              <path
                                strokeLinecap="round"
                                strokeWidth="1.5"
                                d="M1 1l6 6m0-6L1 7"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading && <Loader />}

          {!loading && items.length === 0 && (
            <div className=" text-gray-500 mt-32 m-auto w-96 text-center">
              <div className="font-semibold text-gray-700">No items found.</div>
              {locations.length > 0 && (
                <p className=" text-gray-500 mt-2">
                  We can’t find anything with those filters at the moment, try
                  searching something else.
                </p>
              )}
              {locations.length === 0 && (
                <p className=" text-gray-500 mt-2">
                  You don't have any locations available. Contact your
                  administrator to setup your locations.
                </p>
              )}
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="overflow-hidden bg-white shadow sm:rounded-md mb-4">
              <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="group relative">
                    <div
                      className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md
                                     bg-gray-100 lg:aspect-none group-hover:opacity-75 lg:h-48"
                    >
                      {item.photo && (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                        />
                      )}

                      {!item.photo && (
                        <PhotographIcon className="h-52 w-52 text-gray-200 items-center m-auto align-middle" />
                      )}
                    </div>
                    <div className="mt-1 flex justify-between">
                      <div className="flex gap-1">
                        <div
                          className={`flex-none rounded-full ${
                            item.statusToDisplay === "C"
                              ? "bg-green-400/10 p-1 text-green-400"
                              : "bg-red-400/10 p-1 text-red-400"
                          }`}
                        >
                          <div className="h-2 w-2 rounded-full bg-current" />
                        </div>
                        <h3
                          className="text-sm text-gray-900 font-medium truncate"
                          style={{ maxWidth: "170px" }}
                        >
                          {item.name}
                        </h3>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.quantityToDisplay}
                      </p>
                    </div>
                    {!locationSelected ||
                      (locationSelected.id === null && (
                        <div className="mt-2 text-gray-500 text-sm">
                          Found in{" "}
                          <span className="font-semibold">
                            {item.location_items.length}
                          </span>{" "}
                          location(s)
                        </div>
                      ))}
                    <div className="mt-2 text-sm text-gray-500 flex justify-between gap-2 italic">
                      <div>
                        <span>{item.area === "I" && "Interior"}</span>
                        <span>{item.area === "E" && "Exterior"}</span>
                        <span>
                          {item.area === "B" && "Interior and Exterior"}
                        </span>
                      </div>
                      <div>
                        <span>{item.area === "O" && "Office"}</span>
                        <span>{item.measure_by === "U" && "Unit"}</span>
                        <span>{item.measure_by === "G" && "Gallons"}</span>
                        <span>{item.measure_by === "B" && "Bottle"}</span>
                        <span>{item.measure_by === "O" && "Box"}</span>
                        <span>{item.measure_by === "L" && "Lb"}</span>
                        <span>{item.measure_by === "J" && "Jar"}</span>
                        <span>{item.measure_by === "T" && "Other"}</span>
                      </div>
                    </div>
                    {locationSelected && locationSelected.id !== null && (
                      <>
                        <div className="mt-3">
                          <button
                            disabled={item.quantityToDisplay === 0}
                            onClick={() => handleToggleMoveItemModal(item)}
                            className="w-full relative flex items-center justify-center rounded-md 
                                            border border-transparent bg-blue-500 px-8 py-2 text-sm
                                            font-medium text-white hover:bg-blue-600"
                          >
                            Move
                          </button>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => handleToggleAdjustItemModal(item)}
                            className="w-full relative flex items-center justify-center rounded-md 
                                            border border-transparent bg-gray-100 px-8 py-2 text-sm
                                            font-medium text-gray-900 hover:bg-gray-200"
                          >
                            Adjust
                          </button>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => handleToggleConfirmItemModal(item)}
                            disabled={item.statusToDisplay === "C"}
                            className="w-full relative flex items-center justify-center rounded-md 
                                            border border-transparent bg-gray-100 px-8 py-2 text-sm
                                            font-medium text-gray-900 hover:bg-gray-200"
                          >
                            Confirm
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              {/* <ul className="mt-1 divide-y divide-gray-200 border-t border-gray-200 sm:mt-0 sm:border-t-0">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/inventory/items/${item.id}/details`}
                      className="group block"
                    >
                      <div className="flex items-center px-4 py-5">
                        <div className="flex min-w-0 flex-1 items-center">
                          <div className="flex-shrink-0">
                            <img
                              className="h-36 w-48 rounded-full group-hover:opacity-75"
                              src={item.photo}
                              alt=""
                            />
                          </div>
                          <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                            <div className="flex gap-4">
                              <div className="truncate text-sm font-medium">
                                {item.name}
                              </div>
                              <div
                                className={`text-xs inline-block rounded-md px-2 border
                                             bg-gray-100 border-gray-200 text-gray-500`}
                                style={{
                                  paddingTop: "1px",
                                  paddingBottom: "1px",
                                }}
                              >
                                {item.measure_by}
                              </div>
                              <div
                                className={`text-xs inline-block rounded-md px-2 border
                                             bg-gray-100 border-gray-200 text-gray-500`}
                                style={{
                                  paddingTop: "1px",
                                  paddingBottom: "1px",
                                }}
                              >
                                {item.area}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <ChevronRightIcon
                            className="h-5 w-5 text-gray-400 group-hover:text-gray-700"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul> */}
            </div>
          )}

          {!loading && totalItems > 100 && (
            <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
              <div>
                <Pagination
                  innerClass="pagination pagination-custom"
                  activePage={currentPage}
                  hideDisabled
                  itemClass="page-item page-item-custom"
                  linkClass="page-link page-link-custom"
                  itemsCountPerPage={100}
                  totalItemsCount={totalItems}
                  pageRangeDisplayed={3}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          )}
        </div>
        <div className="xs:pt-10 sm:pt-10 xl:pt-0 lg:pt-0 md:pt-0">
          <div className="hidden xl:block lg:block pb-4">
            <h2 className="font-medium text-sm text-gray-900">Measure By</h2>
            <ul className="relative z-0 divide-y divide-gray-200 mt-2">
              {availableMeasureByOptions.map((measureBy) => (
                <li key={measureBy.id}>
                  <div
                    onClick={() =>
                      setMeasureBySelected({
                        id: measureBy.id,
                        name: measureBy.name,
                      })
                    }
                    className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                                hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="focus:outline-none">
                        <p className="text-sm text-gray-700 truncate overflow-ellipsis w-44">
                          {measureBy.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden xl:block lg:block pb-4">
            <h2 className="font-medium text-sm text-gray-900">Areas</h2>
            <ul className="relative z-0 divide-y divide-gray-200 mt-2">
              {availableAreaOptions.map((area) => (
                <li key={area.id}>
                  <div
                    onClick={() =>
                      setAreaSelected({
                        id: area.id,
                        name: area.name,
                      })
                    }
                    className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                                hover:bg-gray-50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="focus:outline-none">
                        <p className="text-sm text-gray-700 truncate overflow-ellipsis w-44">
                          {area.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {locationSelected && locationSelected.id !== null && (
            <div className="hidden xl:block lg:block pb-4">
              <h2 className="font-medium text-sm text-gray-900">Status</h2>
              <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                {availableStatusOptions.map((status) => (
                  <li key={status.id}>
                    <div
                      onClick={() =>
                        setStatusSelected({
                          id: status.id,
                          name: status.name,
                        })
                      }
                      className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                                    hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="focus:outline-none">
                          <p className="text-sm text-gray-700 truncate overflow-ellipsis w-44">
                            {status.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {isConfirmItemModalOpen && (
          <ConfirmItemModal
            isOpen={isConfirmItemModalOpen}
            item={itemSelected}
            handleClose={handleToggleConfirmItemModal}
            updateItemStatus={updateItemStatus}
            locationSelected={locationSelected}
          />
        )}

        {isAdjustItemModalOpen && (
          <AdjustItemModal
            isOpen={isAdjustItemModalOpen}
            item={itemSelected}
            handleClose={handleToggleAdjustItemModal}
            adjustItemQuantity={adjustItemQuantity}
            locationSelected={locationSelected}
          />
        )}

        {isMoveItemModalOpen && (
          <MoveItemModal
            isOpen={isMoveItemModalOpen}
            item={itemSelected}
            handleClose={handleToggleMoveItemModal}
            moveItem={moveItem}
            locationSelected={locationSelected}
            locations={locations}
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default InventoryList;
