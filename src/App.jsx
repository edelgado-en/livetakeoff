
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
import JobReview from './routes/job/JobReview';

import NotFound from './routes/notfound/NotFound'
import Login from './routes/login/Login';
import Layout from './layout/Layout';


import { isUserAuthenticated } from './localstorage';

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

const getPathKey = (path, level = 1) => {
  // path: "/topics/react/router"
  // level: 1 -> topics
  // level: 2 -> topics/react
  // level: 3 -> topics/react/router
  return path.split('/').splice(1, level).join('/');
}

const  App = () => {
  const location = useLocation()

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

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Layout />}>
                      <Route index element={<Jobs />}/>
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
                      </Route>

                      <Route path="create-customer" element={<CreateCustomer />} />
                      
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
                        <Route path="photos" element={<JobPhotos />}>
                            <Route index path="listing" element={<JobPhotoListing />} />
                            <Route path="upload" element={<JobPhotoUpload />} />
                        </Route>
                      </Route>

                      <Route path="*" element={<NotFound />} />
                  </Route>
                </Route>
              </Routes>
            </AnimatePresence>
          </div> 
        </div>
      </Suspense>
    </>
  );
}

export default App;
