import { useState, useEffect, Fragment } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import ImageUploading from "react-images-uploading";

import * as api from "./apiService";
import { toast } from "react-toastify";

import {
  PlusIcon,
  CheckIcon,
  CheckCircleIcon,
  InboxIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon,
  DocumentIcon,
} from "@heroicons/react/outline";

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

const CreateHelpFileModal = ({ isOpen, handleClose, addHelpFile }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [helpFileTypeSelected, setHelpFileTypeSelected] = useState(
    helpTypes[0]
  );

  const [accessLevelSelected, setAccessLevelSelected] = useState(
    accessLevels[0]
  );

  const [loading, setLoading] = useState(false);

  const [itemImages, setItemImages] = useState([]);
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const createHelpFile = async () => {
    if (name.length === 0) {
      alert("Enter a help file name");
      return;
    }

    if (helpFileTypeSelected.name === "Photo" && itemImages.length === 0) {
      alert("Upload a photo");
      return;
    }

    setLoading(true);

    let fileType = "F";

    if (helpFileTypeSelected.name === "Photo") {
      fileType = "P";
    } else if (helpFileTypeSelected.name === "URL") {
      fileType = "U";
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", selectedFile);
    formData.append("video_url", url);
    formData.append("access_level", accessLevelSelected.id);
    formData.append("file_type", fileType);

    itemImages.forEach((image) => {
      if (image.file.size < 10000000) {
        // less than 10MB
        formData.append("photo", image.file);
      }
    });

    try {
      const { data } = await api.createHelpFile(formData);
      addHelpFile(data);
    } catch (err) {
      toast.error("Unable to create help file");
    }

    setLoading(false);
  };

  const handleHelpFileTypeSelectedChange = (value) => {
    setHelpFileTypeSelected(value);
  };

  const handleAccessLevelSelectedChange = (value) => {
    setAccessLevelSelected(value);
  };

  const onChangePhoto = (imageList, addUpdateIndex) => {
    setItemImages(imageList);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
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
              Create Help File
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
                                                                        focus:ring-1 focus:ring-sky-500 sm:text-lg"
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
              <div className="mt-4">
                <Listbox
                  value={helpFileTypeSelected}
                  onChange={handleHelpFileTypeSelectedChange}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="block text-md font-medium text-gray-700">
                        Type
                      </Listbox.Label>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border
                                                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                        shadow-sm focus:border-sky-500 focus:outline-none
                                                                        focus:ring-1 focus:ring-sky-500 sm:text-lg"
                        >
                          <span className="block truncate">
                            {helpFileTypeSelected
                              ? helpFileTypeSelected.name
                              : "Select help file type"}
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
                            {helpTypes.map((helpFileType) => (
                              <Listbox.Option
                                key={helpFileType.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={helpFileType}
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
                                      {helpFileType.name}
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

              {helpFileTypeSelected.name === "Photo" && (
                <>
                  <div className="block text-md font-medium text-gray-700 mt-6 mb-2">
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
                                PNG, JPG, GIF up to 10MB.
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
                </>
              )}

              {helpFileTypeSelected.name === "File" && (
                <>
                  <div className="mt-6 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
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
                      <p className="text-xs leading-5 text-gray-600">
                        Excel, PDF, Word, txt{" "}
                      </p>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="mt-6">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          File
                        </div>
                        {selectedFile.name}
                      </div>
                    </div>
                  )}
                </>
              )}

              {helpFileTypeSelected.name === "URL" && (
                <div className="mt-6">
                  <div>
                    <label
                      htmlFor="brandName"
                      className="block text-md font-medium text-gray-700"
                    >
                      URL
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        name="fileUrl"
                        id="fileUrl"
                        className="block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-32 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            disabled={loading}
            onClick={() => createHelpFile()}
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

export default CreateHelpFileModal;
