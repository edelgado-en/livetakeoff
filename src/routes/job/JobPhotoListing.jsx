
import { useEffect, useState } from "react";
import { TrashIcon, CloudDownloadIcon } from "@heroicons/react/outline";
import ImageViewer from 'react-simple-image-viewer'
import Loader from "../../components/loader/Loader";

import * as api from './apiService'

const JobPhotoListing = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null)
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
        setLoading(true)

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

            setLoading(false)

        } catch (error) {
            setLoading(false)
            
            if (error.response?.status === 403) {
                setErrorMessage('You do not have permission to view this job.')
            } else {
                setErrorMessage('Unable to load job photos.')
            }
        }
    }

    return (
        <>
            {loading && <Loader />}

            {!loading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}

            {!loading && errorMessage == null && (
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
                                        */}
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
                                        */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}
            

            {isViewerOpen && (
                <ImageViewer
                src={ interiorPhotos }
                currentIndex={ currentImage }
                disableScroll={ false }
                closeOnClickOutside={ true }
                onClose={ closeImageViewer }
                />
            )}
            
        </>
    )
}

export default JobPhotoListing;