
import { useEffect, useState } from 'react'
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import { DownloadIcon } from '@heroicons/react/outline';
import Loader from '../../components/loader/Loader';
import JSZip from "jszip";
import { saveAs } from 'file-saver';

import * as api from './apiService'


const CompleteList = () => {
    const [jobs, setJobs] = useState([])
    const [totalJobs, setTotalJobs] = useState(0)
    const [loading, setLoading] = useState(false)
    const [downloadLoading, setDownloadLoading] = useState(false)


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

    const invoiceJob = async (jobId) => {

        await api.invoiceJob(jobId, { 'status': 'I' })

        const updatedJobs = jobs.map((job) => {
            if (job.id === jobId) {
                return {...job, status: 'I'}
            }

            return job
        })

        setJobs(updatedJobs)
    }

    const downloadAllPhotos = async (job) => {
        setDownloadLoading(true)

        try {
            const { data } = await api.getJobPhotos(job.id)

            const interior_photos = []
            const exterior_photos = []
            const customer_photos = []

            data.results.forEach(entry => {
                if (entry.customer_uploaded) {
                    customer_photos.push(entry)

                } else {
                    if (entry.interior) {
                        interior_photos.push(entry)
                    } else {
                        exterior_photos.push(entry)
                    }
                }
            });

            const interiorImages = interior_photos.map(p => {return {'customer': false, 'interior': true, 'image': p.image, 'name': p.name}});
            const exteriorImages = exterior_photos.map(p => {return {'customer': false, 'interior': false, 'image': p.image, 'name': p.name}});
            const customerImages = customer_photos.map(p => {return {'customer': true, 'image': p.image, 'name': p.name}});
    
            const allImages = [...customerImages, ...interiorImages, ...exteriorImages]
    
            var zip = new JSZip();
            let customerProvided = null;
            let interiorFolder = null;
            let exteriorFolder = null;
    
            if (customerImages.length > 0) {
                customerProvided = zip.folder('customer_provided')
            }
    
            if (interiorImages.length > 0) {
                interiorFolder = zip.folder('interior_photos');
            }
    
            if (exteriorImages.length > 0) {
                exteriorFolder = zip.folder('exterior_photos');
            }
    
            var count = 0;
    
            var zipFilename = job.purchase_order + "_all_photos.zip";  
            allImages.forEach(async function (image, i) {
              const filename = image.name
    
              const response = await fetch(image.image);
              
              response.blob().then(blob => {
                    if (image.customer) {
                        customerProvided.file(filename, blob, { binary: true });
                    } else {
                        if (image.interior) {
                            interiorFolder.file(filename, blob, { binary: true });
        
                        } else {
                            exteriorFolder.file(filename, blob, { binary: true });
                        }
                    }
    
                    count++;
                    if (count === allImages.length) {
                        zip.generateAsync({ type: 'blob' }).then(function (content) {
                          saveAs(content, zipFilename);
                        });
                        setDownloadLoading(false)
                    }
              }); 
            });


        } catch (error) {
            setDownloadLoading(false)
        }
    }

    return (
        <AnimatedPage>
            {loading && <Loader />} 

            {!loading && (
                <div className="px-3 sm:px-6 lg:px-8 -mt-4">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-lg font-semibold text-gray-900">Completed Jobs</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            placeholder text.
                        </p>
                    </div>
                    {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent
                                bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm
                                hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Export
                    </button>
                    </div> */}
                </div>
                <div className="mt-4 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                className="whitespace-nowrap py-2 text-left text-xs text-gray-500 sm:pl-6"
                                >
                                P.O
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
                                <th className="relative whitespace-nowrap py-2 pl-3 pr-4 sm:pr-6">
                                
                                </th>
                                <th className="relative whitespace-nowrap py-2 pl-3 pr-4 sm:pr-6">
                                
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {jobs.map((job) => (
                                <tr key={job.id}>
                                <td className=" py-2 pl-4 pr-3 text-xs text-gray-500 sm:pl-6">{job.purchase_order}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.requestDate}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.tailNumber}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.aircraftType.name}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.airport.initials}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.fbo.name}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.estimatedETA}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.estimatedETD}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500">{job.completeBy}</td>
                                <td className=" px-2 py-2 text-xs text-gray-500" style={{minWidth: '250px'}}>
                                    {job.job_service_assignments.map((service, index) => (
                                        <div key={index}>{index + 1}{'. '}{service.service_name}</div>
                                    ))}
                                </td>
                                <td className="px-2 py-2 text-xs text-gray-500" style={{minWidth: '250px'}}>
                                    {job.job_retainer_service_assignments.map((service, index) => (
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
                                        {!job.is_auto_priced && (
                                            <div className="inline-flex items-center rounded border
                                                            border-gray-300 bg-gray-50 px-1 text-xs
                                                            text-gray-600 shadow-sm hover:bg-gray-50 ">M</div>
                                        )}
                                        <div>{'$'}{job.price ? job.price : '0.00'}</div>
                                </td>
                                <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-xs sm:pr-6">
                                    {downloadLoading && (<span>...</span>)}
                                    {!downloadLoading && (
                                        <DownloadIcon 
                                            onClick={() => downloadAllPhotos(job)}
                                            className="h-4 w-4 cursor-pointer text-gray-500"/>
                                    )}
                                </td>
                                <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-xs sm:pr-6">
                                        {job.status === 'C' && (
                                            <button
                                                type="button"
                                                onClick={() => invoiceJob(job.id)}
                                                className="inline-flex items-center rounded border
                                                    border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium
                                                    text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                                    focus:ring-gray-500 focus:ring-offset-2"
                                            >
                                                Invoice
                                            </button>
                                        )}
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