
import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import Jobs from './routes/home/Jobs/Jobs';
import JobDetails from './routes/job/JobDetails';
import JobInfo from './routes/job/JobInfo';
import JobComments from './routes/job/JobComments';
import JobPhotos from './routes/job/JobPhotos';

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
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <ToastContainer autoClose={2000} />
         {/* You need to have a wrapper here with a content and a footer for the footer to be sticky */}
         <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>

              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Jobs />}/>
                    <Route path="jobs" element={<Jobs />}/>
                    <Route path="jobs/:jobId" element={<JobDetails />}>
                      <Route index element={<JobInfo />} />
                      <Route index path="details" element={<JobInfo />} />
                      <Route index path="comments" element={<JobComments />} />
                      <Route index path="photos" element={<JobPhotos />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Route>
              </Route>
            </Routes>
          </div> 
        </div>
      </Suspense>
    </>
  );
}

export default App;
