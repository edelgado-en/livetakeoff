import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  ArrowLeftIcon,
  ClipboardCheckIcon,
  PhotographIcon,
  PencilIcon,
  UserAddIcon,
  ClockIcon,
  ShareIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/outline";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";
import { selectJobStats, fetchJobStats } from "./jobStats/jobStatsSlice";
import * as api from "./apiService";
import { Popover } from "@headlessui/react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const JobDetails = () => {
  const { jobId } = useParams();
  const [isCopied, setIsCopied] = useState(false);

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const jobStats = useAppSelector(selectJobStats);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchJobStats(jobId));
  }, []);

  const handleCopyClick = () => {
    const copyText =
      "https://www.livetakeoff.com/shared/jobs/" + jobStats.encoded_id + "/";

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

  const copyTextToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  return (
    <div
      className="xl:px-16 px-4 m-auto max-w-7xl"
      style={{ maxWidth: "2100px" }}
    >
      <div className="grid grid-cols-2 xl:grid-cols-2 lg:grid-cols-2">
        <div className="flex">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-xs leading-5 font-semibold bg-slate-400/10
                                                        rounded-full p-2 text-slate-500
                                                        flex items-center space-x-2 hover:bg-slate-400/20
                                                        dark:highlight-white/5"
            >
              <ArrowLeftIcon className="flex-shrink-0 h-4 w-4 cursor-pointer" />
            </button>
          </div>
          <div
            className="ml-2 text-sm text-slate-500"
            style={{ marginTop: "5px" }}
          >
            {jobStats.purchase_order}
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <div>
            <div className="">
              <nav className="flex space-x-4" aria-label="Tabs">
                {(currentUser.isAdmin ||
                  currentUser.isSuperUser ||
                  currentUser.isAccountManager ||
                  currentUser.isInternalCoordinator) && (
                  <Popover className="relative">
                    <Popover.Button>
                      <ShareIcon
                        className="h-6 w-6 text-gray-600 cursor-pointer"
                        onClick={() => handleCopyClick()}
                      />
                    </Popover.Button>

                    <Popover.Panel className="absolute z-10">
                      <div className="bg-gray-600 text-white text-xs py-1 px-2 rounded-md">
                        copied!
                      </div>
                    </Popover.Panel>
                  </Popover>
                )}
                <Link to="details">
                  <ClipboardCheckIcon className="h-6 w-6 text-gray-600" />
                </Link>
                <Link to="comments">
                  <div className="">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                      />
                    </svg>
                    {jobStats.comments_count > 0 && (
                      <div
                        className="bg-red-500 text-white py-1 px-2 relative bottom-9 left-3
                                                            rounded-full text-xs font-medium inline-block scale-90"
                      >
                        {jobStats.comments_count}
                      </div>
                    )}
                  </div>
                </Link>
                <Link to="photos/listing">
                  <div className="">
                    <PhotographIcon className="h-6 w-6 text-gray-600" />
                    {jobStats.photos_count > 0 && (
                      <div
                        className="bg-gray-50 text-gray-600 py-1
                                                             relative bottom-9 border left-3 px-2
                                                             rounded-full text-xs font-medium inline-block scale-90"
                      >
                        {jobStats.photos_count}
                      </div>
                    )}
                  </div>
                </Link>

                {currentUser.isCustomer && (
                  <Link to="activity">
                    <ClockIcon className="h-6 w-6 text-gray-600" />
                  </Link>
                )}

                {(currentUser.isAdmin ||
                  currentUser.isSuperUser ||
                  currentUser.isAccountManager ||
                  currentUser.isInternalCoordinator) && (
                  <Menu as="div" className="relative inline-block text-left">
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
                                to="assignments"
                                className={classNames(
                                  active
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-700",
                                  "block px-4 py-2 text-sm"
                                )}
                              >
                                <div className="flex space-x-3">
                                  <UserAddIcon className="h-4 w-4 text-gray-500" />
                                  <div>Assignments</div>
                                </div>
                              </Link>
                            )}
                          </Menu.Item>
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
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {jobStats.comments_count > 0 && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon
                className="h-8 w-8 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-md font-medium text-red-800 relative top-1">
                You have {jobStats.comments_count} unread comment(s).
              </h3>
            </div>
          </div>
        </div>
      )}

      <Outlet />

      <div className="p-20"></div>
    </div>
  );
};

export default JobDetails;
