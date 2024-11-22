import { useEffect, useState, Fragment } from "react";
import {
  TrashIcon,
  PencilIcon,
  CheckCircleIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Listbox, Transition, Switch } from "@headlessui/react";

import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import * as api from "./apiService";

import { toast } from "react-toastify";

import Pagination from "react-js-pagination";

const PricePlanDetails = () => {
  const { pricePlanId } = useParams();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [nameAlreadyExists, setNameAlreadyExists] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getPricePlanDetails();
  }, []);

  const getPricePlanDetails = async () => {
    setLoading(true);
    try {
      const { data } = await api.getPricePlanDetails(pricePlanId);
      setName(data.name);
      setDescription(data.description);
    } catch (error) {
      toast.error("Unable to get price list details");
    }

    setLoading(false);
  };

  const updatePricePlan = async () => {
    if (name === "") {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      await api.editPricePlan(pricePlanId, { name, description });
      toast.success("Price list updated successfully");
    } catch (error) {
      if (error.response.status === 400) {
        setNameAlreadyExists(true);
      } else {
        toast.error("Unable to update price list");
      }
    }

    setLoading(false);
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <main className="mx-auto max-w-7xl px-4 pb-16 lg:pb-12">
          <div className="space-y-6 mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-600">
                Price List Details
              </h1>
              <p className="mt-1 text-md text-gray-500">
                You can update any information associated with this price list.
              </p>
            </div>
          </div>
          <div>
            <div className="text-xl font-semibold text-gray-600 mb-4">
              Basic Information
            </div>
            <div>
              <label
                htmlFor="itemName"
                className="block text-md font-medium text-gray-700"
              >
                Name{" "}
                <span className=" text-red-400 text-md">(Must be unique)</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="itemName"
                  id="itemName"
                  className="block w-full rounded-md border-gray-300 shadow-sm
                                focus:border-sky-500 focus:ring-sky-500 text-md"
                />
                {nameAlreadyExists && (
                  <p className="text-red-500 text-md font-semibold mt-2">
                    A price list with this name already exists.
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="itemDescription"
                className="block text-md text-gray-500"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="itemDescription"
                  id="itemDescription"
                  className="block w-full rounded-md border-gray-300 shadow-sm
                                        focus:border-sky-500 focus:ring-sky-500 text-md"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end my-4">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-md font-medium
                            text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                              focus:ring-red-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => updatePricePlan()}
              className="ml-3 inline-flex justify-center rounded-md border
                              border-transparent bg-red-600 py-2 px-4 text-md font-medium
                                text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                focus:ring-red-500 focus:ring-offset-2"
            >
              Update
            </button>
          </div>
        </main>
      )}
    </AnimatedPage>
  );
};

export default PricePlanDetails;
