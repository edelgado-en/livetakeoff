import { Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { Menu } from "@headlessui/react";
import { ChevronRightIcon, BriefcaseIcon } from "@heroicons/react/outline";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

import ReactTimeAgo from "react-time-ago";

import DeleteExportJobModal from "./DeleteExportJobModal";

import { toast } from "react-toastify";

const EllipsisVerticalIcon = () => {
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
        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
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

const availableStatuses = [
  { id: "All", name: "All" },
  { id: "P", name: "Pending" },
  { id: "A", name: "Accepted" },
  { id: "R", name: "Rejected" },
];

const ExportJobs = () => {
  const [loading, setLoading] = useState(true);
  const [exportJobs, setExportJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalExportJobs, setTotalExportJobs] = useState(0);
  const [isDeleteExportJobModalOpen, setDeleteExportJobModalOpen] =
    useState(false);
  const [exportJobToBeDeleted, setExportJobToBeDeleted] = useState(null);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchExportJobs();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchText]);

  const searchExportJobs = async () => {
    setLoading(true);

    const request = {
      status: "All",
      customer: "All",
      searchText: searchText,
    };

    try {
      const { data } = await api.getExportJobs(request, 1);

      setExportJobs(data.results);
      setTotalExportJobs(data.count);
    } catch (error) {
      toast.error("Unable to fetch export jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchExportJobs();
    }
  };

  const handleToggleDeleteExportJobModal = (exportJob) => {
    if (exportJob) {
      setExportJobToBeDeleted(exportJob);
    } else {
      setExportJobToBeDeleted(null);
    }

    setDeleteExportJobModalOpen(!isDeleteExportJobModalOpen);
  };

  const deleteExportJob = async (exportJob) => {
    await api.deleteExportJob(exportJob.id);

    setDeleteExportJobModalOpen(false);

    searchExportJobs();
  };

  const downloadExportById = async (id) => {
    const res = await api.downloadExportJob(id);

    // Try to get filename from Content-Disposition
    let filename = "export.zip";
    const dispo = res.headers["content-disposition"];
    if (dispo) {
      const m =
        /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i.exec(dispo) ||
        /filename=(.+)$/i.exec(dispo);
      if (m && m[1]) filename = decodeURIComponent(m[1].trim());
    }

    // Create object URL and trigger download
    const blobUrl = URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <AnimatedPage>
      <div className="xl:px-16 px-4 m-auto max-w-5xl -mt-3 pb-32">
        <div className="grid grid-cols-2">
          <div className="">
            <h1 className="text-2xl font-semibold text-gray-600">
              Export Jobs
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Total: <span className="text-gray-900">{totalExportJobs}</span>
            </p>
          </div>
        </div>

        <div className="w-full mt-4">
          <div className="relative border-b border-gray-200">
            <div
              onClick={() => searchExportJobs()}
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
                                    focus:ring-sky-500 text-sm"
              placeholder="search by filename"
            />
          </div>
        </div>

        {loading && <Loader />}

        {!loading && exportJobs.length === 0 && (
          <div className="text-center mt-14 ">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No export jobs found.
            </h3>
          </div>
        )}

        {!loading && (
          <div className="bg-white shadow sm:rounded-md mt-2">
            <ul role="list" className="divide-y divide-gray-200">
              {exportJobs.map((exportJob) => (
                <li
                  key={exportJob.id}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-5 px-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                      <p className="text-md font-semibold text-gray-500">
                        {exportJob.filename}
                      </p>
                      {exportJob.status === "RUNNING" ? (
                        <p
                          className="mt-0.5 rounded-md bg-blue-100 px-1.5 py-0.5 text-sm font-medium text-blue-700
                                     inset-ring inset-ring-gray-500/10
                                      "
                        >
                          In progress
                        </p>
                      ) : null}
                      {exportJob.status === "SUCCEEDED" ? (
                        <p
                          className="mt-0.5 rounded-md bg-green-100 px-1.5 py-0.5 text-sm font-medium
                                     text-green-700 inset-ring inset-ring-green-600/20
                                       "
                        >
                          Completed
                        </p>
                      ) : null}
                      {exportJob.status === "PENDING" ? (
                        <p
                          className="mt-0.5 rounded-md bg-yellow-100 px-1.5 py-0.5
                                     text-sm font-medium text-yellow-800
                                      inset-ring inset-ring-yellow-600/20
                                       "
                        >
                          Pending
                        </p>
                      ) : null}
                      {exportJob.status === "FAILED" ? (
                        <p
                          className="mt-0.5 rounded-md bg-red-100 px-1.5 py-0.5
                                     text-sm font-medium text-red-800 inset-ring
                                      inset-ring-red-600/20
                                       "
                        >
                          Failed
                        </p>
                      ) : null}
                      {exportJob.status === "CANCELED" ? (
                        <p
                          className="mt-0.5 rounded-md bg-gray-100 px-1.5 py-0.5
                                         text-xs font-medium text-black inset-ring inset-ring-gray-600/20
                                          "
                        >
                          Canceled
                        </p>
                      ) : null}
                    </div>
                    {exportJob.status === "RUNNING" && (
                      <div className="flex-1 mb-4">
                        <div className="overflow-hidden rounded-full bg-gray-200 mt-3">
                          <div
                            style={{
                              width: exportJob.progress + "%",
                            }}
                            className="h-2 rounded-full bg-blue-500"
                          />
                        </div>
                      </div>
                    )}
                    <div className="mt-1 flex items-center gap-x-2 text-xs text-gray-500 ">
                      <p className="whitespace-nowrap">
                        Created on {exportJob.created_at}
                      </p>
                      {" by "}
                      <p className="truncate">
                        {exportJob.user?.first_name} {exportJob.user?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-x-4">
                    <button
                      disabled={exportJob.status !== "SUCCEEDED"}
                      onClick={() => downloadExportById(exportJob.id)}
                      className="rounded-md px-2.5 py-1.5 text-sm
                                 font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300
                                  hover:bg-gray-50 sm:block border border-gray-300"
                    >
                      Download
                    </button>
                    <Menu
                      as="div"
                      className="hidden md:block lg:block xl:block relative flex-none"
                    >
                      <Menu.Button className="relative block text-gray-500 hover:text-gray-900">
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon
                          aria-hidden="true"
                          className="size-5"
                        />
                      </Menu.Button>
                      <Menu.Items
                        transition
                        className="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-md 
             bg-white py-2 shadow-lg ring-1 ring-black/5 transition
             data-closed:scale-95 data-closed:transform
             data-closed:opacity-0 data-enter:duration-100
             data-enter:ease-out data-leave:duration-75
             data-leave:ease-in"
                      >
                        <Menu.Item>
                          <button
                            onClick={() =>
                              handleToggleDeleteExportJobModal(exportJob)
                            }
                            className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden
                                     "
                          >
                            Delete
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isDeleteExportJobModalOpen && (
          <DeleteExportJobModal
            isOpen={isDeleteExportJobModalOpen}
            handleClose={handleToggleDeleteExportJobModal}
            deleteExportJob={deleteExportJob}
            exportJob={exportJobToBeDeleted}
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default ExportJobs;
