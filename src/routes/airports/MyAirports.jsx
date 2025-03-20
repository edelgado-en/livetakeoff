import { Link } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
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

const MyAirports = () => {
  const [loading, setLoading] = useState(true);
  const [airports, setAirports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [totalAirports, setTotalAirports] = useState(0);

  const [availableFbos, setAvailableFbos] = useState([]);

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
      const { data } = await api.searchAirports(request, 1);

      setTotalAirports(data.count);
      setAirports(data.results);
      setLoading(false);
    } catch (err) {
      toast.error("Unable to get airports");
    }
    setLoading(false);
  };

  const getAvailableFbos = async (airportId) => {
    //set the airportId to the selected airport
    setAirports(
      airports.map((airport) =>
        airport.id === airportId
          ? { ...airport, selected: !airport.selected }
          : airport
      )
    );

    try {
      const { data } = await api.getAirportAvailableFbos(airportId);

      setAvailableFbos(data);
    } catch (err) {
      toast.error("Unable to get available fbos");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchAirports();
    }
  };

  const deSelectAirport = (airportId) => {
    setAvailableFbos([]);

    setAirports(
      airports.map((airport) =>
        airport.id === airportId ? { ...airport, selected: false } : airport
      )
    );
  };

  return (
    <AnimatedPage>
      <div className="xl:px-16 px-4 m-auto max-w-5xl -mt-3 pb-32">
        <div className="grid grid-cols-2">
          <div className="">
            <h1 className="text-2xl font-semibold text-gray-600">
              My Airports
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Total: <span className="text-gray-900">{totalAirports}</span>
            </p>
          </div>
          <div className="text-right"></div>
        </div>

        <div className="w-full mt-4">
          <div className="relative border-b border-gray-200">
            <div
              onClick={() => searchAirports()}
              className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer"
            >
              <MagnifyingGlassIcon
                className="h-4 w-4 text-gray-400 cursor-pointer"
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
              className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                                    focus:ring-sky-500 text-sm"
              placeholder="search by tail"
            />
          </div>
        </div>

        {loading && <Loader />}

        {!loading && airports.length === 0 && (
          <div className="text-center mt-14 ">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No airports found
            </h3>
            <p className="mt-1 text-md text-gray-500">
              Contact your account manager to configure more airports.
            </p>
          </div>
        )}

        {!loading && (
          <div className="overflow-hidden bg-white shadow sm:rounded-md mt-2">
            <ul className="divide-y divide-gray-200">
              {airports.map((airport) => (
                <li key={airport.id}>
                  <div className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="w-full grid xl:grid-cols-2 lg:grid-cols-2 md-grid-cols-2 xs:grid-cols-1">
                          <div>
                            <span className="font-medium text-red-600 text-md">
                              {airport.name}
                            </span>
                            <span className="text-sm">
                              {" "}
                              - {airport.initials}
                            </span>
                          </div>
                          <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left"></div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        {airport.selected ? (
                          <ChevronUpIcon
                            onClick={() => deSelectAirport(airport.id)}
                            className="h-5 w-5 text-gray-400 cursor-pointer"
                            aria-hidden="true"
                          />
                        ) : (
                          <ChevronDownIcon
                            onClick={() => getAvailableFbos(airport.id)}
                            className="h-5 w-5 text-gray-400 cursor-pointer"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                    </div>
                    {airport.selected && (
                      <>
                        <div className="px-4 py-2 sm:px-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h3 className="text-md font-medium text-gray-900">
                                FBOs
                              </h3>
                              <ol className="divide-y divide-gray-100 pl-5">
                                {availableFbos.map((fbo) => (
                                  <li
                                    key={fbo.id}
                                    className="flex justify-between gap-x-6 py-3"
                                  >
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium text-gray-900">
                                        {fbo.name}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {fbo.location}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default MyAirports;
