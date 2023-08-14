import { useState, useEffect, Fragment } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";

import * as api from "./apiService";
import { toast } from "react-toastify";

const CreateLocationModal = ({ isOpen, handleClose, addLocationItem }) => {
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createLocation = async () => {
    if (locationName.length === 0) {
      alert("Enter a location name");
    }

    setLoading(true);

    const request = {
      name: locationName,
      description: description,
    };

    try {
      const { data } = await api.createLocation(request);

      const locationItem = {
        location: data,
        quantity: "",
        minimumRequired: "",
        alertAt: "",
        brandsSelected: [],
        groups: [],
      };

      addLocationItem(locationItem);
    } catch (err) {
      toast.error("Unable to create provider");
    }

    setLoading(false);
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2">
        <div className="">
          <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-xl m-auto flex justify-center text-center font-medium leading-6 text-gray-900 relative top-1"
            >
              Create Location
            </Dialog.Title>

            <div className="mt-8 px-2">
              <div>
                <label
                  htmlFor="locationName"
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
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    name="locationName"
                    id="locationName"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
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
            </div>
          </div>
        </div>
        <div className="mt-12 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            disabled={loading}
            onClick={() => createLocation()}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Create
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleClose}
            className="mt-3 inline-flex w-full justify-center rounded-md border
                                 border-gray-300 bg-white px-4 py-2 text-base font-medium
                                  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                   focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalFrame>
  );
};

export default CreateLocationModal;
