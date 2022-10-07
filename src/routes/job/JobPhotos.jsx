
import { useEffect, useState } from "react";

import { TrashIcon, CloudDownloadIcon } from "@heroicons/react/outline";

import * as api from './apiService'

/* const photos = [
    { id: 1, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 2, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 3, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 4, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 5, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 6, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 7, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 8, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 9, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 10, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 11, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 12, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 13, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
    { id: 14, url: 'https://res.cloudinary.com/datidxeqm/image/upload/v1655812995/npcjg9zhd7j4kdfbbpce.jpg', size: '3.5MB' },
] */

const JobPhotos = () => {
    const [photos, setPhotos] = useState([])

    useEffect(() => {
        getPhotos()
    }, [])

    const getPhotos = async () => {
        try {
            const { data } = await api.getJobPhotos(1)

            // build the object here to separate interior and exterior photos
            // and then you can have interior on the left and exterior on the right
            // on mobile they would just stack on top of each other

            setPhotos(data.results)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="mt-8">
            <div className="grid grid-cols-2 mb-4 max-w-3xl m-auto">
                <div className="text-gray-500 text-sm">
                    <div className="relative top-3">Total: {photos.length}</div>
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
            <ul className="-my-5 divide-y divide-gray-200 mt-4 max-w-3xl m-auto">
                {photos.map((photo) => (
                    <li key={photo.id} className="py-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                                <img className="h-28 w-28" src={photo.image} alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-xs text-gray-500">{photo.name}</p>
                            </div>
                            <div>
                                <div to="/jobs" className="text-xs leading-5 font-semibold bg-slate-400/10
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
    )
}

export default JobPhotos;