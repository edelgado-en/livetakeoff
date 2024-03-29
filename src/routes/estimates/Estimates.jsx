import { Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { ChevronRightIcon, BriefcaseIcon } from "@heroicons/react/outline";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

import ReactTimeAgo from "react-time-ago";
import Pagination from "react-js-pagination";

import DeleteEstimateModal from "./DeleteEstimateModal";

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

const Estimates = () => {
  const [loading, setLoading] = useState(true);
  const [estimates, setEstimates] = useState([]);
  const [searchText, setSearchText] = useState(
    localStorage.getItem("estimateSearchText") || ""
  );
  const [totalEstimates, setTotalEstimates] = useState(0);
  const [isDeleteEstimateModalOpen, setDeleteEstimateModalOpen] =
    useState(false);
  const [estimateToBeDeleted, setEstimateToBeDeleted] = useState(null);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchEstimates();
    }, 300);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchText]);

  useEffect(() => {
    localStorage.setItem("estimateSearchText", searchText);
  }, [searchText]);

  const searchEstimates = async () => {
    setLoading(true);

    const request = {
      status: "All",
      customer: "All",
      searchText: localStorage.getItem("estimateSearchText"),
    };

    try {
      const { data } = await api.searchEstimates(request);

      setEstimates(data.results);
      setTotalEstimates(data.count);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchEstimates();
    }
  };

  const handleToggleDeleteEstimateModal = (estimate) => {
    if (estimate) {
      setEstimateToBeDeleted(estimate);
    } else {
      setEstimateToBeDeleted(null);
    }

    setDeleteEstimateModalOpen(!isDeleteEstimateModalOpen);
  };

  const deleteEstimate = async (estimate) => {
    await api.deleteEstimate(estimate.id);

    setDeleteEstimateModalOpen(false);

    searchEstimates();
  };

  return (
    <AnimatedPage>
      <div className="xl:px-16 px-4 m-auto max-w-5xl -mt-3 pb-32">
        <div className="grid grid-cols-2">
          <div className="">
            <h1 className="text-2xl font-semibold text-gray-600">
              Job Estimates
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Total: <span className="text-gray-900">{totalEstimates}</span>
            </p>
          </div>
          <div className="text-right">
            <Link to="/create-estimate">
              <button
                type="button"
                className="inline-flex items-center justify-center 
                                        rounded-md border border-transparent bg-red-600 px-4 py-2
                                        text-sm font-medium text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500
                                        focus:ring-offset-2 sm:w-auto"
              >
                New Estimate
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full mt-4">
          <div className="relative border-b border-gray-200">
            <div
              onClick={() => searchEstimates()}
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
              placeholder="search by tail"
            />
          </div>
        </div>

        {loading && <Loader />}

        {!loading && estimates.length === 0 && (
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
              No estimates found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new estimate.
            </p>
          </div>
        )}

        {!loading && (
          <div className="overflow-hidden bg-white shadow sm:rounded-md mt-2">
            <ul className="divide-y divide-gray-200">
              {estimates.map((estimate) => (
                <li key={estimate.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="w-full grid xl:grid-cols-2 lg:grid-cols-2 md-grid-cols-2 xs:grid-cols-1">
                          <div>
                            <Link to={`/estimates/${estimate.id}`} className="">
                              <span className="font-medium text-red-600 text-sm">
                                {estimate.tailNumber}
                              </span>
                              <span className="text-sm">
                                {" "}
                                - {estimate?.aircraftType?.name}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                <ReactTimeAgo
                                  date={new Date(estimate?.requested_at)}
                                  locale="en-US"
                                  timeStyle="twitter"
                                />
                              </span>
                            </Link>

                            <div className="text-sm text-gray-800 mt-2 flex gap-1">
                              {estimate.customer.name}
                            </div>

                            <div className="mt-2 text-sm text-gray-500 mb-1">
                              {estimate?.airport?.initials} -{" "}
                              {estimate?.fbo?.name}
                            </div>
                          </div>
                          <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left">
                            {estimate.status !== "A" && (
                              <p
                                onClick={() =>
                                  handleToggleDeleteEstimateModal(estimate)
                                }
                                className={`cursor-pointer mr-3 inline-flex text-xs text-gray-700 rounded-md py-1 px-2 border b-gray-700 hover:bg-gray-100`}
                              >
                                Delete
                              </p>
                            )}
                            <p
                              className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                                                ${
                                                                  estimate.status ===
                                                                    "P" &&
                                                                  "bg-blue-400 "
                                                                }
                                                                ${
                                                                  estimate.status ===
                                                                    "A" &&
                                                                  "bg-green-500 "
                                                                }
                                                                ${
                                                                  estimate.status ===
                                                                    "R" &&
                                                                  "bg-gray-500 "
                                                                }
                                                                `}
                            >
                              {estimate.status === "P" && "Pending"}
                              {estimate.status === "A" && "Approved"}
                              {estimate.status === "R" && "Rejected"}
                            </p>
                            <div className="flex -space-x-1 overflow-hidden justify-start xl:justify-end lg:justify-end md:justify-end mt-2">
                              {estimate?.requested_by?.profile?.avatar && (
                                <img
                                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                  src={estimate?.requested_by?.profile?.avatar}
                                  alt="requested by"
                                />
                              )}
                              <div
                                className="text-gray-500 text-sm relative top-1"
                                style={{ marginLeft: "6px" }}
                              >
                                {estimate?.requested_by?.username}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 mt-2 flex xl:justify-end xs:justify-start">
                              {estimate.job && (
                                <span>
                                  <BriefcaseIcon
                                    className="mr-2 h-4 w-4 text-gray-500 relative"
                                    style={{ top: "2px" }}
                                  />
                                </span>
                              )}
                              <span className="text-gray-700">
                                ${estimate?.total_price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link
                        to={`/estimates/${estimate.id}`}
                        className="ml-5 flex-shrink-0"
                      >
                        <ChevronRightIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isDeleteEstimateModalOpen && (
          <DeleteEstimateModal
            isOpen={isDeleteEstimateModalOpen}
            handleClose={handleToggleDeleteEstimateModal}
            deleteEstimate={deleteEstimate}
            fee={estimateToBeDeleted}
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default Estimates;
