import { useEffect, useState } from "react"
import { Link, useParams, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CheckCircleIcon, QuestionMarkCircleIcon, ArrowRightIcon, ShareIcon, ArrowLeftIcon } from "@heroicons/react/outline";
import * as api from './apiService'
import { toast } from "react-toastify";
import { Popover } from '@headlessui/react'
import logo from '../../images/logo_red-no-text.png'

import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";


const EstimateDetail = () => {
    const [loading, setLoading] = useState(true)
    const [estimateDetails, setEstimateDetails] = useState(null)
    const [isCopied, setIsCopied] = useState(false);

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
        const copyText = 'https://www.livetakeoff.com/shared/estimates/' + id + '/';

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
                            <div className="text-xl font-medium text-gray-700">Livetakeoff</div>
                            <div>750 SW 34th ST, Suite 209</div>
                            <div>Fort Lauderdale Florida 33315</div>
                        </div>
                    </div>
                    <div className="flex flex-row mb-4">
                        <div className="flex gap-2">
                            {!location.pathname.includes('shared') && (
                                <button onClick={() => navigate(-1)} className="text-xs leading-5 font-semibold bg-slate-400/10
                                    rounded-full p-2 text-slate-500
                                    flex items-center space-x-2 hover:bg-slate-400/20
                                    dark:highlight-white/5">
                                    <ArrowLeftIcon className="flex-shrink-0 h-4 w-4 cursor-pointer"/>
                                </button>
                            )}
                            
                            <h1 className="text-2xl font-semibold text-gray-600">Job Estimate</h1>
                        </div>
                    </div>
                    <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xs:grid-cols-1">
                        <div>
                            <div className="flex space-x-3 space-y-3 pb-8 pt-6">
                                {estimateDetails?.customer.logo ? 
                                    <img
                                    className="h-10 w-10 rounded-full"
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
                                <div className="text-sm text-gray-700">{estimateDetails?.aircraftType.name}</div>
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
                                <div className="flex justify-end py-2 text-xs mt-1">
                                        <dt className="text-gray-500 pr-2 text-right font-medium">Subtotal</dt>
                                        <dd className="whitespace-nowrap text-gray-900">${estimateDetails?.services_price}</dd>
                                </div>
                            </div>
                                
                            {estimateDetails.job_estimate_discounts?.length > 0 && (
                                <div className="mt-2">
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
                                    <div className="flex justify-end py-2 text-xs mt-1">
                                        <dt className="text-gray-500 pr-2 text-right font-medium">Subtotal</dt>
                                        <dd className="whitespace-nowrap text-gray-900">${estimateDetails?.discounted_price}</dd>
                                    </div>
                                </div>  
                            )}
                                
                                
                            {estimateDetails?.job_estimate_additional_fees?.length > 0 && (
                                <div className="mt-2">
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

                            <div className="flex justify-end py-4 text-xs">
                                <dt className="text-gray-500 pr-2 text-right font-medium">Total</dt>
                                <dd className="whitespace-nowrap text-gray-900">${estimateDetails?.total_price}</dd>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        {location.pathname.includes("shared") && !estimateDetails.is_processed && (
                            <>
                                <div className="text-sm pb-4 text-gray-500">This estimate is not a contract or a bill.</div>
                                <div className="font-medium text-sm pb-4">We look forward to working with you!</div>
                                <div className="pb-20 py-8">
                                    <button
                                    type="button"
                                    className="rounded-md border border-gray-300 bg-white
                                            py-2 px-4 text-sm font-medium text-gray-700 shadow-sm mr-6
                                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md 
                                        border border-transparent bg-red-600 py-2 px-4
                                        text-sm font-medium text-white shadow-sm hover:bg-red-600
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                        Accept
                                    </button>
                                </div>
                            </>
                        )}

                        {!location.pathname.includes('shared') && (
                            <div className="pb-20 flex justify-end">
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
                        )}
                        
                    </div>
                </div>
            )}

        </AnimatedPage>
    )

}

export default EstimateDetail;