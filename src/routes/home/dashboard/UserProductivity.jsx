import { useEffect, useState, Fragment } from 'react'
import { ArrowLeftIcon, UsersIcon, CashIcon, BriefcaseIcon, ArrowSmRightIcon, CheckIcon, ChevronDownIcon} from '@heroicons/react/outline'
import { Listbox, Transition, Menu, Popover, Disclosure, Dialog } from '@headlessui/react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"

import ReactTimeAgo from 'react-time-ago'

import * as api from './apiService'
import AnimatedPage from '../../../components/animatedPage/AnimatedPage'
import Loader from '../../../components/loader/Loader'

const UserProductivity = () => {
    const { id } = useParams();

    const [loading, setLoading] = useState(true)
    const [productivityData, setProductivityData] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        getUserProductivityStats()
    }, [])

    const getUserProductivityStats = async () => {
        
        try {
            const { data } = await api.getUserProductivityStats(id)
            
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
                                                    <ReactTimeAgo date={new Date(productivityData.last_service_date)} locale="en-US" timeStyle="twitter" />
                                                </dd>
                                            </div>
                                            <div className="">
                                                <dt className="text-sm font-medium text-gray-500">Lastest Retainer</dt>
                                                <dd className="mt-1 text-sm text-gray-900">
                                                    <ReactTimeAgo date={new Date(productivityData.last_retainer_service_date)} locale="en-US" timeStyle="twitter" />
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