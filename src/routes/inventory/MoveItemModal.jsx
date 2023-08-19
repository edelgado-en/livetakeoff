import { useState, useEffect, Fragment } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";

const ChevronUpDownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MoveItemModal = ({
  isOpen,
  handleClose,
  moveItem,
  itemName,
  quantityToDisplay,
  locationSelected,
  locations,
}) => {
  const [moveQuantity, setMoveQuantity] = useState("");
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);

  useEffect(() => {
    let filtered = locations.filter((location) => location.id !== null);
    //remove locationSelected from filtered
    filtered = filtered.filter(
      (location) => location.id !== locationSelected.id
    );

    setFilteredLocations(filtered);
  }, []);

  const handleSetQuantity = (value) => {
    const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    if (Number(v) > Number(quantityToDisplay)) {
      alert("Quantity cannot be greater than the item's quantity");
    } else {
      setMoveQuantity(v);
    }
  };

  const handleMoveItem = () => {
    if (destinationLocation === null) {
      alert("Select a destination location");
      return;
    }

    if (moveQuantity.length === 0) {
      alert("Enter a quantity");
      return;
    }

    moveItem(moveQuantity, destinationLocation?.id);
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2">
        <div className="">
          <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-xl m-auto flex justify-center text-center font-medium leading-6 text-gray-900 relative top-1"
            >
              Move Item
            </Dialog.Title>

            <div className="mt-8 px-2">
              <div className="">
                <label className="block text-sm leading-6 text-gray-900 font-semibold">
                  From
                </label>
                <div className="mt-1">{locationSelected.name}</div>
              </div>
              <div className="mt-4">
                <label className="block text-sm leading-6 text-gray-900 font-semibold">
                  To
                </label>
                <div className="mt-1">
                  <Listbox
                    value={destinationLocation}
                    onChange={setDestinationLocation}
                  >
                    {({ open }) => (
                      <>
                        <div className="relative mt-1">
                          <Listbox.Button
                            className="relative w-full cursor-default rounded-md border
                                                                            border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                            shadow-sm focus:border-sky-500 focus:outline-none
                                                                            focus:ring-1 focus:ring-sky-500 sm:text-sm"
                          >
                            <span className="block truncate">
                              {destinationLocation
                                ? destinationLocation.name
                                : "Select destination"}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              className="absolute z-50 mt-1 max-h-60 w-full overflow-auto
                                                                                rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                                ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            >
                              {filteredLocations.map((location) => (
                                <Listbox.Option
                                  key={location.id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "text-white bg-red-600"
                                        : "text-gray-900",
                                      "relative cursor-default select-none py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={location}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          selected
                                            ? "font-semibold"
                                            : "font-normal",
                                          "block truncate"
                                        )}
                                      >
                                        {location.name}
                                      </span>
                                      {selected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? "text-white"
                                              : "text-red-600",
                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm leading-6 text-gray-900 font-semibold">
                  Item
                </label>
                <div className="mt-1">{itemName}</div>
              </div>

              <div className="w-full border-t border-gray-300 py-2 mt-6"></div>

              <div className="mt-2 flex justify-between gap-x-4">
                <div>
                  <label className="block text-sm leading-6 text-gray-900 font-semibold">
                    Current Quantity
                  </label>
                  <div className="mt-2">{quantityToDisplay}</div>
                </div>
                <div>
                  <label className="block text-sm leading-6 text-gray-900 font-semibold">
                    Quantity to move
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      value={moveQuantity}
                      onChange={(e) => handleSetQuantity(e.target.value)}
                      name="quantity"
                      id="quantity"
                      className="block w-20 rounded-md border-gray-300 shadow-sm
                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => handleMoveItem()}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Move
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="mt-3 inline-flex w-full justify-center rounded-md border
                                 border-gray-300 bg-white px-4 py-2 text-base font-medium
                                  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                   focus:ring-red-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalFrame>
  );
};

export default MoveItemModal;
