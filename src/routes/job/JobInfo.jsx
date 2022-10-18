
import { useEffect, useState } from "react"
import { Link, useParams, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/outline";
import { toast } from 'react-toastify';
import * as api from './apiService'

import Loader from "../../components/loader/Loader";
import JobCompleteModal from './JobCompleteModal'
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../routes/userProfile/userSlice";


const JobInfo = () => {
    const { jobId } = useParams();
    const [loading, setLoading] = useState(false)
    const [jobDetails, setJobDetails] = useState({})
    const [errorMessage, setErrorMessage] = useState(null)
    const [isCompleteJobModalOpen, setCompleteJobModalOpen] = useState(false)
    const currentUser = useAppSelector(selectUser)
    const navigate = useNavigate();

    useEffect(() => {
        getJobDetails()
    }, [])

    const handleToggleJobCompleteModal = () => {
        setCompleteJobModalOpen(!isCompleteJobModalOpen)
    }

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

    // it could W(Work In Progress) or C(completed)
    const updateJobStatus = async (status) => {
        try {
            await api.updateJobStatus(jobId, status)

            const updatedJobDetails = {
                ...jobDetails,
                status,
                service_assignments: jobDetails.service_assignments?.map((s) => {
                    s = {...s, status}
                    return s;
                }),
                retainer_service_assignments: jobDetails.retainer_service_assignments?.map((s) => {
                    s = {...s, status}
                    return s;
                })
            }

            setJobDetails(updatedJobDetails)

            setCompleteJobModalOpen(false)

            if (status === 'C') {
                navigate('/jobs')
            }

        } catch (e) {
        }
    }

    const completeService = async (service_assignment_id) => {
        try {
            await api.completeServiceAssignment(service_assignment_id)

            const updatedJobDetails = { ...jobDetails, service_assignments: jobDetails.service_assignments?.map((service) => {
                                                    if (service.id === service_assignment_id) {
                                                        service = {...service, status: 'C'}
                                                    }

                                                    return service;
            })}

            setJobDetails(updatedJobDetails);

        } catch (e) {
        
        }
    }

    const completeRetainerService = async (retainer_service_assignment_id) => {
        try {
            await api.completeRetainerServiceAssignment(retainer_service_assignment_id)

            const updatedJobDetails = { ...jobDetails, retainer_service_assignments: jobDetails.retainer_service_assignments?.map((service) => {
                                                    if (service.id === retainer_service_assignment_id) {
                                                        service = {...service, status: 'C'}
                                                    }

                                                    return service;
            })}

            setJobDetails(updatedJobDetails);

        } catch (e) {
            
        }
    }

    return (
        <AnimatedPage>
            {loading && <Loader />}
            
            {!loading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}

            {!loading && errorMessage == null && (
                <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-row">
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold text-gray-600">Job Details</h1>
                    </div>
                </div>
                <div className="mt-4 mb-8">
                    {jobDetails.status === 'S' && 
                        <button
                            type="button"
                            onClick={() => updateJobStatus('W')}
                            className="inline-flex items-center justify-center rounded-md
                                    border border-transparent bg-red-600 px-4 py-2 text-sm
                                    font-medium text-white shadow-sm hover:bg-red-700
                                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto">
                            Accept Job
                        </button>
                    }

                    {jobDetails.status === 'W' && 
                        <button
                            type="button"
                            /* onClick={() => updateJobStatus('C')} */
                            onClick={() => handleToggleJobCompleteModal()}
                            className="inline-flex items-center justify-center rounded-md
                                    border border-transparent bg-red-600 px-4 py-2 text-sm
                                    font-medium text-white shadow-sm hover:bg-red-700
                                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto">
                            Complete Job
                        </button>
                    }
                
                </div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Purchase Order</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.purchase_order ? jobDetails.purchase_order : 'None'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd>
                            <div className={`mt-1 text-sm text-white rounded-md py-1 px-2 inline-block
                                        ${jobDetails.status === 'A' && 'bg-blue-500'}
                                        ${jobDetails.status === 'S' && 'bg-yellow-500 '}
                                        ${jobDetails.status === 'U' && 'bg-indigo-500 '}
                                        ${jobDetails.status === 'W' && 'bg-green-500 '}
                                        ${jobDetails.status === 'R' && 'bg-purple-500 '}
                                        `} >
                                {jobDetails.status === 'A' && 'Accepted'}
                                {jobDetails.status === 'S' && 'Assigned'}
                                {jobDetails.status === 'U' && 'Submitted'}
                                {jobDetails.status === 'W' && 'Work In Progress'}
                                {jobDetails.status === 'C' && 'Complete'}
                                {jobDetails.status === 'T' && 'Cancelled'}
                                {jobDetails.status === 'R' && 'Review'}
                                {jobDetails.status === 'I' && 'Invoiced'}
                            </div>
                        </dd>
                    </div>
                    {!currentUser.isProjectManager && !currentUser.isCustomer && (
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Customer</dt>
                            <dd className="mt-1 text-sm text-gray-900">{jobDetails.customer?.name}</dd>
                        </div>
                    )}
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Tail Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.tailNumber}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Aircraft Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.aircraftType?.name}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">FBO</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.fbo?.name}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Airport</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.airport?.name}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Request Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.requestDate}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Estimated Arrival</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.estimatedETA ? jobDetails.estimatedETA : 'None'}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Complete By</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {jobDetails.completeBy ? jobDetails.completeBy 
                            : <span
                            className="relative inline-flex items-center
                                       rounded-full border border-gray-300 px-2 py-0.5">
                            <div className="absolute flex flex-shrink-0 items-center justify-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            </div>
                            <div className="ml-3 text-sm text-gray-700">Pending</div>
                          </span>}
                        </dd>
                    </div>
                    
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Estimated Departure</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.estimatedETD ? jobDetails.estimatedETD : 'None'}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Special Instructions</dt>
                        <dd className="mt-1 max-w-prose space-y-5 text-sm text-gray-900">
                            {jobDetails.special_instructions?.length === 0 && 'None'}

                            {jobDetails.special_instructions}
                        </dd>
                    </div>
                </dl>
                <div className="mx-auto mt-8 max-w-5xl pb-8">
                    <h2 className="text-sm font-medium text-gray-500">Services</h2>
                    <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {jobDetails.service_assignments?.length === 0 &&
                            <div className="text-sm text-gray-500">None</div>
                        }

                        {jobDetails.service_assignments?.map((service) => (
                            <div
                                key={service.id}
                                className="relative flex space-x-3 rounded-lg
                                        border border-gray-300 bg-white px-6 py-5 shadow-sm
                                        hover:border-gray-400">
                                <div className="min-w-0 flex-1">
                                    <div className="focus:outline-none">
                                        <div className="grid grid-cols-3 text-sm pb-2">
                                            <div className="col-span-2 font-medium text-gray-900 relative top-1">
                                                {service.name}

                                            </div>
                                            <div className="text-right">
                                                {service.status === 'W' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => completeService(service.id)}
                                                        className="inline-flex items-center rounded border
                                                                    border-gray-300 bg-white px-2.5 py-1.5 text-xs
                                                                    font-medium text-gray-700 shadow-sm hover:bg-gray-50
                                                                    focus:outline-none cursor-pointer focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                                        Complete
                                                    </button>
                                                )}

                                                {service.status === 'C' && (
                                                    <div className="flex-shrink-0 flex justify-end">
                                                        <CheckCircleIcon className="h-6 w-6 text-red-400" />
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                        
                                        {!currentUser.isProjectManager && !currentUser.isCustomer && (
                                            <div className="text-xs mb-4 relative inline-flex items-center
                                                            rounded-full border border-gray-300 px-2 py-0.5">
                                                {service.project_manager}
                                            </div>
                                        )}

                                        {service.checklist_actions?.map((action) => (
                                            <div key={action.id} className="text-sm text-gray-500 py-1">{action.name}</div>
                                        ))}
                                    </div>
                                </div>
                            
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mx-auto max-w-5xl pb-12">
                    <h2 className="text-sm font-medium text-gray-500">Retainer Services</h2>
                    <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {jobDetails.retainer_service_assignments?.length === 0 &&
                            <div className="text-sm text-gray-500">None</div>
                        }
                        
                        {jobDetails.retainer_service_assignments?.map((service) => (
                            <div
                                key={service.id}
                                className="relative flex items-center space-x-3 rounded-lg
                                        border border-gray-300 bg-white px-6 py-5 shadow-sm
                                        hover:border-gray-400">
                                <div className="min-w-0 flex-1">
                                    <div className="">
                                        <div className="grid grid-cols-3 text-sm pb-2">
                                            <div className="col-span-2 font-medium text-gray-900 relative top-1">{service.name}</div>
                                            <div className="text-right">
                                                {service.status === 'W' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => completeRetainerService(service.id)}
                                                        className="inline-flex items-center rounded border
                                                                border-gray-300 bg-white px-2.5 py-1.5 text-xs
                                                                font-medium text-gray-700 shadow-sm hover:bg-gray-50
                                                                focus:outline-none cursor-pointer focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                                        Complete
                                                    </button>    
                                                )}

                                                {service.status === 'C' && (
                                                    <div className="flex-shrink-0 flex justify-end">
                                                        <CheckCircleIcon className="h-6 w-6 text-red-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {!currentUser.isProjectManager && !currentUser.isCustomer && (
                                            <div className="text-xs mb-4 relative inline-flex items-center
                                                            rounded-full border border-gray-300 px-2 py-0.5">
                                                {service.project_manager}
                                            </div>
                                        )}
                                            
                                        {service.checklist_actions?.map((action) => (
                                                <div key={action.id} className="text-sm text-gray-500 py-1">{action.name}</div>
                                        ))}
                                    </div>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}

            {isCompleteJobModalOpen && <JobCompleteModal
                                            isOpen={isCompleteJobModalOpen}
                                            jobDetails={jobDetails}
                                            handleClose={handleToggleJobCompleteModal}
                                            updateJobStatus={updateJobStatus} />}

        </AnimatedPage>
    )
}

export default JobInfo;