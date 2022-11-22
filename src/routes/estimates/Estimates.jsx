import { Link } from "react-router-dom"
import { useEffect, useState, Fragment } from "react";
import { ChevronRightIcon, PlusIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { Listbox, Transition, Menu, Popover, Disclosure, Dialog } from '@headlessui/react'
import { UserIcon } from "@heroicons/react/solid";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../userProfile/userSlice";
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from './apiService'

import Pagination from "react-js-pagination";


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

const availableStatuses = [
    {id: 'All', name: 'All'},
    {id: 'P', name: 'Pending'},
    {id: 'A', name: 'Accepted'},
    {id: 'R', name: 'Rejected'},
]

const Estimates = () => {
    const [loading, setLoading] = useState(true)
    const [estimates, setEstimates] = useState([])
    const [totalEstimates, setTotalEstimates] = useState(0)

    useEffect(() => {
        searchEstimates()
    }, [])

    const searchEstimates = async () => {
        setLoading(true)

        const request = {
            status: 'All',
            customer: 'All'
        }

        try {
            const { data } = await api.searchEstimates(request)

            console.log(data)

            setEstimates(data.results)
            setTotalEstimates(data.count)

            setLoading(false)

        } catch (error) {
            setLoading(false)
        }

    }

    return (
        <AnimatedPage>
            <div className="xl:px-16 px-4 m-auto max-w-5xl -mt-3">
                <div className="grid grid-cols-2">
                    <div className="">
                    <h1 className="text-2xl font-semibold text-gray-600">Jobs Estimates</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Total estimates: <span className="text-gray-900">{totalEstimates}</span>
                    </p>
                    </div>
                    <div className="text-right">
                        <Link to="/create-estimate">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center 
                                        rounded-md border border-transparent bg-red-600 px-4 py-2
                                        text-sm font-medium text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500
                                        focus:ring-offset-2 sm:w-auto"
                            >
                                <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                                New Estimate
                            </button>
                        </Link>
                    </div>
                </div>

                {loading && <Loader />}  

                {/* TODO: account for no estimates found */}

                {/* Use a table instead of cards because we are going to be showing money, so it is easier to visualize */}

                {!loading && (
                    <div className="overflow-hidden bg-white shadow sm:rounded-md mt-2">
                        <ul className="divide-y divide-gray-200">
                            {estimates.map((estimate) => (
                                <li key={estimate.id}>
                                     <Link to={`/estimates/${estimate.id}`} className="block hover:bg-gray-50">
                                        <div className="flex items-center px-4 py-4 sm:px-6">
                                            <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div className="w-full grid xl:grid-cols-2 lg:grid-cols-2 md-grid-cols-2 xs:grid-cols-1">
                                                <div>
                                                <div className="">
                                                    <span className="font-medium text-red-600 text-sm">{estimate.customer.name}</span>
                                                    <span className="ml-2 text-sm text-gray-700">{estimate.purchase_order}</span>
                                                </div>
                                                
                                                <div className="mt-2 text-sm text-gray-500 mb-1">
                                                </div>
                                                </div>
                                                <div className="xl:text-right lg:text-right md:text-right xs:text-left sm:text-left">
                                                    <p className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                                                ${estimate.status === 'P' && 'bg-yellow-400 '}
                                                                ${estimate.status === 'A' && 'bg-green-500 '}
                                                                ${estimate.status === 'R' && 'bg-gray-500 '}
                                                                `}>
                                                        {estimate.status === 'P' && 'Pending'}
                                                        {estimate.status === 'A' && 'Accepted'}
                                                        {estimate.status === 'R' && 'Rejected'}
                                                    </p>
                                                    
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

            </div> 
        </AnimatedPage>
    )

}

export default Estimates;
