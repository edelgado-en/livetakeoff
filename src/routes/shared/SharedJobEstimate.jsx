import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/outline";
import * as api from "./apiService";
import { toast } from "react-toastify";
import logo from "../../images/logo_red-no-text.png";

import ReactTimeAgo from "react-time-ago";

import Input from "react-phone-number-input/input";

import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

const ShareJobEstimate = () => {
  const [loading, setLoading] = useState(true);
  const [estimateDetails, setEstimateDetails] = useState(null);
  const [estimateProcessed, setEstimateProcessed] = useState(false);

  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const { encoded_id } = useParams();

  useEffect(() => {
    getEstimate();
  }, []);

  const getEstimate = async () => {
    setLoading(true);

    try {
      const { data } = await api.getEstimateDetail(encoded_id);

      setEstimateDetails(data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Unable to load estimate");
    }
  };

  const updateEstimate = async (status) => {
    if (status === "A") {
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
    }

    setLoading(true);

    const request = {
      status: status,
      full_name: fullName,
      email: emailAddress,
      phone: phoneNumber,
    };

    try {
      await api.updateEstimate(encoded_id, request);

      setEstimateProcessed(true);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Unable to update estimate");
    }
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <div className="mt-4 m-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 gap-2 pb-10">
            <div>
              <img
                className="block h-20 w-auto"
                src={logo}
                alt="Livetakeoff logo"
              />
            </div>
            <div className="text-right text-md text-gray-500">
              <div className="text-xl font-medium text-gray-700">
                LiveTakeoff
              </div>
              <div>750 SW 34th ST, Suite 209</div>
              <div>Fort Lauderdale Florida 33315</div>
            </div>
          </div>

          {estimateProcessed && (
            <div className="py-36 w-full text-center">
              <div className="flex justify-center pb-2">
                <CheckCircleIcon
                  className="h-12 w-12 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="font-medium text-2xl">Thank you!</div>
              <div className="text-lg mt-1">
                {estimateDetails?.requested_by?.username} has been notified.
              </div>
            </div>
          )}

          {!estimateProcessed && (
            <>
              <div className="flex justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-600">
                    Job Estimate
                  </h1>
                </div>
                {(estimateDetails?.status === "A" ||
                  estimateDetails?.status === "R") && (
                  <div
                    className={`text-md text-white rounded-md py-1 px-2
                                            ${
                                              estimateDetails.status === "A" &&
                                              "bg-green-500 "
                                            }
                                            ${
                                              estimateDetails.status === "R" &&
                                              "bg-gray-500 "
                                            }
                                            `}
                  >
                    <div className="relative font-medium">
                      {estimateDetails.status === "A" && "Approved"}
                      {estimateDetails.status === "R" && "Rejected"}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
                <div>
                  <div className="flex space-x-3 space-y-3 pb-8 pt-6">
                    {estimateDetails?.customer.logo ? (
                      <img
                        className="h-10 w-10 rounded-full relative top-3"
                        src={estimateDetails.customer.logo}
                        alt=""
                      />
                    ) : (
                      <div className="flex relative top-3">
                        <span className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      </div>
                    )}
                    <div className="">
                      <div className="font-medium text-md">
                        {estimateDetails?.customer.name}
                      </div>
                      <div className="text-md text-gray-500">
                        {estimateDetails?.customer.emailAddress}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-md text-gray-700 xl:text-right xs:text-left pb-2">
                    Created by
                  </div>
                  <div className="flex xl:justify-end xs:justify-start space-x-3 space-y-3">
                    {estimateDetails?.requested_by.profile?.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={estimateDetails.requested_by.profile.avatar}
                        alt=""
                      />
                    ) : (
                      <div className="flex">
                        <span className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="text-md font-medium text-gray-700">
                        {estimateDetails?.requested_by.first_name}{" "}
                        {estimateDetails?.requested_by.last_name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 max-w-7xl px-2 pb-10">
                <div className="mt-2">
                  <div className="flex flex-wrap justify-between text-md gap-2">
                    <div className="flex flex-wrap gap-1">
                      <div className="font-medium">Tail Number:</div>
                      <div>{estimateDetails.tailNumber}</div>
                    </div>
                    <div className="text-md  text-gray-700">
                      <div className="flex flex-wrap gap-1">
                        <div className="font-medium">Aircraft:</div>
                        <div>{estimateDetails.aircraftType?.name}</div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <div className="font-medium">Airport:</div>
                        <div>{estimateDetails?.airport?.initials}</div>
                      </div>
                    </div>
                  </div>
                  {/* DESKTOP */}
                  <div className="hidden md:block lg:block xl:block -mx-4 mt-8 sm:-mx-0">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                          >
                            ID
                          </th>
                          <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                          >
                            Service
                          </th>
                          <th
                            scope="col"
                            className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-sm font-semibold text-gray-900 text-right"
                          >
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {estimateDetails?.services?.map((service, index) => (
                          <tr key={service.id}>
                            <td className="relative w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                              <div className="absolute top-6">
                                {index + 1}
                                <dl className="font-normal lg:hidden">
                                  <dd className=" mt-1 truncate text-gray-700 font-medium">
                                    {service.name}
                                  </dd>
                                  <dd className="mt-1 truncate text-gray-500 sm:hidden">
                                    {service.email}
                                  </dd>
                                </dl>
                              </div>
                            </td>
                            <td className="relative hidden px-3 py-4 text-sm text-gray-700 lg:table-cell font-medium items-start">
                              <div className="absolute top-6">
                                {service.name}
                              </div>
                            </td>
                            <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                              <div className="overflow-auto h-56">
                                <textarea
                                  class="w-full border-none bg-transparent overflow-hidden outline-none"
                                  style={{ height: "450px" }}
                                  readonly
                                >
                                  {service.description}
                                </textarea>
                              </div>
                            </td>
                            <td className="relative whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium">
                              <div className="absolute top-6 right-2">
                                ${service.price}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {estimateDetails?.show_totals && (
                      <div className="flex justify-end text-right font-medium border-b border-gray-200 pb-2">
                        Subtotal: $
                        {estimateDetails?.services_price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  {/* MOBILE */}
                  <div className="xs:block sm:block xl:hidden lg:hidden md:hidden mt-4">
                    <h3 className="text-md text-gray-700">Services</h3>
                    <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                      {estimateDetails?.services?.map((service) => (
                        <div
                          key={service.id}
                          className="flex justify-between py-2 text-md hover:bg-gray-50"
                        >
                          <dt className="text-gray-700 pr-2 truncate">
                            {service.name}
                          </dt>
                          <dd className="whitespace-nowrap text-gray-900">
                            ${service.price}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {estimateDetails?.show_totals && (
                      <div className="flex justify-end py-2 text-md mt-1">
                        <dt className="text-gray-700 pr-2 text-right font-medium">
                          Subtotal
                        </dt>
                        <dd className="whitespace-nowrap text-gray-900">
                          ${estimateDetails?.services_price.toLocaleString()}
                        </dd>
                      </div>
                    )}
                  </div>

                  {estimateDetails?.job_estimate_discounts?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-md text-gray-700">
                        Discounts Applied
                      </h3>
                      <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                        {estimateDetails.job_estimate_discounts.map(
                          (discount, index) => (
                            <div
                              key={index}
                              className="flex justify-between py-2 text-md hover:bg-gray-50"
                            >
                              <dt className="text-gray-700 pr-2 truncate">
                                {discount.type === "S" ? "By Service" : ""}
                                {discount.type === "A" ? "By Airport" : ""}
                                {discount.type === "G" ? "General" : ""}
                              </dt>
                              <dd className="whitespace-nowrap text-gray-900">
                                {!discount.percentage ? "$" : ""}
                                {discount.amount}
                                {discount.percentage ? "%" : ""}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>

                      {estimateDetails?.show_totals && (
                        <div className="flex justify-end py-2 text-md mt-1">
                          <dt className="text-gray-500 pr-2 text-right font-medium">
                            Subtotal
                          </dt>
                          <dd className="whitespace-nowrap text-gray-900">
                            $
                            {estimateDetails?.discounted_price.toLocaleString()}
                          </dd>
                        </div>
                      )}
                    </div>
                  )}

                  {estimateDetails?.job_estimate_additional_fees?.length >
                    0 && (
                    <div className="mt-4">
                      <h3 className="text-md text-gray-700">
                        Additional Fees Applied
                      </h3>
                      <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                        {estimateDetails.job_estimate_additional_fees.map(
                          (fee, index) => (
                            <div
                              key={index}
                              className="flex justify-between py-2 text-md hover:bg-gray-50"
                            >
                              <dt className="text-gray-700 pr-2 truncate">
                                {fee.type === "A" ? "Travel Fees" : ""}
                                {fee.type === "F" ? "FBO fees" : ""}
                                {fee.type === "G" ? "General" : ""}
                                {fee.type === "V"
                                  ? "Vendor Price Difference"
                                  : ""}
                                {fee.type === "M" ? "Management Fees" : ""}
                              </dt>
                              <dd className="whitespace-nowrap text-gray-900">
                                {!fee.percentage ? "$" : ""}
                                {fee.amount}
                                {fee.percentage ? "%" : ""}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>
                    </div>
                  )}

                  {estimateDetails?.show_totals && (
                    <div className="flex justify-end py-4 text-md">
                      <dt className="text-black pr-2 text-right font-bold">
                        Total
                      </dt>
                      <dd className="whitespace-nowrap text-black font-bold">
                        ${estimateDetails?.total_price.toLocaleString()}
                      </dd>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                {!estimateDetails.is_processed && (
                  <>
                    <div className="text-md pb-4 font-medium">
                      This estimate is not a contract or a bill.
                    </div>
                    <div className="font-medium text-md pb-4">
                      We look forward to working with you!
                    </div>
                    <div className="m-auto flex flex-col justify-center">
                      <div className="text-md font-medium text-center">
                        Please complete the following information to approve
                        this estimate.
                      </div>
                      <div className="m-auto w-80 mt-6 text-left">
                        <label
                          htmlFor="fullName"
                          className="text-md text-gray-600"
                        >
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
                      <div className="m-auto w-80 mt-6 text-left">
                        <label
                          htmlFor="email"
                          className="text-md text-gray-600"
                        >
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
                      <div className="m-auto w-80 mt-6 text-left">
                        <label
                          htmlFor="phone"
                          className="text-md text-gray-600"
                        >
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
                    </div>

                    <div className="pb-20 py-8">
                      <button
                        type="button"
                        onClick={() => updateEstimate("R")}
                        className="rounded-md border border-gray-300 bg-white
                                                py-2 px-4 text-md font-medium text-gray-700 shadow-sm mr-6
                                                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => updateEstimate("A")}
                        className="inline-flex justify-center rounded-md 
                                            border border-transparent bg-red-600 py-2 px-4
                                            text-md font-medium text-white shadow-sm hover:bg-red-600
                                            focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Approve
                      </button>
                    </div>
                  </>
                )}

                {estimateDetails.is_processed && (
                  <>
                    <div className="text-md pb-20 py-8 font-medium">
                      This estimate was{" "}
                      {estimateDetails.status === "A"
                        ? "confirmed"
                        : "rejected"}{" "}
                      <ReactTimeAgo
                        date={new Date(estimateDetails?.processed_at)}
                        locale="en-US"
                        timeStyle="twitter"
                      />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </AnimatedPage>
  );
};

export default ShareJobEstimate;
