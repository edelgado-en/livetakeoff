import { useState, useEffect } from "react";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";
import {
  ChevronLeftIcon,
  CheckIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  UserIcon,
  CalendarIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import PricePlanDeleteModal from "./PricePlanDeleteModal";
import PricePlanEditModal from "./PricePlanEditModal";

import ReactTimeAgo from "react-time-ago";

import { fetchUser, selectUser } from "../../routes/userProfile/userSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

import * as api from "./apiService";

const PricePlans = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUser);

  const [loading, setLoading] = useState(false);
  const [pricingPlans, setPricingPlans] = useState([]);
  const [isDeletePricePlanModalOpen, setDeletePricePlanModalOpen] =
    useState(false);
  const [pricePlanToBeDeleted, setPricePlanToBeDeleted] = useState(null);
  const [isEditPricePlanModalOpen, setEditPricePlanModalOpen] = useState(false);
  const [pricePlanToBeEdit, setPricePlanToBeEdit] = useState(null);

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  useEffect(() => {
    getPricingPlans();
  }, []);

  const getPricingPlans = async () => {
    const { data } = await api.getPricingPlans();
    setPricingPlans(data.results);
  };

  const handleToggleDeletePricePlanModal = (pricePlan) => {
    setPricePlanToBeDeleted(pricePlan);
    setDeletePricePlanModalOpen(!isDeletePricePlanModalOpen);
  };

  const handleToggleEditPricePlanModal = (pricePlan) => {
    setPricePlanToBeEdit(pricePlan);
    setEditPricePlanModalOpen(!isEditPricePlanModalOpen);
  };

  const handleDeletePricePlan = async (pricePlan) => {
    setDeletePricePlanModalOpen(false);
    setLoading(true);

    try {
      await api.deletePricePlan(pricePlan.id);
      getPricingPlans();

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEditPricePlan = async (pricePlan) => {
    setEditPricePlanModalOpen(false);
    setLoading(true);

    const request = {
      name: pricePlan.name,
      description: pricePlan.description,
    };

    try {
      await api.editPricePlan(pricePlan.id, request);
      getPricingPlans();

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <article className="m-auto max-w-5xl px-2">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">
              Pricing Lists
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Start by adding a new one, then add prices for all services.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {(currentUser.isAdmin ||
              currentUser.isSuperUser ||
              currentUser.isAccountManager) && (
              <Link
                to="add"
                className="inline-flex items-center justify-center rounded-md border border-transparent
                                        bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm
                                        hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500
                                        focus:ring-offset-2 sm:w-auto"
              >
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                Add List
              </Link>
            )}
          </div>
        </div>

        {loading && <Loader />}

        {!loading && (
          <div className="mt-10 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols1 sm:grid-cols-1 xs:grid-cols-1 gap-6">
            {pricingPlans.map((pricingPlan) => (
              <div
                key={pricingPlan.name}
                className="divide-y divide-gray-200 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="p-6">
                  <div className="flex justify-between">
                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                      {pricingPlan.name}
                    </h2>
                    {pricingPlan.name !== "Standard" && (
                      <div className="flex gap-3">
                        <PencilIcon
                          onClick={() =>
                            handleToggleEditPricePlanModal(pricingPlan)
                          }
                          className="h-4 w-4 text-gray-500 cursor-pointer"
                        />

                        <TrashIcon
                          onClick={() =>
                            handleToggleDeletePricePlanModal(pricingPlan)
                          }
                          className="h-4 w-4 text-gray-500 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  <p
                    className="mt-4 text-sm text-gray-500"
                    style={{ minHeight: "60px" }}
                  >
                    {pricingPlan.description}
                  </p>
                  <Link
                    to={`${pricingPlan.id}`}
                    className="mt-8 block w-full rounded-md border border-transparent
                                                bg-red-600 py-2 text-center text-sm font-semibold
                                                text-white hover:bg-red-700"
                  >
                    See prices
                  </Link>
                </div>
                <div className="px-6 pt-2 pb-8 relative">
                  {pricingPlan.is_vendor && (
                    <div className="inline-flex text-sm text-white rounded-md py-1 px-2 bg-blue-400 absolute right-2 top-2">
                      Vendor
                    </div>
                  )}
                  <ul className="mt-6 space-y-4">
                    <li className="flex space-x-3">
                      <UserIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-500">
                        Created by{" "}
                        {pricingPlan.created_by
                          ? pricingPlan.created_by.username
                          : "System"}
                      </span>
                    </li>
                    <li className="flex space-x-3">
                      <CalendarIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-500">
                        Created on{" "}
                        <ReactTimeAgo
                          date={new Date(pricingPlan.created_at)}
                          locale="en-US"
                          timeStyle="twitter"
                        />
                      </span>
                    </li>
                    <li className="flex space-x-3">
                      <UsersIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-500">
                        {pricingPlan.num_customers} customer(s) currently using
                        it
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      {isDeletePricePlanModalOpen && (
        <PricePlanDeleteModal
          isOpen={isDeletePricePlanModalOpen}
          priceList={pricePlanToBeDeleted}
          handleClose={handleToggleDeletePricePlanModal}
          deletePriceList={handleDeletePricePlan}
        />
      )}

      {isEditPricePlanModalOpen && (
        <PricePlanEditModal
          isOpen={isEditPricePlanModalOpen}
          priceList={pricePlanToBeEdit}
          handleClose={handleToggleEditPricePlanModal}
          updatePriceList={handleEditPricePlan}
        />
      )}
    </AnimatedPage>
  );
};

export default PricePlans;
