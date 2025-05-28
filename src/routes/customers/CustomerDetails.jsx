import { useEffect, useState } from "react";
import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import { Dialog, Transition, Switch, Menu } from "@headlessui/react";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import * as api from "./apiService";

const formatPhoneNumber = (phoneNumberString) => {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    var intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }

  return null;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customerDetails, setCustomerDetails] = useState(null);

  useEffect(() => {
    getCustomerDetails();
  }, [customerId]);

  const getCustomerDetails = async () => {
    try {
      const { data } = await api.getCustomerDetails(customerId);

      setCustomerDetails(data);
    } catch (err) {}
  };

  const updateShowSpendingInfo = async () => {
    const request = {
      show_spending_info: !customerDetails.settings.show_spending_info,
    };

    try {
      const { data } = await api.updateCustomerSetting(
        customerDetails.settings.id,
        request
      );

      const updatedCustomerDetails = {
        ...customerDetails,
        settings: {
          ...customerDetails.settings,
          show_spending_info: data.show_spending_info,
        },
      };

      setCustomerDetails(updatedCustomerDetails);
    } catch (error) {}
  };

  const updateAllowCancelJob = async () => {
    const request = {
      allow_cancel_job: !customerDetails.settings.allow_cancel_job,
    };

    try {
      const { data } = await api.updateCustomerSetting(
        customerDetails.settings.id,
        request
      );

      const updatedCustomerDetails = {
        ...customerDetails,
        settings: {
          ...customerDetails.settings,
          allow_cancel_job: data.allow_cancel_job,
        },
      };

      setCustomerDetails(updatedCustomerDetails);
    } catch (error) {}
  };

  const updateShowJobPrice = async () => {
    const request = {
      show_job_price: !customerDetails.settings.show_job_price,
    };

    try {
      const { data } = await api.updateCustomerSetting(
        customerDetails.settings.id,
        request
      );

      const updatedCustomerDetails = {
        ...customerDetails,
        settings: {
          ...customerDetails.settings,
          show_job_price: data.show_job_price,
        },
      };

      setCustomerDetails(updatedCustomerDetails);
    } catch (error) {}
  };

  return (
    <AnimatedPage>
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-md text-gray-900">
              {customerDetails?.phone_number
                ? formatPhoneNumber(customerDetails.phone_number)
                : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-md text-gray-900">
              {customerDetails?.emailAddress
                ? customerDetails?.emailAddress
                : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">
              Billing Address
            </dt>
            <dd className="mt-1 text-md text-gray-900">
              {customerDetails?.billingAddress
                ? customerDetails?.billingAddress
                : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">Billing Info</dt>
            <dd className="mt-1 text-md text-gray-900">
              {customerDetails?.billingInfo
                ? customerDetails?.billingInfo
                : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">Instructions</dt>
            <dd className="mt-1 text-md text-gray-900">
              {customerDetails?.settings?.special_instructions
                ? customerDetails?.settings?.special_instructions
                : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">Price List</dt>
            <dd className="mt-1 text-md text-gray-900">
              {customerDetails?.settings?.price_list.name}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">
              Retainer Amount (monthly)
            </dt>
            <dd className="mt-1 text-md text-gray-900">
              {customerDetails?.settings?.retainer_amount
                ? "$" +
                  customerDetails?.settings?.retainer_amount.toLocaleString()
                : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">Active</dt>
            <dd className="mt-1 text-md text-gray-900">
              {customerDetails?.active ? "Yes" : "No"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">About</dt>
            <dd className="mt-1 max-w-prose space-y-5 text-md text-gray-900">
              {customerDetails?.about
                ? customerDetails?.about
                : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">
              Exterior Service Checker
            </dt>
            <dd className="mt-1 max-w-prose space-y-5 text-md text-gray-900">
              {customerDetails?.exterior_service_checker
                ? customerDetails?.exterior_service_checker
                : "Not specified"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Settings list */}
      <div className="mx-auto mt-8 max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="divide-y divide-gray-200 pt-6">
          <div className="">
            <div>
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                Settings
              </h2>
              <p className="mt-1 text-md text-gray-500">
                Control what all users associated with this customer can see and
                do.
              </p>
            </div>
            <ul role="list" className="mt-2 divide-y divide-gray-200">
              <Switch.Group
                as="li"
                className="flex items-center justify-between py-4"
              >
                <div className="flex flex-col">
                  <Switch.Label
                    as="p"
                    className="text-md font-medium text-gray-900"
                    passive
                  >
                    Show Spending Info
                  </Switch.Label>
                  <Switch.Description className="text-md text-gray-500">
                    Controls whether to show the "Spending Info" in the customer
                    dashboard for this customer.
                  </Switch.Description>
                </div>
                <Switch
                  checked={customerDetails?.settings?.show_spending_info}
                  onChange={() => updateShowSpendingInfo()}
                  className={classNames(
                    customerDetails?.settings?.show_spending_info
                      ? "bg-red-500"
                      : "bg-gray-200",
                    "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      customerDetails?.settings?.show_spending_info
                        ? "translate-x-5"
                        : "translate-x-0",
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
              </Switch.Group>
              <Switch.Group
                as="li"
                className="flex items-center justify-between py-4"
              >
                <div className="flex flex-col">
                  <Switch.Label
                    as="p"
                    className="text-md font-medium text-gray-900"
                    passive
                  >
                    Allow Cancel Job
                  </Switch.Label>
                  <Switch.Description className="text-md text-gray-500">
                    Controls whether this customer can cancel a job while the
                    status is "submitted" or "accepted"
                  </Switch.Description>
                </div>
                <Switch
                  checked={customerDetails?.settings?.allow_cancel_job}
                  onChange={() => updateAllowCancelJob()}
                  className={classNames(
                    customerDetails?.settings?.allow_cancel_job
                      ? "bg-red-500"
                      : "bg-gray-200",
                    "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={classNames(
                      customerDetails?.settings?.allow_cancel_job
                        ? "translate-x-5"
                        : "translate-x-0",
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    )}
                  />
                </Switch>
              </Switch.Group>
              {/* <Switch.Group as="li" className="flex items-center justify-between py-4">
                        <div className="flex flex-col">
                          <Switch.Label as="p" className="text-md font-medium text-gray-900" passive>
                            Show Job Price
                          </Switch.Label>
                          <Switch.Description className="text-md text-gray-500">
                            Controls whether the customer can see the job price across different screens in the app.
                          </Switch.Description>
                        </div>
                        <Switch
                          checked={customerDetails?.settings?.show_job_price}
                          onChange={() => updateShowJobPrice()}
                          className={classNames(
                            customerDetails?.settings?.show_job_price ? 'bg-red-500' : 'bg-gray-200',
                            'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={classNames(
                              customerDetails?.settings?.show_job_price ? 'translate-x-5' : 'translate-x-0',
                              'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                            )}
                          />
                        </Switch>
                      </Switch.Group> */}
            </ul>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CustomerDetails;
