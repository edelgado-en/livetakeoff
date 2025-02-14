import { Fragment, useEffect, useState, useRef } from "react";
import {
  Disclosure,
  Menu,
  Transition,
  Popover,
  Listbox,
} from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import logo from "../../images/logo_2618936_web.png";
import whiteLogo from "../../images/logo_white-no-text.png";

import { useNavigate, Link, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const [showDashboardMenu, setDashboardMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

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
                  to={"login"}
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
                  style={{ top: "8px" }}
                >
                  <div className="flex space-x-4">
                    {/* <Link
                      to="inventory"
                      className={classNames(
                        location.pathname.includes("inventory")
                          ? "bg-red-700"
                          : " hover:bg-red-700 hover:text-white",
                        "px-3 py-2 rounded-md text-md font-medium text-white"
                      )}
                    >
                      Services
                    </Link> */}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"></div>
            </div>
          </div>

          {/* Mobile */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <>
                {/* <Link to="jobs">
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
                </Link> */}
              </>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Topbar;
