import { useState, useEffect, Fragment, useRef } from "react";
import Loader from "../../components/loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Listbox, Transition, Switch, RadioGroup } from "@headlessui/react";
import {
  PlusIcon,
  CheckIcon,
  CheckCircleIcon,
  MinusIcon,
} from "@heroicons/react/outline";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";
import { toast } from "react-toastify";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const priceListTypes = [
  {
    id: "C",
    title: "CUSTOMER",
    description: "Price list meant to be associated to customers.",
    selected: true,
  },
  {
    id: "V",
    title: "VENDOR",
    description: "Price list meant to be associated to vendors.",
    selected: false,
  },
];

const ChevronUpDownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5 text-gray-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  );
};

const operators = [
  { id: "subtract", icon: MinusIcon },
  { id: "add", icon: PlusIcon },
];

const CreatePricePlan = () => {
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricingPlanSelected, setPricingPlanSelected] = useState();
  const [pricingPlans, setPricingPlans] = useState([]);
  const [percentageAdjusted, setPercentageAdjusted] = useState(0);
  const [operatorSelected, setOperatorSelected] = useState(operators[0]);

  const [selectedPriceListType, setSelectedPriceListType] = useState(
    priceListTypes[0]
  );

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedPriceListType(priceListTypes[0]);
  }, []);

  useEffect(() => {
    getPricingPlans();
  }, []);

  const getPricingPlans = async () => {
    try {
      const { data } = await api.getPricingPlans();
      setLoading(false);
      setPricingPlans(data.results);
      setPricingPlanSelected(data.results[0]);
    } catch (error) {
      setLoading(false);
    }
  };

  const createPricePlan = async () => {
    setCreateLoading(true);

    const request = {
      name,
      description,
      price_list_id: pricingPlanSelected?.id,
      operator: operatorSelected.id,
      percentage: percentageAdjusted,
      price_list_type: selectedPriceListType.id,
    };

    try {
      await api.createPricingPlan(request);

      setCreateLoading(false);

      //you should navigate to prices list
      navigate(-1);
    } catch (error) {
      toast.error(error.message);
      setCreateLoading(false);
    }
  };

  const handleSetPercentage = (e) => {
    const value = e.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

    setPercentageAdjusted(value);
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && (
        <main className="mx-auto max-w-2xl px-4 pb-16 lg:pb-12">
          <div>
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-600">
                  Create Price List
                </h1>
                <p className="mt-1 text-md text-gray-500">
                  Let’s get started by filling in the information below to
                  create a new price list.
                </p>
              </div>
            </div>
          </div>

          {createLoading && (
            <div>
              <Loader />
              <div className="text-gray-500 text-sm m-auto text-center">
                <p>Creating new price list.</p>
                <p>
                  Copying all the prices from{" "}
                  <span className="text-gray-500 font-semibold">
                    {pricingPlanSelected?.name}
                  </span>{" "}
                  price list...
                </p>
              </div>
            </div>
          )}

          {!createLoading && (
            <div>
              <div className="mt-8">
                <label
                  htmlFor="tailNumber"
                  className="text-md font-bold text-gray-600 uppercase tracking-wide"
                >
                  Name
                  <span className="text-sm ml-1 text-gray-500 font-normal">
                    (must be unique)
                  </span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="tailNumber"
                    id="tailNumber"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="comment"
                  className="text-md font-bold text-gray-500 uppercase tracking-wide"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="comment"
                    id="comment"
                    className="block w-full rounded-md border-gray-300 shadow-sm
                                                    focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                  />
                  <p className="mt-2 text-md text-gray-500">
                    Write a couple of sentences describing the purpose of this
                    price list.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <RadioGroup
                  value={selectedPriceListType}
                  onChange={setSelectedPriceListType}
                >
                  <RadioGroup.Label className="text-md font-bold text-gray-600 uppercase tracking-wide">
                    Price List Type
                  </RadioGroup.Label>

                  <div className="mt-1 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    {priceListTypes.map((priceListType) => (
                      <RadioGroup.Option
                        key={priceListType.id}
                        value={priceListType}
                        className={({ active }) =>
                          classNames(
                            active
                              ? "border-red-500 ring-2 ring-red-500"
                              : "border-gray-300",
                            "relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                          )
                        }
                      >
                        {({ checked, active }) => (
                          <>
                            <span className="flex flex-1">
                              <span className="flex flex-col">
                                <RadioGroup.Label
                                  as="span"
                                  className="block text-md font-medium text-gray-900"
                                >
                                  {priceListType.title}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className="mt-1 flex items-center text-md text-gray-500"
                                >
                                  {priceListType.description}
                                </RadioGroup.Description>
                              </span>
                            </span>
                            <CheckCircleIcon
                              className={classNames(
                                !checked ? "invisible" : "",
                                "h-6 w-6 text-red-600"
                              )}
                              aria-hidden="true"
                            />
                            <span
                              className={classNames(
                                active ? "border" : "border-2",
                                checked
                                  ? "border-red-600"
                                  : "border-transparent",
                                "pointer-events-none absolute -inset-px rounded-lg"
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <div className="mt-12">
                <div className="text-md font-bold text-gray-600 uppercase tracking-wide">
                  Based Off Another Price List
                </div>
                <p className="mt-2 text-md text-gray-500">
                  All new price lists are based off an existing price list. You
                  can optionality add or subtract a percentage from that list
                  that will affect the price of all services for the new list.
                </p>
              </div>
              <div className="mt-6">
                <Listbox
                  value={pricingPlanSelected}
                  onChange={setPricingPlanSelected}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="text-md font-bold text-gray-600 uppercase tracking-wide">
                        Pricing List
                      </Listbox.Label>
                      <div className="relative mt-1">
                        <Listbox.Button
                          className="relative w-full cursor-default rounded-md border
                                                                        border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                        shadow-sm focus:border-sky-500 focus:outline-none
                                                                        focus:ring-1 focus:ring-sky-500 sm:text-sm "
                        >
                          <span className="block truncate">
                            {pricingPlanSelected?.name}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                            rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                          >
                            {pricingPlans.map((pricingPlan) => (
                              <Listbox.Option
                                key={pricingPlan.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-red-600"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={pricingPlan}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span
                                      className={classNames(
                                        selected
                                          ? "font-semibold"
                                          : "font-normal",
                                        "block truncate"
                                      )}
                                    >
                                      {pricingPlan.name}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-red-600",
                                          "absolute inset-y-0 right-0 flex items-center pr-4"
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
              <div className="flex mt-4">
                <div>
                  <Listbox
                    value={operatorSelected}
                    onChange={setOperatorSelected}
                  >
                    {({ open }) => (
                      <>
                        <div className="relative">
                          <Listbox.Button
                            className="relative w-full cursor-default rounded-l-md border
                                                                            border-gray-300 bg-white py-2 pl-3 pr-8 text-left
                                                                            shadow-sm focus:border-sky-500 focus:outline-none
                                                                            focus:ring-1 focus:ring-sky-500 sm:text-sm"
                          >
                            <span className="block truncate">
                              <operatorSelected.icon className="h-4 w-4" />
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                              <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                          >
                            <Listbox.Options
                              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto
                                                                                rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                                ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                            >
                              {operators.map((operator) => (
                                <Listbox.Option
                                  key={operator.id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "text-white bg-red-600"
                                        : "text-gray-900",
                                      "relative cursor-default select-none py-2 pl-3 pr-9"
                                    )
                                  }
                                  value={operator}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          selected
                                            ? "font-semibold"
                                            : "font-normal",
                                          "block truncate"
                                        )}
                                      >
                                        <operator.icon className="h-4 w-4" />
                                      </span>
                                      {selected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? "text-white"
                                              : "text-red-600",
                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={percentageAdjusted}
                    onChange={(e) => handleSetPercentage(e.target.value)}
                    name="amount"
                    style={{ borderLeft: "0px" }}
                    className="block w-12 rounded-r-md border-gray-300 shadow-sm
                                            focus:border-sky-500 focus:ring-sky-500 text-xs"
                  />
                </div>
                <div className="relative top-2 ml-2">%</div>
              </div>
              <div className="flex flex-col py-4 pb-20 gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => createPricePlan()}
                  className="inline-flex justify-center rounded-md
                                                border border-transparent bg-red-600 py-2 px-4
                                                text-md font-medium text-white shadow-sm hover:bg-red-600
                                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Create Price List
                </button>
                <button
                  onClick={() => navigate(-1)}
                  type="button"
                  className="rounded-md border border-gray-300 bg-white w-full
                                                py-2 px-4 text-md font-medium text-gray-700 shadow-sm
                                                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="h-28"></div>
        </main>
      )}
    </AnimatedPage>
  );
};

export default CreatePricePlan;
