import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import BannerPlaceholder from "../../images/banner-placeholder.svg";

import { TrashIcon, PencilIcon } from "@heroicons/react/outline";

import * as api from "./apiService";

const tabs = [
  { name: "Profile", href: "details", current: true },
  { name: "Files", href: "files", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const VendorProfile = () => {
  const { vendorId } = useParams();
  const [vendorDetails, setVendorDetails] = useState(null);
  const location = useLocation();

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
    <>
      <div>
        <div>
          <img
            className="h-32 w-full object-cover lg:h-48"
            src={
              vendorDetails?.banner ? vendorDetails.banner : BannerPlaceholder
            }
            alt=""
          />
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              {vendorDetails?.logo ? (
                <img
                  className="h-24 w-24 rounded-full ring-4
                                        ring-white sm:h-32 sm:w-32 bg-white border-black"
                  src={vendorDetails?.logo}
                  alt=""
                />
              ) : (
                <span className="h-32 w-32 overflow-hidden rounded-full bg-gray-100">
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              )}
            </div>
            <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                <h1 className="truncate text-2xl font-bold text-gray-900">
                  {vendorDetails?.name}
                </h1>
              </div>
              <div className="justify-stretch mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link to={`/edit-vendor/${vendorDetails?.id}`}>
                  <PencilIcon className="h-6 w-6 cursor-pointer" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
            <h1 className="truncate text-2xl font-bold text-gray-900">
              {vendorDetails?.name}
            </h1>
          </div>
        </div>
      </div>
      <div className="mt-0 sm:mt-0 2xl:mt-5">
        <div className="border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={classNames(
                    location.pathname.includes(tab.href)
                      ? "border-red-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg"
                  )}
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-hidden">
        <Outlet />
        <div className="py-20"></div>
      </div>
    </>
  );
};

export default VendorProfile;
