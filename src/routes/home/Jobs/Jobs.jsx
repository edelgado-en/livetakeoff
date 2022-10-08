/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { TrashIcon, CloudDownloadIcon, ChevronRightIcon } from "@heroicons/react/outline";
import Pagination from "react-js-pagination";
import Select from 'react-select';
import { STANDARD_DROPDOWN_STYLES, PAGE_SIZE_OPTIONS } from '../../../constants';

import Loader from "../../../components/loader/Loader";

import * as api from './apiService'

const REPORT_STATUS_OPTIONS = [
    { value: 'All', label: 'All'},
    { value: 'P', label: 'Passed' },
    { value: 'F', label: 'Failed' },
    { value: 'B', label: 'Blocked' },
    { value: 'T', label: 'TBD' }
]


const TestReports = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(REPORT_STATUS_OPTIONS[0]);
  const [selectedPageSize, setSelectedPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetchReports()
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      fetchReports()
    }

  }, [selectedStatus, currentPage, selectedPageSize])

  const fetchReports = async () => {
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

  const handleStatusChange = (selectedStatus) => {
      setSelectedStatus(selectedStatus)
  }

  const handlePageSizeChange = (pageSize) => {
      setCurrentPage(1)
      setSelectedPageSize(pageSize)
  }

  const handlePageChange = (page) => {
      setCurrentPage(page)
  }

    const handleKeyDown = event => {
      console.log(event.key);
  
      if (event.key === 'Enter') {
        event.preventDefault();
        
        fetchReports();
      }
    };

    return (
      <div className="xl:px-16 px-4 m-auto max-w-7xl">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-600">Jobs Queue</h1>
            {!loading && (
              <p className="mt-2 text-sm text-gray-700">
                Total: {jobs.length}
              </p>
            )}
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {/* <button
              type="button"
              className="inline-flex mr-4 items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Job
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
            >
              Assign Job
            </button> */}
          </div>
        </div>

        {loading && <Loader />}  

        {!loading && jobs.length === 0 && (
            <div className="text-sm text-gray-500 mt-20 m-auto w-11/12 text-center">
              No jobs found.
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