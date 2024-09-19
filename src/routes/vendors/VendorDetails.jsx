import { useEffect, useState } from "react";
import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import { Dialog, Transition, Switch, Menu } from "@headlessui/react";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import * as api from "./apiService";

const formatPhoneNumber = (phoneNumberString) => {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    var intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }

  return null;
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
            <dt className="text-md font-medium text-gray-500">Active</dt>
            <dd className="mt-1 text-md text-gray-900">
              {vendorDetails.active ? "Yes" : "No"}
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
