import { Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { CheckIcon, PhotographIcon } from "@heroicons/react/outline";
import { Listbox, Transition, Menu, Dialog } from "@headlessui/react";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

import Pagination from "react-js-pagination";

import ConfirmItemModal from "./ConfirmItemModal";
import AdjustItemModal from "./AdjustItemModal";
import MoveItemModal from "./MoveItemModal";

import LocationItemListing from "./LocationItemListing";
import ItemListing from "./ItemListing";

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
  { id: "B", name: "Bottle/Sprayer" },
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
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [locationItems, setLocationItems] = useState([]);
  const [items, setItems] = useState([]);

  const [totalLocationItemsQuantity, setTotalLocationItemsQuantity] =
    useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  const [open, setOpen] = useState(false);

  const [locations, setLocations] = useState([]);
  const [locationSelected, setLocationSelected] = useState(
    JSON.parse(localStorage.getItem("locationSelected")) || null
  );

  const [activeFilters, setActiveFilters] = useState([]);

  const [measureBySelected, setMeasureBySelected] = useState(null);
  const [areaSelected, setAreaSelected] = useState(null);

  const [statusSelected, setStatusSelected] = useState(null);

  const [locationItemSelected, setLocationItemSelected] = useState(null);

  const [isGridView, setGridView] = useState(
    JSON.parse(localStorage.getItem("inventoryGridView"))
  );

  const [isConfirmItemModalOpen, setConfirmItemModalOpen] = useState(false);
  const [isAdjustItemModalOpen, setAdjustItemModalOpen] = useState(false);
  const [isMoveItemModalOpen, setMoveItemModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({});

  const [thresholdMet, setThresholdMet] = useState(false);

  const [minimumRequiredMet, setMinimumRequiredMet] = useState(
    JSON.parse(localStorage.getItem("lowStockMet")) || false
  );
  const [outOfStockMet, setOutOfStockMet] = useState(
    JSON.parse(localStorage.getItem("outOfStockMet")) || false
  );

  const [inStock, setInStock] = useState(
    JSON.parse(localStorage.getItem("inStock")) || false
  );

  const [onHold, setOnHold] = useState(
    JSON.parse(localStorage.getItem("onHold")) || false
  );

  useEffect(() => {
    fetchItems();
  }, [
    locationSelected,
    searchText,
    measureBySelected,
    areaSelected,
    statusSelected,
    currentPage,
    thresholdMet,
    minimumRequiredMet,
    outOfStockMet,
    onHold,
    inStock,
  ]);

  const getLocations = async () => {
    try {
      const { data } = await api.getLocations();
      const response = await api.getUserDetails();

      if (
        response.data.isAdmin ||
        response.data.isSuperUser ||
        response.data.isAccountManager ||
        response.data.isInternalCoordinator
      ) {
        data.results.unshift({ id: null, name: "All My locations" });
      }

      setCurrentUser(response.data);

      setLocations(data.results);

      if (data.results.length > 0) {
        //Check if locationSelected is on the local storage
        const locationSelectedInLocalStorage = JSON.parse(
          localStorage.getItem("locationSelected")
        );

        if (locationSelectedInLocalStorage) {
          setLocationSelected(locationSelectedInLocalStorage);
        } else {
          setLocationSelected(data.results[0]);
        }
      }
    } catch (err) {
      toast.error("Unable to get locations");
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  const fetchItems = async () => {
    if (locations.length > 0) {
      setLoading(true);

      const request = {
        searchText,
        location: locationSelected?.id,
        measureById: measureBySelected?.id,
        areaId: areaSelected?.id,
        status: statusSelected?.id,
        thresholdMet,
        minimumRequiredMet,
        outOfStockMet,
        onHold,
        inStock,
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

      if (request.thresholdMet) {
        activeFilters.push({
          id: "thresholdMet",
          name: "Threshold Met",
        });
      }

      if (request.minimumRequiredMet) {
        activeFilters.push({
          id: "lowStockMet",
          name: "Low Stock",
        });
      }

      if (request.outOfStockMet) {
        activeFilters.push({
          id: "outOfStockMet",
          name: "Out of Stock",
        });
      }

      if (request.inStock) {
        activeFilters.push({
          id: "inStock",
          name: "In Stock",
        });
      }

      if (request.onHold) {
        activeFilters.push({
          id: "onHold",
          name: "On Hold",
        });
      }

      setActiveFilters(activeFilters);

      localStorage.setItem(
        "locationSelected",
        JSON.stringify(locationSelected)
      );

      localStorage.setItem("outOfStockMet", JSON.stringify(outOfStockMet));
      localStorage.setItem("lowStockMet", JSON.stringify(minimumRequiredMet));
      localStorage.setItem("onHold", JSON.stringify(onHold));
      localStorage.setItem("inStock", JSON.stringify(inStock));

      try {
        if (locationSelected?.id === null) {
          const { data } = await api.getItems(request, currentPage);

          setTotalItems(data.count);
          setItems(data.results);
        } else {
          const { data } = await api.getLocationItems(request, currentPage);

          setTotalItems(data.count);
          setLocationItems(data.results);
        }
      } catch (err) {
        setLocationItems([]);
        setTotalItems(0);
        toast.error("Unable to get items");
      }

      setLoading(false);

      try {
        const response = await api.getLocationItemsTotalQuantity(request);
        setTotalLocationItemsQuantity(response.data.totalQuantity || 0);
      } catch (err) {}
    }
  };

  const handleToggleConfirmItemModal = (item) => {
    if (item) {
      setLocationItemSelected(item);
    }
    setConfirmItemModalOpen(!isConfirmItemModalOpen);
  };

  const handleToggleAdjustItemModal = (item) => {
    if (item) {
      setLocationItemSelected(item);
    }
    setAdjustItemModalOpen(!isAdjustItemModalOpen);
  };

  const handleToggleMoveItemModal = (item) => {
    if (item) {
      setLocationItemSelected(item);
    }
    setMoveItemModalOpen(!isMoveItemModalOpen);
  };

  const moveItem = async (quantity, destinationLocationId) => {
    quantity = parseInt(quantity);

    let adjustedQuantity = null;
    const updatedItems = locationItems.map((locationItem) => {
      if (locationItem.id === locationItemSelected.id) {
        adjustedQuantity = locationItem.quantity - quantity;
        locationItem.quantity = adjustedQuantity;
        locationItem.status = "U";
      }

      return locationItem;
    });

    const request = {
      action: "move",
      destinationLocationId,
      adjustedQuantity,
      movingQuantity: quantity,
    };

    try {
      await api.updateLocationItem(locationItemSelected.id, request);

      setMoveItemModalOpen(false);
      setLocationItems(updatedItems);
      setLocationItemSelected(null);

      toast.success("Item moved!");
    } catch (err) {
      toast.error("Unable to update move item");
    }
  };

  const adjustItemQuantity = async (quantity) => {
    const request = {
      action: "adjust",
      quantity,
    };

    try {
      await api.updateLocationItem(locationItemSelected.id, request);

      setAdjustItemModalOpen(false);

      const updatedItems = locationItems.map((locationItem) => {
        if (locationItem.id === locationItemSelected.id) {
          locationItem.quantity = quantity;
          locationItem.status = "C";
        }

        return locationItem;
      });

      setLocationItems(updatedItems);
      setLocationItemSelected(null);

      toast.success("Item adjusted!");
    } catch (err) {
      toast.error("Unable to update adjust quantity");
    }
  };

  const updateItemStatus = async (status) => {
    const request = {
      action: "confirm",
    };

    try {
      await api.updateLocationItem(locationItemSelected.id, request);

      setConfirmItemModalOpen(false);

      const updatedItems = locationItems.map((locationItem) => {
        if (locationItem.id === locationItemSelected.id) {
          locationItem.status = status;
        }

        return locationItem;
      });

      setLocationItems(updatedItems);
      setLocationItemSelected(null);

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
    } else if (activeFilterId === "thresholdMet") {
      setThresholdMet(false);
    } else if (activeFilterId === "lowStockMet") {
      setMinimumRequiredMet(false);
    } else if (activeFilterId === "outOfStockMet") {
      setOutOfStockMet(false);
    } else if (activeFilterId === "onHold") {
      setOnHold(false);
    } else if (activeFilterId === "inStock") {
      setInStock(false);
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

  const handleGridView = (value) => {
    setGridView(value);
    localStorage.setItem("inventoryGridView", JSON.stringify(value));
  };

  const handleToggleThresholdMet = () => {
    setThresholdMet(!thresholdMet);
    setMinimumRequiredMet(false);
    setOutOfStockMet(false);
    setOnHold(false);
    setInStock(false);
  };

  const handleToggleMinimumRequiredMet = () => {
    setMinimumRequiredMet(!minimumRequiredMet);
    setThresholdMet(false);
    setOutOfStockMet(false);
    setOnHold(false);
    setInStock(false);
  };

  const handleToggleOutOfStockMet = () => {
    setOutOfStockMet(!outOfStockMet);
    setThresholdMet(false);
    setMinimumRequiredMet(false);
    setOnHold(false);
    setInStock(false);
  };

  const handleToggleInStock = () => {
    setInStock(!inStock);
    setThresholdMet(false);
    setMinimumRequiredMet(false);
    setOutOfStockMet(false);
    setOnHold(false);
  };

  const handleToggleOnHold = () => {
    setOnHold(!onHold);
    setThresholdMet(false);
    setMinimumRequiredMet(false);
    setOutOfStockMet(false);
    setInStock(false);
  };

  return (
    <AnimatedPage>
      <div
        className={`px-2 m-auto -mt-3 flex flex-wrap max-w-7xl`}
        style={{ maxWidth: "1900px" }}
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
          {/* Mobile filter dialog */}
          <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-40" onClose={setOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        Filters
                      </h2>
                      <button
                        type="button"
                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Filters */}
                    <form className="mt-4 px-4">
                      <div className="pb-4">
                        <h2 className="font-medium text-sm text-gray-900">
                          Measure By
                        </h2>
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
                      <div className="pb-4">
                        <h2 className="font-medium text-sm text-gray-900">
                          Areas
                        </h2>
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
                        <>
                          <div className="pb-4">
                            <h2 className="font-medium text-sm text-gray-900">
                              Status
                            </h2>
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
                          <div className="pb-4">
                            <h2 className="font-medium text-sm text-gray-900">
                              Alerts
                            </h2>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div
                                onClick={() => handleToggleThresholdMet()}
                                className={`${
                                  thresholdMet
                                    ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                                    : "hover:bg-gray-50"
                                }
                                                        rounded-md border border-gray-200 cursor-pointer
                                                    py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                              >
                                <div>THRESHOLD MET</div>
                              </div>
                              <div
                                onClick={() => handleToggleMinimumRequiredMet()}
                                className={`${
                                  minimumRequiredMet
                                    ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                                    : "hover:bg-gray-50"
                                }
                                                        rounded-md border border-gray-200 cursor-pointer
                                                    py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                              >
                                <div>LOW STOCK</div>
                              </div>
                              <div
                                onClick={() => handleToggleOutOfStockMet()}
                                className={`${
                                  outOfStockMet
                                    ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                                    : "hover:bg-gray-50"
                                }
                                                        rounded-md border border-gray-200 cursor-pointer
                                                    py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                              >
                                <div>OUT OF STOCK</div>
                              </div>
                              <div
                                onClick={() => handleToggleInStock()}
                                className={`${
                                  inStock
                                    ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                                    : "hover:bg-gray-50"
                                }
                                                        rounded-md border border-gray-200 cursor-pointer
                                                    py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                              >
                                <div>IN STOCK</div>
                              </div>
                              <div
                                onClick={() => handleToggleOnHold()}
                                className={`${
                                  onHold
                                    ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                                    : "hover:bg-gray-50"
                                }
                                                        rounded-md border border-gray-200 cursor-pointer
                                                    py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                              >
                                <div>ON HOLD</div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
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
                          className="relative w-11/12 cursor-default rounded-md border
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
                            className="absolute z-10 mt-1 max-h-96 w-11/12 overflow-auto
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
              <div className="relative border-gray-200 mt-1 flex justify-between gap-10">
                <div className="flex-1">
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
                <div className="xl:hidden lg:hidden">
                  <button
                    type="button"
                    className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 relative top-2 mr-2"
                    onClick={() => setOpen(true)}
                  >
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-1 my-3">
            <div className="mt-3 flex gap-2">
              <div>Total Items: {totalItems}</div>
              <div className="h-4 w-px bg-gray-300 relative top-1"></div>
              <div>Total Quantity: {totalLocationItemsQuantity}</div>
            </div>
            <div className="ml-6 items-center rounded-lg bg-gray-100 p-0.5 flex">
              <button
                onClick={() => handleGridView(true)}
                type="button"
                className="rounded-md p-1.5 text-gray-500 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              >
                <Bars4Icon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Use list view</span>
              </button>
              <button
                onClick={() => handleGridView(false)}
                type="button"
                className="ml-0.5 rounded-md bg-white p-1.5 text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
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

          {!loading &&
            ((locationItems.length === 0 && locationSelected?.id !== null) ||
              (items.length === 0 && locationSelected?.id === null)) && (
              <div className=" text-gray-500 mt-32 m-auto w-96 text-center pb-20">
                <div className="font-semibold text-gray-700">
                  No items found.
                </div>
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

          {!loading &&
            locationItems.length > 0 &&
            locationSelected?.id !== null && (
              <LocationItemListing
                isGridView={isGridView}
                locationItems={locationItems}
                currentUser={currentUser}
                thresholdMet={thresholdMet}
                minimumRequiredMet={minimumRequiredMet}
                handleToggleMoveItemModal={handleToggleMoveItemModal}
                handleToggleAdjustItemModal={handleToggleAdjustItemModal}
                handleToggleConfirmItemModal={handleToggleConfirmItemModal}
              />
            )}

          {!loading && items.length > 0 && locationSelected?.id === null && (
            <ItemListing
              isGridView={isGridView}
              items={items}
              currentUser={currentUser}
            />
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
            <>
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
              <div className="hidden xl:block lg:block pb-4">
                <h2 className="font-medium text-sm text-gray-900">Alerts</h2>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div
                    onClick={() => handleToggleThresholdMet()}
                    className={`${
                      thresholdMet
                        ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                        : "hover:bg-gray-50"
                    }
                                        rounded-md border border-gray-200 cursor-pointer
                                      py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                  >
                    <div>THRESHOLD MET</div>
                  </div>
                  <div
                    onClick={() => handleToggleMinimumRequiredMet()}
                    className={`${
                      minimumRequiredMet
                        ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                        : "hover:bg-gray-50"
                    }
                                        rounded-md border border-gray-200 cursor-pointer
                                      py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                  >
                    <div>LOW STOCK</div>
                  </div>
                  <div
                    onClick={() => handleToggleOutOfStockMet()}
                    className={`${
                      outOfStockMet
                        ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                        : "hover:bg-gray-50"
                    }
                                        rounded-md border border-gray-200 cursor-pointer
                                      py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                  >
                    <div>OUT OF STOCK</div>
                  </div>
                  <div
                    onClick={() => handleToggleInStock()}
                    className={`${
                      inStock
                        ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                        : "hover:bg-gray-50"
                    }
                                        rounded-md border border-gray-200 cursor-pointer
                                      py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                  >
                    <div>IN STOCK</div>
                  </div>
                  <div
                    onClick={() => handleToggleOnHold()}
                    className={`${
                      onHold
                        ? "ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500"
                        : "hover:bg-gray-50"
                    }
                                        rounded-md border border-gray-200 cursor-pointer
                                      py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32 flex justify-between`}
                  >
                    <div>ON HOLD</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {isConfirmItemModalOpen && (
          <ConfirmItemModal
            isOpen={isConfirmItemModalOpen}
            itemName={locationItemSelected?.item.name}
            quantityToDisplay={locationItemSelected?.quantity}
            handleClose={handleToggleConfirmItemModal}
            updateItemStatus={updateItemStatus}
            locationSelected={locationSelected}
          />
        )}

        {isAdjustItemModalOpen && (
          <AdjustItemModal
            isOpen={isAdjustItemModalOpen}
            itemName={locationItemSelected?.item.name}
            quantityToDisplay={locationItemSelected?.quantity}
            handleClose={handleToggleAdjustItemModal}
            adjustItemQuantity={adjustItemQuantity}
            locationSelected={locationSelected}
          />
        )}

        {isMoveItemModalOpen && (
          <MoveItemModal
            isOpen={isMoveItemModalOpen}
            itemName={locationItemSelected?.item.name}
            quantityToDisplay={locationItemSelected?.quantity}
            handleClose={handleToggleMoveItemModal}
            moveItem={moveItem}
            locationSelected={locationSelected}
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default InventoryList;
