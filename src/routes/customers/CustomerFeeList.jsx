import { useEffect, useState } from "react";
import Loader from "../../components/loader/Loader";
import { useNavigate, useParams, Link } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import DeleteFeeModal from "./DeleteFeeModal";
import * as api from "./apiService";

import { toast } from "react-toastify";

const CustomerFeeList = () => {
  const { customerId } = useParams();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteFeeModalOpen, setDeleteFeeModalOpen] = useState(false);
  const [feeToBeDeleted, setFeeToBeDeleted] = useState(null);

  useEffect(() => {
    getFees();
  }, [customerId]);

  const getFees = async () => {
    const { data } = await api.getCustomerFees(customerId);

    setLoading(false);

    setFees(data);
  };

  const deleteFee = async (fee) => {
    await api.deleteFee(fee.id);

    setDeleteFeeModalOpen(false);

    toast.success("Fee deleted!");

    getFees();
  };

  const handleToggleDeleteFeeModal = (fee) => {
    if (fee) {
      setFeeToBeDeleted(fee);
    } else {
      setFeeToBeDeleted(null);
    }

    setDeleteFeeModalOpen(!isDeleteFeeModalOpen);
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && fees.length === 0 && (
        <div className="text-md mt-10 flex flex-col items-center">
          <div className="font-semibold text-gray-600 mt-4">
            No additional fees found
          </div>
          <p className="text-gray-500">
            Click on the plus icon to add an additional fee.
          </p>
        </div>
      )}

      <div className="overflow-hidden bg-white shadow sm:rounded-md mb-20">
        <ul className="divide-y divide-gray-200">
          {fees.map((fee) => (
            <li key={fee.id}>
              <div className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-md font-medium text-red-600">
                      {fee.type === "A" ? "Travel Fees" : ""}
                      {fee.type === "F" ? "FBO Fee" : ""}
                      {fee.type === "G" ? "General" : ""}
                      {fee.type === "V" ? "Vendor Price Difference" : ""}
                      {fee.type === "M" ? "Management Fees" : ""}
                    </p>
                    <div className="ml-2 flex flex-shrink-0">
                      <span className="inline-flex rounded-ful text-md font-semibold leading-5">
                        {!fee.is_percentage ? "$" : ""}
                        {fee.fee}
                        {fee.is_percentage ? "%" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 sm:flex sm:justify-between">
                    {fee.type === "G" && (
                      <p className="text-gray-500 text-md">
                        Applies to every job for this customer
                      </p>
                    )}
                    {fee.type === "M" && (
                      <p className="text-gray-500 text-md">
                        The fee multiply by the number of services (including
                        retainers) associated to a job.
                      </p>
                    )}
                    <div className="text-md text-gray-500">
                      {fee.travel_fees_airports.map((airport, index) => (
                        <div key={index} className="mb-2">
                          {index + 1 + ". "}
                          {airport.name}
                        </div>
                      ))}

                      {fee.vendor_higher_price_airports.map(
                        (airport, index) => (
                          <div key={index} className="mb-2">
                            {index + 1 + ". "}
                            {airport.name}
                          </div>
                        )
                      )}

                      {fee.fbos.map((fbo, index) => (
                        <div key={index} className="mb-2">
                          {index + 1 + ". "}
                          {fbo.name}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center text-md text-gray-500 sm:mt-0">
                      <Link to={`edit/${fee.id}`}>
                        <PencilIcon className="flex-shrink-0 h-5 w-5 mr-6 cursor-pointer" />
                      </Link>
                      <TrashIcon
                        onClick={() => handleToggleDeleteFeeModal(fee)}
                        className="flex-shrink-0 h-5 w-5 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {isDeleteFeeModalOpen && (
          <DeleteFeeModal
            isOpen={isDeleteFeeModalOpen}
            handleClose={handleToggleDeleteFeeModal}
            deleteFee={deleteFee}
            fee={feeToBeDeleted}
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default CustomerFeeList;
