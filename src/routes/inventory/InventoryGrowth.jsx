import { useEffect, useState, Fragment } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { Listbox, Transition } from "@headlessui/react";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import * as api from "./apiService";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import Loader from "../../components/loader/Loader";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const InventoryGrowth = () => {
  const [loading, setLoading] = useState(true);

  return (
    <AnimatedPage>
      <div>Work in progress...</div>
    </AnimatedPage>
  );
};

export default InventoryGrowth;
