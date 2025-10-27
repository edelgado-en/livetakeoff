import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import * as api from "./apiService";
import { toast } from "react-toastify";

const CustomerCategories = () => {
  const { customerId } = useParams();
  const [customerCategories, setCustomerCategories] = useState([]);
  const [customerCategorySearchTerm, setCustomerCategorySearchTerm] =
    useState("");

  useEffect(() => {
    let timeoutID = setTimeout(() => {
      searchCustomerCategories();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [customerCategorySearchTerm, customerId]);

  const searchCustomerCategories = async () => {
    try {
      const { data } = await api.searchCustomerCategories({
        customer_id: customerId,
        name: customerCategorySearchTerm,
      });

      setCustomerCategories(data.results);
    } catch (err) {
      toast.error("Unable to search customer categories");
    }
  };

  const addCustomerCategory = async () => {
    const request = {
      name: customerCategorySearchTerm,
      action: "add",
    };

    try {
      await api.updateCustomerCategory(customerId, request);

      toast.success("Category added");

      setCustomerCategorySearchTerm("");

      searchCustomerCategories();
    } catch (err) {
      toast.error("Unable to add customer category");
    }
  };

  const removeCustomerCategory = async (category_id) => {
    const request = {
      category_id: category_id,
      action: "delete",
    };

    try {
      await api.updateCustomerCategory(customerId, request);

      searchCustomerCategories();

      toast.success("Category removed");
    } catch (err) {
      toast.error("Unable to remove customer category");
    }
  };

  const updateCustomerCategory = async (category) => {
    const request = {
      category_id: category.id,
      action: category.is_active ? "remove_active" : "make_active",
    };

    try {
      await api.updateCustomerCategory(customerId, request);

      searchCustomerCategories();

      toast.success("category updated");
    } catch (err) {
      toast.error("Unable to update follower email");
    }
  };

  return (
    <AnimatedPage>
      <div className="mx-auto mt-2 max-w-7xl px-4 sm:px-6 lg:px-8 lg:pr-52">
        <div className="py-2">
          <div className="mt-1 flex">
            <div className="-mr-px grid grow grid-cols-1 focus-within:relative">
              <input
                type="text"
                value={customerCategorySearchTerm}
                onChange={(e) => setCustomerCategorySearchTerm(e.target.value)}
                placeholder="Enter one category name"
                className="col-start-1 row-start-1  rounded-l-md
                                     block w-full rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-md"
              />
            </div>
            <button
              type="button"
              onClick={() => addCustomerCategory()}
              className="flex shrink-0 items-center gap-x-1.5 rounded-r-md
                                 bg-white px-3 py-2 text-sm font-semibold text-gray-900
                                  outline outline-1 -outline-offset-1 outline-gray-300
                                hover:bg-gray-50 focus:relative focus:outline focus:outline-2
                                 focus:-outline-offset-2 focus:outline-sky-500"
            >
              Add
            </button>
          </div>

          <div className="text-gray-500 text-md my-6">
            Create customer categories to organize jobs and flag them in Job
            Details. Categories are tailored per customer and visible to
            customer users.
          </div>

          {customerCategories.length === 0 && (
            <div className="text-md mt-10 flex flex-col items-center">
              <div className="font-semibold text-gray-600 mt-6">
                No categories found.
              </div>
            </div>
          )}

          <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
            <ul role="list" className="divide-y divide-gray-100">
              {customerCategories.map((category) => (
                <li
                  key={category.id}
                  className="group flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-gray-50 focus-within:bg-gray-50"
                >
                  {/* Left: pill + name + meta */}
                  <div className="flex min-w-0 items-center gap-3">
                    {/* status dot */}
                    <span
                      className={`inline-flex h-2 w-2 relative bottom-2 flex-none rounded-full ring-2 ring-white group-hover:ring-gray-100 ${
                        category.is_active ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                      aria-label={category.is_active ? "Active" : "Inactive"}
                      title={category.is_active ? "Active" : "Inactive"}
                    />
                    {/* name + meta */}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {category.name}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {category.jobs_created} job
                        {category.jobs_created === 1 ? "" : "s"} created
                      </p>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCustomerCategory(category)}
                      aria-pressed={!!category.is_active}
                      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset transition
                        ${
                          category.is_active
                            ? "text-emerald-700 ring-emerald-200 hover:bg-emerald-50"
                            : "text-gray-700 ring-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {category.is_active ? "Active" : "Make Active"}
                    </button>
                    <button
                      onClick={() => removeCustomerCategory(category.id)}
                      className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200 hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default CustomerCategories;
