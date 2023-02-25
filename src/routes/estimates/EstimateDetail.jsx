import { useEffect, useState } from "react"
import { Link, useParams, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CheckCircleIcon, QuestionMarkCircleIcon, ArrowRightIcon, ShareIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import * as api from './apiService'
import { toast } from "react-toastify";
import { Popover } from '@headlessui/react'
import logo from '../../images/logo_red-no-text.png'

import ReactTimeAgo from 'react-time-ago'

import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";


const EstimateDetail = () => {
    const [loading, setLoading] = useState(true)
    const [estimateDetails, setEstimateDetails] = useState(null)
    const [isCopied, setIsCopied] = useState(false)
    const [estimateProcessed, setEstimateProcessed] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()

    useEffect(() => {
        getEstimate()
    }, [])

    const getEstimate = async () => {
        setLoading(true)

        try {
            const { data } = await api.getEstimateDetail(id)

            setEstimateDetails(data);

            setLoading(false)

        } catch (error) {
            setLoading(false)
            toast.error('Unable to load estimate')
        }
    }

    const handleCopyClick = () => {
        const copyText = 'https://www.livetakeoff.com/shared/estimates/' + estimateDetails.encoded_id + '/';

        copyTextToClipboard(copyText)
            .then(() => {
                // If successful, update the isCopied state value
                setIsCopied(true);
                setTimeout(() => {
                    setIsCopied(false);
                }, 1500);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const copyTextToClipboard = async (text) => {
        if ('clipboard' in navigator) {
          return await navigator.clipboard.writeText(text);
        } else {
          return document.execCommand('copy', true, text);
        }
    }

    return (
        <AnimatedPage>
            {loading && <Loader />}

            {!loading && (
                <div className="mt-4 m-auto max-w-4xl px-4">
                    <div className="grid grid-cols-2 gap-2 pb-10">
                        <div>
                            <img
                                className="block h-20 w-auto"
                                src={logo}
                                alt="Livetakeoff logo"
                            />
                        </div>
                        <div className="text-right text-sm text-gray-500">
                            <div className="text-xl font-medium text-gray-700">LiveTakeoff</div>
                            <div>750 SW 34th ST, Suite 209</div>
                            <div>Fort Lauderdale Florida 33315</div>
                        </div>
                    </div>

                    {estimateProcessed && (
                        <div className="py-36 w-full text-center">
                            <div className="flex justify-center pb-2">
                                <CheckCircleIcon className="h-8 w-8 text-green-400" aria-hidden="true" />
                            </div>
                            <div className="font-medium">Thank you!</div>
                            {estimateDetails?.requested_by?.username} has been notified.    
                        </div>
                    )}

                    {!estimateProcessed && (
                        <>
                        <div className="flex justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-600">Job Estimate</h1>
                            </div>
                            {(estimateDetails?.status === 'A' || estimateDetails?.status === 'R') && (
                                <div className={`text-sm text-white rounded-md py-1 px-2
                                            ${estimateDetails.status === 'A' && 'bg-green-500 '}
                                            ${estimateDetails.status === 'R' && 'bg-gray-500 '}
                                            `}>
                                    <div className="relative font-medium" style={{top: '2px'}}>
                                        {estimateDetails.status === 'A' && 'Accepted'}
                                        {estimateDetails.status === 'R' && 'Rejected'}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
                            <div>
                                <div className="flex space-x-3 space-y-3 pb-8 pt-6">
                                    {estimateDetails?.customer.logo ? 
                                        <img
                                        className="h-10 w-10 rounded-full relative top-3"
                                        src={estimateDetails.customer.logo}
                                        alt=""
                                    />
                                        :
                                        <div className="flex relative top-3">
                                            <span className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
                                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </span>
                                        </div>
                                    }
                                    <div className="">
                                        <div className="font-medium text-sm">
                                        {estimateDetails?.customer.name}
                                        </div>
                                        <div className="text-sm text-gray-500">{estimateDetails?.customer.emailAddress}</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-700 xl:text-right xs:text-left pb-2">Requested by</div>
                                <div className="flex xl:justify-end xs:justify-start space-x-3 space-y-3">
                                    {estimateDetails?.requested_by.profile?.avatar ? 
                                        <img
                                        className="h-10 w-10 rounded-full"
                                        src={estimateDetails.requested_by.profile.avatar}
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
                                    <div className="text-sm font-medium text-gray-700">
                                        {estimateDetails?.requested_by.first_name} {' '} {estimateDetails?.requested_by.last_name}
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 max-w-5xl px-2 pb-10">
                            <div className="mt-8">
                                <div className="flex justify-between text-xs">
                                    <div className="text-sm text-gray-700">
                                        <span className="font-medium">{estimateDetails?.aircraftType?.name}</span>  <span className="ml-1 text-gray-500">at {estimateDetails?.airport?.initials}</span>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-sm text-gray-700">Services</h3>
                                    <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                                        {estimateDetails?.services?.map((service) => (
                                            <div key={service.id} className="flex justify-between py-2 text-xs hover:bg-gray-50">
                                                <dt className="text-gray-700 pr-2 truncate">{service.name}</dt>
                                                <dd className="whitespace-nowrap text-gray-900">${service.price}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    {estimateDetails?.show_totals && (
                                        <div className="flex justify-end py-2 text-xs mt-1">
                                                <dt className="text-gray-500 pr-2 text-right font-medium">Subtotal</dt>
                                                <dd className="whitespace-nowrap text-gray-900">${estimateDetails?.services_price.toLocaleString()}</dd>
                                        </div>
                                    )}
                                </div>
                                    
                                {estimateDetails?.job_estimate_discounts?.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-sm text-gray-700">Discounts Applied</h3>
                                        <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                                            {estimateDetails.job_estimate_discounts.map((discount, index) => (
                                                <div key={index} className="flex justify-between py-2 text-xs hover:bg-gray-50">
                                                    <dt className="text-gray-700 pr-2 truncate">
                                                        {discount.type === 'S' ? 'By Service' : ''}
                                                        {discount.type === 'A' ? 'By Airport' : ''}
                                                        {discount.type === 'G' ? 'General' : ''}
                                                    </dt>
                                                    <dd className="whitespace-nowrap text-gray-900">
                                                        {!discount.percentage ? '$' : ''}
                                                        {discount.amount}
                                                        {discount.percentage ? '%' : ''}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                        {estimateDetails?.show_totals && (
                                            <div className="flex justify-end py-2 text-xs mt-1">
                                                <dt className="text-gray-500 pr-2 text-right font-medium">Subtotal</dt>
                                                <dd className="whitespace-nowrap text-gray-900">${estimateDetails?.discounted_price.toLocaleString()}</dd>
                                            </div>
                                        )}
                                    </div>  
                                )}
                                    
                                    
                                {estimateDetails?.job_estimate_additional_fees?.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="text-sm text-gray-700">Additional Fees Applied</h3>
                                        <dl className="mt-2 divide-y divide-gray-200 border-b border-gray-200">
                                            {estimateDetails.job_estimate_additional_fees.map((fee, index) => (
                                                <div key={index} className="flex justify-between py-2 text-xs hover:bg-gray-50">
                                                    <dt className="text-gray-700 pr-2 truncate">
                                                        {fee.type === 'A' ? 'By Airport' : ''}
                                                        {fee.type === 'F' ? 'By FBO' : ''}
                                                        {fee.type === 'G' ? 'General' : ''}
                                                    </dt>
                                                    <dd className="whitespace-nowrap text-gray-900">
                                                        {!fee.percentage ? '$' : ''}
                                                        {fee.amount}
                                                        {fee.percentage ? '%' : ''}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                )}

                                {estimateDetails?.show_totals && (
                                    <div className="flex justify-end py-4 text-xs">
                                        <dt className="text-black pr-2 text-right font-bold">Total</dt>
                                        <dd className="whitespace-nowrap text-black font-bold">${estimateDetails?.total_price.toLocaleString()}</dd>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {!location.pathname.includes('shared') && (
                            <div className="pb-8 border-b border-gray-200">
                                <div className="flex justify-between">
                                        <div className="text-sm font-medium text-gray-900 relative top-3">Share this link</div>
                                        <div className="text-right">
                                            <Popover className="relative">
                                                <Popover.Button>
                                                    <div
                                                        onClick={() => handleCopyClick()} 
                                                        className="flex gap-2 rounded-md border border-gray-300 bg-white
                                                                py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                                                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                                    >
                                                        <ShareIcon className="h-4 w-4 relative" style={{top: '2px'}} />
                                                        Share
                                                    </div>
                                                </Popover.Button>

                                                <Popover.Panel className="absolute z-10">
                                                    <div className="bg-gray-600 text-white text-xs py-1 px-2 rounded-md mt-1 relative left-4">copied!</div>
                                                </Popover.Panel>
                                            </Popover>
                                        </div>
                                </div>
                                <div className="text-sm text-gray-500 pt-2">
                                    You can share this link with a client to allow them to view this estimate. He/she can accept or reject it. You will get a SMS notification when he/she does.
                                </div> 
                            </div>
                        )}
                        

                        <div className="text-right">
                            <div className="pb-20 flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => navigate('/estimates')} 
                                    className="flex gap-2 rounded-md border border-gray-300 bg-white
                                            py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Back to Estimates
                                </button>
                                {(!estimateDetails.job && (estimateDetails.status === 'P' || estimateDetails.status === 'A')) && (
                                    <button
                                        onClick={() => navigate(`/create-job/${estimateDetails.id}`)}
                                        type="button"
                                        className="inline-flex items-center justify-center 
                                                rounded-md border border-transparent bg-red-600 px-4 py-2
                                                text-sm font-medium text-white shadow-sm hover:bg-red-700
                                                focus:outline-none focus:ring-2 focus:ring-red-500
                                                focus:ring-offset-2 sm:w-auto"
                                    >
                                        Create Job
                                    </button>
                                )}

                                {(estimateDetails.job && (
                                    <Link
                                        to={`/jobs/${estimateDetails.job.id}/details`} 
                                        className="flex gap-2 rounded-md border border-gray-300 bg-white
                                            py-2 px-4 text-sm font-medium text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        View Job
                                    </Link>
                                ))}
                            </div>
                            
                        </div>
                        </>    
                    )}
                    
                </div>
            )}

        </AnimatedPage>
    )

}

export default EstimateDetail;