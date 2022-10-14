
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { TrashIcon, CloudDownloadIcon } from "@heroicons/react/outline";
import ImageViewer from 'react-simple-image-viewer'
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import ReactTimeAgo from 'react-time-ago'

import * as api from './apiService'
import { toast } from "react-toastify";

import photosIcon from './photosIcon.png'

const JobPhotoListing = () => {
    const [currentImageInterior, setCurrentImageInterior] = useState(0);
    const [currentImageExterior, setCurrentImageExterior] = useState(0);
   
    const [isViewerOpenInterior, setIsViewerOpenInterior] = useState(false);
    const [isViewerOpenExterior, setIsViewerOpenExterior] = useState(false);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null)
    const [interiorPhotos, setInteriorPhotos] = useState([])
    const [exteriorPhotos, setExteriorPhotos] = useState([])
    
   
    const { jobId } = useParams();

    useEffect(() => {
        getPhotos()
    }, [])

    const openImageViewer = (index) => {
        setCurrentImageInterior(index);
        setIsViewerOpenInterior(true)
    }

    const openImageViewerExterior = (index) => {
        setCurrentImageExterior(index);
        setIsViewerOpenExterior(true)
    }

    const closeImageViewer = () => {
        setCurrentImageInterior(0);
        setIsViewerOpenInterior(false);
    };

    const closeImageViewerExterior = () => {
        setCurrentImageExterior(0);
        setIsViewerOpenExterior(false);
    };

    const handleDeletePhoto = async(photoId, isInterior) => {
        const request = {
            photos: [photoId]
        }

        try {
            await api.deletePhotos(jobId, request)

            if (isInterior) {
                const updatedPhotos = interiorPhotos.filter(p => {
                    return p.id !== photoId 
                  })

                setInteriorPhotos(updatedPhotos)
            
            } else {
                const updatedPhotos = exteriorPhotos.filter(p => {
                    return p.id !== photoId
                })

                setExteriorPhotos(updatedPhotos)
            }

            toast.error('Photo deleted!')

        } catch (error) {

        }

    }


    const getPhotos = async () => {
        setLoading(true)

        try {
            const { data } = await api.getJobPhotos(jobId)

            const interior_photos = []
            const exterior_photos = []

            data.results.forEach(entry => {
                console.log(entry)
                if (entry.interior) {
                    interior_photos.push(entry)
                } else {
                    exterior_photos.push(entry)
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
        <AnimatedPage>
            {loading && <Loader />}

            {!loading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}

            {!loading && errorMessage == null && (
                <div className="">
                <div>
                    <div className="text-gray-500 text-sm mb-1 font-semibold mt-8">
                        Interior
                        {interiorPhotos.length > 0 &&
                            <span className="bg-gray-100 text-gray-700 hidden ml-2 py-0.5 px-2.5
                                          rounded-full text-xs font-medium md:inline-block">{interiorPhotos.length}</span>
                        }
                    </div>
                    
                    {interiorPhotos.length === 0 && (
                            <div className="text-sm mt-10 flex flex-col items-center">
                                 <img
                                    className="block h-8 w-auto text-gray-200"
                                    src={photosIcon}
                                    alt="photos"
                                /> 
                                <div className="font-semibold text-gray-600 mt-4">
                                    No photos uploaded
                                </div>
                                <span className="text-gray-500">Click on the plus icon to upload some photos.</span>                            
                            </div>
                    )}
                    
                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-1 pl-9 xl:pl-1">
                        {interiorPhotos.map((photo, index) => (
                            <div key={index} className="py-4">
                                    <div className="flex-shrink-0 cursor-pointer" onClick={ () => openImageViewer(index) }>
                                        <img className="h-60 w-72 rounded-lg" src={photo.image} alt="" />
                                    </div>
                                    {/* <div className="pt-2 flex text-gray-500 text-sm">
                                        {photo.name}
                                    </div> */}
                                    <div className="flex text-gray-500 text-sm pt-2">
                                        <CloudDownloadIcon className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer" />
                                        <TrashIcon 
                                            onClick={() => handleDeletePhoto(photo.id, true)}
                                            className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer"/>
                                        <span className="text-gray-500 text-sm">
                                            <ReactTimeAgo date={new Date(photo.created_at)} locale="en-US" timeStyle="twitter" />
                                        </span>
                                        <span className="text-sm ml-3">{photo.name}</span>
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
                            <span className="bg-gray-100 text-gray-700 hidden ml-2 py-0.5 px-2.5
                                          rounded-full text-xs font-medium md:inline-block">{exteriorPhotos.length}</span>
                        }
                    </div>
                    {exteriorPhotos.length === 0 && (
                            <div className="text-sm mt-10 flex flex-col items-center">
                                 <img
                                    className="block h-8 w-auto text-gray-200"
                                    src={photosIcon}
                                    alt="photos"
                                /> 
                                <div className="font-semibold text-gray-600 mt-4">
                                    No photos uploaded
                                </div>
                                <span className="text-gray-500">Click on the plus icon to upload some photos.</span>                            
                            </div>
                    )}
                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-1 pl-9 xl:pl-1">
                        {exteriorPhotos.map((photo, index) => (
                            <div key={index} className="py-4">
                                    <div className="flex-shrink-0 cursor-pointer" onClick={ () => openImageViewerExterior(index) }>
                                        <img className="h-60 w-72 rounded-lg" src={photo.image} alt="" />
                                    </div>
                                    <div className="flex text-gray-500 text-sm pt-2">
                                        <CloudDownloadIcon className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer" />
                                        <TrashIcon 
                                            onClick={() => handleDeletePhoto(photo.id, false)}
                                            className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer"/>
                                        <span className="text-gray-500 text-sm">
                                            <ReactTimeAgo date={new Date(photo.created_at)} locale="en-US" timeStyle="twitter" />
                                        </span>
                                        <span className="text-sm ml-3 truncate w-44 text-ellipsis overflow-hidden whitespace-nowrap">{photo.name}</span>
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
            

            {isViewerOpenInterior && (
                <ImageViewer
                src={ interiorPhotos.map(p => p.image) }
                currentIndex={ currentImageInterior }
                disableScroll={ false }
                closeOnClickOutside={ true }
                onClose={ closeImageViewer }
                />
            )}

            {isViewerOpenExterior && (
                <ImageViewer
                src={ exteriorPhotos.map(p => p.image) }
                currentIndex={ currentImageExterior }
                disableScroll={ false }
                closeOnClickOutside={ true }
                onClose={ closeImageViewerExterior }
                />
            )}
            
        </AnimatedPage>
    )
}

export default JobPhotoListing;