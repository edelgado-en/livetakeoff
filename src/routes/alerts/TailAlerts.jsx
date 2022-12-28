import { useState, useEffect, Fragment } from "react";
import {
  Listbox,
  Transition,
  Menu,
  Popover,
  Disclosure,
  Dialog,
} from "@headlessui/react";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../../components/loader/Loader";

const MagnifyingGlassIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
};

const TailAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const alerts = [
      {
        id: 1,
        title: "Alert 1",
        description: "Alert 1 description",
        created: "2021-08-10T12:00:00Z",
      },
    ];
    setAlerts(alerts);
  }, []);

  return <AnimatedPage></AnimatedPage>;
};

export default TailAlerts;
