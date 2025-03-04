import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from "./apiService";

const JobPriceBreakdown = () => {
  const [loading, setLoading] = useState(true);
  const [breakdown, setBreakdown] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);

  const { jobId } = useParams();

  useEffect(() => {
    getPriceBreakdown();
  }, []);

  const getPriceBreakdown = async () => {
    try {
      const { data } = await api.getJobPriceBreakdown(jobId);

      setBreakdown(data);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 403) {
        setErrorMessage("You do not have permission to view price breakdown.");
      } else {
        setErrorMessage("Unable to load price breakdown.");
      }
    }
  };

  return (
    <AnimatedPage>
      {loading && <Loader />}

      {!loading && errorMessage && (
        <div className="text-gray-500 m-auto text-center mt-20">
          {errorMessage}
        </div>
      )}

      {!loading && errorMessage == null && (
        <div className="mt-6 max-w-5xl px-2 pb-10">
          <div className="flex flex-row">
            <div className="flex-1">
              <h1 className="text-2xl xl:text-3xl font-bold text-gray-700">
                Price Breakdown
              </h1>
            </div>
          </div>
          {breakdown.manuallySet ? (
            <div className="mt-4 text-gray-500 text-md">
              Price was manually set
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex justify-between text-md">
                <div className="text-2xl text-gray-700">
                  {breakdown.aircraftType}
                </div>
                <div>
                  <span
                    className="relative bg-teal-100 text-teal-500 rounded-md p-1 font-medium"
                    style={{ top: "2px" }}
                  >
                    {breakdown.priceListType}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-2xl text-gray-700 font-medium">Services</h3>
                <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                  {breakdown.services?.map((service) => (
                    <div
                      key={service.id}
                      className="flex justify-between py-2 text-lg hover:bg-gray-50"
                    >
                      <dt className="text-gray-500 pr-2 truncate">
                        {service.name}
                      </dt>
                      <dd className="whitespace-nowrap text-gray-900">
                        {service.price > 0 ? "$" + service.price : "TBD"}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="flex justify-end py-2 text-lg mt-1">
                  <dt className="text-gray-500 pr-2 text-right font-medium">
                    Subtotal
                  </dt>
                  <dd className="whitespace-nowrap text-gray-900">
                    ${breakdown.servicesPrice}
                  </dd>
                </div>
              </div>

              {breakdown.discounts?.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-2xl text-gray-700 font-medium">
                    Discounts Applied
                  </h3>
                  <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                    {breakdown.discounts.map((discount) => (
                      <div
                        key={discount.id}
                        className="flex justify-between py-2 text-lg hover:bg-gray-50"
                      >
                        <dt className="text-gray-500 pr-2 truncate">
                          {discount.name === "S" ? "By Service" : ""}
                          {discount.name === "A" ? "By Airport" : ""}
                          {discount.name === "G" ? "General" : ""}
                        </dt>
                        <dd className="whitespace-nowrap text-gray-900">
                          {!discount.isPercentage ? "$" : ""}
                          {discount.discount}
                          {discount.isPercentage ? "%" : ""}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <div className="flex justify-end py-2 text-lg mt-1">
                    <dt className="text-gray-500 pr-2 text-right font-medium">
                      Subtotal
                    </dt>
                    <dd className="whitespace-nowrap text-gray-900">
                      ${breakdown.discountedPrice}
                    </dd>
                  </div>
                </div>
              )}

              {breakdown.additionalFees?.length > 0 && (
                <div className="mt-2">
                  <h3 className="text-lg text-gray-700">
                    Additional Fees Applied
                  </h3>
                  <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                    {breakdown.additionalFees.map((fee) => (
                      <div
                        key={fee.id}
                        className="flex justify-between py-2 text-lg hover:bg-gray-50"
                      >
                        <dt className="text-gray-500 pr-2 truncate">
                          {fee.name === "A" ? "Travel Fees" : ""}
                          {fee.name === "F" ? "FBO Fee" : ""}
                          {fee.name === "G" ? "General" : ""}
                          {fee.name === "V" ? "Vendor Higher Price" : ""}
                          {fee.name === "M" ? "Management Fees" : ""}
                        </dt>
                        <dd className="whitespace-nowrap text-gray-900">
                          {fee.isPercentage && (
                            <>
                              {fee.fee}
                              {"%"}
                              <span className="text-gray-500">
                                {" ("}${fee.additional_fee_dollar_amount}
                                {")"}
                              </span>
                            </>
                          )}

                          {!fee.isPercentage && fee.name !== "M" && (
                            <>
                              {"$"}
                              {fee.fee}
                            </>
                          )}

                          {!fee.isPercentage && fee.name === "M" && (
                            <>
                              {"$"}
                              {fee.additional_fee_dollar_amount}
                            </>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              <div className="flex justify-end py-4 text-lg">
                <dt className="text-gray-500 pr-2 text-right font-medium">
                  Total
                </dt>
                <dd className="whitespace-nowrap text-gray-900">
                  ${breakdown.totalPrice}
                </dd>
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatedPage>
  );
};

export default JobPriceBreakdown;
