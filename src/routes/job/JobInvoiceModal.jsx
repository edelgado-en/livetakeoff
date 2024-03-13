import { useState, useEffect } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

import * as api from "./apiService";
import { toast } from "react-toastify";

const JobInvoiceModal = ({ isOpen, handleClose, invoiceDetails }) => {
  const navigate = useNavigate();

  const [internalAdditionalCost, setInternalAdditionalCost] = useState(0);
  const [vendorName, setVendorName] = useState(null);
  const [vendorAdditionalCost, setVendorAdditionalCost] = useState(0);
  const [vendorCharge, setVendorCharge] = useState(0);

  useEffect(() => {
    setInternalAdditionalCost(invoiceDetails.internal_additional_cost);

    if (invoiceDetails.vendor) {
      setVendorName(invoiceDetails.vendor.name);
      setVendorCharge(invoiceDetails.vendor.charge);
      setVendorAdditionalCost(invoiceDetails.vendor.additional_cost);
    }
  }, []);

  const handleInvoice = async () => {
    const request = {
      status: "I",
      internal_additional_cost: internalAdditionalCost,
      vendor_charge: vendorCharge,
      vendor_additional_cost: vendorAdditionalCost,
    };

    try {
      await api.invoiceJob(invoiceDetails.job_id, request);

      toast.success("Job invoiced!");

      navigate(0);
    } catch (err) {
      toast.error("Unable to invoice job");
    }
  };

  const handleVendorChargeChange = (e) => {
    const charge = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setVendorCharge(charge);
  };

  const handleVendorAdditionalCostChange = (e) => {
    const cost = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setVendorAdditionalCost(cost);
  };

  const handleInternalAdditionalCostChange = (e) => {
    const cost = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setInternalAdditionalCost(cost);
  };

  return (
    <ModalFrame isModalOpen={isOpen}>
      <div className="pt-2 px-4">
        <div className="">
          <div className="mt-3 text-center">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900 relative top-1"
            >
              Invoice Job
            </Dialog.Title>
          </div>

          <div className="mt-12">
            <div className="mt-6 grid grid-cols-2 border-b border-gray-200 pb-3">
              <div>
                <label
                  for="internalAdditionalCost"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Internal Additional Cost:
                </label>
              </div>
              <div className="">
                <div className="flex justify-end  gap-1">
                  <div className="pointer-events-none flex items-center">
                    <span className="text-gray-500 text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="internalAdditionalCost"
                    value={internalAdditionalCost}
                    onChange={(e) =>
                      handleInternalAdditionalCostChange(e.target.value)
                    }
                    className="block rounded-md border-gray-300 py-1 shadow-sm focus:border-gray-500
                               focus:ring-gray-500 text-xs"
                    style={{ width: "65px" }}
                  />
                  <span className="text-gray-500 text-sm relative top-1">
                    USD
                  </span>
                </div>
              </div>
            </div>

            {vendorName && (
              <>
                <div className="mt-12 grid grid-cols-2 border-b border-gray-200 pb-3">
                  <div className="">
                    <label
                      for="vendorCharge"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Vendor:
                    </label>
                  </div>
                  <div className="">
                    <div className="flex justify-end gap-1 text-gray-700 text-sm">
                      {vendorName}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 border-b border-gray-200 pb-3">
                  <div className="">
                    <label
                      for="vendorCharge"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Vendor Charge:
                    </label>
                  </div>
                  <div className="">
                    <div className="flex justify-end  gap-1">
                      <div className="pointer-events-none flex items-center">
                        <span className="text-gray-500 text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        id="vendorCharge"
                        value={vendorCharge}
                        onChange={(e) =>
                          handleVendorChargeChange(e.target.value)
                        }
                        className="block rounded-md border-gray-300 py-1 shadow-sm focus:border-gray-500
                                    focus:ring-gray-500 text-xs"
                        style={{ width: "65px" }}
                      />
                      <span className="text-gray-500 text-sm relative top-1">
                        USD
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 border-b border-gray-200 pb-3">
                  <div>
                    <label
                      for="vendorAdditionalCost"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Vendor Additional Cost:
                    </label>
                  </div>
                  <div className="text-right">
                    <div className="flex justify-end gap-1">
                      <div className="pointer-events-none flex items-center">
                        <span className="text-gray-500 text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        id="vendorAdditionalCost"
                        value={vendorAdditionalCost}
                        onChange={(e) =>
                          handleVendorAdditionalCostChange(e.target.value)
                        }
                        className="block rounded-md border-gray-300 py-1 shadow-sm focus:border-gray-500
                                    focus:ring-gray-500 text-xs"
                        style={{ width: "65px" }}
                      />
                      <span className="text-gray-500 text-sm relative top-1">
                        USD
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleInvoice}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Invoice
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

export default JobInvoiceModal;
