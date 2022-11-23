
import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Jobs from './routes/home/Jobs/Jobs';
import JobDetails from './routes/job/JobDetails';
import JobInfo from './routes/job/JobInfo';
import JobComments from './routes/job/JobComments';
import JobPhotos from './routes/job/JobPhotos';
import JobPhotoListing from './routes/job/JobPhotoListing';
import JobPhotoUpload from './routes/job/JobPhotoUpload';
import UserProfile from './routes/userProfile/UserProfile';
import UserSettings from './routes/userProfile/UserSettings';
import UserPassword from './routes/userProfile/UserPassword';
import CreateJob from './routes/job/CreateJob';
import EditJob from './routes/job/EditJob';
import JobAssignments from './routes/job/JobAssignments';
import CompleteList from './routes/job/CompleteList';

import Customers from './routes/customers/Customers'
import CustomerDetails from './routes/customers/CustomerDetails';
import CustomerDiscounts from './routes/customers/CustomerDiscounts';
import CustomerDiscountList from './routes/customers/CustomerDiscountList';
import CustomerAddDiscount from './routes/customers/CustomerAddDiscount';
import CustomerEditDiscount from './routes/customers/CustomerEditDiscount';
import CustomerFees from './routes/customers/CustomerFees';
import CustomerFeeList from './routes/customers/CustomerFeeList';
import CustomerAddFee from './routes/customers/CustomerAddFee';
import CustomerEditFee from './routes/customers/CustomerEditFee';
import CustomerJobs from './routes/customers/CustomerJobs';
import CustomerProfile from './routes/customers/CustomerProfile';
import CreateCustomer from './routes/customers/CreateCustomer';
import EditCustomer from './routes/customers/EditCustomer';
import JobReview from './routes/job/JobReview';
import JobActivityFeed from './routes/job/JobActivityFeed';
import JobPriceBreakdown from './routes/job/JobPricebreakdown';
import ServicePrices from './routes/pricePlans/ServicePrices';
import PricePlans from './routes/pricePlans/PricePlans';
import CreatePricePlan from './routes/pricePlans/CreatePricePlan'

import NotFound from './routes/notfound/NotFound'
import Login from './routes/login/Login';
import Signup from './routes/signup/Signup';
import Layout from './layout/Layout';
import Footer from './components/footer/Footer';
import PrivacyPolicy from './routes/privacyPolicy/PrivacyPolicy';
import ChangeLog from './routes/changeLog/ChangeLog';

import CustomerHome from './routes/home/customer/CustomerHome';
import CustomerPremium from './routes/home/customer/CustomerPremium';

import CreateEstimate from './routes/estimates/CreateEstimate';
import Estimates from './routes/estimates/Estimates';
import EstimateDetail from './routes/estimates/EstimateDetail';

import SharedLayout from './routes/shared/SharedLayout';
import SharedJob from './routes/shared/SharedJob';
import ContactUs from './routes/shared/ContactUs';

import { isUserAuthenticated } from './localstorage';
import { selectUser } from "./routes/userProfile/userSlice";
import { useAppSelector } from "./app/hooks";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';

const Redirect = () => {
  useEffect(() => {
    window.location = '/login';
  }, []); 

  return <h5>Redirecting...</h5>
}

const ProtectedRoute = () => {
  if (!isUserAuthenticated()) {
    return <Redirect />
  }

  return <Outlet />
}

const Fallback = () => {
  return <div></div>
}


const  App = () => {
  const location = useLocation()
  const currentUser = useAppSelector(selectUser)

  return (
    <>
      <Suspense fallback={<Fallback />}>
        <ToastContainer autoClose={2000} />
         {/* You need to have a wrapper here with a content and a footer for the footer to be sticky */}
         <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <AnimatePresence mode='wait'>
              {/* This key location causes to re-renders the parent component. Making unnecessary api calls */}
              {/* <Routes key={location.pathname} location={location}> */}
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/shared" element={<SharedLayout />}>
                  <Route path="jobs/:jobId" element={<SharedJob />} />
                  <Route path="contact" element={<ContactUs />} />
                  <Route path="estimates/:id" element={<EstimateDetail />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Layout />}>
                      {currentUser.isCustomer && (
                        <>
                          <Route index element={<CustomerHome />} />
                          <Route path="premium" element={<CustomerPremium />} />
                        </>
                      )}

                      <Route path="home" element={<CustomerHome />} />
                      
                      {!currentUser.isCustomer && <Route index element={<Jobs />} />}

                      <Route path="create-estimate" element={<CreateEstimate />} />
                      <Route path="estimates" element={<Estimates />} /> 
                      <Route path="estimates/:id" element={<EstimateDetail />} />  

                      <Route path="jobs" element={<Jobs />}/>
                      <Route path="create-job" element={<CreateJob />} />
                      <Route path="completed" element={<CompleteList />} />
                      <Route path="completed/review/:jobId" element={<JobReview />}>
                        <Route path="photos" element={<JobPhotos />}>
                            <Route index element={<JobPhotoListing />} />
                            <Route path="listing" element={<JobPhotoListing />} />
                            <Route path="upload" element={<JobPhotoUpload />} />
                        </Route>
                        <Route path="edit" element={<EditJob />} />
                        <Route path="activity" element={<JobActivityFeed />} />
                        <Route path="comments" element={<JobComments />} />
                      </Route>

                      <Route path="create-customer" element={<CreateCustomer />} />
                      <Route path="edit-customer/:customerId" element={<EditCustomer />} />
                      
                      <Route path="customers" element={<Customers />}>
                          <Route path=":customerId/profile" element={<CustomerProfile />}>
                              <Route index element={<CustomerDetails />} />
                              <Route path="details" element={<CustomerDetails />} />
                              
                              <Route path="discounts" element={<CustomerDiscounts/>}>
                                  <Route index element={<CustomerDiscountList />} />
                                  <Route path="add" element={<CustomerAddDiscount />} />
                                  <Route path="edit/:discountId" element={<CustomerEditDiscount />} />
                              </Route>
                              
                              <Route path="fees" element={<CustomerFees />}>
                                  <Route index element={<CustomerFeeList />} />
                                  <Route path="add" element={<CustomerAddFee />} />
                                  <Route path="edit/:feeId" element={<CustomerEditFee />} />
                              </Route>

                              <Route path="jobs" element={<CustomerJobs />} />
                          </Route>
                      </Route>

                      <Route path="user-settings" element={<UserSettings />}>
                        <Route index element={<UserProfile />}/>
                        <Route path="profile" element={<UserProfile />}/>
                        <Route path="password" element={<UserPassword />} />
                      </Route>

                      <Route path="jobs/:jobId" element={<JobDetails />}>
                        <Route index element={<JobInfo />} />
                        <Route index path="details" element={<JobInfo />} />
                        <Route path="comments" element={<JobComments />} />
                        <Route path="assignments" element={<JobAssignments />} />
                        <Route path="edit" element={<EditJob />} />
                        <Route path="activity" element={<JobActivityFeed />} />
                        <Route path="price-breakdown" element={<JobPriceBreakdown />} />
                        <Route path="photos" element={<JobPhotos />}>
                            <Route index path="listing" element={<JobPhotoListing />} />
                            <Route path="upload" element={<JobPhotoUpload />} />
                        </Route>
                      </Route>

                      <Route path="privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="changelog" element={<ChangeLog />} />
                      <Route path="contact" element={<ContactUs />} />
                      <Route path="price-plans" element={<PricePlans />} />
                      <Route path="price-plans/add" element={<CreatePricePlan />} />
                      <Route path="price-plans/:pricePlanId" element={<ServicePrices />} />

                      <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </AnimatePresence>
          </div> 
          { location.pathname !== '/login' && location.pathname !== '/signup'  && <Footer /> }
        </div>
      </Suspense>
    </>
  );
}

export default App;
