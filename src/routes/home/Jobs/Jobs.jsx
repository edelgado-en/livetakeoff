/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { TrashIcon, ChevronRightIcon, PlusIcon } from "@heroicons/react/outline";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectUser } from "../../userProfile/userSlice";
import Loader from "../../../components/loader/Loader";
import * as api from './apiService'

const TestReports = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const currentUser = useAppSelector(selectUser)

  useEffect(() => {
    fetchJobs()
  }, [])


  const fetchJobs = async () => {
    setLoading(true)
    
    try {
        const { data } = await api.getJobs();

        setJobs(data.results);
        setTotalJobs(data.count)

    } catch (e) {
      setJobs([])
    }

    setLoading(false)
  }

    return (
      <div className="xl:px-16 px-4 m-auto max-w-7xl">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-600">Jobs Queue</h1>
            {!loading && jobs.length > 0 && (
              <p className="mt-2 text-sm text-gray-700">
                Total: {jobs.length}
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) && jobs.length > 0 && (
                <Link to="/create-job">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center 
                              rounded-md border border-transparent bg-red-600 px-4 py-2
                              text-sm font-medium text-white shadow-sm hover:bg-red-700
                              focus:outline-none focus:ring-2 focus:ring-red-500
                              focus:ring-offset-2 sm:w-auto"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                    New Job
                  </button>
                </Link>
            )}
          </div>
        </div>

        {loading && <Loader />}  

        {!loading && jobs.length === 0 && (
            (currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) ?
              <div className="text-center mt-14 ">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new job.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center rounded-md border border-transparent
                             bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                              hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Job
                  </button>
                </div>
              </div>
              :
              <div className="text-sm text-gray-500 mt-20 m-auto w-11/12 text-center">
                No jobs assigned to you.
              </div>
        )}

        <div className="overflow-hidden bg-white shadow sm:rounded-md mt-8">
          <ul role="list" className="divide-y divide-gray-200">
            {jobs.map((job) => (
              <li key={job.id}>
                <Link to={`/jobs/${job.id}/details`} className="block hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="w-full grid xl:grid-cols-2 lg:grid-cols-2 md-grid-cols-2 xs:grid-cols-1">
                        <div>
                          <div className="">
                            <span className="font-medium text-red-600 text-sm">{job.tailNumber}</span>
                            <span className="ml-2 text-sm text-gray-500">{job.purchase_order}</span>
                          </div>
                          <div className="mt-2 text-xs text-gray-500 mb-1">
                            {job.airport.initials} - {job.fbo.name} - {job.aircraftType.name}
                          </div>
                        </div>
                        <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left">
                            <p className="inline-flex text-xs font-semibold leading-5">
                              {job.status === 'A' && 'Accepted'}
                              {job.status === 'S' && 'Assigned'}
                              {job.status === 'U' && 'Submitted'}
                              {job.status === 'W' && 'Work In Progress'}
                              {job.status === 'C' && 'Completed'}
                              {job.status === 'T' && 'Cancelled'}
                              {job.status === 'R' && 'Review'}
                              {job.status === 'I' && 'Invoiced'}
                            </p>
                            <div className="text-xs text-gray-500 mt-2">
                              Complete by {job.completeBy}
                            </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

    </div>
    )
  }

  export default TestReports;