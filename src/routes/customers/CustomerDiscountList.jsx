import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { TrashIcon, PencilIcon } from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import DeleteDiscountModal from "./DeleteDiscountModal";
import * as api from "./apiService";

const CustomerDiscountList = () => {
  const { customerId } = useParams();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteDiscountModalOpen, setDeleteDiscountModalOpen] =
    useState(false);
  const [discountToBeDeleted, setDiscountToBeDeleted] = useState(null);

  useEffect(() => {
    getDiscounts();
  }, [customerId]);

  const getDiscounts = async () => {
    setLoading(true);
    const { data } = await api.getCustomerDiscounts(customerId);

    setLoading(false);

    setDiscounts(data);
  };

  const deleteDiscount = async (discount) => {
    await api.deleteDiscount(discount.id);

    setDeleteDiscountModalOpen(false);

    getDiscounts();
  };

  const handleToggleDeleteDiscountModal = (discount) => {
    if (discount) {
      setDiscountToBeDeleted(discount);
    } else {
      setDiscountToBeDeleted(null);
    }

    setDeleteDiscountModalOpen(!isDeleteDiscountModalOpen);
  };

  return (
    <AnimatedPage>
      {!loading && discounts.length === 0 && (
        <div className="text-md mt-10 flex flex-col items-center">
          <div className="font-semibold text-gray-600 mt-4">
            No discounts found
          </div>
          <p className="text-gray-500">
            Click on the plus icon to add a discount.
          </p>
        </div>
      )}

      <div className="overflow-hidden bg-white shadow sm:rounded-md mb-20">
        <ul role="list" className="divide-y divide-gray-200">
          {discounts.map((discount) => (
            <li key={discount.id}>
              <div className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-md font-medium text-red-600">
                      {discount.type === "S" ? "By Service" : ""}
                      {discount.type === "A" ? "By Airport" : ""}
                      {discount.type === "G" ? "General" : ""}
                    </p>
                    <div className="ml-2 flex flex-shrink-0">
                      <span className="inline-flex rounded-ful text-md font-semibold leading-5">
                        {!discount.is_percentage ? "$" : ""}
                        {discount.discount}
                        {discount.is_percentage ? "%" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 sm:flex sm:justify-between">
                    {discount.type === "G" && (
                      <p className="text-gray-500 text-md">
                        Applies to every job for this customer
                      </p>
                    )}
                    <div className="text-md text-gray-500">
                      {discount.airports.map((airport, index) => (
                        <div key={index} className="mb-2">
                          {index + 1 + ". "}
                          {airport.name}
                        </div>
                      ))}

                      {discount.services.map((service, index) => (
                        <div key={index} className="mb-2">
                          {index + 1 + ". "}
                          {service.name}
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center text-md text-gray-500 sm:mt-0">
                      <Link to={`edit/${discount.id}`}>
                        <PencilIcon className="flex-shrink-0 h-4 w-4 mr-6 cursor-pointer" />
                      </Link>
                      <TrashIcon
                        onClick={() =>
                          handleToggleDeleteDiscountModal(discount)
                        }
                        className="flex-shrink-0 h-4 w-4 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {isDeleteDiscountModalOpen && (
          <DeleteDiscountModal
            isOpen={isDeleteDiscountModalOpen}
            handleClose={handleToggleDeleteDiscountModal}
            deleteDiscount={deleteDiscount}
            discount={discountToBeDeleted}
          />
        )}
      </div>
    </AnimatedPage>
  );
};

export default CustomerDiscountList;
