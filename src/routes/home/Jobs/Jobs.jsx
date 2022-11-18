/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom"
import { useEffect, useState, Fragment } from "react";
import { TrashIcon, ChevronRightIcon, PlusIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { Listbox, Transition, Menu, Popover, Disclosure, Dialog } from '@headlessui/react'
import { UserIcon } from "@heroicons/react/solid";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../userProfile/userSlice";
import Loader from "../../../components/loader/Loader";
import AnimatedPage from "../../../components/animatedPage/AnimatedPage";
import * as api from './apiService'

import * as customerApi from '../../customers/apiService'

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

const availableStatuses = [
  {id: 'All', name: 'All'},
  {id: 'A', name: 'Accepted'},
  {id: 'S', name: 'Assigned'},
  {id: 'W', name: 'In Progress'},
  {id: 'U', name: 'Submitted'},
  {id: 'R', name: 'Review'},
]

const sortOptions = [
  { id: 'requestDate', name: 'Request Date' },
  { id: 'completeBy', name: 'Complete By' },
  { id: 'arrivalDate', name: 'Arrival Date' },
]

const JobsQueue = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchText, setSearchText] = useState(localStorage.getItem('searchText') || '')
  const currentUser = useAppSelector(selectUser)
  const [statusSelected, setStatusSelected] = useState(JSON.parse(localStorage.getItem('statusSelected')) || availableStatuses[1])
  const [sortSelected, setSortSelected] = useState(sortOptions[0])
  const [open, setOpen] = useState(false)

  const [activeFilters, setActiveFilters] = useState([])
  const [customers, setCustomers] = useState([])

  const [airports, setAirports] = useState([])
  const [airportSelected, setAirportSelected] = useState(JSON.parse(localStorage.getItem('airportSelected')) || {id: 'All', name: 'All'})
  const [airportSearchTerm, setAirportSearchTerm] = useState('')

  const [customerSelected, setCustomerSelected] = useState(JSON.parse(localStorage.getItem('customerSelected')) || {id: 'All', name: 'All'})
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')

  const filteredCustomers = customerSearchTerm
    ? customers.filter((item) => item.name.toLowerCase().includes(customerSearchTerm.toLowerCase()))
    : customers;

  const filteredAirports = airportSearchTerm
    ? airports.filter((item) => item.name.toLowerCase().includes(airportSearchTerm.toLowerCase()))
    : airports;

  useEffect(() => {
    getCustomers();
    getAirports();
  }, [])

  const getCustomers = async () => {
      const request = {
        name: '',
      } 

      const { data } = await customerApi.getCustomers(request);

      data.results.unshift({id: 'All', name: 'All'})
      
      setCustomers(data.results)
  }

  const getAirports = async () => {
    const { data } = await customerApi.getAirports()

    data.results.unshift({id: 'All', name: 'All'})

    setAirports(data.results)
  }

  
  useEffect(() => {
    localStorage.setItem('searchText', searchText)
  
  }, [searchText])

  
  useEffect(() => {
    localStorage.setItem('statusSelected', JSON.stringify(statusSelected))
  
  }, [statusSelected])

  useEffect(() => {
    localStorage.setItem('customerSelected', JSON.stringify(customerSelected))

  }, [customerSelected])

  useEffect(() => {
    localStorage.setItem('airportSelected', JSON.stringify(airportSelected))

  }, [airportSelected])

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      fetchJobs()
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };

  }, [searchText, statusSelected, sortSelected, customerSelected, airportSelected])

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      
      fetchJobs();
    }
  };

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

  const fetchJobs = async () => {
    setLoading(true)
    
    const request = {
      searchText: localStorage.getItem('searchText'),
      status: JSON.parse(localStorage.getItem('statusSelected')).id,
      sortField: sortSelected.id,
      customer: JSON.parse(localStorage.getItem('customerSelected')).id,
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
        const { data } = await api.getJobs(request);

        const jobs = []
        
        data.results.forEach((job) => {
            let uniqueUserIds = []
            const uniqueUsers = []
            
            job.job_service_assignments?.forEach((assignment) => {
              const userId = assignment.project_manager?.id 
              if (userId != null) {
                if (!uniqueUserIds.includes(userId)) {
                    uniqueUserIds.push(userId)
                    uniqueUsers.push(assignment.project_manager)
                } 
              }
            })

            job.job_retainer_service_assignments?.forEach((assignment) => {
              const userId = assignment.project_manager?.id 
              if (userId != null) {
                if (!uniqueUserIds.includes(userId)) {
                    uniqueUserIds.push(userId)
                    uniqueUsers.push(assignment.project_manager)
                } 
              }
            })

            job.asignees = uniqueUsers;

            jobs.push(job)
        })

        setJobs(jobs);
        setTotalJobs(data.count)

    } catch (e) {
      setJobs([])
    }

    setLoading(false)
  }

    return (
      <AnimatedPage>
        <div className="xl:px-16 px-4 m-auto max-w-5xl -mt-3">
          <div className="grid grid-cols-2">
            <div className="">
              <h1 className="text-2xl font-semibold text-gray-600">Jobs Queue</h1>
              <p className="mt-1 text-sm text-gray-500">
                Total jobs: <span className="text-gray-900">{jobs.length}</span>
              </p>
            </div>
            <div className="text-right">
            {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) && (
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

          {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) && (
            <>
            {/* Mobile filter dialog */}
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
                                    <span className="font-medium text-gray-900">Customer</span>
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
                                    <Listbox value={customerSelected} onChange={setCustomerSelected}>
                                        {({ open }) => (
                                            <>
                                            <div className="relative mt-1">
                                                <Listbox.Button className="relative w-full cursor-default rounded-md border
                                                                            border-gray-300 bg-white py-2 pl-3 pr-10 text-left
                                                                            shadow-sm focus:border-sky-500 focus:outline-none
                                                                            focus:ring-1 focus:ring-sky-500 sm:text-sm">
                                                    <span className="block truncate">
                                                        {customerSelected ? customerSelected.name : 'Select customer'}
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                      <ChevronDownIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
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
                                                                        value={customerSearchTerm}
                                                                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                                                        className="shadow-sm border px-2 bg-gray-50 focus:ring-sky-500
                                                                                focus:border-sky-500 block w-full py-2 pr-12 font-bold sm:text-sm
                                                                                border-gray-300 rounded-md"
                                                                    />
                                                                    <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
                                                                        {customerSearchTerm && (
                                                                            <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="h-6 w-6 text-blue-500 font-bold mr-1"
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
                                                        {filteredCustomers.map((customer) => (
                                                            <Listbox.Option
                                                                key={customer.id}
                                                                className={({ active }) =>
                                                                        classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                                'relative cursor-default select-none py-2 pl-3 pr-9')}
                                                                value={customer}>
                                                                {({ selected, active }) => (
                                                                    <>
                                                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                                                            {customer.name}
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
            <div className="mt-2">
              <div className="max-w-sm">
                <div className="relative rounded-md shadow-sm">
                  <div 
                    onClick={() => fetchJobs()}
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
                    className="block w-full rounded-md border-gray-300 pl-10 focus:border-sky-500
                            focus:ring-sky-500 text-xs"
                    placeholder="search by tail or P.O..."
                  />
                </div>
              </div>
              
            </div>
            <div className="flex items-center justify-between pt-3 pb-1">
            <Listbox value={sortSelected} onChange={setSortSelected}>
                {({ open }) => (
                    <>
                    <div className="relative" style={{width: '130px'}}>
                        <Listbox.Button className="relative w-full cursor-default rounded-md 
                                                      bg-white py-2 px-3 pr-8 text-left
                                                    shadow-sm border-transparent focus:border-transparent focus:ring-0 focus:outline-none
                                                    text-xs">
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
                            <Listbox.Options className="absolute left-0 z-10 mt-1 max-h-72 w-full overflow-auto
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
                  <div className="">
                    <button
                    type="button"
                    className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900"
                    onClick={() => setOpen(true)}
                  >
                    Filters
                  </button>
              </div>
            </div>
            {/* Active filters */}
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
                          key={activeFilter.id}
                          className="m-1 inline-flex items-center rounded-full
                                     border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-xs font-medium text-gray-900"
                        >
                          <span>{activeFilter.name}</span>
                          <button
                            type="button"
                            className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                          >
                            <span className="sr-only">Remove filter for {activeFilter.name}</span>
                            <svg onClick={() => removeActiveFilter(activeFilter.id)} className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
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
              
            </>  
          )}

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
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new job.</p>
                  <div className="mt-6">
                    <Link to="/create-job">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-transparent
                                bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                                  hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        New Job
                      </button>
                    </Link>
                  </div>
                </div>
                :
                <div className="text-sm text-gray-500 mt-20 m-auto w-11/12 text-center">
                  No jobs assigned to you.
                </div>
          )}
          
          {loading && <Loader />}  

          {!loading && (
            <div className="overflow-hidden bg-white shadow sm:rounded-md mt-2">
              <ul className="divide-y divide-gray-200">
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
                              
                              {job.customer && (
                                <div className="text-sm text-gray-800 mt-2 flex gap-1">
                                  <UserIcon className="h-4 w-4 text-gray-400" />{job.customer.name}
                                </div>
                              )}

                              <div className="mt-2 text-sm text-gray-500 mb-1">
                                {job.airport.initials} - {job.fbo.name} - {job.aircraftType.name}
                              </div>
                            </div>
                            <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left">
                                <p className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                              ${job.status === 'A' && 'bg-blue-500 '}
                                              ${job.status === 'S' && 'bg-yellow-500 '}
                                              ${job.status === 'U' && 'bg-indigo-500 '}
                                              ${job.status === 'W' && 'bg-green-500 '}
                                              ${job.status === 'R' && 'bg-purple-500 '}
                                            `}>
                                  {job.status === 'A' && 'Accepted'}
                                  {job.status === 'S' && 'Assigned'}
                                  {job.status === 'U' && 'Submitted'}
                                  {job.status === 'W' && 'Work In Progress'}
                                  {job.status === 'C' && 'Completed'}
                                  {job.status === 'T' && 'Canceled'}
                                  {job.status === 'R' && 'Review'}
                                  {job.status === 'I' && 'Invoiced'}
                                </p>
                                {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager) && job.asignees?.length > 0 && (
                                    <div className="flex -space-x-1 overflow-hidden justify-start xl:justify-end lg:justify-end md:justify-end mt-2">
                                        {job.asignees?.map((asignee) => (
                                          <Fragment key={asignee.username}>
                                            <img
                                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                              src={asignee.profile.avatar}
                                              alt={asignee.username}
                                            />
                                          </Fragment>
                                        ))}
                                        {job.asignees?.length === 1 && (
                                          <div className="text-gray-500 text-sm relative top-1" style={{ marginLeft: '6px' }}>{job.asignees?.[0].username}</div>
                                        )}
                                    </div>
                                    
                                )}
                                
                                <div className="text-sm text-gray-500 mt-2">
                                  Complete by {job.completeBy ? <span className="text-gray-700 text-sm">{job.completeBy}</span>
                                  : 
                                    <span
                                      className="relative inline-flex items-center
                                                rounded-full border border-gray-300 px-2 py-0.5 ml-2">
                                      <div className="absolute flex flex-shrink-0 items-center justify-center">
                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                      </div>
                                      <div className="ml-3 text-xs text-gray-700">TBD</div>
                                    </span>}
                                </div>
                                <div className="text-sm text-gray-500 mt-2">
                                  Arrival 
                                  {job.on_site && <span
                                      className="relative inline-flex items-center
                                                rounded-full border border-gray-300 px-2 py-0.5 ml-2">
                                      <div className="absolute flex flex-shrink-0 items-center justify-center">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                      </div>
                                      <div className="ml-3 text-xs text-gray-700">On Site</div>
                                    </span> }
                                  {!job.on_site && job.estimatedETA == null && <span
                                      className="relative inline-flex items-center
                                                rounded-full border border-gray-300 px-2 py-0.5 ml-2">
                                      <div className="absolute flex flex-shrink-0 items-center justify-center">
                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                      </div>
                                      <div className="ml-3 text-xs text-gray-700">TBD</div>
                                    </span>}

                                  {!job.on_site && job.estimatedETA != null && <span className="text-gray-700 text-sm ml-1">{job.estimatedETA}</span>}
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
          )}
          
          <div className="py-20"></div>

        </div>
      </AnimatedPage>
    )
  }

  export default JobsQueue;