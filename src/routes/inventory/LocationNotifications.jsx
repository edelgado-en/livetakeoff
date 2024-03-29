import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { Switch } from "@headlessui/react";
import * as api from "./apiService";

import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LocationNotifications = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLocations, setTotalLocations] = useState(0);

  useEffect(() => {
    getLocations();
  }, []);

  const getLocations = async () => {
    setLoading(true);
    try {
      const { data } = await api.getLocations();

      setLocations(data.results);
      setTotalLocations(data.count);
    } catch (err) {
      toast.error("Unable to fetch locations");
    }

    setLoading(false);
  };

  const updateLocation = async (location) => {
    const request = {
      location_id: location.id,
      toggleEnableNotifications: true,
    };

    try {
      await api.updateLocation(request);
    } catch (err) {
      toast.error("Unable to update location");
    }
  };

  const handleToggleEnableNotifications = async (location) => {
    const request = {
      location_id: location.id,
      toggleEnableNotifications: true,
    };

    try {
      await api.updateLocation(request);

      const newLocations = locations.map((l) => {
        if (l.id === location.id) {
          return {
            ...l,
            enable_notifications: !l.enable_notifications,
          };
        }
        return l;
      });

      setLocations(newLocations);

      toast.success("Location updated!");
    } catch (err) {
      toast.error("Unable to update location");
    }
  };

  return (
    <AnimatedPage>
      <div className="m-auto max-w-4xl px-4">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-semibold leading-6 text-gray-900">
              Inventory Locations
            </h1>
            <p className="mt-2 text-lg text-gray-500">
              Enable notifications for each location. Admins must also enable
              the user inventory notification in order to get notifications.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              to="/create-location"
              className="block rounded-md bg-red-600 px-3 py-2 text-center text-md
                         font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Location
            </Link>
          </div>
        </div>

        {loading && <Loader />}

        {!loading && (
          <ul className="divide-y divide-gray-100 mt-8">
            {locations.map((location) => (
              <li
                key={location.id}
                className="flex justify-between gap-x-6 py-5 hover:bg-gray-50"
              >
                <div className="text-lg text-gray-500">{location.name}</div>
                <div>
                  <Switch.Group
                    as="li"
                    className="flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <Switch.Label
                        as="p"
                        className="mb-1 block text-md text-gray-500 w-full"
                        passive
                      ></Switch.Label>
                    </div>
                    <Switch
                      checked={location.enable_notifications}
                      onChange={() => handleToggleEnableNotifications(location)}
                      className={classNames(
                        location.enable_notifications
                          ? "bg-red-500"
                          : "bg-gray-200",
                        "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          location.enable_notifications
                            ? "translate-x-5"
                            : "translate-x-0",
                          "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        )}
                      />
                    </Switch>
                  </Switch.Group>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AnimatedPage>
  );
};

export default LocationNotifications;
