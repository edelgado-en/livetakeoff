import { useEffect, useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";
import { toast } from "react-toastify";

import Pagination from "react-js-pagination";

import AirportFees from "./AirportFees";
import FboFees from "./FboFees";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const amountTypes = [
  { id: "P", name: "Percentage" },
  { id: "F", name: "Fixed $" },
];

const XCircleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-5 h-5 relative"
      style={{ top: "2px" }}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
};

const ChevronUpDownIcon = () => {
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
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
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

const Fees = () => {
  const [isAirportsSelected, setIsAirportsSelected] = useState(true);

  const handleAirportSelected = () => {
    setIsAirportsSelected(true);
  };

  const handleFboSelected = () => {
    setIsAirportsSelected(false);
  };

  return (
    <AnimatedPage>
      <div className="px-4 m-auto max-w-7xl pb-32">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold">Fees</h1>
        </div>

        <div className="mt-0 sm:mt-0">
          <div className="border-b border-gray-200">
            <div className="">
              <div className="-mb-px flex space-x-8" aria-label="Tabs">
                <div
                  onClick={() => handleAirportSelected()}
                  className={classNames(
                    isAirportsSelected
                      ? "border-red-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap py-4 px-1 border-b-2 font-semibold xl:text-xl xs:text-md tracking-tight cursor-pointer"
                  )}
                >
                  Airports
                </div>
                <div
                  onClick={() => handleFboSelected()}
                  className={classNames(
                    !isAirportsSelected
                      ? "border-red-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap py-4 px-1 border-b-2 font-semibold xl:text-xl xs:text-md tracking-tight cursor-pointer"
                  )}
                >
                  FBO
                </div>
              </div>
            </div>
          </div>
        </div>

        {isAirportsSelected && <AirportFees />}

        {!isAirportsSelected && <FboFees />}
      </div>
    </AnimatedPage>
  );
};

export default Fees;
