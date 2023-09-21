import { useState, useEffect, Fragment } from "react";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Listbox, Transition, Switch } from "@headlessui/react";
import { PlusIcon, CheckIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";
import { toast } from "react-toastify";

import CreateFBOModal from "./CreateFBOModal";

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

  const [isCreateFboModalOpen, setCreateFboModalOpen] = useState(false);

  const handleToggleCreateFboModal = () => {
    setCreateFboModalOpen(!isCreateFboModalOpen);
  };

  const handleAddFbo = async (fbo) => {
    //check that the fbo.name is unique
    const fboExists = fbos.find((item) => item.name === fbo.name);

    if (fboExists) {
      alert("FBO name must be unique");
      return;
    }

    try {
      const { data } = await api.searchFbos({ name: fbo.name });

      if (data.results.length > 0) {
        alert("FBO name must be unique");
        return;
      }
    } catch (err) {
      alert("Error checking FBO name");
      return;
    }

    setFbos([...fbos, fbo]);

    setCreateFboModalOpen(false);
  };

  const handleRemoveFbo = (fbo) => {
    const newFbos = fbos.filter((item) => item.name !== fbo.name);
    setFbos(newFbos);
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

    if (fbos.length === 0) {
      alert("Please add at least one FBO");
      return;
    }

    setLoading(true);

    const request = {
      initials: code,
      name: name,
      active: isActive,
      public: isPublic,
      available_fbos: fbos,
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

            <div className="pt-8 sm:pt-10 sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-lg font-medium leading-6 text-gray-900">
                  Create FBOs
                </h1>
                <p className="mt-2 text-md text-gray-500">
                  Create FBOs for this airport. Only associated FBOs will be
                  shown when selecting this airport at the creation job view.
                </p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <button
                  type="button"
                  onClick={() => handleToggleCreateFboModal()}
                  className="block rounded-md bg-red-600 px-3 py-2 text-center text-sm
                              font-semibold text-white shadow-sm hover:bg-red-500
                              focus-visible:outline focus-visible:outline-2
                               focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Create FBO
                </button>
              </div>
            </div>

            <div className="m-auto max-w-xl">
              <ul className="divide-y divide-gray-100 mt-4">
                {fbos.map((fbo, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between gap-x-6 py-5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-y-2 items-start gap-x-3">
                        <p className="text-md leading-6 font-medium text-gray-500">
                          {fbo.name}
                        </p>
                        <p
                          className={`${
                            fbo.public
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700 border-red-700"
                          } rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-sm ring-1 ring-inset`}
                        >
                          {fbo.public ? "Public" : "Private"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-x-4">
                      <button
                        onClick={() => handleRemoveFbo(fbo)}
                        className="rounded-md bg-white px-2.5 py-1.5
                         text-sm text-gray-700 shadow-sm ring-1
                        ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-10">
            <div className="flex justify-end">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-md font-medium
                            text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                              focus:ring-red-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => addAirport()}
                className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-md font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
              >
                Add Airport
              </button>
            </div>
          </div>
        </form>
      </div>

      {isCreateFboModalOpen && (
        <CreateFBOModal
          isOpen={isCreateFboModalOpen}
          handleClose={handleToggleCreateFboModal}
          addFBO={handleAddFbo}
        />
      )}
    </AnimatedPage>
  );
};

export default CreateAirport;
