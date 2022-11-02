
import { useEffect, useState, Fragment, useRef } from 'react'
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { DownloadIcon, CheckIcon, ShareIcon } from '@heroicons/react/outline';
import Loader from '../../components/loader/Loader';
import { Listbox, Transition, Popover } from '@headlessui/react'
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css"

import Pagination from "react-js-pagination";

import JSZip from "jszip";

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
    const [searchText, setSearchText] = useState(localStorage.getItem('completedSearchText') || '')
    const [statusSelected, setStatusSelected] = useState(availableStatuses[1])
    const [currentPage, setCurrentPage] = useState(1);


    //requested date
    const [requestedDateFrom, setRequestedDateFrom] = useState(null);
    const [requestedDateTo, setRequestDateTo] = useState(null);
    const [requestedDateFromOpen, setRequestedDateFromOpen] = useState(false)
    const [requestedDateToOpen, setRequestedDateToOpen] = useState(false)
    
    //arrival date
    const [arrivalDateFrom, setArrivalDateFrom] = useState(null);
    const [arrivalDateTo, setArrivalDateTo] = useState(null);
    const [arrivalDateFromOpen, setArrivalDateFromOpen] = useState(false)
    const [arrivalDateToOpen, setArrivalDateToOpen] = useState(false)

    //departure date
    const [departureDateFrom, setDepartureDateFrom] = useState(null);
    const [departureDateTo, setDepartureDateTo] = useState(null);
    const [departureDateFromOpen, setDepartureDateFromOpen] = useState(false)
    const [departureDateToOpen, setDepartureDateToOpen] = useState(false)

    //complete by
    const [completeByDateFrom, setCompleteByDateFrom] = useState(null);
    const [completeByDateTo, setCompleteByDateTo] = useState(null);
    const [completeByDateFromOpen, setCompleteByDateFromOpen] = useState(false)
    const [completeByDateToOpen, setCompleteByDateToOpen] = useState(false)

    //completion date
    const [completionDateFrom, setCompletionDateFrom] = useState(null);
    const [completionDateTo, setCompletionDateTo] = useState(null);
    const [completionDateFromOpen, setCompletionDateFromOpen] = useState(false)
    const [completionDateToOpen, setCompletionDateToOpen] = useState(false)


    const navigate = useNavigate()

    useEffect(() => {
        localStorage.setItem('completedSearchText', searchText)
      }, [searchText])

    useEffect(() => {
        searchJobs()
    }, [searchText, statusSelected, currentPage])

    const searchJobs = async () => {
        setLoading(true)

        const request = {
            searchText: localStorage.getItem('completedSearchText'),
            status: statusSelected.id,
            requestedDateFrom,
            requestedDateTo,
            arrivalDateFrom,
            arrivalDateTo,
            departureDateFrom,
            departureDateTo,
            completeByDateFrom,
            completeByDateTo,
            completionDateFrom,
            completionDateTo,
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
    }

    //requested date
    const handleToggleRequestedFromDate = () => {
        setRequestedDateFromOpen(!requestedDateFromOpen)
    }

    const handleToggleRequestedToDate = () => {
        setRequestedDateToOpen(!requestedDateToOpen)
    }

    const handleRequestedDateFromChange = (date, event) => {
        setRequestedDateFrom(date);
    }

    const handleRequestedDateToChange = (date, event) => {
        setRequestDateTo(date);
    }

    //arrival date
    const handleToggleArrivalFromDate = () => {
        setArrivalDateFromOpen(!arrivalDateFromOpen)
    }

    const handleToggleArrivalToDate = () => {
        setArrivalDateToOpen(!arrivalDateToOpen)
    }

    const handleArrivalDateFromChange = (date, event) => {
        setArrivalDateFrom(date);
    }

    const handleArrivalDateToChange = (date, event) => {
        setArrivalDateTo(date);
    }

    //departure date
    const handleToggleDepartureFromDate = () => {
        setDepartureDateFromOpen(!departureDateFromOpen)
    }

    const handleToggleDepartureToDate = () => {
        setDepartureDateToOpen(!departureDateToOpen)
    }

    const handleDepartureDateFromChange = (date, event) => {
        setDepartureDateFrom(date);
    }

    const handleDepartureDateToChange = (date, event) => {
        setDepartureDateTo(date);
    }

    //complete by date
    const handleToggleCompleteByFromDate = () => {
        setCompleteByDateFromOpen(!completeByDateFromOpen)
    }

    const handleToggleCompleteByToDate = () => {
        setCompleteByDateToOpen(!completeByDateToOpen)
    }

    const handleCompleteByDateFromChange = (date, event) => {
        setCompleteByDateFrom(date);
    }

    const handleCompleteByDateToChange = (date, event) => {
        setCompleteByDateTo(date);
    }

    //completion date
    const handleToggleCompletionFromDate = () => {
        setCompletionDateFromOpen(!completionDateFromOpen)
    }

    const handleToggleCompletionToDate = () => {
        setCompletionDateToOpen(!completionDateToOpen)
    }

    const handleCompletionDateFromChange = (date, event) => {
        setCompletionDateFrom(date);
    }

    const handleCompletionDateToChange = (date, event) => {
        setCompletionDateTo(date);
    }

    const resetAllDateFilters = () => {
        setRequestedDateFrom(null)
        setRequestDateTo(null)
        setArrivalDateFrom(null)
        setArrivalDateTo(null)
        setDepartureDateFrom(null)
        setDepartureDateTo(null)
        setCompleteByDateFrom(null)
        setCompleteByDateTo(null)
        setCompletionDateFrom(null)
        setCompletionDateTo(null)
    }

    const handleApplyDateFilters = () => {
        searchJobs()
    }

    const isThereAnyDateFilter = () => {
        return requestedDateFrom || requestedDateTo
            || arrivalDateFrom || arrivalDateTo
            || departureDateFrom || departureDateTo
            || completeByDateFrom || completeByDateTo
            || completionDateFrom || completionDateTo
    }

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
                            <Popover className="relative">
                                {({ open }) => (
                                <>
                                    <Popover.Button
                                    className={`
                                        ${open ? '' : 'text-opacity-90'}
                                        inline-flex items-center rounded border border-gray-200
                                            bg-white px-2.5 py-1 text-xs text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-1
                                            focus:ring-gray-500 focus:ring-offset-1`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                                        </svg>
                                        Filters
                                        {isThereAnyDateFilter() && (
                                            <div style={{paddingTop: '2px', paddingBottom: '2px'}} 
                                                    className="bg-red-500 text-white px-2 absolute bottom-2 -right-2
                                                                rounded-full text-xs font-medium inline-block scale-90">
                                                !
                                            </div>
                                        )}
                                    </Popover.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1">
                                    <Popover.Panel className="absolute left-1/4 z-10 mt-3 w-96 -translate-x-1/2
                                                              transform px-4 sm:px-0 max-w-6xl">
                                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="bg-gray-50 p-4 grid grid-cols-2">
                                                <div>
                                                    <span className="flex items-center">
                                                        <span className="text-xs font-medium text-gray-900">
                                                        Date filters
                                                        </span>
                                                    </span>
                                                </div>
                                                <div onClick={() => resetAllDateFilters()} className="text-right underline text-xs text-red-500 cursor-pointer">
                                                    reset
                                                </div>
                                                
                                            </div>
                                            <div className="relative grid gap-y-2 bg-white p-7 pt-2 divide-y grid-cols-1
                                                             text-xs text-gray-500">
                                                <div className="flex flex-col gap-2 pb-2">
                                                    <div className="font-medium">
                                                        Requested
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div>from</div>
                                                            {requestedDateFrom && (
                                                                <span 
                                                                    onClick={() => setRequestedDateFrom(null)}
                                                                    className="ml-2 underline text-xs text-red-500
                                                                                 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleRequestedFromDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {requestedDateFrom?.toLocaleString()}
                                                        </button>
                                                        {requestedDateFromOpen && (
                                                            <DatePicker
                                                                selected={requestedDateFrom}
                                                                onChange={(date) => handleRequestedDateFromChange(date)}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                inline
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div>to</div>
                                                            {requestedDateTo && (
                                                                <span 
                                                                    onClick={() => setRequestDateTo(null)}
                                                                    className="ml-2 underline text-xs text-red-500 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleRequestedToDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {requestedDateTo?.toLocaleString()}
                                                        </button>
                                                        {requestedDateToOpen && (
                                                            <DatePicker
                                                            selected={requestedDateTo}
                                                            onChange={(date) => handleRequestedDateToChange(date)}
                                                            timeInputLabel="Time:"
                                                            dateFormat="MM/dd/yyyy h:mm aa"
                                                            showTimeInput
                                                            inline
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col gap-2 pb-2">
                                                    <div className="font-medium pt-2">
                                                        Arrival
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div>from</div>
                                                            {arrivalDateFrom && (
                                                                <span 
                                                                    onClick={() => setArrivalDateFrom(null)}
                                                                    className="ml-2 underline text-xs text-red-500
                                                                                 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleArrivalFromDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {arrivalDateFrom?.toLocaleString()}
                                                        </button>
                                                        {arrivalDateFromOpen && (
                                                            <DatePicker
                                                            selected={arrivalDateFrom}
                                                            onChange={(date) => handleArrivalDateFromChange(date)}
                                                            timeInputLabel="Time:"
                                                            dateFormat="MM/dd/yyyy h:mm aa"
                                                            showTimeInput
                                                            inline
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex justify-between">
                                                            <div>to</div>
                                                            {arrivalDateTo && (
                                                                <span 
                                                                    onClick={() => setArrivalDateTo(null)}
                                                                    className="ml-2 underline text-xs text-red-500 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleArrivalToDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {arrivalDateTo?.toLocaleString()}
                                                        </button>
                                                        {arrivalDateToOpen && (
                                                            <DatePicker
                                                                selected={arrivalDateTo}
                                                                onChange={(date) => handleArrivalDateToChange(date)}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                inline
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 pb-2">
                                                    <div className="font-medium pt-2">
                                                        Departure
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div>from</div>
                                                            {departureDateFrom && (
                                                                <span 
                                                                    onClick={() => setDepartureDateFrom(null)}
                                                                    className="ml-2 underline text-xs text-red-500
                                                                                 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleDepartureFromDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {departureDateFrom?.toLocaleString()}
                                                        </button>
                                                        {departureDateFromOpen && (
                                                            <DatePicker
                                                            selected={departureDateFrom}
                                                            onChange={(date) => handleDepartureDateFromChange(date)}
                                                            timeInputLabel="Time:"
                                                            dateFormat="MM/dd/yyyy h:mm aa"
                                                            showTimeInput
                                                            inline
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <div className="flex justify-between">
                                                            <div>to</div>
                                                            {departureDateTo && (
                                                                <span 
                                                                    onClick={() => setDepartureDateTo(null)}
                                                                    className="ml-2 underline text-xs text-red-500 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleDepartureToDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {departureDateTo?.toLocaleString()}
                                                        </button>
                                                        {departureDateToOpen && (
                                                            <DatePicker
                                                                selected={departureDateTo}
                                                                onChange={(date) => handleDepartureDateToChange(date)}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                inline
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-2 pb-2">
                                                    <div className="font-medium pt-2">
                                                        Complete by
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div>from</div>
                                                            {completeByDateFrom && (
                                                                <span 
                                                                    onClick={() => setCompleteByDateFrom(null)}
                                                                    className="ml-2 underline text-xs text-red-500
                                                                                 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleCompleteByFromDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {completeByDateFrom?.toLocaleString()}
                                                        </button>
                                                        {completeByDateFromOpen && (
                                                            <DatePicker
                                                                selected={completeByDateFrom}
                                                                onChange={(date) => handleCompleteByDateFromChange(date)}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                inline
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div>to</div>
                                                            {completeByDateTo && (
                                                                <span 
                                                                    onClick={() => setCompleteByDateTo(null)}
                                                                    className="ml-2 underline text-xs text-red-500 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleCompleteByToDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {completeByDateTo?.toLocaleString()}
                                                        </button>
                                                        {completeByDateToOpen && (
                                                            <DatePicker
                                                                selected={completeByDateTo}
                                                                onChange={(date) => handleCompleteByDateToChange(date)}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                inline
                                                            />
                                                        )}
                                                    </div>

                                                </div>
                                                <div className="flex flex-col gap-2 pb-2">
                                                    <div className="font-medium pt-2">
                                                        Completion
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div>from</div>
                                                            {completionDateFrom && (
                                                                <span 
                                                                    onClick={() => setCompletionDateFrom(null)}
                                                                    className="ml-2 underline text-xs text-red-500
                                                                                 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleCompletionFromDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {completionDateFrom?.toLocaleString()}
                                                        </button>
                                                        {completionDateFromOpen && (
                                                            <DatePicker
                                                                selected={completionDateFrom}
                                                                onChange={(date) => handleCompletionDateFromChange(date)}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                inline
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between">
                                                            <div>to</div>
                                                            {completionDateTo && (
                                                                <span 
                                                                    onClick={() => setCompletionDateTo(null)}
                                                                    className="ml-2 underline text-xs text-red-500 cursor-pointer">clear</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={handleToggleCompletionToDate}
                                                            style={{width: '240px', fontSize: '11px'}}
                                                            className="inline-flex items-center rounded-md border
                                                                     h-8 w-full
                                                                    border-gray-300 bg-white px-1 py-1 
                                                                        text-gray-700 shadow-sm hover:bg-gray-50">
                                                            {completionDateTo?.toLocaleString()}
                                                        </button>
                                                        {completionDateToOpen && (
                                                            <DatePicker
                                                                selected={completionDateTo}
                                                                onChange={(date) => handleCompletionDateToChange(date)}
                                                                timeInputLabel="Time:"
                                                                dateFormat="MM/dd/yyyy h:mm aa"
                                                                showTimeInput
                                                                inline
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApplyDateFilters()}
                                                            className="inline-flex items-center rounded-md border border-transparent
                                                                     bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white
                                                                      shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                                                       focus:ring-red-500 focus:ring-offset-2"
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </Popover.Panel>
                                    </Transition>
                                </>
                                )}
                            </Popover>
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
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Completion
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
                                            <td className=" px-2 py-2 text-xs text-gray-500">{job.completion_date}</td>
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