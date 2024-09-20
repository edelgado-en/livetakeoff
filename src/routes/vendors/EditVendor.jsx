import { useState, useEffect, Fragment } from "react";
import Loader from "../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { Listbox, Transition, Switch } from "@headlessui/react";
import { PlusIcon, CheckIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

import Input from "react-phone-number-input/input";
import { set } from "react-hook-form";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ChevronUpDownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

const EditVendor = () => {
  const { vendorId } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [emails, setEmails] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    //getPriceList()
    getVendorDetails();
  }, []);

  const getVendorDetails = async () => {
    setLoading(true);

    try {
      const { data } = await api.getVendorDetails(vendorId);

      setName(data.name);
      setNotes(data.notes);
      setPhoneNumbers(data.phone_numbers);
      setBillingAddress(data.billing_address);
      setEmails(data.emails);
      setActive(data.active);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const editVendor = async () => {
    if (name.length === 0) {
      alert("Please enter a name");
      return;
    }

    const request = {
      name,
      notes,
      phoneNumbers,
      billingAddress,
      emails,
      active,
    };

    setLoading(true);

    try {
      await api.editVendor(vendorId, request);

      setLoading(false);

      navigate(-1);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleToggleActive = () => {
    setActive(!active);
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <div className="mx-auto max-w-6xl px-8 pb-16 lg:pb-12 antialiased overflow-hidden border py-4 rounded-lg mb-20">
          <div>
            <h1 className="text-xl font-semibold text-gray-600">Edit vendor</h1>
          </div>
          <form className="space-y-8 divide-y divide-gray-200 mt-6">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
              <div className="space-y-6 sm:space-y-5">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Profile
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    This information will be displayed publicly so be careful
                    what you share.
                  </p>
                </div>

                <div className="space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Name *
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      />
                      <span className="text-sm text-gray-500">
                        Must be unique. Different vendors cannot share the same
                        name.
                      </span>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Notes
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <textarea
                        id="notes"
                        name="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={10}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                      focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Write a few sentences about this vendor.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Detailed Information
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Billing and contact information.
                  </p>
                </div>
                <div className="space-y-6 sm:space-y-5">
                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Phone Numbers
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="phoneNumbers"
                        id="phoneNumbers"
                        value={phoneNumbers}
                        placeholder="Enter phone numbers separated by commas"
                        onChange={(e) => setPhoneNumbers(e.target.value)}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="billingAddress"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Billing Address
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="billingAddress"
                        id="billingAddress"
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Emails
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        id="email"
                        name="email"
                        value={emails}
                        placeholder="Enter emails separated by commas"
                        onChange={(e) => setEmails(e.target.value)}
                        type="email"
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
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
                          Active
                        </Switch.Label>
                        <Switch.Description className="text-md text-gray-500">
                          Controls whether this vendor should be active or not.
                        </Switch.Description>
                      </div>
                      <Switch
                        checked={active}
                        onChange={() => handleToggleActive()}
                        className={classNames(
                          active ? "bg-red-500" : "bg-gray-200",
                          "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            active ? "translate-x-5" : "translate-x-0",
                            "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          )}
                        />
                      </Switch>
                    </Switch.Group>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10">
              <div className="flex justify-end">
                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium
                            text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                              focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => editVendor()}
                  className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-sm font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
                >
                  Edit Vendor
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </AnimatedPage>
  );
};

export default EditVendor;
