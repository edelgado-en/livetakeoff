import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import * as api from "./apiService";
import { toast } from "react-toastify";
import { set } from "react-hook-form";

const CustomerFollowerEmails = () => {
  const { customerId } = useParams();
  const [customerFollowerEmails, setCustomerFollowerEmails] = useState([]);
  const [customerFollowerEmailSearchTerm, setCustomerFollowerEmailSearchTerm] =
    useState("");

  useEffect(() => {
    let timeoutID = setTimeout(() => {
      searchCustomerFollowerEmails();
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [customerFollowerEmailSearchTerm, customerId]);

  const searchCustomerFollowerEmails = async () => {
    try {
      const { data } = await api.searchCustomerFollowerEmails({
        customer_id: customerId,
        email: customerFollowerEmailSearchTerm,
      });

      setCustomerFollowerEmails(data.results);
    } catch (err) {
      toast.error("Unable to search customer follower emails");
    }
  };

  const addCustomerFollowerEmail = async () => {
    const request = {
      email: customerFollowerEmailSearchTerm,
      action: "add",
    };

    try {
      await api.updateCustomerFollowerEmail(customerId, request);

      toast.success("Email added");

      setCustomerFollowerEmailSearchTerm("");

      searchCustomerFollowerEmails();
    } catch (err) {
      toast.error("Unable to add customer follower email");
    }
  };

  const removeCustomerFollowerEmail = async (email) => {
    const request = {
      email: email,
      action: "delete",
    };

    try {
      await api.updateCustomerFollowerEmail(customerId, request);

      searchCustomerFollowerEmails();

      toast.success("email removed");
    } catch (err) {
      toast.error("Unable to remove customer follower email");
    }
  };

  const updateCustomerFollowerEmail = async (email) => {
    console.log(email);
    const request = {
      email: email.email,
      action: email.is_persistent ? "remove_persistent" : "make_persistent",
    };

    try {
      await api.updateCustomerFollowerEmail(customerId, request);

      searchCustomerFollowerEmails();

      toast.success("email updated");
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
                value={customerFollowerEmailSearchTerm}
                onChange={(e) =>
                  setCustomerFollowerEmailSearchTerm(e.target.value)
                }
                placeholder="Enter one valid email address"
                className="col-start-1 row-start-1  rounded-l-md
                                     block w-full rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-md"
              />
            </div>
            <button
              type="button"
              onClick={() => addCustomerFollowerEmail()}
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
            Persistent emails will be automatically added to the follower email
            list at the job creation view for the corresponding customer.
          </div>

          {customerFollowerEmails.length === 0 && (
            <div className="text-md mt-10 flex flex-col items-center">
              <div className="font-semibold text-gray-600 mt-6">
                No follower emails found
              </div>
            </div>
          )}

          <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
            <ul role="list" className="divide-y divide-gray-100">
              {customerFollowerEmails.map((email) => (
                <li
                  key={email.id}
                  className={`${
                    email.is_persistent ? "bg-green-100" : "hover:bg-gray-50"
                  }  flex items-center justify-between gap-x-6  p-3`}
                >
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p
                        className={`mt-1 truncate text-xs/5 ${
                          email.is_persistent
                            ? "text-gray-500 font-medium"
                            : "text-gray-500"
                        } `}
                      >
                        {email.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => updateCustomerFollowerEmail(email)}
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm
                                                        font-semibold text-gray-900 shadow-sm ring-1
                                                        ring-inset ring-gray-300 hover:bg-gray-50 block"
                    >
                      {email.is_persistent
                        ? "Remove Persistent"
                        : "Make Persistent"}
                    </button>
                    <button
                      onClick={() => removeCustomerFollowerEmail(email.email)}
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm
                                                        font-semibold text-gray-900 shadow-sm ring-1
                                                        ring-inset ring-gray-300 hover:bg-gray-50 block"
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

export default CustomerFollowerEmails;
