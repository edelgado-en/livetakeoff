import { useEffect, useState, Fragment } from 'react'
import { useParams, useNavigate, Outlet, Link, useLocation } from "react-router-dom"
import AnimatedPage from "../../components/animatedPage/AnimatedPage"

import { ArrowLeftIcon, InformationCircleIcon, ClockIcon, CashIcon } from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";
import { Menu, Transition } from '@headlessui/react'

import JobInfo from "./JobInfo"
import JobPriceBreakdown from './JobPricebreakdown';
import Loader from '../../components/loader/Loader';

import * as api from './apiService'
import axios from 'axios';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const JobReview = () => {
    const { jobId } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [downloadLoading, setDownloadLoading] = useState(false)
    const [jobDetails, setJobDetails] = useState({})
    const [errorMessage, setErrorMessage] = useState(null)
    const location = useLocation()

    useEffect(() => {
        getJobDetails()
        navigate('photos')
    }, [])

    const getJobDetails = async () => {
        setLoading(true)

        try {
            const { data } = await api.getJobDetails(jobId)

            setJobDetails(data);

            setLoading(false)

        } catch (error) {
            setLoading(false)

            if (error.response?.status === 403) {
                setErrorMessage('You do not have permission to view this job.')
            } else {
                setErrorMessage('Unable to load job details.')
            }
        }

    }

    const getJobCloseout = async () => {
        setDownloadLoading(true)
        
        try {
            axios({
                url: `/api/jobs/closeout/${jobId}/`,
                method: 'GET',
                responseType: 'blob', // important
              }).then((response) => {
                  setDownloadLoading(false)
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${jobDetails?.customer.name.replace(/\s/g, '')}_${jobDetails?.purchase_order}_closeout.pdf`);
                document.body.appendChild(link);
                link.click();
              });


        } catch (err) {
            setDownloadLoading(false)
        }
    }

    const invoiceJob = async () => {
        await api.invoiceJob(jobId, { 'status': 'I' })

        navigate(0)
    }

    return (
        <AnimatedPage>
            <main className="mx-auto px-4 pb-16 lg:pb-12 max-w-6xl -mt-3">
                <div className="flex flex-wrap gap-2">
                    <div>
                        <Link to="/completed" className="text-xs leading-5 font-semibold bg-slate-400/10
                                                        rounded-full p-2 text-slate-500
                                                        flex items-center space-x-2 hover:bg-slate-400/20
                                                        dark:highlight-white/5">
                            <ArrowLeftIcon className="flex-shrink-0 h-4 w-4 cursor-pointer"/>
                        </Link>
                    </div>
                    <div className="pb-4">
                        <h1 className="text-2xl font-semibold text-gray-600">Job Review</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Ensure all the photos and details are correct before creating a closeout.
                        </p>
                    </div>
                    <div className="flex-1 justify-end text-right">
                        {jobDetails.status === 'C' && (
                            <button
                                type="button"
                                disabled={downloadLoading}
                                onClick={() => invoiceJob()}
                                className="inline-flex items-center rounded-md border mr-2
                                        border-gray-300 bg-white px-3 py-2 text-xs font-medium 
                                        text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                        focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Invoice
                            </button>    
                        )}
                        <button
                            type="button"
                            disabled={downloadLoading}
                            onClick={() => getJobCloseout()}
                            className="inline-flex items-center justify-center 
                                        rounded-md border border-transparent bg-red-600 px-3 py-2
                                        text-xs font-medium text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500
                                        focus:ring-offset-2 sm:w-auto"
                        >
                            {downloadLoading ? 'generating...' : 'Closeout'}
                        </button>
                        <Menu as="div" className="relative inline-block text-left top-2 ml-2">
                            <div>
                                <Menu.Button className="flex items-center rounded-full
                                                    bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2
                                                        focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-100" style={{ padding: '2px' }}>
                                    <span className="sr-only">Open options</span>
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 cursor-pointer ">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                    </svg>
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-40
                                                    origin-top-right rounded-md bg-white shadow-lg ring-1
                                                        ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="photos"
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                            )}
                                            >
                                                <div className="flex space-x-3">
                                                    <InformationCircleIcon className="h-4 w-4 text-gray-500"/>
                                                    <div>Details</div>
                                                </div>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                            to="edit"
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm'
                                        )}
                                        >
                                            <div className="flex space-x-3">
                                                <PencilIcon className="h-4 w-4 text-gray-500"/>
                                                <div>Edit</div>
                                            </div>
                                        </Link>
                                    )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="activity"
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                            )}
                                            >
                                                <div className="flex space-x-3">
                                                    <ClockIcon className="h-4 w-4 text-gray-500"/>
                                                    <div>Activity</div>
                                                </div>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="comments"
                                                className={classNames(
                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                    'block px-4 py-2 text-sm'
                                            )}
                                            >
                                                <div className="flex space-x-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                                    </svg>
                                                    <div>Comments</div>
                                                </div>
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    
                                </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
                
                {!location.pathname.includes("edit") 
                        && !location.pathname.includes("activity")
                        && !location.pathname.includes("comments")
                        && !downloadLoading && (
                    <>
                    <JobInfo />
                    {jobDetails.is_auto_priced && (
                        <JobPriceBreakdown />
                    )}
                    </>
                )}


                {downloadLoading ? 
                    <div className="text-gray-500 text-center">
                        <Loader />
                        <div>Generating closeout PDF.</div>
                        <div>This might take several seconds depending on photos. Please wait...</div> 
                    </div>
                    :
                    <div className="max-w-5xl px-2">
                        <Outlet />
                    </div>
                }
                <div className="py-20"></div>

            </main>

        </AnimatedPage>
    )
}

export default JobReview