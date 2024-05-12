import { useState, useEffect } from "react";
import ModalFrame from "../../components/modal/ModalFrame";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

import * as api from "./apiService";
import { toast } from "react-toastify";

const JobNotInvoiceModal = ({ isOpen, handleClose, invoiceDetails }) => {
  const navigate = useNavigate();

  const handleNotInvoice = async () => {
    const request = {
      status: "N",
    };

    try {
      await api.invoiceJob(invoiceDetails.job_id, request);

      toast.success("Job not invoiced!");

      navigate(0);
    } catch (err) {
      toast.error("Unable to not invoice job");
    }
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
              Not Invoice Job
            </Dialog.Title>
          </div>

          <div className="mt-2">
            <p className="text-md text-gray-500 py-3">
              Are you sure you want to flag this job as not invoiced?
            </p>
          </div>
        </div>

        <div className="mt-8 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleNotInvoice}
            className="inline-flex w-full justify-center rounded-md border border-transparent
                              bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Not Invoice
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

export default JobNotInvoiceModal;
