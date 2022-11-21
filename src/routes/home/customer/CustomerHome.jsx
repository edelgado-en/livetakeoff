import { useState, useEffect, Fragment } from 'react'
import { Listbox, Transition, Menu, Popover, Disclosure, Dialog } from '@headlessui/react'

import { useAppSelector } from "../../../app/hooks";
import { selectUser } from '../../userProfile/userSlice';
import { useNavigate, Link } from 'react-router-dom';  

import ReactTimeAgo from 'react-time-ago'

import Loader from '../../../components/loader/Loader';

import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon
} from '@heroicons/react/outline'

import { CheckIcon, PlusIcon } from '@heroicons/react/outline'

import * as api from './apiService'

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

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const RectangleStack = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
             className="w-5 h-5 text-gray-400">
            <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
        </svg>
    )
}

const CheckBadge = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
             className="w-5 h-5 text-gray-400">
          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>

    )
}

const sortOptions = [
  { id: 'requestDate', name: 'Request Date' },
  { id: 'completeBy', name: 'Complete By' },
  { id: 'arrivalDate', name: 'Arrival Date' },
]

const availableStatuses = [
  {id: 'All', name: 'All'},
  {id: 'O', name: 'All Open Jobs'},
  {id: 'U', name: 'Submitted'},
  {id: 'A', name: 'Accepted'},
  {id: 'S', name: 'Assigned'},
  {id: 'W', name: 'In Progress'},
  {id: 'R', name: 'Review'},
  {id: 'T', name: 'Canceled'},
  {id: 'C', name: 'Completed'},
  {id: 'I', name: 'Invoiced'},
]

const CustomerHome = () => {
    const [jobs, setJobs] = useState([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const [activities, setActivities] = useState([]);
    const [totalActivities, setTotalActivities] = useState(0);
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    
    const [searchText, setSearchText] = useState(localStorage.getItem('searchText') || '')
    const [statusSelected, setStatusSelected] = useState(JSON.parse(localStorage.getItem('statusSelected')) || availableStatuses[1])
    const [sortSelected, setSortSelected] = useState(sortOptions[0])
    const [airports, setAirports] = useState([])
    const [airportSelected, setAirportSelected] = useState(JSON.parse(localStorage.getItem('airportSelected')) || {id: 'All', name: 'All'})
    const [airportSearchTerm, setAirportSearchTerm] = useState('')

    const [isActivityOpen, setIsActivityOpen] = useState(false);
    
    const [open, setOpen] = useState(false)
    
    const [activeFilters, setActiveFilters] = useState([])
    
    const currentUser = useAppSelector(selectUser);
    
    const navigate = useNavigate();

    const filteredAirports = airportSearchTerm
    ? airports.filter((item) => item.name.toLowerCase().includes(airportSearchTerm.toLowerCase()))
    : airports;

    
    useEffect(() => {
      getJobActivities();
      getAirports();
    }, [])

    useEffect(() => {
      localStorage.setItem('searchText', searchText)
    
    }, [searchText])

    useEffect(() => {
      localStorage.setItem('statusSelected', JSON.stringify(statusSelected))
    
    }, [statusSelected])

    useEffect(() => {
      localStorage.setItem('airportSelected', JSON.stringify(airportSelected))
  
    }, [airportSelected])

    useEffect(() => {
      //Basic throttling
      let timeoutID = setTimeout(() => {
        searchJobs()
      }, 300);
  
      return () => {
        clearTimeout(timeoutID);
      };
  
    }, [searchText, statusSelected, sortSelected, airportSelected])

    const handleKeyDown = event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        
        searchJobs();
      }
    };

    const getAirports = async () => {
      const { data } = await api.getAirports()
  
      data.results.unshift({id: 'All', name: 'All'})
  
      setAirports(data.results)
    }

    const getJobActivities = async () => {
      setActivitiesLoading(true);  
      
      try {
        const { data } = await api.getJobActivities();

        setActivities(data.results);
        setTotalActivities(data.count);

        setActivitiesLoading(false);

      } catch (error) {
        setActivitiesLoading(false);
      }
    }

    const removeActiveFilter = (activeFilterId) => {
      if (activeFilterId === 'status') {
        setStatusSelected(availableStatuses[0])
      
      } else if (activeFilterId === 'searchText') {
        setSearchText('')
      
      } else if (activeFilterId === 'airport') {
        setAirportSelected({id: 'All', name: 'All'})
      }
  
      setActiveFilters(activeFilters.filter(filter => filter.id !== activeFilterId))
  
    }

    const searchJobs = async () => {
      setLoading(true)
      
      const request = {
        searchText: localStorage.getItem('searchText'),
        status: JSON.parse(localStorage.getItem('statusSelected')).id,
        sortField: sortSelected.id,
        airport: JSON.parse(localStorage.getItem('airportSelected')).id
      }
  
      let statusName;
  
      if (request.status === 'A') {
        statusName = "Accepted"
      } else if (request.status === 'S') {
        statusName = "Assigned"
      } else if (request.status === 'W') {
        statusName = "In Progress"
      } else if (request.status === 'U') {
        statusName  = "Submitted"
      } else if (request.status === 'R') {
        statusName = "Review"
      } else if (request.status === 'T') {
        statusName = "Canceled"
      } else if (request.status === 'I') {
        statusName = "Invoiced"
      } else if (request.status === 'C') {
        statusName = "Complete"
      } else if (request.status === 'O') {
        statusName = "All Open Jobs"
      }
  
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

      if (request.airport !== 'All') {
        activeFilters.push({
          id: 'airport',
          name: airportSelected.name,
        })
      }
  
      setActiveFilters(activeFilters)
  
      try {
          const { data } = await api.searchJobs(request);
  
          setJobs(data.results);
          setTotalJobs(data.count)

          setLoading(false);
  
      } catch (e) {
        setLoading(false)
      }
    }

    return (
        <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8 -mt-8 pb-32">
          {/* Left sidebar & main wrapper */}
          <div className="min-w-0 flex-1 bg-white xl:flex">
            {/* Account profile */}
            <div className="bg-white xl:w-64 xl:flex-shrink-0 xl:border-r xl:border-gray-200">
              <div className="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-8">
                    <div className="space-y-8 sm:flex sm:items-center sm:justify-between sm:space-y-0 xl:block xl:space-y-8">
                      {/* Profile */}
                      <Link to="/user-settings/profile" className="flex items-center space-x-3 cursor-pointer">
                        {currentUser.avatar ? 
                            <img
                            className="h-10 w-10 rounded-full"
                            src={currentUser.avatar}
                            alt=""
                          />
                            :
                            <div className="flex">
                              <span className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </span>
                            </div>
                        }
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {currentUser.first_name} {' '} {currentUser.last_name}
                          </div>
                          <div className="group flex items-center space-x-2.5">
                            <span className="text-sm font-medium text-gray-500 group-hover:text-gray-900">{currentUser.customerName}</span>
                          </div>
                        </div>
                      </Link>
                      {currentUser.isCustomer && (
                        <div className="flex flex-col sm:flex-row xl:flex-col">
                          <Link
                            to="/create-job"
                            className="inline-flex items-center justify-center rounded-md border
                                      border-transparent bg-red-600 px-4 py-2 text-sm font-medium
                                        text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2
                                        focus:ring-red-500 focus:ring-offset-2 xl:w-full"
                          >
                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                            New Job
                          </Link>
                        </div>
                      )}
                    </div>
                    {currentUser.isCustomer && (
                      <div className="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-6">
                        <div className="flex items-center space-x-2">
                          <CheckBadge />
                          <span className="text-sm font-medium text-gray-500">
                            {currentUser.isPremiumMember ? 'Premium Member' : 'On-Demand Member'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RectangleStack />
                          <span className="text-sm font-medium text-gray-500">{totalJobs} Jobs</span>
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white lg:min-w-0 lg:flex-1">
              <div className="border-b border-t border-gray-200 pl-4 pr-6 pt-4 pb-4 
                              sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-5">
                <div className="flex items-center">
                  <h1 className="flex-1 text-lg font-medium">Jobs</h1>
                  <div className="">
                    <button
                      type="button"
                      className="inline-block flex text-sm font-medium text-gray-500 hover:text-gray-900"
                      onClick={() => setOpen(true)}
                    >
                      Filters
                    </button>
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
                                <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                                  {({ open }) => (
                                    <>
                                      <h3 className="-mx-2 -my-3 flow-root">
                                        <Disclosure.Button className="flex w-full items-center justify-between
                                                                    bg-white px-2 py-3 text-sm text-gray-400">
                                          <span className="font-medium text-gray-900">Status</span>
                                          <span className="ml-6 flex items-center">
                                            <ChevronDownIcon
                                              className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Disclosure.Button>
                                      </h3>
                                      <Disclosure.Panel className="pt-6">
                                        <div className="space-y-6">
                                          <Listbox value={statusSelected} onChange={setStatusSelected}>
                                            {({ open }) => (
                                                <>
                                                <div className="relative">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-md 
                                                                                bg-white py-2 px-3 pr-8 text-left
                                                                                border border-gray-300
                                                                                shadow-sm focus:outline-none focus:shadow-outline-blue
                                                                                focus:border-blue-300
                                                                                text-xs">
                                                        <span className="block truncate">
                                                            {statusSelected ? statusSelected.name : 'Status'}
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
                                                        <Listbox.Options className="absolute left-0 z-10 mt-1 max-h-96 w-full overflow-auto
                                                                                    rounded-md bg-white py-1 shadow-lg ring-1 
                                                                                    ring-black ring-opacity-5 focus:outline-none text-xs">
                                                            {availableStatuses.map((status) => (
                                                                <Listbox.Option
                                                                    key={status.id}
                                                                    className={({ active }) =>
                                                                            classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                                    `${status.id === 'R' || status.id === 'All' ? 'border-b border-gray-200 mb-4' : ''} relative cursor-default select-none py-2 pl-3 pr-9`)}
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
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                                
                                <Disclosure as="div" className="border-t border-gray-200 px-4 py-6">
                                  {({ open }) => (
                                    <>
                                      <h3 className="-mx-2 -my-3 flow-root">
                                        <Disclosure.Button className="flex w-full items-center justify-between
                                                                    bg-white px-2 py-3 text-sm text-gray-400">
                                          <span className="font-medium text-gray-900">Airport</span>
                                          <span className="ml-6 flex items-center">
                                            <ChevronDownIcon
                                              className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </Disclosure.Button>
                                      </h3>
                                      <Disclosure.Panel className="pt-6">
                                        <div className="space-y-6">
                                        <Listbox value={airportSelected} onChange={setAirportSelected}>
                                            {({ open }) => (
                                                <>
                                                <div className="relative mt-1">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                                border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                                shadow-sm focus:border-sky-500 focus:outline-none
                                                                                focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                                        <span className="block truncate">
                                                            {airportSelected ? airportSelected.name : 'Select airport'}
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                        </span>
                                                    </Listbox.Button>

                                                    <Transition
                                                        show={open}
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0">
                                                        <Listbox.Options className="absolute z-10 mt-1 max-h-96 w-full overflow-auto
                                                                                    rounded-md bg-white py-1 text-base shadow-lg ring-1
                                                                                    ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                            <div className="relative">
                                                                <div className="sticky top-0 z-20  px-1">
                                                                    <div className="mt-1 block  items-center">
                                                                        <input
                                                                            type="text"
                                                                            name="search"
                                                                            id="search"
                                                                            value={airportSearchTerm}
                                                                            onChange={(e) => setAirportSearchTerm(e.target.value)}
                                                                            className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                                    focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                                    border-gray-300 rounded-md"
                                                                        />
                                                                        <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                            {airportSearchTerm && (
                                                                                <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                className="h-6 w-6 text-blue-500 font-bold mr-1"
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
                                                                                className="h-6 w-6 text-gray-500 mr-1"
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
                                                                                    'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                                    value={airport}>
                                                                    {({ selected, active }) => (
                                                                        <>
                                                                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                                {airport.name}
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
                                      </Disclosure.Panel>
                                    </>
                                  )}
                                </Disclosure>
                            </form>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </Dialog>
                   </Transition.Root>
                </div>
              </div>

              <div className="">
                <div className="w-full">
                <div className="relative border-b border-gray-200">
                  <div 
                    onClick={() => searchJobs()}
                    className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                    <MagnifyingGlassIcon 
                        className="h-4 w-4 text-gray-400 cursor-pointer"
                        aria-hidden="true" />
                        </div>
                        <input
                          type="search"
                          name="search"
                          id="search"
                          value={searchText}
                          onChange={event => setSearchText(event.target.value)}
                          onKeyDown={handleKeyDown}
                          className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                                  focus:ring-sky-500 text-sm"
                          placeholder="search by tail or P.O"
                        />
                    </div>
                  </div>
              </div>

              {activeFilters.length > 0 && (
                <div className="bg-gray-100">
                  <div className="mx-auto max-w-7xl py-2 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
                    <h3 className="text-xs font-medium text-gray-500">
                      Filters
                      <span className="sr-only">, active</span>
                    </h3>

                    <div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />

                    <div className="mt-2 sm:mt-0 sm:ml-4">
                      <div className="-m-1 flex flex-wrap items-center">
                        {activeFilters.map((activeFilter) => (
                          <span
                            onClick={() => removeActiveFilter(activeFilter.id)}
                            key={activeFilter.id}
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
                <div className="text-center py-24">
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
                  {currentUser.isCustomer && (
                    <>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new job.</p>
                      <div className="mt-6">
                        <Link
                          to="/create-job"
                          className="inline-flex items-center rounded-md border border-transparent
                                  bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                                    hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          New Job
                        </Link>
                      </div>  
                    </>
                  )}
                </div>
              )}

              {!loading && (
                <>
                  <ul role="list" className="divide-y divide-gray-200 border-b border-gray-200">
                    {jobs.map((job) => (
                      <li key={job.id}>
                      <Link to={`/jobs/${job.id}/details`} className="block hover:bg-gray-50">
                        <div className="flex items-center px-4 py-4 sm:px-6">
                          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                            <div className="w-full grid xl:grid-cols-2 lg:grid-cols-2 md-grid-cols-2 xs:grid-cols-1">
                              <div>
                                <div className="">
                                  <span className="font-medium text-red-600 text-sm">{job.tailNumber}</span>
                                  <span className="ml-2 text-sm text-gray-700">{job.purchase_order}</span>
                                </div>
  
                                <div className="mt-2 text-sm text-gray-500 mb-1">
                                  {job.airport.initials} - {job.fbo.name} - {job.aircraftType.name}
                                </div>
                              </div>
                              <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left">
                                  <p className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                                ${job.status === 'A' && 'bg-blue-400 '}
                                                ${job.status === 'S' && 'bg-yellow-500 '}
                                                ${job.status === 'U' && 'bg-indigo-500 '}
                                                ${job.status === 'W' && 'bg-green-500 '}
                                                ${job.status === 'C' && 'bg-green-500 '}
                                                ${job.status === 'T' && 'bg-gray-600 '}
                                                ${job.status === 'R' && 'bg-purple-500 '}
                                                ${job.status === 'I' && 'bg-blue-500 '}
                                              `}>
                                      {job.status === 'A' && 'Accepted'}
                                      {job.status === 'S' && 'Assigned'}
                                      {job.status === 'U' && 'Submitted'}
                                      {job.status === 'W' && 'In Progress'}
                                      {job.status === 'C' && 'Completed'}
                                      {job.status === 'T' && 'Canceled'}
                                      {job.status === 'R' && 'Review'}
                                      {job.status === 'I' && 'Invoiced'}
                                  </p>
                                  
                                  <div className="text-sm text-gray-500 mt-2">
                                    {(job.status === 'C' || job.status === 'I') ? (
                                      <span>Completed on <span className="text-gray-700">{job.completion_date}</span></span>
                                    )
                                      :
                                      (
                                        <span>Complete before {job.completeBy ? <span className="text-gray-700">{job.completeBy}</span>
                                        : 
                                          <span
                                            className="relative inline-flex items-center
                                                      rounded-full border border-gray-300 px-2 py-0.5 ml-2">
                                            <div className="absolute flex flex-shrink-0 items-center justify-center">
                                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                            </div>
                                            <div className="ml-3 text-xs text-gray-700">TBD</div>
                                          </span>}
                                        
                                        </span>
                                      )
                                    }
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
                  
                  {totalJobs > 10 && (
                    <div className="border-t border-gray-200 py-4 text-sm pl-8">
                        <Link to="/jobs" className="font-semibold text-red-600 hover:text-red-900">
                          View all jobs
                          <span aria-hidden="true"> &rarr;</span>
                        </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Activity feed */}
          {currentUser.isCustomer && (
            <div className={`${isActivityOpen ? 'bg-gray-50' : 'bg-white'} pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-l lg:border-gray-200 lg:pr-8 xl:pr-0`}>
              <div className="px-6 lg:w-80">
                <div onClick={() => setIsActivityOpen(!isActivityOpen)} className="cursor-pointer pt-6 pb-2 flex justify-between">
                  <h2 className="text-sm font-semibold text-gray-500 hover:text-gray-900">Recent Activity</h2>
                  <div className="relative" style={{ top: '2px'}}>
                    {isActivityOpen ? (
                      <ChevronUpIcon 
                      className="h-4 w-4 text-gray-400 cursor-pointer" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon 
                        className="h-4 w-4 text-gray-400 cursor-pointer" aria-hidden="true" />
                    ) }
                    
                  </div>
                </div>
                {isActivityOpen && (
                  <div>
                    {activitiesLoading && <Loader />}

                    {!activitiesLoading && totalActivities === 0 && (
                      <div className="text-center m-auto text-sm py-52">
                        <div className="font-medium text-gray-500">There is no activity yet.</div>
                        <div className="text-gray-500">When you request a job you will see the activity here.</div>
                      </div> 
                    )}

                    {!activitiesLoading && (
                        <ul role="list" className="divide-y divide-gray-200">
                            {activities.map((activity) => (
                              <li key={activity.id} className="py-4">
                                <div className="flex space-x-3">
                                  <img
                                    className="h-6 w-6 rounded-full"
                                    src={activity.user.profile.avatar}
                                    alt=""
                                  />
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-xs font-medium">
                                        {activity.user.id === currentUser.id ? 'You' : `${activity.user.first_name} ${activity.user.last_name}`}
                                      </h3>
                                      <p className="text-sm text-gray-500">
                                        <ReactTimeAgo date={new Date(activity.timestamp)} locale="en-US" timeStyle="twitter" />
                                      </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      <span>Job set to </span> 
                                      <span className="font-medium text-gray-500">
                                          {activity.status === 'A' && 'Accepted'}
                                          {activity.status === 'S' && 'Assigned'}
                                          {activity.status === 'U' && 'Submitted'}
                                          {activity.status === 'W' && 'In Progress'}
                                          {activity.status === 'C' && 'Completed'}
                                          {activity.status === 'T' && 'Canceled'}
                                          {activity.status === 'R' && 'Review'}
                                          {activity.status === 'I' && 'Invoiced'}
                                      </span> for  
                                      <span className="font-medium text-gray-500"> {activity.tailNumber}</span>
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                    )}

                    {/* TODO: Instead of View all activity. Add previous and next button so that you can paginate in place. */}
                    {/* {totalActivities > 0 && (
                      <div className="border-t border-gray-200 pb-4 pt-16 text-sm">
                        <div className="font-semibold text-red-600 hover:text-red-900">
                          View all activity
                          <span aria-hidden="true"> &rarr;</span>
                        </div>
                      </div>
                    )} */}
                  </div>
                )}
                
              </div>
            </div>
          )}
          
          
        </div>
    )
}

export default CustomerHome