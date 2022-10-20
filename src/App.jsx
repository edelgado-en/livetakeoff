
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
              <Routes key={location.pathname} location={location}>
                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Layout />}>
                      <Route index element={<Jobs />}/>
                      <Route path="jobs" element={<Jobs />}/>
                      <Route path="create-job" element={<CreateJob />} />
                      <Route path="completed" element={<CompleteList />} />

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
