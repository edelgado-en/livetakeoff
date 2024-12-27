import { useState, useEffect, Fragment } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Switch, Listbox, Transition } from "@headlessui/react";

import {
  DocumentIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";

import * as api from "./apiService";
import { toast } from "react-toastify";

const fileTypeOptions = [
  { id: "I", name: "Insurance" },
  { id: "W", name: "W-9" },
  { id: "O", name: "Other" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const VendorFileUploadModal = ({
  isOpen,
  handleClose,
  addVendorFile,
  vendorId,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileTypeSelected, setFileTypeSelected] = useState(fileTypeOptions[0]);
  const [expirationDate, setExpirationDate] = useState(null);
  const [expirationDateOpen, setExpirationDateOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      // if file type is insurance, expiration date is required
      if (fileTypeSelected.id === "I" && !expirationDate) {
        toast.error("Expiration date is required for insurance files");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("file_type", fileTypeSelected.id);
      formData.append("expiration_date", expirationDate);
      formData.append("is_approved", isApproved);

      try {
        const { data } = await api.uploadFile(vendorId, formData);

        addVendorFile(data);
      } catch (err) {
        toast.error("Unable to upload file");
      }
    }
  };

  const handleToggleExpirationDateOpen = () => {
    setExpirationDateOpen(!expirationDateOpen);
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2 px-4">
        <div className="">
          <div className="mt-3 text-center">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 relative top-1"
            >
              Document Upload
            </Dialog.Title>
          </div>

          <div className="mt-6">
            <Listbox value={fileTypeSelected} onChange={setFileTypeSelected}>
              {({ open }) => (
                <>
                  <Listbox.Label className="text-md text-gray-600">
                    File Type
                  </Listbox.Label>
                  <div className="relative mt-1">
                    <Listbox.Button
                      className="relative w-full cursor-default rounded-md border
                                                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                        shadow-sm focus:border-sky-500 focus:outline-none
                                                                        focus:ring-1 focus:ring-sky-500 sm:text-md"
                    >
                      <span className="block truncate">
                        {fileTypeSelected
                          ? fileTypeSelected.name
                          : "Select file type"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDownIcon
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
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-md"
                      >
                        {fileTypeOptions.map((fileType) => (
                          <Listbox.Option
                            key={fileType.id}
                            className={({ active }) =>
                              classNames(
                                active
                                  ? "text-white bg-red-600"
                                  : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                            value={fileType}
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={classNames(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {fileType.name}
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

          {fileTypeSelected.id === "I" && (
            <div className="mt-6">
              <div>
                <div className="text-md text-gray-600 flex justify-between">
                  Expiration Date
                  {expirationDate && (
                    <span
                      onClick={() => setExpirationDate(null)}
                      className="ml-2 underline text-sm text-red-500 cursor-pointer relative top-1"
                    >
                      clear
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleToggleExpirationDateOpen}
                  className="inline-flex items-center rounded-md border mt-1
                                            w-full h-10
                                            border-gray-300 bg-white px-4 py-2 text-md
                                                text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {expirationDate?.toLocaleString("en-US", {
                    hour12: false,
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </button>
                {expirationDateOpen && (
                  <DatePicker
                    selected={expirationDate}
                    onChange={(date) => setExpirationDate(date)}
                    locale="pt-BR"
                    dateFormat="Pp"
                    inline
                  />
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <span className="flex grow flex-col">
              <label as="span" passive className="text-md text-gray-600">
                Approved
              </label>
              <div className="text-sm text-gray-500">
                Ensure the file is with accordance to the company's policy.
              </div>
            </span>
            <Switch
              checked={isApproved}
              onChange={setIsApproved}
              className={classNames(
                isApproved ? "bg-red-500" : "bg-gray-200",
                "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  isApproved ? "translate-x-5" : "translate-x-0",
                  "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
          </div>

          <div className="mt-8 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" />
              <div className="mt-4 flex justify-center text-sm leading-6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white text-center 
                             font-semibold text-blue-600 focus-within:outline-none
                                hover:text-blue-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              <p className="text-sm leading-5 text-gray-600">
                Excel, PDF, Word, txt{" "}
              </p>
            </div>
          </div>

          {selectedFile && (
            <div className="mt-6">
              <div>
                <div className="text-sm font-medium text-gray-900">File</div>
                {selectedFile.name}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            disabled={!selectedFile}
            onClick={handleUpload}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Upload
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

export default VendorFileUploadModal;
