
import { useEffect, useState } from "react";

import { TrashIcon, CloudDownloadIcon } from "@heroicons/react/outline";

import * as api from './apiService'


const JobPhotos = () => {
    const [interiorPhotos, setInteriorPhotos] = useState([])
    const [exteriorPhotos, setExteriorPhotos] = useState([])

    useEffect(() => {
        getPhotos()
    }, [])

    const getPhotos = async () => {
        try {
            const { data } = await api.getJobPhotos(1)

            const interior_photos = []
            const exterior_photos = []

            data.results.forEach(entry => {
                if (entry.interior) {
                    interior_photos.push(entry)
                } else {
                    exterior_photos.push(entry)
                }
            });


            setInteriorPhotos(interior_photos)
            setExteriorPhotos(exterior_photos)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="mt-8">
            <div className="grid grid-cols-2 mb-4">
                <div className="text-gray-500 text-sm">
                    <div className="relative top-3">Total: {interiorPhotos.length + exteriorPhotos.length}</div>
                </div>
                <div className="text-right">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                        >
                        Add photo
                    </button>
                </div>
            </div>
            <div className="grid xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1  gap-14 mt-8">
                <div>
                    <div className="text-gray-500 text-sm mb-4 font-semibold">Interior</div>
                    <ul className="-my-5 divide-y divide-gray-200">
                        {interiorPhotos.length === 0 && <div className="text-gray-500 text-sm">None</div>}

                        {interiorPhotos.map((photo) => (
                            <li key={photo.id} className="py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <img className="h-28 w-28" src={photo.image} alt="" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-gray-500">{photo.name}</p>
                                    </div>
                                    <div>
                                        <div className="text-xs leading-5 font-semibold bg-slate-400/10
                                                                        p-2 text-slate-500
                                                                        flex items-center space-x-2 hover:bg-slate-400/20
                                                                        dark:highlight-white/5">
                                            <TrashIcon className="flex-shrink-0 h-4 w-4 cursor-pointer"/>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <div className="text-gray-500 text-sm mb-4 font-semibold">Exterior</div>
                     <ul className="-my-5 divide-y divide-gray-200">
                        {exteriorPhotos.length === 0 && <div className="text-gray-500 text-sm">None</div>}

                        {exteriorPhotos.map((photo) => (
                            <li key={photo.id} className="py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <img className="h-28 w-28" src={photo.image} alt="" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs text-gray-500">{photo.name}</p>
                                    </div>
                                    <div>
                                        <div className="text-xs leading-5 font-semibold bg-slate-400/10
                                                                        p-2 text-slate-500
                                                                        flex items-center space-x-2 hover:bg-slate-400/20
                                                                        dark:highlight-white/5">
                                            <TrashIcon className="flex-shrink-0 h-4 w-4 cursor-pointer"/>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            
        </div>
    )
}

export default JobPhotos;