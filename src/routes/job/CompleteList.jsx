
import { useEffect, useState } from 'react'
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { DownloadIcon } from '@heroicons/react/outline';
import Loader from '../../components/loader/Loader';
import { Switch } from "@headlessui/react";
import { useNavigate } from 'react-router-dom';

import JSZip from "jszip";
import { saveAs } from 'file-saver';

import * as api from './apiService'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const CompleteList = () => {
    const [jobs, setJobs] = useState([])
    const [totalJobs, setTotalJobs] = useState(0)
    const [loading, setLoading] = useState(false)
    const [showServices, setShowServices] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        getJobs()
    }, [])

    const getJobs = async () => {
        setLoading(true)

        try {
            const { data } = await api.getCompletedJobs({})
    
            setJobs(data.results)
            setTotalJobs(data.count)
            setLoading(false)

        } catch (err) {
            setLoading(false)
        }
    }

    return (
        <AnimatedPage>
            {loading && <Loader />} 

            {!loading && (
                <div className="px-4 -mt-4">
                <div className="flex">
                    <div className="">
                        <h1 className="text-lg font-semibold text-gray-700">Completed Jobs</h1>
                    </div>
                </div>
                <div className="flex justify-between mt-2">
                    <div>
                        <p className="text-sm text-gray-700">
                            Total Jobs: {totalJobs}
                        </p>
                    </div>
                    <Switch.Group as="li" className="flex items-center">
                              <div className="flex flex-col">
                                <Switch.Label as="p" className="text-sm text-gray-500" passive>
                                  {showServices ? 'Hide Services' : 'Show Services'}
                                </Switch.Label>
                              </div>
                              <Switch
                                checked={showServices}
                                onChange={setShowServices}
                                className={classNames(
                                    showServices ? 'bg-red-500' : 'bg-gray-200',
                                  'relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                                )}
                              >
                                <span
                                  aria-hidden="true"
                                  className={classNames(
                                    showServices ? 'translate-x-5' : 'translate-x-0',
                                    'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                  )}
                                />
                              </Switch>
                        </Switch.Group>
                </div>
                <div className="mt-2 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-4 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs text-gray-500"
                                >
                                P.O
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Customer
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Request Date
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Tail
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Aircraft
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Airport
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                FBO
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Arrival
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Departure
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Complete By
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Services
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Retainers
                                </th>
                                <th
                                className="whitespace-nowrap px-2 py-2 text-left text-xs  text-gray-500"
                                >
                                Status
                                </th>
                                <th
                                className="whitespace-nowrap px-8 py-2 text-left text-xs  text-gray-500"
                                >
                                Price
                                </th>
                                {/* <th className="relative whitespace-nowrap py-2 pl-3 pr-4 sm:pr-6">
                                
                                </th> */}
                                <th className="relative whitespace-nowrap py-2 pl-3 pr-4 sm:pr-6">
                                
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {jobs.map((job) => (
                                <tr key={job.id}>
                                <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.purchase_order}</td>
                                <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.customer.name}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.requestDate}</td>
                                <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.tailNumber}</td>
                                <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.aircraftType.name}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.airport.initials}</td>
                                <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">{job.fbo.name}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.on_site ? 'On site' : job.estimatedETA}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.estimatedETD}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.completeBy}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500" style={{ minWidth: showServices ? '250px': ''}}>
                                    {!showServices && (
                                        <span>{job.job_service_assignments.length > 0 ? job.job_service_assignments.length : ''}</span>)
                                    }
                                    
                                    {showServices && job.job_service_assignments.map((service, index) => (
                                        <div key={index}>{index + 1}{'. '}{service.service_name}</div>
                                    ))}
                                </td>
                                <td className="px-2 py-2 text-xs text-gray-500" style={{ minWidth: showServices ? '250px': ''}}>
                                    {!showServices && (
                                        <span>{job.job_retainer_service_assignments.length > 0 ? job.job_retainer_service_assignments.length : ''}</span>)
                                    }
                                    
                                    {showServices && job.job_retainer_service_assignments.map((service, index) => (
                                        <div key={index}>{index + 1}{'. '}{service.service_name}</div>
                                    ))}
                                </td>
                                <td className="whitespace-nowrap px-2 py-2 text-xs text-gray-500">
                                    <p className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                                    ${job.status === 'C' && 'bg-green-500 '}
                                                    ${job.status === 'T' && 'bg-black '}
                                                    ${job.status === 'I' && 'bg-blue-500 '}
                                                    `}>
                                        {job.status === 'C' && 'Completed'}
                                        {job.status === 'T' && 'Cancelled'}
                                        {job.status === 'I' && 'Invoiced'}
                                    </p>
                                </td>
                                <td className="whitespace-nowrap px-8 py-2 text-xs text-gray-500">
                                    <div className="relative" style={{top: '2px'}}>{'$'}{job.price ? job.price : '0.00'}</div>
                                </td>
                                <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-xs sm:pr-6">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/completed/review/${job.id}`)}
                                        className="inline-flex items-center rounded border
                                            border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium
                                            text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                            focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Review
                                    </button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            )}
            
        </AnimatedPage>
    )
}

export default CompleteList;