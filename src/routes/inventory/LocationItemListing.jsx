import { Link } from "react-router-dom";
import { Fragment } from "react";
import { PhotographIcon } from "@heroicons/react/outline";

import { Transition, Menu } from "@headlessui/react";

const EllipsisVerticalIcon = () => {
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
        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
      />
    </svg>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const LocationItemListing = ({
  isGridView,
  locationItems,
  currentUser,
  thresholdMet,
  minimumRequiredMet,
  handleToggleMoveItemModal,
  handleToggleAdjustItemModal,
  handleToggleConfirmItemModal,
}) => {
  return (
    <div className="bg-white shadow sm:rounded-md mb-4">
      {!isGridView && (
        <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 mb-6 px-1">
          {locationItems.map((locationItem) => (
            <div key={locationItem.id} className="group relative pr-2 pb-4">
              {!currentUser.isProjectManager && (
                <Link
                  to={`/inventory/${locationItem?.item.id}/details`}
                  className="flex-shrink-0 cursor-pointer"
                >
                  {locationItem?.item.photo && (
                    <img
                      src={locationItem.item.photo}
                      alt={locationItem.item.name}
                      className="h-60 rounded-lg"
                    />
                  )}

                  {!locationItem?.item.photo && (
                    <PhotographIcon className="h-60 w-56 text-gray-200 items-center m-auto align-middle" />
                  )}
                </Link>
              )}

              {currentUser.isProjectManager && (
                <div className="flex-shrink-0 cursor-pointer">
                  {locationItem?.item.photo && (
                    <img
                      src={locationItem.item.photo}
                      alt={locationItem.item.name}
                      className="h-60 rounded-lg"
                    />
                  )}

                  {!locationItem?.item.photo && (
                    <PhotographIcon className="h-60 w-56 text-gray-200 items-center m-auto align-middle" />
                  )}
                </div>
              )}

              <div className="mt-1 flex justify-between">
                <div className="flex gap-1">
                  <div
                    className={`flex-none rounded-full ${
                      locationItem?.status === "C"
                        ? "bg-green-400/10 p-1 text-green-400"
                        : "bg-red-400/10 p-1 text-red-400"
                    }`}
                  >
                    <div className="h-2 w-2 rounded-full bg-current" />
                  </div>
                  <h3
                    className="text-sm text-gray-900 font-medium truncate"
                    style={{ maxWidth: "170px" }}
                  >
                    {locationItem?.item.name}
                  </h3>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {locationItem.quantity}
                </p>
              </div>
              {thresholdMet && (
                <div className="flex justify-between text-gray-500 italic text-sm mt-1">
                  <div>Threshold</div>
                  <div>{locationItem.threshold}</div>
                </div>
              )}
              {minimumRequiredMet && (
                <div className="flex justify-between text-gray-500 italic text-sm mt-1">
                  <div>Minimum Required</div>
                  <div>{locationItem.minimum_required}</div>
                </div>
              )}

              <div className="mt-2 text-sm text-gray-500 flex justify-between gap-2 italic">
                <div>
                  <span>{locationItem.item.area === "I" && "Interior"}</span>
                  <span>{locationItem.item.area === "E" && "Exterior"}</span>
                  <span>
                    {locationItem.item.area === "B" && "Interior and Exterior"}
                  </span>
                  <span>{locationItem.item.area === "O" && "Office"}</span>
                </div>
                <div>
                  <span>{locationItem.item.measure_by === "U" && "Unit"}</span>
                  <span>
                    {locationItem.item.measure_by === "G" && "Gallons"}
                  </span>
                  <span>
                    {locationItem.item.measure_by === "B" && "Bottle"}
                  </span>
                  <span>{locationItem.item.measure_by === "O" && "Box"}</span>
                  <span>{locationItem.item.measure_by === "L" && "Lb"}</span>
                  <span>{locationItem.item.measure_by === "J" && "Jar"}</span>
                  <span>{locationItem.item.measure_by === "T" && "Other"}</span>
                </div>
              </div>
              <div className="mt-3">
                <button
                  disabled={locationItem.quantity === 0}
                  onClick={() => handleToggleMoveItemModal(locationItem)}
                  className="w-full relative flex items-center justify-center rounded-md 
                                            border border-transparent bg-blue-500 px-8 py-2 text-sm
                                            font-medium text-white hover:bg-blue-600"
                >
                  Move
                </button>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => handleToggleAdjustItemModal(locationItem)}
                  className="w-full relative flex items-center justify-center rounded-md 
                                            border border-transparent bg-gray-100 px-8 py-2 text-sm
                                            font-medium text-gray-900 hover:bg-gray-200"
                >
                  Adjust
                </button>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => handleToggleConfirmItemModal(locationItem)}
                  disabled={locationItem.status === "C"}
                  className="w-full relative flex items-center justify-center rounded-md 
                                            border border-transparent bg-gray-100 px-8 py-2 text-sm
                                            font-medium text-gray-900 hover:bg-gray-200"
                >
                  Confirm
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isGridView && (
        <ul className="mt-1 divide-y divide-gray-200 border-t border-gray-200 sm:mt-0 sm:border-t-0">
          {locationItems.map((locationItem) => (
            <li key={locationItem.id}>
              <div className="group block hover:bg-gray-50">
                <div className="flex items-center pr-4 pl-1 py-1">
                  <div className="flex min-w-0 flex-1 items-center">
                    {!currentUser.isProjectManager && (
                      <Link
                        to={`/inventory/${locationItem.item.id}/details`}
                        className="flex-shrink-0 w-20"
                      >
                        <img
                          className="h-20 rounded-md group-hover:opacity-75"
                          src={locationItem.item.photo}
                          alt=""
                        />
                      </Link>
                    )}
                    {currentUser.isProjectManager && (
                      <div className="flex-shrink-0 w-20">
                        <img
                          className="h-20 rounded-md group-hover:opacity-75"
                          src={locationItem.item.photo}
                          alt=""
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div className="flex gap-4 justify-between">
                        <div className="text-sm font-medium">
                          <div className="flex gap-1">
                            <div
                              className={`flex-none rounded-full ${
                                locationItem.status === "C"
                                  ? "bg-green-400/10 p-1 text-green-400"
                                  : "bg-red-400/10 p-1 text-red-400"
                              }`}
                            >
                              <div className="h-2 w-2 rounded-full bg-current" />
                            </div>
                            <div>{locationItem.item.name}</div>
                          </div>

                          <div className="mt-1 italic text-gray-500 text-sm font-normal">
                            <span>
                              {locationItem.item.area === "I" && "Interior"}
                            </span>
                            <span>
                              {locationItem.item.area === "E" && "Exterior"}
                            </span>
                            <span>
                              {locationItem.item.area === "B" &&
                                "Interior and Exterior"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-4">
                      <div className="font-medium text-right">
                        {locationItem.quantity}
                        {minimumRequiredMet && (
                          <div className=" text-gray-500 italic font-normal text-sm">
                            Min Required: {locationItem.minimum_required}
                          </div>
                        )}
                        {thresholdMet && (
                          <div className=" text-gray-500 italic font-normal text-sm">
                            Threshold: {locationItem.threshold}
                          </div>
                        )}
                      </div>
                      <Menu as="div" className="relative ml-auto">
                        <Menu.Button
                          className="-m-2.5 block p-2.5 text-gray-400
                                                            hover:text-gray-500"
                        >
                          <span className="sr-only">Open options</span>
                          <EllipsisVerticalIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </Menu.Button>
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
                            className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right
                                                        rounded-md bg-white py-2 shadow-lg ring-1
                                                        ring-gray-900/5 focus:outline-none"
                          >
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    handleToggleMoveItemModal(locationItem)
                                  }
                                  className={classNames(
                                    active ? "bg-gray-50" : "",
                                    "block px-3 py-1 text-sm leading-6 text-gray-900"
                                  )}
                                >
                                  Move
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    handleToggleAdjustItemModal(locationItem)
                                  }
                                  className={classNames(
                                    active ? "bg-gray-50" : "",
                                    "block px-3 py-1 text-sm leading-6 text-gray-900"
                                  )}
                                >
                                  Adjust
                                </button>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() =>
                                    handleToggleConfirmItemModal(locationItem)
                                  }
                                  className={classNames(
                                    active ? "bg-gray-50" : "",
                                    "block px-3 py-1 text-sm leading-6 text-gray-900"
                                  )}
                                >
                                  Confirm
                                </button>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationItemListing;
