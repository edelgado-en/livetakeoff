import { Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";

import {
  Listbox,
  Transition,
  Menu,
  Popover,
  Disclosure,
  Dialog,
} from "@headlessui/react";

import {
  VideoCameraIcon,
  DocumentTextIcon,
  PhotographIcon,
} from "@heroicons/react/outline";

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

import Pagination from "react-js-pagination";

import { toast } from "react-toastify";

import DeleteHelpFileModal from "./DeleteHelpFileModal";
import CreateHelpFileModal from "./CreateHelpFileModal";

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const HelpFileList = () => {
  const [helpFiles, setHelpFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalHelpFiles, setTotalHelpFiles] = useState(0);
  const [searchText, setSearchText] = useState("");

  const currentUser = useAppSelector(selectUser);

  const [isDeleteHelpFileModalOpen, setDeleteHelpFileModalOpen] =
    useState(false);
  const [helpFileToBeDeleted, setHelpFileToBeDeleted] = useState(null);

  const [isCreateHelpFileModalOpen, setCreateHelpFileModalOpen] =
    useState(false);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchHelpFiles();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchText, currentPage]);

  const searchHelpFiles = async () => {
    const request = {
      searchText,
    };

    setLoading(true);

    try {
      const response = await api.searchHelpFiles(request, currentPage);

      // iterate through response.data.results and add iconBackground and iconForeground depending on the file_type
      response.data.results.forEach((helpFile) => {
        if (helpFile.file_type === "F") {
          helpFile.iconBackground = "bg-sky-50";
          helpFile.iconForeground = "text-sky-700";
        } else if (helpFile.file_type === "U") {
          helpFile.iconBackground = "bg-yellow-50";
          helpFile.iconForeground = "text-yellow-700";
        } else if (helpFile.file_type === "P") {
          helpFile.iconBackground = "bg-teal-50";
          helpFile.iconForeground = "text-teal-700";
        }
      });

      setHelpFiles(response.data.results);
      setTotalHelpFiles(response.data.count);
    } catch (error) {
      toast.error("Unable to get help files");
    }

    setLoading(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchHelpFiles();
    }
  };

  const handleToggleDeleteHelpFileModal = (helpFile) => {
    if (helpFile) {
      setHelpFileToBeDeleted(helpFile);
    } else {
      setHelpFileToBeDeleted(null);
    }

    setDeleteHelpFileModalOpen(!isDeleteHelpFileModalOpen);
  };

  const deleteHelpFile = async (helpFile) => {
    await api.deleteHelpFile(helpFile.id);

    setDeleteHelpFileModalOpen(false);

    searchHelpFiles();
  };

  const handleToggleCreateHelpFileModal = () => {
    setCreateHelpFileModalOpen(!isCreateHelpFileModalOpen);
  };

  const handleCreateHelpFile = (helpFile) => {
    setCreateHelpFileModalOpen(false);

    searchHelpFiles();
  };

  const downloadFile = (file) => {
    const fileUrl =
      "https://res.cloudinary.com/datidxeqm/" + file.file + "?dl=true";
    console.log(fileUrl);
    window.open(fileUrl, "_blank");
  };

  return (
    <AnimatedPage>
      <div className="xl:px-16 px-4 m-auto max-w-7xl -mt-3 pb-32">
        <div className="grid grid-cols-2">
          <div className="">
            <h1 className="text-2xl font-semibold text-gray-600">
              Training Files
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Total: <span className="text-gray-900">{totalHelpFiles}</span>
            </p>
          </div>
          {(currentUser.isAdmin ||
            currentUser.isSuperUser ||
            currentUser.isAccountManager) && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => handleToggleCreateHelpFileModal()}
                className="inline-flex items-center justify-center 
                                            rounded-md border border-transparent bg-red-600 px-4 py-2
                                            text-sm font-medium text-white shadow-sm hover:bg-red-700
                                            focus:outline-none focus:ring-2 focus:ring-red-500
                                            focus:ring-offset-2 sm:w-auto"
              >
                New Help File
              </button>
            </div>
          )}
        </div>

        <div className="w-full mt-4">
          <div className="relative border-b border-gray-200">
            <div
              onClick={() => searchHelpFiles()}
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
              className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                                    focus:ring-sky-500 text-md"
              placeholder="search by name"
            />
          </div>
        </div>

        {loading && <Loader />}

        {!loading && helpFiles.length === 0 && (
          <div className="text-center mt-16">
            <h3 className="mt-2 text-md text-gray-500">No help files found.</h3>
          </div>
        )}

        {!loading && (
          <div className="grid 3xl:grid-cols-2 2xl:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 mt-4 gap-6">
            {helpFiles.map((helpFile) => (
              <div className="relative overflow-hidden rounded-lg border border-gray-300 p-4">
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div>
                      <span
                        className={classNames(
                          helpFile.iconBackground,
                          helpFile.iconForeground,
                          "inline-flex rounded-lg p-2 ring-4 ring-white"
                        )}
                      >
                        {helpFile.file_type === "F" && (
                          <DocumentTextIcon className="h-6 w-6" />
                        )}
                        {helpFile.file_type === "U" && (
                          <VideoCameraIcon className="h-6 w-6" />
                        )}
                        {helpFile.file_type === "P" && (
                          <PhotographIcon className="h-6 w-6" />
                        )}
                      </span>
                    </div>
                    <div className="">
                      <h3 className="text-base font-medium leading-7 text-gray-700 relative top-2">
                        {helpFile.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {helpFile.file_type === "U" && (
                      <a
                        href={helpFile.url}
                        target="_blank"
                        className="inline-flex items-center rounded border
                                                                                border-sky-400 bg-white px-2  text-sm
                                                                                font-medium text-sky-500 shadow-sm hover:bg-gray-50
                                                                                focus:outline-none cursor-pointer"
                      >
                        Open File
                      </a>
                    )}
                    {helpFile.file_type === "F" && (
                      <button
                        type="button"
                        onClick={() => downloadFile(helpFile)}
                        className="inline-flex items-center rounded border
                                                                              border-sky-400 bg-white px-2 text-sm
                                                                              font-medium text-sky-500 shadow-sm hover:bg-gray-50
                                                                              focus:outline-none cursor-pointer"
                      >
                        Open File
                      </button>
                    )}
                    {helpFile.file_type === "P" && (
                      <a
                        href={helpFile.photo}
                        target="_blank"
                        className="inline-flex items-center rounded border
                                                                              border-sky-400 bg-white px-2  text-sm
                                                                              font-medium text-sky-500 shadow-sm hover:bg-gray-50
                                                                              focus:outline-none cursor-pointer"
                      >
                        Open File
                      </a>
                    )}
                  </div>
                </div>
                <div className="border-t border-gray-200 mt-3">
                  <div className="text-gray-500 my-6">
                    {helpFile.description}
                  </div>
                </div>
                {(currentUser.isAdmin ||
                  currentUser.isSuperUser ||
                  currentUser.isAccountManager) && (
                  <div className="border-t border-gray-200 my-3 flex justify-between text-gray-500">
                    <div className="mt-3 text-md inline-block rounded-md px-2  border bg-gray-100 border-gray-200 text-gray-500">
                      <div className="relative top-2">
                        {helpFile.access_level === "A" && "All access"}
                        {helpFile.access_level === "C" && "Customer access"}
                        {helpFile.access_level === "E" && "External PM access"}
                        {helpFile.access_level === "P" && "Internal PM access"}
                        {helpFile.access_level === "I" &&
                          "Internal Coordinator access"}
                        {helpFile.access_level === "D" && "Admin access"}
                      </div>
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 bg-white
                                                 py-2 px-4 text-md text-gray-700 shadow-sm
                                                  hover:bg-gray-50 focus:outline-none focus:ring-2
                                                   focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="ml-3 rounded-md border border-gray-300 bg-white
                                                 py-2 px-4 text-md text-gray-700 shadow-sm
                                                  hover:bg-gray-50 focus:outline-none focus:ring-2
                                                   focus:ring-gray-500 focus:ring-offset-2"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isCreateHelpFileModalOpen && (
        <CreateHelpFileModal
          isOpen={isCreateHelpFileModalOpen}
          handleClose={handleToggleCreateHelpFileModal}
          addHelpFile={handleCreateHelpFile}
        />
      )}
    </AnimatedPage>
  );
};

export default HelpFileList;
