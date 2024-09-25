import { useEffect, useState } from "react";
import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import * as api from "./apiService";

const VendorDetails = () => {
  const { vendorId } = useParams();
  const [vendorDetails, setVendorDetails] = useState({});

  useEffect(() => {
    getVendorDetails();
  }, [vendorId]);

  const getVendorDetails = async () => {
    try {
      const { data } = await api.getVendorDetails(vendorId);

      setVendorDetails(data);
    } catch (err) {}
  };

  return (
    <AnimatedPage>
      <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">Phone Numbers</dt>
            <dd className="mt-1 text-md text-gray-900">
              {vendorDetails.phone_numbers
                ? vendorDetails.phone_numbers
                : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">Emails</dt>
            <dd className="mt-1 text-md text-gray-900">
              {vendorDetails.emails ? vendorDetails?.emails : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">
              Billing Address
            </dt>
            <dd className="mt-1 text-md text-gray-900">
              {vendorDetails.billing_address
                ? vendorDetails.billing_address
                : "Not specified"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-md font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-md text-gray-900">
              {vendorDetails.active ? (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-1.5 py-0.5 text-md font-medium text-green-700">
                  <svg
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                    className="h-2 w-2 fill-green-500"
                  >
                    <circle r={3} cx={3} cy={3} />
                  </svg>
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-1.5 py-0.5 text-md font-medium text-red-700">
                  <svg
                    viewBox="0 0 6 6"
                    aria-hidden="true"
                    className="h-2 w-2 fill-red-500"
                  >
                    <circle r={3} cx={3} cy={3} />
                  </svg>
                  Inactive
                </span>
              )}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-md font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 space-y-5 text-md text-gray-900">
              {vendorDetails.notes ? vendorDetails.notes : "Not specified"}
            </dd>
          </div>
        </dl>
      </div>
    </AnimatedPage>
  );
};

export default VendorDetails;
