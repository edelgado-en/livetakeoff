import { useEffect, useState, Fragment } from "react";
import {
  Link,
  useParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";

const tabs = [
  { name: "Current Stats", href: "current" },
  { name: "Historical Stats", href: "historical" },
  { name: "Growth", href: "growth" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const InventoryDashboard = () => {
  const location = useLocation();

  return (
    <AnimatedPage>
      <div className="px-4 max-w-7xl m-auto">
        <h2 className="text-3xl font-bold tracking-tight sm:text-3xl pb-3">
          Inventory Dashboard
        </h2>

        <div className="mt-0 sm:mt-0">
          <div className="border-b border-gray-200">
            <div className="">
              <div className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                  <Link
                    key={tab.name}
                    to={tab.href}
                    className={classNames(
                      location.pathname.includes(tab.href)
                        ? "border-red-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                      "whitespace-nowrap py-4 px-1 border-b-2 font-semibold xl:text-xl xs:text-md tracking-tight"
                    )}
                  >
                    {tab.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </AnimatedPage>
  );
};

export default InventoryDashboard;
