import { useState, useEffect, Fragment } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { PlusIcon, CheckIcon, CheckCircleIcon } from "@heroicons/react/outline";

import { toast } from "react-toastify";

import * as api from "./apiService";

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

const AddVendorModal = ({ isOpen, handleClose, addVendor }) => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [projectManagers, setProjectManagers] = useState([]);
  const [selectedProjectManager, setSelectedProjectManager] = useState(null);

  const [vendorSearchTerm, setVendorSearchTerm] = useState("");
  const [projectManagerSearchTerm, setProjectManagerSearchTerm] = useState("");

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchVendors();
    }, 200);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [vendorSearchTerm]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchUsers();
    }, 200);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [projectManagerSearchTerm]);

  const searchVendors = async () => {
    try {
      const { data } = await api.getVendors({ name: vendorSearchTerm });

      setVendors(data.results);
    } catch (err) {
      toast.error("Unable to fetch vendors");
    }
  };

  const searchUsers = async () => {
    const request = {
      name: projectManagerSearchTerm,
      vendor_id: selectedVendor ? selectedVendor.id : null,
    };

    try {
      const { data } = await api.searchUsers(request);

      setProjectManagers(data.results);
    } catch (err) {
      toast.error("Unable to fetch project managers");
    }
  };

  const associateVendor = () => {
    if (!selectedVendor || !selectedProjectManager) {
      alert("Please select a vendor and a project manager");
      return;
    }

    addVendor(selectedProjectManager.id);
  };

  const handleVendorChange = async (vendor) => {
    setSelectedVendor(vendor);
    const request = {
      name: projectManagerSearchTerm,
      vendor_id: vendor ? vendor.id : null,
    };

    try {
      const { data } = await api.searchUsers(request);

      setProjectManagers(data.results);
    } catch (err) {
      toast.error("Unable to fetch project managers");
    }
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2 px-2">
        <div className=" h-96">
          <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-xl m-auto flex justify-center text-center font-medium leading-6 text-gray-900 relative top-1"
            >
              Associate Vendor
            </Dialog.Title>

            <div className="mt-8 max-w-sm">
              <Listbox
                value={selectedVendor}
                onChange={(vendor) => handleVendorChange(vendor)}
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="block text-sm font-medium text-gray-700">
                      Vendors
                    </Listbox.Label>
                    <div className="relative mt-1">
                      <Listbox.Button
                        className="relative w-full cursor-default rounded-md border
                                                            border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                            shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1
                                                                focus:ring-sky-500 sm:text-sm"
                      >
                        <span className="flex items-center">
                          <span className="ml-3 block truncate">
                            {selectedVendor
                              ? selectedVendor.name
                              : "Select Vendor"}
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
                          className="absolute z-10 mt-1 max-h-80 w-full overflow-auto
                                                            rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black
                                                            ring-opacity-5 focus:outline-none sm:text-sm"
                        >
                          <div className="relative">
                            <div className="sticky top-0 z-20  px-1">
                              <div className="mt-1 block  items-center">
                                <input
                                  type="text"
                                  name="search"
                                  id="search"
                                  value={vendorSearchTerm}
                                  onChange={(e) =>
                                    setVendorSearchTerm(e.target.value)
                                  }
                                  className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 sm:text-lg
                                                                            border-gray-300 rounded-md"
                                />
                                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                  {vendorSearchTerm && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-6 w-6 text-blue-500 mr-1"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                      onClick={() => {
                                        setVendorSearchTerm("");
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
                                  <div className="flex items-center">
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "ml-3 block truncate"
                                      )}
                                    >
                                      {vendor.name}
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
            </div>

            <div className="mt-8 max-w-sm">
              {selectedVendor && (
                <Listbox
                  value={selectedProjectManager}
                  onChange={(person) => setSelectedProjectManager(person)}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-sm font-medium text-gray-700">
                        Project Managers
                      </Listbox.Label>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border
                                                                border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1
                                                                    focus:ring-sky-500 sm:text-sm"
                        >
                          <span className="flex items-center">
                            {selectedProjectManager && (
                              <>
                                <img
                                  src={selectedProjectManager.profile?.avatar}
                                  alt=""
                                  className="h-6 w-6 flex-shrink-0 rounded-full"
                                />
                                <span
                                  className={classNames(
                                    selectedProjectManager.availability ===
                                      "available"
                                      ? "bg-green-400"
                                      : selectedProjectManager.availability ===
                                        "available_soon"
                                      ? "bg-yellow-400"
                                      : "bg-red-400",
                                    "inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2"
                                  )}
                                />
                              </>
                            )}

                            <span className="ml-3 block truncate">
                              {selectedProjectManager
                                ? selectedProjectManager.first_name +
                                  " " +
                                  selectedProjectManager.last_name
                                : "Select Project Manager"}
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
                            className="absolute z-10 mt-1 max-h-80 w-full overflow-auto
                                                                rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black
                                                                ring-opacity-5 focus:outline-none sm:text-sm"
                          >
                            <div className="relative">
                              <div className="sticky top-0 z-20  px-1">
                                <div className="mt-1 block  items-center">
                                  <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    value={projectManagerSearchTerm}
                                    onChange={(e) =>
                                      setProjectManagerSearchTerm(
                                        e.target.value
                                      )
                                    }
                                    className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 sm:text-lg
                                                                            border-gray-300 rounded-md"
                                  />
                                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                    {projectManagerSearchTerm && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-500  mr-1"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        onClick={() => {
                                          setProjectManagerSearchTerm("");
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

                            {projectManagers.map((projectManager) => (
                              <Listbox.Option
                                key={projectManager.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={projectManager}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      <img
                                        src={projectManager.profile?.avatar}
                                        alt=""
                                        className="h-6 w-6 flex-shrink-0 rounded-full"
                                      />
                                      {projectManager.first_name !==
                                        "Unassign" && (
                                        <span
                                          className={classNames(
                                            projectManager.availability ===
                                              "available"
                                              ? "bg-green-400"
                                              : projectManager.availability ===
                                                "available_soon"
                                              ? "bg-yellow-400"
                                              : "bg-red-400",
                                            "inline-block h-2 w-2 flex-shrink-0 rounded-full ml-2"
                                          )}
                                        />
                                      )}

                                      <span
                                        className={classNames(
                                          selected
                                            ? "font-semibold"
                                            : "font-normal",
                                          "ml-3 block truncate"
                                        )}
                                      >
                                        {projectManager.first_name +
                                          " " +
                                          projectManager.last_name}
                                      </span>
                                    </div>
                                    {/* <div className="text-xs flex">
                                                        <div className="w-20"></div>
                                                        <div>
                                                            This is the about section talking about the availability and specialties and more...
                                                        </div>
                                                    </div> */}

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
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            disabled={!selectedVendor || !selectedProjectManager}
            onClick={() => associateVendor()}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Associate Vendor
          </button>

          <button
            type="button"
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

export default AddVendorModal;
