import { useEffect, useState, Fragment } from "react";
import {
  useParams,
  useNavigate,
  Outlet,
  Link,
  useLocation,
} from "react-router-dom";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import {
  ArrowLeftIcon,
  InformationCircleIcon,
  ClockIcon,
  CashIcon,
  ShareIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";
import { Menu, Transition, Popover } from "@headlessui/react";

import JobInfo from "./JobInfo";
import JobPriceBreakdown from "./JobPricebreakdown";
import Loader from "../../components/loader/Loader";

import * as api from "./apiService";
import axios from "axios";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUser } from "../../routes/userProfile/userSlice";
import { selectJobStats, fetchJobStats } from "./jobStats/jobStatsSlice";

const WrenchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-4 h-4 text-gray-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
      />
    </svg>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const JobReview = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const location = useLocation();

  const currentUser = useAppSelector(selectUser);
  const jobStats = useAppSelector(selectJobStats);

  useEffect(() => {
    dispatch(fetchJobStats(jobId));
  }, []);

  useEffect(() => {
    getJobDetails();
    navigate("photos");
  }, []);

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  const getJobDetails = async () => {
    setLoading(true);

    try {
      const { data } = await api.getJobDetails(jobId);

      setJobDetails(data);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 403) {
        setErrorMessage("You do not have permission to view this job.");
      } else {
        setErrorMessage("Unable to load job details.");
      }
    }
  };

  const getJobCloseout = async () => {
    setDownloadLoading(true);

    try {
      axios({
        url: `/api/jobs/closeout/${jobId}/`,
        method: "GET",
        responseType: "blob", // important
      }).then((response) => {
        setDownloadLoading(false);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${jobDetails?.customer.name.replace(/\s/g, "")}_${
            jobDetails?.purchase_order
          }_closeout.pdf`
        );
        document.body.appendChild(link);
        link.click();
      });
    } catch (err) {
      setDownloadLoading(false);
    }
  };

  const invoiceJob = async () => {
    await api.invoiceJob(jobId, { status: "I" });

    navigate(0);
  };

  const handleCopyClick = () => {
    const copyText =
      "https://www.livetakeoff.com/shared/jobs/" + jobDetails.encoded_id + "/";

    copyTextToClipboard(copyText)
      .then(() => {
        // If successful, update the isCopied state value
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBackNavigation = () => {
    if (
      location.pathname.includes("photos") &&
      location.pathname.includes("report")
    ) {
      navigate("/service-report");
    } else if (
      location.pathname.includes("photos") &&
      location.pathname.includes("completed")
    ) {
      navigate("/completed");
    } else if (location.pathname.includes("create-job")) {
      navigate("/create-job");
    } else {
      navigate(-1);
    }
  };

  return (
    <AnimatedPage>
      <main
        className="mx-auto px-4 pb-16 lg:pb-12 max-w-6xl -mt-3"
        style={{ maxWidth: "1800px" }}
      >
        <div className="flex flex-wrap gap-2">
          <div>
            <button
              onClick={() => handleBackNavigation()}
              className="text-xs leading-5 font-semibold bg-slate-400/10
                                                        rounded-full p-2 text-slate-500
                                                        flex items-center space-x-2 hover:bg-slate-400/20
                                                        dark:highlight-white/5"
            >
              <ArrowLeftIcon className="flex-shrink-0 h-4 w-4 cursor-pointer" />
            </button>
          </div>
          <div className="pb-4">
            <h1 className="text-2xl font-semibold text-gray-600">Job Review</h1>
            {!currentUser.isCustomer && (
              <p className="mt-1 text-lg text-gray-500">
                Ensure all the photos and details are correct before creating a
                closeout.
              </p>
            )}
          </div>
          <div className="flex-1 justify-end text-right">
            <button
              type="button"
              onClick={() => handleCopyClick()}
              className="inline-flex items-center rounded-md border mr-2
                                    border-gray-300 bg-white px-3 py-2 text-md font-medium 
                                    text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                    focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 "
            >
              {isCopied ? (
                <>
                  <span>copied!</span>
                </>
              ) : (
                <>Share</>
              )}
            </button>

            <Menu
              as="div"
              className="relative inline-block text-left top-2 ml-2"
            >
              <div>
                <Menu.Button
                  className="flex items-center rounded-full
                                                    bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2
                                                        focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                  style={{ padding: "2px" }}
                >
                  <span className="sr-only">Open options</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  className="absolute right-0 z-10 mt-2 w-40
                                                    origin-top-right rounded-md bg-white shadow-lg ring-1
                                                        ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="photos"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          <div className="flex space-x-3">
                            <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                            <div>Details</div>
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                    {(currentUser.isAdmin ||
                      currentUser.isSuperUser ||
                      currentUser.isAccountManager ||
                      (currentUser.isInternalCoordinator &&
                        jobDetails.status !== "I")) && (
                      <>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="edit"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              <div className="flex space-x-3">
                                <PencilIcon className="h-4 w-4 text-gray-500" />
                                <div>Edit</div>
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="services"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              <div className="flex space-x-3">
                                <WrenchIcon />
                                <div>Services</div>
                              </div>
                            </Link>
                          )}
                        </Menu.Item>
                      </>
                    )}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="activity"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          <div className="flex space-x-3">
                            <ClockIcon className="h-4 w-4 text-gray-500" />
                            <div>Activity</div>
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="comments"
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          <div className="flex space-x-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4 text-gray-500"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                              />
                            </svg>
                            <div>Comments</div>
                            {jobStats.comments_count > 0 && (
                              <div
                                className="bg-red-500 text-white py-1 px-2 relative bottom-2 right-4
                                                                    rounded-full text-xs font-medium inline-block scale-90"
                              >
                                {jobStats.comments_count}
                              </div>
                            )}
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {jobStats.comments_count > 0 && (
              <div
                className="bg-red-500 text-white py-1 px-2 relative bottom-2 right-4
                                                                rounded-full text-xs font-medium inline-block scale-90"
              >
                {jobStats.comments_count}
              </div>
            )}
          </div>
        </div>

        {!location.pathname.includes("edit") &&
          !location.pathname.includes("activity") &&
          !location.pathname.includes("comments") &&
          !location.pathname.includes("services") &&
          !downloadLoading && (
            <>
              <JobInfo />
            </>
          )}

        {downloadLoading ? (
          <div className="text-gray-500 text-center">
            <Loader />
            <div>Generating closeout PDF.</div>
            <div>
              This might take several seconds depending on photos. Please
              wait...
            </div>
          </div>
        ) : (
          <div className="max-w-7xl px-2" style={{ maxWidth: "2100px" }}>
            <Outlet />
          </div>
        )}
        <div className="py-20"></div>
      </main>
    </AnimatedPage>
  );
};

export default JobReview;
