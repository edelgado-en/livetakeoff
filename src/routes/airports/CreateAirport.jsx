import { useState, useEffect, Fragment } from "react";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Listbox, Transition, Switch } from "@headlessui/react";
import { PlusIcon, CheckIcon } from "@heroicons/react/outline";
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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CreateAirport = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isPublic, setisPublic] = useState(false);

  const [fbos, setFbos] = useState([]);
  const [totalFbos, setTotalFbos] = useState(0);
  const [loadingFbos, setLoadingFbos] = useState(false);
  const [fboSearchText, setFboSearchText] = useState("");
  const [fboAlreadyAdded, setFboAlreadyAdded] = useState(false);

  const [availableFbos, setAvailableFbos] = useState([]);

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      searchFbos();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [fboSearchText]);

  const searchFbos = async () => {
    setLoadingFbos(true);
    try {
      const request = {
        name: fboSearchText,
      };

      const { data } = await api.searchFbos(request);

      setFbos(data.results);
      setTotalFbos(data.count);
      setFboAlreadyAdded(false);

      setLoadingFbos(false);
    } catch (error) {
      setLoadingFbos(false);
    }
  };

  const addAvailableFbo = (fbo) => {
    setAvailableFbos([...availableFbos, fbo]);
  };

  const removeAvailableFbo = (fbo) => {
    setAvailableFbos(availableFbos.filter((f) => f.id !== fbo.id));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      searchFbos();
    }
  };

  const addAirport = async () => {
    if (code.length === 0) {
      alert("Please enter an airport code");
      return;
    }

    if (code.length > 4) {
      alert("Airport code cannot be longer than 4 characters");
      return;
    }

    if (name.length === 0) {
      alert("Please enter an airport name");
      return;
    }

    if (availableFbos.length === 0) {
      alert("Please add at least one FBO");
      return;
    }

    // get the available fbo ids
    const fboIds = availableFbos.map((fbo) => fbo.id);

    setLoading(true);

    const request = {
      initials: code,
      name: name,
      active: isActive,
      public: isPublic,
      available_fbo_ids: fboIds,
    };

    try {
      await api.createAirport(request);

      toast.success("Airport Added!");
      navigate(-1);
    } catch (err) {
      toast.error("Code already exists");
    }

    setLoading(false);
  };

  return (
    <AnimatedPage>
      <div className="mx-auto max-w-6xl px-8 pb-16 lg:pb-12 antialiased overflow-hidden border py-4 rounded-lg mb-20">
        <h2 className="text-2xl font-semibold leading-7 text-gray-900">
          Create Airport
        </h2>
        <p className="mt-2 max-w-2xl text-md leading-6 text-gray-600">
          Let’s get started by filling in the information below to create a new
          airport.
        </p>

        <form className="space-y-8 divide-y divide-gray-200 mt-6 text-md">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div className="space-y-6 sm:space-y-5">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Profile
                </h3>
              </div>
              <div className="space-y-6 sm:space-y-5">
                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="code"
                    className="block text-md font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Code *
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      type="text"
                      name="code"
                      id="code"
                      value={code}
                      onChange={(e) =>
                        setCode(e.target.value.toLocaleUpperCase())
                      }
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-md"
                    />
                    <span className="text-md text-gray-500">
                      Must be unique. Different airports cannot share the same
                      code.
                    </span>
                  </div>
                </div>

                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                  <label
                    htmlFor="name"
                    className="block text-md font-medium text-gray-700 sm:mt-px sm:pt-2"
                  >
                    Name
                  </label>
                  <div className="mt-1 sm:col-span-2 sm:mt-0">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                  focus:border-sky-500 focus:ring-sky-500 sm:max-w-xs sm:text-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 divide-y divide-gray-200 pt-8 sm:space-y-5 sm:pt-10">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Settings
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="">
                  <ul className="mt-2 divide-y divide-gray-200">
                    <Switch.Group
                      as="li"
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex flex-col">
                        <Switch.Label
                          as="p"
                          className="text-md font-medium text-gray-700"
                          passive
                        >
                          Active
                        </Switch.Label>
                        <Switch.Description className="text-md text-gray-500">
                          Inactive airports will not be available for selection
                          when creating a job.
                        </Switch.Description>
                      </div>
                      <Switch
                        checked={isActive}
                        onChange={setIsActive}
                        className={classNames(
                          isActive ? "bg-red-500" : "bg-gray-200",
                          "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            isActive ? "translate-x-5" : "translate-x-0",
                            "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          )}
                        />
                      </Switch>
                    </Switch.Group>
                    <Switch.Group
                      as="li"
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex flex-col">
                        <Switch.Label
                          as="p"
                          className="text-md font-medium text-gray-700"
                          passive
                        >
                          Public
                        </Switch.Label>
                        <Switch.Description className="text-md text-gray-500">
                          Customer users can only see public airports while
                          creating a job.
                        </Switch.Description>
                      </div>
                      <Switch
                        checked={isPublic}
                        onChange={setisPublic}
                        className={classNames(
                          isPublic ? "bg-red-500" : "bg-gray-200",
                          "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={classNames(
                            isPublic ? "translate-x-5" : "translate-x-0",
                            "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          )}
                        />
                      </Switch>
                    </Switch.Group>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-8 sm:pt-10">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mt-2">
                  Available FBOs
                </h3>
              </div>
              <div className="text-md text-gray-500">
                Associate FBOs to this airport. Only associated FBOs will be
                shown when selecting this airport at the creation job view.
              </div>

              <div className="mt-8 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                <div
                  className="border border-gray-200 rounded-md p-4"
                  style={{ height: "1100px" }}
                >
                  <div className="font-medium text-md">
                    <div className="flex justify-between">
                      <div>
                        All FBOs
                        <span
                          className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-md font-medium inline-block"
                        >
                          {totalFbos}
                        </span>
                      </div>
                      <div>
                        {fboAlreadyAdded && (
                          <div className="text-red-500 text-md relative top-1">
                            FBO already added
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
                          onClick={() => searchFbos()}
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
                          value={fboSearchText}
                          onChange={(event) =>
                            setFboSearchText(event.target.value)
                          }
                          onKeyDown={handleKeyDown}
                          className="block w-full rounded-md border-gray-300 pl-10
                                                            focus:border-sky-500 text-md
                                                            focus:ring-sky-500  font-normal"
                          placeholder="Search name..."
                        />
                      </div>
                    </div>
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "1100px" }}
                    >
                      {fbos.map((fbo) => (
                        <div key={fbo.id} className="relative">
                          <ul className="">
                            <li className="">
                              <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                <div className="min-w-0 flex-1">
                                  <p className="text-md text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                    {fbo.name}
                                  </p>
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => addAvailableFbo(fbo)}
                                    className="inline-flex items-center rounded border
                                                                                    border-gray-300 bg-white px-2 py-1 text-md
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
                  style={{ height: "1100px" }}
                >
                  <div className="font-medium text-md">
                    Available FBOs
                    <span
                      className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                            rounded-full text-md font-medium inline-block"
                    >
                      {availableFbos.length}
                    </span>
                  </div>
                  <div className="text-md">
                    {availableFbos.length === 0 && (
                      <div className="text-center m-auto mt-24 text-md">
                        No available FBOs set.
                      </div>
                    )}

                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "1100px" }}
                    >
                      {availableFbos.map((fbo) => (
                        <div key={fbo.id} className="relative">
                          <ul className="">
                            <li className="">
                              <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                <div className="min-w-0 flex-1">
                                  <p className="text-lg text-gray-900 font-normal truncate overflow-ellipsis w-60">
                                    {fbo.name}
                                  </p>
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    onClick={() => removeAvailableFbo(fbo)}
                                    className="inline-flex items-center rounded border
                                      border-gray-300 bg-white px-2 py-1 text-md
                                      text-gray-700 shadow-sm
                                      hover:bg-gray-50 focus:outline-none focus:ring-2
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
                onClick={() => addAirport()}
                className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-sm font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
              >
                Add Airport
              </button>
            </div>
          </div>
        </form>
      </div>
    </AnimatedPage>
  );
};

export default CreateAirport;
