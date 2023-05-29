
import { useEffect, useState } from "react"
import { Link, useParams, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CheckCircleIcon, TrashIcon, ArrowRightIcon, PencilIcon, PlusIcon } from "@heroicons/react/outline";
import { toast } from 'react-toastify';
import * as api from './apiService'

import { Switch, Popover } from "@headlessui/react";

import Loader from "../../components/loader/Loader";
import JobCompleteModal from './JobCompleteModal'
import JobPriceBreakdownModal from './JobPriceBreakdownModal'
import JobCancelModal from "./JobCancelModal";
import JobReturnModal from "./JobReturnModal";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import AddServiceModal from './AddServiceModal';
import AddRetainerServiceModal from "./AddRetainerServiceModal";

import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../routes/userProfile/userSlice";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const JobInfo = () => {
    const { jobId } = useParams();
    const [loading, setLoading] = useState(false)
    const [jobDetails, setJobDetails] = useState({service_assignments: [], retainer_service_assignments: []})
    const [errorMessage, setErrorMessage] = useState(null)
    const [isCompleteJobModalOpen, setCompleteJobModalOpen] = useState(false)
    const [isCancelJobModalOpen, setIsCancelJobModalOpen] = useState(false)
    const [isReturnJobModalOpen, setReturnJobModalOpen] = useState(false)

    const [isPriceBreakdownModalOpen, setPriceBreakdownModalOpen] = useState(false)

    const [isAddServiceModalOpen, setAddServiceModalOpen] = useState(false)
    const [isAddRetainerServiceModalOpen, setAddRetainerServiceModalOpen] = useState(false)


    const [showActions, setShowActions] = useState(false)
    const currentUser = useAppSelector(selectUser)
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getJobDetails()
    }, [])


    const handleToggleJobCompleteModal = () => {
        setCompleteJobModalOpen(!isCompleteJobModalOpen)
    }

    const handleToggleJobCancelModal = () => {
        setIsCancelJobModalOpen(!isCancelJobModalOpen)
    }

    const handleTogglePriceBreakdownModal = () => {
        setPriceBreakdownModalOpen(!isPriceBreakdownModalOpen)
    }

    const handleToggleJobReturnModal = () => {
        setReturnJobModalOpen(!isReturnJobModalOpen)
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

    // it could W(Work In Progress) or C(completed) or T(Cancelled)
    const updateJobStatus = async (status) => {
        setCompleteJobModalOpen(false)
        setIsCancelJobModalOpen(false)
        
        setLoading(true)

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

            setLoading(false)

            if (status === 'C') {
                navigate('/jobs')
            }

        } catch (e) {
            toast.error('Unable to update job status.')
            setLoading(false)
        }
    }

    const returnJob = async (comment) => {
        setReturnJobModalOpen(false)

        setLoading(true)

        const request = {
            comment
        }

        try {
            await api.returnJob(jobId, request)

            navigate('/jobs')

        } catch (error) {
            toast.error('Unable to return job.')
            setLoading(false)
        }
    }

    const completeService = async (service_assignment_id) => {
        try {
            const { data } = await api.completeServiceAssignment(service_assignment_id)

            const updatedJobDetails = { ...jobDetails, service_assignments: jobDetails.service_assignments?.map((service) => {
                                                    if (service.id === service_assignment_id) {
                                                        service = {...service, status: 'C'}
                                                    }

                                                    return service;
            })}

            setJobDetails(updatedJobDetails);

            if (data.can_complete_job) {
                setCompleteJobModalOpen(true)
            }

        } catch (e) {
        
        }
    }


    const completeRetainerService = async (retainer_service_assignment_id) => {
        try {
            const { data } = await api.completeRetainerServiceAssignment(retainer_service_assignment_id)

            const updatedJobDetails = { ...jobDetails, retainer_service_assignments: jobDetails.retainer_service_assignments?.map((service) => {
                                                    if (service.id === retainer_service_assignment_id) {
                                                        service = {...service, status: 'C'}
                                                    }

                                                    return service;
            })}

            setJobDetails(updatedJobDetails);

            if (data.can_complete_job) {
                setCompleteJobModalOpen(true)
            }

        } catch (e) {
            
        }
    }

    const removeService = async (service) => {
        await api.deleteService(service.id)

        const updatedJobDetails = { ...jobDetails,
                                     service_assignments: jobDetails.service_assignments?.filter((s) => s.id !== service.id) }

        setJobDetails(updatedJobDetails)

    }

    const removeRetainerService = async (service) => {
        await api.deleteRetainerService(service.id)

        const updatedJobDetails = { ...jobDetails,
                                     retainer_service_assignments: jobDetails.retainer_service_assignments?.filter((s) => s.id !== service.id) }

        setJobDetails(updatedJobDetails)
    }

    const handleToggleAddServiceModal = () => {
        setAddServiceModalOpen(!isAddServiceModalOpen)
    }

    const handleToggleAddRetainerServiceModal = () => {
        setAddRetainerServiceModalOpen(!isAddRetainerServiceModalOpen)
    }

    const handleAddService = (updatedServices) => {
        setAddServiceModalOpen(false)
        
        //refetch the job details because you have to rebuild all services
        getJobDetails()
    }

    const handleAddRetainerService = (updatedServices) => {
        setAddRetainerServiceModalOpen(false)

        //refetch the job details because you have to rebuild all services
        getJobDetails()
    }

    return (
        <AnimatedPage>
            {loading && <Loader />}
            
            {!loading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}

            {!loading && errorMessage == null && (
                <div className="mt-6 max-w-5xl px-2">
                <div className="flex justify-between">
                    <div className="">
                        <h1 className="text-2xl font-semibold text-gray-600">Job Details</h1>
                    </div>
                    <div>
                        {(currentUser.isCustomer && (jobDetails.status === 'U' || jobDetails.status === 'A' || jobDetails.status === 'S')) && (
                            <Link to="../customer-edit" className="text-xs leading-5 font-semibold bg-slate-400/10
                                rounded-full p-2 text-slate-500
                                flex items-center space-x-2 hover:bg-slate-400/20
                                dark:highlight-white/5">
                                <PencilIcon className="h-5 w-5 cursor-pointer" />
                            </Link>
                        )}
                        
                    </div>
                </div>

                {currentUser.isCustomer
                         && (jobDetails.status === 'U'
                                || jobDetails.status === 'A'
                                || jobDetails.status === 'R'
                                || jobDetails.status === 'S') && (
                    <div className="mt-4 mb-4">
                        <button
                            type="button"
                            onClick={() => handleToggleJobCancelModal()}
                            className="inline-flex items-center rounded-md border
                                         border-gray-300 bg-white px-4 py-2 text-sm font-medium
                                          text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none
                                           focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                            Cancel Job
                        </button>
                    </div>
                )}

                {!currentUser.isCustomer && (
                    <div className="mt-4 mb-4">
                        {jobDetails.status === 'S' && (
                            <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => updateJobStatus('W')}
                                className="inline-flex items-center justify-center rounded-md
                                        border border-transparent bg-red-600 px-4 py-2 text-sm
                                        font-medium text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto">
                                Accept Job
                            </button>
                            {currentUser.isProjectManager && (
                                <button
                                    type="button"
                                    onClick={() => handleToggleJobReturnModal()}
                                    className="rounded bg-white px-4 py-2 text-sm text-gray-900
                                                 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                    Return Job
                                </button>
                            )}
                            </div>
                        )}

                        {jobDetails.status === 'U' && 
                            <button
                                type="button"
                                onClick={() => updateJobStatus('A')}
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
                                onClick={() => handleToggleJobCompleteModal()}
                                className="inline-flex items-center justify-center rounded-md
                                        border border-transparent bg-red-600 px-4 py-2 text-sm
                                        font-medium text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto">
                                Complete Job
                            </button>
                        }
                    
                    </div>
                )}

                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 mt-4">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Tail Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.tailNumber}</dd>
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
                                        ${jobDetails.status === 'C' && 'bg-green-500 '}
                                        ${jobDetails.status === 'I' && 'bg-blue-500'}
                                        ${jobDetails.status === 'T' && 'bg-gray-700'}
                                        `} >
                                {jobDetails.status === 'A' && 'Accepted'}
                                {jobDetails.status === 'S' && 'Assigned'}
                                {jobDetails.status === 'U' && 'Submitted'}
                                {jobDetails.status === 'W' && 'Work In Progress'}
                                {jobDetails.status === 'C' && 'Complete'}
                                {jobDetails.status === 'T' && 'Canceled'}
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
                        <dt className="text-sm font-medium text-gray-500">Airport</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.airport?.name}</dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Purchase Order</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.purchase_order ? jobDetails.purchase_order : 'None'}</dd>
                    </div> 
                    
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">FBO</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.fbo?.name}</dd>
                    </div>
                     <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Aircraft Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.aircraftType?.name}</dd>
                    </div>
                    
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Request Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.requestDate}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Estimated Arrival</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {jobDetails.on_site ? 
                                'On site' 
                                :
                                jobDetails.estimatedETA ? jobDetails.estimatedETA : 'No ETA yet'
                            }
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Requested By</dt>
                        <dd className="mt-1 space-y-5 text-sm text-gray-900 truncate overflow-ellipsis max-w-sm">
                            {jobDetails.requested_by ? jobDetails.requested_by : jobDetails.created_by?.first_name + ' ' + jobDetails.created_by?.last_name}
                        </dd>
                    </div>
                    
                    
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Estimated Departure</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.estimatedETD ? jobDetails.estimatedETD : 'No ETD yet'}</dd>
                    </div>
                    {currentUser.canSeePrice && (
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Price</dt>
                            <dd className="mt-1 text-sm text-gray-900 flex gap-1">
                                {!jobDetails.is_auto_priced && (
                                    <div className="inline-flex items-center rounded border
                                                  border-gray-300 bg-gray-50 px-1 text-xs
                                                    text-gray-600 shadow-sm hover:bg-gray-50">M</div>
                                )}
                                <div>{'$'}{jobDetails.price ? jobDetails.price.toLocaleString() : '0.00'}</div>
                                {jobDetails.is_auto_priced && location.pathname.includes('jobs') && (
                                    <Link 
                                        to={`/jobs/${jobDetails.id}/price-breakdown`}
                                        className="text-sky-600 ml-1 font-medium cursor-pointer text-xs flex gap-1 relative" style={{top: '2px'}}>
                                        breakdown
                                        <ArrowRightIcon className="h-3 w-3 relative" style={{top: '1px'}}/>
                                    </Link>
                                )}
                            </dd>
                        </div>
                    )}
                    
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Complete Before</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {jobDetails.completeBy ? jobDetails.completeBy 
                            : <span
                            className="relative inline-flex items-center
                                       rounded-full border border-gray-300 px-2 py-0.5">
                            <div className="absolute flex flex-shrink-0 items-center justify-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            </div>
                            <div className="ml-3 text-sm text-gray-700">TBD</div>
                          </span>}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Special Instructions</dt>
                        <dd className="mt-1 max-w-prose space-y-5 text-sm text-gray-900">
                            {!jobDetails.special_instructions && 'None provided'}

                            {jobDetails.special_instructions}
                        </dd>
                    </div>
                    
                    {jobDetails.completion_date && (
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Completion Date</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                                {jobDetails.completion_date}
                            </dd>
                        </div>
                    )}

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Customer Purchase Order</dt>
                        <dd className="mt-1 text-sm text-gray-900 truncate overflow-ellipsis  max-w-sm">
                            {jobDetails.customer_purchase_order ? jobDetails.customer_purchase_order : 'Not provided'}
                        </dd>
                    </div>

                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Tags</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {jobDetails.tags?.length === 0 && (
                                <span className="text-gray-900">None</span>
                            )}

                            {jobDetails.tags?.map((tag) => (
                                <div key={tag.id} className={`text-xs inline-block rounded-md px-2 py-1 mr-1 border
                                                            ${tag.tag_color === 'red' && 'border-red-500 text-red-500'}
                                                            ${tag.tag_color === 'orange' && 'border-orange-500 text-orange-500 '}
                                                            ${tag.tag_color === 'amber' && 'border-amber-500 text-amber-500'}
                                                            ${tag.tag_color === 'indigo' && ' border-indigo-500 text-indigo-500'}
                                                            ${tag.tag_color === 'violet' && ' border-violet-500 text-violet-500'}
                                                            ${tag.tag_color === 'fuchsia' && 'border-fuchsia-500 text-fuchsia-500'} 
                                                            ${tag.tag_color === 'pink' && 'border-pink-500 text-pink-500'}
                                                            ${tag.tag_color === 'slate' && 'border-slate-500 text-gray-500'}
                                                            ${tag.tag_color === 'lime' && 'border-lime-500 text-lime-500'}
                                                            ${tag.tag_color === 'emerald' && 'border-emerald-500 text-emerald-500'}
                                                            ${tag.tag_color === 'cyan' && 'border-cyan-500 text-cyan-500'}
                                                            ${tag.tag_color === 'blue' && 'border-blue-500 text-blue-500'}
                                                        `}>
                                {tag.tag_name}
                                </div>
                            ))}
                        </dd>
                    </div>

                </dl>
                <div className="mx-auto mt-8 max-w-5xl pb-8">
                    <div className="flex justify-between">
                        <h2 className="text-sm font-medium text-gray-500">Services</h2>
                        <div className="flex gap-4 text-right">
                            <Switch.Group as="li" className="flex items-center">
                                <div className="flex flex-col">
                                    <Switch.Label as="p" className="text-sm font-medium text-gray-500" passive>
                                    {showActions ? 'Hide Actions' : 'Show Actions'}
                                    </Switch.Label>
                                </div>
                                <Switch
                                    checked={showActions}
                                    onChange={setShowActions}
                                    className={classNames(
                                        showActions ? 'bg-red-500' : 'bg-gray-200',
                                    'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                    )}
                                >
                                    <span
                                    aria-hidden="true"
                                    className={classNames(
                                        showActions ? 'translate-x-5' : 'translate-x-0',
                                        'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                    )}
                                    />
                                </Switch>
                            </Switch.Group>
                            {currentUser.isCustomer 
                                    && (jobDetails.status === 'A' || jobDetails.status === 'U') && (
                                <button
                                    type="button"
                                    onClick={handleToggleAddServiceModal}
                                    className="inline-flex items-center rounded-md border border-gray-300
                                            bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                    <PlusIcon className="-ml-2 mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                                    <span>Add</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                {currentUser.isCustomer 
                                                    && (jobDetails.status === 'A' || jobDetails.status === 'U') && (
                                                    <div className="flex justify-end">
                                                        <TrashIcon 
                                                        onClick={() => removeService(service)}
                                                        className="h-5 w-5 text-gray-400 cursor-pointer" />
                                                    </div>
                                                )}
                                                
                                                {!currentUser.isCustomer && service.status === 'W' && (
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
                                                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                                    </div>
                                                )}

                                            </div>
                                        </div>
                                        
                                        {!currentUser.isProjectManager && (
                                            <div className="text-xs mb-4 relative inline-flex items-center
                                                            rounded-full border border-gray-300 px-2 py-0.5">
                                                {service.project_manager}
                                                {/* TODO: show project manager avatar, and first name, last name, email, vendor in popover */}
                                                {/* <Popover className="relative">
                                                    <Popover.Button>
                                                        {service.project_manager}
                                                    </Popover.Button>

                                                    <Popover.Panel className="absolute z-10">
                                                        <div className="absolute top-full left-0 mt-2 w-60 origin-top-right
                                                                         divide-y divide-gray-100 rounded-lg bg-white text-sm font-normal
                                                                        text-slate-900 shadow-md ring-1 ring-slate-900/5 focus:outline-none
                                                                        transform opacity-100 scale-100">
                                                            <p class="truncate py-3 px-3.5 text-sm">
                                                                <span class="block text-gray-500">Signed in as</span>
                                                                <span class="mt-1 font-semibold">enriquedelgado806@gmail.com</span>
                                                            </p>
                                                        </div>
                                                    </Popover.Panel>
                                                </Popover> */}
                                            </div>
                                        )}

                                        {showActions && service.checklist_actions?.map((action) => (
                                            <div key={action.id} className="text-sm text-gray-500 py-1">{action.name}</div>
                                        ))}
                                    </div>
                                </div>
                            
                            </div>
                        ))}
                    </div>
                </div>
                {(currentUser.isAdmin
                    || currentUser.isProjectManager
                             || currentUser.isSuperUser
                             || currentUser.isAccountManager
                             || currentUser.isInternalCoordinator
                             || (currentUser.isCustomer && currentUser.isPremiumMember)) && (
                    <div className="mx-auto max-w-5xl pb-12">
                        <div className="flex justify-between">
                            <h2 className="text-sm font-medium text-gray-500">Retainer Services</h2>
                            {currentUser.isCustomer 
                                    && (jobDetails.status === 'A' || jobDetails.status === 'U') && (
                                <button
                                    type="button"
                                    onClick={handleToggleAddRetainerServiceModal}
                                    className="inline-flex items-center rounded-md border border-gray-300
                                            bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
                                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                                    <PlusIcon className="-ml-2 mr-1 h-4 w-4 text-gray-400" aria-hidden="true" />
                                    <span>Add</span>
                                </button>
                            )}
                        </div>
                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                                    {currentUser.isCustomer 
                                                        && (jobDetails.status === 'A' || jobDetails.status === 'U') && (
                                                        <div className="flex justify-end">
                                                            <TrashIcon 
                                                            onClick={() => removeRetainerService(service)}
                                                            className="h-5 w-5 text-gray-400 cursor-pointer" />
                                                        </div>
                                                    )}

                                                    {!currentUser.isCustomer && service.status === 'W' && (
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
                                                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
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
                                                
                                            {showActions && service.checklist_actions?.map((action) => (
                                                    <div key={action.id} className="text-sm text-gray-500 py-1">{action.name}</div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
            </div>
            )}

            {isCancelJobModalOpen && <JobCancelModal
                                            isOpen={isCancelJobModalOpen}
                                            jobDetails={jobDetails}
                                            handleClose={handleToggleJobCancelModal}
                                            updateJobStatus={updateJobStatus} />}

            {isReturnJobModalOpen && <JobReturnModal 
                                            isOpen={isReturnJobModalOpen}
                                            jobDetails={jobDetails}
                                            handleClose={handleToggleJobReturnModal}
                                            returnJob={returnJob}
                                            />}

            {isCompleteJobModalOpen && <JobCompleteModal
                                            isOpen={isCompleteJobModalOpen}
                                            jobDetails={jobDetails}
                                            handleClose={handleToggleJobCompleteModal}
                                            updateJobStatus={updateJobStatus} />}

            {isPriceBreakdownModalOpen && <JobPriceBreakdownModal
                                            isOpen={isPriceBreakdownModalOpen}
                                            jobDetails={jobDetails}
                                            handleClose={handleTogglePriceBreakdownModal} />}

            {isAddServiceModalOpen && <AddServiceModal
                                            isOpen={isAddServiceModalOpen}
                                            handleClose={handleToggleAddServiceModal}
                                            existingServices={[]}
                                            projectManagers={[]}
                                            handleAddService={handleAddService}
                                            jobId={jobId}
                                             />}

            {isAddRetainerServiceModalOpen && <AddRetainerServiceModal
                                            isOpen={isAddRetainerServiceModalOpen}
                                            handleClose={handleToggleAddRetainerServiceModal}
                                            existingServices={[]}
                                            projectManagers={[]}
                                            handleAddService={handleAddRetainerService}
                                            jobId={jobId}
                                                />}

        </AnimatedPage>
    )
}

export default JobInfo;