
import { useEffect, useState, Fragment } from 'react'
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { DownloadIcon, CheckIcon, ShareIcon } from '@heroicons/react/outline';
import Loader from '../../components/loader/Loader';
import { Listbox, Transition, Popover } from '@headlessui/react'
import { useNavigate } from 'react-router-dom';

import Pagination from "react-js-pagination";

import JSZip from "jszip";
import { saveAs } from 'file-saver';

import * as api from './apiService'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const MagnifyingGlassIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
  
    )
}


const availableStatuses = [
    {id: 'All', name: 'All'},
    {id: 'C', name: 'Completed'},
    {id: 'I', name: 'Invoiced'},
    {id: 'T', name: 'Cancelled'},
  ]

const ChevronUpDownIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
    )
}


const CompleteList = () => {
    const [jobs, setJobs] = useState([])
    const [totalJobs, setTotalJobs] = useState(0)
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [statusSelected, setStatusSelected] = useState(availableStatuses[1])
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate()

    useEffect(() => {
        searchJobs()
    }, [searchText, statusSelected, currentPage])

    const searchJobs = async () => {
        setLoading(true)

        const request = {
            searchText,
            status: statusSelected.id,
        }

        try {
            const { data } = await api.getCompletedJobs(request, currentPage)
    
            setJobs(data.results)
            setTotalJobs(data.count)
            setLoading(false)

        } catch (err) {
            setLoading(false)
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          
          searchJobs();
        }
    };

    return (
        <AnimatedPage>
            <div className="px-4 -mt-8">
                <div className="flex justify-between border-b border-gray-200 py-2">
                    <div className="flex gap-2">
                        <h1 className="text-lg font-semibold text-gray-700">Completed Jobs</h1>
                        <p className="text-xs text-gray-700 relative top-2">
                            Total jobs: {totalJobs}
                        </p>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="inline-flex items-center rounded border border-gray-200
                                            bg-white px-2.5 py-1.5 text-xs text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-1
                                            focus:ring-gray-500 focus:ring-offset-1"
                        >
                            <ShareIcon className="h-3 w-3 mr-1"/> Export
                        </button>
                    </div>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                    <div className="relative rounded-md shadow-sm">
                        <div 
                            onClick={() => searchJobs()}
                            className="absolute inset-y-0 left-0 flex items-center pl-4 cursor-pointer">
                            <MagnifyingGlassIcon  />
                        </div>
                        <input
                            type="search"
                            name="search"
                            id="search"
                            value={searchText}
                            onChange={event => setSearchText(event.target.value)}
                            onKeyDown={handleKeyDown}
                            className="block w-full rounded-md border-0  pl-10  py-1
                                     text-xs focus:border-transparent focus:ring-0"
                            placeholder="tail, P.O, customer, airport..."
                        />
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <button
                            type="button"
                            className="inline-flex items-center rounded border border-gray-200
                                            bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-1
                                            focus:ring-gray-500 focus:ring-offset-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                                </svg>
                                Filters
                            </button>
                        </div>
                        <Listbox value={statusSelected} onChange={setStatusSelected}>
                        {({ open }) => (
                            <>
                            <div className="relative" style={{width: '120px'}}>
                                <Listbox.Button className="relative w-full rounded-md 
                                                            
                                                            bg-white py-1 px-3 pr-8 text-left
                                                            shadow-sm focus:border-gray-500 focus:outline-none
                                                            focus:ring-1 focus:ring-gray-500 text-xs cursor-pointer">
                                    <span className="block truncate">
                                        {statusSelected ? statusSelected.name : 'Status'}
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                        <ChevronUpDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                    </span>
                                </Listbox.Button>

                                <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0">
                                    <Listbox.Options className="absolute left-0 z-10 mt-1 max-h-72 w-full overflow-auto
                                                                rounded-md bg-white py-1 shadow-lg ring-1
                                                                ring-black ring-opacity-5 focus:outline-none text-xs">
                                        {availableStatuses.map((status) => (
                                            <Listbox.Option
                                                key={status.id}
                                                className={({ active }) =>
                                                        classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                value={status}>
                                                {({ selected, active }) => (
                                                    <>
                                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                            {status.name}
                                                        </span>
                                                        {selected ? (
                                                            <span
                                                                className={classNames(
                                                                active ? 'text-white' : 'text-red-600',
                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                )}>
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
                </div>

                {loading && <Loader />} 

                {!loading && jobs.length === 0 && (
                    <div className="flex flex-col justify-center items-center h-72">
                        <p className="text-gray-700 text-sm font-medium">No jobs found</p>
                        <p className="text-gray-500 text-sm">Try changing your filters</p>
                    </div>   
                )}

                {!loading && jobs.length > 0 && (
                    <div className="mt-4 flex flex-col m-auto" style={{ maxWidth: '1800px' }}>
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-4 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            P.O
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Customer
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Request Date
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Tail
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Aircraft
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Airport
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            FBO
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase  text-gray-500"
                                            >
                                            Arrival
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Departure
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Complete By
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-center text-xs font-normal uppercase text-gray-500"
                                            >
                                            Status
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-8 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Price
                                            </th>
                                            <th className="relative whitespace-nowrap py-2 pl-3 pr-4 sm:pr-6">
                                            
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                        {jobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.purchase_order}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.customer.name}</td>
                                            <td className=" px-2 py-2 text-xs text-gray-500">{job.requestDate}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.tailNumber}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.aircraftType.name}</td>
                                            <td className=" px-2 py-2 text-xs text-gray-500">{job.airport.initials}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.fbo.name}</td>
                                            <td className=" px-2 py-2 text-xs text-gray-500">{job.on_site ? 'On site' : job.estimatedETA}</td>
                                            <td className=" px-2 py-2 text-xs text-gray-500">{job.estimatedETD}</td>
                                            <td className=" px-2 py-2 text-xs text-gray-500">{job.completeBy}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-center text-gray-500">
                                                <p style={{ paddingTop: '1px', paddingBottom: '1px' }} className={`inline-flex text-xs text-white rounded-md px-1
                                                                ${job.status === 'C' && 'bg-green-500 '}
                                                                ${job.status === 'T' && 'bg-black '}
                                                                ${job.status === 'I' && 'bg-blue-500 '}
                                                                `}>
                                                    {job.status === 'C' && 'Completed'}
                                                    {job.status === 'T' && 'Cancelled'}
                                                    {job.status === 'I' && 'Invoiced'}
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap px-8 py-2 text-xs text-gray-500">
                                                <div className="relative" style={{top: '2px'}}>{'$'}{job.price ? job.price : '0.00'}</div>
                                            </td>
                                            <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-xs sm:pr-6">
                                                <button
                                                    type="button"
                                                    style={{ paddingTop: '2px', paddingBottom: '2px' }}
                                                    onClick={() => navigate(`/completed/review/${job.id}`)}
                                                    className="inline-flex items-center rounded border
                                                        border-gray-300 bg-white px-1 text-xs 
                                                        text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                                        focus:ring-gray-500 focus:ring-offset-2"
                                                >
                                                    Review
                                                </button>
                                            </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && totalJobs > 200 && (
                    <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
                        <div>
                         <Pagination
                            innerClass="pagination pagination-custom"
                            activePage={currentPage}
                            hideDisabled
                            itemClass="page-item page-item-custom"
                            linkClass="page-link page-link-custom"
                            itemsCountPerPage={200}
                            totalItemsCount={totalJobs}
                            pageRangeDisplayed={3}
                            onChange={handlePageChange}
                        /> 
                        </div>
                    </div>
                    
                )}
                
            </div>
            
        </AnimatedPage>
    )
}

export default CompleteList;