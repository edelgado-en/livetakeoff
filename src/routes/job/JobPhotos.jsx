
import { useEffect, useState } from "react";
import { TrashIcon, CloudDownloadIcon } from "@heroicons/react/outline";
import ImageViewer from 'react-simple-image-viewer'

import * as api from './apiService'

const images = [
    'http://placeimg.com/1200/800/nature',
    'http://placeimg.com/800/1200/nature',
    'http://placeimg.com/1920/1080/nature',
    'http://placeimg.com/1500/500/nature',
  ];

const JobPhotos = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [interiorPhotos, setInteriorPhotos] = useState([])
    const [exteriorPhotos, setExteriorPhotos] = useState([])
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    useEffect(() => {
        getPhotos()
    }, [])

    const openImageViewer = (index) => {
        setCurrentImage(index);
        setIsViewerOpen(true)
    }

    const closeImageViewer = () => {
        setCurrentImage(0);
        setIsViewerOpen(false);
      };

    const getPhotos = async () => {
        try {
            const { data } = await api.getJobPhotos(1)

            const interior_photos = []
            const exterior_photos = []

            data.results.forEach(entry => {
                if (entry.interior) {
                    interior_photos.push(entry.image)
                } else {
                    exterior_photos.push(entry.image)
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

                        {interiorPhotos.map((photo, index) => (
                            <li key={index} className="py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 cursor-pointer" onClick={ () => openImageViewer(index) }>
                                        <img className="h-48 w-48 rounded-lg" src={photo} alt="" />
                                    </div>

                                    {/* YOU HAVE TO APPEND /fl_attachment/  between upload/ and /v1 */}
                                    {/* find the index of /upload/ and then append fl_attachment then append the rest */}
                                    {/* https://stackoverflow.com/questions/4313841/insert-a-string-at-a-specific-index */}
                                    <a href="https://res.cloudinary.com/datidxeqm/image/upload/fl_attachment/v1/media/images/409cf4bd-acff-4bf5-9f6b-fa8fa3ce74da_m1zxjb">
                                        <div className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200">
                                            <CloudDownloadIcon className="flex-shrink-0 h-4 w-4" />
                                        </div>
                                    </a>
                                    
                                    <div className="flex justify-end">
                                        <div className="text-xs leading-5 font-semibold bg-slate-400/10
                                                                        p-2 text-slate-500
                                                                        hover:bg-slate-400/20
                                                                        dark:highlight-white/5 rounded-lg cursor-pointer">
                                            <TrashIcon className="flex-shrink-0 h-4 w-4"/>
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

                        {exteriorPhotos.map((photo, index) => (
                            <li key={index} className="py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 cursor-pointer">
                                        <img className="h-48 w-48 rounded-lg" src={photo} alt="" />
                                    </div>

                                    <a href="https://res.cloudinary.com/datidxeqm/image/upload/fl_attachment/v1/media/images/409cf4bd-acff-4bf5-9f6b-fa8fa3ce74da_m1zxjb">
                                        <div className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200">
                                            <CloudDownloadIcon className="flex-shrink-0 h-4 w-4" />
                                        </div>
                                    </a>
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

            {isViewerOpen && (
                <ImageViewer
                src={ interiorPhotos }
                currentIndex={ currentImage }
                disableScroll={ false }
                closeOnClickOutside={ true }
                onClose={ closeImageViewer }
                />
            )}
            
        </div>
    )
}

export default JobPhotos;