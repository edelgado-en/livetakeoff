import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Jobs from "./routes/home/Jobs/Jobs";
import JobDetails from "./routes/job/JobDetails";
import JobInfo from "./routes/job/JobInfo";
import JobComments from "./routes/job/JobComments";
import JobPhotos from "./routes/job/JobPhotos";
import JobPhotoListing from "./routes/job/JobPhotoListing";
import JobPhotoUpload from "./routes/job/JobPhotoUpload";
import UserProfile from "./routes/userProfile/UserProfile";
import UserSettings from "./routes/userProfile/UserSettings";
import UserPassword from "./routes/userProfile/UserPassword";
import CreateJob from "./routes/job/CreateJob";
import EditJob from "./routes/job/EditJob";
import JobAssignments from "./routes/job/JobAssignments";
import CompleteList from "./routes/job/CompleteList";

import Airports from "./routes/airports/Airports";
import AirportDetails from "./routes/airports/AirportDetails";
import CreateAirport from "./routes/airports/CreateAirport";
import MyAirports from "./routes/airports/MyAirports";

import CustomerServiceReport from "./routes/home/dashboard/CustomerServiceReport";

import InventoryList from "./routes/inventory/InventoryList";
import CreateItem from "./routes/inventory/CreateItem";
import ItemDetails from "./routes/inventory/ItemDetails";
import InventoryDashboard from "./routes/inventory/InventoryDashboard";
import InventoryCurrentStats from "./routes/inventory/InventoryCurrentStats";
import InventoryHistoricalStats from "./routes/inventory/InventoryHistoricalStats";
import InventoryGrowth from "./routes/inventory/InventoryGrowth";
import LocationNotifications from "./routes/inventory/LocationNotifications";
import CreateLocation from "./routes/inventory/CreateLocation";

import Customers from "./routes/customers/Customers";
import CustomerDetails from "./routes/customers/CustomerDetails";
import CustomerServices from "./routes/customers/CustomerServices";
import CustomerDiscounts from "./routes/customers/CustomerDiscounts";
import CustomerDiscountList from "./routes/customers/CustomerDiscountList";
import CustomerAddDiscount from "./routes/customers/CustomerAddDiscount";
import CustomerEditDiscount from "./routes/customers/CustomerEditDiscount";
import CustomerFees from "./routes/customers/CustomerFees";
import CustomerFeeList from "./routes/customers/CustomerFeeList";
import CustomerAddFee from "./routes/customers/CustomerAddFee";
import CustomerEditFee from "./routes/customers/CustomerEditFee";
import CustomerJobs from "./routes/customers/CustomerJobs";
import CustomerProfile from "./routes/customers/CustomerProfile";
import CustomerFollowerEmails from "./routes/customers/CustomerFollowerEmails";
import CreateCustomer from "./routes/customers/CreateCustomer";
import EditCustomer from "./routes/customers/EditCustomer";
import JobReview from "./routes/job/JobReview";
import JobActivityFeed from "./routes/job/JobActivityFeed";
import JobPriceBreakdown from "./routes/job/JobPricebreakdown";
import ServicePrices from "./routes/pricePlans/ServicePrices";
import PricePlans from "./routes/pricePlans/PricePlans";
import CreatePricePlan from "./routes/pricePlans/CreatePricePlan";
import PricePlanDetails from "./routes/pricePlans/PricePlanDetails";

import Vendors from "./routes/vendors/Vendors";
import VendorProfile from "./routes/vendors/VendorProfile";
import VendorDetails from "./routes/vendors/VendorDetails";
import CreateVendor from "./routes/vendors/CreateVendor";
import EditVendor from "./routes/vendors/EditVendor";
import VendorFiles from "./routes/vendors/VendorFiles";

import JobTailDetails from "./routes/job/JobTailDetails";

import NotFound from "./routes/notfound/NotFound";
import Login from "./routes/login/Login";
import Signup from "./routes/signup/Signup";
import Layout from "./layout/Layout";
import Footer from "./components/footer/Footer";
import PrivacyPolicy from "./routes/privacyPolicy/PrivacyPolicy";
import ChangeLog from "./routes/changeLog/ChangeLog";
import TermsAndConditions from "./routes/termsAndConditions/TermsAndConditions";

import CustomerHome from "./routes/home/customer/CustomerHome";
import CustomerPremium from "./routes/home/customer/CustomerPremium";
import CustomerEditJob from "./routes/job/CustomerEditJob";

import Users from "./routes/users/Users";
import UserDetails from "./routes/users/UserDetails";

import TeamProductivity from "./routes/home/dashboard/TeamProductivity";
import UserProductivity from "./routes/home/dashboard/UserProductivity";
import TailNumberReport from "./routes/home/dashboard/TailNumberReport";
import ServicesByAirport from "./routes/home/dashboard/ServicesByAirport";
import RetainerCustomers from "./routes/home/dashboard/RetainerCustomers";

import CreateEstimate from "./routes/estimates/CreateEstimate";
import Estimates from "./routes/estimates/Estimates";
import EstimateDetail from "./routes/estimates/EstimateDetail";

import Fees from "./routes/fees/Fees";

import CreateJobSchedule from "./routes/job/CreateJobSchedule";
import JobSchedules from "./routes/job/JobSchedules";

import SharedLayout from "./routes/shared/SharedLayout";
import SharedJob from "./routes/shared/SharedJob";
import ShareJobEstimate from "./routes/shared/SharedJobEstimate";
import SharedJobConfirm from "./routes/shared/SharedJobConfirm";
import SharedJobAccept from "./routes/shared/SharedJobAccept";

import TailAlerts from "./routes/alerts/TailAlerts";

import ContactUs from "./routes/shared/ContactUs";

import HelpFileList from "./routes/help/HelpFileList";

import { isUserAuthenticated } from "./localstorage";
import { selectUser } from "./routes/userProfile/userSlice";
import { useAppSelector } from "./app/hooks";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

const Redirect = () => {
  useEffect(() => {
    window.location = "/login";
  }, []);

  return <h5>Redirecting...</h5>;
};

const ProtectedRoute = () => {
  if (!isUserAuthenticated()) {
    return <Redirect />;
  }

  return <Outlet />;
};

const Fallback = () => {
  return <div></div>;
};

const App = () => {
  const location = useLocation();
  const currentUser = useAppSelector(selectUser);

  return (
    <>
      <Suspense fallback={<Fallback />}>
        <ToastContainer autoClose={2000} />
        {/* You need to have a wrapper here with a content and a footer for the footer to be sticky */}
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {/* This key location causes to re-renders the parent component. Making unnecessary api calls */}
              {/* <Routes key={location.pathname} location={location}> */}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route
                  path="/terms-and-conditions"
                  element={<TermsAndConditions />}
                />

                <Route path="/shared" element={<SharedLayout />}>
                  <Route path="jobs/:encoded_id" element={<SharedJob />} />
                  <Route
                    path="jobs/:encoded_id/confirm"
                    element={<SharedJobConfirm />}
                  />
                  <Route
                    path="jobs/:encoded_id/accept"
                    element={<SharedJobAccept />}
                  />
                  <Route path="contact" element={<ContactUs />} />
                  <Route
                    path="estimates/:encoded_id"
                    element={<ShareJobEstimate />}
                  />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Layout />}>
                    {currentUser.isCustomer && (
                      <>
                        <Route index element={<CustomerHome />} />
                      </>
                    )}

                    <Route path="home" element={<CustomerHome />} />

                    {!currentUser.isCustomer && (
                      <Route index element={<Jobs />} />
                    )}

                    <Route path="premium" element={<CustomerPremium />} />
                    <Route
                      path="create-estimate"
                      element={<CreateEstimate />}
                    />
                    <Route path="estimates" element={<Estimates />} />
                    <Route path="estimates/:id" element={<EstimateDetail />} />

                    <Route path="fees" element={<Fees />} />

                    <Route path="jobs" element={<Jobs />} />

                    <Route
                      path="service-report"
                      element={<CustomerServiceReport />}
                    />

                    <Route
                      path="team-productivity"
                      element={<TeamProductivity />}
                    />
                    <Route
                      path="user-productivity/:id"
                      element={<UserProductivity />}
                    />
                    <Route path="tail-report" element={<TailNumberReport />} />
                    <Route
                      path="services-by-airport"
                      element={<ServicesByAirport />}
                    />
                    <Route path="retainers" element={<RetainerCustomers />} />

                    <Route path="create-job" element={<CreateJob />} />

                    <Route
                      path="create-schedule"
                      element={<CreateJobSchedule />}
                    />

                    <Route path="jobs/schedules" element={<JobSchedules />} />

                    <Route
                      path="create-job/:estimateId"
                      element={<CreateJob />}
                    />

                    <Route path="completed" element={<CompleteList />} />
                    <Route
                      path="completed/review/:jobId"
                      element={<JobReview />}
                    >
                      <Route path="photos" element={<JobPhotos />}>
                        <Route index element={<JobPhotoListing />} />
                        <Route path="listing" element={<JobPhotoListing />} />
                        <Route path="upload" element={<JobPhotoUpload />} />
                      </Route>
                      <Route path="edit" element={<EditJob />} />
                      <Route
                        path="customer-edit"
                        element={<CustomerEditJob />}
                      />
                      <Route path="activity" element={<JobActivityFeed />} />
                      <Route path="comments" element={<JobComments />} />
                      <Route path="services" element={<JobAssignments />} />
                    </Route>

                    <Route path="report/review/:jobId" element={<JobReview />}>
                      <Route path="photos" element={<JobPhotos />}>
                        <Route index element={<JobPhotoListing />} />
                        <Route path="listing" element={<JobPhotoListing />} />
                        <Route path="upload" element={<JobPhotoUpload />} />
                      </Route>
                      <Route path="edit" element={<EditJob />} />
                      <Route path="activity" element={<JobActivityFeed />} />
                      <Route path="comments" element={<JobComments />} />
                      <Route path="services" element={<JobAssignments />} />
                    </Route>

                    <Route
                      path="create-job/review/:jobId"
                      element={<JobReview />}
                    >
                      <Route path="photos" element={<JobPhotos />}>
                        <Route index element={<JobPhotoListing />} />
                        <Route path="listing" element={<JobPhotoListing />} />
                        <Route path="upload" element={<JobPhotoUpload />} />
                      </Route>
                      <Route path="edit" element={<EditJob />} />
                      <Route path="activity" element={<JobActivityFeed />} />
                      <Route path="comments" element={<JobComments />} />
                      <Route path="services" element={<JobAssignments />} />
                    </Route>

                    <Route path="users" element={<Users />}>
                      <Route path=":userId" element={<UserDetails />} />
                      <Route
                        path=":id/productivity"
                        element={<UserProductivity />}
                      />
                    </Route>

                    <Route path="airports" element={<Airports />}>
                      <Route path=":airportId" element={<AirportDetails />} />
                    </Route>

                    <Route path="my-airports" element={<MyAirports />} />

                    <Route path="create-airport" element={<CreateAirport />} />

                    <Route
                      path="create-customer"
                      element={<CreateCustomer />}
                    />
                    <Route
                      path="edit-customer/:customerId"
                      element={<EditCustomer />}
                    />

                    <Route path="create-vendor" element={<CreateVendor />} />
                    <Route
                      path="edit-vendor/:vendorId"
                      element={<EditVendor />}
                    />

                    <Route path="customers" element={<Customers />}>
                      <Route
                        path=":customerId/profile"
                        element={<CustomerProfile />}
                      >
                        <Route index element={<CustomerDetails />} />
                        <Route path="details" element={<CustomerDetails />} />

                        <Route path="services" element={<CustomerServices />} />

                        <Route
                          path="emails"
                          element={<CustomerFollowerEmails />}
                        />

                        <Route path="discounts" element={<CustomerDiscounts />}>
                          <Route index element={<CustomerDiscountList />} />
                          <Route path="add" element={<CustomerAddDiscount />} />
                          <Route
                            path="edit/:discountId"
                            element={<CustomerEditDiscount />}
                          />
                        </Route>

                        <Route path="fees" element={<CustomerFees />}>
                          <Route index element={<CustomerFeeList />} />
                          <Route path="add" element={<CustomerAddFee />} />
                          <Route
                            path="edit/:feeId"
                            element={<CustomerEditFee />}
                          />
                        </Route>

                        <Route path="jobs" element={<CustomerJobs />} />
                      </Route>
                    </Route>

                    <Route path="vendors" element={<Vendors />}>
                      <Route
                        path=":vendorId/profile"
                        element={<VendorProfile />}
                      >
                        <Route index element={<VendorDetails />} />
                        <Route path="details" element={<VendorDetails />} />
                        <Route path="files" element={<VendorFiles />} />
                      </Route>
                    </Route>

                    <Route path="user-settings" element={<UserSettings />}>
                      <Route index element={<UserProfile />} />
                      <Route path="profile" element={<UserProfile />} />
                      <Route path="password" element={<UserPassword />} />
                    </Route>

                    <Route path="jobs/:jobId" element={<JobDetails />}>
                      <Route index element={<JobInfo />} />
                      <Route index path="details" element={<JobInfo />} />
                      <Route path="comments" element={<JobComments />} />
                      <Route path="assignments" element={<JobAssignments />} />
                      <Route path="edit" element={<EditJob />} />
                      <Route
                        path="customer-edit"
                        element={<CustomerEditJob />}
                      />
                      <Route path="activity" element={<JobActivityFeed />} />
                      <Route
                        path="price-breakdown"
                        element={<JobPriceBreakdown />}
                      />
                      <Route path="tail-details" element={<JobTailDetails />} />
                      <Route path="photos" element={<JobPhotos />}>
                        <Route
                          index
                          path="listing"
                          element={<JobPhotoListing />}
                        />
                        <Route path="upload" element={<JobPhotoUpload />} />
                      </Route>
                    </Route>

                    <Route path="changelog" element={<ChangeLog />} />
                    <Route path="contact" element={<ContactUs />} />
                    <Route path="help" element={<HelpFileList />} />
                    <Route path="price-plans" element={<PricePlans />} />
                    <Route
                      path="price-plans/:pricePlanId/details"
                      element={<PricePlanDetails />}
                    />
                    <Route
                      path="price-plans/add"
                      element={<CreatePricePlan />}
                    />
                    <Route
                      path="price-plans/:pricePlanId"
                      element={<ServicePrices />}
                    />

                    <Route path="tail-alerts" element={<TailAlerts />} />

                    <Route path="inventory" element={<InventoryList />} />
                    <Route
                      path="create-inventory-item"
                      element={<CreateItem />}
                    />

                    <Route
                      path="inventory/:itemId/details"
                      element={<ItemDetails />}
                    />

                    <Route
                      path="location-notifications"
                      element={<LocationNotifications />}
                    />

                    <Route
                      path="create-location"
                      element={<CreateLocation />}
                    />

                    <Route
                      path="inventory/stats"
                      element={<InventoryDashboard />}
                    >
                      <Route index element={<InventoryCurrentStats />} />
                      <Route
                        path="current"
                        element={<InventoryCurrentStats />}
                      />
                      <Route
                        path="historical"
                        element={<InventoryHistoricalStats />}
                      />
                      <Route path="growth" element={<InventoryGrowth />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </AnimatePresence>
          </div>
          {location.pathname !== "/login" &&
            location.pathname !== "/signup" && <Footer />}
        </div>
      </Suspense>
    </>
  );
};

export default App;
