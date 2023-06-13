import { useEffect, useState, Fragment } from "react"
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, CheckIcon, PlusIcon, MinusIcon, ShareIcon, CashIcon, ChevronUpIcon, ChevronDownIcon, XCircleIcon, CheckCircleIcon, ThumbUpIcon } from '@heroicons/react/outline'
import Loader from "../../../components/loader/Loader"
import { Dialog, Transition, Listbox } from '@headlessui/react'

import ReactTimeAgo from 'react-time-ago'

import AnimatedPage from "../../../components/animatedPage/AnimatedPage"

import JSZip from "jszip";
import { saveAs } from 'file-saver';

import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../userProfile/userSlice";

import Pagination from "react-js-pagination";

import * as api from './apiService'

const ArrowTopRightIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
    )
}

const XMarkIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    )
}

const MagnifyingGlassIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>

    )
}

const jobsByMonthData = [
    {
        month: 'Jan',
        job_count: 0,
    },
    {
        month: 'Feb',
        job_count: 0,
    },
    {
        month: 'March',
        job_count: 0,
    },
    {
        month: 'April',
        job_count: 0,
    },
    {
        month: 'May',
        job_count: 0,
    },
    {
        month: 'June',
        job_count: 0,
    },
    {
        month: 'July',
        job_count: 0,
    },
    {
        month: 'Aug',
        job_count: 0,
    },
    {
        month: 'Sept',
        job_count: 0,
    },
    {
        month: 'Oct',
        job_count: 0,
    },
    {
        month: 'Nov',
        job_count: 0,
    },
    {
        month: 'Dec',
        job_count: 0,
    },
];

const sortOptions = [
    /* { id: 'total_price_desc', name: 'Price (High to Low)' },
    { id: 'total_price_asc', name: 'Price (Low to High)' }, */
    { id: 'job_count_desc', name: 'Jobs (High to Low)' },
    { id: 'job_count_asc', name: 'Jobs (Low to High)' },
  ]

const BriefCaseIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>

    )
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const TailNumberReport = () => {
    const [loading, setLoading] = useState(true)
    const [tailStatsDetailsLoading, setTailStatsDetailsLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [sortSelected, setSortSelected] = useState(sortOptions[0])
    const [tailStats, setTailStats] = useState([])
    const [tailStatsDetails, setTailStatsDetails] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [totalTailStats, setTotalTailStats] = useState(0)
    const [searchText, setSearchText] = useState('')

    const [showRecentServices, setShowRecentServices] = useState(false)
    const [showRecentRetainers, setRecentRetainers] = useState(false)

    const [firstLoad, setFirstLoad] = useState(true)

    const navigate = useNavigate()

    const currentUser = useAppSelector(selectUser)

    useEffect(() => {
        //Basic throttling
      let timeoutID = setTimeout(() => {
        searchTailStats()
      }, 300);
  
      return () => {
        clearTimeout(timeoutID);
      };

    }, [searchText, currentPage, sortSelected])

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          
          searchTailStats();
        }
    }

    const searchTailStats = async () => {
        setLoading(true)

        const request = {
            'searchText': searchText,
            'sortSelected': sortSelected.id,
        }

        try {
            const { data } = await api.searchTailStats(request, 1)

            setTailStats(data.results);
            setTotalTailStats(data.count)

            setLoading(false)

            if (firstLoad && data.results.length > 0) {
                setFirstLoad(false)
                getTailStatsDetails(data.results[0])
            }

            if (data.results.length === 0) {
                setTailStatsDetailsLoading(false)
            }

        } catch (error) {
            setLoading(false)
        }
    }

    const getTailStatsDetails = async (tailStatsDetails) => {
        setTailStatsDetailsLoading(true)
        try {
            const response = await api.getTailStatsDetails(tailStatsDetails.tailNumber)
        
            setSidebarOpen(false)
            setShowRecentServices(false)
            setRecentRetainers(false)

            //TODO: in January get the data from jobs_by_year and add a dropdown to user can select a year: 2022 or 2023
            // and show the corresponding data for that year
            
            // first set all job_count to 0 for all months to reset
            jobsByMonthData.forEach((item, index) => {
                jobsByMonthData[index].job_count = 0
            })


            // update the jobsByMonthData array with the new data response.data.jobs_by_month by matching the requestDate
            jobsByMonthData.forEach((item, index) => {
                response.data.jobs_by_month.forEach((item2, index2) => {
                    if (item.month === item2.month) {
                        jobsByMonthData[index].job_count = item2.job_count
                    }
                })
            })

            setTailStatsDetails(response.data)

            setTailStatsDetailsLoading(false)

        } catch (error) {
            setTailStatsDetailsLoading(false)
            toast.error('Unable to load tail stats details')
        }
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const handleExport = () => {

    }

    const toggleRecentServices = () => {
        setShowRecentServices(!showRecentServices)
    }

    const toggleRecentRetainers = () => {
        setRecentRetainers(!showRecentRetainers)
    }

    const handleRedirectToJobsQueue = () => {
        //set the tailNumber in the localStorage and statusSelected to All
        localStorage.setItem('searchText', tailStatsDetails?.tailNumber)

        if (currentUser.isCustomer) {
            localStorage.setItem('statusSelected', JSON.stringify({id: 'All', name: 'All Open Jobs'},))

        } else {
            localStorage.setItem('statusSelected', JSON.stringify({id: 'O', name: 'All Open Jobs'},))
        }

        navigate('/jobs')
    }


    return (
        <AnimatedPage>
            {/* Side bar for mobile */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40 xl:hidden" onClose={setSidebarOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white focus:outline-none">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                                    <button
                                        type="button"
                                        className="ml-1 flex h-10 w-10 items-center justify-center rounded-full
                                                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white border-white"
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <span className="sr-only">Close sidebar</span>
                                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </button>
                                    </div>
                                </Transition.Child>
                                
                                <div className="flex-shrink-0 border-t border-gray-200 p-4">
                                    <div className="flex justify-between">
                                        <h2 className="text-2xl font-medium text-gray-900">Tail Numbers</h2>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600">Search list of {totalTailStats} tail numbers</p>
                                    <form className="mt-4 flex space-x-2" action="#">
                                        <div className="min-w-0 flex-1">
                                            <label htmlFor="search" className="sr-only">
                                                Search
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div 
                                                    onClick={() => searchTailStats()}
                                                    className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                                                    <MagnifyingGlassIcon 
                                                        className="h-5 w-5 text-gray-400 cursor-pointer"
                                                        aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="search"
                                                    name="search"
                                                    id="search"
                                                    value={searchText}
                                                    onChange={event => setSearchText(event.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                                            focus:ring-sky-500 text-sm"
                                                    placeholder="Search tail..."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                        <Listbox value={sortSelected} onChange={setSortSelected}>
                                            {({ open }) => (
                                                <>
                                                <div className="relative" style={{width: '75px'}}>
                                                    <Listbox.Button className="relative w-full cursor-default rounded-md 
                                                                                bg-white py-2 px-3 pr-8 text-left
                                                                                shadow-sm border border-gray-300  focus:ring-0 focus:outline-none
                                                                                text-xs" style={{paddingTop: '9px', paddingBottom: '9px', margintop: '4px'}}>
                                                        <span className="block truncate">
                                                            Sort
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                            <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                        </span>
                                                    </Listbox.Button>

                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0">
                                                        <Listbox.Options className="absolute left-0 z-10 mt-1 max-h-72 w-full overflow-auto w-40
                                                                                    rounded-md bg-white py-1 shadow-lg ring-1
                                                                                    ring-black ring-opacity-5 focus:outline-none text-xs">
                                                            {sortOptions.map((sort) => (
                                                                <Listbox.Option
                                                                    key={sort.id}
                                                                    className={({ active }) =>
                                                                            classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                                    'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                                    value={sort}>
                                                                    {({ selected, active }) => (
                                                                        <>
                                                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                                {sort.name}
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
                                    </form>
                                    
                                    {/* Directory list Mobile */}
                                    <nav className="min-h-0 flex-1 overflow-y-auto mt-5" style={{ height: '800px', paddingBottom: '250px' }}>
                                    
                                        {loading && <Loader /> }

                                        {!loading && totalTailStats === 0 && (
                                            <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                                            <p className="">No tails found.</p>
                                            </div>
                                        )}

                                        {!loading && (
                                            <ul role="list" className="relative z-0 divide-y divide-gray-200">
                                                {tailStats.map((tail, index) => (
                                                    <li key={index} onClick={() => getTailStatsDetails(tail)}>
                                                        <div className={`${tail.showDetails ? ' border-2 border-red-500' : ''}
                                                                        cursor-pointer relative flex justify-between space-x-3 xl:px-6 lg:px-6 md:px-6 sm:px-2 xs:px-2 pr-6 py-5 hover:bg-gray-50 text-sm`}>
                                                            <div className="">
                                                                <div className="font-medium text-gray-900">{tail.tailNumber}</div>
                                                                <div className="text-gray-500 mt-1">{tail.aircraftType__name}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                {currentUser.showSpendingInfo && currentUser.canSeePrice && (
                                                                    <div className="text-green-700 font-medium">${tail.total_price ? tail.total_price?.toLocaleString() : 0}</div>
                                                                )}
                                                                <div>{tail.job_count} <span className="text-gray-500">jobs</span></div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </nav> 

                                    {(!loading && totalTailStats > 20) && (
                                        <div className="">
                                            <div>
                                                <Pagination
                                                innerClass="pagination pagination-custom"
                                                activePage={currentPage}
                                                hideDisabled
                                                itemClass="page-item page-item-custom"
                                                linkClass="page-link page-link-custom"
                                                itemsCountPerPage={20}
                                                totalItemsCount={totalTailStats}
                                                pageRangeDisplayed={3}
                                                onChange={handlePageChange}
                                            /> 
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="w-14 flex-shrink-0" aria-hidden="true">
                            {/* Force sidebar to shrink to fit close icon */}
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden -mt-8">
                 <div className="relative z-0 flex flex-1 overflow-hidden">
                    <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last">
                        {/* Mobile only */}
                        <nav className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden" aria-label="Breadcrumb">
                            <div onClick={() => setSidebarOpen(true)} className="cursor-pointer inline-flex items-center space-x-3 text-sm font-medium text-gray-900">
                                <ChevronLeftIcon className="-ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                <span>Tail Numbers</span>
                            </div>
                        </nav>
                                
                        <article className="m-auto max-w-6xl px-6">
                            <div className="flex flex-wrap justify-between text-sm pt-6 border-b border-gray-200">
                                <div className="pb-4">
                                    <span className="text-2xl font-semibold text-gray-700">Tail Report</span>
                                </div>
                                <div>
                                    {/* <button
                                        type="button"
                                        disabled={loading || tailStatsDetailsLoading}
                                        onClick={() => handleExport()}
                                        className="inline-flex justify-center rounded-md border border-gray-300
                                                 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
                                                  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900
                                                   focus:ring-offset-2"
                                    >
                                        <ShareIcon className="h-4 w-4 mr-1 relative" style={{top: '2px'}}/> {loading ? '...' : 'Export'}
                                    </button> */}
                                </div>
                            </div>

                            {tailStatsDetailsLoading && <Loader />}

                            {(!tailStatsDetailsLoading && !tailStatsDetails) && (
                                <div className="mt-20 m-auto text-center">No tail selected.</div>
                            )}

                            {(!tailStatsDetailsLoading && tailStatsDetails) &&(
                                <div className="flex-1">
                                    <div className="py-4 xl:py-6">
                                    <div className="xl:grid xl:max-w-5xl xl:grid-cols-3">
                                        <div className="xl:col-span-2 xl:border-r xl:border-gray-200 xl:pr-8">
                                            <div>
                                                <div>
                                                    <div className="md:flex md:items-center md:justify-between gap-8 xl:space-x-4 xl:border-b xl:pb-6">
                                                        <div className="flex gap-4">
                                                            <h1 className="text-2xl font-bold text-gray-900">{tailStatsDetails?.tailNumber}</h1>
                                                            <span className="text-gray-500 relative whitespace-nowrap" style={{top: '6px'}}>{tailStatsDetails?.aircraft_type.name}</span>
                                                        </div>
                                                        <div className="mt-2 text-sm text-gray-500">
                                                            {tailStatsDetails?.customer.name}
                                                        </div>
                                                    </div>
                                                    {/* Mobile */}
                                                    <aside className="mt-8 xl:hidden">
                                                        <h2 className="sr-only">Details</h2>
                                                        <div className="space-y-5">
                                                            {currentUser.showSpendingInfo && currentUser.canSeePrice && (
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-6">
                                                                        <CashIcon className="h-6 w-6 text-green-700" />
                                                                    </div>
                                                                    <span className="text-sm font-medium text-green-700">${tailStatsDetails?.total_price.toLocaleString()}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-6">
                                                                    <BriefCaseIcon className="h-6 w-6 text-gray-500"/>
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-900">{tailStatsDetails?.total_jobs.toLocaleString()} total <span className="text-gray-500">job(s)</span></span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-6">
                                                                    <CheckCircleIcon className="h-6 w-6 text-gray-500"/>
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-900">{tailStatsDetails?.total_invoiced_jobs.toLocaleString()} invoiced <span className="text-gray-500">job(s)</span></span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-6">
                                                                    <ThumbUpIcon className="h-6 w-6 text-gray-500"/>
                                                                </div>
                                                                <span className="text-sm font-medium text-gray-900">{tailStatsDetails?.total_completed_jobs.toLocaleString()} completed <span className="text-gray-500">job(s)</span></span>
                                                            </div>
                                                            {!currentUser.isCustomer && (
                                                                <div className="flex items-center space-x-2">
                                                                    <div className="w-6">
                                                                        <XCircleIcon className="h-6 w-6 text-gray-500"/>
                                                                    </div>
                                                                    <span className="text-sm font-medium text-gray-900">{tailStatsDetails?.total_canceled_jobs.toLocaleString()} canceled <span className="text-gray-500">job(s)</span></span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center space-x-2 " onClick={() => handleRedirectToJobsQueue()}>
                                                                <div className="w-6">
                                                                    <ArrowTopRightIcon className="h-6 w-6 text-gray-500"/>
                                                                </div>
                                                                <span className={`text-sm font-medium ${tailStatsDetails?.total_open_jobs > 0 ? 'text-blue-600 underline' : 'text-gray-900'} `}>
                                                                    {tailStatsDetails?.total_open_jobs.toLocaleString()} open <span className={`${tailStatsDetails?.total_open_jobs > 0 ? 'text-blue-600' : 'text-gray-500'}`}>job(s)</span>
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-sm font-medium text-gray-900">
                                                                {tailStatsDetails?.first_job_date && (
                                                                    <>
                                                                        Since <ReactTimeAgo date={new Date(tailStatsDetails?.first_job_date[0].requestDate)} locale="en-US" timeStyle="twitter" /> 
                                                                    </>
                                                                )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-6 space-y-8 border-t border-gray-200 py-6 pb-8">
                                                            <div>
                                                                <h2 className="text-md font-medium text-gray-500">Team</h2>
                                                                
                                                                {tailStatsDetails?.project_manager_stats?.length === 0 && (
                                                                    <div className="text-center text-sm text-gray-500 pt-10">No completed jobs found</div>    
                                                                )}

                                                                <ul role="list" className="mt-3 space-y-3">
                                                                    {tailStatsDetails?.project_manager_stats?.map((user, index) => (
                                                                        <li key={index} className="">
                                                                            <div className="flex gap-2 text-sm">
                                                                                <div className="flex-shrink-0">
                                                                                    <img
                                                                                        className="h-8 w-8 rounded-full"
                                                                                        src={'https://res.cloudinary.com/datidxeqm/image/upload/v1/' + user.user__profile__avatar}
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                                <div className="text-sm font-medium text-gray-900 relative top-1">{user.user__first_name} {' '} {user.user__last_name}</div>
                                                                                <div className="text-gray-500 relative top-1 text-right flex-1">{user.job_count} job(s) completed</div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-8 border-t border-b border-gray-200 py-6 pb-8">
                                                            <div>
                                                                <h2 className="text-md font-medium text-gray-500">Airports</h2>
                                                                {tailStatsDetails?.airport_stats?.length === 0 && (
                                                                    <div className="text-center text-sm text-gray-500 pt-10">No airports found</div>    
                                                                )}

                                                                <ul role="list" className="mt-3 space-y-3">
                                                                    {tailStatsDetails?.airport_stats?.map((airport, index) => (
                                                                        <li key={index} className="">
                                                                            <div className="flex gap-6 text-sm">
                                                                                <div className="text-sm font-medium text-gray-900 relative top-1 w-60 truncate overflow-ellipsis py-2">{airport.airport__name}</div>
                                                                                <div className="text-gray-500 relative top-1 text-right flex-1 py-2">{airport.job_count} job(s)</div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </aside>
                                                    <div className="space-y-8 border-t border-b border-gray-200 py-6">
                                                        <div>
                                                            <h2 className="text-md font-medium text-gray-900">All Services Performed</h2>
                                                            {tailStatsDetails?.service_stats?.length === 0 && (
                                                                <div className="text-center text-sm text-gray-500 pt-10">No services found</div>    
                                                            )}

                                                            <ul role="list" className="mt-3 space-y-3">
                                                                {tailStatsDetails?.service_stats?.map((service, index) => (
                                                                    <li key={index} className="hover:bg-gray-50 rounded-md">
                                                                        <div className="flex gap-6 text-sm">
                                                                            <div className="text-sm text-gray-900 relative top-1 w-60 truncate overflow-ellipsis py-2">{service.service__name}</div>
                                                                            <div className="text-gray-500 relative top-1 text-right flex-1 py-2">{service.services_count.toLocaleString()} time(s)</div>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            {tailStatsDetails?.service_stats?.length > 0 && (
                                                                <div onClick={() => toggleRecentServices()} className="flex gap-2 justify-end text-sm pt-6 text-red-600 hover:text-red-900 cursor-pointer text-right">
                                                                    {showRecentServices ? 'Hide Recent Services' : 'Show Recent Services'}
                                                                    {showRecentServices ? <ChevronUpIcon className="h-4 w-4 relative" style={{top: '2px'}}/> : <ChevronDownIcon className="h-4 w-4 relative" style={{top: '2px'}}/>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {showRecentServices && (
                                                        <div className="space-y-8 border-t border-b border-gray-200 py-6 pb-8">
                                                            <div>
                                                                <h2 className="text-md font-medium text-gray-900">Recent Services</h2>
                                                                <ul className="mt-3 space-y-3">
                                                                    {tailStatsDetails?.recent_services?.map((service, index) => (
                                                                        <li key={index} className="hover:bg-gray-50 rounded-md">
                                                                            <div className="flex gap-6 text-sm">
                                                                                <div className="text-sm text-gray-900 relative top-1 w-60 truncate overflow-ellipsis py-2">{service.service__name}</div>
                                                                                <div className="text-gray-500 relative top-1 text-right flex-1 py-2"><ReactTimeAgo date={new Date(service.timestamp)} locale="en-US" timeStyle="twitter" /></div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>    
                                                    )}
                                                    
                                                    <div className="space-y-8 border-t border-b border-gray-200 py-6">
                                                        <div>
                                                            <h2 className="text-md font-medium text-gray-900">All Retainers Performed</h2>
                                                            
                                                            {tailStatsDetails?.retainer_service_stats?.length === 0 && (
                                                                <div className="text-center text-sm text-gray-500 pt-10">No retainers found</div>    
                                                            )}

                                                            <ul role="list" className="mt-3 space-y-3">
                                                                {tailStatsDetails?.retainer_service_stats?.map((retainer_service, index) => (
                                                                    <li key={index} className="hover:bg-gray-50 rounded-md">
                                                                        <div className="flex gap-6 text-sm">
                                                                            <div className="text-sm text-gray-900 relative top-1 w-60 truncate overflow-ellipsis py-2">{retainer_service.retainer_service__name}</div>
                                                                            <div className="text-gray-500 relative top-1 text-right flex-1 py-2">{retainer_service.services_count.toLocaleString()} time(s)</div>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        {tailStatsDetails?.retainer_service_stats?.length > 0 && (
                                                            <div onClick={() => toggleRecentRetainers()} className="flex gap-2 justify-end text-sm text-red-600 hover:text-red-900 cursor-pointer text-right">
                                                                {showRecentRetainers ? 'Hide Recent Retainers' : 'Show Recent Retainers'}
                                                                {showRecentRetainers ? <ChevronUpIcon className="h-4 w-4 relative" style={{top: '2px'}}/> : <ChevronDownIcon className="h-4 w-4 relative" style={{top: '2px'}}/>}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {showRecentRetainers && (
                                                        <div className="space-y-8 border-t border-b border-gray-200 py-6 pb-8">
                                                            <div className="">
                                                                <h2 className="text-md font-medium text-gray-900">Recent Retainers</h2>
                                                                <ul className="mt-3 space-y-3">
                                                                    {tailStatsDetails?.recent_retainer_services?.map((retainer, index) => (
                                                                        <li key={index} className="hover:bg-gray-50 rounded-md">
                                                                            <div className="flex gap-6 text-sm">
                                                                                <div className="text-sm text-gray-900 relative top-1 w-60 truncate overflow-ellipsis py-2">{retainer.retainer_service__name}</div>
                                                                                <div className="text-gray-500 relative top-1 text-right flex-1 py-2"><ReactTimeAgo date={new Date(retainer.timestamp)} locale="en-US" timeStyle="twitter" /></div>
                                                                            </div>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>    
                                                    )}
                                                    
                                                </div>
                                            </div>
                                            {/* Desktop */}
                                            <section className="hidden xl:block lg:block md:block mt-8 xl:mt-10">
                                                <div className="divide-y divide-gray-200">
                                                    <div className="pb-4">
                                                        <h2 id="activity-title" className="text-lg font-medium text-gray-900">
                                                            Jobs Completed by Month
                                                        </h2>
                                                    </div>
                                                    <div>
                                                        <ResponsiveContainer width={"100%"} height={400}>
                                                            <BarChart
                                                            width={600}
                                                            height={400}
                                                            data={jobsByMonthData}
                                                            margin={{
                                                                top: 20,
                                                                right: 1,
                                                                left: 1,
                                                                bottom: 5,
                                                            }}
                                                            >
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="month" />
                                                            <YAxis />
                                                            <Tooltip />
                                                            <Legend />
                                                            <Bar dataKey="job_count" stackId="a" fill="#83a6ed" />
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>
                                            </section> 

                                            <section aria-labelledby="activity-title" className="mt-8 xl:mt-10 pb-20">
                                                <div>
                                                    <div className="divide-y divide-gray-200">
                                                        <div className="pb-4">
                                                            <h2 id="activity-title" className="text-md font-medium text-gray-900">
                                                                Recent Activity
                                                            </h2>
                                                        </div>
                                                        <div className="pt-6">
                                                            {tailStatsDetails?.recent_activity?.length === 0 && (
                                                                <div className="text-center text-gray-500 pt-10">No recent activity found</div>
                                                            )}

                                                            <ul className="-mb-8">
                                                                {tailStatsDetails?.recent_activity.map((activity, eventIdx) => (
                                                                    <li key={activity.id}>
                                                                        <div className="relative pb-8">
                                                                        {eventIdx !== tailStatsDetails.recent_activity.length - 1 ? (
                                                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                                                        ) : null}
                                                                        
                                                                        <div className="relative flex space-x-3">
                                                                            <div>
                                                                            <span
                                                                                className={`
                                                                                ${activity.status === 'A' && 'bg-sky-500 '}
                                                                                ${activity.status === 'S' && 'bg-yellow-500 '}
                                                                                ${activity.status === 'U' && 'bg-indigo-500 '}
                                                                                ${activity.status === 'W' && 'bg-green-500 '}
                                                                                ${activity.status === 'R' && 'bg-purple-500 '}
                                                                                ${activity.status === 'C' && 'bg-blue-500 '}
                                                                                ${activity.status === 'T' && 'bg-gray-600 '}
                                                                                ${activity.status === 'I' && 'bg-blue-700 '}
                                                                                ${activity.status === 'P' && 'bg-red-500 '}
                                                                                h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`
                                                                                }
                                                                            >
                                                                                <span className="text-white">{activity.status}</span>
                                                                            </span>
                                                                            </div>
                                                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                                            <div>
                                                                                <p className="text-sm text-gray-500">
                                                                                {activity.status !== 'P' && (
                                                                                    <>
                                                                                    <span>Status changed to </span> 
                                                                                    <span className="font-medium text-black">
                                                                                        {activity.status === 'A' && 'Accepted'}
                                                                                        {activity.status === 'S' && 'Assigned'}
                                                                                        {activity.status === 'U' && 'Submitted'}
                                                                                        {activity.status === 'W' && 'Work In Progress'}
                                                                                        {activity.status === 'C' && 'Completed'}
                                                                                        {activity.status === 'T' && 'Canceled'}
                                                                                        {activity.status === 'R' && 'Review'}
                                                                                        {activity.status === 'I' && 'Invoiced'}
                                                                                    </span>
                                                                                    </>
                                                                                )}


                                                                                {activity.status === 'P' && currentUser.showSpendingInfo && currentUser.canSeePrice && (
                                                                                    <>
                                                                                    <span className="text-sm text-gray-500">
                                                                                        Price changed to
                                                                                    </span>
                                                                                    <span className="font-medium text-black ml-1">${activity.price}</span>
                                                                                    </>
                                                                                )}
                                                                                
                                                                                <span className="ml-1">by {activity.user.first_name} {activity.user.last_name}</span>
                                                                                </p>
                                                                            </div>
                                                                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                                                                <ReactTimeAgo date={new Date(activity.timestamp)} locale="en-US" timeStyle="twitter" />
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                        </div>
                                                                    </li>
                                                                
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>

                                        {/* Desktop */}
                                        <aside className="hidden xl:block xl:pl-8">
                                            <div className="space-y-5">
                                                {currentUser.showSpendingInfo && currentUser.canSeePrice && (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6">
                                                            <CashIcon className="h-6 w-6 text-green-700" />
                                                        </div>
                                                        <span className="text-sm font-medium text-green-700">${tailStatsDetails?.total_price.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6">
                                                        <BriefCaseIcon className="h-6 w-6 text-gray-500"/>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{tailStatsDetails?.total_jobs.toLocaleString()} total <span className="text-gray-500">job(s)</span></span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6">
                                                        <CheckCircleIcon className="h-6 w-6 text-gray-500"/>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{tailStatsDetails?.total_invoiced_jobs.toLocaleString()} invoiced <span className="text-gray-500">job(s)</span></span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-6">
                                                        <ThumbUpIcon className="h-6 w-6 text-gray-500"/>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{tailStatsDetails?.total_completed_jobs.toLocaleString()} completed <span className="text-gray-500">job(s)</span></span>
                                                </div>
                                                {!currentUser.isCustomer && (
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-6">
                                                            <XCircleIcon className="h-6 w-6 text-gray-500"/>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900">{tailStatsDetails?.total_canceled_jobs.toLocaleString()} canceled <span className="text-gray-500">job(s)</span></span>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleRedirectToJobsQueue()}>
                                                    <div className="w-6">
                                                        <ArrowTopRightIcon className="h-6 w-6 text-gray-500"/>
                                                    </div>
                                                    <span className={`text-sm font-medium ${tailStatsDetails?.total_open_jobs > 0 ? 'text-blue-600 underline' : 'text-gray-900'} `}>
                                                        {tailStatsDetails?.total_open_jobs.toLocaleString()} open <span className={`${tailStatsDetails?.total_open_jobs > 0 ? 'text-blue-600' : 'text-gray-500'}`}>job(s)</span>
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {tailStatsDetails?.first_job_date && (
                                                            <>
                                                                Since <ReactTimeAgo date={new Date(tailStatsDetails?.first_job_date[0].requestDate)} locale="en-US" timeStyle="twitter" /> 
                                                            </>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-6 space-y-8 border-t border-gray-200 py-6">
                                                <div>
                                                    <h2 className="text-md font-medium text-gray-500">Team</h2>
                                                    
                                                    {tailStatsDetails?.project_manager_stats?.length === 0 && (
                                                        <div className="text-center text-sm text-gray-500 pt-10">No completed jobs found</div>    
                                                    )}

                                                    <ul role="list" className="mt-3 space-y-3">
                                                        {tailStatsDetails?.project_manager_stats?.map((user, index) => (
                                                            <li key={index} className="">
                                                                <div className="flex gap-2 text-sm">
                                                                    <div className="flex-shrink-0">
                                                                        <img
                                                                            className="h-8 w-8 rounded-full"
                                                                            src={'https://res.cloudinary.com/datidxeqm/image/upload/v1/' + user.user__profile__avatar}
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                    <div className="text-sm font-medium text-gray-900 relative top-1">{user.user__first_name} {' '} {user.user__last_name}</div>
                                                                    <div className="text-gray-500 relative top-1 flex-1 text-right">{user.job_count} job(s) completed</div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="space-y-8 border-t border-gray-200 py-6">
                                                <div>
                                                    <h2 className="text-md font-medium text-gray-500">Airports</h2>
                                                    {tailStatsDetails?.airport_stats?.length === 0 && (
                                                        <div className="text-center text-sm text-gray-500 pt-10">No airports found</div>    
                                                    )}

                                                    <ul role="list" className="mt-3 space-y-3">
                                                        {tailStatsDetails?.airport_stats?.map((airport, index) => (
                                                            <li key={index} className="">
                                                                <div className="flex gap-6 text-sm">
                                                                    <div className="text-sm font-medium text-gray-900 relative top-1 w-52 truncate overflow-ellipsis py-2">{airport.airport__name}</div>
                                                                    <div className="text-gray-500 relative top-1 text-right flex-1 py-2">{airport.job_count.toLocaleString()} job(s)</div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </aside>
                                    </div>
                                    </div>
                                </div>
                            )}

                        </article>
                    </main>
                    <aside className="hidden w-72 flex-shrink-0 border-r border-gray-200 xl:order-first xl:flex xl:flex-col">
                        <div className="px-4 pt-6">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-medium text-gray-900">Tail Numbers</h2>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">Search list of {totalTailStats} tail numbers</p>
                            <form className="mt-6 flex space-x-2" action="#">
                                <div className="min-w-0 flex-1">
                                    <label htmlFor="search" className="sr-only">
                                        Search
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div 
                                            onClick={() => searchTailStats()}
                                            className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                                            <MagnifyingGlassIcon 
                                                className="h-5 w-5 text-gray-400 cursor-pointer"
                                                aria-hidden="true" />
                                        </div>
                                        <input
                                            type="search"
                                            name="search"
                                            id="search"
                                            value={searchText}
                                            onChange={event => setSearchText(event.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                                                    focus:ring-sky-500 text-sm"
                                            placeholder="Search tail..."
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Listbox value={sortSelected} onChange={setSortSelected}>
                                        {({ open }) => (
                                            <>
                                            <div className="relative" style={{width: '75px'}}>
                                                <Listbox.Button className="relative w-full cursor-default rounded-md 
                                                                            bg-white py-2 px-3 text-left
                                                                            shadow-sm border border-gray-300  focus:ring-0 focus:outline-none
                                                                            text-xs" style={{marginTop: '2px'}}>
                                                    <span className="block truncate">
                                                        Sort
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                        <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                                                    </span>
                                                </Listbox.Button>

                                                <Transition
                                                    show={open}
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0">
                                                    <Listbox.Options className="absolute left-0 z-10 mt-1 max-h-72 w-full overflow-auto w-40
                                                                                rounded-md bg-white py-1 shadow-lg ring-1
                                                                                ring-black ring-opacity-5 focus:outline-none text-xs">
                                                        {sortOptions.map((sort) => (
                                                            <Listbox.Option
                                                                key={sort.id}
                                                                className={({ active }) =>
                                                                        classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                                'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                                value={sort}>
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                            {sort.name}
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
                            </form>
                        </div>
                        

                        <nav className="min-h-0 flex-1 overflow-y-auto">
                            {loading && <Loader />}

                            {!loading && totalTailStats === 0 && (
                            <div className="text-gray-500 text-sm flex flex-col mt-20 text-center">
                                <p className="">No tails found.</p>
                            </div>
                            )}

                            {!loading && (
                                <ul role="list" className="relative z-0 divide-y divide-gray-200">
                                    {tailStats.map((tail, index) => (
                                        <li key={index} onClick={() => getTailStatsDetails(tail)}>
                                            <div className={`${tail.showDetails ? ' border-2 border-red-500' : ''}
                                                                            cursor-pointer relative flex justify-between space-x-3 xl:px-6 lg:px-6 md:px-6 sm:px-2 xs:px-2 pr-6 py-5 hover:bg-gray-50 text-sm`}>
                                                <div className="">
                                                    <div className="font-medium text-gray-900">{tail.tailNumber}</div>
                                                    <div className="text-gray-500 mt-1">{tail.aircraftType__name}</div>
                                                </div>
                                                <div className="text-right">
                                                    {currentUser.showSpendingInfo && currentUser.canSeePrice && (
                                                        <div className="text-green-700 font-medium">${tail.total_price ? tail.total_price?.toLocaleString() : 0}</div>
                                                    )}
                                                    <div>{tail?.job_count?.toLocaleString()} <span className="text-gray-500">jobs</span></div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                        </nav>
                    </aside>
                 </div>
            </div>

        </AnimatedPage>
    )
}

export default TailNumberReport