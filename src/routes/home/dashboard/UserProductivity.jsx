import { useEffect, useState, Fragment } from 'react'
import { ArrowLeftIcon, UsersIcon, CashIcon, BriefcaseIcon, ArrowSmRightIcon, CheckIcon, ChevronDownIcon} from '@heroicons/react/outline'
import { Listbox, Transition, Menu, Popover, Disclosure, Dialog } from '@headlessui/react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

import ReactTimeAgo from 'react-time-ago'

import * as api from './apiService'
import AnimatedPage from '../../../components/animatedPage/AnimatedPage'
import Loader from '../../../components/loader/Loader'

const dateOptions = [
    { id: 'yesterday', name: 'Yesterday' },
    { id: 'last7Days', name: 'Last 7 Days' },
    { id: 'lastWeek', name: 'Last Week' },
    { id: 'MTD', name: 'Month to Date' },
    { id: 'lastMonth', name: 'Last Month' },
    { id: 'lastQuarter', name: 'Last Quarter' },
    { id: 'YTD', name: 'Year to Date'},
    { id: 'lastYear', name: 'Last Year' },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const UserProductivity = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true)
    const [productivityData, setProductivityData] = useState({})
    const [dateSelected, setDateSelected] = useState(dateOptions[3])

    const navigate = useNavigate()

    useEffect(() => {
        getUserProductivityStats()
    }, [dateSelected])

    const getUserProductivityStats = async () => {
        setLoading(true)

        try {
            const { data } = await api.getUserProductivityStats(id, { dateSelected: dateSelected.id })
            
            setProductivityData(data)
            setLoading(false)

        } catch (error) {
            setLoading(false)
            toast.error(error.message)
        }
    }

    return (
        <AnimatedPage>
            <div className="px-4 max-w-7xl m-auto">
                <div className="w-full flex gap-2">
                    <button onClick={() => navigate(-1)} className="text-xs leading-5 font-semibold bg-slate-400/10
                                                        rounded-full p-2 text-slate-500
                                                        flex items-center space-x-2 hover:bg-slate-400/20
                                                        dark:highlight-white/5">
                            <ArrowLeftIcon className="flex-shrink-0 h-4 w-4 cursor-pointer"/>
                    </button>
                    <h2 className="text-2xl font-bold tracking-tight">
                        User Productivity
                    </h2>
                </div>

                {loading && <Loader /> }

                {!loading && (
                    <div className="py-8">
                        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
                            <div className="flex items-center space-x-5">
                                <div className="flex-shrink-0">
                                    <div className="relative">
                                        <img className="h-16 w-16 rounded-full" src={productivityData.user.avatar} alt="" />
                                        <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-gray-700">
                                        {productivityData.user.first_name} {' '} {productivityData.user.last_name}
                                    </div>
                                    <div className="text-sm text-gray-500">Member since
                                        <span className="text-gray-900 mx-1">
                                        <ReactTimeAgo date={new Date(productivityData.member_since)} locale="en-US" timeStyle="twitter" />
                                    </span>
                                    - 
                                    <span className="text-gray-900 mx-1">
                                        {productivityData.user.vendor}
                                    </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex xl:justify-end lg:justify-end md:justify-end sm:justify-start xs:justify-start pt-6">
                                <Listbox value={dateSelected} onChange={setDateSelected}>
                                    {({ open }) => (
                                        <>
                                        <div className="relative" style={{width:'340px'}}>
                                            <Listbox.Button className="relative w-full cursor-default rounded-md 
                                                                        bg-white py-2 px-3 pr-8 text-left
                                                                        shadow-sm border-gray-200 border focus:border-gray-200 focus:ring-0 focus:outline-none
                                                                        text-lg font-medium leading-6 text-gray-900">
                                                <span className="block truncate">
                                                    {dateSelected.name}
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                                    <ChevronDownIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
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
                                                                            ring-black ring-opacity-5 focus:outline-none text-sm">
                                                    {dateOptions.map((sort) => (
                                                        <Listbox.Option
                                                            key={sort.id}
                                                            className={({ active }) =>
                                                                    classNames(active ? 'text-white bg-red-600' : 'text-gray-900',
                                                                            'relative select-none py-2 pl-3 pr-9 cursor-pointer text-md')}
                                                            value={sort}>
                                                            {({ selected, active }) => (
                                                                <>
                                                                    <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate text-md')}>
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
                        </div>

                        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1
                                        gap-8 gap-y-12 gap-x-28 my-8">
                            <div>
                                <div className="space-y-6 lg:col-span-2 lg:col-start-1">
                                    <section>
                                        <div className="">
                                        <div className="py-2 border-b border-gray-200 pb-3">
                                            <h2 className="text-lg font-medium tracking-tight">
                                                General Stats
                                            </h2>
                                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Checkout the overall statistics.</p>
                                        </div>
                                        <div className="pt-2">
                                            <dl className="grid grid-cols-2 gap-y-6">
                                            <div className="">
                                                <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
                                                <dd className="mt-1 text-sm text-green-600 font-medium">${productivityData.total_revenue.toLocaleString()}</dd>
                                            </div>
                                            <div className="">
                                                <dt className="text-sm font-medium text-gray-500">Services Completed</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{productivityData.services_completed}</dd>
                                            </div>
                                            <div className="">
                                                <dt className="text-sm font-medium text-gray-500">Jobs Completed</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{productivityData.jobs_completed}</dd>
                                            </div>
                                            <div className="">
                                                <dt className="text-sm font-medium text-gray-500">Retainers Completed</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{productivityData.retainers_completed}</dd>
                                            </div>
                                            <div className="">
                                                <dt className="text-sm font-medium text-gray-500">Photos Uploaded</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{productivityData.photos_uploaded}</dd>
                                            </div>
                                            <div className="">
                                                <dt className="text-sm font-medium text-gray-500">Comments Created</dt>
                                                <dd className="mt-1 text-sm text-gray-900">{productivityData.comments_created}</dd>
                                            </div>
                                            <div className="">
                                                <dt className="text-sm font-medium text-gray-500">Lastest Service</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {productivityData.last_service_date ? (
                                                        <ReactTimeAgo date={new Date(productivityData.last_service_date)} locale="en-US" timeStyle="twitter" />
                                                    ): 'None'}
                                                </dd>
                                            </div>
                                            <div className="">
                                                <dt className="text-sm font-medium text-gray-500">Lastest Retainer</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    {productivityData.last_retainer_service_date ? (
                                                        <ReactTimeAgo date={new Date(productivityData.last_retainer_service_date)} locale="en-US" timeStyle="twitter" />
                                                    ): 'None'}
                                                </dd>
                                            </div>
                                            
                                            </dl>
                                        </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                            <div className="">
                                <div className="py-2 border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-medium tracking-tight">
                                        Top 5 Airports
                                    </h2>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Airports where services have been completed.</p>
                                </div>
                                <div className="pr-2 text-gray-500">
                                    {productivityData.top_five_airports.length === 0 && (
                                        <div className="m-auto text-sm text-center mt-20">No airports found.</div>
                                    )}

                                    {productivityData.top_five_airports.map((airport, index) => (
                                        <div key={index} className="m-auto max-w-sm">
                                            <div className="flex justify-between py-3 text-sm gap-3">
                                                <div className="truncate overflow-ellipsis w-64" >{airport.job__airport__name}</div>
                                                <div className="text-right">
                                                    <div>
                                                        <span className="font-medium">{airport.count}</span> <span className="text-xs">times</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1
                                        gap-8 gap-y-12 gap-x-28 my-8 xl:pt-8">
                            <div className="">
                                <div className="text-lg font-medium tracking-tight">Top 5 Services</div>
                                <div className="pr-2 text-gray-500">
                                    {productivityData.top_five_services.length === 0 && (
                                        <div className="m-auto text-sm text-center mt-20">No services found.</div>
                                    )}
                                    {productivityData.top_five_services.map((service, index) => (
                                        <div key={index}>
                                        <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                                            <div className="truncate overflow-ellipsis w-64" >{service.name}</div>
                                            <div className="text-right">
                                                <div>
                                                    <span className="font-medium">{service.total}</span> <span className="text-xs">times</span>
                                                </div>
                                                <div>{service.percentage + '%'}</div>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                                            <div className="h-1.5 rounded-full bg-blue-500" style={{width: service.percentage + '%'}}></div>
                                        </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="">
                                <div className="text-lg font-medium tracking-tight">Top 5 Retainers</div>
                                <div className="pr-2 text-gray-500">
                                    {productivityData.top_five_retainer_services.length === 0 && (
                                        <div className="m-auto text-sm text-center mt-20">No retainers found.</div>
                                    )}
                                    {productivityData.top_five_retainer_services.map((service, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                                            <div className="truncate overflow-ellipsis w-64" >{service.name}</div>
                                            <div className="text-right">
                                                <div>
                                                <span className="font-medium">{service.total}</span> <span className="text-xs">times</span>
                                                </div>
                                                <div>{service.percentage + '%'}</div>
                                            </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4 ">
                                            <div className="h-1.5 rounded-full bg-blue-500" style={{width: service.percentage + '%'}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1
                                        gap-8 gap-y-8 gap-x-28 my-8 xl:pt-8">
                            <div>
                                <div className="pt-2 border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-medium tracking-tight">
                                        Recent Services
                                    </h2>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Data gathered from the last 50 completed services.</p>
                                </div>
                                <div className="pr-2 text-gray-500">
                                    {productivityData.recent_service_stats.length === 0 && (
                                        <div className="m-auto text-sm text-center mt-20">No services found.</div>
                                    )}
                                    
                                    {productivityData.recent_service_stats.map((service, index) => (
                                        <div key={index} className="border-b border-gray-200">
                                            <div className="truncate overflow-ellipsis w-80 font-medium pt-4 text-sm" >{service.service}</div>
                                            <div className="grid grid-cols-2 text-sm px-6 py-2 pb-4">
                                                {service.stats.map((stat, index) => (
                                                    <>
                                                    <div>{stat.aircraft}</div>
                                                    <div className="text-right font-medium">
                                                        {stat.time_to_complete} <span className="ml-1 text-xs text-gray-500 font-normal">avg</span>
                                                    </div>
                                                    </>
                                                ))}  
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="">
                                <div className="py-2 border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-medium tracking-tight">
                                        Top 5 Aircrafts
                                    </h2>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Aircrafts where services have been completed.</p>
                                </div>
                                <div className="pr-2 text-gray-500">
                                    {productivityData.top_five_aircraft_types.length === 0 && (
                                        <div className="m-auto text-sm text-center mt-20">No aircrafts found.</div>
                                    )}
                                    
                                    {productivityData.top_five_aircraft_types.map((aircraft, index) => (
                                        <div key={index} className="m-auto max-w-sm">
                                            <div className="flex justify-between py-3 pb-1 text-sm gap-3">
                                            <div className="truncate overflow-ellipsis w-64" >{aircraft.job__aircraftType__name}</div>
                                            <div className="text-right">
                                                <div>
                                                <span className="font-medium">{aircraft.count}</span> <span className="text-xs">times</span>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        


                    </div>
                )}

            </div>
        </AnimatedPage>
    )
}

export default UserProductivity