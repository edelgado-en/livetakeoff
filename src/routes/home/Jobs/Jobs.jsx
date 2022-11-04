/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom"
import { useEffect, useState, Fragment } from "react";
import { TrashIcon, ChevronRightIcon, PlusIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { Listbox, Transition, Menu, Popover } from '@headlessui/react'
import { UserIcon } from "@heroicons/react/solid";
import { useAppSelector } from "../../../app/hooks";
import { selectUser } from "../../userProfile/userSlice";
import Loader from "../../../components/loader/Loader";
import AnimatedPage from "../../../components/animatedPage/AnimatedPage";
import * as api from './apiService'

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
]

const JobsQueue = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchText, setSearchText] = useState(localStorage.getItem('searchText') || '')
  const currentUser = useAppSelector(selectUser)
  const [statusSelected, setStatusSelected] = useState(availableStatuses[1])
  const [sortSelected, setSortSelected] = useState(sortOptions[0])

  useEffect(() => {
    localStorage.setItem('searchText', searchText)
  }, [searchText])

  useEffect(() => {
    //Basic throttling
    let timeoutID = setTimeout(() => {
      fetchJobs()
    }, 500);

    return () => {
      clearTimeout(timeoutID);
    };

  }, [searchText, statusSelected, sortSelected])

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      
      fetchJobs();
    }
  };

  const fetchJobs = async () => {
    setLoading(true)
    
    const request = {
      searchText: localStorage.getItem('searchText'),
      status: statusSelected.id,
      sortField: sortSelected.id,
    }

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
                    placeholder="tail, P.O, customer, airport..."
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
                  <Listbox value={statusSelected} onChange={setStatusSelected}>
                    {({ open }) => (
                        <>
                        <div className="relative" style={{width: '110px'}}>
                            <Listbox.Button className="relative w-full cursor-default rounded-md 
                                                         bg-white py-2 px-3 pr-8 text-left
                                                        shadow-sm border-transparent focus:border-transparent focus:ring-0 focus:outline-none
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
            </div>
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
                                  {job.status === 'T' && 'Cancelled'}
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
                                  Complete by {job.completeBy ? job.completeBy
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