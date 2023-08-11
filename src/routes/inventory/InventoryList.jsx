import { Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import {
  ChevronRightIcon,
  PlusIcon,
  CheckIcon,
  ChevronDownIcon,
} from "@heroicons/react/outline";
import {
  Listbox,
  Transition,
  Menu,
  Popover,
  Disclosure,
  Dialog,
} from "@headlessui/react";
import { UserIcon } from "@heroicons/react/solid";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

import Pagination from "react-js-pagination";

import { toast } from "react-toastify";

const XMarkIcon = () => {
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

const InventoryList = () => {
  const currentUser = useAppSelector(selectUser);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {}, []);

  return (
    <AnimatedPage>
      <div
        className={`px-4 m-auto ${
          currentUser.isAdmin ||
          currentUser.isSuperUser ||
          currentUser.isAccountManager ||
          currentUser.isInternalCoordinator
            ? "max-w-7xl"
            : "max-w-5xl"
        } -mt-3 flex flex-wrap`}
      >
        <div className="flex-1 xl:px-10 lg:px-10 md:px-10">
          <div className="grid grid-cols-2">
            <div className="">
              <h1 className="text-2xl font-semibold text-gray-600">
                Inventory
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Total: <span className="text-gray-900">{totalItems}</span>
              </p>
            </div>
            <div className="text-right">
              {(currentUser.isAdmin ||
                currentUser.isSuperUser ||
                currentUser.isAccountManager ||
                currentUser.isCustomer ||
                currentUser.isInternalCoordinator) && (
                <Link to="/create-inventory-item">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center 
                                            rounded-md border border-transparent bg-red-600 px-4 py-2
                                            text-sm font-medium text-white shadow-sm hover:bg-red-700
                                            focus:outline-none focus:ring-2 focus:ring-red-500
                                            focus:ring-offset-2 sm:w-auto"
                  >
                    <PlusIcon
                      className="-ml-1 mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                    Create Item
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default InventoryList;
