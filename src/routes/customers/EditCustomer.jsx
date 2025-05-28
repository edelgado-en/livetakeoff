import { useState, useEffect, Fragment } from "react";
import Loader from "../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { Listbox, Transition } from "@headlessui/react";
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

const EditCustomer = () => {
  const { customerId } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [exteriorServiceChecker, setExteriorServiceChecker] = useState(0);

  const [billingInfo, setBillingInfo] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const [priceList, setPriceList] = useState([]);
  const [priceListSelected, setPriceListSelected] = useState("");

  const [retainerAmount, setRetainerAmount] = useState("");

  useEffect(() => {
    //getPriceList()
    getCustomerDetails();
  }, []);

  const getCustomerDetails = async () => {
    setLoading(true);

    try {
      const response = await api.getPriceList();

      setPriceList(response.data.results);

      const { data } = await api.getCustomerDetails(customerId);

      setName(data.name);
      setAbout(data.about);
      setPhoneNumber(data.phone_number);
      setBillingAddress(data.billingAddress);
      setEmailAddress(data.emailAddress);
      setBillingInfo(data.billingInfo);
      setSpecialInstructions(data.settings.special_instructions);
      setPriceListSelected(data.settings.price_list);
      setRetainerAmount(data.settings.retainer_amount);
      setExteriorServiceChecker(data.exterior_service_checker);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const editCustomer = async () => {
    if (name.length === 0) {
      alert("Please enter a name");
      return;
    }

    const request = {
      name,
      about,
      phoneNumber,
      billingAddress,
      emailAddress,
      billingInfo,
      specialInstructions,
      priceListId: priceListSelected.id,
      retainerAmount,
      exterior_service_checker: exteriorServiceChecker,
    };

    setLoading(true);

    try {
      await api.editCustomer(customerId, request);

      setLoading(false);

      //navigate('/customers/' + data.id + '/profile/details')
      navigate(-1);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSetRetainerAmount = (e) => {
    const value = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setRetainerAmount(value);
  };

  const handleSetExteriorServiceChecker = (e) => {
    const value = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setExteriorServiceChecker(value);
  };

  const getPriceList = async () => {
    const { data } = await api.getPriceList();

    setPriceList(data.results);
    setPriceListSelected(data.results[0]);
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <div className="mx-auto max-w-6xl px-8 pb-16 lg:pb-12 antialiased overflow-hidden border py-4 rounded-lg mb-20">
          <div>
            <h1 className="text-xl font-semibold text-gray-600">
              Edit customer
            </h1>
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
                        Must be unique. Different customers cannot share the
                        same name.
                      </span>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="about"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      About
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <textarea
                        id="about"
                        name="about"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        rows={3}
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                      focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Write a few sentences about this customer.
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
                      Phone Number
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <Input
                        country="US"
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                          focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
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
                      Email address
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        id="email"
                        name="email"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        type="email"
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="billingInfo"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Billing Info
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        value={billingInfo}
                        onChange={(e) => setBillingInfo(e.target.value)}
                        name="billingInfo"
                        id="billingInfo"
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="instructions"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Special Instructions
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        name="instructions"
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        id="instructions"
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="region"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Price List
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <Listbox
                        value={priceListSelected}
                        onChange={setPriceListSelected}
                      >
                        {({ open }) => (
                          <>
                            <div className="relative mt-1">
                              <Listbox.Button
                                className="relative w-full max-w-lg sm:max-w-xs sm:text-sm
                                                                cursor-default rounded-md border
                                                                border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                shadow-sm focus:border-sky-500 focus:outline-none
                                                                focus:ring-1 focus:ring-sky-500"
                              >
                                <span className="block truncate">
                                  {priceListSelected
                                    ? priceListSelected.name
                                    : "Select price list"}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options
                                  className="absolute z-10 mt-1 max-h-60 w-80 overflow-auto
                                                                      rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                      ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                                >
                                  {priceList.map((price) => (
                                    <Listbox.Option
                                      key={price.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "text-white bg-red-600"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                      value={price}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate"
                                            )}
                                          >
                                            {price.name}
                                          </span>
                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? "text-white"
                                                  : "text-red-600",
                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="retainerAmount"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Retainer Amount (monthly)
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        value={retainerAmount}
                        onChange={(e) =>
                          handleSetRetainerAmount(e.target.value)
                        }
                        name="retainerAmount"
                        id="retainerAmount"
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                    <label
                      htmlFor="retainerAmount"
                      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >
                      Exterior Service Checker
                    </label>
                    <div className="mt-1 sm:col-span-2 sm:mt-0">
                      <input
                        type="text"
                        value={exteriorServiceChecker}
                        onChange={(e) =>
                          handleSetExteriorServiceChecker(e.target.value)
                        }
                        name="serviceChecker"
                        id="serviceChecker"
                        className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-sm"
                      />
                    </div>
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
                  onClick={() => editCustomer()}
                  className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-sm font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
                >
                  Edit Customer
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </AnimatedPage>
  );
};

export default EditCustomer;
