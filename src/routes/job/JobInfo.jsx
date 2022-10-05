
import { useEffect, useState } from "react"
import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import * as api from './apiService'


const assignees = [
    { id: 1, name: 'Wilson Lizarazo'},
    { id: 2, name: 'Belkis Grinan'},
]

const JobInfo = () => {
    const { jobId } = useParams();
    const [jobDetails, setJobDetails] = useState({})

    useEffect(() => {
        getJobDetails()
    }, [])

    const getJobDetails = async () => {

        try {
            const { data } = await api.getJobDetails(jobId)

            console.log(data);

            setJobDetails(data);

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div>
            <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="mt-8 mb-8">
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                    >
                    Accept Job
                </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                     <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Purchase Order</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.purchase_order}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                              {jobDetails.status === 'A' && 'Assigned'}
                              {jobDetails.status === 'U' && 'Submitted'}
                              {jobDetails.status === 'W' && 'WIP'}
                              {jobDetails.status === 'C' && 'Complete'}
                              {jobDetails.status === 'T' && 'Cancelled'}
                              {jobDetails.status === 'R' && 'Review'}
                              {jobDetails.status === 'I' && 'Invoiced'}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Customer</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.customer?.name}</dd>
                    </div>
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
                        <dt className="text-sm font-medium text-gray-500">Complete By</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.completeBy}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Estimated ETA</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.estimatedETA}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Estimated ETD</dt>
                        <dd className="mt-1 text-sm text-gray-900">{jobDetails.estimatedETD}</dd>
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
                        {jobDetails.service_assignments?.map((service) => (
                            <div
                                key={service.id}
                                className="relative flex items-center space-x-3 rounded-lg
                                        border border-gray-300 bg-white px-6 py-5 shadow-sm
                                        hover:border-gray-400">
                                <div className="min-w-0 flex-1">
                                    <div className="focus:outline-none">
                                        <div className="grid grid-cols-3 text-sm pb-2">
                                            <div className="col-span-2 font-medium text-gray-900 relative top-1">{service.name}</div>
                                            <div className="text-right">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded border
                                                             border-gray-300 bg-white px-2.5 py-1.5 text-xs
                                                               font-medium text-gray-700 shadow-sm hover:bg-gray-50
                                                               focus:outline-none cursor-pointer focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                                    Complete
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {service.checklist_actions?.map((action) => (
                                            <div key={action.id} className="text-sm text-gray-500 py-1 pl-6">{action.name}</div>
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
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded border
                                                                border-gray-300 bg-white px-2.5 py-1.5 text-xs
                                                                font-medium text-gray-700 shadow-sm hover:bg-gray-50
                                                                focus:outline-none cursor-pointer focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                                    Complete
                                                </button>
                                            </div>
                                        </div>
                                            
                                        {service.checklist_actions?.map((action) => (
                                                <div key={action.id} className="text-sm text-gray-500 py-1 pl-6">{action.name}</div>
                                        ))}
                                    </div>
                                </div>
                                
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobInfo;