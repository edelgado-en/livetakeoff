
import { useEffect, useState } from "react"
import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import { CheckCircleIcon, QuestionMarkCircleIcon, ArrowRightIcon } from "@heroicons/react/outline";
import SharedJobPhotoListing from './SharedPhotoListing'
import SharedComments from './SharedComments'
import * as api from './apiService'

import { Switch } from "@headlessui/react";

import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const SharedJob = () => {
    const { jobId } = useParams();
    const [loading, setLoading] = useState(false)
    const [jobDetails, setJobDetails] = useState({service_assignments: [], retainer_service_assignments: []})
    const [showActions, setShowActions] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    useEffect(() => {
        getJobDetails();
    }, [])

    const getJobDetails = async () => {
        setLoading(true);

        try {
            const { data } = await api.getJobDetails(jobId);

            setJobDetails(data);

            setLoading(false);

        } catch (error) {
            setLoading(false);
        } 
    }

    return (
        <AnimatedPage>
            {loading && <Loader />}

            {!loading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}

            {!loading && errorMessage == null && (
                <div className="mt-4 m-auto max-w-4xl px-4">
                    <div className="flex flex-row mb-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-semibold text-gray-600">Job Details</h1>
                        </div>
                    </div>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 pb-12">
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
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Customer</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.customer?.name}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Airport</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.airport?.name}</dd>
                    </div>
                    
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Tail Number</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.tailNumber}</dd>
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
                        <dd className="mt-1 max-w-prose space-y-5 text-sm text-gray-900">
                            {jobDetails.created_by?.first_name} {jobDetails.created_by?.last_name}
                        </dd>
                    </div>
                    
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Estimated Departure</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.estimatedETD ? jobDetails.estimatedETD : 'No ETD yet'}</dd>
                    </div>
                    
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Special Instructions</dt>
                        <dd className="mt-1 max-w-prose space-y-5 text-sm text-gray-900">
                            {!jobDetails.special_instructions && 'None provided'}

                            {jobDetails.special_instructions}
                        </dd>
                    </div>

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
                    </dl>
                    <h1 className="text-2xl font-semibold text-gray-600 relative top-1">Services</h1>
                    <div className="mx-auto mt-8 max-w-5xl pb-8">
                        <div className="flex justify-between">
                        <h2 className="text-sm font-medium text-gray-500">Standard</h2>
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
                                                    {service.status === 'C' && (
                                                        <div className="flex-shrink-0 flex justify-end">
                                                            <CheckCircleIcon className="h-6 w-6 text-red-400" />
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                            
                                            <div className="text-xs mb-4 relative inline-flex items-center
                                                            rounded-full border border-gray-300 px-2 py-0.5">
                                                {service.project_manager}
                                            </div>

                                            {showActions && service.checklist_actions?.map((action) => (
                                                <div key={action.id} className="text-sm text-gray-500 py-1">{action.name}</div>
                                            ))}
                                        </div>
                                    </div>
                                
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mx-auto max-w-5xl pb-12">
                        <h2 className="text-sm font-medium text-gray-500">Retainers</h2>
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
                                                    {service.status === 'C' && (
                                                        <div className="flex-shrink-0 flex justify-end">
                                                            <CheckCircleIcon className="h-6 w-6 text-red-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="text-xs mb-4 relative inline-flex items-center
                                                            rounded-full border border-gray-300 px-2 py-0.5">
                                                {service.project_manager}
                                            </div>
                                                
                                            {showActions && service.checklist_actions?.map((action) => (
                                                    <div key={action.id} className="text-sm text-gray-500 py-1">{action.name}</div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {jobDetails?.job_comments?.length > 0 && (
                        <SharedComments comments={jobDetails.job_comments}/>
                    )} 

                    <SharedJobPhotoListing 
                            photos={jobDetails.job_photos}
                            purchase_order={jobDetails.purchase_order}
                         />
                </div>
            )}

        </AnimatedPage>
    )
}

export default SharedJob;