import { useEffect, useState, Fragment } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom";

import AnimatedPage from "../../../components/animatedPage/AnimatedPage"

import Loader from "../../../components/loader/Loader";

import * as api from './apiService'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const ServicesByAirport = () => {
    const [servicesBreakdown, setServicesBreakdown] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getServicesBreakdown()
    }, [])

    const getServicesBreakdown = async () => {
        try {
            const { data } = await api.getServicesByAirport()

            setServicesBreakdown(data)

            setLoading(false)

        } catch (error) {
            toast('Unable to get services')
            setLoading(false)
        }
    }

    return (
        <AnimatedPage>
            <article className="m-auto  px-6" style={{maxWidth: '1600px'}}>
                <div className="flex flex-wrap justify-between text-sm">
                    <div className="pb-4">
                        <span className="text-2xl font-semibold text-gray-700">Services by Airport</span>
                        <p className="text-gray-500 mt-1">Checkout how your services are distribute across different airports.</p>
                    </div>
                </div>

                <h3 className="text-xl font-medium leading-6 text-gray-900 py-2">Today</h3>

                {loading && <Loader />}

                {!loading && (
                    <div className="grid  xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2
                                     sm:grid-cols-1 xs:grid-cols-1 gap-5  gap-x-12">
                        <div className="relative overflow-hidden rounded-lg
                                      bg-white pt-5">
                            <dt className="flex gap-4">
                                <div className="h-9 w-9 rounded-md flex items-center justify-center ring-8 ring-white bg-sky-500 relative top-1">
                                    <span className="text-white">A</span>
                                </div>
                                <div className="text-sm">
                                    <div className="text-base font-medium text-gray-900">Accepted</div>
                                    <div className="text-gray-500 text-sm">{servicesBreakdown?.accepted?.total_services} Services</div>
                                </div>
                            </dt>
                            <div className="text-sm text-gray-500 mt-2">
                                {servicesBreakdown?.accepted?.airport_data?.map((airport, index) => (
                                    <div key={index} className="pb-12">
                                        <div className="flex justify-between py-3  gap-4">
                                            <div className="flex-1 text-gray-900 w-60 font-medium truncate overflow-ellipsis">{airport.name}</div>
                                            <div className="text-right">
                                                <span className="bg-gray-100 text-gray-700 py-0.5 px-1.5
                                                                    rounded-full text-xs font-medium md:inline-block">
                                                    {airport.count}
                                                </span>
                                            </div>
                                        </div>
                                        {airport.services.map((service, index) => (
                                            <div key={index} className="flex gap-3 border-b border-gray-200 py-3">
                                                <div className="flex-1 w-60 truncate overflow-ellipsis">{service.name}</div>
                                                <div className="text-right" style={{paddingRight: '2px'}}>
                                                    {service.count}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    
                        <div className="relative overflow-hidden rounded-lg bg-white
                                          pt-5 sm:px-6 sm:pt-6">
                            <dt className="flex gap-4">
                                <div className="h-9 w-9 rounded-md flex items-center justify-center ring-8 ring-white bg-yellow-500 relative top-1">
                                    <span className="text-white">S</span>
                                </div>
                                <div className="text-sm">
                                    <div className="text-base font-medium text-gray-900">Assigned</div>
                                    <div className="text-gray-500 text-sm">{servicesBreakdown?.assigned?.total_services} Services</div>
                                </div>
                            </dt>
                            <div className="text-sm text-gray-500 mt-2">
                                {servicesBreakdown?.assigned?.airport_data?.map((airport, index) => (
                                    <div key={index} className="pb-12">
                                        <div className="flex justify-between py-3 gap-4">
                                            <div className="flex-1 text-gray-900 w-60 font-medium truncate overflow-ellipsis">{airport.name}</div>
                                            <div className="text-right">
                                                <span className="bg-gray-100 text-gray-700 py-0.5 px-1.5
                                                                    rounded-full text-xs font-medium md:inline-block">
                                                    {airport.count}
                                                </span>
                                            </div>
                                        </div>
                                        {airport.services.map((service, index) => (
                                            <div key={index} className=" border-b border-gray-200 py-2">
                                                <div className="grid grid-cols-9">
                                                    <div className="col-span-5">
                                                        <div className="flex w-44 truncate overflow-ellipsis text-sm relative top-1">
                                                            {service.name}
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <div className="flex -space-x-1 overflow-hidden justify-end ">
                                                            {service.users?.map((user) => (
                                                                <Fragment key={user.username}>
                                                                    <img
                                                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                                                    src={'https://res.cloudinary.com/datidxeqm/image/upload/v1/' + user.avatar} 
                                                                    alt={user.username}
                                                                    />
                                                                </Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 text-right text-gray-900 relative top-1" style={{paddingRight: '2px'}}>
                                                        {service.count}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-lg bg-white
                                          pt-5 pb-12 sm:px-6 sm:pt-6">
                            <dt className="flex gap-4">
                                <div className="h-9 w-9 rounded-md flex items-center justify-center ring-8 ring-white bg-green-500 relative top-1">
                                    <span className="text-white">W</span>
                                </div>
                                <div className="text-sm">
                                    <div className="text-base font-medium text-gray-900">Work In Progress</div>
                                    <div className="text-gray-500 text-sm">{servicesBreakdown?.wip?.total_services} Services</div>
                                </div>
                            </dt>
                            <div className="text-sm text-gray-500 mt-2">
                                {servicesBreakdown?.wip?.airport_data?.map((airport, index) => (
                                    <div key={index} className="pb-12">
                                       <div className="flex justify-between py-3 gap-4">
                                            <div className="flex-1 text-gray-900 w-60 font-medium truncate overflow-ellipsis">{airport.name}</div>
                                            <div className="text-right">
                                                <span className="bg-gray-100 text-gray-700 py-0.5 px-1.5
                                                                    rounded-full text-xs font-medium md:inline-block">
                                                    {airport.count}
                                                </span>
                                            </div>
                                        </div>
                                        {airport.services.map((service, index) => (
                                            <div key={index} className=" border-b border-gray-200 py-2">
                                                <div className="grid grid-cols-9">
                                                    <div className="col-span-5">
                                                        <div className="flex w-44 truncate overflow-ellipsis text-sm relative top-1">
                                                            {service.name}
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3">
                                                        <div className="flex -space-x-1 overflow-hidden justify-end ">
                                                            {service.users?.map((user) => (
                                                                <Fragment key={user.username}>
                                                                    <img
                                                                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                                                    src={'https://res.cloudinary.com/datidxeqm/image/upload/v1/' + user.avatar}
                                                                    alt={user.username}
                                                                    />
                                                                </Fragment>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="col-span-1 text-right text-gray-900 relative top-1" style={{paddingRight: '2px'}}>
                                                        {service.count}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                
            </article>
        </AnimatedPage>
    )
}

export default ServicesByAirport;