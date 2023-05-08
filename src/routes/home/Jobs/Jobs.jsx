/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom"
import { useEffect, useState, Fragment } from "react";
import { ChevronRightIcon, PlusIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { Listbox, Transition, Menu, Popover, Disclosure, Dialog } from '@headlessui/react'
import { UserIcon } from "@heroicons/react/solid";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../userProfile/userSlice";
import Loader from "../../../components/loader/Loader";
import AnimatedPage from "../../../components/animatedPage/AnimatedPage";
import * as api from './apiService'

import Pagination from "react-js-pagination";

import * as customerApi from '../../customers/apiService'
import { toast } from "react-toastify";

const XMarkIcon = () => {
  return (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
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
  {id: 'All', name: 'All Open Jobs'},
  {id: 'U', name: 'Submitted'},
  {id: 'A', name: 'Accepted'},
  {id: 'S', name: 'Assigned'},
  {id: 'W', name: 'In Progress'},
]

const sortOptions = [
  { id: 'requestDate', name: 'Request Date' },
  { id: 'completeBy', name: 'Complete Before' },
  { id: 'arrivalDate', name: 'Arrival Date' },
]

const JobsQueue = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchText, setSearchText] = useState(localStorage.getItem('searchText') || '')
  const [statusSelected, setStatusSelected] = useState(JSON.parse(localStorage.getItem('statusSelected')) || {id: 'All', name: 'All Open Jobs'})
  const [sortSelected, setSortSelected] = useState(JSON.parse(localStorage.getItem('sortSelected')) || { id: 'requestDate', name: 'Request Date' })
  const [open, setOpen] = useState(false)

  const [dueToday, setDueToday] = useState(false)
  
  const currentUser = useAppSelector(selectUser)
  const [activeFilters, setActiveFilters] = useState([])
  const [customers, setCustomers] = useState([])

  const [customersWOpenJobs, setCustomersWOpenJobs] = useState([])

  const [airports, setAirports] = useState([])
  const [airportSelected, setAirportSelected] = useState(JSON.parse(localStorage.getItem('airportSelected')) || {id: 'All', name: 'All'})
  const [airportSearchTerm, setAirportSearchTerm] = useState('')

  const [customerSelected, setCustomerSelected] = useState(JSON.parse(localStorage.getItem('customerSelected')) || {id: 'All', name: 'All'})
  const [customerSearchTerm, setCustomerSearchTerm] = useState('')

  const [projectManagers, setProjectManagers] = useState([])
  const [projectManagerSelected, setProjectManagerSelected] = useState(JSON.parse(localStorage.getItem('projectManagerSelected')) || {id: 'All', name: 'All'})

  const [tags, setTags] = useState([])

  const filteredCustomers = customerSearchTerm
    ? customers.filter((item) => item.name.toLowerCase().includes(customerSearchTerm.toLowerCase()))
    : customers;

  const filteredAirports = airportSearchTerm
    ? airports.filter((item) => item.name.toLowerCase().includes(airportSearchTerm.toLowerCase()))
    : airports;


  useEffect(() => {
    getCustomers({ name: '', open_jobs: true })

  }, [])

  useEffect(() => {
    getUsers()

  }, [])

  useEffect(() => {
    getTags()
  }, [])

  useEffect(() => {

    getAirports();

    if (currentUser?.isCustomer) {
      //remove the first entry and replace it with {id: 'All', name: 'All'},{id: 'O', name: 'All Open Jobs'},
      availableStatuses.shift()

      // only add O if it does not exists in the availableStatuses
      if (!availableStatuses.find(status => status.id === 'O')) {
        availableStatuses.unshift({id: 'O', name: 'All Open Jobs'})
      }

      if (!availableStatuses.find(status => status.id === 'All')) {
        availableStatuses.unshift({id: 'All', name: 'All'})
      }

      if (!availableStatuses.find(status => status.id === 'T')) {
        availableStatuses.push({id: 'T', name: 'Canceled'})
      }

      if (!availableStatuses.find(status => status.id === 'C')) {
        availableStatuses.push({id: 'C', name: 'Completed'})
      }

      if (!availableStatuses.find(status => status.id === 'I')) {
        availableStatuses.push({id: 'I', name: 'Invoiced'})
      }

    }

  }, [])

  const getTags = async () => {
    const { data } = await api.getTags();
    setTags(data.results);
  }

  const getCustomers = async (request) => {
      const { data } = await customerApi.getCustomers(request);

      if (request.open_jobs) {
        setCustomersWOpenJobs(data.results)
      
      } else {
        data.results.unshift({id: 'All', name: 'All'})
        setCustomers(data.results)

      }
  }

  const getUsers = async () => {
    const request = {
      open_jobs_only: true
    }

    const { data } = await api.searchUsers(request);

    setProjectManagers(data.results)
  }

  const getAirports = async () => {
    let request = {
      name: '',
      open_jobs: true
    }

    if (currentUser.isCustomer) {
      request.onlyIncludeCustomerJobs = true
    } 

    const { data } = await customerApi.getAirports(request)

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
    localStorage.setItem('projectManagerSelected', JSON.stringify(projectManagerSelected))

  }, [projectManagerSelected])

  useEffect(() => {
    localStorage.setItem('airportSelected', JSON.stringify(airportSelected))

  }, [airportSelected])

  useEffect(() => {
    localStorage.setItem('sortSelected', JSON.stringify(sortSelected))

  }, [sortSelected])

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      fetchJobs()
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };

  }, [searchText, statusSelected, sortSelected, customerSelected, airportSelected, currentPage, projectManagerSelected, tags, dueToday])

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
    
    } else if (activeFilterId === 'projectManager') {
      setProjectManagerSelected({id: 'All', name: 'All'})
    }

    setActiveFilters(activeFilters.filter(filter => filter.id !== activeFilterId))

  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const fetchJobs = async () => {
    setLoading(true)
    
    const request = {
      searchText: localStorage.getItem('searchText'),
      status: JSON.parse(localStorage.getItem('statusSelected')).id,
      sortField: JSON.parse(localStorage.getItem('sortSelected')).id,
      customer: JSON.parse(localStorage.getItem('customerSelected')).id,
      airport: JSON.parse(localStorage.getItem('airportSelected')).id,
      project_manager: JSON.parse(localStorage.getItem('projectManagerSelected')).id,
      tags: tags.filter(item => item.selected).map(item => item.id)
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

    if (request.project_manager !== 'All') {
      activeFilters.push({
        id: 'projectManager',
        name: projectManagerSelected.name,
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
        const { data } = await api.getJobs(request, currentPage);

        const jobs = []

        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const todayFormattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
        
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

            if (job.completeBy && job.completeBy.includes(todayFormattedDate)) {
              job.isDueToday = true
            }

            if (!dueToday) {
              jobs.push(job)

            } else if (dueToday && job.isDueToday) {
              jobs.push(job)
            }
        })

        setJobs(jobs);
        setTotalJobs(data.count)

    } catch (e) {
      toast.error('Unable to get jobs')
      setJobs([])
    }

    setLoading(false)
  }

  const handleToggleTag = (tag) => {
    const newTags = [...tags]
    const index = newTags.findIndex(item => item.id === tag.id)
    newTags[index].selected = !newTags[index].selected
    
    setTags(newTags)
  }

  const handleToggleDueToday = () => {
    setDueToday(!dueToday)
  }

    return (
      <AnimatedPage>
        <div className={`px-4 m-auto ${(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager || currentUser.isInternalCoordinator) ? 'max-w-7xl' : 'max-w-5xl'} -mt-3 flex flex-wrap`}>
          <div className="flex-1 xl:px-10 lg:px-10 md:px-10">
          <div className="grid grid-cols-2">
            <div className="">
              <h1 className="text-2xl font-semibold text-gray-600">Jobs Queue</h1>
              <p className="mt-1 text-sm text-gray-500">
                Total: <span className="text-gray-900">{totalJobs}</span>
              </p>
            </div>
            <div className="text-right">
            {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager || currentUser.isCustomer || currentUser.isInternalCoordinator) && (
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

          {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager || currentUser.isCustomer || currentUser.isInternalCoordinator) && (
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
                                          <p className="text-xs text-gray-700 truncate overflow-ellipsis w-44">{status.name}</p>
                                        </div>
                                      </div>
                                    </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {!currentUser.isCustomer && (
                              <>
                              <div className="px-4 py-4">
                                <h2 className="font-medium text-sm text-gray-900">Tags</h2>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {tags.map((tag) => (
                                        <div key={tag.id} onClick={() => handleToggleTag(tag)} 
                                            className={`${tag.selected ? 'ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500' : 'hover:bg-gray-50'}
                                                          rounded-md border border-gray-200 cursor-pointer
                                                        py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32`}>
                                            {tag.name}
                                        </div>
                                    ))}
                                </div>
                              </div>
                              <div className="px-4 py-4">
                                <h2 className="font-medium text-sm text-gray-900">Customers <span className="text-gray-500 text-sm ml-1 font-normal">({customersWOpenJobs.length})</span></h2>
                                <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                                  {customersWOpenJobs.map((customer) => (
                                    <li key={customer.id} >
                                      <div onClick={() => setCustomerSelected({ id: customer.id, name: customer.name })}
                                            className="relative flex items-center space-x-3 pr-6 pl-3 py-1 focus-within:ring-2 cursor-pointer
                                                          hover:bg-gray-50">
                                        <div className="flex-shrink-0">
                                          <img className="h-8 w-8 rounded-full" src={customer.logo} alt="" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div  className="focus:outline-none">
                                            {/* Extend touch target to entire panel */}
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            <p className="text-xs text-gray-700 truncate overflow-ellipsis w-44">{customer.name}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="px-4 py-4">
                                <h2 className="font-medium text-sm text-gray-900">Assignees <span className="text-gray-500 text-sm ml-1 font-normal">({projectManagers.length})</span></h2>
                                <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                                  {projectManagers.map((projectManager) => (
                                    <li key={projectManager.id} >
                                      <div onClick={() => setProjectManagerSelected({ id: projectManager.id, name: projectManager.username })}
                                            className="relative flex items-center space-x-3 pr-6 pl-3 py-1 focus-within:ring-2 cursor-pointer
                                                          hover:bg-gray-50">
                                        <div className="flex-shrink-0">
                                          <img className="h-8 w-8 rounded-full" src={projectManager.avatar} alt="" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div  className="focus:outline-none">
                                            {/* Extend touch target to entire panel */}
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            <p className="text-xs text-gray-700 truncate overflow-ellipsis w-44">{projectManager.first_name} {projectManager.last_name}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              </>
                          )}
                          
                          <div className="px-4 py-4">
                            <h2 className="font-medium text-sm text-gray-900">Airports<span className="text-gray-500 text-sm ml-1 font-normal">({filteredAirports.length - 1})</span></h2>
                            <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                              {filteredAirports.map((airport) => (
                                <li key={airport.id}>
                                  <div onClick={() => setAirportSelected({ id: airport.id, name: airport.name })}
                                          className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                                        hover:bg-gray-50">
                                      <div className="min-w-0 flex-1">
                                        <div  className="focus:outline-none">
                                          <p className="text-xs text-gray-700 truncate overflow-ellipsis w-60">{airport.name}</p>
                                        </div>
                                      </div>
                                    </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>
            
            <div className="">
                <div className="w-full">
                <div className="relative border-b border-gray-200">
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
                          className="block w-full  pl-10 focus:border-sky-500 border-none py-4 
                                  focus:ring-sky-500 text-sm"
                          placeholder="search by tail or P.O"
                        />
                    </div>
                  </div>
              </div>
            <div className="flex items-center justify-between pt-3 pb-1">
              <Listbox value={sortSelected} onChange={setSortSelected}>
                {({ open }) => (
                    <>
                    <div className="relative" style={{width: '150px'}}>
                        <Listbox.Button className="relative w-full cursor-default rounded-md 
                                                      bg-white py-2 px-3 pr-8 text-left
                                                    shadow-sm border-transparent focus:border-transparent focus:ring-0 focus:outline-none
                                                    text-xs">
                            <span className="block truncate">
                                {sortSelected.name}
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
                <div className="xl:hidden lg:hidden md:hidden">
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
            </>  
          )}

          {!loading && jobs.length === 0 && (
              (currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager || currentUser.isCustomer || currentUser.isInternalCoordinator) ?
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
                  No jobs found.
                </div>
          )}
          
          {loading && <Loader />}  

          {!loading && (
            <div className="overflow-hidden bg-white shadow sm:rounded-md mt-2 mb-4">
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
                                <span className="font-medium">{job.airport.initials}</span> - {job.fbo.name} - {job.aircraftType.name}
                              </div>
                              {(currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager || currentUser.isInternalCoordinator) && job.asignees?.length > 0 && (
                                    <div className="flex -space-x-1 overflow-hidden justify-start my-2">
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

                              <div className="flex justify-start my-2 gap-2">
                                  {job.tags?.map((tag) => (
                                    <div key={tag.id} className={`text-xs inline-block rounded-md px-2 py-1 text-white border
                                                                  ${tag.tag_color === 'red' && 'border-red-500 text-red-500'}
                                                                  ${tag.tag_color === 'orange' && 'border-orange-500 text-orange-500 '}
                                                                  ${tag.tag_color === 'amber' && 'border-amber-500 text-amber-500'}
                                                                  ${tag.tag_color === 'indigo' && ' border-indigo-500 text-indigo-500'}
                                                                  ${tag.tag_color === 'violet' && ' border-violet-500 text-violet-500'}
                                                                  ${tag.tag_color === 'fuchsia' && 'border-fuchsia-500 text-fuchsia-500'} 
                                                                  ${tag.tag_color === 'pink' && 'border-pink-500 text-pink-500'}
                                                                  ${tag.tag_color === 'slate' && 'border-slate-500 text-gray-500'}
                                                                  ${tag.tag_color === 'lime' && 'border-lime-500 text-lime-500'}
                                                                  ${tag.tag_color === 'emerald' && 'border-emerald-500 text-emerald-500'}
                                                                  ${tag.tag_color === 'cyan' && 'border-cyan-500 text-cyan-500'}
                                                                  ${tag.tag_color === 'blue' && 'border-blue-500 text-blue-500'}
                                                                 `}>
                                      {tag.tag_short_name}
                                    </div>
                                  ))}
                              </div>
                            </div>
                            <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left">
                                <div className="flex gap-2 xl:justify-end lg:justify-end xs:justify-start sm:justify-start">
                                  {job.isDueToday && (
                                    <p className={`inline-flex text-xs rounded-md py-1 px-2 text-red-500 border border-red-500 font-semibold`}>
                                        DUE TODAY
                                    </p>
                                  )}
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
                                <div className="text-sm text-gray-500 mt-2">
                                  Departure
                                  {job.estimatedETD == null && <span
                                      className="relative inline-flex items-center
                                                rounded-full border border-gray-300 px-2 py-0.5 ml-2">
                                      <div className="absolute flex flex-shrink-0 items-center justify-center">
                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                      </div>
                                      <div className="ml-3 text-xs text-gray-700">TBD</div>
                                    </span>}

                                  {job.estimatedETD != null && <span className="text-gray-700 text-sm ml-1">{job.estimatedETD}</span>}
                                </div>
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
            </div>
          )}

          {!loading && totalJobs > 50 && (
              <div className="m-auto px-10 pr-20 flex pt-5 pb-10 justify-end text-right">
                  <div>
                    <Pagination
                      innerClass="pagination pagination-custom"
                      activePage={currentPage}
                      hideDisabled
                      itemClass="page-item page-item-custom"
                      linkClass="page-link page-link-custom"
                      itemsCountPerPage={50}
                      totalItemsCount={totalJobs}
                      pageRangeDisplayed={3}
                      onChange={handlePageChange}
                  /> 
                  </div>
              </div>
          )}
          
          </div>

          {((currentUser.isAdmin || currentUser.isSuperUser || currentUser.isAccountManager || currentUser.isInternalCoordinator || currentUser.isCustomer)) && (
              <div className="xs:pt-10 sm:pt-10 xl:pt-0 lg:pt-0 md:pt-0">
                <div className="hidden xl:block lg:block pb-4">
                  <h2 className="font-medium text-sm text-gray-900">Status</h2>
                  <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                    {availableStatuses.map((status) => (
                      <li key={status.id}>
                        <div onClick={() => setStatusSelected({ id: status.id, name: status.name })}
                                className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                              hover:bg-gray-50">
                            <div className="min-w-0 flex-1">
                              <div  className="focus:outline-none">
                                <p className="text-xs text-gray-700 truncate overflow-ellipsis w-44">{status.name}</p>
                              </div>
                            </div>
                          </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {!currentUser.isCustomer && (
                  <>
                  <div className="pb-4">
                    <h2 className="font-medium text-sm text-gray-900">Alerts</h2>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div  onClick={() => handleToggleDueToday()} 
                          className={`${dueToday ? 'ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500' : 'hover:bg-gray-50'}
                                        rounded-md border border-gray-200 cursor-pointer
                                      py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32`}>
                          DUE TODAY
                      </div>
                    </div>
                  </div>
                  <div className="pb-4">
                    <h2 className="font-medium text-sm text-gray-900">Tags</h2>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {tags.map((tag) => (
                            <div key={tag.id} onClick={() => handleToggleTag(tag)} 
                                className={`${tag.selected ? 'ring-1 ring-offset-1 ring-rose-400 text-white bg-rose-400 hover:bg-rose-500' : 'hover:bg-gray-50'}
                                              rounded-md border border-gray-200 cursor-pointer
                                            py-2 px-2 text-xs hover:bg-gray-50 truncate overflow-ellipsis w-32`}>
                                {tag.name}
                            </div>
                        ))}
                    </div>
                  </div>
                  <div className="pb-4">
                    <h2 className="font-medium text-sm text-gray-900">Customers <span className="text-gray-500 text-sm ml-1 font-normal">({customersWOpenJobs.length})</span></h2>
                    <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                      {customersWOpenJobs.map((customer) => (
                        <li key={customer.id} >
                          <div onClick={() => setCustomerSelected({ id: customer.id, name: customer.name })}
                                className="relative flex items-center space-x-3 pr-6 pl-3 py-1 focus-within:ring-2 cursor-pointer
                                              hover:bg-gray-50">
                            <div className="flex-shrink-0">
                              <img className="h-8 w-8 rounded-full" src={customer.logo} alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div  className="focus:outline-none">
                                {/* Extend touch target to entire panel */}
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="text-xs text-gray-700 truncate overflow-ellipsis w-44">{customer.name}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pb-4">
                    <h2 className="font-medium text-sm text-gray-900">Assignees <span className="text-gray-500 text-sm ml-1 font-normal">({projectManagers.length})</span></h2>
                    <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                      {projectManagers.map((projectManager) => (
                        <li key={projectManager.id} >
                          <div onClick={() => setProjectManagerSelected({ id: projectManager.id, name: projectManager.username })}
                                className="relative flex items-center space-x-3 pr-6 pl-3 py-1 focus-within:ring-2 cursor-pointer
                                              hover:bg-gray-50">
                            <div className="flex-shrink-0">
                              <img className="h-8 w-8 rounded-full" src={projectManager.avatar} alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div  className="focus:outline-none">
                                {/* Extend touch target to entire panel */}
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="text-xs text-gray-700 truncate overflow-ellipsis w-44">{projectManager.first_name} {projectManager.last_name}</p>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  </>
                )}

                <div className="pb-8">
                  <h2 className="font-medium text-sm text-gray-900">Airports<span className="text-gray-500 text-sm ml-1 font-normal">({filteredAirports.length - 1})</span></h2>
                  <ul className="relative z-0 divide-y divide-gray-200 mt-2">
                    {filteredAirports.map((airport) => (
                      <li key={airport.id}>
                        <div onClick={() => setAirportSelected({ id: airport.id, name: airport.name })}
                                className="relative flex items-center space-x-3 px-3 py-2 focus-within:ring-2 cursor-pointer
                                              hover:bg-gray-50">
                            <div className="min-w-0 flex-1">
                              <div  className="focus:outline-none">
                                <p className="text-xs text-gray-700 truncate overflow-ellipsis w-60">{airport.name}</p>
                              </div>
                            </div>
                          </div>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
          )}

        </div>
        <div className="py-20"></div>
      </AnimatedPage>
    )
  }

  export default JobsQueue;