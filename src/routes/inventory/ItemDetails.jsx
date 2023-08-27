import { useEffect, useState, Fragment } from "react";
import {
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import ImageUploading from "react-images-uploading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";

import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import CreateProviderModal from "./CreateProviderModal";
import CreateLocationModal from "./CreateLocationModal";
import CreateBrandModal from "./CreateBrandModal";
import CreateTagModal from "./CreateTagModal";

import * as api from "./apiService";

import { toast } from "react-toastify";

import ReactTimeAgo from "react-time-ago";

import Pagination from "react-js-pagination";

import ConfirmItemModal from "./ConfirmItemModal";
import AdjustItemModal from "./AdjustItemModal";
import MoveItemModal from "./MoveItemModal";
import DeleteLocationItemModal from "./DeleteLocationItemModal";

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

const XMarkIcon = () => {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ItemDetails = () => {
  const { itemId } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [itemName, setItemName] = useState("");
  const [itemNameErrorMessage, setItemNameErrorMessage] = useState(null);

  const [itemAlreadyExistsId, setItemAlreadyExistsId] = useState(null);

  const [description, setDescription] = useState("");
  const [areaSelected, setAreaSelected] = useState(null);
  const [measureUnitSelected, setMeasureUnitSelected] = useState(null);
  const [costPerUnit, setCostPerUnit] = useState("");

  const [providers, setProviders] = useState([]);
  const [brands, setBrands] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);
  const [groups, setGroups] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [locationItems, setLocationItems] = useState([]);
  const [tags, setTags] = useState([]);

  const [itemImages, setItemImages] = useState([]);

  const [isCreateProviderModalOpen, setCreateProviderModalOpen] =
    useState(false);
  const [isCreateLocationModalOpen, setCreateLocationModalOpen] =
    useState(false);
  const [isCreateBrandModalOpen, setCreateBrandModalOpen] = useState(false);

  const [isCreateTagModalOpen, setCreateTagModalOpen] = useState(false);

  const [itemPhoto, setItemPhoto] = useState(null);

  const [itemActivities, setItemActivities] = useState([]);
  const [totalItemActivities, setTotalItemActivities] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [isConfirmItemModalOpen, setConfirmItemModalOpen] = useState(false);
  const [isAdjustItemModalOpen, setAdjustItemModalOpen] = useState(false);
  const [isMoveItemModalOpen, setMoveItemModalOpen] = useState(false);
  const [isDeleteLocationItemModalOpen, setDeleteLocationItemModalOpen] =
    useState(false);

  const [locationItemSelected, setLocationItemSelected] = useState(null);

  useEffect(() => {
    getItemFormInfo();
  }, []);

  useEffect(() => {
    getItemActivity();
  }, [currentPage]);

  /* useEffect(() => {
    let timeoutID = setTimeout(() => {
      getItemLookup();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [itemName]); */

  const getItemActivity = async () => {
    const request = {
      item_id: itemId,
    };

    try {
      const { data } = await api.getItemActivity(request, currentPage);

      setItemActivities(data.results);
      setTotalItemActivities(data.count);
    } catch (err) {}
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleToggleConfirmItemModal = (locationItem) => {
    if (locationItem) {
      setLocationItemSelected(locationItem);
    }

    setConfirmItemModalOpen(!isConfirmItemModalOpen);
  };

  const handleToggleAdjustItemModal = (locationItem) => {
    if (locationItem) {
      setLocationItemSelected(locationItem);
    }

    setAdjustItemModalOpen(!isAdjustItemModalOpen);
  };

  const handleToggleMoveItemModal = (locationItem) => {
    if (locationItem) {
      setLocationItemSelected(locationItem);
    }

    setMoveItemModalOpen(!isMoveItemModalOpen);
  };

  const handleToggleDeleteLocationItemModal = (locationItem) => {
    if (locationItem) {
      setLocationItemSelected(locationItem);
    }

    setDeleteLocationItemModalOpen(!isDeleteLocationItemModalOpen);
  };

  const getItemLookup = async () => {
    if (itemName?.length > 3) {
      try {
        const { data } = await api.getItemLookup(itemName);

        console.log(data.id);

        if (data.id > 0) {
          setItemAlreadyExistsId(data.id);
        } else {
          setItemAlreadyExistsId(null);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setItemAlreadyExistsId(null);
    }
  };

  const handleToggleCreateProviderModal = () => {
    setCreateProviderModalOpen(!isCreateProviderModalOpen);
  };

  const handleToggleCreateLocationModal = () => {
    setCreateLocationModalOpen(!isCreateLocationModalOpen);
  };

  const handleToggleCreateBrandModal = () => {
    setCreateBrandModalOpen(!isCreateBrandModalOpen);
  };

  const handleToggleCreateTagModal = () => {
    setCreateTagModalOpen(!isCreateTagModalOpen);
  };

  const getItemFormInfo = async () => {
    try {
      const { data } = await api.getItemFormInfo();

      setTags(data.tags);
      setProviders(data.providers);
      setMeasureUnits(data.measurements);
      setAreas(data.areas);
      setLocations(data.locations);
      setBrands(data.brands);

      // iterate through data.locations and create locationItems. A locationItem is ab object containing the location and other values like quantity, minimumRequired, alertAt and brandSelected
      const locationItems = data.locations.map((location) => {
        return {
          location,
          quantity: "",
          minimumRequired: "",
          alertAt: "",
          brandsSelected: [],
          groups: location.groups,
        };
      });

      const response = await api.getItemDetails(itemId);

      setItemName(response.data.name);
      setDescription(response.data.description);
      setItemPhoto(response.data.photo);

      if (response.data.measure_by === "U") {
        setMeasureUnitSelected({ id: "U", name: "Unit" });
      } else if (response.data.measure_by === "G") {
        setMeasureUnitSelected({ id: "G", name: "Gallons" });
      } else if (response.data.measure_by === "B") {
        setMeasureUnitSelected({ id: "B", name: "Bottle" });
      } else if (response.data.measure_by === "O") {
        setMeasureUnitSelected({ id: "O", name: "Box" });
      } else if (response.data.measure_by === "L") {
        setMeasureUnitSelected({ id: "L", name: "Lb" });
      } else if (response.data.measure_by === "J") {
        setMeasureUnitSelected({ id: "J", name: "Jar" });
      } else if (response.data.measure_by === "T") {
        setMeasureUnitSelected({ id: "T", name: "Other" });
      }

      setCostPerUnit(response.data.cost_per_unit);

      if (response.data.area === "I") {
        setAreaSelected({ id: "I", name: "Interior" });
      } else if (response.data.area === "E") {
        setAreaSelected({ id: "E", name: "Exterior" });
      } else if (response.data.area === "B") {
        setAreaSelected({ id: "B", name: "Interior and Exterior" });
      } else if (response.data.area === "O") {
        setAreaSelected({ id: "O", name: "Office" });
      }

      //compare data.tags with tags and set selected = True if id matches
      const tagsSelected = data.tags.map((tag) => {
        const tagSelected = response.data.tags.find((t) => t.name === tag.name);
        if (tagSelected) {
          return { ...tag, selected: true };
        } else {
          return { ...tag, selected: false };
        }
      });

      setTags(tagsSelected);

      //compare data.providers with providers and set selected = True if id matches
      const providersSelected = data.providers.map((provider) => {
        const providerSelected = response.data.providers.find(
          (p) => p.name === provider.name
        );
        if (providerSelected) {
          return { ...provider, selected: true };
        } else {
          return { ...provider, selected: false };
        }
      });

      setProviders(providersSelected);

      const locationItemsWithValues = response.data.location_items.map(
        (locationItem) => {
          const brandsSelected = locationItem.location_item_brands.map(
            (location_item_brand) => {
              return {
                id: location_item_brand.brand.id,
                name: location_item_brand.brand.name,
              };
            }
          );

          return {
            ...locationItem,
            quantity: locationItem.quantity,
            minimumRequired: locationItem.minimum_required,
            alertAt: locationItem.threshold,
            brandsSelected: brandsSelected,
            status: locationItem.status,
          };
        }
      );

      setLocationItems(locationItemsWithValues);
    } catch (err) {
      toast.error("Unable to get item form info.");
    }

    setLoading(false);
  };

  const handleToggleTag = (tag) => {
    const newTags = [...tags];
    const index = newTags.findIndex((item) => item.id === tag.id);
    newTags[index].selected = !newTags[index].selected;

    setTags(newTags);
  };

  const handleToggleProvider = (provider) => {
    const newProviders = [...providers];
    const index = newProviders.findIndex((item) => item.id === provider.id);
    newProviders[index].selected = !newProviders[index].selected;

    setProviders(newProviders);
  };

  const updateItem = async () => {
    if (itemName.length === 0) {
      alert("Please enter an item name.");
      return;
    }

    if (measureUnitSelected === null) {
      alert("Please select a measure unit.");
      return;
    }

    if (areaSelected === null) {
      alert("Please select an area.");
      return;
    }

    if (costPerUnit.length === 0) {
      alert("Please enter a cost per unit.");
      return;
    }

    const atLeastOneLocationItemHasQuantity = locationItems.some(
      (locationItem) => locationItem.quantity > 0
    );

    if (!atLeastOneLocationItemHasQuantity) {
      alert("Please enter a quantity bigger than 0 for at least one location.");
      return;
    }

    //only include the locationItems that have a quantity bigger than 0
    const locationItemsWithQuantity = locationItems.filter(
      (locationItem) => locationItem.quantity > 0
    );

    const selectedTagIds = tags
      .filter((tag) => tag.selected)
      .map((tag) => tag.id);
    const selectedProviderIds = providers
      .filter((provider) => provider.selected)
      .map((provider) => provider.id);

    const request = {
      itemId: itemId,
      name: itemName,
      description: description,
      areaId: areaSelected.id,
      measureUnitId: measureUnitSelected.id,
      costPerUnit: costPerUnit,
      tagIds: selectedTagIds,
      providerIds: selectedProviderIds,
      locationItems: locationItemsWithQuantity,
    };

    setLoading(true);

    try {
      await api.updateItem(request);
      toast.success("Item updated!");
    } catch (err) {
      toast.error("Unable to update item");
    }

    setLoading(false);
  };

  const handleSetCostPerUnit = (value) => {
    const cost = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setCostPerUnit(cost);
  };

  const handleAddProvider = (data) => {
    const newProviders = [...providers];

    newProviders.push(data);

    setCreateProviderModalOpen(false);
    setProviders(newProviders);
  };

  const handleAddLocationItem = (data) => {
    const newLocationItems = [...locationItems];

    newLocationItems.push(data);

    setCreateLocationModalOpen(false);
    setLocationItems(newLocationItems);
  };

  const handleAddBrand = (data) => {
    const newBrands = [...brands];

    newBrands.push(data);

    setCreateBrandModalOpen(false);
    setBrands(newBrands);
  };

  const handleAddTag = (data) => {
    const newTags = [...tags];

    newTags.push(data);

    setCreateTagModalOpen(false);
    setTags(newTags);
  };

  const updateItemPhoto = async (imageList, addUpdateIndex) => {
    const formData = new FormData();

    formData.append("photo", imageList[0].file);
    formData.append("itemId", itemId);

    try {
      await api.uploadItemPhoto(formData);

      //save whatever other data we have
      //handleSubmit(onSubmit)();

      navigate(0);
    } catch (error) {
      toast.error("Unable to update photo");
    }
  };

  const handleDeleteLocationItem = async () => {
    try {
      await api.deleteLocationItem(locationItemSelected.id);
      toast.success("Location item deleted!");
      handleToggleDeleteLocationItemModal();

      const newLocationItems = locationItems.filter(
        (locationItem) => locationItem.id !== locationItemSelected.id
      );

      setLocationItems(newLocationItems);
    } catch (err) {
      toast.error("Unable to delete location item");
    }
  };

  const handleUpdateLocationItemStatus = async (status) => {
    const request = {
      action: "confirm",
    };

    try {
      await api.updateLocationItem(locationItemSelected.id, request);
      toast.success("Location Item Updated!");
      handleToggleConfirmItemModal();

      const newLocationItems = [...locationItems];
      const index = newLocationItems.findIndex(
        (locationItem) => locationItem.id === locationItemSelected.id
      );

      newLocationItems[index].status = status;

      setLocationItems(newLocationItems);
    } catch (err) {
      toast.error("Unable to update location item status");
    }
  };

  const handleAdjustLocationItemQuantity = async (quantity) => {
    const request = {
      action: "adjust",
      quantity,
    };

    try {
      await api.updateLocationItem(locationItemSelected.id, request);
      toast.success("Location Item Updated!");
      handleToggleAdjustItemModal();

      const newLocationItems = [...locationItems];
      const index = newLocationItems.findIndex(
        (locationItem) => locationItem.id === locationItemSelected.id
      );

      newLocationItems[index].quantity = quantity;

      setLocationItems(newLocationItems);
    } catch (err) {
      toast.error("Unable to adjust quantity");
    }
  };

  const handleMoveItem = async (quantity, destinationLocationId) => {
    quantity = parseInt(quantity);
    const newLocationItems = [...locationItems];
    const index = newLocationItems.findIndex(
      (locationItem) => locationItem.id === locationItemSelected.id
    );

    const adjustedQuantity = newLocationItems[index].quantity - quantity;

    const request = {
      action: "move",
      destinationLocationId,
      adjustedQuantity,
      movingQuantity: quantity,
    };

    try {
      await api.updateLocationItem(locationItemSelected.id, request);
      toast.success("Item moved!");
      handleToggleMoveItemModal();

      navigate(0);
    } catch (err) {
      toast.error("Unable to move item");
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
                Item Details
              </h1>
              <p className="mt-1 text-md text-gray-500">
                You can update any information associated with this item.
              </p>
            </div>
          </div>

          <div
            className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1
                          sm:grid-cols-1 xs:grid-cols-1 gap-x-40 gap-y-10 pb-12"
          >
            <div>
              <div className="text-lg font-semibold text-gray-600 mb-4">
                Basic Information
              </div>
              <div>
                <label
                  htmlFor="itemName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name{" "}
                  <span className=" text-red-400 text-sm">
                    (Must be unique)
                  </span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    name="itemName"
                    id="itemName"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                  {itemAlreadyExistsId && (
                    <p className="text-red-500 text-sm font-semibold mt-2">
                      Item already exists. Check it out here:{" "}
                      {itemAlreadyExistsId}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="itemDescription"
                  className="block text-sm text-gray-500"
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
                                        focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4 grid xl:grid-cols-2 lg:grid-cols-2 sm:grid-cols-2 xs:grid-cols-2 gap-6">
                <div className="">
                  <Listbox
                    value={measureUnitSelected}
                    onChange={setMeasureUnitSelected}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className="block text-sm font-medium text-gray-700 w-full">
                          Measure By
                        </Listbox.Label>
                        <div className="relative mt-1">
                          <Listbox.Button
                            className="relative w-full cursor-default rounded-md border
                                                                            border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                            shadow-sm focus:border-sky-500 focus:outline-none
                                                                            focus:ring-1 focus:ring-sky-500 sm:text-sm"
                          >
                            <span className="block truncate">
                              {measureUnitSelected
                                ? measureUnitSelected.name
                                : "Select measurement"}
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
                              className="absolute z-10 mt-1 max-h-72 w-full overflow-auto
                                        rounded-md bg-white py-1 text-base shadow-lg ring-1
                                        ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            >
                              {measureUnits.map((measureUnit) => (
                                <Listbox.Option
                                  key={measureUnit.id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "text-white bg-red-600"
                                        : "text-gray-900",
                                      "relative cursor-default select-none py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={measureUnit}
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
                                        {measureUnit.name}
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
                  <label
                    htmlFor="costPerUnit"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cost per Unit
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={costPerUnit}
                      onChange={(e) => handleSetCostPerUnit(e.target.value)}
                      name="costPerUnit"
                      id="costPerUnit"
                      className="block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Listbox value={areaSelected} onChange={setAreaSelected}>
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-sm font-medium text-gray-700 w-full">
                        Area
                      </Listbox.Label>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border
                                                                            border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                            shadow-sm focus:border-sky-500 focus:outline-none
                                                                            focus:ring-1 focus:ring-sky-500 sm:text-sm"
                        >
                          <span className="block truncate">
                            {areaSelected ? areaSelected.name : "Select area"}
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
                            {areas.map((area) => (
                              <Listbox.Option
                                key={area.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={area}
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
                                      {area.name}
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
            <div>
              <div className="text-lg font-semibold text-gray-600 mb-4">
                Upload Photo
              </div>

              {/* Mobile */}
              <div className="mt-1 lg:hidden">
                <div className="flex items-center">
                  <div
                    className="inline-block h-48 w-48 flex-shrink-0 overflow-hidden rounded-full"
                    aria-hidden="true"
                  >
                    {itemPhoto ? (
                      <img
                        className="h-full w-full rounded-full"
                        src={itemPhoto}
                        alt=""
                      />
                    ) : (
                      <span className="h-28 w-28 overflow-hidden rounded-full bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="ml-5 rounded-md shadow-sm">
                    <ImageUploading
                      value={itemImages}
                      acceptType={["jpg", "gif", "png", "jpeg"]}
                      onChange={updateItemPhoto}
                      maxNumber={1}
                      dataURLKey="data_url"
                    >
                      {({ onImageUpload }) => (
                        <div
                          onClick={onImageUpload}
                          className="group relative flex items-center justify-center
                                                rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2
                                                    focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50"
                        >
                          <label
                            htmlFor="mobile-user-photo"
                            className="pointer-events-none relative text-sm font-medium
                                                    leading-4 text-gray-700"
                          >
                            <span>Change</span>
                            <span className="sr-only"> user photo</span>
                          </label>
                        </div>
                      )}
                    </ImageUploading>
                  </div>
                </div>
              </div>

              {/* desktop */}
              <div className="relative hidden overflow-hidden rounded-full lg:block">
                <div className="flex items-center">
                  <div
                    className="inline-block h-48 w-48 flex-shrink-0 overflow-hidden rounded-full"
                    aria-hidden="true"
                  >
                    {itemPhoto ? (
                      <img
                        className="h-full w-full rounded-full"
                        src={itemPhoto}
                        alt=""
                      />
                    ) : (
                      <span className="h-28 w-28 overflow-hidden rounded-full bg-gray-100">
                        <svg
                          className="h-full w-full text-gray-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="ml-5 rounded-md shadow-sm">
                    <ImageUploading
                      value={itemImages}
                      acceptType={["jpg", "gif", "png", "jpeg"]}
                      onChange={updateItemPhoto}
                      maxNumber={1}
                      dataURLKey="data_url"
                    >
                      {({ onImageUpload }) => (
                        <div
                          onClick={onImageUpload}
                          className="group relative flex items-center justify-center
                                                rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2
                                                    focus-within:ring-sky-500 focus-within:ring-offset-2 hover:bg-gray-50"
                        >
                          <label
                            htmlFor="mobile-user-photo"
                            className="pointer-events-none relative text-sm font-medium
                                                    leading-4 text-gray-700"
                          >
                            <span>Change</span>
                            <span className="sr-only"> user photo</span>
                          </label>
                        </div>
                      )}
                    </ImageUploading>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4">
                  <div className="text-lg font-semibold text-gray-600">
                    Tags
                  </div>
                  <p className="text-gray-500 text-sm">
                    You don't see the tag you are looking for? Create a new one{" "}
                    <button
                      onClick={() => handleToggleCreateTagModal()}
                      className="text-blue-500"
                    >
                      here
                    </button>
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      onClick={() => handleToggleTag(tag)}
                      className={`${
                        tag.selected
                          ? "ring-1 ring-offset-1 ring-rose-500 text-white bg-rose-500 hover:bg-rose-600"
                          : "hover:bg-gray-50"
                      }
                                rounded-md border border-gray-200 cursor-pointer py-3 px-3 flex items-center justify-center text-xs uppercase hover:bg-gray-50
                            `}
                    >
                      {tag.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-300 py-2"></div>

          <div>
            <div className="mb-6">
              <div className="text-lg font-semibold text-gray-600">
                Providers
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Select which providers you are using for this product. You don't
                see the provider you are looking for? Create a new one{" "}
                <button
                  onClick={() => handleToggleCreateProviderModal()}
                  className="text-blue-500"
                >
                  here
                </button>
              </p>
            </div>
            <div className="flex flex-wrap gap-4 pb-10">
              {providers.map((provider, index) => (
                <div
                  key={index}
                  onClick={() => handleToggleProvider(provider)}
                  className={`${
                    provider.selected
                      ? "ring-1 ring-offset-1 ring-rose-500 text-white bg-rose-500 hover:bg-rose-600"
                      : "hover:bg-gray-50"
                  }
                                rounded-md border border-gray-200 cursor-pointer py-3 px-3 flex items-center justify-center text-xs uppercase hover:bg-gray-50
                            `}
                >
                  {provider.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end my-4">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-md font-medium
                            text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                              focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => updateItem()}
              className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-md font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
            >
              Update Item
            </button>
          </div>

          <div className="w-full border-t border-gray-300 py-2 mt-8"></div>

          <div>
            <div className="text-lg font-semibold text-gray-600">Locations</div>
            <p className="mt-1 text-sm text-gray-500">
              Add quantities and minimum required values for the locations you
              want. You can also specify at which quantity the system will alert
              you.
            </p>

            <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
              <div
                className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10
                              lg:grid-cols-4 lg:gap-x-8"
              >
                {locationItems.map((locationItem) => (
                  <div
                    key={locationItem.id}
                    className="group relative flex flex-col overflow-hidden
                               rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="flex flex-1 flex-col space-y-2 p-4">
                      {/* <h3 className="text-sm font-medium text-gray-900">
                        {locationItem.location?.name}
                      </h3> */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-gray-900">
                          {locationItem.location?.name}
                        </h2>
                        <button
                          type="button"
                          className="-mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 border border-gray-400 hover:bg-gray-100"
                          onClick={() =>
                            handleToggleDeleteLocationItemModal(locationItem)
                          }
                        >
                          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                      <div>
                        <div className="flex justify-between gap-x-4 py-1">
                          <dt className="text-gray-500">Quantity</dt>
                          <dd className="text-gray-700 flex gap-2">
                            <div
                              className={`flex-none rounded-full ${
                                locationItem.status === "C"
                                  ? "bg-green-400/10 p-1 text-green-400"
                                  : "bg-red-400/10 p-1.5 text-red-400"
                              }`}
                            >
                              <div className="h-2 w-2 rounded-full bg-current" />
                            </div>
                            <div>{locationItem.quantity || 0}</div>
                          </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-1">
                          <dt className="text-gray-500">Minimum required</dt>
                          <dd className="text-gray-700">
                            {locationItem.minimumRequired || 0}
                          </dd>
                        </div>
                        <div className="flex justify-between gap-x-4 py-1">
                          <dt className="text-gray-500">Alert at</dt>
                          <dd className="text-gray-700">
                            {locationItem.alertAt || 0}
                          </dd>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 mb-4">
                      <div className="mt-3">
                        <button
                          onClick={() =>
                            handleToggleMoveItemModal(locationItem)
                          }
                          className="w-full relative flex items-center justify-center rounded-md 
                                                    border border-transparent bg-blue-500 px-8 py-2 text-sm
                                                    font-medium text-white hover:bg-blue-600"
                        >
                          Move
                        </button>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() =>
                            handleToggleAdjustItemModal(locationItem)
                          }
                          className="w-full relative flex items-center justify-center rounded-md 
                                                    border border-transparent bg-gray-100 px-8 py-2 text-sm
                                                    font-medium text-gray-900 hover:bg-gray-200"
                        >
                          Adjust
                        </button>
                      </div>
                      <div className="mt-3">
                        <button
                          disabled={locationItem.status === "C"}
                          onClick={() =>
                            handleToggleConfirmItemModal(locationItem)
                          }
                          className="w-full relative flex items-center justify-center rounded-md 
                                                    border border-transparent bg-gray-100 px-8 py-2 text-sm
                                                    font-medium text-gray-900 hover:bg-gray-200"
                        >
                          Confirm
                        </button>
                      </div>
                      <div className="mt-3">
                        <button
                          className="w-full relative flex items-center justify-center rounded-md 
                                                    border border-transparent bg-gray-100 px-8 py-2 text-sm
                                                    font-medium text-gray-900 hover:bg-gray-200"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-300 py-3"></div>

          <div className="mt-2">
            <div className="text-lg font-semibold text-gray-600">
              Item Activity
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Checkout the item activity across all locations.
            </p>
            <div className="mt-2 flow-root">
              {itemActivities.length === 0 && (
                <div className="flex justify-center items-center mt-16">
                  <div className="text-gray-500 text-lg font-medium">
                    No activity yet
                  </div>
                </div>
              )}

              {itemActivities.length > 0 && (
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm
                                        font-semibold text-gray-900 sm:pl-0"
                          >
                            User
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {itemActivities.map((activity) => (
                          <tr key={activity.id}>
                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                              <div className="flex items-center">
                                <div className="h-11 w-11 flex-shrink-0">
                                  <img
                                    className="h-11 w-11 rounded-full"
                                    src={activity.user?.profile?.avatar}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-3">
                                  <div className=" text-gray-700">
                                    {activity.user.first_name}{" "}
                                    {activity.user.last_name}
                                  </div>
                                  <div className="mt-1 text-gray-500">
                                    {activity.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-700">
                              <div
                                className={`inline-flex items-center rounded-md
                                            px-2 py-1 text-xs font-medium ring-1 ring-inset
                                        ${
                                          activity.activity_type === "A" &&
                                          "text-green-700 bg-green-50 ring-green-600/20"
                                        }
                                        ${
                                          activity.activity_type === "C" &&
                                          "text-blue-700 bg-blue-50 ring-blue-600/20"
                                        }
                                        ${
                                          activity.activity_type === "S" &&
                                          "text-red-700 bg-red-50 ring-red-600/20"
                                        }
                                        ${
                                          activity.activity_type === "M" &&
                                          "text-fuchsia-700 bg-fuchsia-50 ring-fuchsia-600/20"
                                        } `}
                              >
                                {activity.activity_type === "C" && "Confirmed"}
                                {activity.activity_type === "A" && "Added"}
                                {activity.activity_type === "M" && "Moved"}
                                {activity.activity_type === "S" && "Removed"}
                              </div>

                              {activity.activity_type === "M" && (
                                <div className="flex gap-2 mt-2">
                                  <div>{activity.moved_from?.name}</div>
                                  <div>{"->"}</div>
                                  <div>{activity.moved_to?.name}</div>
                                </div>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-700 font-medium">
                              {activity.quantity}
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                              <ReactTimeAgo
                                date={new Date(activity.timestamp)}
                                locale="en-US"
                                timeStyle="twitter"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!loading && totalItemActivities > 100 && (
                <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
                  <div>
                    <Pagination
                      innerClass="pagination pagination-custom"
                      activePage={currentPage}
                      hideDisabled
                      itemClass="page-item page-item-custom"
                      linkClass="page-link page-link-custom"
                      itemsCountPerPage={100}
                      totalItemsCount={totalItemActivities}
                      pageRangeDisplayed={3}
                      onChange={handlePageChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {isCreateProviderModalOpen && (
        <CreateProviderModal
          isOpen={isCreateProviderModalOpen}
          handleClose={handleToggleCreateProviderModal}
          addProvider={handleAddProvider}
        />
      )}

      {isCreateLocationModalOpen && (
        <CreateLocationModal
          isOpen={isCreateLocationModalOpen}
          handleClose={handleToggleCreateLocationModal}
          addLocationItem={handleAddLocationItem}
        />
      )}

      {isCreateBrandModalOpen && (
        <CreateBrandModal
          isOpen={isCreateBrandModalOpen}
          handleClose={handleToggleCreateBrandModal}
          addBrand={handleAddBrand}
        />
      )}

      {isCreateTagModalOpen && (
        <CreateTagModal
          isOpen={isCreateTagModalOpen}
          handleClose={handleToggleCreateTagModal}
          addTag={handleAddTag}
        />
      )}

      {isDeleteLocationItemModalOpen && (
        <DeleteLocationItemModal
          isOpen={isDeleteLocationItemModalOpen}
          handleClose={handleToggleDeleteLocationItemModal}
          quantityToDisplay={locationItemSelected?.quantity}
          locationName={locationItemSelected?.location.name}
          deleteLocationItem={handleDeleteLocationItem}
        />
      )}

      {isConfirmItemModalOpen && (
        <ConfirmItemModal
          isOpen={isConfirmItemModalOpen}
          handleClose={handleToggleConfirmItemModal}
          updateItemStatus={handleUpdateLocationItemStatus}
          quantityToDisplay={locationItemSelected?.quantity}
          locationSelected={locationItemSelected?.location}
        />
      )}

      {isAdjustItemModalOpen && (
        <AdjustItemModal
          isOpen={isAdjustItemModalOpen}
          handleClose={handleToggleAdjustItemModal}
          quantityToDisplay={locationItemSelected?.quantity}
          locationSelected={locationItemSelected?.location}
          adjustItemQuantity={handleAdjustLocationItemQuantity}
        />
      )}

      {isMoveItemModalOpen && (
        <MoveItemModal
          isOpen={isMoveItemModalOpen}
          handleClose={handleToggleMoveItemModal}
          quantityToDisplay={locationItemSelected?.quantity}
          moveItem={handleMoveItem}
          locationSelected={locationItemSelected?.location}
        />
      )}
    </AnimatedPage>
  );
};

export default ItemDetails;
