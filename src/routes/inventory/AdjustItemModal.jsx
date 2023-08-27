import { useState, useEffect } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog, Transition } from "@headlessui/react";

const AdjustItemModal = ({
  isOpen,
  handleClose,
  adjustItemQuantity,
  itemName,
  quantityToDisplay,
  locationSelected,
}) => {
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    setQuantity(quantityToDisplay);
  }, []);

  const handleSetQuantity = (value) => {
    const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setQuantity(v);
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
              Adjust Quantity
            </Dialog.Title>

            <div className="mt-8">
              <div className="font-semibold text-center m-auto flex flex-col justify-center gap-4">
                <table>
                  <tbody>
                    {itemName && (
                      <tr className="border-b border-gray-100">
                        <td className="px-0 py-3 text-right">
                          <div className="text-gray-500">Item</div>
                        </td>
                        <td className="pl-5 py-3 text-left text-gray-700 table-cell">
                          {itemName}
                        </td>
                      </tr>
                    )}
                    <tr className="border-b border-gray-100">
                      <td className="px-0 py-3 text-right">
                        <div className="text-gray-500">Quantity</div>
                      </td>
                      <td className="pl-5 py-3 text-left text-gray-700 table-cell">
                        <input
                          type="text"
                          value={quantity}
                          onChange={(e) => handleSetQuantity(e.target.value)}
                          name="quantity"
                          id="quantity"
                          className="block w-20 rounded-md border-gray-300 shadow-sm
                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                        />
                        {/* <div className="mt-1 text-sm text-gray-500">
                          Specify the total quantity left. Ex: if you have 10
                          items, and you are taking 2, then you the quantity
                          sepcified should be 8.
                           
                        </div> */}
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
            onClick={() => adjustItemQuantity(quantity)}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Adjust
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

export default AdjustItemModal;
