import { useEffect, useState } from 'react'
import { useParams, useNavigate, Outlet, Link, useLocation } from "react-router-dom"
import AnimatedPage from "../../components/animatedPage/AnimatedPage"

import { ArrowLeftIcon, ClipboardCheckIcon, PhotographIcon, UserAddIcon } from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";

import JobPhotos from "./JobPhotos"
import JobInfo from "./JobInfo"
import Loader from '../../components/loader/Loader';

import * as api from './apiService'
import axios from 'axios';

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
                        <button
                                type="button"
                                onClick={() => navigate('edit')}
                                disabled={downloadLoading}
                                className="inline-flex items-center rounded-md border mr-2 relative top-1
                                        border-gray-300 bg-white px-3 py-2 text-xs font-medium
                                        text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                        focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                            <PencilIcon className="h-4 w-4 text-gray-500 mr-1"/> Edit
                        </button>
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
                    </div>
                </div>
                
                {!location.pathname.includes("edit") && !downloadLoading && (
                    <JobInfo />
                )}

                {downloadLoading ? 
                    <div className="text-gray-500 text-center">
                        <Loader />
                        <div>Generating closeout PDF.</div>
                        <div>This might take several seconds depending on photos. Please wait...</div> 
                    </div>
                    :
                    <Outlet />
                }
                <div className="py-20"></div>

            </main>

        </AnimatedPage>
    )
}

export default JobReview