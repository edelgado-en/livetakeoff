import { useState, useEffect, Fragment } from "react";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Listbox, Transition, Switch } from "@headlessui/react";
import { PlusIcon, CheckIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";
import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CreateLocation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [enableNotifications, setEnableNotifications] = useState(false);

  const addLocation = async () => {
    if (name.length === 0) {
      alert("Please enter a name");
      return;
    }

    setLoading(true);

    const request = {
      name,
      description,
      active: isActive,
      enable_notifications: enableNotifications,
    };

    try {
      await api.createLocation(request);

      toast.success("Location Added!");
      navigate(-1);
    } catch (err) {
      toast.error("Name already exists");
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-8 pb-16 lg:pb-12 antialiased overflow-hidden border py-4 rounded-lg mb-20">
      <h2 className="text-2xl font-semibold leading-7 text-gray-900">
        Create Inventory Location
      </h2>
      <p className="mt-2 max-w-2xl text-md leading-6 text-gray-600">
        Let’s get started by filling in the information below to create a new
        inventory location.
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
                  htmlFor="name"
                  className="block text-md font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Name *
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
                  <span className="text-md text-gray-500">
                    Must be unique. Different locations cannot share the same
                    name.
                  </span>
                </div>
              </div>

              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
                <label
                  htmlFor="about"
                  className="block text-md font-medium text-gray-700 sm:mt-px sm:pt-2"
                >
                  Description
                </label>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <textarea
                    id="about"
                    name="about"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm
                                      focus:border-sky-500 focus:ring-sky-500 sm:text-md"
                  />
                  <p className="mt-2 text-md text-gray-500">
                    Write a few sentences about this location.
                  </p>
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
                        Inactive locations will not be available for selection
                        when creating a new inventory item or shown in the
                        inventory listing.
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
                        Enable Notifications
                      </Switch.Label>
                      <Switch.Description className="text-md text-gray-500">
                        Controls whether admins will get notifications when
                        inventory items are out of stock of low on stock. Admins
                        must also have the user inventory notification enabled
                        in order to get notifications.
                      </Switch.Description>
                    </div>
                    <Switch
                      checked={enableNotifications}
                      onChange={setEnableNotifications}
                      className={classNames(
                        enableNotifications ? "bg-red-500" : "bg-gray-200",
                        "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          enableNotifications
                            ? "translate-x-5"
                            : "translate-x-0",
                          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        )}
                      />
                    </Switch>
                  </Switch.Group>
                </ul>
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
              onClick={() => addLocation()}
              className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-sm font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
            >
              Add Location
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateLocation;
