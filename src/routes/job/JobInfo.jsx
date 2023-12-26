import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  TrashIcon,
  ArrowRightIcon,
  PencilIcon,
  PlusIcon,
  PaperClipIcon,
} from "@heroicons/react/outline";
import { toast } from "react-toastify";
import * as api from "./apiService";

import { Switch, Popover } from "@headlessui/react";

import Loader from "../../components/loader/Loader";
import JobCompleteModal from "./JobCompleteModal";
import JobPriceBreakdownModal from "./JobPriceBreakdownModal";
import JobCancelModal from "./JobCancelModal";
import JobReturnModal from "./JobReturnModal";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import AddServiceModal from "./AddServiceModal";
import AddRetainerServiceModal from "./AddRetainerServiceModal";
import JobFileUploadModal from "./JobFileUploadModal";

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../routes/userProfile/userSlice";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const JobInfo = () => {
  const { jobId } = useParams();
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState({
    service_assignments: [],
    retainer_service_assignments: [],
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCompleteJobModalOpen, setCompleteJobModalOpen] = useState(false);
  const [isCancelJobModalOpen, setIsCancelJobModalOpen] = useState(false);
  const [isReturnJobModalOpen, setReturnJobModalOpen] = useState(false);
  const [isJobFileUploadModalOpen, setJobFileUploadModalOpen] = useState(false);

  const [serviceActivities, setServiceActivities] = useState([]);

  const [isPriceBreakdownModalOpen, setPriceBreakdownModalOpen] =
    useState(false);

  const [isAddServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [isAddRetainerServiceModalOpen, setAddRetainerServiceModalOpen] =
    useState(false);

  const [showActions, setShowActions] = useState(false);
  const currentUser = useAppSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const [showMore, setShowMore] = useState(false);
  const [showServiceActivity, setShowServiceActivity] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [tailDetailsFound, setTailDetailsFound] = useState(false);

  useEffect(() => {
    getJobDetails();
  }, []);

  const handleToggleJobCompleteModal = () => {
    setCompleteJobModalOpen(!isCompleteJobModalOpen);
  };

  const handleToggleJobCancelModal = () => {
    setIsCancelJobModalOpen(!isCancelJobModalOpen);
  };

  const handleTogglePriceBreakdownModal = () => {
    setPriceBreakdownModalOpen(!isPriceBreakdownModalOpen);
  };

  const handleToggleJobReturnModal = () => {
    setReturnJobModalOpen(!isReturnJobModalOpen);
  };

  const handleToggleJobFileUploadModal = () => {
    setJobFileUploadModalOpen(!isJobFileUploadModalOpen);
  };

  const getJobDetails = async () => {
    setLoading(true);

    try {
      const { data } = await api.getJobDetails(jobId);

      setJobDetails(data);

      setLoading(false);

      const response = await api.getUserDetails();

      if (
        response.data.isAdmin ||
        response.data.isSuperUser ||
        response.data.isAccountManager ||
        response.data.isInternalCoordinator
      ) {
        setIsAdmin(true);

        const request = {
          tail_number: data.tailNumber,
        };

        const response2 = await api.getTailServiceHistory(request);

        const uniqueServiceActivities = [];

        for (let i = 0; i < response2.data.results.length; i++) {
          const serviceActivity = response2.data.results[i];
          const found = uniqueServiceActivities.some(
            (el) =>
              el.service_name === serviceActivity.service_name &&
              el.purchase_order === serviceActivity.purchase_order
          );

          if (!found) {
            uniqueServiceActivities.push(serviceActivity);
          }
        }

        setServiceActivities(uniqueServiceActivities);
      } else if (response.data.isCustomer) {
        //remove files that are not public from jobDetails
        const updatedJobDetails = {
          ...data,
          files: data.files.filter((f) => f.is_public),
        };
        setJobDetails(updatedJobDetails);
      }
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 403) {
        setErrorMessage("You do not have permission to view this job.");
      } else {
        setErrorMessage("Unable to load job details.");
      }
    }

    try {
      const r = {
        jobId: jobId,
      };

      await api.getTailNoteLookup(r);

      setTailDetailsFound(true);
    } catch (err) {
      setTailDetailsFound(false);
    }
  };

  const completeJob = async (
    status,
    hoursWorked,
    minutesWorked,
    numberOfWorkers,
    laborTime
  ) => {
    setCompleteJobModalOpen(false);
    setIsCancelJobModalOpen(false);

    setLoading(true);

    const request = {
      status,
      hours_worked: hoursWorked,
      minutes_worked: minutesWorked,
      number_of_workers: numberOfWorkers,
      labor_time: laborTime,
    };

    try {
      await api.completeJob(jobId, request);

      const updatedJobDetails = {
        ...jobDetails,
        status,
        service_assignments: jobDetails.service_assignments?.map((s) => {
          s = { ...s, status };
          return s;
        }),
        retainer_service_assignments:
          jobDetails.retainer_service_assignments?.map((s) => {
            s = { ...s, status };
            return s;
          }),
      };

      setJobDetails(updatedJobDetails);

      setLoading(false);

      navigate("/jobs");
    } catch (e) {
      toast.error("Unable to update job status.");
      setLoading(false);
    }
  };

  // it could W(Work In Progress) or C(completed) or T(Cancelled)
  const updateJobStatus = async (status) => {
    setCompleteJobModalOpen(false);
    setIsCancelJobModalOpen(false);

    setLoading(true);

    try {
      await api.updateJobStatus(jobId, status);

      const updatedJobDetails = {
        ...jobDetails,
        status,
        service_assignments: jobDetails.service_assignments?.map((s) => {
          s = { ...s, status };
          return s;
        }),
        retainer_service_assignments:
          jobDetails.retainer_service_assignments?.map((s) => {
            s = { ...s, status };
            return s;
          }),
      };

      setJobDetails(updatedJobDetails);

      setLoading(false);

      if (status === "C") {
        navigate("/jobs");
      }
    } catch (e) {
      toast.error("Unable to update job status.");
      setLoading(false);
    }
  };

  const returnJob = async (comment) => {
    setReturnJobModalOpen(false);

    setLoading(true);

    const request = {
      comment,
    };

    try {
      await api.returnJob(jobId, request);

      navigate("/jobs");
    } catch (error) {
      toast.error("Unable to return job.");
      setLoading(false);
    }
  };

  const completeService = async (service_assignment_id) => {
    try {
      const { data } = await api.completeServiceAssignment(
        service_assignment_id
      );

      const updatedJobDetails = {
        ...jobDetails,
        service_assignments: jobDetails.service_assignments?.map((service) => {
          if (service.id === service_assignment_id) {
            service = { ...service, status: "C" };
          }

          return service;
        }),
      };

      setJobDetails(updatedJobDetails);

      if (data.can_complete_job) {
        setCompleteJobModalOpen(true);
      }
    } catch (e) {}
  };

  const completeRetainerService = async (retainer_service_assignment_id) => {
    try {
      const { data } = await api.completeRetainerServiceAssignment(
        retainer_service_assignment_id
      );

      const updatedJobDetails = {
        ...jobDetails,
        retainer_service_assignments:
          jobDetails.retainer_service_assignments?.map((service) => {
            if (service.id === retainer_service_assignment_id) {
              service = { ...service, status: "C" };
            }

            return service;
          }),
      };

      setJobDetails(updatedJobDetails);

      if (data.can_complete_job) {
        setCompleteJobModalOpen(true);
      }
    } catch (e) {}
  };

  const removeService = async (service) => {
    await api.deleteService(service.id);

    const updatedJobDetails = {
      ...jobDetails,
      service_assignments: jobDetails.service_assignments?.filter(
        (s) => s.id !== service.id
      ),
    };

    setJobDetails(updatedJobDetails);
  };

  const removeRetainerService = async (service) => {
    await api.deleteRetainerService(service.id);

    const updatedJobDetails = {
      ...jobDetails,
      retainer_service_assignments:
        jobDetails.retainer_service_assignments?.filter(
          (s) => s.id !== service.id
        ),
    };

    setJobDetails(updatedJobDetails);
  };

  const handleToggleAddServiceModal = () => {
    setAddServiceModalOpen(!isAddServiceModalOpen);
  };

  const handleToggleAddRetainerServiceModal = () => {
    setAddRetainerServiceModalOpen(!isAddRetainerServiceModalOpen);
  };

  const handleAddService = (updatedServices) => {
    setAddServiceModalOpen(false);

    //refetch the job details because you have to rebuild all services
    getJobDetails();
  };

  const handleAddRetainerService = (updatedServices) => {
    setAddRetainerServiceModalOpen(false);

    //refetch the job details because you have to rebuild all services
    getJobDetails();
  };

  const addJobFile = (file) => {
    const updatedJobDetails = {
      ...jobDetails,
      files: [...jobDetails.files, file],
    };

    setJobDetails(updatedJobDetails);
    setJobFileUploadModalOpen(false);
    toast.success("File uploaded successfully.");
  };

  const downloadFile = (file) => {
    const fileUrl =
      "https://res.cloudinary.com/datidxeqm/" + file.file + "?dl=true";
    window.open(fileUrl, "_blank");
  };

  const handleToggleFilePublic = async (file) => {
    const request = {
      is_public: !file.is_public,
    };

    try {
      await api.updateJobFile(file.id, request);

      const updatedJobDetails = {
        ...jobDetails,
        files: jobDetails.files.map((f) => {
          if (f.id === file.id) {
            f = { ...f, is_public: !f.is_public };
          }

          return f;
        }),
      };

      setJobDetails(updatedJobDetails);
    } catch (err) {
      toast.error("Unable to update file privacy.");
    }
  };

  const handleDeleteJobFile = async (file) => {
    try {
      await api.deleteJobFile(file.id);

      const updatedJobDetails = {
        ...jobDetails,
        files: jobDetails.files.filter((f) => f.id !== file.id),
      };

      setJobDetails(updatedJobDetails);
    } catch (err) {
      toast.error("Unable to delete file.");
    }
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && errorMessage && (
        <div className="text-gray-500 m-auto text-center mt-20">
          {errorMessage}
        </div>
      )}

      {!loading && errorMessage == null && (
        <div className="mt-6 max-w-5xl px-2">
          <div className="flex justify-between">
            <div className="">
              <h1 className="text-2xl xl:text-3xl font-bold text-gray-700">
                Job Details
              </h1>
            </div>
            <div>
              {currentUser.isCustomer &&
                (jobDetails.status === "U" ||
                  jobDetails.status === "A" ||
                  jobDetails.status === "S") && (
                  <Link
                    to={`/jobs/${jobDetails.id}/customer-edit`}
                    className="text-xs leading-5 font-semibold bg-slate-400/10
                                rounded-full p-2 text-slate-500
                                flex items-center space-x-2 hover:bg-slate-400/20
                                dark:highlight-white/5"
                  >
                    <PencilIcon className="h-5 w-5 cursor-pointer" />
                  </Link>
                )}
            </div>
          </div>

          {currentUser.isCustomer &&
            (jobDetails.status === "U" ||
              jobDetails.status === "A" ||
              jobDetails.status === "R" ||
              jobDetails.status === "S") && (
              <div className="mt-4 mb-4">
                <button
                  type="button"
                  onClick={() => handleToggleJobCancelModal()}
                  className="inline-flex items-center rounded-md border
                                         border-gray-300 bg-white px-4 py-2 text-xl font-bold
                                          text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                           focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel Job
                </button>
              </div>
            )}

          {!currentUser.isCustomer && (
            <div className="mt-4 mb-4">
              {jobDetails.status === "S" && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => updateJobStatus("W")}
                    className="inline-flex items-center justify-center rounded-md
                                        border border-transparent bg-red-600 px-4 py-2 text-lg
                                        font-bold text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                  >
                    Accept Job
                  </button>
                  {currentUser.isProjectManager && (
                    <button
                      type="button"
                      onClick={() => handleToggleJobReturnModal()}
                      className="rounded bg-white px-4 py-2 text-lg text-gray-900
                                                 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Return Job
                    </button>
                  )}
                </div>
              )}

              {jobDetails.status === "U" && (
                <button
                  type="button"
                  onClick={() => updateJobStatus("A")}
                  className="inline-flex items-center justify-center rounded-md
                                        border border-transparent bg-red-600 px-4 py-2 text-lg
                                        font-bold text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                >
                  Accept Job
                </button>
              )}

              {jobDetails.status === "W" && (
                <button
                  type="button"
                  onClick={() => handleToggleJobCompleteModal()}
                  className="inline-flex items-center justify-center rounded-md
                                        border border-transparent bg-red-500 px-4 py-2 text-lg
                                        font-bold text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                >
                  Complete Job
                </button>
              )}
            </div>
          )}

          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 mt-4">
            <div className="sm:col-span-1">
              <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                Tail Number
              </dt>
              <dd className="mt-1 text-xl text-gray-900 flex gap-1">
                {jobDetails.tailNumber}
                {tailDetailsFound && (
                  <Link
                    to={`/jobs/${jobDetails.id}/tail-details`}
                    className="text-sky-600 ml-1 font-bold cursor-pointer text-xl flex gap-1 relative"
                  >
                    details
                    <ArrowRightIcon
                      className="h-5 w-5 relative"
                      style={{ top: "3px" }}
                    />
                  </Link>
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                Status
              </dt>
              <dd>
                <div
                  className={`mt-1 text-xl text-white rounded-md py-1 px-2 inline-block
                                        ${
                                          jobDetails.status === "A" &&
                                          "bg-blue-500"
                                        }
                                        ${
                                          jobDetails.status === "S" &&
                                          "bg-yellow-500 "
                                        }
                                        ${
                                          jobDetails.status === "U" &&
                                          "bg-indigo-500 "
                                        }
                                        ${
                                          jobDetails.status === "W" &&
                                          "bg-green-500 "
                                        }
                                        ${
                                          jobDetails.status === "R" &&
                                          "bg-purple-500 "
                                        }
                                        ${
                                          jobDetails.status === "C" &&
                                          "bg-green-500 "
                                        }
                                        ${
                                          jobDetails.status === "I" &&
                                          "bg-blue-500"
                                        }
                                        ${
                                          jobDetails.status === "T" &&
                                          "bg-gray-700"
                                        }
                                        `}
                >
                  {jobDetails.status === "A" && "Accepted"}
                  {jobDetails.status === "S" && "Assigned"}
                  {jobDetails.status === "U" && "Submitted"}
                  {jobDetails.status === "W" && "Work In Progress"}
                  {jobDetails.status === "C" && "Complete"}
                  {jobDetails.status === "T" && "Canceled"}
                  {jobDetails.status === "R" && "Review"}
                  {jobDetails.status === "I" && "Invoiced"}
                </div>
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                Airport
              </dt>
              <dd className="mt-1 text-xl text-gray-900">
                {jobDetails.airport?.name}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                Tags
              </dt>
              <dd className="mt-1 text-xl text-gray-900">
                {jobDetails.tags?.length === 0 && (
                  <span className="text-gray-900">None</span>
                )}

                {jobDetails.tags?.map((tag) => (
                  <div
                    key={tag.id}
                    className={`text-lg inline-block rounded-md px-2 py-1 mr-2 border mb-2
                                ${
                                  tag.tag_color === "red" &&
                                  "border-red-500 text-red-500"
                                }
                                ${
                                  tag.tag_color === "orange" &&
                                  "border-orange-500 text-orange-500 "
                                }
                                ${
                                  tag.tag_color === "amber" &&
                                  "border-amber-500 text-amber-500"
                                }
                                ${
                                  tag.tag_color === "indigo" &&
                                  " border-indigo-500 text-indigo-500"
                                }
                                ${
                                  tag.tag_color === "violet" &&
                                  " border-violet-500 text-violet-500"
                                }
                                ${
                                  tag.tag_color === "fuchsia" &&
                                  "border-fuchsia-500 text-fuchsia-500"
                                } 
                                ${
                                  tag.tag_color === "pink" &&
                                  "border-pink-500 text-pink-500"
                                }
                                ${
                                  tag.tag_color === "slate" &&
                                  "border-slate-500 text-gray-500"
                                }
                                ${
                                  tag.tag_color === "lime" &&
                                  "border-lime-500 text-lime-500"
                                }
                                ${
                                  tag.tag_color === "emerald" &&
                                  "border-emerald-500 text-emerald-500"
                                }
                                ${
                                  tag.tag_color === "cyan" &&
                                  "border-cyan-500 text-cyan-500"
                                }
                                ${
                                  tag.tag_color === "blue" &&
                                  "border-blue-500 text-blue-500"
                                }
                            `}
                  >
                    {tag.tag_name}
                  </div>
                ))}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                FBO
              </dt>
              <dd className="mt-1 text-xl text-gray-900">
                {jobDetails.fbo?.name}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                Aircraft Type
              </dt>
              <dd className="mt-1 text-xl text-gray-900">
                {jobDetails.aircraftType?.name}
              </dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                Arrival
              </dt>
              <dd className="mt-1 text-xl text-gray-900">
                {jobDetails.on_site
                  ? "On site"
                  : jobDetails.estimatedETA
                  ? jobDetails.estimatedETA
                  : "No ETA yet"}
              </dd>
            </div>

            {!currentUser.isProjectManager && !currentUser.isCustomer && (
              <div className="sm:col-span-1">
                <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                  Customer
                </dt>
                <dd className="mt-1 text-xl text-gray-900">
                  {jobDetails.customer?.name}
                </dd>
              </div>
            )}

            <div className="sm:col-span-1">
              <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                Departure
              </dt>
              <dd className="mt-1 text-xl text-gray-900">
                {jobDetails.estimatedETD
                  ? jobDetails.estimatedETD
                  : "No ETD yet"}
              </dd>
            </div>

            {currentUser.canSeePrice && (
              <div className="sm:col-span-1">
                <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                  Price
                </dt>
                <dd className="mt-1 text-xl text-gray-900 flex gap-1">
                  {!jobDetails.is_auto_priced && (
                    <div
                      className="inline-flex items-center rounded border
                                                border-gray-300 bg-gray-50 px-1 text-xs
                                                text-gray-600 shadow-sm hover:bg-gray-50"
                    >
                      M
                    </div>
                  )}
                  <div>
                    {"$"}
                    {jobDetails.price
                      ? jobDetails.price.toLocaleString()
                      : "0.00"}
                  </div>
                  {jobDetails.is_auto_priced &&
                    location.pathname.includes("jobs") && (
                      <Link
                        to={`/jobs/${jobDetails.id}/price-breakdown`}
                        className="text-sky-600 ml-1 font-bold cursor-pointer text-xl flex gap-1 relative"
                      >
                        breakdown
                        <ArrowRightIcon
                          className="h-5 w-5 relative"
                          style={{ top: "3px" }}
                        />
                      </Link>
                    )}
                </dd>
              </div>
            )}

            <div className="sm:col-span-1">
              <dt className="text-md xl:text-xl font-bold text-red-600 uppercase tracking-wide">
                Complete Before
              </dt>
              <dd className="mt-1 text-xl text-gray-900">
                {jobDetails.completeBy ? (
                  jobDetails.completeBy
                ) : (
                  <span
                    className="relative inline-flex items-center
                                       rounded-full border border-gray-300 px-2 py-0.5"
                  >
                    <div className="absolute flex flex-shrink-0 items-center justify-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    </div>
                    <div className="ml-3 text-md xl:text-xl text-gray-700">
                      TBD
                    </div>
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <div className="flex justify-end text-md xl:text-xl text-sky-500 cursor-pointer font-semibold">
            <div onClick={() => setShowMore(!showMore)}>
              {showMore ? "Show less" : "Show more"}
            </div>
          </div>

          {showMore && (
            <>
              <div className="border-t-2 border-gray-300 my-8"></div>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 mt-4">
                <div className="sm:col-span-1">
                  <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                    Purchase Order
                  </dt>
                  <dd className="mt-1 text-xl text-gray-900">
                    {jobDetails.purchase_order
                      ? jobDetails.purchase_order
                      : "None"}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                    Requested By
                  </dt>
                  <dd className="mt-1 space-y-5 text-xl text-gray-900 truncate overflow-ellipsis max-w-sm">
                    {jobDetails.requested_by
                      ? jobDetails.requested_by
                      : jobDetails.created_by?.first_name +
                        " " +
                        jobDetails.created_by?.last_name}
                  </dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                    Request Date
                  </dt>
                  <dd className="mt-1 text-xl text-gray-900">
                    {jobDetails.requestDate}
                  </dd>
                </div>

                {jobDetails.completion_date && (
                  <div className="sm:col-span-1">
                    <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                      Completion Date
                    </dt>
                    <dd className="mt-1 text-xl text-gray-900">
                      {jobDetails.completion_date}
                    </dd>
                  </div>
                )}

                <div className="sm:col-span-1">
                  <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                    Customer Purchase Order
                  </dt>
                  <dd className="mt-1 text-xl text-gray-900 truncate overflow-ellipsis  max-w-sm">
                    {jobDetails.customer_purchase_order
                      ? jobDetails.customer_purchase_order
                      : "Not provided"}
                  </dd>
                </div>

                {(currentUser.isAdmin ||
                  currentUser.isSuperUser ||
                  currentUser.isAccountManager ||
                  currentUser.isInternalCoordinator) && (
                  <>
                    <div className="sm:col-span-1">
                      <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                        Time Spent
                      </dt>
                      <dd className="mt-1 text-xl text-gray-900 truncate overflow-ellipsis  max-w-sm">
                        {jobDetails.hours_worked ? jobDetails.hours_worked : 0}{" "}
                        hours{" "}
                        {jobDetails.minutes_worked
                          ? jobDetails.minutes_worked
                          : 0}{" "}
                        minutes
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-md xl:text-xl font-bold text-gray-600 uppercase tracking-wide">
                        Number of Workers
                      </dt>
                      <dd className="mt-1 text-xl text-gray-900 truncate overflow-ellipsis  max-w-sm">
                        {jobDetails.number_of_workers
                          ? jobDetails.number_of_workers
                          : 0}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </>
          )}

          <div className="border-t-2 border-gray-300 my-8"></div>
          <h2 className="text-md xl:text-2xl font-bold text-gray-700 uppercase tracking-wide">
            Special Instructions
          </h2>
          <dd className="mt-4 space-y-5 text-xl text-gray-900">
            {!jobDetails.special_instructions && "None provided"}

            {jobDetails.special_instructions}
          </dd>

          <div className="border-t-2 border-gray-300 my-8"></div>

          <div className="mx-auto mt-8 max-w-5xl pb-8">
            <div className="flex flex-wrap justify-between">
              <h2 className="text-md xl:text-2xl font-bold text-gray-700 uppercase tracking-wide">
                Services
              </h2>
              <div className="flex gap-4 text-right">
                <Switch.Group as="li" className="flex items-center">
                  <div className="flex flex-col">
                    <Switch.Label
                      as="p"
                      className="text-md xl:text-lg text-gray-500"
                      passive
                    >
                      {showActions ? "Hide Actions" : "Show Actions"}
                    </Switch.Label>
                  </div>
                  <Switch
                    checked={showActions}
                    onChange={setShowActions}
                    className={classNames(
                      showActions ? "bg-red-500" : "bg-gray-200",
                      "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        showActions ? "translate-x-5" : "translate-x-0",
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </Switch.Group>
                {currentUser.isCustomer &&
                  (jobDetails.status === "A" || jobDetails.status === "U") && (
                    <button
                      type="button"
                      onClick={handleToggleAddServiceModal}
                      className="inline-flex items-center rounded-md border border-gray-300
                                            bg-white px-4 py-2 text-lg font-bold text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      <PlusIcon
                        className="-ml-2 mr-1 h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Add</span>
                    </button>
                  )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-1">
              {jobDetails.service_assignments?.length === 0 && (
                <div className="text-xl text-gray-500">None</div>
              )}

              {jobDetails.service_assignments?.map((service) => (
                <div
                  key={service.id}
                  className="relative flex space-x-3 rounded-lg
                                        border border-gray-300 bg-white px-6 py-5 shadow-sm
                                        hover:border-gray-400"
                >
                  <div className="min-w-0 flex-1">
                    <div className="focus:outline-none">
                      <div className="grid grid-cols-3 text-md xl:text-xl pb-2">
                        <div className="col-span-2 font-bold text-gray-900 relative top-1">
                          {service.name}
                        </div>
                        <div className="text-right">
                          {currentUser.isCustomer &&
                            (jobDetails.status === "A" ||
                              jobDetails.status === "U") && (
                              <div className="flex justify-end">
                                <TrashIcon
                                  onClick={() => removeService(service)}
                                  className="h-10 w-10 text-gray-400 cursor-pointer"
                                />
                              </div>
                            )}

                          {!currentUser.isCustomer &&
                            service.status === "W" && (
                              <button
                                type="button"
                                onClick={() => completeService(service.id)}
                                className="inline-flex items-center rounded border
                                                                    border-gray-300 bg-white px-2.5 py-1.5 text-xl
                                                                    font-bold text-sky-500 shadow-sm hover:bg-gray-50
                                                                    focus:outline-none cursor-pointer focus:ring-2
                                                                    focus:ring-red-500 focus:ring-offset-2"
                              >
                                Complete
                              </button>
                            )}

                          {service.status === "C" && (
                            <div className="flex-shrink-0 flex justify-end">
                              <CheckCircleIcon className="h-10 w-10 text-green-500" />
                            </div>
                          )}
                        </div>
                      </div>

                      {!currentUser.isProjectManager && (
                        <div
                          className="text-sm xl:text-xl mb-4 relative inline-flex items-center
                                                            rounded-full border border-gray-300 px-3 py-0.5"
                        >
                          {service.project_manager}
                        </div>
                      )}

                      {showActions &&
                        service.checklist_actions?.map((action) => (
                          <div
                            key={action.id}
                            className="text-sm xl:text-xl text-gray-500 py-1"
                          >
                            {action.name}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {(currentUser.isAdmin ||
            currentUser.isProjectManager ||
            currentUser.isSuperUser ||
            currentUser.isAccountManager ||
            currentUser.isInternalCoordinator ||
            (currentUser.isCustomer && currentUser.isPremiumMember)) && (
            <div className="mx-auto max-w-5xl pb-12">
              <div className="flex justify-between">
                <h2 className="text-md xl:text-2xl font-bold text-gray-700 uppercase tracking-wide">
                  Retainer Services
                </h2>
                {currentUser.isCustomer &&
                  (jobDetails.status === "A" || jobDetails.status === "U") && (
                    <button
                      type="button"
                      onClick={handleToggleAddRetainerServiceModal}
                      className="inline-flex items-center rounded-md border border-gray-300
                                            bg-white px-4 py-2 text-xl font-bold text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      <PlusIcon
                        className="-ml-2 mr-1 h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Add</span>
                    </button>
                  )}
              </div>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-1">
                {jobDetails.retainer_service_assignments?.length === 0 && (
                  <div className="text-xl text-gray-500">None</div>
                )}

                {jobDetails.retainer_service_assignments?.map((service) => (
                  <div
                    key={service.id}
                    className="relative flex items-center space-x-3 rounded-lg
                                            border border-gray-300 bg-white px-6 py-5 shadow-sm
                                            hover:border-gray-400"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="">
                        <div className="grid grid-cols-3 text-xl pb-2">
                          <div className="col-span-2 font-bold text-gray-900 relative top-1">
                            {service.name}
                          </div>
                          <div className="text-right">
                            {currentUser.isCustomer &&
                              (jobDetails.status === "A" ||
                                jobDetails.status === "U") && (
                                <div className="flex justify-end">
                                  <TrashIcon
                                    onClick={() =>
                                      removeRetainerService(service)
                                    }
                                    className="h-5 w-5 text-gray-400 cursor-pointer"
                                  />
                                </div>
                              )}

                            {!currentUser.isCustomer &&
                              service.status === "W" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    completeRetainerService(service.id)
                                  }
                                  className="inline-flex items-center rounded border
                                                                    border-gray-300 bg-white px-2.5 py-1.5 text-xl
                                                                    font-bold text-sky-500 shadow-sm hover:bg-gray-50
                                                                    focus:outline-none cursor-pointer focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                  Complete
                                </button>
                              )}

                            {service.status === "C" && (
                              <div className="flex-shrink-0 flex justify-end">
                                <CheckCircleIcon className="h-10 w-10 text-green-500" />
                              </div>
                            )}
                          </div>
                        </div>

                        {!currentUser.isProjectManager &&
                          !currentUser.isCustomer && (
                            <div
                              className="text-xl mb-4 relative inline-flex items-center
                                                                rounded-full border border-gray-300 px-3 py-0.5"
                            >
                              {service.project_manager}
                            </div>
                          )}

                        {showActions &&
                          service.checklist_actions?.map((action) => (
                            <div
                              key={action.id}
                              className="text-xl text-gray-500 py-1"
                            >
                              {action.name}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESKTOP TAIL HISTORY */}
          {serviceActivities.length > 0 && (
            <div className="hidden md:block lg:block xl:block max-w-screen-xl mt-2">
              <div className="flex justify-between">
                <div className="text-2xl font-bold text-gray-600 uppercase tracking-wide">
                  Tail History
                  <span className="text-gray-500 italic text-sm ml-2 tracking-normal">
                    (Last 10 services completed)
                  </span>
                </div>
                <div
                  onClick={() => setShowServiceActivity(!showServiceActivity)}
                  className="text-sky-500 text-lg ml-2 tracking-normal cursor-pointer font-semibold"
                >
                  {showServiceActivity ? "Hide" : "Show"}
                </div>
              </div>
              {showServiceActivity && (
                <div className="">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0 uppercase tracking-wide"
                        >
                          <div className="flex gap-1">Date</div>
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                          P.O
                        </th>
                        {!currentUser.isCustomer && (
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide"
                          >
                            Customer
                          </th>
                        )}
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                          Tail
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                          Airport
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                          FBO
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                          Service
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {serviceActivities.map((service) => (
                        <tr key={service.id}>
                          <td className="px-2 py-2 text-md text-gray-500 sm:pl-0">
                            {service.timestamp}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-md text-sky-500 font-semibold cursor-pointer">
                            <Link to={`/create-job/review/${service.job_id}`}>
                              {service.purchase_order}
                            </Link>
                          </td>
                          {!currentUser.isCustomer && (
                            <td className="whitespace-nowrap px-3 py-2 text-md text-gray-500">
                              <div className="truncate overflow-ellipsis w-60">
                                {service.customer_name}
                              </div>
                            </td>
                          )}
                          <td className="whitespace-nowrap px-3 py-2 text-md text-gray-500">
                            {service.tail_number}
                          </td>
                          <td className="px-3 py-2 text-md text-gray-500">
                            <div className="truncate overflow-ellipsis w-40">
                              {service.airport_name}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-md text-gray-500">
                            {service.fbo_name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-md text-gray-500">
                            <div className=" truncate overflow-ellipsis w-96">
                              {service.service_name}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div>
            <div className="border-t-2 border-gray-300 my-8"></div>
            <div className="flex justify-between gap-4">
              <h2 className="text-md xl:text-2xl font-bold text-gray-700 uppercase tracking-wide">
                Attachments
              </h2>
              <div
                onClick={() => handleToggleJobFileUploadModal()}
                className="flex items-center justify-center rounded-full bg-red-600 p-1
                                                    text-white hover:bg-red-700 focus:outline-none focus:ring-2
                                                        focus:ring-red-500 focus:ring-offset-2 cursor-pointer"
              >
                <svg
                  className="h-6 w-6"
                  x-description="Heroicon name: outline/plus"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  ></path>
                </svg>
              </div>
            </div>

            {jobDetails.files?.length === 0 && (
              <div className="flex justify-center text-center mt-8">
                No file attachments found.
              </div>
            )}

            <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 mt-4">
              {jobDetails.files?.map((file) => (
                <li key={file.id} className="py-3 pl-3 pr-4 text-md">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="flex gap-1">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400 relative top-1"
                        aria-hidden="true"
                      />
                      <div
                        className="text-lg truncate overflow-ellipsis"
                        style={{ maxWidth: "250px" }}
                      >
                        {file.name}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteJobFile(file)}
                        className="inline-flex w-full justify-center rounded-md border
                                                border-gray-300 bg-white px-2 py-1 text-base 
                                                text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                                focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadFile(file)}
                        className="inline-flex w-full justify-center rounded-md border font-medium
                                                border-gray-300 bg-white px-2 py-1 text-base 
                                                text-blue-500 shadow-sm focus:outline-none focus:ring-2
                                                focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between gap-4 mt-1">
                    <div className="text-gray-500 relative top-2 text-md">
                      Uploaded on: {file.created_at}
                    </div>
                    <div>
                      {isAdmin && (
                        <Switch.Group
                          as="li"
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex flex-col">
                            <Switch.Label
                              as="p"
                              className="text-sm font-medium text-gray-900"
                              passive
                            >
                              Public
                            </Switch.Label>
                          </div>
                          <Switch
                            checked={file.is_public}
                            onChange={() => handleToggleFilePublic(file)}
                            className={classNames(
                              file.is_public ? "bg-red-500" : "bg-gray-200",
                              "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            )}
                          >
                            <span
                              aria-hidden="true"
                              className={classNames(
                                file.is_public
                                  ? "translate-x-5"
                                  : "translate-x-0",
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                        </Switch.Group>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* MOBILE TAIL HISTORY */}
          {serviceActivities.length > 0 && (
            <div className="xs:block sm:block xl:hidden lg:hidden md:hidden bg-white shadow sm:rounded-md my-4">
              <div className="flex justify-between font-medium tracking-wide text-xl pb-4">
                <div>Found {serviceActivities.length} previous services</div>
                <div
                  onClick={() => setShowServiceActivity(!showServiceActivity)}
                  className="text-sky-500 text-lg ml-2 tracking-normal"
                >
                  {showServiceActivity ? "Hide" : "Show"}
                </div>
              </div>
              {showServiceActivity && (
                <ul className="divide-y divide-gray-200 text-md text-gray-500">
                  {serviceActivities.map((service) => (
                    <li key={service.id}>
                      <div className="px-2 py-4">
                        <div className="flex justify-between gap-2">
                          <div>{service.timestamp}</div>
                          <div className="text-sky-500">
                            <Link to={`/create-job/review/${service.job_id}`}>
                              {service.purchase_order}
                            </Link>
                          </div>
                        </div>
                        <div className="font-semibold mt-2">
                          {service.service_name}
                        </div>
                        <div className="flex justify-between gap-2 mt-1">
                          <div>
                            <div className="bg-gray-100 p-1 rounded-md">
                              {service.airport_name}
                            </div>
                          </div>
                          <div className="relative top-1">
                            {service.fbo_name}
                          </div>
                          <div className="italic relative top-1">
                            {service.tail_number}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {isCancelJobModalOpen && (
        <JobCancelModal
          isOpen={isCancelJobModalOpen}
          jobDetails={jobDetails}
          handleClose={handleToggleJobCancelModal}
          updateJobStatus={updateJobStatus}
        />
      )}

      {isReturnJobModalOpen && (
        <JobReturnModal
          isOpen={isReturnJobModalOpen}
          jobDetails={jobDetails}
          handleClose={handleToggleJobReturnModal}
          returnJob={returnJob}
        />
      )}

      {isCompleteJobModalOpen && (
        <JobCompleteModal
          isOpen={isCompleteJobModalOpen}
          jobDetails={jobDetails}
          handleClose={handleToggleJobCompleteModal}
          completeJob={completeJob}
        />
      )}

      {isPriceBreakdownModalOpen && (
        <JobPriceBreakdownModal
          isOpen={isPriceBreakdownModalOpen}
          jobDetails={jobDetails}
          handleClose={handleTogglePriceBreakdownModal}
        />
      )}

      {isAddServiceModalOpen && (
        <AddServiceModal
          isOpen={isAddServiceModalOpen}
          handleClose={handleToggleAddServiceModal}
          existingServices={[]}
          projectManagers={[]}
          handleAddService={handleAddService}
          jobId={jobId}
        />
      )}

      {isJobFileUploadModalOpen && (
        <JobFileUploadModal
          isOpen={isJobFileUploadModalOpen}
          handleClose={handleToggleJobFileUploadModal}
          isAdmin={isAdmin}
          jobDetails={jobDetails}
          addJobFile={addJobFile}
        />
      )}

      {isAddRetainerServiceModalOpen && (
        <AddRetainerServiceModal
          isOpen={isAddRetainerServiceModalOpen}
          handleClose={handleToggleAddRetainerServiceModal}
          existingServices={[]}
          projectManagers={[]}
          handleAddService={handleAddRetainerService}
          jobId={jobId}
        />
      )}
    </AnimatedPage>
  );
};

export default JobInfo;
