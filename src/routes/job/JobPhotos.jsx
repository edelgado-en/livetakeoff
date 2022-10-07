
import { useEffect, useState } from "react";
import { TrashIcon, CloudDownloadIcon } from "@heroicons/react/outline";
import ImageViewer from 'react-simple-image-viewer'

import * as api from './apiService'

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
            <div className="grid grid-cols-2">
                <div className="text-gray-500">
                    <div className="leading-6 font-medium text-gray-600 relative top-2">Photos</div>
                </div>
                <div className="text-right flex justify-end">
                    <button type="button" class="flex items-center justify-center rounded-full bg-red-600 p-1
                                               text-white hover:bg-red-700 focus:outline-none focus:ring-2
                                                focus:ring-red-500 focus:ring-offset-2">
                        <svg class="h-6 w-6" x-description="Heroicon name: outline/plus"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                        </svg>
                    </button>
                    {/* <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                        >
                        Upload
                    </button> */}
                </div>
            </div>
            <div>
            <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-red-600
                                   focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500
                                   focus-within:ring-offset-2 hover:text-red-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
            </div>
            <div className="">
                <div>
                    <div className="text-gray-500 text-sm mb-1 font-semibold mt-8">
                        Interior
                        {interiorPhotos.length > 0 &&
                            <span class="bg-gray-100 text-gray-700 hidden ml-2 py-0.5 px-2.5
                                          rounded-full text-xs font-medium md:inline-block">{interiorPhotos.length}</span>
                        }
                    </div>
                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-1">
                        {interiorPhotos.length === 0 && <div className="text-gray-500 text-sm">None</div>}

                        {interiorPhotos.map((photo, index) => (
                            <div key={index} className="py-4">
                                    <div className="flex-shrink-0 cursor-pointer" onClick={ () => openImageViewer(index) }>
                                        <img className="h-60 w-72 rounded-lg" src={photo} alt="" />
                                    </div>
                                    <div className="flex text-gray-500 text-sm pt-2">
                                        <CloudDownloadIcon className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer" />
                                        <TrashIcon className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer"/>
                                        <span className="text-gray-500 text-xs">29m ago</span>
                                    </div>

                                    {/* YOU HAVE TO APPEND /fl_attachment/  between upload/ and /v1 */}
                                    {/* find the index of /upload/ and then append fl_attachment then append the rest */}
                                    {/* https://stackoverflow.com/questions/4313841/insert-a-string-at-a-specific-index */}
                                    {/* <a href="https://res.cloudinary.com/datidxeqm/image/upload/fl_attachment/v1/media/images/409cf4bd-acff-4bf5-9f6b-fa8fa3ce74da_m1zxjb">
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
                                    </div> */}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="text-gray-500 text-sm mb-1 font-semibold mt-8">
                        Exterior
                        {exteriorPhotos.length > 0 &&
                            <span class="bg-gray-100 text-gray-700 hidden ml-2 py-0.5 px-2.5
                                          rounded-full text-xs font-medium md:inline-block">{exteriorPhotos.length}</span>
                        }
                    </div>
                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-1">
                        {exteriorPhotos.length === 0 && <div className="text-gray-500 text-sm">None</div>}

                        {exteriorPhotos.map((photo, index) => (
                            <div key={index} className="py-4">
                                    <div className="flex-shrink-0 cursor-pointer" onClick={ () => openImageViewer(index) }>
                                        <img className="h-60 w-72 rounded-lg" src={photo} alt="" />
                                    </div>
                                    <div className="flex text-gray-500 text-sm pt-2">
                                        <CloudDownloadIcon className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer" />
                                        <TrashIcon className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer"/>
                                        <span className="text-gray-500 text-xs">29m ago</span>
                                    </div>

                                    {/* YOU HAVE TO APPEND /fl_attachment/  between upload/ and /v1 */}
                                    {/* find the index of /upload/ and then append fl_attachment then append the rest */}
                                    {/* https://stackoverflow.com/questions/4313841/insert-a-string-at-a-specific-index */}
                                    {/* <a href="https://res.cloudinary.com/datidxeqm/image/upload/fl_attachment/v1/media/images/409cf4bd-acff-4bf5-9f6b-fa8fa3ce74da_m1zxjb">
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
                                    </div> */}
                            </div>
                        ))}
                    </div>
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