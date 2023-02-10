
import { useEffect, useState, Fragment, useRef } from 'react'
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { DownloadIcon, ChevronRightIcon, CheckIcon, ShareIcon, QuestionMarkCircleIcon, ChevronDownIcon } from '@heroicons/react/outline';
import Loader from '../../components/loader/Loader';
import { UserIcon } from "@heroicons/react/solid";
import { Listbox, Transition, Popover, Dialog } from '@headlessui/react'
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css"

import JobPriceBreakdownModal from './JobPriceBreakdownModal';
import Pagination from "react-js-pagination";

import JSZip from "jszip";
import { saveAs } from 'file-saver';

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../routes/userProfile/userSlice";

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

const XMarkIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
  }


const availableStatuses = [
    {id: 'All', name: 'All'},
    {id: 'C', name: 'Completed'},
    {id: 'I', name: 'Invoiced'},
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
    const [open, setOpen] = useState(false)
    const [searchText, setSearchText] = useState(localStorage.getItem('completedSearchText') || '')
    const [statusSelected, setStatusSelected] = useState(JSON.parse(localStorage.getItem('completedStatusSelected')) || {id: 'C', name: 'Completed'})

    const [airportSelected, setAirportSelected] = useState(JSON.parse(localStorage.getItem('completedAirportSelected')) || {id: 'All', name: 'All'})
    const [airportSearchTerm, setAirportSearchTerm] = useState('')

    const [customerSelected, setCustomerSelected] = useState(JSON.parse(localStorage.getItem('completedCustomerSelected')) || {id: 'All', name: 'All'})
    const [customerSearchTerm, setCustomerSearchTerm] = useState('')

    const [activeFilters, setActiveFilters] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const [isPriceBreakdownModalOpen, setPriceBreakdownModalOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState(null)
    const [airports, setAirports] = useState([])

    const [customers, setCustomers] = useState([])

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

    const [showMoreDates, setShowMoreDates] = useState(false)

    const currentUser = useAppSelector(selectUser)

    const filteredAirports = airportSearchTerm
    ? airports.filter((item) => item.name.toLowerCase().includes(airportSearchTerm.toLowerCase()))
    : airports;

    const filteredCustomers = customerSearchTerm
    ? customers.filter((item) => item.name.toLowerCase().includes(customerSearchTerm.toLowerCase()))
    : customers;

    const navigate = useNavigate()

    useEffect(() => {
        
        if (currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager || currentUser.isInternalCoordinator) {
            if (!availableStatuses.find(status => status.id === 'T')) {
                availableStatuses.push({id: 'T', name: 'Canceled'})
            }
        } else {
            if (availableStatuses.find(status => status.id === 'T')) {
                availableStatuses.splice(availableStatuses.findIndex(status => status.id === 'T'), 1)
            }
        }

    }, [currentUser])

    useEffect(() => {
        getAirports()
        getCustomers()
    }, [])

    useEffect(() => {
        localStorage.setItem('completedSearchText', searchText)
    }, [searchText])

    useEffect(() => {
        localStorage.setItem('completedStatusSelected', JSON.stringify(statusSelected))
      
    }, [statusSelected])

    useEffect(() => {
        localStorage.setItem('completedCustomerSelected', JSON.stringify(customerSelected))

    }, [customerSelected])

    useEffect(() => {
        localStorage.setItem('completedAirportSelected', JSON.stringify(airportSelected))

    }, [airportSelected])

    useEffect(() => {
        //Basic throttling
        let timeoutID = setTimeout(() => {
            searchJobs()
        }, 300);
  
        return () => {
            clearTimeout(timeoutID);
        };

    }, [searchText, statusSelected, currentPage, airportSelected, customerSelected])

    const searchJobs = async () => {
        setLoading(true)

        const request = {
            searchText: localStorage.getItem('completedSearchText'),
            status: JSON.parse(localStorage.getItem('completedStatusSelected')).id,
            airport: JSON.parse(localStorage.getItem('completedAirportSelected')).id,
            customer: JSON.parse(localStorage.getItem('completedCustomerSelected')).id,
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

        let statusName;

        //get status name by request.status
        availableStatuses.forEach(status => {
            if (status.id === request.status) {
                statusName = status.name
            }
        })

        //set active filters
        let activeFilters = []
        if (request.searchText) {
            activeFilters.push({
                id: 'searchText',
                name: request.searchText,
            })
        }
        
        if (request.status !== 'All') {
            activeFilters.push({
                id: 'status',
                name: statusName,
            })
        }

        if (request.customer !== 'All') {
            activeFilters.push({
                id: 'customer',
                name: customerSelected.name,
            })
        }

        if (request.airport !== 'All') {
            activeFilters.push({
                id: 'airport',
                name: airportSelected.name,
            })
        }

        setActiveFilters(activeFilters)


        try {
            const { data } = await api.getCompletedJobs(request, currentPage)
    
            setJobs(data.results)
            setTotalJobs(data.count)
            setLoading(false)

        } catch (err) {
            setLoading(false)
        }
    }

    const removeActiveFilter = (activeFilterId) => {
        if (activeFilterId === 'status') {
          setStatusSelected(availableStatuses[0])
        
        } else if (activeFilterId === 'searchText') {
          setSearchText('')
        
        } else if (activeFilterId === 'customer') {
          setCustomerSelected({id: 'All', name: 'All'})
        
        } else if (activeFilterId === 'airport') {
          setAirportSelected({id: 'All', name: 'All'})
        }
    
        setActiveFilters(activeFilters.filter(filter => filter.id !== activeFilterId))
    }

    const getAirports = async () => {
        let request = {
          name: '',
          closed_jobs: true
        }

        const { data } = await api.getAirports(request)
    
        data.results.unshift({id: 'All', name: 'All'})
    
        setAirports(data.results)
    }

    const getCustomers = async () => {
        const { data } = await api.getCustomers({ name: '', closed_jobs: true });
  
        data.results.unshift({id: 'All', name: 'All'})
        setCustomers(data.results)
    }

    const handleExport = async () => {
        setLoading(true)

        const request = {
            searchText: localStorage.getItem('completedSearchText'),
            status: statusSelected.id,
            airport: airportSelected.id,
            customer: customerSelected.id,
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
            const { data } = await api.exportJobs(request)

            // copy all the csv data to the zip file
            const zip = new JSZip();
            zip.file("completed_jobs.csv", data);

            // generate the zip file
            zip.generateAsync({type:"blob"})
            .then(function(content) {
                // see FileSaver.js
                saveAs(content, "completed_jobs.zip");
            });

            setLoading(false)
        } catch (error) {
            setLoading(false)
        }
    }

    const handleTogglePriceBreakdownModal = (job) => {
        setSelectedJob(job)
        setPriceBreakdownModalOpen(!isPriceBreakdownModalOpen)
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

    const handleStatusFilter = (status) => {
        setCurrentPage(1)
        setStatusSelected({ id: status.id, name: status.name })
    }

    return (
        <AnimatedPage>
            <div className="px-4 -mt-8">
                <div className="flex justify-between border-b border-gray-200 py-2">
                    <div className="flex gap-2">
                        <h1 className="text-lg font-semibold text-gray-700">Completed Jobs</h1>
                        <p className="text-sm text-gray-700 relative" style={{top: '5px'}}>
                            Total: {totalJobs}
                        </p>
                    </div>
                    <div>
                        {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) && (
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleExport()}
                                className="inline-flex items-center rounded border border-gray-200
                                                bg-white px-2.5 py-1.5 text-xs text-gray-700 shadow-sm
                                                hover:bg-gray-50 focus:outline-none focus:ring-1
                                                focus:ring-gray-500 focus:ring-offset-1"
                            >
                                <ShareIcon className="h-3 w-3 mr-1"/> {loading ? '...' : 'Export'}
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                    <div className="relative rounded-md shadow-sm">
                        <div 
                            onClick={() => searchJobs()}
                            className="absolute inset-y-0 left-0 flex items-center pl-2 cursor-pointer">
                            <MagnifyingGlassIcon  />
                        </div>
                        <input
                            type="search"
                            name="search"
                            id="search"
                            value={searchText}
                            onChange={event => setSearchText(event.target.value)}
                            onKeyDown={handleKeyDown}
                            className="block w-full rounded-md border-0  pl-8  py-1
                                     text-xs focus:border-transparent focus:ring-0"
                            placeholder="search by tail or PO..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="">
                            <Popover className="relative hidden xl:block lg:block md:block">
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
                                        Dates
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
                                    <Popover.Panel className="absolute z-10 mt-3 w-96 -translate-x-1/2
                                                              transform px-4 sm:px-0 max-w-6xl" style={{right: '-170%'}}>
                                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="bg-gray-50 p-4 grid grid-cols-2">
                                                <div>
                                                    <span className="flex items-center">
                                                        <span className="text-xs font-medium text-gray-900">
                                                        Date filters
                                                        </span>
                                                    </span>
                                                </div>
                                                <div onClick={() => resetAllDateFilters()} className="text-right text-xs text-blue-500 cursor-pointer">
                                                    reset
                                                </div>
                                                
                                            </div>
                                            <div className="relative grid gap-y-2 bg-white p-7 pt-2  grid-cols-1
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
                                                            {requestedDateFrom?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                        </button>
                                                        {requestedDateFromOpen && (
                                                            <DatePicker
                                                                selected={requestedDateFrom}
                                                                onChange={(date) => handleRequestedDateFromChange(date)}
                                                                locale="pt-BR"
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={5}
                                                                dateFormat="Pp"
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
                                                            {requestedDateTo?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                        </button>
                                                        {requestedDateToOpen && (
                                                            <DatePicker
                                                                selected={requestedDateTo}
                                                                onChange={(date) => handleRequestedDateToChange(date)}
                                                                locale="pt-BR"
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={5}
                                                                dateFormat="Pp"
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
                                                            {completionDateFrom?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                        </button>
                                                        {completionDateFromOpen && (
                                                            <DatePicker
                                                                selected={completionDateFrom}
                                                                onChange={(date) => handleCompletionDateFromChange(date)}
                                                                locale="pt-BR"
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={5}
                                                                dateFormat="Pp"
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
                                                            {completionDateTo?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                        </button>
                                                        {completionDateToOpen && (
                                                            <DatePicker
                                                                selected={completionDateTo}
                                                                onChange={(date) => handleCompletionDateToChange(date)}
                                                                locale="pt-BR"
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={5}
                                                                dateFormat="Pp"
                                                                inline
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div onClick={() => setShowMoreDates(!showMoreDates)} className="flex justify-end text-xs text-blue-500 cursor-pointer">{showMoreDates ? 'Hide less': 'Show more'}</div>
                                                
                                                {showMoreDates && (
                                                    <>
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
                                                                {arrivalDateFrom?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                            </button>
                                                            {arrivalDateFromOpen && (
                                                                <DatePicker
                                                                selected={arrivalDateFrom}
                                                                onChange={(date) => handleArrivalDateFromChange(date)}
                                                                locale="pt-BR"
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={5}
                                                                dateFormat="Pp"
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
                                                                {arrivalDateTo?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                            </button>
                                                            {arrivalDateToOpen && (
                                                                <DatePicker
                                                                locale="pt-BR"
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={5}
                                                                dateFormat="Pp"
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
                                                                {departureDateFrom?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                            </button>
                                                            {departureDateFromOpen && (
                                                                <DatePicker
                                                                selected={departureDateFrom}
                                                                onChange={(date) => handleDepartureDateFromChange(date)}
                                                                locale="pt-BR"
                                                                showTimeSelect
                                                                timeFormat="HH:mm"
                                                                timeIntervals={5}
                                                                dateFormat="Pp"
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
                                                                {departureDateTo?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                                            </button>
                                                            {departureDateToOpen && (
                                                                <DatePicker
                                                                    selected={departureDateTo}
                                                                    onChange={(date) => handleDepartureDateToChange(date)}
                                                                    locale="pt-BR"
                                                                    showTimeSelect
                                                                    timeFormat="HH:mm"
                                                                    timeIntervals={5}
                                                                    dateFormat="Pp"
                                                                    inline
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col gap-2 pb-2">
                                                        <div className="font-medium pt-2">
                                                            Complete Before
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
                                                                {completeByDateFrom?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
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
                                                                {completeByDateTo?.toLocaleString('en-US', {hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
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
                                                    </>   
                                                )}
                                                

                                                <div className="flex justify-end pt-4 border-t border-gray-200">
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
                                    </Popover.Panel>
                                    </Transition>
                                </>
                                )}
                            </Popover>
                        </div>

                        <Transition.Root show={open} as={Fragment}>
                            <Dialog as="div" className="relative z-40" onClose={setOpen}>
                                <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                                >
                                <div className="fixed inset-0 bg-black bg-opacity-25" />
                                </Transition.Child>

                                <div className="fixed inset-0 z-40 flex">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition ease-in-out duration-300 transform"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transition ease-in-out duration-300 transform"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                        <button
                                        type="button"
                                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                        onClick={() => setOpen(false)}
                                        >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4">
                                        <div className="pb-4 px-4">
                                            <h2 className="font-medium text-sm text-gray-900">Status</h2>
                                            <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                                                {availableStatuses.map((status) => (
                                                    <li key={status.id}>
                                                    <div onClick={() => setStatusSelected({ id: status.id, name: status.name })}
                                                            className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                                                            hover:bg-gray-50">
                                                        <div className="min-w-0 flex-1">
                                                            <div  className="focus:outline-none">
                                                            <p className="text-sm text-gray-700 truncate overflow-ellipsis w-44">{status.name}</p>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {!currentUser.isCustomer && (
                                            <div className="px-4 pb-4">
                                                <div className="text-sm font-medium text-gray-900 mb-2">Customers</div>
                                                <Listbox value={customerSelected} onChange={setCustomerSelected}>
                                                    {({ open }) => (
                                                        <>
                                                        <div className="relative mt-1">
                                                            <Transition
                                                                show={true}
                                                                as={Fragment}
                                                                leave="transition ease-in duration-100"
                                                                leaveFrom="opacity-100"
                                                                leaveTo="opacity-0">
                                                                <Listbox.Options className="absolute z-10 mt-1 max-h-72 w-full overflow-auto
                                                                                            rounded-md bg-white py-1 text-base ring-1
                                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                                    <div className="relative">
                                                                        <div className="sticky top-0 z-20  px-1">
                                                                            <div className="mt-1 block  items-center">
                                                                                <input
                                                                                    type="text"
                                                                                    name="search"
                                                                                    id="search"
                                                                                    value={customerSearchTerm}
                                                                                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                                                                    className="border px-2 focus:ring-sky-500
                                                                                                focus:border-sky-500 block w-full py-1 pr-12 font-normal text-sm
                                                                                                border-gray-300 rounded-md"
                                                                                />
                                                                                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                                    {customerSearchTerm && (
                                                                                        <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        className="h-4 w-4 text-blue-500 font-bold mr-1"
                                                                                        viewBox="0 0 20 20"
                                                                                        fill="currentColor"
                                                                                        onClick={() => {
                                                                                            setCustomerSearchTerm("");
                                                                                        }}
                                                                                        >
                                                                                        <path
                                                                                            fillRule="evenodd"
                                                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                            clipRule="evenodd"
                                                                                        />
                                                                                        </svg>
                                                                                    )}
                                                                                    <svg
                                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                                        className="h-4 w-4 text-gray-500 mr-1"
                                                                                        fill="none"
                                                                                        viewBox="0 0 24 24"
                                                                                        stroke="currentColor"
                                                                                    >
                                                                                        <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth="2"
                                                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                                        />
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {filteredCustomers.map((customer) => (
                                                                        <Listbox.Option
                                                                            key={customer.id}
                                                                            className={({ active }) =>
                                                                                    classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                                            'relative cursor-default select-none py-2 pl-3 pr-9 text-xs hover:bg-gray-50')}
                                                                            value={customer}>
                                                                            {({ selected, active }) => (
                                                                                <>
                                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate w-36 overflow-ellipsis')}>
                                                                                        {customer.name}
                                                                                    </span>
                                                                                    {selected ? (
                                                                                        <span
                                                                                            className={classNames(
                                                                                            active ? 'text-white' : 'text-red-600',
                                                                                            'absolute inset-y-0 right-0 flex items-center pr-2'
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
                                        )}
                                        
                                        <div className={`${!currentUser.isCustomer ? 'mt-72' : ''} px-4`}>
                                            <h2 className="font-medium text-sm text-gray-900">Airports</h2>
                                            <Listbox value={airportSelected} onChange={setAirportSelected}>
                                                {({ open }) => (
                                                    <>
                                                    <div className="relative mt-1 w-full">
                                                        <Transition
                                                            show={true}
                                                            as={Fragment}
                                                            leave="transition ease-in duration-100"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0">
                                                            <Listbox.Options className="absolute z-10 mt-1 max-h-72 w-full overflow-auto
                                                                                        rounded-md bg-white py-1 ring-1
                                                                                        ring-black ring-opacity-5 focus:outline-none text-xs">
                                                                <div className="relative">
                                                                    <div className="sticky top-0 z-20  px-1">
                                                                        <div className="mt-1 block  items-center">
                                                                            <input
                                                                                type="text"
                                                                                name="search"
                                                                                id="search"
                                                                                value={airportSearchTerm}
                                                                                onChange={(e) => setAirportSearchTerm(e.target.value)}
                                                                                className="border px-2  focus:ring-sky-500
                                                                                        focus:border-sky-500 block w-full py-1 pr-12 font-normal text-sm
                                                                                        border-gray-300 rounded-md"
                                                                            />
                                                                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                                {airportSearchTerm && (
                                                                                    <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className="h-4 w-4 text-blue-500 font-bold mr-1"
                                                                                    viewBox="0 0 20 20"
                                                                                    fill="currentColor"
                                                                                    onClick={() => {
                                                                                        setAirportSearchTerm("");
                                                                                    }}
                                                                                    >
                                                                                    <path
                                                                                        fillRule="evenodd"
                                                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                                        clipRule="evenodd"
                                                                                    />
                                                                                    </svg>
                                                                                )}
                                                                                <svg
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    className="h-4 w-4 text-gray-500 mr-1"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    stroke="currentColor"
                                                                                >
                                                                                    <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                                    />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {filteredAirports.map((airport) => (
                                                                    <Listbox.Option
                                                                        key={airport.id}
                                                                        className={({ active }) =>
                                                                                classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                                        'relative cursor-default select-none py-2 pl-3 pr-9 text-xs hover:bg-gray-50')}
                                                                        value={airport}>
                                                                        {({ selected, active }) => (
                                                                            <>
                                                                                <div className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate w-36 overflow-ellipsis')}>
                                                                                    {airport.name}
                                                                                </div>
                                                                                {selected ? (
                                                                                    <span
                                                                                        className={classNames(
                                                                                        active ? 'text-white' : 'text-red-600',
                                                                                        'absolute inset-y-0 right-0 flex items-center pr-2'
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
                                    </form>
                                    </Dialog.Panel>
                                </Transition.Child>
                                </div>
                            </Dialog>
                        </Transition.Root>

                        <div className="xl:hidden lg:hidden md:hidden xs:block sm:block">
                            <button
                                type="button"
                                className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900"
                                onClick={() => setOpen(true)}
                            >
                                Filters
                            </button>
                        </div>
                    </div>
                </div>


                <div className="flex gap-4">
                    <div className="xl:block lg:block hidden w-60">
                        <div className="pb-4">
                            <div className="text-sm font-medium text-gray-900 mt-8">Status</div>
                            <ul className="relative z-0  mt-2">
                                {availableStatuses.map((status) => (
                                    <li key={status.id}>
                                        <div onClick={() => handleStatusFilter(status)}
                                                className="relative flex items-center space-x-3 focus-within:ring-2 cursor-pointer
                                                            hover:bg-gray-50">
                                            <div className="min-w-0 flex-1">
                                                <div  className="focus:outline-none">
                                                    <p className={`${statusSelected.id === status.id && status.id === 'C' ? 'bg-green-100': ''}
                                                                    ${statusSelected.id === status.id && status.id === 'I' ? 'bg-blue-200': ''}
                                                                    ${statusSelected.id === status.id && status.id === 'T' ? 'bg-gray-200': ''}
                                                                    ${statusSelected.id === status.id && status.id === 'All' ? 'bg-gray-100': ''}
                                                                    text-xs text-gray-700 w-full py-2 truncate overflow-ellipsis rounded-md px-2`}>{status.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {!currentUser.isCustomer && (
                            <div className="pb-4">
                                <div className="text-sm font-medium text-gray-900 mb-2">Customers</div>
                                <Listbox value={customerSelected} onChange={setCustomerSelected}>
                                    {({ open }) => (
                                        <>
                                        <div className="relative mt-1">
                                            <Transition
                                                show={true}
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0">
                                                <Listbox.Options className="absolute z-10 mt-1 max-h-72 w-full overflow-auto
                                                                            rounded-md bg-white py-1 text-base ring-1
                                                                            ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    <div className="relative">
                                                        <div className="sticky top-0 z-20  px-1">
                                                            <div className="mt-1 block  items-center">
                                                                <input
                                                                    type="text"
                                                                    name="search"
                                                                    id="search"
                                                                    value={customerSearchTerm}
                                                                    onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                                                    className="border px-2 focus:ring-sky-500
                                                                                focus:border-sky-500 block w-full py-1 pr-12 font-normal text-sm
                                                                                border-gray-300 rounded-md"
                                                                />
                                                                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                    {customerSearchTerm && (
                                                                        <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 text-blue-500 font-bold mr-1"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                        onClick={() => {
                                                                            setCustomerSearchTerm("");
                                                                        }}
                                                                        >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                        </svg>
                                                                    )}
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4 text-gray-500 mr-1"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="2"
                                                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {filteredCustomers.map((customer) => (
                                                        <Listbox.Option
                                                            key={customer.id}
                                                            className={({ active }) =>
                                                                    classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                            'relative cursor-default select-none py-2 pl-3 pr-9 text-xs hover:bg-gray-50')}
                                                            value={customer}>
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate w-36 overflow-ellipsis')}>
                                                                        {customer.name}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span
                                                                            className={classNames(
                                                                            active ? 'text-white' : 'text-red-600',
                                                                            'absolute inset-y-0 right-0 flex items-center pr-2'
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
                        )}

                        <div className={`${!currentUser.isCustomer ? 'mt-72' : ''}  pt-8`}>
                            <div className="text-sm font-medium text-gray-900 mb-2">Airports</div>
                            <Listbox value={airportSelected} onChange={setAirportSelected}>
                                {({ open }) => (
                                    <>
                                    <div className="relative mt-1 w-full">
                                        <Transition
                                            show={true}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0">
                                            <Listbox.Options className="absolute z-10 mt-1 max-h-72 w-full overflow-auto
                                                                        rounded-md bg-white py-1 ring-1
                                                                        ring-black ring-opacity-5 focus:outline-none text-xs">
                                                <div className="relative">
                                                    <div className="sticky top-0 z-20  px-1">
                                                        <div className="mt-1 block  items-center">
                                                            <input
                                                                type="text"
                                                                name="search"
                                                                id="search"
                                                                value={airportSearchTerm}
                                                                onChange={(e) => setAirportSearchTerm(e.target.value)}
                                                                className="border px-2  focus:ring-sky-500
                                                                        focus:border-sky-500 block w-full py-1 pr-12 font-normal text-sm
                                                                        border-gray-300 rounded-md"
                                                            />
                                                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                {airportSearchTerm && (
                                                                    <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 text-blue-500 font-bold mr-1"
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                    onClick={() => {
                                                                        setAirportSearchTerm("");
                                                                    }}
                                                                    >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                    </svg>
                                                                )}
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4 text-gray-500 mr-1"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {filteredAirports.map((airport) => (
                                                    <Listbox.Option
                                                        key={airport.id}
                                                        className={({ active }) =>
                                                                classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                        'relative cursor-default select-none py-2 pl-3 pr-9 text-xs hover:bg-gray-50')}
                                                        value={airport}>
                                                        {({ selected, active }) => (
                                                            <>
                                                                <div className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate w-36 overflow-ellipsis')}>
                                                                    {airport.name}
                                                                </div>
                                                                {selected ? (
                                                                    <span
                                                                        className={classNames(
                                                                        active ? 'text-white' : 'text-red-600',
                                                                        'absolute inset-y-0 right-0 flex items-center pr-2'
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
                    <div className="overflow-x-auto w-full">
                        <div className="inline-block min-w-full pb-2 align-middle">
                            {activeFilters.length > 0 && (
                                <div className="bg-gray-100">
                                    <div className="py-2 sm:flex sm:items-center px-4">
                                    <h3 className="text-xs font-medium text-gray-500">
                                        Active Filters
                                        <span className="sr-only">, active</span>
                                    </h3>

                                    <div className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />
                                        <div className="mt-2 sm:mt-0 sm:ml-4">
                                            <div className="-m-1 flex flex-wrap items-center">
                                                {activeFilters.map((activeFilter) => (
                                                    <span
                                                    key={activeFilter.id}
                                                    onClick={() => removeActiveFilter(activeFilter.id)}
                                                    className="m-1 inline-flex items-center rounded-full cursor-pointer
                                                                border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-xs font-medium text-gray-900"
                                                    >
                                                    <span>{activeFilter.name}</span>
                                                    <button
                                                        type="button"
                                                        className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                                    >
                                                        <span className="sr-only">Remove filter for {activeFilter.name}</span>
                                                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                                        </svg>
                                                    </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {loading && <Loader />} 

                            {!loading && jobs.length === 0 && (
                                <div className="flex flex-col gap-2 justify-center items-center h-96">
                                    <p className="text-gray-700 text-sm font-medium">No jobs found</p>
                                    <p className="text-gray-500 text-sm">We can't find anything with your search criteria at the moment,</p>
                                    <p className="text-gray-500 text-sm">try searching something else.</p>
                                </div>   
                            )}

                            {!loading && jobs.length > 0 && (
                                <>
                                {/* DESKTOP */}
                                <div className="hidden md:block lg:block xl:block overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                                            C.P.O
                                            </th>
                                            {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) && (
                                                <th
                                                className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500 w-28 max-w-xs"
                                                >
                                                Customer
                                                </th>
                                            )}
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
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Completion
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-center text-xs font-normal uppercase text-gray-500"
                                            >
                                            Status
                                            </th>
                                            {!currentUser.isInternalCoordinator && (
                                                <th
                                                className="whitespace-nowrap px-8 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                                >
                                                Price
                                                </th>

                                            )}
                                            <th className="relative whitespace-nowrap py-2 pl-3 pr-4 sm:pr-6">
                                            
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                        {jobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.purchase_order}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.customer_purchase_order}</td>
                                            {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager || currentUser.isInternalCoordinator) && (
                                                <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500 truncate overflow-ellipsis w-28 max-w-xs" style={{maxWidth: '170px'}}>{job.customer.name}</td>
                                            )}
                                            <td className=" px-2 py-2 text-xs text-gray-500">{job.requestDate}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.tailNumber}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.aircraftType.name}</td>
                                            <td className=" px-2 py-2 text-xs text-gray-500">{job.airport.initials}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.fbo.name}</td>
                                            <td className=" px-2 py-2 text-xs text-gray-500">{job.completion_date}</td>
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-center text-gray-500">
                                                <p style={{ paddingTop: '2px', paddingBottom: '2px' }} className={`inline-flex text-xs text-white rounded-md px-1
                                                                ${job.status === 'C' && 'bg-green-500 '}
                                                                ${job.status === 'T' && 'bg-gray-600 '}
                                                                ${job.status === 'I' && 'bg-blue-500 '}
                                                                `}>
                                                    {job.status === 'C' && 'Completed'}
                                                    {job.status === 'T' && 'Canceled'}
                                                    {job.status === 'I' && 'Invoiced'}
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap px-8 py-2 text-xs text-gray-500">
                                                {!currentUser.isInternalCoordinator && (
                                                    <div className="flex gap-1">
                                                        {'$'}{job.price ? job.price.toLocaleString() : '0.00'}
                                                    </div>
                                                )}
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

                                {/* MOBILE */}
                                <div className="xs:block sm:block xl:hidden lg:hidden md:hidden overflow-hidden bg-white shadow sm:rounded-md mt-2 mb-4">
                                    <ul className="divide-y divide-gray-200">
                                        {jobs.map((job) => (
                                        <li key={job.id}>
                                            <div onClick={() => navigate(`/completed/review/${job.id}`)} className="block hover:bg-gray-50">
                                                <div className="flex items-center px-4 py-4 sm:px-6">
                                                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                                    <div className="w-full grid xl:grid-cols-2 lg:grid-cols-2 md-grid-cols-2 xs:grid-cols-1">
                                                        <div>
                                                        <div className="">
                                                            <span className="font-medium text-red-600 text-sm">{job.tailNumber}</span>
                                                            <span className="ml-2 text-sm text-gray-700">{job.purchase_order}</span>
                                                        </div>
                                                        
                                                        {!currentUser.isCustomer && (
                                                            <div className="text-sm text-gray-800 mt-2 flex gap-1">
                                                                <UserIcon className="h-4 w-4 text-gray-400" />{job.customer?.name}
                                                            </div>
                                                        )}

                                                        <div className="mt-2 text-sm text-gray-500 mb-1">
                                                            {job.airport.initials} - {job.fbo.name} - {job.aircraftType.name}
                                                        </div>
                                                        </div>
                                                        <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left">
                                                            <p className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                                                        ${job.status === 'C' && 'bg-green-500 '}
                                                                        ${job.status === 'T' && 'bg-gray-600 '}
                                                                        ${job.status === 'I' && 'bg-blue-500 '}
                                                                        `}>
                                                                {job.status === 'C' && 'Completed'}
                                                                {job.status === 'T' && 'Canceled'}
                                                                {job.status === 'I' && 'Invoiced'}
                                                            </p>
                                                            
                                                            <div className="text-sm text-gray-500 mt-2 flex justify-between gap-2">
                                                                <div>Completed on <span className="text-gray-700">{job.completion_date}</span></div>
                                                                {currentUser.canSeePrice && (
                                                                    <div className="text-right text-gray-900">${job.price?.toLocaleString()}</div>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-2">
                                                            
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div className="ml-5 flex-shrink-0">
                                                        <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        ))}
                                    </ul>
                                </div>

                                </>
                            )}
                        </div>
                    </div>
                </div>

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

            {isPriceBreakdownModalOpen && <JobPriceBreakdownModal
                                            isOpen={isPriceBreakdownModalOpen}
                                            jobDetails={selectedJob}
                                            handleClose={handleTogglePriceBreakdownModal} />}
            
        </AnimatedPage>
    )
}

export default CompleteList;