
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
            <div className="px-4 -mt-8">
                <div className="flex border-b border-gray-200 py-2">
                    <div className="">
                        <h1 className="text-lg font-semibold text-gray-700">Completed Jobs</h1>
                    </div>
                </div>
                <div className="flex justify-between border-b border-gray-200 py-2">
                    <div>
                        <p className="text-xs text-gray-700">
                            Total Jobs: {totalJobs}
                        </p>
                    </div>
                </div>

                {loading && <Loader />} 

                {!loading && (
                    <div className="mt-4 flex flex-col pb-20 m-auto" style={{ maxWidth: '1800px' }}>
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-4 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle px-8">
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            P.O
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Customer
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Request Date
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Tail
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Aircraft
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Airport
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            FBO
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase  text-gray-500"
                                            >
                                            Arrival
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Departure
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Complete By
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-2 py-2 text-center text-xs font-normal uppercase text-gray-500"
                                            >
                                            Status
                                            </th>
                                            <th
                                            className="whitespace-nowrap px-8 py-2 text-left text-xs font-normal uppercase text-gray-500"
                                            >
                                            Price
                                            </th>
                                            <th className="relative whitespace-nowrap py-2 pl-3 pr-4 sm:pr-6">
                                            
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                        {jobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-gray-50">
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
                                            <td className="whitespace-nowrap px-2 py-2 text-xs text-center text-gray-500">
                                                <p style={{ paddingTop: '1px', paddingBottom: '1px' }} className={`inline-flex text-xs text-white rounded-md px-1
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
                                                    style={{ paddingTop: '1px', paddingBottom: '1px' }}
                                                    onClick={() => navigate(`/completed/review/${job.id}`)}
                                                    className="inline-flex items-center rounded border
                                                        border-gray-300 bg-white px-1 text-xs font-medium
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
                )}
                
            </div>
            
        </AnimatedPage>
    )
}

export default CompleteList;