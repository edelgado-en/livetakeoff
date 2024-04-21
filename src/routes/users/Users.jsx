import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Switch, Menu, Listbox } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import Loader from "../../components/loader/Loader";
import * as api from "./apiService";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const XMarkIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6 text-white"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const roleOptions = [
  { id: "All", name: "All Roles" },
  { id: "Customers", name: "Customers" },
  { id: "Project Managers", name: "Project Managers" },
  { id: "Account Managers", name: "Account Managers" },
  { id: "Internal Coordinators", name: "Internal Coordinators" },
  { id: "Admins", name: "Admins" },
];

const Users = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [roleSelected, setRoleSelected] = useState(roleOptions[0]);

  const [customers, setCustomers] = useState([]);
  const [customerSelected, setCustomerSelected] = useState(null);
  const [customerSearchName, setCustomerSearchName] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchText, roleSelected, customerSelected]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchCustomers();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [customerSearchName]);

  const searchCustomers = async () => {
    const request = {
      name: customerSearchName,
    };

    try {
      const { data } = await api.getCustomers(request);

      data.results.unshift({ id: null, name: "All" });

      setCustomers(data.results);
    } catch (err) {
      toast.error("Unable to search customers");
    }
  };

  const searchUsers = async () => {
    setLoading(true);

    const request = {
      name: searchText,
      role: roleSelected.id,
      customer_id: customerSelected ? customerSelected.id : null,
    };

    try {
      const { data } = await api.searchUsers(request);

      setTotalUsers(data.count);
      setUsers(data.results);
      setLoading(false);

      if (firstLoad) {
        setFirstLoad(false);
        if (data.results.length > 0) {
          getUserDetails(data.results[0].id);

          //account for page refresh. Maintain current inner route

          let custId = location.pathname.match(/\d+/);

          if (custId !== null) {
            custId = custId[0];
          } else {
            custId = data.results[0].id;
          }

          navigate("/users/" + custId);
        }
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchUsers();
    }
  };

  const getUserDetails = (userId) => {
    setSidebarOpen(false);
    navigate("/users/" + userId);
  };

  return (
    <>
      <div className="flex h-full -mt-8 pb-20">
        {/* Side bar for mobile */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full
                                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white border-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className="flex-shrink-0 border-t border-gray-200 p-4">
                    <div className="flex">
                      <h2 className="text-2xl font-medium text-gray-900">
                        Team
                      </h2>
                      <span
                        className="bg-gray-100 text-gray-700 ml-2 py-2 px-2
                                            rounded-full text-xs font-medium inline-block"
                      >
                        {totalUsers}
                      </span>
                    </div>
                    {/* MOBILE */}
                    <form className="mt-4 flex flex-col gap-3" action="#">
                      <div className="">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div
                            onClick={() => searchUsers()}
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
                            value={searchText}
                            onChange={(event) =>
                              setSearchText(event.target.value)
                            }
                            onKeyDown={handleKeyDown}
                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                    focus:ring-sky-500 text-md"
                            placeholder="Search name..."
                          />
                        </div>
                      </div>
                      <div>
                        <Listbox
                          value={roleSelected}
                          onChange={setRoleSelected}
                        >
                          {({ open }) => (
                            <>
                              <div className="relative">
                                <Listbox.Button
                                  className="relative w-full cursor-default rounded-md border
                                  border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                  shadow-sm focus:border-sky-500 focus:outline-none
                                  focus:ring-1 focus:ring-sky-500 text-md"
                                >
                                  <span className="block truncate">
                                    {roleSelected.name}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDownIcon
                                      className="h-4 w-4 text-gray-400"
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
                                    className="absolute left-0 z-10 mt-1 max-h-72 w-full overflow-auto
                                                                  rounded-md bg-white py-1 shadow-lg ring-1
                                                                  ring-black ring-opacity-5 focus:outline-none text-md"
                                  >
                                    {roleOptions.map((role) => (
                                      <Listbox.Option
                                        key={role.id}
                                        className={({ active }) =>
                                          classNames(
                                            active
                                              ? "text-white bg-red-600"
                                              : "text-gray-900",
                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                          )
                                        }
                                        value={role}
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
                                              {role.name}
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
                      <div className="">
                        <Listbox
                          value={customerSelected}
                          onChange={setCustomerSelected}
                        >
                          {({ open }) => (
                            <>
                              <div className="relative mt-1">
                                <Listbox.Button
                                  className="relative w-full cursor-default rounded-md border
                                                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                        shadow-sm focus:border-sky-500 focus:outline-none
                                                                        focus:ring-1 focus:ring-sky-500 sm:text-lg"
                                >
                                  <span className="block truncate">
                                    {customerSelected
                                      ? customerSelected.name
                                      : "All"}
                                  </span>
                                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDownIcon
                                      className="h-4 w-4 text-gray-400"
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
                                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                            ring-black ring-opacity-5 focus:outline-none text-md"
                                  >
                                    <div className="relative">
                                      <div className="sticky top-0 z-20  px-1">
                                        <div className="mt-1 block  items-center">
                                          <input
                                            type="text"
                                            name="search"
                                            id="search"
                                            value={customerSearchName}
                                            onChange={(e) =>
                                              setCustomerSearchName(
                                                e.target.value
                                              )
                                            }
                                            className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-lg
                                                                            border-gray-300 rounded-md"
                                          />
                                          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                            {customerSearchName && (
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-blue-500 font-bold mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                onClick={() => {
                                                  setCustomerSearchName("");
                                                }}
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                  clipRule="evenodd"
                                                />
                                              </svg>
                                            )}
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="h-6 w-6 text-gray-500 mr-1"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                              />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {customers.map((customer) => (
                                      <Listbox.Option
                                        key={customer.id}
                                        className={({ active }) =>
                                          classNames(
                                            active
                                              ? "text-white bg-red-600"
                                              : "text-gray-900",
                                            "relative cursor-default select-none py-2 pl-3 pr-9"
                                          )
                                        }
                                        value={customer}
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
                                              {customer.name}
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
                    </form>
                    {/* Directory list Mobile */}
                    <nav
                      className="min-h-0 flex-1 overflow-y-auto mt-6"
                      style={{ height: "800px", paddingBottom: "250px" }}
                      aria-label="Directory"
                    >
                      {loading && <Loader />}

                      {!loading && totalUsers === 0 && (
                        <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                          <p className="font-semibold">No users found.</p>
                        </div>
                      )}
                      {users.map((user) => (
                        <div key={user.id} className="relative">
                          <ul className="relative z-0 divide-y divide-gray-200">
                            <li onClick={() => getUserDetails(user.id)}>
                              <div className="relative flex items-center space-x-3 py-5 focus-within:ring-2 focus-within:ring-inset focus-within:ring-red-500 hover:bg-gray-50">
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={user.avatar}
                                    alt=""
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="focus:outline-none">
                                    {/* Extend touch target to entire panel */}
                                    <span
                                      className="absolute inset-0"
                                      aria-hidden="true"
                                    />
                                    <p className="text-sm font-medium text-gray-900">
                                      {user.first_name} {user.last_name}
                                    </p>
                                    <p className="truncate text-xs text-gray-500">
                                      {user.email
                                        ? user.email
                                        : "No email specified"}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <span
                                    className={`inline-flex items-center rounded-full
                                          px-2 py-0.5 text-xs
                                          ${
                                            user.is_staff || user.is_super_user
                                              ? "text-green-800 bg-green-100"
                                              : ""
                                          }
                                          ${
                                            user.is_account_manager
                                              ? "text-blue-800 bg-blue-100"
                                              : ""
                                          }
                                          ${
                                            user.is_project_manager
                                              ? "text-violet-800 bg-violet-100"
                                              : ""
                                          }
                                          ${
                                            user.is_internal_coordinator
                                              ? "text-orange-800 bg-orange-100"
                                              : ""
                                          }
                                          ${
                                            user.customer_name
                                              ? "text-sky-800 bg-sky-100"
                                              : ""
                                          } `}
                                  >
                                    {(user.is_staff || user.is_super_user) &&
                                      "Admin"}
                                    {user.is_project_manager && "P. Manager"}
                                    {user.is_account_manager && "A. Manager"}
                                    {user.is_internal_coordinator &&
                                      "Coordinator"}
                                    {user.customer_name && "Customer"}
                                  </span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <div className="relative z-0 flex flex-1 overflow-hidden">
            <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
              {/* Mobile only */}
              <nav
                className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden"
                aria-label="Breadcrumb"
              >
                <div
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
                >
                  <ChevronLeftIcon
                    className="-ml-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Team</span>
                </div>
              </nav>

              <article className="pt-8">
                <Outlet />
              </article>
            </main>
            <aside className="hidden w-96 flex-shrink-0 border-r border-gray-200 xl:order-first xl:flex xl:flex-col">
              <div className="px-6 pr-4 pt-6 pb-4">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <h2 className="text-2xl font-medium text-gray-900">Team</h2>
                    <span
                      className="bg-gray-100 text-gray-700 ml-2 py-2 px-2
                                            rounded-full text-xs font-medium inline-block"
                    >
                      {totalUsers}
                    </span>
                  </div>
                </div>
                <form className="mt-4 flex flex-col gap-3" action="#">
                  <div className="">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div
                        onClick={() => searchUsers()}
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
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        onKeyDown={handleKeyDown}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                 focus:ring-sky-500 text-md"
                        placeholder="Search name..."
                      />
                    </div>
                  </div>
                  <div className="">
                    <Listbox value={roleSelected} onChange={setRoleSelected}>
                      {({ open }) => (
                        <>
                          <div className="relative">
                            <Listbox.Button
                              className="relative w-full cursor-default rounded-md 
                                                            bg-white py-2.5 px-3 pr-8 text-left
                                                            border-gray-300 shadow-sm text-gray-600
                                                          text-md"
                              style={{ borderWidth: "1px" }}
                            >
                              <span className="block truncate">
                                {roleSelected.name}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon
                                  className="h-4 w-4 text-gray-400"
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
                                className="absolute left-0 z-10 mt-1 max-h-72 w-full overflow-auto
                                                              rounded-md bg-white py-1 shadow-lg ring-1
                                                              ring-black ring-opacity-5 focus:outline-none text-md"
                              >
                                {roleOptions.map((role) => (
                                  <Listbox.Option
                                    key={role.id}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "text-white bg-red-600"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9"
                                      )
                                    }
                                    value={role}
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
                                          {role.name}
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
                  <div className="">
                    <Listbox
                      value={customerSelected}
                      onChange={setCustomerSelected}
                    >
                      {({ open }) => (
                        <>
                          <div className="relative mt-1">
                            <Listbox.Button
                              className="relative w-full cursor-default rounded-md border
                                                                        border-gray-300 bg-white py-3 pl-3 pr-10 text-left
                                                                        shadow-sm focus:border-sky-500 focus:outline-none
                                                                        focus:ring-1 focus:ring-sky-500 text-md text-gray-600"
                            >
                              <span className="block truncate">
                                {customerSelected
                                  ? customerSelected.name
                                  : "All"}
                              </span>
                              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon
                                  className="h-4 w-4 text-gray-400"
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
                                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                            ring-black ring-opacity-5 focus:outline-none text-md"
                              >
                                <div className="relative">
                                  <div className="sticky top-0 z-20  px-1">
                                    <div className="mt-1 block  items-center">
                                      <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        value={customerSearchName}
                                        onChange={(e) =>
                                          setCustomerSearchName(e.target.value)
                                        }
                                        className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                            focus:border-sky-500 block w-full py-2 pr-12 text-md
                                                                            border-gray-300 rounded-md"
                                      />
                                      <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                        {customerSearchName && (
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-blue-500 font-bold mr-1"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            onClick={() => {
                                              setCustomerSearchName("");
                                            }}
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        )}
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-500 mr-1"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {customers.map((customer) => (
                                  <Listbox.Option
                                    key={customer.id}
                                    className={({ active }) =>
                                      classNames(
                                        active
                                          ? "text-white bg-red-600"
                                          : "text-gray-900",
                                        "relative cursor-default select-none py-2 pl-3 pr-9 text-md"
                                      )
                                    }
                                    value={customer}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={classNames(
                                            selected
                                              ? "font-semibold"
                                              : "font-normal",
                                            "block truncate text-md"
                                          )}
                                        >
                                          {customer.name}
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
                </form>
              </div>
              {/* Directory list */}
              <nav
                className="min-h-0 flex-1 overflow-y-auto"
                aria-label="Directory"
              >
                {loading && <Loader />}

                {!loading && totalUsers === 0 && (
                  <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                    <p className="font-semibold">No users found.</p>
                  </div>
                )}
                {/* DESKTOP */}
                {users.map((user) => (
                  <div key={user.id} className="relative">
                    <ul className="relative z-0 divide-y divide-gray-200">
                      <li
                        onClick={() => getUserDetails(user.id)}
                        className="border-b cursor-pointer"
                      >
                        <div
                          className="relative flex items-center space-x-3 pl-6 pr-4 py-5 focus-within:ring-2
                                          focus-within:ring-inset focus-within:ring-red-500 hover:bg-gray-50"
                        >
                          <div className="flex-shrink-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.avatar}
                              alt=""
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="focus:outline-none">
                              {/* Extend touch target to entire panel */}
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              <p className="text-sm font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="truncate text-xs text-gray-500">
                                {user.email ? user.email : "No email specified"}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center rounded-full
                                         px-2 py-0.5 text-xs
                                         ${
                                           user.is_staff || user.is_super_user
                                             ? "text-green-800 bg-green-100"
                                             : ""
                                         }
                                         ${
                                           user.is_account_manager
                                             ? "text-blue-800 bg-blue-100"
                                             : ""
                                         }
                                         ${
                                           user.is_internal_coordinator
                                             ? "text-orange-800 bg-orange-100"
                                             : ""
                                         }
                                         ${
                                           user.is_project_manager
                                             ? "text-violet-800 bg-violet-100"
                                             : ""
                                         }
                                         ${
                                           user.customer_name
                                             ? "text-sky-800 bg-sky-100"
                                             : ""
                                         } `}
                            >
                              {(user.is_staff || user.is_super_user) && "Admin"}
                              {user.is_project_manager && "Project Manager"}
                              {user.is_account_manager && "Account Manager"}
                              {user.is_internal_coordinator && "Coordinator"}
                              {user.customer_name && "Customer"}
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default Users;
