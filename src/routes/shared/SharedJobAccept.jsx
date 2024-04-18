import { useEffect, useState } from "react";
import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import {
  CheckCircleIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";
import * as api from "./apiService";

import { Switch } from "@headlessui/react";

import Input from "react-phone-number-input/input";

import { toast } from "react-toastify";

import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SharedJobAccept = () => {
  const { encoded_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState({
    service_assignments: [],
    retainer_service_assignments: [],
  });
  const [showActions, setShowActions] = useState(false);
  const [showSpecialInstructions, setShowSpecialInstructions] = useState(false);

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isJobReturned, setIsJobReturned] = useState(false);

  const [isVendorAccepted, setIsVendorAccepted] = useState(false);

  useEffect(() => {
    getJobDetails();
  }, []);

  const getJobDetails = async () => {
    setLoading(true);

    try {
      const { data } = await api.getJobDetails(encoded_id);

      const vendorAcceptedTag = data.tags.find(
        (tag) => tag.tag_name === "Vendor Accepted"
      );

      if (vendorAcceptedTag) {
        setIsVendorAccepted(true);
      }

      setJobDetails(data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleToggleShowSpecialInstructions = () => {
    setShowSpecialInstructions(!showSpecialInstructions);
  };

  const handleReturnJob = async () => {
    if (fullName.length === 0) {
      alert("Please enter your full name.");
      return;
    }

    if (emailAddress.length === 0) {
      alert("Please enter your email address.");
      return;
    }

    if (phoneNumber.length === 0) {
      alert("Please enter your phone number.");
      return;
    }

    try {
      const data = {
        full_name: fullName,
        email: emailAddress,
        phone: phoneNumber,
      };

      await api.returnJob(encoded_id, data);

      setIsJobReturned(true);

      toast.success("Job returned!.");
    } catch (err) {
      toast.error("Error accepting job.");
    }
  };

  const handleAcceptJob = async () => {
    if (fullName.length === 0) {
      alert("Please enter your full name.");
      return;
    }

    if (emailAddress.length === 0) {
      alert("Please enter your email address.");
      return;
    }

    if (phoneNumber.length === 0) {
      alert("Please enter your phone number.");
      return;
    }

    try {
      const data = {
        full_name: fullName,
        email: emailAddress,
        phone: phoneNumber,
      };

      await api.acceptJob(encoded_id, data);

      setIsVendorAccepted(true);

      toast.success("Job accepted!.");
    } catch (err) {
      toast.error("Error accepting job.");
    }
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <div
          className="xl:px-16 px-4 m-auto max-w-7xl -mt-4"
          style={{ maxWidth: "2100px" }}
        >
          {jobDetails.status !== "S" && (
            <div className="m-auto flex flex-col justify-center my-28 text-center text-lg">
              <div className="text-2xl font-semibold">
                This job has already been processed.
              </div>
            </div>
          )}

          {jobDetails.status === "S" && isVendorAccepted && (
            <div className="m-auto flex flex-col justify-center my-28 text-center text-lg">
              <div>
                <div className="text-2xl font-semibold">
                  Thank you for accepting this job
                </div>
                <div className="mt-2">
                  Please login to Livetakeoff{" "}
                  <a
                    href={`https://www.livetakeoff.com/jobs/${jobDetails.id}/details`}
                    className="mx-1 text-blue-500 cursor-pointer underline"
                  >
                    here
                  </a>{" "}
                  to start the job whenever you are ready.
                </div>
              </div>
            </div>
          )}

          {jobDetails.status === "S" && isJobReturned && (
            <div className="m-auto flex flex-col justify-center my-28 text-center text-lg">
              <div className="text-2xl font-semibold">
                Thank you for returning this job.
              </div>
            </div>
          )}

          {jobDetails.status === "S" && !isVendorAccepted && !isJobReturned && (
            <>
              <div className="m-auto flex flex-col justify-center">
                <div className="text-xl text-gray-700 text-center mt-3">
                  Please complete the following information to accept or return
                  this job.
                </div>
                <div className="m-auto w-80 mt-6">
                  <label htmlFor="fullName" className="text-lg text-gray-600">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      name="fullName"
                      id="fullName"
                      className="block w-full rounded-md border-gray-300 shadow-sm
                                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="m-auto w-80 mt-6">
                  <label htmlFor="email" className="text-lg text-gray-600">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      name="email"
                      id="email"
                      className="block w-full rounded-md border-gray-300 shadow-sm
                                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="m-auto w-80 mt-6">
                  <label htmlFor="phone" className="text-lg text-gray-600">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <Input
                      country="US"
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                          focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                    />
                  </div>
                </div>

                <div className="m-auto w-11/12 flex justify-center mt-8 gap-6">
                  <button
                    onClick={() => handleAcceptJob()}
                    className={`relative inline-flex items-center rounded-md border border-transparent
                                        bg-red-600 px-4 py-2 text-xl front-medium text-white shadow-sm
                                            hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2 text-center justify-center`}
                  >
                    Accept Job
                  </button>
                  <button
                    onClick={() => handleReturnJob()}
                    className="inline-flex items-center justify-center rounded-md border
                                      border-gray-300 bg-white px-4 py-2 text-xl
                                      text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                  >
                    Return Job
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-y-6 mt-12">
                <div className=" w-72">
                  <h1 className="text-xl xl:text-2xl font-bold text-gray-700 flex gap-2">
                    {jobDetails.tailNumber}
                  </h1>
                  <div className="mt-1 text-md">
                    {jobDetails.customer?.name}
                  </div>
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

              <div className="grid 3xl:grid-cols-4 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 my-6 gap-6">
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
                        <dt className="text-md font-bold text-gray-900">
                          FBO:
                        </dt>
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
                              <div className="ml-3 text-md text-gray-700">
                                TBD
                              </div>
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
                            {!jobDetails.special_instructions &&
                              "None provided"}
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

                {/* RETAINER SERVICES */}
                <div className="relative overflow-hidden rounded-lg border border-gray-300 ">
                  <div className="px-4 py-3 bg-gray-100 flex justify-between gap-4">
                    <h3 className="text-base font-semibold leading-7 text-gray-900 uppercase">
                      Retainer Services
                    </h3>
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
              </div>
            </>
          )}
        </div>
      )}
    </AnimatedPage>
  );
};

export default SharedJobAccept;
