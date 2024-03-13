import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircleIcon,
  TrashIcon,
  ArrowRightIcon,
  PencilIcon,
  PlusIcon,
  PaperClipIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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
import JobInvoiceModal from "./JobInvoiceModal";

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
  const [isJobInvoiceModalOpen, setJobInvoiceModalOpen] = useState(false);

  const [serviceActivities, setServiceActivities] = useState([]);

  const [isPriceBreakdownModalOpen, setPriceBreakdownModalOpen] =
    useState(false);

  const [isAddServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [isAddRetainerServiceModalOpen, setAddRetainerServiceModalOpen] =
    useState(false);

  const [showActions, setShowActions] = useState(false);
  const currentUser = useAppSelector(selectUser);
  const navigate = useNavigate();

  const [showSpecialInstructions, setShowSpecialInstructions] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [tailDetailsFound, setTailDetailsFound] = useState(false);

  const [priceBreakdown, setPriceBreakdown] = useState({});

  const [steps, setSteps] = useState([]);

  const [invoiceDetails, setInvoiceDetails] = useState(null);

  useEffect(() => {
    getJobDetails();
  }, []);

  const handleToggleJobCompleteModal = () => {
    setCompleteJobModalOpen(!isCompleteJobModalOpen);
  };

  const handleToggleJobCancelModal = () => {
    setIsCancelJobModalOpen(!isCancelJobModalOpen);
  };

  const handleToggleShowSpecialInstructions = () => {
    setShowSpecialInstructions(!showSpecialInstructions);
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
        response.data.isAccountManager
      ) {
        try {
          const r = await api.getJobInvoiceDetails(Number(jobId));
          setInvoiceDetails(r.data);
        } catch (err) {
          toast.error("Unable to get job invoice details.");
        }
      }

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
      const { data } = await api.getJobPriceBreakdown(jobId);

      setPriceBreakdown(data);
    } catch (err) {
      console.log(err);
    }

    try {
      const { data } = await api.getJobActivities(jobId);

      //get the data.results where the activity_type is "S"
      const statusActivities = data.results.filter(
        (s) => s.activity_type === "S"
      );
      const isSubmitted = statusActivities.some((s) => s.status === "U");
      const isAccepted = statusActivities.some((s) => s.status === "A");
      const isAssigned = statusActivities.some((s) => s.status === "S");
      const isWIP = statusActivities.some((s) => s.status === "W");
      const isCompleted = statusActivities.some((s) => s.status === "C");
      const isInvoiced = statusActivities.some((s) => s.status === "I");

      let statusSteps = [
        { name: "Accepted", status: "upcoming", selected: false },
        { name: "Assigned", status: "upcoming", selected: false },
        { name: "WIP", status: "upcoming", selected: false },
        { name: "Completed", status: "upcoming", selected: false },
        { name: "Invoiced", status: "upcoming", selected: false },
      ];

      if (isSubmitted) {
        //add the submitted step to the beginning of the steps array
        statusSteps.unshift({
          name: "Submitted",
          status: "complete",
          selected: false,
        });
      }

      //if isInvoiced is true, all steps should have status complete and selected false
      if (isInvoiced) {
        statusSteps = statusSteps.map((s) => {
          s = { ...s, status: "complete", selected: false };
          return s;
        });
      } else if (isCompleted) {
        // all the steps except the last one should have status complete and selected false
        statusSteps = statusSteps.map((s, index) => {
          if (index < statusSteps.length - 1) {
            s = { ...s, status: "complete", selected: false };
          }
          return s;
        });
      } else if (isWIP) {
        // all the steps except the last two should have status complete and selected false
        statusSteps = statusSteps.map((s, index) => {
          if (index < statusSteps.length - 3) {
            s = { ...s, status: "complete", selected: false };
          }
          return s;
        });

        //search for step with name WIP and set status to current
        statusSteps = statusSteps.map((s) => {
          if (s.name === "WIP") {
            s = { ...s, status: "current", selected: true };
          }
          return s;
        });
      } else if (isAssigned) {
        // all the steps except the last three should have status complete and selected false
        statusSteps = statusSteps.map((s, index) => {
          if (index < statusSteps.length - 3) {
            s = { ...s, status: "complete", selected: false };
          }
          return s;
        });
      } else if (isAccepted) {
        // all the steps except the last four should have status complete and selected false
        statusSteps = statusSteps.map((s, index) => {
          if (index < statusSteps.length - 4) {
            s = { ...s, status: "complete", selected: false };
          }
          return s;
        });
      } else if (isSubmitted) {
        // all the steps except the last five should have status complete and selected false
        statusSteps = statusSteps.map((s, index) => {
          if (index < statusSteps.length - 5) {
            s = { ...s, status: "complete", selected: false };
          }
          return s;
        });
      }

      setSteps(statusSteps);
    } catch (err) {
      toast.error("Unable to get job status");
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
      } else {
        navigate(0);
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

    toast.success("Service removed!.");

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

    toast.success("Retainer removed!.");

    setJobDetails(updatedJobDetails);
  };

  const handleToggleAddServiceModal = () => {
    setAddServiceModalOpen(!isAddServiceModalOpen);
  };

  const handleToggleAddRetainerServiceModal = () => {
    setAddRetainerServiceModalOpen(!isAddRetainerServiceModalOpen);
  };

  const handleToggleJobInvoiceModal = () => {
    setJobInvoiceModalOpen(!isJobInvoiceModalOpen);
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

      toast.success("File deleted!.");
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
        <div className="mt-6 w-full px-2">
          <div className="flex flex-wrap justify-between gap-y-6 gap-x-14">
            <div className=" w-72">
              <h1 className="text-xl xl:text-2xl font-bold text-gray-700 flex gap-2">
                {jobDetails.tailNumber}
                {tailDetailsFound && (
                  <Link
                    to={`/jobs/${jobDetails.id}/tail-details`}
                    className="text-sky-600 ml-1 font-bold cursor-pointer text-xl flex gap-1 relative top-1"
                  >
                    details
                    <ArrowRightIcon
                      className="h-5 w-5 relative"
                      style={{ top: "3px" }}
                    />
                  </Link>
                )}
              </h1>
              <div className="mt-1 text-md">{jobDetails.customer?.name}</div>
            </div>
            <div className="flex-1">
              <div
                className={`xs:block sm:block xl:hidden lg:hidden md:hidden mt-1 text-xl text-white rounded-md py-2 px-4 inline-block 
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
                                        }`}
              >
                {jobDetails.status === "A" && "Accepted"}
                {jobDetails.status === "S" && "Assigned"}
                {jobDetails.status === "U" && "Submitted"}
                {jobDetails.status === "W" && "WIP"}
                {jobDetails.status === "C" && "Complete"}
                {jobDetails.status === "T" && "Canceled"}
                {jobDetails.status === "R" && "Review"}
                {jobDetails.status === "I" && "Invoiced"}
              </div>

              {jobDetails.status !== "T" && (
                <nav
                  aria-label="Progress"
                  className="hidden md:block lg:block xl:block"
                >
                  <ol className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
                    {steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="relative md:flex md:flex-1">
                        {step.status === "complete" ? (
                          <button className="group flex w-full items-center">
                            <span className="flex items-center py-2 px-6 text-sm font-medium">
                              <span
                                className="flex h-10 w-10 flex-shrink-0 items-center justify-center
                                                rounded-full bg-green-500 group-hover:bg-green-700"
                              >
                                <CheckIcon
                                  className="h-6 w-6 text-white"
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="ml-2 text-md font-medium text-gray-900">
                                {step.name}
                              </span>
                            </span>
                          </button>
                        ) : step.status === "current" ? (
                          <button
                            className="flex items-center py-2 px-6 text-sm font-medium"
                            aria-current="step"
                          >
                            <span
                              className="flex h-10 w-10 flex-shrink-0 items-center justify-center
                                                        rounded-full border-2 border-blue-600"
                            >
                              <span className="text-blue-600">
                                {stepIdx + 1}
                              </span>
                            </span>
                            <span className="ml-2 text-md font-medium text-blue-600">
                              {step.name}
                            </span>
                          </button>
                        ) : (
                          <button className="group flex items-center">
                            <span className="flex items-center py-2 px-6 text-sm font-medium">
                              <span
                                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full
                                                            border-2 border-gray-300 group-hover:border-gray-400"
                              >
                                <span className="text-gray-500 group-hover:text-gray-900">
                                  {stepIdx + 1}
                                </span>
                              </span>
                              <span className="ml-2 text-md font-medium text-gray-500 group-hover:text-gray-900">
                                {step.name}
                              </span>
                            </span>
                          </button>
                        )}

                        {stepIdx !== steps.length - 1 ? (
                          <>
                            <div
                              className="absolute top-0 right-0 hidden h-full w-5 md:block"
                              aria-hidden="true"
                            >
                              <svg
                                className="h-full w-full text-gray-300"
                                viewBox="0 0 22 80"
                                fill="none"
                                preserveAspectRatio="none"
                              >
                                <path
                                  d="M0 -2L20 40L0 82"
                                  vectorEffect="non-scaling-stroke"
                                  stroke="currentcolor"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </>
                        ) : null}
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {jobDetails.status === "T" && (
                <div className="hidden md:block lg:block xl:block bg-gray-700 mt-1 text-xl text-white rounded-md py-2 px-4 w-32">
                  Cancelled
                </div>
              )}
            </div>
            <div className="relative top-1">
              {currentUser.isCustomer &&
                (jobDetails.status === "U" ||
                  jobDetails.status === "A" ||
                  jobDetails.status === "R" ||
                  jobDetails.status === "S") && (
                  <div className="text-left lg:text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleJobCancelModal()}
                      className="items-center rounded-md border
                                                border-gray-300 bg-white px-4 py-2 text-md font-bold
                                                text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                                focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                      Cancel Job
                    </button>
                  </div>
                )}

              {!currentUser.isCustomer && (
                <div className="text-left lg:text-right">
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

                  {jobDetails.status === "A" && (
                    <button
                      type="button"
                      onClick={() => navigate(`/jobs/${jobId}/assignments`)}
                      className="inline-flex items-center justify-center rounded-md
                                                border border-transparent bg-red-600 px-4 py-2 text-lg
                                                font-bold text-white shadow-sm hover:bg-red-700
                                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Assign Job
                    </button>
                  )}

                  {jobDetails.status === "W" && (
                    <button
                      type="button"
                      onClick={() => handleToggleJobCompleteModal()}
                      className="inline-flex items-center justify-center rounded-md
                                                border border-transparent bg-red-500 px-4 py-2 text-lg
                                                font-medium text-white shadow-sm hover:bg-red-700
                                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                    >
                      Complete Job
                    </button>
                  )}

                  {jobDetails.status === "C" &&
                    currentUser.enableInvoices &&
                    (currentUser.isAdmin ||
                      currentUser.isSuperUser ||
                      currentUser.isAccountManager) && (
                      <button
                        type="button"
                        onClick={() => handleToggleJobInvoiceModal()}
                        className="inline-flex items-center justify-center rounded-md
                                                      border border-transparent bg-red-500 px-4 py-2 text-lg
                                                      font-medium text-white shadow-sm hover:bg-red-700
                                                      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                      >
                        Invoice Job
                      </button>
                    )}
                </div>
              )}
            </div>
          </div>
          {jobDetails.tags?.map((tag) => (
            <div
              key={tag.id}
              className={`text-lg inline-block rounded-md px-2 py-1 mr-2 border mb-2 mt-4
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

          <div className="grid 3xl:grid-cols-4 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 mt-6 gap-6">
            {/* LOCATION AND TIMES */}
            <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
              <div className="p-4 bg-gray-100">
                <h3 className="text-base font-bold leading-7 text-gray-900 uppercase">
                  Location and Times
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900">
                      Airport:
                    </dt>
                    <dd className="text-md text-gray-700">
                      {jobDetails.airport?.name}
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900">FBO:</dt>
                    <dd className="text-md text-gray-700">
                      {jobDetails.fbo?.name}
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900">
                      Arrival:
                    </dt>
                    <dd className="text-md text-gray-700">
                      {jobDetails.on_site
                        ? "On site"
                        : jobDetails.estimatedETA
                        ? jobDetails.estimatedETA
                        : "No ETA yet"}
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900">
                      Departure:
                    </dt>
                    <dd className="text-md text-gray-700">
                      {jobDetails.estimatedETD
                        ? jobDetails.estimatedETD
                        : "No ETD yet"}
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900">
                      Complete Before:
                    </dt>
                    <dd className="text-md text-gray-700">
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
                          <div className="ml-3 text-md text-gray-700">TBD</div>
                        </span>
                      )}
                    </dd>
                  </div>
                  {jobDetails.completion_date && (
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Completed:
                      </dt>
                      <dd className="text-md text-gray-700">
                        {jobDetails.completion_date}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
            {/* JOB INFO */}
            <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
              <div className="px-4 py-3 bg-gray-100">
                <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                  Job Info
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900">
                      Aircraft Type:
                    </dt>
                    <dd className="text-md text-gray-700">
                      {jobDetails.aircraftType?.name}
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900">
                      Customer PO:
                    </dt>
                    <dd className="text-md text-gray-700">
                      {jobDetails.customer_purchase_order
                        ? jobDetails.customer_purchase_order
                        : "Not provided"}
                    </dd>
                  </div>
                  {(currentUser.isAdmin ||
                    currentUser.isSuperUser ||
                    currentUser.isAccountManager ||
                    currentUser.isInternalCoordinator ||
                    currentUser.isCustomer) && (
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Requested By:
                      </dt>
                      <dd className="text-md text-gray-700">
                        {jobDetails.requested_by
                          ? jobDetails.requested_by
                          : jobDetails.created_by?.first_name +
                            " " +
                            jobDetails.created_by?.last_name}
                      </dd>
                    </div>
                  )}
                  <div className="px-4 py-3 flex gap-4">
                    <dt className="text-md font-bold text-gray-900">
                      Request Date:
                    </dt>
                    <dd className="text-md text-gray-700">
                      {jobDetails.requestDate}
                    </dd>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-4">
                    <dt className="text-md flex justify-between gap-4">
                      <div className="font-bold text-gray-900">
                        Special Instructions:
                      </div>
                      <div>
                        {showSpecialInstructions ? (
                          <ChevronUpIcon
                            onClick={handleToggleShowSpecialInstructions}
                            className="h-5 w-5 text-gray-500 cursor-pointer relative top-1"
                          />
                        ) : (
                          <ChevronDownIcon
                            onClick={handleToggleShowSpecialInstructions}
                            className="h-5 w-5 text-gray-500 cursor-pointer relative top-1"
                          />
                        )}
                      </div>
                    </dt>
                    {showSpecialInstructions && (
                      <dd className="text-md text-gray-700">
                        {!jobDetails.special_instructions && "None provided"}
                        {jobDetails.special_instructions}
                      </dd>
                    )}
                  </div>
                </dl>
              </div>
            </div>

            {/* SERVICES */}
            <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
              <div className="px-4 py-3 bg-gray-100 flex justify-between gap-4">
                <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                  Services
                </h3>
                <div className="flex gap-4">
                  <Switch.Group as="li" className="flex items-center">
                    <div className="flex flex-col">
                      <Switch.Label
                        as="p"
                        className="text-sm text-gray-700"
                        passive
                      >
                        {showActions ? "Hide Actions" : "Show Actions"}
                      </Switch.Label>
                    </div>
                    <Switch
                      checked={showActions}
                      onChange={setShowActions}
                      className={classNames(
                        showActions ? "bg-sky-500" : "bg-gray-200",
                        "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
                    (jobDetails.status === "A" ||
                      jobDetails.status === "U") && (
                      <button
                        type="button"
                        onClick={handleToggleAddServiceModal}
                        className="inline-flex items-center rounded border
                        border-sky-400 bg-white px-2 py-1 text-sm
                        font-medium text-sky-500 shadow-sm hover:bg-gray-50
                        focus:outline-none cursor-pointer"
                      >
                        <span>Add</span>
                      </button>
                    )}
                </div>
              </div>
              <div
                className="border-t border-gray-200 overflow-y-auto "
                style={{ maxHeight: "500px" }}
              >
                {jobDetails.service_assignments?.length === 0 && (
                  <div className="mx-auto flex justify-center text-center my-8">
                    No services found.
                  </div>
                )}

                {jobDetails.service_assignments?.map((service) => (
                  <dl key={service.id} className="divide-y divide-gray-100">
                    <div className="px-4 py-3 flex gap-4 hover:bg-gray-50 border-b border-gray-200">
                      <dt className="text-md flex-1">
                        <div className="text-gray-900">{service.name}</div>
                        {service.project_manager && (
                          <div className="text-gray-500">
                            {service.project_manager}
                          </div>
                        )}
                      </dt>
                      <dd className="text-md text-gray-700 text-right">
                        {currentUser.isCustomer &&
                          (jobDetails.status === "A" ||
                            jobDetails.status === "U") && (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => removeService(service)}
                                className="inline-flex items-center rounded border
                                                                            border-sky-400 bg-white px-2 py-1 text-sm
                                                                            font-medium text-sky-500 shadow-sm hover:bg-gray-50
                                                                            focus:outline-none cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          )}

                        {!currentUser.isCustomer && service.status === "W" && (
                          <button
                            type="button"
                            onClick={() => completeService(service.id)}
                            className="inline-flex items-center rounded border
                                                                        border-sky-400 bg-white px-2.5 py-1.5 text-md
                                                                        font-medium text-sky-500 shadow-sm hover:bg-gray-50
                                                                        focus:outline-none cursor-pointer"
                          >
                            Complete
                          </button>
                        )}

                        {service.status === "C" && (
                          <div className="flex-shrink-0 flex justify-end">
                            <CheckCircleIcon className="h-10 w-10 text-green-500" />
                          </div>
                        )}
                      </dd>
                    </div>
                    {showActions &&
                      service.checklist_actions?.map((action) => (
                        <div
                          key={action.id}
                          className="text-sm text-gray-500 px-6 py-1"
                        >
                          {action.name}
                        </div>
                      ))}
                  </dl>
                ))}
              </div>
            </div>
            {/* RETAINERS */}
            {(currentUser.isAdmin ||
              currentUser.isProjectManager ||
              currentUser.isSuperUser ||
              currentUser.isAccountManager ||
              currentUser.isInternalCoordinator ||
              (currentUser.isCustomer && currentUser.isPremiumMember)) && (
              <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
                <div className="px-4 py-3 bg-gray-100 flex justify-between gap-4">
                  <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                    Retainer Services
                  </h3>
                  {currentUser.isCustomer &&
                    (jobDetails.status === "A" ||
                      jobDetails.status === "U") && (
                      <button
                        type="button"
                        onClick={handleToggleAddRetainerServiceModal}
                        className="inline-flex items-center rounded border
                        border-sky-400 bg-white px-2 py-1 text-sm
                        font-medium text-sky-500 shadow-sm hover:bg-gray-50
                        focus:outline-none cursor-pointer"
                      >
                        <span>Add</span>
                      </button>
                    )}
                </div>
                <div
                  className="border-t border-gray-200 overflow-y-auto"
                  style={{ maxHeight: "500px" }}
                >
                  {jobDetails.retainer_service_assignments?.length === 0 && (
                    <div className="mx-auto flex justify-center text-center my-12">
                      No retainers found.
                    </div>
                  )}

                  {jobDetails.retainer_service_assignments?.map((service) => (
                    <dl key={service.id} className="divide-y divide-gray-100">
                      <div className="px-4 py-3 flex gap-4 hover:bg-gray-50 border-b border-gray-200">
                        <dt className="text-md flex-1">
                          <div className="text-gray-900">{service.name}</div>
                          {service.project_manager && (
                            <div className="text-gray-500">
                              {service.project_manager}
                            </div>
                          )}
                        </dt>
                        <dd className="text-md text-gray-700 text-right">
                          {currentUser.isCustomer &&
                            (jobDetails.status === "A" ||
                              jobDetails.status === "U") && (
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => removeRetainerService(service)}
                                  className="inline-flex items-center rounded border
                                                                                border-sky-400 bg-white px-2 py-1 text-sm
                                                                                font-medium text-sky-500 shadow-sm hover:bg-gray-50
                                                                                focus:outline-none cursor-pointer focus:ring-2
                                                                                focus:ring-sky-500 focus:ring-offset-2"
                                >
                                  Remove
                                </button>
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
                                                                            border-sky-400 bg-white px-2.5 py-1.5 text-md
                                                                            font-medium text-sky-500 shadow-sm hover:bg-gray-50
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
                        </dd>
                      </div>
                    </dl>
                  ))}
                </div>
              </div>
            )}
            {/* ATTACHMENTS */}
            {(currentUser.isAdmin ||
              currentUser.isSuperUser ||
              currentUser.isAccountManager ||
              currentUser.isCustomer) && (
              <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
                <div className="px-4 py-3 bg-gray-100 flex justify-between border-b border-gray-200">
                  <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                    Attachments
                  </h3>
                  <button
                    type="button"
                    onClick={handleToggleJobFileUploadModal}
                    className="inline-flex items-center rounded border
                        border-sky-400 bg-white px-2 py-1 text-sm
                        font-medium text-sky-500 shadow-sm hover:bg-gray-50
                        focus:outline-none cursor-pointer"
                  >
                    <span>Add</span>
                  </button>
                </div>
                {jobDetails.files?.length === 0 && (
                  <div className="flex justify-center text-center my-12 text-md">
                    No file attachments found.
                  </div>
                )}

                {jobDetails.files?.length > 0 && (
                  <ul className="divide-y divide-gray-200 rounded-md border-b border-gray-200">
                    {jobDetails.files?.map((file) => (
                      <li key={file.id} className="p-6 text-md">
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
                                                        text-sky-500 shadow-sm focus:outline-none focus:ring-2
                                                        focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
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
                                    file.is_public
                                      ? "bg-sky-500"
                                      : "bg-gray-200",
                                    "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
                )}
              </div>
            )}
            {/* LABOR */}
            {(currentUser.isAdmin ||
              currentUser.isSuperUser ||
              currentUser.isAccountManager ||
              currentUser.isInternalCoordinator) && (
              <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
                <div className="p-4 bg-gray-100">
                  <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                    Labor
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Time Spent:
                      </dt>
                      <dd className="text-md text-gray-700">
                        {jobDetails.hours_worked ? jobDetails.hours_worked : 0}{" "}
                        hours{" "}
                        {jobDetails.minutes_worked
                          ? jobDetails.minutes_worked
                          : 0}{" "}
                        minutes
                      </dd>
                    </div>
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Number of Workers:
                      </dt>
                      <dd className="text-md text-gray-700">
                        {jobDetails.number_of_workers
                          ? jobDetails.number_of_workers
                          : 0}
                      </dd>
                    </div>
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Labor Time:
                      </dt>
                      <dd className="text-md text-gray-700">
                        {jobDetails.labor_time
                          ? jobDetails.labor_time.toFixed(1)
                          : 0}{" "}
                        hr
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* INVOICE DETAILS */}
            {(currentUser.isAdmin ||
              currentUser.isSuperUser ||
              currentUser.isAccountManager ||
              currentUser.isInternalCoordinator) && (
              <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
                <div className="p-4 bg-gray-100">
                  <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                    Invoice Details
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <dl className="divide-y divide-gray-100">
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Internal Additional Cost:
                      </dt>
                      <dd className="text-md text-gray-700">
                        $
                        {invoiceDetails?.internal_additional_cost
                          ? invoiceDetails?.internal_additional_cost
                          : 0}
                      </dd>
                    </div>
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Vendor:
                      </dt>
                      <dd className="text-md text-gray-700">
                        {invoiceDetails?.vendor?.name
                          ? invoiceDetails?.vendor?.name
                          : "Not specified"}
                      </dd>
                    </div>
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Vendor Charge:
                      </dt>
                      <dd className="text-md text-gray-700">
                        $
                        {invoiceDetails?.vendor?.charge
                          ? invoiceDetails?.vendor?.charge
                          : 0}
                      </dd>
                    </div>
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Vendor Additional Cost:
                      </dt>
                      <dd className="text-md text-gray-700">
                        $
                        {invoiceDetails?.vendor?.additional_cost
                          ? invoiceDetails?.vendor?.additional_cost
                          : 0}
                      </dd>
                    </div>
                    <div className="px-4 py-3 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Subcontractor Profit:
                      </dt>
                      <dd className="text-md text-gray-700">
                        $
                        {invoiceDetails?.subcontractor_profit
                          ? invoiceDetails?.subcontractor_profit
                          : 0}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>

          {currentUser.canSeePrice && (
            <div className="grid grid-cols-1 mt-6 gap-6">
              <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
                <div className="p-4 bg-gray-100">
                  <h3 className="text-base font-bold leading-7 text-gray-900 uppercase">
                    Price Breakdown
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  {!jobDetails.is_auto_priced && (
                    <div className="p-4 flex gap-4">
                      <dt className="text-md font-bold text-gray-900">
                        Price (manually set):
                      </dt>
                      <dd className="text-md text-gray-700">
                        {"$"}
                        {jobDetails.price
                          ? jobDetails.price.toLocaleString()
                          : "0.00"}
                      </dd>
                    </div>
                  )}

                  {jobDetails.is_auto_priced && (
                    <div>
                      <div className="p-4">
                        <div className="flex justify-between text-md">
                          <div className="text-xl text-gray-700">
                            {priceBreakdown.aircraftType}
                          </div>
                          <div>
                            <span
                              className="relative bg-sky-100 text-sky-500 rounded-md p-1 font-medium"
                              style={{ top: "2px" }}
                            >
                              {priceBreakdown.priceListType}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="text-lg text-gray-700 font-medium">
                            Services
                          </h3>
                          <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                            {priceBreakdown.services?.map((service) => (
                              <div
                                key={service.id}
                                className="flex justify-between py-2 text-lg hover:bg-gray-50"
                              >
                                <dt className="text-gray-500 pr-2 truncate">
                                  {service.name}
                                </dt>
                                <dd className="whitespace-nowrap text-gray-900">
                                  ${service.price}
                                </dd>
                              </div>
                            ))}
                          </dl>
                          <div className="flex justify-end pt-2 text-lg mt-1">
                            <dt className="text-gray-500 pr-2 text-right font-medium">
                              Subtotal
                            </dt>
                            <dd className="whitespace-nowrap text-gray-900">
                              ${priceBreakdown.servicesPrice}
                            </dd>
                          </div>
                        </div>

                        {priceBreakdown.discounts?.length > 0 && (
                          <div className="">
                            <h3 className="text-lg text-gray-700 font-medium">
                              Discounts Applied
                            </h3>
                            <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                              {priceBreakdown.discounts.map((discount) => (
                                <div
                                  key={discount.id}
                                  className="flex justify-between py-2 text-lg hover:bg-gray-50"
                                >
                                  <dt className="text-gray-500 pr-2 truncate">
                                    {discount.name === "S" ? "By Service" : ""}
                                    {discount.name === "A" ? "By Airport" : ""}
                                    {discount.name === "G" ? "General" : ""}
                                  </dt>
                                  <dd className="whitespace-nowrap text-gray-900">
                                    {discount.isPercentage && (
                                      <>
                                        {discount.discount}
                                        {"%"}
                                        <span className="text-gray-500">
                                          {" ("}$
                                          {discount.discount_dollar_amount}
                                          {")"}
                                        </span>
                                      </>
                                    )}

                                    {!discount.isPercentage && (
                                      <>
                                        {"$"}
                                        {discount.discount}
                                      </>
                                    )}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                            <div className="flex justify-end py-2 text-lg mt-1">
                              <dt className="text-gray-500 pr-2 text-right font-medium">
                                Subtotal
                              </dt>
                              <dd className="whitespace-nowrap text-gray-900">
                                ${priceBreakdown.discountedPrice}
                              </dd>
                            </div>
                          </div>
                        )}

                        {priceBreakdown.additionalFees?.length > 0 && (
                          <div className="">
                            <h3 className="text-lg text-gray-700">
                              Additional Fees Applied
                            </h3>
                            <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                              {priceBreakdown.additionalFees.map((fee) => (
                                <div
                                  key={fee.id}
                                  className="flex justify-between py-2 text-lg hover:bg-gray-50"
                                >
                                  <dt className="text-gray-500 pr-2 truncate">
                                    {fee.name === "A" ? "By Airport" : ""}
                                    {fee.name === "F" ? "By FBO" : ""}
                                    {fee.name === "G" ? "General" : ""}
                                  </dt>
                                  <dd className="whitespace-nowrap text-gray-900">
                                    {fee.isPercentage && (
                                      <>
                                        {fee.fee}
                                        {"%"}
                                        <span className="text-gray-500">
                                          {" ("}$
                                          {fee.additional_fee_dollar_amount}
                                          {")"}
                                        </span>
                                      </>
                                    )}

                                    {!fee.isPercentage && (
                                      <>
                                        {"$"}
                                        {fee.fee}
                                      </>
                                    )}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        )}

                        <div className="flex justify-end pb-4 text-lg">
                          <dt className="text-gray-500 pr-2 text-right font-medium">
                            Total
                          </dt>
                          <dd className="whitespace-nowrap text-gray-900">
                            ${priceBreakdown.totalPrice}
                          </dd>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {serviceActivities.length > 0 && (
            <div className="mt-6">
              <div className="relative overflow-hidden rounded-lg border border-gray-300">
                <div className="p-4 bg-gray-100">
                  <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                    Tail History
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="p-4">
                    {serviceActivities.length > 0 && (
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
                                <Link
                                  to={`/create-job/review/${service.job_id}`}
                                >
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
                    )}
                  </div>
                </div>
              </div>
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
      {isJobInvoiceModalOpen && (
        <JobInvoiceModal
          isOpen={isJobInvoiceModalOpen}
          handleClose={handleToggleJobInvoiceModal}
          invoiceDetails={invoiceDetails}
        />
      )}
    </AnimatedPage>
  );
};

export default JobInfo;
