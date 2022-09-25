/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom"
import { useEffect, useState } from "react";
import { TrashIcon, CloudDownloadIcon } from "@heroicons/react/outline";
import Pagination from "react-js-pagination";
import Select from 'react-select';
import { STANDARD_DROPDOWN_STYLES, PAGE_SIZE_OPTIONS } from '../../../constants';

import * as api from './apiService'

const REPORT_STATUS_OPTIONS = [
    { value: 'All', label: 'All'},
    { value: 'P', label: 'Passed' },
    { value: 'F', label: 'Failed' },
    { value: 'B', label: 'Blocked' },
    { value: 'T', label: 'TBD' }
]
  
const TestReports = () => {
  const [testReports, setTestReports] = useState([]);
  const [totalTestReports, setTotalTestReports] = useState(0);
  const [description, setDescription] = useState('');
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

    try {
       const { data } = await api.testApi();

      console.log(data);
      setTestReports(data.results);
      setTotalTestReports(data.count)

    } catch (e) {
      setTestReports([])
    }
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
      <div className="pr-4">
        <div className="sm:flex sm:items-center mt-6">
          <div className="sm:flex-auto">
            <div className="mt-2 text-sm text-gray-500" style={{ position: 'relative', top: '14px' }}>
                Total Jobs: {totalTestReports}
            </div>
          </div>
          <div className="mt-2 sm:mt-0 sm:ml-16 flex">
            <div className="mr-9 w-96">
                <div className="relative w-full mt-5">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </div>
                    <input type="text" id="simple-search"
                           value={description}
                           onChange={event => setDescription(event.target.value)}
                           onKeyDown={handleKeyDown}
                             className="border border-gray-200 text-gray-500 text-xs
                                     rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full
                                      pl-10 p-2  dark:bg-gray-700 dark:border-gray-600
                                    dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
                                     dark:focus:border-blue-500" placeholder="Search by description" />
                </div>
            </div>
            <div className="w-28 mr-9">
                    <div className="text-gray-600 text-xs mb-1">Status:</div>
                    <Select 
                        maxMenuHeight={160}
                        styles={STANDARD_DROPDOWN_STYLES}
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        options={REPORT_STATUS_OPTIONS}
                    />
            </div>
            <div className="w-28 mr-16">
                    <div className="text-gray-600 text-xs mb-1">Created by:</div>
                    <Select 
                        maxMenuHeight={160}
                        styles={STANDARD_DROPDOWN_STYLES}
                        value={REPORT_STATUS_OPTIONS[0]}
                        onChange={handlePageSizeChange}
                        options={REPORT_STATUS_OPTIONS}
                    />
            </div>
            <div>
                <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border
                            border-transparent bg-red-600 px-4 py-2 text-xs font-medium
                            text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                            focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                style={{ marginTop: '19px' }}
                >
                    Add Job
                </button>                
            </div>

          </div>
        </div>

        { totalTestReports === 0 && (
          <div className="text-center text-gray-500 text-sm mt-40">
            No results found.
          </div>
        )}


        { totalTestReports > 0 && (
          <div className="mt-6 flex flex-col">
            <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
                <div className="px-4">
                  <table className="table-auto w-full">
                    <thead style={{ backgroundColor: '#fafafa' }}>
                      <tr>
                        <th
                          scope="col"
                          className="border-b border-gray-300 
                                    py-2 px-2 text-left text-xs font-normal"
                        >
                          ID
                        </th>
                        
                        <th
                          scope="col"
                          className="border-b border-gray-300  
                          py-3 px-4 text-center text-xs font-normal"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="border-b border-gray-300 
                                      py-3 px-4 text-center text-xs lg:table-cell font-normal"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="border-b border-gray-300  
                          py-3 px-4 text-center text-xs sm:table-cell font-normal"
                        >
                          Test Runs
                        </th>
                        <th
                          scope="col"
                          className="border-b border-gray-300  
                          py-3 px-4 text-center text-xs sm:table-cell font-normal"
                        >
                          Test Cases
                        </th>
                        <th
                          scope="col"
                          className="border-b border-gray-300  
                          py-3 px-4 text-center text-xs sm:table-cell font-normal"
                        >
                          Created By
                        </th>
                        <th
                          scope="col"
                          className="border-b border-gray-300  
                          py-3 px-4 text-center text-xs sm:table-cell font-normal"
                        >
                          Created
                        </th>
                        <th
                          scope="col"
                          className="border-b border-gray-300  
                          py-3 px-4 text-center text-xs sm:table-cell font-normal"
                        >
                          
                        </th>
                        
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {testReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-100">
                              <td
                              className="cursor-pointer text-center border-b border-gray-200
                                  whitespace-nowrap py-1.5 px-2 text-xs text-blue-500">
                                  <Link to={`/test-reports/${report.id}`}>
                                  {report.id}
                                  </Link>
                              </td>
                          <td
                              className={`hover:underline cursor-pointer border-b
                              border-gray-200 py-1.5 px-4 text-xs text-gray-500`}>
                              <Link to={`/test-reports/${report.id}`}>
                                  {report.description}
                              </Link>
                          </td>
                          <td
                            className={`text-center border-b border-gray-200 py-1.5 px-4 text-xs text-gray-500 `}>
                              <span className={`inline-flex rounded-full text-xs px-2 leading-5
                                              ${
                                                  report.result === 'P'
                                                    ? "bg-green-100 text-green-800"
                                                    : report.result === 'F' ? "bg-red-100 text-red-800"
                                                    : report.result === 'B' ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-gray-100 text-gray-800"
                                                }
                                              `}>
                                  {report.result === 'P' ? 'Passed'
                                  : report.result === 'F' ? 'Failed'
                                  : report.result === 'B' ? 'Blocked'
                                  : 'TBD'}
                              </span>
                          </td>
                          <td
                            className='text-center border-b border-gray-200 whitespace-nowrap
                                      py-1.5 px-4 text-xs text-gray-500 hidden sm:table-cell'>
                            22
                          </td>
                          <td
                            className='text-center border-b border-gray-200 whitespace-nowrap
                                      py-1.5 px-4 text-xs text-gray-500 hidden sm:table-cell'>
                            867
                          </td>
                          <td
                            className='text-center border-b border-gray-200 whitespace-nowrap
                                      py-1.5 px-4 text-xs text-gray-500 hidden sm:table-cell'>
                            edelga34
                          </td>
                          <td
                            className='text-center border-b border-gray-200 whitespace-nowrap
                                      py-1.5 px-4 text-xs text-gray-500 hidden sm:table-cell'>
                            Sept 14 9:07 AM
                          </td>
                          <td
                            className='text-center border-b border-gray-200 whitespace-nowrap py-1.5 px-4 text-xs text-gray-500 hidden sm:table-cell font-medium'>
                              <CloudDownloadIcon className="flex-shrink-0 h-4 w-4 cursor-pointer inline-block" />
                              <TrashIcon className="flex-shrink-0 h-4 w-4 cursor-pointer inline-block ml-6" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        ) }
        

        { totalTestReports > selectedPageSize.value + 1 && (
          <div className="bg-white p-2 border-t-2 border-gray-100 rounded mt-6">
            <div className="flex justify-end">
                <div className="w-28">
                    <Select 
                        maxMenuHeight={160}
                        styles={STANDARD_DROPDOWN_STYLES}
                        menuPlacement={'top'}
                        value={selectedPageSize}
                        onChange={handlePageSizeChange}
                        options={PAGE_SIZE_OPTIONS}
                    />
                </div>
                <div className="mr-10 mt-1">
                    <Pagination
                        innerClass="pagination pagination-custom"
                        activePage={currentPage}
                        hideDisabled
                        itemClass="page-item page-item-custom"
                        linkClass="page-link page-link-custom"
                        itemsCountPerPage={selectedPageSize.value}
                        totalItemsCount={totalTestReports}
                        pageRangeDisplayed={4}
                        onChange={handlePageChange}
                        />
                </div>
            </div>
          </div>
        )}

        
      </div>
    )
  }

  export default TestReports;