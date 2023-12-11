import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import ReactTimeAgo from "react-time-ago";

import Loader from "../../components/loader/Loader";
import * as api from "./apiService";
import { toast } from "react-toastify";

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

const UserDetails = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(true);

  const [airports, setAirports] = useState([]);
  const [totalAirports, setTotalAirports] = useState(0);
  const [loadingAirports, setLoadingAirports] = useState(false);
  const [airportSearchText, setAirportSearchText] = useState("");
  const [airportAlreadyAdded, setAirportAlreadyAdded] = useState(false);
  const [availableAirports, setAvailableAirports] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerSearchText, setCustomerSearchText] = useState("");
  const [customerAlreadyAdded, setCustomerAlreadyAdded] = useState(false);
  const [availableCustomers, setAvailableCustomers] = useState([]);

  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locations, setLocations] = useState([]);
  const [totalLocations, setTotalLocations] = useState(0);
  const [locationSearchText, setLocationSearchText] = useState("");
  const [locationAlreadyAdded, setLocationAlreadyAdded] = useState(false);

  const [availableLocations, setAvailableLocations] = useState([]);

  const [defaultEmail, setDefaultEmail] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState([]);

  const [additionalEmailOpen, setAdditionalEmailOpen] = useState(false);
  const [newAdditionalEmail, setNewAdditionalEmail] = useState("");

  const [showEmailSection, setShowEmailSection] = useState(false);
  const [showLocationSection, setShowLocationSection] = useState(false);
  const [showAirportSection, setShowAirportSection] = useState(false);
  const [showCustomerSection, setShowCustomerSection] = useState(false);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getAirports();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [airportSearchText]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getCustomers();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [customerSearchText]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      getLocations();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [locationSearchText]);

  useEffect(() => {
    getUserDetails();
    getAvailableAirports();
    getUserCustomers();
    getLocationsForUser();
    setAirportAlreadyAdded(false);
    setLocationAlreadyAdded(false);
  }, [userId]);

  const getAirports = async () => {
    setLoadingAirports(true);
    try {
      const request = {
        name: airportSearchText,
      };

      const { data } = await api.getAirports(request);

      setAirports(data.results);
      setTotalAirports(data.count);
      setAirportAlreadyAdded(false);
    } catch (error) {
      toast.error("Unable to get airports");
    }
    setLoadingAirports(false);
  };

  const getCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const request = {
        name: customerSearchText,
      };

      const { data } = await api.getCustomers(request);

      setCustomers(data.results);
      setTotalCustomers(data.count);
      setCustomerAlreadyAdded(false);
    } catch (error) {
      toast.error("Unable to get customers");
    }

    setLoadingCustomers(false);
  };

  const getLocations = async () => {
    setLoadingLocations(true);

    const request = {
      name: locationSearchText,
    };

    try {
      const { data } = await api.getLocations(request);

      setLocations(data.results);
      setTotalLocations(data.count);
      setLocationAlreadyAdded(false);
    } catch (error) {
      toast.error("Unable to get locations");
    }

    setLoadingLocations(false);
  };

  const getUserDetails = async () => {
    setLoading(true);

    try {
      const { data } = await api.getUserDetails(userId);

      setUserDetails(data);
      setAdditionalEmails(data.additional_emails);
      setDefaultEmail(data.email);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getAvailableAirports = async () => {
    try {
      const { data } = await api.getUserAvailableAirports(userId);

      setAvailableAirports(data);
    } catch (err) {
      toast.error("Unable to get airports for user");
    }
  };

  const getUserCustomers = async () => {
    try {
      const { data } = await api.getUserCustomers(userId);

      setAvailableCustomers(data);
    } catch (err) {
      toast.error("Unable to get customers for user");
    }
  };

  const getLocationsForUser = async () => {
    try {
      const { data } = await api.getLocationsForUser(userId);

      setAvailableLocations(data);
    } catch (err) {
      toast.error("Unable to get locations for user");
    }
  };

  const addAvailableAirport = async (airportId) => {
    const request = {
      user_id: userId,
      airport_id: airportId,
      action: "add",
    };

    try {
      // check if airportId already exists in available airports array
      const airportExists = availableAirports.find(
        (airport) => airport.id === airportId
      );

      if (airportExists) {
        setAirportAlreadyAdded(true);
      } else {
        const { data } = await api.updateUserAvailableAirport(request);
        setAirportAlreadyAdded(false);
        setAvailableAirports([...availableAirports, data]);
      }
    } catch (error) {
      setAirportAlreadyAdded(false);
    }
  };

  const addUserCustomer = async (customerId) => {
    const request = {
      user_id: userId,
      customer_id: customerId,
      action: "add",
    };

    try {
      // check if customerId already exists in available customers array
      const customerExists = availableCustomers.find(
        (customer) => customer.id === customerId
      );

      if (customerExists) {
        setCustomerAlreadyAdded(true);
      } else {
        const { data } = await api.updateUserCustomer(request);
        setCustomerAlreadyAdded(false);
        setAvailableCustomers([...availableCustomers, data]);

        toast.success("Customer added");
      }
    } catch (error) {
      setCustomerAlreadyAdded(false);
    }
  };

  const addAvailableLocation = async (locationId) => {
    const request = {
      user_id: userId,
      location_id: locationId,
      action: "add",
    };

    try {
      // check if locationId already exists in available locations array
      const locationExists = availableLocations.find(
        (location) => location.id === locationId
      );

      if (locationExists) {
        setLocationAlreadyAdded(true);
      } else {
        const { data } = await api.updateUserAvailableLocation(userId, request);
        setLocationAlreadyAdded(false);
        setAvailableLocations([...availableLocations, data]);

        toast.success("Location added");
      }
    } catch (err) {
      toast.error("Unable to add location");
    }
  };

  const deleteAvailableAirport = async (airportId) => {
    try {
      const request = {
        user_id: userId,
        airport_id: airportId,
        action: "delete",
      };

      await api.updateUserAvailableAirport(request);

      setAirportAlreadyAdded(false);

      setAvailableAirports(
        availableAirports.filter((airport) => airport.id !== airportId)
      );

      toast.success("Airport removed");
    } catch (error) {
      toast.error("Unable to remove airport");
    }
  };

  const deleteUserCustomer = async (customerId) => {
    try {
      const request = {
        user_id: userId,
        customer_id: customerId,
        action: "delete",
      };

      await api.updateUserCustomer(request);

      setCustomerAlreadyAdded(false);

      setAvailableCustomers(
        availableCustomers.filter((customer) => customer.id !== customerId)
      );

      toast.success("Customer removed");
    } catch (error) {
      toast.error("Unable to remove customer");
    }
  };

  const deleteAvailableLocation = async (locationId) => {
    try {
      const request = {
        user_id: userId,
        location_id: locationId,
        action: "delete",
      };

      await api.updateUserAvailableLocation(userId, request);

      setLocationAlreadyAdded(false);

      setAvailableLocations(
        availableLocations.filter((location) => location.id !== locationId)
      );

      toast.success("Location removed");
    } catch (err) {
      toast.error("Unable to remove location");
    }
  };

  const saveDefaultEmail = async () => {
    try {
      const request = {
        email: defaultEmail,
      };

      await api.updateUser(userId, request);

      toast.success("Default email saved");
    } catch (err) {
      toast.error("Unable to save default email");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      getAirports();
    }
  };

  const handleKeyDownCustomers = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      getCustomers();
    }
  };

  const handleKeyDownLocations = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      getLocations();
    }
  };

  const handleAdditionalEmailOpen = () => {
    setAdditionalEmailOpen(true);
    setNewAdditionalEmail("");
  };

  const handleAddAdditionalEmail = async () => {
    try {
      const request = {
        new_additional_email: newAdditionalEmail,
        user_id: userId,
      };

      const { data } = await api.addNewAdditionalEmail(request);

      setAdditionalEmails([...additionalEmails, data]);
      setAdditionalEmailOpen(false);

      toast.success("Additional email added");
    } catch (err) {
      toast.error("Email already exists");
    }
  };

  const updateAdditionalEmail = async (additionalEmail) => {
    try {
      const request = {
        user_id: userId,
        email: additionalEmail.email,
      };

      await api.updateAdditionalEmail(additionalEmail.id, request);

      toast.success("Additional email updated");
    } catch (err) {
      toast.error("Unable to update additional email");
    }
  };

  const deleteAdditionalEmail = async (userEmailId) => {
    try {
      await api.deleteAdditionalEmail(userEmailId);

      setAdditionalEmails(
        additionalEmails.filter((email) => email.id !== userEmailId)
      );

      toast.success("Additional email deleted");
    } catch (err) {
      toast.error("Unable to delete additional email");
    }
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <div className=" max-w-7xl m-auto">
          <div className="xl:grid xl:grid-cols-8">
            <div className="xl:col-span-6 xl:border-r xl:border-gray-200 xl:pr-8">
              <img
                className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
                src={userDetails.avatar}
                alt=""
              />
              <h3 className="mt-4 text-xl font-medium text-center text-gray-900">
                {userDetails.first_name} {userDetails.last_name}
              </h3>
              <div className="mt-1 text-sm text-gray-500 text-center">
                {userDetails.email}
              </div>

              {/* Mobile */}
              <aside className="mt-8 xl:hidden px-4">
                <div className="font-medium">General Info</div>
                <div className="grid grid-cols-2 mt-2 gap-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Member Since
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <ReactTimeAgo
                        date={new Date(userDetails.member_since)}
                        locale="en-US"
                        timeStyle="twitter"
                      />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      First Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetails.first_name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Username
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetails.username}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Last Name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetails.last_name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Phone Number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetails.phone_number
                        ? userDetails.phone_number
                        : "Not specified"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Location
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetails.location
                        ? userDetails.location
                        : "Not specified"}
                    </dd>
                  </div>
                </div>
              </aside>

              <div className="mt-8 border border-gray-200 rounded-md p-6 pb-8">
                <div
                  className="flex justify-between cursor-pointer"
                  onClick={() => setShowEmailSection(!showEmailSection)}
                >
                  <div className="flex-1">
                    <div className="font-medium text-xl">Emails</div>
                    <div className="text-md text-gray-500 mt-1">
                      Configure default and additional emails. Customers will
                      receive notifications to all emails listed here.
                    </div>
                  </div>
                  <div className="">
                    {showEmailSection && (
                      <ChevronUpIcon className="h-5 w-5 relative top-4" />
                    )}
                    {!showEmailSection && (
                      <ChevronDownIcon className="h-5 w-5 relative top-4" />
                    )}
                  </div>
                </div>

                {showEmailSection && (
                  <div>
                    <div className="text-lg  mt-6">Default Email</div>
                    <div className="mt-2 flex justify-between gap-2">
                      <input
                        type="email"
                        value={defaultEmail}
                        onChange={(event) =>
                          setDefaultEmail(event.target.value)
                        }
                        name="defaultEmail"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                        focus:ring-blue-600 text-md sm:leading-6"
                        placeholder="you@example.com"
                      />
                      <button
                        type="button"
                        onClick={() => saveDefaultEmail()}
                        className="rounded bg-white py-2 text-md
                                        text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 px-4"
                      >
                        Save
                      </button>
                    </div>

                    <div className="flex justify-between text-lg mt-12">
                      <div>Additional Emails</div>
                      <div
                        onClick={() => handleAdditionalEmailOpen()}
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

                    {additionalEmailOpen && (
                      <div className="mt-6 flex justify-between gap-2">
                        <input
                          type="email"
                          value={newAdditionalEmail}
                          onChange={(event) =>
                            setNewAdditionalEmail(event.target.value)
                          }
                          name="newAdditionalEmail"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                        focus:ring-blue-600 text-md sm:leading-6"
                          placeholder="you@example.com"
                        />
                        <button
                          type="button"
                          onClick={() => setAdditionalEmailOpen(false)}
                          className="rounded bg-white py-2 text-md
                                        text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 px-4"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddAdditionalEmail()}
                          className="rounded bg-white py-2 text-md
                                        text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 px-4"
                        >
                          Save
                        </button>
                      </div>
                    )}

                    {additionalEmails.length === 0 && (
                      <div className="text-center m-auto mt-8 text-md">
                        No additional emails set.
                      </div>
                    )}

                    {additionalEmails.map((additionalEmail, index) => (
                      <div
                        key={index}
                        className="mt-4 flex justify-between gap-3"
                      >
                        <input
                          type="email"
                          value={additionalEmail.email}
                          onChange={(event) =>
                            setAdditionalEmails(
                              additionalEmails.map((email) =>
                                email.id === additionalEmail.id
                                  ? { ...email, email: event.target.value }
                                  : email
                              )
                            )
                          }
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1
                                                ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                                focus:ring-blue-600 text-md sm:leading-6"
                          placeholder="you@example.com"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            deleteAdditionalEmail(additionalEmail.id)
                          }
                          className="rounded bg-white py-2 text-md
                                                text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 px-4"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => updateAdditionalEmail(additionalEmail)}
                          className="rounded bg-white py-2 text-md
                                                text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 px-4"
                        >
                          Save
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {(userDetails.is_project_manager ||
                userDetails.is_internal_coordinator) && (
                <>
                  <div className="mt-8 border border-gray-200 rounded-md p-6 pb-8">
                    <div
                      className="flex justify-between cursor-pointer"
                      onClick={() =>
                        setShowLocationSection(!showLocationSection)
                      }
                    >
                      <div className="flex-1">
                        <div className="font-medium text-xl">
                          Inventory Locations
                        </div>
                        <div className="text-md text-gray-500 mt-1">
                          Manage inventory locations. This user will only be
                          manage items for the locations specify here.
                        </div>
                      </div>
                      <div>
                        {showLocationSection && (
                          <ChevronUpIcon className="h-5 w-5 relative top-4" />
                        )}
                        {!showLocationSection && (
                          <ChevronDownIcon className="h-5 w-5 relative top-4" />
                        )}
                      </div>
                    </div>

                    {showLocationSection && (
                      <div className="mt-8 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                        <div
                          className="border border-gray-200 rounded-md p-4"
                          style={{ height: "680px" }}
                        >
                          <div className="font-medium text-sm">
                            <div className="flex justify-between">
                              <div>
                                All Inventory Locations
                                <span
                                  className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                            rounded-full text-sm font-medium inline-block"
                                >
                                  {totalLocations}
                                </span>
                              </div>
                              <div>
                                {locationAlreadyAdded && (
                                  <div className="text-red-500 text-sm relative top-1">
                                    Location already added
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1 my-2">
                              <label
                                htmlFor="searchLocation"
                                className="sr-only"
                              >
                                Search
                              </label>
                              <div className="relative rounded-md shadow-sm">
                                <div
                                  onClick={() => getAirports()}
                                  className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                                >
                                  <MagnifyingGlassIcon
                                    className="h-5 w-5 text-gray-400 cursor-pointer"
                                    aria-hidden="true"
                                  />
                                </div>
                                <input
                                  type="search"
                                  name="searchLocation"
                                  id="searchLocation"
                                  value={locationSearchText}
                                  onChange={(event) =>
                                    setLocationSearchText(event.target.value)
                                  }
                                  onKeyDown={handleKeyDownLocations}
                                  className="block w-full rounded-md border-gray-300 pl-10
                                                                    focus:border-sky-500 text-sm
                                                                    focus:ring-sky-500  font-normal"
                                  placeholder="Search name..."
                                />
                              </div>
                            </div>
                            <div
                              className="overflow-y-auto"
                              style={{ maxHeight: "560px" }}
                            >
                              {locations.map((location) => (
                                <div key={location.id} className="relative">
                                  <ul className="">
                                    <li className="">
                                      <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                            {location.name}
                                          </p>
                                        </div>
                                        <div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              addAvailableLocation(location.id)
                                            }
                                            className="inline-flex items-center rounded border
                                                                                            border-gray-300 bg-white px-2 py-1 text-sm
                                                                                            text-gray-700 shadow-sm
                                                                                            hover:bg-gray-50 focus:outline-none focus:ring-2
                                                                                            "
                                          >
                                            Add
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div
                          className="border border-gray-200 rounded-md p-4"
                          style={{ height: "680px" }}
                        >
                          <div className="font-medium text-sm">
                            Available Locations
                            <span
                              className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-sm font-medium inline-block"
                            >
                              {availableLocations.length}
                            </span>
                          </div>
                          <div className="text-sm">
                            {availableLocations.length === 0 && (
                              <div className="text-center m-auto mt-24 text-sm">
                                No available inventory locations set.
                              </div>
                            )}

                            <div
                              className="overflow-y-auto"
                              style={{ maxHeight: "560px" }}
                            >
                              {availableLocations.map((location) => (
                                <div key={location.id} className="relative">
                                  <ul className="">
                                    <li className="">
                                      <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                            {location.name}
                                          </p>
                                        </div>
                                        <div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              deleteAvailableLocation(
                                                location.id
                                              )
                                            }
                                            className="inline-flex items-center rounded border
                                                                                                border-gray-300 bg-white px-2 py-1 text-sm
                                                                                                text-gray-700 shadow-sm
                                                                                                hover:bg-gray-100 focus:outline-none focus:ring-2
                                                                                                "
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 border border-gray-200 rounded-md p-6 pb-8">
                    <div
                      className="flex justify-between cursor-pointer"
                      onClick={() => setShowAirportSection(!showAirportSection)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-xl">Airports</div>
                        <div className="text-md text-gray-500 mt-1">
                          Manage airports. For Internal Coordinators, only the
                          specified airports will be taking into consideration
                          when creating jobs, reports, and airport listings. If
                          none specified, all airports will be taking into
                          consideration.
                        </div>
                      </div>
                      <div>
                        {showAirportSection && (
                          <ChevronUpIcon className="h-5 w-5 relative top-4" />
                        )}
                        {!showAirportSection && (
                          <ChevronDownIcon className="h-5 w-5 relative top-4" />
                        )}
                      </div>
                    </div>

                    {showAirportSection && (
                      <div className="mt-8 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                        <div
                          className="border border-gray-200 rounded-md p-4"
                          style={{ height: "680px" }}
                        >
                          <div className="font-medium text-sm">
                            <div className="flex justify-between">
                              <div>
                                All Airports
                                <span
                                  className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                            rounded-full text-sm font-medium inline-block"
                                >
                                  {totalAirports}
                                </span>
                              </div>
                              <div>
                                {airportAlreadyAdded && (
                                  <div className="text-red-500 text-sm relative top-1">
                                    Airport already added
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="min-w-0 flex-1 my-2">
                              <label htmlFor="search" className="sr-only">
                                Search
                              </label>
                              <div className="relative rounded-md shadow-sm">
                                <div
                                  onClick={() => getAirports()}
                                  className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                                >
                                  <MagnifyingGlassIcon
                                    className="h-5 w-5 text-gray-400 cursor-pointer"
                                    aria-hidden="true"
                                  />
                                </div>
                                <input
                                  type="search"
                                  name="search"
                                  id="search"
                                  value={airportSearchText}
                                  onChange={(event) =>
                                    setAirportSearchText(event.target.value)
                                  }
                                  onKeyDown={handleKeyDown}
                                  className="block w-full rounded-md border-gray-300 pl-10
                                                                    focus:border-sky-500 text-sm
                                                                    focus:ring-sky-500  font-normal"
                                  placeholder="Search name..."
                                />
                              </div>
                            </div>
                            <div
                              className="overflow-y-auto"
                              style={{ maxHeight: "560px" }}
                            >
                              {airports.map((airport) => (
                                <div key={airport.id} className="relative">
                                  <ul className="">
                                    <li className="">
                                      <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                        <div className="flex-shrink-0 text-sm w-6">
                                          {airport.initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                            {airport.name}
                                          </p>
                                        </div>
                                        <div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              addAvailableAirport(airport.id)
                                            }
                                            className="inline-flex items-center rounded border
                                                                                            border-gray-300 bg-white px-2 py-1 text-sm
                                                                                            text-gray-700 shadow-sm
                                                                                            hover:bg-gray-50 focus:outline-none focus:ring-2
                                                                                            "
                                          >
                                            Add
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div
                          className="border border-gray-200 rounded-md p-4"
                          style={{ height: "680px" }}
                        >
                          <div className="font-medium text-sm">
                            Available Airports
                            <span
                              className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-sm font-medium inline-block"
                            >
                              {availableAirports.length}
                            </span>
                          </div>
                          <div className="text-sm">
                            {availableAirports.length === 0 && (
                              <div className="text-center m-auto mt-24 text-sm">
                                No available airports set.
                              </div>
                            )}

                            <div
                              className="overflow-y-auto"
                              style={{ maxHeight: "560px" }}
                            >
                              {availableAirports.map((airport) => (
                                <div key={airport.id} className="relative">
                                  <ul className="">
                                    <li className="">
                                      <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                        <div className="flex-shrink-0 text-sm w-6 font-medium">
                                          {airport.initials}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                            {airport.name}
                                          </p>
                                        </div>
                                        <div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              deleteAvailableAirport(airport.id)
                                            }
                                            className="inline-flex items-center rounded border
                                                                                                border-gray-300 bg-white px-2 py-1 text-sm
                                                                                                text-gray-700 shadow-sm
                                                                                                hover:bg-gray-100 focus:outline-none focus:ring-2
                                                                                                "
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {userDetails.is_internal_coordinator && (
                    <div className="mt-8 border border-gray-200 rounded-md p-6 pb-8">
                      <div
                        className="flex justify-between cursor-pointer"
                        onClick={() =>
                          setShowCustomerSection(!showCustomerSection)
                        }
                      >
                        <div className="flex-1">
                          <div className="font-medium text-xl">Customers</div>
                          <div className="text-md text-gray-500 mt-1">
                            <p>
                              Manage customers. This user will only be able to
                              see and create jobs for the specified customers.
                            </p>
                            <p>
                              If no customers are specified, then the user will
                              be able to see and create jobs for all customers.
                            </p>
                          </div>
                        </div>
                        <div className="">
                          {showCustomerSection && (
                            <ChevronUpIcon className="h-5 w-5 relative top-4" />
                          )}
                          {!showCustomerSection && (
                            <ChevronDownIcon className="h-5 w-5 relative top-4" />
                          )}
                        </div>
                      </div>

                      {showCustomerSection && (
                        <div className="mt-8 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                          <div
                            className="border border-gray-200 rounded-md p-4"
                            style={{ height: "680px" }}
                          >
                            <div className="font-medium text-sm">
                              <div className="flex justify-between">
                                <div>
                                  All Customers
                                  <span
                                    className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                            rounded-full text-sm font-medium inline-block"
                                  >
                                    {totalCustomers}
                                  </span>
                                </div>
                                <div>
                                  {customerAlreadyAdded && (
                                    <div className="text-red-500 text-sm relative top-1">
                                      Customer already added
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="min-w-0 flex-1 my-2">
                                <label htmlFor="search" className="sr-only">
                                  Search
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                  <div
                                    onClick={() => getCustomers()}
                                    className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
                                  >
                                    <MagnifyingGlassIcon
                                      className="h-5 w-5 text-gray-400 cursor-pointer"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <input
                                    type="search"
                                    name="customerSearch"
                                    id="customerSearch"
                                    value={customerSearchText}
                                    onChange={(event) =>
                                      setCustomerSearchText(event.target.value)
                                    }
                                    onKeyDown={handleKeyDownCustomers}
                                    className="block w-full rounded-md border-gray-300 pl-10
                                                                    focus:border-sky-500 text-sm
                                                                    focus:ring-sky-500  font-normal"
                                    placeholder="Search name..."
                                  />
                                </div>
                              </div>
                              <div
                                className="overflow-y-auto"
                                style={{ maxHeight: "560px" }}
                              >
                                {customers.map((customer) => (
                                  <div key={customer.id} className="relative">
                                    <ul className="">
                                      <li className="">
                                        <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                          <div className="min-w-0 flex-1">
                                            <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                              {customer.name}
                                            </p>
                                          </div>
                                          <div>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                addUserCustomer(customer.id)
                                              }
                                              className="inline-flex items-center rounded border
                                                                                            border-gray-300 bg-white px-2 py-1 text-sm
                                                                                            text-gray-700 shadow-sm
                                                                                            hover:bg-gray-50 focus:outline-none focus:ring-2
                                                                                            "
                                            >
                                              Add
                                            </button>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div
                            className="border border-gray-200 rounded-md p-4"
                            style={{ height: "680px" }}
                          >
                            <div className="font-medium text-sm">
                              Available Customers
                              <span
                                className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-sm font-medium inline-block"
                              >
                                {availableCustomers.length}
                              </span>
                            </div>
                            <div className="text-sm">
                              {availableCustomers.length === 0 && (
                                <div className="text-center m-auto mt-24 text-sm">
                                  No available customers set.
                                </div>
                              )}

                              <div
                                className="overflow-y-auto"
                                style={{ maxHeight: "560px" }}
                              >
                                {availableCustomers.map((customer) => (
                                  <div key={customer.id} className="relative">
                                    <ul className="">
                                      <li className="">
                                        <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                          <div className="min-w-0 flex-1">
                                            <p className="text-sm text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                              {customer.name}
                                            </p>
                                          </div>
                                          <div>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                deleteUserCustomer(customer.id)
                                              }
                                              className="inline-flex items-center rounded border
                                                                                                border-gray-300 bg-white px-2 py-1 text-sm
                                                                                                text-gray-700 shadow-sm
                                                                                                hover:bg-gray-100 focus:outline-none focus:ring-2
                                                                                                "
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        </div>
                                      </li>
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Desktop */}
            <aside className="hidden xl:block xl:pl-6 xl:col-span-2">
              <div className="space-y-5">
                <div className="font-medium">General Info</div>
                <div className="">
                  <dt className="text-sm font-medium text-gray-500">
                    Member Since
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <ReactTimeAgo
                      date={new Date(userDetails.member_since)}
                      locale="en-US"
                      timeStyle="twitter"
                    />
                  </dd>
                </div>
                <div className="">
                  <dt className="text-sm font-medium text-gray-500">
                    First Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userDetails.first_name}
                  </dd>
                </div>
                <div className="">
                  <dt className="text-sm font-medium text-gray-500">
                    Last Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userDetails.last_name}
                  </dd>
                </div>
                <div className="">
                  <dt className="text-sm font-medium text-gray-500">
                    Username
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userDetails.username}
                  </dd>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Phone Number
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userDetails.phone_number
                      ? userDetails.phone_number
                      : "Not specified"}
                  </dd>
                </div>
                <div className="">
                  <dt className="text-sm font-medium text-gray-500">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {userDetails.location
                      ? userDetails.location
                      : "Not specified"}
                  </dd>
                </div>
                <div className="">
                  <dt className="text-sm font-medium text-gray-500">
                    Access Level
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {(userDetails.is_superuser || userDetails.is_staff) &&
                      "Admin"}
                    {userDetails.is_account_manager && "Account Manager"}
                    {userDetails.is_project_manager && "Project Manager"}
                    {userDetails.customer_name && "Customer User"}
                  </dd>
                </div>
                {userDetails.customer_name && (
                  <div className="">
                    <dt className="text-sm font-medium text-gray-500">
                      Customer
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetails.customer_name}
                    </dd>
                  </div>
                )}

                {userDetails.vendor_name && (
                  <div className="">
                    <dt className="text-sm font-medium text-gray-500">
                      Vendor
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {userDetails.vendor_name}
                    </dd>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
};

export default UserDetails;
