import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition, Switch, Menu, Listbox } from "@headlessui/react";
import {
  ChevronLeftIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import Loader from "../../components/loader/Loader";
import * as api from "./apiService";

import {
  Link,
  useParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

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

const Airports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [airports, setAirports] = useState([]);
  const [totalAirports, setTotalAirports] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchAirports();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [searchText]);

  const searchAirports = async () => {
    setLoading(true);

    const request = {
      name: searchText,
    };

    try {
      const { data } = await api.searchAirports(request);

      setTotalAirports(data.count);
      setAirports(data.results);
      setLoading(false);

      if (firstLoad) {
        setFirstLoad(false);
        if (data.results.length > 0) {
          getAirportDetails(data.results[0].id);
          //account for page refresh. Maintain current inner route
          let airportId = location.pathname.match(/\d+/);

          if (airportId !== null) {
            airportId = airportId[0];
          } else {
            airportId = data.results[0].id;
          }

          navigate("/airports/" + airportId);
        }
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchAirports();
    }
  };

  const getAirportDetails = (airportId) => {
    setSidebarOpen(false);
    navigate("/airports/" + airportId);
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
                    <div className="flex justify-between">
                      <h2 className="text-2xl font-medium text-gray-900">
                        Airports
                      </h2>
                      <div>
                        <Link to="/create-airport">
                          <button
                            type="button"
                            className="flex items-center justify-center rounded-full bg-red-600 p-1
                                                text-white hover:bg-red-700 focus:outline-none focus:ring-2
                                                    focus:ring-red-500 focus:ring-offset-2"
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
                          </button>
                        </Link>
                      </div>
                    </div>
                    {/* MOBILE */}
                    <form className="mt-2 w-full" action="#">
                      <div className="">
                        <label htmlFor="search" className="sr-only">
                          Search
                        </label>
                        <div className="relative rounded-md shadow-sm">
                          <div
                            onClick={() => searchAirports()}
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
                                    focus:ring-sky-500 text-sm mt-4"
                            placeholder="Search name..."
                          />
                        </div>
                      </div>
                    </form>
                    {/* Directory list Mobile */}
                    <nav
                      className="min-h-0 flex-1 overflow-y-auto mt-1"
                      style={{ height: "800px", paddingBottom: "250px" }}
                      aria-label="Directory"
                    >
                      {loading && <Loader />}

                      {!loading && totalAirports === 0 && (
                        <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                          <p className="font-semibold">No airports found.</p>
                        </div>
                      )}
                      {airports.map((airport) => (
                        <div key={airport.id} className="relative">
                          <ul className="relative z-0 divide-y divide-gray-200">
                            <li onClick={() => getAirportDetails(airport.id)}>
                              <div
                                className="relative flex items-center space-x-3 py-3 focus-within:ring-2
                                                 focus-within:ring-inset focus-within:ring-red-500 hover:bg-gray-50"
                              >
                                <div className="min-w-0 flex-1">
                                  <div className="focus:outline-none">
                                    {/* Extend touch target to entire panel */}
                                    <span
                                      className="absolute inset-0"
                                      aria-hidden="true"
                                    />
                                    <p className="text-sm text-gray-900">
                                      {airport.name}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <span
                                    className={`inline-flex items-center rounded-full
                                         px-2 py-0.5 text-sm bg-gray-100`}
                                  >
                                    {airport.initials}
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
            <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none 2xl:order-last">
              {/* Mobile only */}
              <nav
                className="flex items-start px-4 py-3 sm:px-6 lg:px-8 2xl:hidden"
                aria-label="Breadcrumb"
              >
                <div
                  onClick={() => setSidebarOpen(true)}
                  className="inline-flex items-center space-x-3 text-lg font-medium text-gray-900"
                >
                  <ChevronLeftIcon
                    className="-ml-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Airports</span>
                </div>
              </nav>

              <article className="pt-8">
                <Outlet />
              </article>
            </main>
            <aside className="hidden w-96 flex-shrink-0 border-r border-gray-200 2xl:order-first 2xl:flex 2xl:flex-col">
              <div className="px-6 pr-4 pt-6 pb-4">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-medium text-gray-900">
                    Airports
                  </h2>
                  <div>
                    <Link to="/create-airport">
                      <button
                        type="button"
                        className="flex items-center justify-center rounded-full bg-red-600 p-1
                                                text-white hover:bg-red-700 focus:outline-none focus:ring-2
                                                    focus:ring-red-500 focus:ring-offset-2"
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
                      </button>
                    </Link>
                  </div>
                </div>
                <p className="mt-1 text-md text-gray-600">
                  Search directory of {totalAirports} airports
                </p>
                <form className="mt-3 w-full" action="#">
                  <div className="">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div
                        onClick={() => searchAirports()}
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
                                 focus:ring-sky-500 sm:text-md"
                        placeholder="Search name..."
                      />
                    </div>
                  </div>
                </form>
              </div>
              {/* Directory list */}
              <nav
                className="min-h-0 flex-1 overflow-y-auto"
                aria-label="Directory"
              >
                {loading && <Loader />}

                {!loading && totalAirports === 0 && (
                  <div className="text-gray-500 text-md flex flex-col mt-20 text-center">
                    <p className="font-semibold">No airports found.</p>
                  </div>
                )}
                {/* DESKTOP */}
                {airports.map((airport) => (
                  <div key={airport.id} className="relative">
                    <ul className="relative z-0 divide-y divide-gray-200">
                      <li
                        onClick={() => getAirportDetails(airport.id)}
                        className="border-b cursor-pointer"
                      >
                        <div
                          className="relative flex items-center space-x-3 pl-6 pr-4 py-5 focus-within:ring-2
                                          focus-within:ring-inset focus-within:ring-red-500 hover:bg-gray-50"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="focus:outline-none">
                              {/* Extend touch target to entire panel */}
                              <span
                                className="absolute inset-0"
                                aria-hidden="true"
                              />
                              <p className="text-md text-gray-900">
                                {airport.name}
                              </p>
                            </div>
                          </div>
                          <div>
                            <span
                              className={`inline-flex items-center rounded-full
                                         px-2 py-0.5 text-sm bg-gray-100`}
                            >
                              {airport.initials}
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

export default Airports;
