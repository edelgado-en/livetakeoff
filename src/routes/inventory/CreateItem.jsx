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

const CreateItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [createItemMessage, setCreateItemMessage] = useState(null);

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

  useEffect(() => {
    getItemFormInfo();
  }, []);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getItemLookup();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [itemName]);

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

      setLocationItems(locationItems);
    } catch (err) {
      console.log(err);
      toast.error("Unable to get item form info.");
    }

    setLoading(false);
  };

  const addAnotherItem = () => {
    setItemName("");
    setDescription("");
    setAreaSelected(null);
    setMeasureUnitSelected(null);
    setCostPerUnit("");
    setCreateItemMessage(null);
    setItemImages([]);
    setLocationItems([]);
    setLoading(false);

    const locationItems = locations.map((location) => {
      return {
        location,
        quantity: "",
        minimumRequired: "",
        alertAt: "",
        brandsSelected: [],
        groups: location.groups,
      };
    });

    setLocationItems(locationItems);
  };

  const onChangePhoto = (imageList, addUpdateIndex) => {
    setItemImages(imageList);
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

  const setLocationItemBrandSelected = (selectedBrands, locationItem) => {
    const newLocationItems = [...locationItems];
    const index = newLocationItems.findIndex(
      (item) => item.location.id === locationItem.location.id
    );

    newLocationItems[index].brandsSelected = selectedBrands;

    setLocationItems(newLocationItems);
  };

  const setLocationItemQuantity = (quantity, locationItem) => {
    const value = quantity.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    const newLocationItems = [...locationItems];
    const index = newLocationItems.findIndex(
      (item) => item.location.id === locationItem.location.id
    );

    newLocationItems[index].quantity = value;

    setLocationItems(newLocationItems);
  };

  const setLocationItemMinimumRequired = (minimumRequired, locationItem) => {
    const value = minimumRequired
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

    const newLocationItems = [...locationItems];
    const index = newLocationItems.findIndex(
      (item) => item.location.id === locationItem.location.id
    );

    newLocationItems[index].minimumRequired = value;

    setLocationItems(newLocationItems);
  };

  const setLocationItemAlertAt = (alertAt, locationItem) => {
    const value = alertAt.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    const newLocationItems = [...locationItems];
    const index = newLocationItems.findIndex(
      (item) => item.location.id === locationItem.location.id
    );

    newLocationItems[index].alertAt = value;

    setLocationItems(newLocationItems);
  };

  const createItem = async () => {
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

    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("areaId", areaSelected.id);
    formData.append("measureUnitId", measureUnitSelected.id);
    formData.append("costPerUnit", costPerUnit);
    formData.append("tagIds", JSON.stringify(selectedTagIds));
    formData.append("providerIds", JSON.stringify(selectedProviderIds));
    formData.append("locationItems", JSON.stringify(locationItemsWithQuantity));

    itemImages.forEach((image) => {
      if (image.file.size < 10000000) {
        // less than 10MB
        formData.append("photo", image.file);
      }
    });

    setLoading(true);

    try {
      await api.createItem(formData);

      setCreateItemMessage("Item created!");
    } catch (err) {
      toast.error("Unable to create item");
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

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && createItemMessage && (
        <div className="mx-auto max-w-lg px-4 pb-16 lg:pb-12 mt-40 text-center">
          <div className=" flex justify-center">
            <CheckCircleIcon
              className="h-20 w-20 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="">
            <p className="text-xl font-medium text-gray-900 mt-2">
              Item created!
            </p>
          </div>
          <div className=" mt-6 flex justify-center gap-6">
            <button
              type="button"
              onClick={() => navigate("/inventory")}
              className="inline-flex items-center rounded-md border
                                         border-gray-300 bg-white px-3 py-2 text-sm leading-4
                                          text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                           focus:ring-red-500 focus:ring-offset-2"
            >
              Back to Inventory
            </button>
            <button
              type="button"
              onClick={() => addAnotherItem()}
              className="inline-flex justify-center rounded-md
                                    border border-transparent bg-red-600 py-2 px-4
                                    text-sm font-medium text-white shadow-sm hover:bg-red-600
                                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Create another Item
            </button>
          </div>
        </div>
      )}

      {!loading && createItemMessage == null && (
        <main className="mx-auto max-w-7xl px-4 pb-16 lg:pb-12">
          <div className="space-y-6 mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-600">
                Create Item
              </h1>
              <p className="mt-1 text-md text-gray-500">
                Let’s get started by filling in the information below to create
                a new inventory item.
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
                  <span className=" text-gray-400 text-sm">
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
              <ImageUploading
                acceptType={["jpg", "gif", "png", "jpeg"]}
                value={itemImages}
                onChange={onChangePhoto}
                maxNumber={1}
                dataURLKey="data_url"
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                  errors,
                }) => (
                  <>
                    {imageList.length === 0 && (
                      <div
                        className="flex w-full justify-center rounded-md border-2 border-dashed
                                            border-gray-300 px-6 pt-5 pb-6 m-auto"
                        {...dragProps}
                      >
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-32 w-32 text-gray-300"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4
                                                    4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div
                            className="flex text-sm text-gray-600"
                            onClick={onImageUpload}
                          >
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-red-600
                                                                focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500
                                                                focus-within:ring-offset-2 hover:text-red-500"
                            >
                              <span>Upload a file</span>
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB. 10 photos max
                          </p>
                        </div>
                      </div>
                    )}

                    {errors && (
                      <div className="text-red-500 font-medium mt-6 m-auto text-center text-sm">
                        {errors.acceptType && (
                          <span>Your selected file type is not allow</span>
                        )}
                      </div>
                    )}

                    <div className="w-full">
                      {imageList.map((image, index) => (
                        <div
                          key={index}
                          className="py-4 flex flex-col items-center"
                        >
                          <div className="flex-shrink-0 cursor-pointer">
                            <img
                              className="h-60 w-full rounded-lg"
                              src={image["data_url"]}
                              alt=""
                            />
                          </div>
                          <div className="w-full flex justify-end text-gray-500 text-sm pt-2">
                            <PencilIcon
                              onClick={() => onImageUpdate(index)}
                              className="flex-shrink-0 h-6 w-6 mr-3 cursor-pointer"
                            />
                            <TrashIcon
                              onClick={() => onImageRemove(index)}
                              className="flex-shrink-0 h-6 w-6 mr-2 cursor-pointer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </ImageUploading>

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

          <div className="w-full border-t border-gray-300 py-2"></div>

          <div>
            <div className="text-lg font-semibold text-gray-600">Locations</div>
            <p className="mt-1 text-sm text-gray-500">
              Add quantities and minimum required values for the locations you
              want. You can also specify at which quantity the system will alert
              you.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              You don't see the location you are looking for? Create a new one{" "}
              <button
                className="text-blue-500"
                onClick={() => handleToggleCreateLocationModal()}
              >
                here
              </button>
            </p>
            <div className="mt-6 flow-root">
              <div className=" overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300 table-auto">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-600 sm:pl-0"
                        >
                          Location
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-600"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-600"
                        >
                          Min Required
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-600"
                        >
                          Alert At
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-600"
                        >
                          Brand
                          <span className="text-gray-500 font-normal ml-2">
                            Create new brand{" "}
                            <button
                              onClick={() => handleToggleCreateBrandModal()}
                              className="text-blue-500"
                            >
                              here
                            </button>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {locationItems.map((locationItem, index) => (
                        <tr key={index}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">
                            <div className="font-medium text-gray-700">
                              {locationItem.location.name}
                            </div>
                            <div className="flex justify-start my-2 gap-2">
                              {locationItem.groups?.map((group) => (
                                <div
                                  key={group.id}
                                  className={`text-xs inline-block rounded-md px-2 py-1 border bg-gray-100 border-gray-200 text-gray-500`}
                                >
                                  {group.name}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input
                              type="text"
                              value={locationItem.quantity}
                              onChange={(e) =>
                                setLocationItemQuantity(
                                  e.target.value,
                                  locationItem
                                )
                              }
                              className="block w-16 rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input
                              type="text"
                              value={locationItem.minimumRequired}
                              onChange={(e) =>
                                setLocationItemMinimumRequired(
                                  e.target.value,
                                  locationItem
                                )
                              }
                              className="block w-16 rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <input
                              type="text"
                              value={locationItem.alertAt}
                              onChange={(e) =>
                                setLocationItemAlertAt(
                                  e.target.value,
                                  locationItem
                                )
                              }
                              className="block w-16 rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                            />
                          </td>
                          <td
                            className="relative whitespace-nowrap py-4 pl-3 pr-4 text-sm
                                         font-medium sm:pr-0"
                          >
                            <Listbox
                              value={locationItem.brandsSelected}
                              multiple
                              onChange={(brands) =>
                                setLocationItemBrandSelected(
                                  brands,
                                  locationItem
                                )
                              }
                            >
                              {({ open }) => (
                                <>
                                  <div className="relative mt-1">
                                    <Listbox.Button
                                      className="relative w-52 cursor-default rounded-md border
                                                border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                shadow-sm focus:border-sky-500 focus:outline-none
                                                focus:ring-1 focus:ring-sky-500 sm:text-sm"
                                    >
                                      <span className="block truncate">
                                        {locationItem.brandsSelected.length >
                                          0 &&
                                          locationItem.brandsSelected
                                            .map((brand) => brand.name)
                                            .join(", ")}

                                        {locationItem.brandsSelected.length ===
                                          0 && "Select brands"}
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
                                        className="absolute z-10 mt-1 max-h-96 w-52 overflow-auto
                                                    rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                    ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                      >
                                        {brands.map((brand) => (
                                          <Listbox.Option
                                            key={brand.id}
                                            className={({ active }) =>
                                              classNames(
                                                active
                                                  ? "text-white bg-red-600"
                                                  : "text-gray-900",
                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                              )
                                            }
                                            value={brand}
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
                                                  {brand.name}
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-gray-300 py-3"></div>

          <div className="flex justify-end my-6">
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
              onClick={() => createItem()}
              className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-md font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
            >
              Create Item
            </button>
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
    </AnimatedPage>
  );
};

export default CreateItem;
