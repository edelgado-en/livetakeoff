import { useState, useEffect, Fragment } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import ImageUploading from "react-images-uploading";

import * as api from "./apiService";
import { toast } from "react-toastify";

import { CheckIcon } from "@heroicons/react/outline";

const helpTypes = [
  { id: "F", name: "File" },
  { id: "P", name: "Photo" },
  { id: "U", name: "URL" },
];

const accessLevels = [
  { id: "A", name: "All" },
  { id: "C", name: "Customer" },
  { id: "E", name: "External Project Manager" },
  { id: "P", name: "Internal Project Manager" },
  { id: "I", name: "Internal Coordinator" },
  { id: "D", name: "Admin" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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

const EditHelpFileModal = ({
  isOpen,
  handleClose,
  editFile,
  fileToBeEdited,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [accessLevelSelected, setAccessLevelSelected] = useState();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(fileToBeEdited.name);
    setDescription(fileToBeEdited.description);
    setAccessLevelSelected(
      accessLevels.find((level) => level.id === fileToBeEdited.access_level)
    );
  }, []);

  const editHelpFile = async () => {
    if (name.length === 0) {
      alert("Enter a help file name");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("access_level", accessLevelSelected.id);

    try {
      const { data } = await api.editHelpFile(fileToBeEdited.id, formData);
      editFile(data);
    } catch (err) {
      toast.error("Unable to edit help file");
    }

    setLoading(false);
  };

  const handleAccessLevelSelectedChange = (value) => {
    setAccessLevelSelected(value);
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
              Edit Training File
            </Dialog.Title>

            <div className="mt-8 px-2">
              <div>
                <label
                  htmlFor="brandName"
                  className="block text-md font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="helpFileName"
                    id="helpFileName"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="itemDescription"
                  className="block text-md font-medium text-gray-700"
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
              <div className="mt-4">
                <Listbox
                  value={accessLevelSelected}
                  onChange={handleAccessLevelSelectedChange}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-md font-medium text-gray-700">
                        Access Level
                      </Listbox.Label>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border
                                                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                        shadow-sm focus:border-sky-500 focus:outline-none
                                                                        focus:ring-1 focus:ring-sky-500 sm:text-md"
                        >
                          <span className="block truncate">
                            {accessLevelSelected
                              ? accessLevelSelected.name
                              : "Select access level"}
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
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-lg"
                          >
                            {accessLevels.map((accessLevel) => (
                              <Listbox.Option
                                key={accessLevel.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={accessLevel}
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
                                      {accessLevel.name}
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
          </div>
        </div>
        <div className="mt-32 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            disabled={loading}
            onClick={() => editHelpFile()}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Edit
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

export default EditHelpFileModal;
