import { useState, useEffect } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Transition } from "@headlessui/react";

const EditItemModal = ({
  isOpen,
  handleClose,
  updateLocationItem,
  minimumRequiredToDisplay,
  thresholdToDisplay,
  locationSelected,
}) => {
  const [minimumRequired, setMinimumRequired] = useState("");
  const [threshold, setThreshold] = useState("");

  useEffect(() => {
    setMinimumRequired(minimumRequiredToDisplay);
    setThreshold(thresholdToDisplay);
  }, []);

  const handleSetMinimumRequired = (value) => {
    const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setMinimumRequired(v);
  };

  const handleSetThreshold = (value) => {
    const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setThreshold(v);
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <Dialog.Title
              as="h3"
              className="text-xl m-auto flex justify-center text-center font-medium leading-6 text-gray-900 relative top-1"
            >
              Update Location Item
            </Dialog.Title>

            <div className="mt-8">
              <div className="font-semibold text-center m-auto flex flex-col justify-center gap-4">
                <table>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-0 py-3 text-right">
                        <div className="text-gray-500">Minimum Required</div>
                      </td>
                      <td className="pl-5 py-3 text-left text-gray-700 table-cell">
                        <input
                          type="text"
                          value={minimumRequired}
                          onChange={(e) =>
                            handleSetMinimumRequired(e.target.value)
                          }
                          className="block w-20 rounded-md border-gray-300 shadow-sm
                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-0 py-3 text-right">
                        <div className="text-gray-500">Alert At</div>
                      </td>
                      <td className="pl-5 py-3 text-left text-gray-700 table-cell">
                        <input
                          type="text"
                          value={threshold}
                          onChange={(e) => handleSetThreshold(e.target.value)}
                          className="block w-20 rounded-md border-gray-300 shadow-sm
                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-0 py-3 text-right">
                        <div className="text-gray-500">Location</div>
                      </td>
                      <td className="pl-5 py-3 text-left text-gray-700 table-cell">
                        {locationSelected.name}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => updateLocationItem(minimumRequired, threshold)}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Update
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

export default EditItemModal;
