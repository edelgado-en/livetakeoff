import { Fragment, useEffect, useState, useRef } from "react";
import {
  Disclosure,
  Menu,
  Transition,
  Popover,
  Listbox,
} from "@headlessui/react";
import {
  MenuIcon,
  XIcon,
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ChevronDownIcon,
  CalculatorIcon,
  ExclamationCircleIcon,
  PresentationChartBarIcon,
  ViewGridIcon,
  ArchiveIcon,
  BellIcon,
  PaperAirplaneIcon,
  ClockIcon,
} from "@heroicons/react/outline";
import logo from "../../images/logo_2618936_web.png";
import whiteLogo from "../../images/logo_white-no-text.png";

import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { fetchUser, selectUser } from "../../routes/userProfile/userSlice";

const dashboards = [
  /* {
    name: "Tail Report",
    description: "See detailed information about a tail number.",
    href: "/tail-report",
    icon: PresentationChartBarIcon,
  }, */
  {
    name: "Team Productivity",
    description: "Find out which project manager is the most productive.",
    href: "/team-productivity",
    icon: ChartBarIcon,
  },
  {
    name: "Inventory Tracking",
    description:
      "Never lose track of what's in stock with accurate inventory tracking",
    href: "/inventory/stats/current",
    icon: ArchiveIcon,
  },
  {
    name: "Service Report",
    description: "See detailed information about a service across time.",
    href: "/service-report",
    icon: ChartBarIcon,
  },
  {
    name: "Flight Based Cleaning",
    description: "Tails that are cleaned based on flight activity.",
    href: "/customer-tails",
    icon: PaperAirplaneIcon,
  },
];

const internalCoordinatorDashboards = [
  /* {
    name: "Tail Report",
    description: "See detailed information about a tail number.",
    href: "/tail-report",
    icon: PresentationChartBarIcon,
  }, */
  {
    name: "Service Report",
    description: "See detailed information about a service across time.",
    href: "/service-report",
    icon: ChartBarIcon,
  },
];

const moreOptions = [
  {
    name: "Estimates",
    description: "Create job estimates to be approved by customer.",
    href: "/estimates",
    icon: CalculatorIcon,
  },
  {
    name: "Team",
    description: "Checkout user's detailed information.",
    href: "/users",
    icon: UserGroupIcon,
  },
  {
    name: "Customers",
    description: "Adjust discounts and fees for each customer.",
    href: "/customers",
    icon: UsersIcon,
  },
  {
    name: "Retainer Customers",
    description: "Checkout the price breakdown for all retainer customers.",
    href: "/retainers",
    icon: UsersIcon,
  },
  {
    name: "Tail Details",
    description: "Manage tail number alerts and notes",
    href: "/tail-alerts",
    icon: ExclamationCircleIcon,
  },
  {
    name: "Price Lists",
    description: "Setup indiviual prices for aircrafts and services.",
    href: "/price-plans",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Inventory Locations",
    description: "Setup inventory notifications for each location.",
    href: "/location-notifications",
    icon: BellIcon,
  },
  {
    name: "Airports",
    description: "Associate FBOs with airports.",
    href: "/airports",
    icon: PaperAirplaneIcon,
  },
  {
    name: "Job Schedules",
    description: "Create and manage job schedules.",
    href: "/jobs/schedules",
    icon: ClockIcon,
  },
  {
    name: "Fees",
    description: "Create and manage airport and FBO fees.",
    href: "/fees",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Vendors",
    description: "Manage vendors and their files.",
    href: "/vendors",
    icon: UsersIcon,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Bars3Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
};

const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);
  const location = useLocation();
  const [showDashboardMenu, setDashboardMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  const handleLogout = () => {
    localStorage.clear();

    navigate("/login");
  };

  const handleDashboardLink = (href) => {
    navigate(href);
    setDashboardMenu(false);
    setShowMoreMenu(false);
  };

  const handleMoreLink = (href) => {
    navigate(href);
    setShowMoreMenu(false);
    setDashboardMenu(false);
  };

  const toggleDashboardMenu = () => {
    setDashboardMenu(!showDashboardMenu);
    setShowMoreMenu(false);
  };

  const toggleMoreMenu = () => {
    setShowMoreMenu(!showMoreMenu);
    setDashboardMenu(false);
  };

  return (
    <Disclosure as="nav" className="bg-red-600">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button
                  className="inline-flex items-center justify-center rounded-md p-2
                                            text-white hover:bg-red-700 hover:text-white focus:outline-none
                                              focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start ">
                <Link
                  to={currentUser.isCustomer ? "home" : "jobs"}
                  className="flex flex-shrink-0 items-center rounded-full p-2 "
                >
                  <img
                    className="block h-10 w-auto lg:hidden"
                    src={whiteLogo}
                    alt="Your Company"
                  />
                  <img
                    className="hidden h-10 w-auto lg:block"
                    src={whiteLogo}
                    alt="Your Company"
                  />
                </Link>
                <div
                  className="hidden sm:ml-6 sm:block relative"
                  style={{ top: "12px" }}
                >
                  <div className="flex space-x-4">
                    {currentUser.isAdmin ||
                    currentUser.isSuperUser ||
                    currentUser.isAccountManager ? (
                      <>
                        <Link
                          to="/jobs"
                          className={classNames(
                            location.pathname.includes("jobs")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          Jobs
                        </Link>
                        <Link
                          to="completed"
                          className={classNames(
                            location.pathname.includes("completed")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          {currentUser.isCustomer
                            ? "All Jobs"
                            : "Completed Jobs"}
                        </Link>
                        <Link
                          to="inventory"
                          className={classNames(
                            location.pathname.includes("inventory")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          Inventory
                        </Link>
                        <Popover className="relative">
                          {({ open }) => (
                            <>
                              <Popover.Button
                                onClick={() => toggleDashboardMenu()}
                                className={classNames(
                                  open ? "text-white" : "text-white",
                                  "group inline-flex items-center rounded-md text-sm px-3 py-2 bg-red-600 hover:bg-red-700 hover:text-white font-medium"
                                )}
                              >
                                <span>Dashboards</span>
                                <ChevronDownIcon
                                  className={classNames(
                                    open ? "text-white" : "text-white",
                                    "ml-2 h-4 w-4"
                                  )}
                                  aria-hidden="true"
                                />
                              </Popover.Button>

                              <Transition
                                as={Fragment}
                                show={showDashboardMenu}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                              >
                                <Popover.Panel className="absolute z-20 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                                      {dashboards.map((item) => (
                                        <button
                                          key={item.name}
                                          onClick={() =>
                                            handleDashboardLink(item.href)
                                          }
                                          to={item.href}
                                          className="-m-3 flex items-start rounded-lg px-3 py-4 hover:bg-gray-50"
                                        >
                                          <item.icon
                                            className="h-6 w-6 flex-shrink-0 text-red-600"
                                            aria-hidden="true"
                                          />
                                          <div className="ml-4 text-left">
                                            <p className="text-base font-medium text-gray-900">
                                              {item.name}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                              {item.description}
                                            </p>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                        <Popover className="relative">
                          {({ open }) => (
                            <>
                              <Popover.Button
                                onClick={() => toggleMoreMenu()}
                                className={classNames(
                                  open ? "text-white" : "text-white",
                                  "group inline-flex items-center rounded-md text-sm px-3 py-2 bg-red-600 hover:bg-red-700 hover:text-white font-medium"
                                )}
                              >
                                <span>More</span>
                                <ChevronDownIcon
                                  className={classNames(
                                    open ? "text-white" : "text-white",
                                    "ml-2 h-4 w-4"
                                  )}
                                  aria-hidden="true"
                                />
                              </Popover.Button>

                              <Transition
                                as={Fragment}
                                show={showMoreMenu}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                              >
                                <Popover.Panel className="absolute z-20 -ml-4 mt-3 w-screen max-w-6xl transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="relative grid grid-cols-3 gap-y-6 gap-x-24 bg-white px-5 py-12 sm:gap-8 sm:p-8">
                                      {moreOptions.map((item) => (
                                        <button
                                          key={item.name}
                                          onClick={() =>
                                            handleMoreLink(item.href)
                                          }
                                          to={item.href}
                                          className="-m-3 flex-col gap-6 items-start rounded-lg px-3 py-4 hover:bg-gray-50"
                                        >
                                          <item.icon
                                            className="h-8 w-8 flex-shrink-0 text-red-500"
                                            aria-hidden="true"
                                          />
                                          <div className="text-left mt-2">
                                            <p className="text-base font-medium text-gray-900">
                                              {item.name}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                              {item.description}
                                            </p>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                      </>
                    ) : currentUser.isInternalCoordinator ? (
                      <>
                        <Link
                          to="/jobs"
                          className={classNames(
                            location.pathname.includes("jobs")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          Jobs
                        </Link>
                        <Link
                          to="/my-airports"
                          className={classNames(
                            location.pathname.includes("my-airports")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          My Airports
                        </Link>
                        {currentUser.enableEstimates && (
                          <Link
                            to="/estimates"
                            className={classNames(
                              location.pathname.includes("estimates")
                                ? "bg-red-700"
                                : " hover:bg-red-700 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium text-white"
                            )}
                          >
                            Estimates
                          </Link>
                        )}
                        {currentUser.canSeePrice && (
                          <Link
                            to="/price-plans"
                            className={classNames(
                              location.pathname.includes("price-plans")
                                ? "bg-red-700"
                                : " hover:bg-red-700 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium text-white"
                            )}
                          >
                            Prices
                          </Link>
                        )}
                        <Link
                          to="completed"
                          className={classNames(
                            location.pathname.includes("completed")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          {currentUser.isCustomer
                            ? "All Jobs"
                            : "Completed Jobs"}
                        </Link>
                        <Link
                          to="inventory"
                          className={classNames(
                            location.pathname.includes("inventory")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          Inventory
                        </Link>
                        <Popover className="relative">
                          {({ open }) => (
                            <>
                              <Popover.Button
                                onClick={() => toggleDashboardMenu()}
                                className={classNames(
                                  open ? "text-white" : "text-white",
                                  "group inline-flex items-center rounded-md text-sm px-3 py-2 bg-red-600 hover:bg-red-700 hover:text-white font-medium"
                                )}
                              >
                                <span>Dashboards</span>
                                <ChevronDownIcon
                                  className={classNames(
                                    open ? "text-white" : "text-white",
                                    "ml-2 h-4 w-4"
                                  )}
                                  aria-hidden="true"
                                />
                              </Popover.Button>

                              <Transition
                                as={Fragment}
                                show={showDashboardMenu}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                              >
                                <Popover.Panel className="absolute z-20 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2">
                                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                                      {internalCoordinatorDashboards.map(
                                        (item) => (
                                          <button
                                            key={item.name}
                                            onClick={() =>
                                              handleDashboardLink(item.href)
                                            }
                                            to={item.href}
                                            className="-m-3 flex items-start rounded-lg px-3 py-4 hover:bg-gray-50"
                                          >
                                            <item.icon
                                              className="h-6 w-6 flex-shrink-0 text-red-600"
                                              aria-hidden="true"
                                            />
                                            <div className="ml-4 text-left">
                                              <p className="text-base font-medium text-gray-900">
                                                {item.name}
                                              </p>
                                              <p className="mt-1 text-sm text-gray-500">
                                                {item.description}
                                              </p>
                                            </div>
                                          </button>
                                        )
                                      )}

                                      {currentUser.canSeeInventoryDashboard && (
                                        <button
                                          onClick={() =>
                                            handleDashboardLink(
                                              "/inventory/stats/current"
                                            )
                                          }
                                          to={"/inventory/stats/current"}
                                          className="-m-3 flex items-start rounded-lg px-3 py-4 hover:bg-gray-50"
                                        >
                                          <ArchiveIcon
                                            className="h-6 w-6 flex-shrink-0 text-red-600"
                                            aria-hidden="true"
                                          />
                                          <div className="ml-4 text-left">
                                            <p className="text-base font-medium text-gray-900">
                                              Inventory Tracking
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                              Never lose track of what's in
                                              stock with accurate inventory
                                              tracking
                                            </p>
                                          </div>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                      </>
                    ) : currentUser.isProjectManager ? (
                      <>
                        <Link
                          to="/jobs"
                          className={classNames(
                            location.pathname.includes("jobs")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          Jobs
                        </Link>
                        <Link
                          to="/my-airports"
                          className={classNames(
                            location.pathname.includes("my-airports")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          My Airports
                        </Link>
                        {currentUser.showInventory && (
                          <Link
                            to="inventory"
                            className={classNames(
                              location.pathname.includes("inventory")
                                ? "bg-red-700"
                                : " hover:bg-red-700 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium text-white"
                            )}
                          >
                            Inventory
                          </Link>
                        )}
                        {currentUser.isExternalProjectManager && (
                          <>
                            <Link
                              to="service-report"
                              className={classNames(
                                location.pathname.includes("service-report")
                                  ? "bg-red-700"
                                  : " hover:bg-red-700 hover:text-white",
                                "px-3 py-2 rounded-md text-sm font-medium text-white"
                              )}
                            >
                              Service Report
                            </Link>
                            <Link
                              to="vendor-files"
                              className={classNames(
                                location.pathname.includes("vendor-files")
                                  ? "bg-red-700"
                                  : " hover:bg-red-700 hover:text-white",
                                "px-3 py-2 rounded-md text-sm font-medium text-white"
                              )}
                            >
                              Documents
                            </Link>
                          </>
                        )}
                      </>
                    ) : currentUser.isCustomer ? (
                      <>
                        <Link
                          to="/home"
                          className={classNames(
                            location.pathname.includes("home")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          Home
                        </Link>
                        <Link
                          to="/completed"
                          className={classNames(
                            location.pathname.includes("completed")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          {currentUser.isCustomer
                            ? "All Jobs"
                            : "Completed Jobs"}
                        </Link>

                        {currentUser.enableEstimates && (
                          <Link
                            to="/estimates"
                            className={classNames(
                              location.pathname.includes("estimates")
                                ? "bg-red-700"
                                : " hover:bg-red-700 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium text-white"
                            )}
                          >
                            Estimates
                          </Link>
                        )}

                        {!currentUser.is_job_submitter_only && (
                          <>
                            <Link
                              to="/customer-tails"
                              className={classNames(
                                location.pathname.includes("customer-tails")
                                  ? "bg-red-700"
                                  : " hover:bg-red-700 hover:text-white",
                                "px-3 py-2 rounded-md text-sm font-medium text-white"
                              )}
                            >
                              Tails Report
                            </Link>
                            <Link
                              to="/service-report"
                              className={classNames(
                                location.pathname.includes("service-report")
                                  ? "bg-red-700"
                                  : " hover:bg-red-700 hover:text-white",
                                "px-3 py-2 rounded-md text-sm font-medium text-white"
                              )}
                            >
                              Service Report
                            </Link>
                          </>
                        )}

                        <Link
                          to="/contact"
                          className={classNames(
                            location.pathname.includes("contact")
                              ? "bg-red-700"
                              : " hover:bg-red-700 hover:text-white",
                            "px-3 py-2 rounded-md text-sm font-medium text-white"
                          )}
                        >
                          Contact Us
                        </Link>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {currentUser.isCustomer && !currentUser.isPremiumMember && (
                  <Link
                    to="/premium"
                    className="hidden lg:flex text-sm font-medium mr-2 text-white hover:underline relative"
                    style={{ top: "2px" }}
                  >
                    Go Premium
                  </Link>
                )}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-red-600 text-sm focus:outline-none">
                      <span className="sr-only">Open user menu</span>
                      <div className="">
                        {currentUser.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={currentUser.avatar}
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
                      </div>
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
                      className="absolute right-0 z-20 mt-2 w-60
                                           origin-top-right rounded-md bg-white py-1 shadow-lg ring-1
                                            ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="truncate py-3 px-3.5 border-b">
                        <div className="block text-xs text-gray-500">
                          Signed in as
                        </div>
                        <div className="mt-0.5 text-sm text-gray-700 py-1">
                          {currentUser.isAdmin
                            ? "Admin"
                            : currentUser.isSuperUser
                            ? "Super User"
                            : currentUser.isAccountManager
                            ? "Account Manager"
                            : currentUser.isInternalCoordinator
                            ? "Internal Coordinator"
                            : currentUser.isCustomer
                            ? "Customer"
                            : "Project Manager"}
                        </div>
                        <div className="text-sm font-semibold text-gray-500">
                          {currentUser.email}
                        </div>
                      </div>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="contact"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-3 text-sm text-gray-700"
                            )}
                          >
                            Contact Us
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="user-settings/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 border-t border-gray-200 pt-4"
                            )}
                          >
                            Account Settings
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="help"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 border-t border-gray-200 pt-4"
                            )}
                          >
                            Training
                          </Link>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            onClick={handleLogout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {currentUser.isAdmin ||
              currentUser.isSuperUser ||
              currentUser.isAccountManager ? (
                <>
                  <Link to="jobs">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("jobs")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Jobs
                    </Disclosure.Button>
                  </Link>
                  <Link to="completed">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("completed")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      {currentUser.isCustomer ? "All Jobs" : "Completed Jobs"}
                    </Disclosure.Button>
                  </Link>
                  <Link to="inventory">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("inventory")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Inventory
                    </Disclosure.Button>
                  </Link>
                  <Link to="estimates">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("estimates")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Estimates
                    </Disclosure.Button>
                  </Link>
                  <Link to="jobs/schedules">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("schedules")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Job Schedules
                    </Disclosure.Button>
                  </Link>
                  <Link to="customers">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("customers")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Customers
                    </Disclosure.Button>
                  </Link>
                  <Link to="retainers">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("customers")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Retainer Customers
                    </Disclosure.Button>
                  </Link>
                  <Link to="users">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("users")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Team
                    </Disclosure.Button>
                  </Link>

                  <Link to="tail-alerts">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("alerts")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Alerts
                    </Disclosure.Button>
                  </Link>
                  <Link to="price-plans">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("price-list")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Price Lists
                    </Disclosure.Button>
                  </Link>
                  <Link to="location-notifications">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("location-notifications")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Inventory Locations
                    </Disclosure.Button>
                  </Link>
                  <Link to="airports">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("airports")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Airports
                    </Disclosure.Button>
                  </Link>
                  <Link to="vendors">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("vendors")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Vendors
                    </Disclosure.Button>
                  </Link>
                  <div className="mt-4 border-t border-white py-2">
                    <nav className="grid">
                      {dashboards.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-start rounded-lg px-3 "
                        >
                          <Disclosure.Button
                            className={classNames(
                              location.pathname.includes(item.href)
                                ? "bg-red-700"
                                : "hover:bg-red-700 hover:text-white",
                              "px-3 rounded-md text-base font-medium text-white w-full text-left flex py-3 -ml-4"
                            )}
                          >
                            <item.icon
                              className="h-6 w-6 flex-shrink-0 text-white"
                              aria-hidden="true"
                            />
                            <div className="ml-4 text-left">
                              <p className="text-base font-medium text-white">
                                {item.name}
                              </p>
                            </div>
                          </Disclosure.Button>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </>
              ) : currentUser.isInternalCoordinator ? (
                <>
                  <Link to="jobs">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("jobs")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Jobs
                    </Disclosure.Button>
                  </Link>
                  <Link to="my-airports">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("my-airports")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      My Airports
                    </Disclosure.Button>
                  </Link>
                  {currentUser.enableEstimates && (
                    <Link to="estimates">
                      <Disclosure.Button
                        className={classNames(
                          location.pathname.includes("estimates")
                            ? "bg-red-700"
                            : "hover:bg-red-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                        )}
                      >
                        Estimates
                      </Disclosure.Button>
                    </Link>
                  )}
                  {currentUser.canSeePrice && (
                    <Link to="price-plans">
                      <Disclosure.Button
                        className={classNames(
                          location.pathname.includes("price-plans")
                            ? "bg-red-700"
                            : "hover:bg-red-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                        )}
                      >
                        Prices
                      </Disclosure.Button>
                    </Link>
                  )}
                  <Link to="completed">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("completed")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      {currentUser.isCustomer ? "All Jobs" : "Completed Jobs"}
                    </Disclosure.Button>
                  </Link>
                  <Link to="inventory">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("inventory")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Inventory
                    </Disclosure.Button>
                  </Link>
                  <div className="mt-4 border-t border-white py-2">
                    <nav className="grid">
                      {internalCoordinatorDashboards.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-start rounded-lg px-3 "
                        >
                          <Disclosure.Button
                            className={classNames(
                              location.pathname.includes(item.href)
                                ? "bg-red-700"
                                : "hover:bg-red-700 hover:text-white",
                              "px-3 rounded-md text-base font-medium text-white w-full text-left flex py-3 -ml-4"
                            )}
                          >
                            <item.icon
                              className="h-6 w-6 flex-shrink-0 text-white"
                              aria-hidden="true"
                            />
                            <div className="ml-4 text-left">
                              <p className="text-base font-medium text-white">
                                {item.name}
                              </p>
                            </div>
                          </Disclosure.Button>
                        </Link>
                      ))}

                      {currentUser.canSeeInventoryDashboard && (
                        <Link
                          to={"/inventory/stats/current"}
                          className="flex items-start rounded-lg px-3 "
                        >
                          <Disclosure.Button
                            className={classNames(
                              location.pathname.includes("inventory/stats")
                                ? "bg-red-700"
                                : "hover:bg-red-700 hover:text-white",
                              "px-3 rounded-md text-base font-medium text-white w-full text-left flex py-3 -ml-4"
                            )}
                          >
                            <ArchiveIcon
                              className="h-6 w-6 flex-shrink-0 text-white"
                              aria-hidden="true"
                            />
                            <div className="ml-4 text-left">
                              <p className="text-base font-medium text-white">
                                Inventory Tracking
                              </p>
                            </div>
                          </Disclosure.Button>
                        </Link>
                      )}
                    </nav>
                  </div>
                </>
              ) : currentUser.isProjectManager ? (
                <>
                  <Link to="jobs">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("jobs")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Jobs
                    </Disclosure.Button>
                  </Link>
                  <Link to="my-airports">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("my-airports")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      My Airports
                    </Disclosure.Button>
                  </Link>
                  {currentUser.showInventory && (
                    <Link to="inventory">
                      <Disclosure.Button
                        className={classNames(
                          location.pathname.includes("inventory")
                            ? "bg-red-700"
                            : "hover:bg-red-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                        )}
                      >
                        Inventory
                      </Disclosure.Button>
                    </Link>
                  )}
                  {currentUser.isExternalProjectManager && (
                    <>
                      <Link to="service-report">
                        <Disclosure.Button
                          className={classNames(
                            location.pathname.includes("service-report")
                              ? "bg-red-700"
                              : "hover:bg-red-700 hover:text-white",
                            "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                          )}
                        >
                          Service Report
                        </Disclosure.Button>
                      </Link>
                      <Link to="vendor-files">
                        <Disclosure.Button
                          className={classNames(
                            location.pathname.includes("vendor-files")
                              ? "bg-red-700"
                              : "hover:bg-red-700 hover:text-white",
                            "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                          )}
                        >
                          Documents
                        </Disclosure.Button>
                      </Link>
                    </>
                  )}
                </>
              ) : currentUser.isCustomer ? (
                <>
                  <Link to="/home">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("home")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Home
                    </Disclosure.Button>
                  </Link>
                  <Link to="/completed">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("completed")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      {currentUser.isCustomer ? "All Jobs" : "Completed Jobs"}
                    </Disclosure.Button>
                  </Link>

                  {currentUser.enableEstimates && (
                    <Link to="/estimates">
                      <Disclosure.Button
                        className={classNames(
                          location.pathname.includes("estimates")
                            ? "bg-red-700"
                            : "hover:bg-red-700 hover:text-white",
                          "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                        )}
                      >
                        Estimates
                      </Disclosure.Button>
                    </Link>
                  )}

                  {!currentUser.is_job_submitter_only && (
                    <>
                      <Link to="/service-report">
                        <Disclosure.Button
                          className={classNames(
                            location.pathname.includes("service-report")
                              ? "bg-red-700"
                              : "hover:bg-red-700 hover:text-white",
                            "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                          )}
                        >
                          Service Report
                        </Disclosure.Button>
                      </Link>

                      <Link to="/customer-tails">
                        <Disclosure.Button
                          className={classNames(
                            location.pathname.includes("customer-tails")
                              ? "bg-red-700"
                              : "hover:bg-red-700 hover:text-white",
                            "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                          )}
                        >
                          Tails Report
                        </Disclosure.Button>
                      </Link>
                    </>
                  )}

                  <Link to="/contact">
                    <Disclosure.Button
                      className={classNames(
                        location.pathname.includes("contact")
                          ? "bg-red-700"
                          : "hover:bg-red-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium text-white w-full text-left"
                      )}
                    >
                      Contact Us
                    </Disclosure.Button>
                  </Link>
                </>
              ) : null}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Topbar;
