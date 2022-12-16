import { useEffect, useState } from "react";
import { Link, useParams, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Dialog, Transition, Switch, Menu } from '@headlessui/react'
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import { PencilIcon, ChartBarIcon } from "@heroicons/react/solid";

import ReactTimeAgo from 'react-time-ago'

import Loader from "../../components/loader/Loader";

import * as api from './apiService'

const MagnifyingGlassIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    )
}

const UserDetails = () => {
    const { userId } = useParams();
    const [userDetails, setUserDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [airports, setAirports] = useState([])
    const [totalAirports, setTotalAirports] = useState(0)
    const [loadingAirports, setLoadingAirports] = useState(false)
    const [airportSearchText, setAirportSearchText] = useState('')
    const [airportAlreadyAdded, setAirportAlreadyAdded] = useState(false)

    const [availableAirports, setAvailableAirports] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        //Basic throttling
        let timeoutID = setTimeout(() => {
            getAirports()
        }, 500);
  
        return () => {
            clearTimeout(timeoutID);
        }
    }, [airportSearchText])


    useEffect(() => {
        getUserDetails()
        getAvailableAirports()
        setAirportAlreadyAdded(false)
    }, [userId])

    const getAirports = async () => {
        setLoadingAirports(true)
        try {
            const request = {
                name: airportSearchText
            }

            const { data } = await api.getAirports(request)
            
            setAirports(data.results)
            setTotalAirports(data.count)
            setAirportAlreadyAdded(false)

            setLoadingAirports(false)

        } catch (error) {
            setLoadingAirports(false)
        }
    }

    const getUserDetails = async () => {
        setLoading(true)

        try {
            const { data } = await api.getUserDetails(userId)

            setUserDetails(data)
            setLoading(false)

        } catch (err) {
            setLoading(false)
        }
    }

    const getAvailableAirports = async () => {
        try {
            const { data } = await api.getUserAvailableAirports(userId)

            setAvailableAirports(data)

        } catch (err) {
            console.log(err)
        }
    }

    const addAvailableAirport = async (airportId) => {
        try {
            const request = {
                'user_id': userId,
                'airport_id': airportId
            }

            // check if airportId already exists in available airports array
            const airportExists = availableAirports.find(airport => airport.id === airportId)

            if (airportExists) {
                setAirportAlreadyAdded(true)
            } else {
                const { data } = await api.addUserAvailableAirport(request)
                setAirportAlreadyAdded(false)
                setAvailableAirports([...availableAirports, data])
            }


        } catch (error) {
            setAirportAlreadyAdded(false)
        }
    }

    const deleteAvailableAirport = async (airportId) => {
        try {
            const request = {
                'user_id': userId,
                'airport_id': airportId
            }

            await api.deleteUserAvailableAirport(request)

            setAirportAlreadyAdded(false)
            
            setAvailableAirports(availableAirports.filter(airport => airport.id !== airportId))

        } catch (error) {

        }
    }

    const handleKeyDown = event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          
          getAirports();
        }
      };

    return (
        <AnimatedPage>

            {loading && <Loader />}

            {!loading && (
                <div className=" max-w-7xl m-auto">
                    <div className="xl:grid xl:grid-cols-8">
                        <div className="xl:col-span-6 xl:border-r xl:border-gray-200 xl:pr-8">
                            <img className="mx-auto h-32 w-32 flex-shrink-0 rounded-full" src={userDetails.avatar} alt="" />
                            <h3 className="mt-4 text-xl font-medium text-center text-gray-900">{userDetails.first_name} {' '} {userDetails.last_name}</h3>
                            <div className="mt-1 text-sm text-gray-500 text-center">{userDetails.email}</div>

                            <div className="mt-4 flex gap-6 justify-center">
                                <div className="text-center">
                                    <button onClick={() => navigate('/users/' + userId + '/productivity')}
                                             className="text-xs leading-5 font-semibold bg-slate-400/20 w-9
                                                        rounded-full p-2 text-slate-500 m-auto text-center
                                                        flex items-center space-x-2 hover:bg-slate-400/40
                                                        dark:highlight-white/5">
                                        <ChartBarIcon className=" h-5 w-5 cursor-pointer"/>
                                    </button>
                                    <div className="text-sm font-medium mt-1">Stats</div>
                                </div>
                                <div className="text-center">
                                    <button 
                                             className="text-xs leading-5 font-semibold bg-slate-400/20 w-9
                                                        rounded-full p-2 text-slate-500 m-auto text-center
                                                        flex items-center space-x-2 hover:bg-slate-400/40
                                                        dark:highlight-white/5">
                                        <PencilIcon className=" h-5 w-5 cursor-pointer"/>
                                    </button>
                                    <div className="text-sm font-medium mt-1">Edit</div>
                                </div>
                            </div>

                            {/* Mobile */}
                            <aside className="mt-8 xl:hidden px-4">
                                <div className="font-medium">General Info</div>
                                <div className="grid grid-cols-2 mt-2 gap-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                                        <dd className="mt-1 text-sm text-gray-900"><ReactTimeAgo date={new Date(userDetails.member_since)} locale="en-US" timeStyle="twitter" /></dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userDetails.first_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Username</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userDetails.username}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userDetails.last_name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userDetails.phone_number ? userDetails.phone_number : 'Not specified'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userDetails.location ? userDetails.location : 'Not specified'}</dd>
                                    </div>
                                </div>
                            </aside>

                            <div className="mt-8">
                                <div className="font-medium px-4">Airports</div>
                                <div className="text-sm text-gray-500 px-4">Manage airports. This user will only be available for job assignment if the job is in any of the airports in the available list.</div>

                                <div className="mt-8 grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1 gap-x-8">
                                    <div className="border border-gray-200 rounded-md p-4" style={{height: '680px'}}>
                                        <div className="font-medium text-sm">
                                            <div className="flex justify-between">
                                                <div>
                                                    All Airports
                                                    <span className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                                    rounded-full text-xs font-medium inline-block">{totalAirports}</span>
                                                </div>
                                                <div>
                                                    {airportAlreadyAdded && (
                                                        <div className="text-red-500 text-xs relative top-1">Airport already added</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="min-w-0 flex-1 my-2">
                                                <label htmlFor="search" className="sr-only">
                                                    Search
                                                </label>
                                                <div className="relative rounded-md shadow-sm">
                                                <div 
                                                    onClick={() => getAirports()}
                                                    className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer">
                                                    <MagnifyingGlassIcon 
                                                        className="h-5 w-5 text-gray-400 cursor-pointer"
                                                        aria-hidden="true" />
                                                </div>
                                                <input
                                                    type="search"
                                                    name="search"
                                                    id="search"
                                                    value={airportSearchText}
                                                    onChange={event => setAirportSearchText(event.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    className="block w-full rounded-md border-gray-300 pl-10
                                                             focus:border-sky-500 text-xs
                                                            focus:ring-sky-500  font-normal"
                                                    placeholder="Search name..."
                                                />
                                                </div>
                                            </div>
                                            <div className="overflow-y-auto" style={{maxHeight: '560px'}}>
                                            {airports.map((airport) => (
                                                <div key={airport.id} className="relative">
                                                    <ul className="">
                                                        <li className="">
                                                            <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                                                <div className="flex-shrink-0 text-xs w-6">
                                                                    {airport.initials}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-xs text-gray-900 font-normal truncate overflow-ellipsis w-60">{airport.name}</p>
                                                                </div>
                                                                <div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addAvailableAirport(airport.id)}
                                                                        className="inline-flex items-center rounded border
                                                                                    border-gray-300 bg-white px-2 py-1 text-xs
                                                                                    text-gray-700 shadow-sm
                                                                                    hover:bg-gray-50 focus:outline-none focus:ring-2
                                                                                    "
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            ))}
                                            </div>

                                        </div>
                                    </div>
                                    <div className="border border-gray-200 rounded-md p-4" style={{height: '680px'}}>
                                        <div className="font-medium text-sm">
                                            Available Airports
                                            <span className="bg-gray-100 text-gray-700 ml-2 py-1 px-2
                                            rounded-full text-xs font-medium inline-block">{availableAirports.length}</span>
                                        </div>
                                        <div className="text-xs">
                                            
                                            {availableAirports.length === 0 && (
                                                <div className="text-center m-auto mt-24 text-sm">No available airports set.</div>
                                            )}

                                            <div className="overflow-y-auto" style={{maxHeight: '560px'}}>
                                                {availableAirports.map((airport) => (
                                                    <div key={airport.id} className="relative">
                                                        <ul className="">
                                                            <li className="">
                                                                <div className="relative flex items-center space-x-3 px-2 py-3 hover:bg-gray-50 rounded-md">
                                                                    <div className="flex-shrink-0 text-xs w-6 font-medium">
                                                                        {airport.initials}
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs text-gray-900 font-normal truncate overflow-ellipsis w-60">{airport.name}</p>
                                                                    </div>
                                                                    <div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => deleteAvailableAirport(airport.id)}
                                                                            className="inline-flex items-center rounded border
                                                                                        border-gray-300 bg-white px-2 py-1 text-xs
                                                                                        text-gray-700 shadow-sm
                                                                                        hover:bg-gray-100 focus:outline-none focus:ring-2
                                                                                        "
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>


                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Desktop */}
                        <aside className="hidden xl:block xl:pl-6 xl:col-span-2">
                            <div className="space-y-5">
                                <div className="font-medium">General Info</div>
                                <div className="">
                                    <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                                    <dd className="mt-1 text-sm text-gray-900"><ReactTimeAgo date={new Date(userDetails.member_since)} locale="en-US" timeStyle="twitter" /></dd>
                                </div>
                                <div className="">
                                    <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{userDetails.first_name}</dd>
                                </div>
                                <div className="">
                                    <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{userDetails.last_name}</dd>
                                </div>
                                <div className="">
                                    <dt className="text-sm font-medium text-gray-500">Username</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{userDetails.username}</dd>
                                </div>
                                <div className="border-t border-gray-200 pt-4">
                                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{userDetails.phone_number ? userDetails.phone_number : 'Not specified'}</dd>
                                </div>
                                <div className="">
                                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{userDetails.location ? userDetails.location : 'Not specified'}</dd>
                                </div>
                                <div className="">
                                    <dt className="text-sm font-medium text-gray-500">Access Level</dt>
                                    <dd className="mt-1 text-sm text-gray-900">
                                        {(userDetails.is_superuser || userDetails.is_staff) && 'Admin'}
                                        {userDetails.is_account_manager && 'Account Manager'}
                                        {userDetails.is_project_manager && 'Project Manager'}
                                        {userDetails.customer_name && 'Customer User'}
                                    </dd>
                                </div>
                                {userDetails.customer_name && (
                                    <div className="">
                                        <dt className="text-sm font-medium text-gray-500">Customer</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userDetails.customer_name}</dd>
                                    </div>
                                )}

                                {userDetails.vendor_name && (
                                    <div className="">
                                        <dt className="text-sm font-medium text-gray-500">Vendor</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userDetails.vendor_name}</dd>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                
                    
                </div>
            )}

        </AnimatedPage>
    )
}

export default UserDetails;