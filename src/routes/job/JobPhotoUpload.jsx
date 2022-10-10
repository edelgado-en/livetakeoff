import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom'
import { TrashIcon, PencilIcon, CheckCircleIcon } from "@heroicons/react/outline";
import ImageUploading from 'react-images-uploading';
import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import { useNavigate } from "react-router-dom";

import * as api from './apiService'

import { toast } from "react-toastify";

const JobPhotoUpload = () => {
    const navigate = useNavigate();

    const [interiorLoading, setInteriorLoading] = useState(false);
    const [exteriorLoading, setExteriorLoading] = useState(false);
    const [interiorSuccessMessage, setInteriorSuccessMessage] = useState(null);
    const [exteriorSuccessMessage, setExteriorSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null)
    const [interiorImages, setInteriorImages] = useState([]);
    const [exteriorImages, setExteriorImages] = useState([]);
    const maxNumberInterior = 20;
    const maxNumberExterior = 20

    const { jobId } = useParams();

    useEffect(() => {
        console.log(jobId);
        //TODO fetch job and if you get 403, show permissions error
        //TODO: ADD PERMISSION VALIDATION like in JobDetails
    }, [])


    const onChangeInterior = (imageList, addUpdateIndex) => {
        imageList.splice(maxNumberInterior)

        setInteriorImages(imageList);
        setInteriorSuccessMessage(null)
        setErrorMessage(null)
    };

    const onChangeExterior = (imageList, addUpdateIndex) => {
        imageList.splice(maxNumberExterior)

        setExteriorImages(imageList);
        setExteriorSuccessMessage(null)
        setErrorMessage(null)
    };

    const handleUploadInteriorPhotos = async () => {
        setErrorMessage(null)
        setInteriorSuccessMessage(null)
        setInteriorLoading(true)

        const formData = new FormData()
        
        formData.append("is_interior", true);

        interiorImages.forEach(interiorImage => {
            if (interiorImage.file.size < 10000000) { // less than 10MB
                formData.append("photo", interiorImage.file)
            }
        });

        try {
            const { data } = await api.uploadPhotos(jobId, formData);

            setInteriorImages([])
            setInteriorLoading(false);

            setInteriorSuccessMessage(`${data.uploaded_photos} photo(s) uploaded`)

        } catch (error) {
            setInteriorLoading(false)
            setInteriorImages([])

            if (error.response?.status === 403) {
                setErrorMessage('You do not have permission to view this job.')
            
            } else if (error.response?.status === 406) {
                setErrorMessage('There are already 20 interior photos for this job.')

            } else {
                setErrorMessage('Unable to upload photos at this time.')
            }
        } 
    }

    const handleUploadExteriorPhotos = async () => {
        setErrorMessage(null)
        setExteriorSuccessMessage(null)
        setExteriorLoading(true)

        const formData = new FormData()
        
        formData.append("is_interior", false);

        exteriorImages.forEach(exteriorImage => {
            if (exteriorImage.file.size < 10000000) { // less than 10MB
                formData.append("photo", exteriorImage.file)
            }
        });

        try {
            const { data } = await api.uploadPhotos(jobId, formData);

            setExteriorImages([])
            setExteriorLoading(false);

            setExteriorSuccessMessage(`${data.uploaded_photos} photo(s) uploaded`)

        } catch (error) {
            setExteriorLoading(false)
            setExteriorImages([])

            if (error.response?.status === 403) {
                setErrorMessage('You do not have permission to view this job.')
            
            } else if (error.response?.status === 406) {
                setErrorMessage('There are already 20 interior photos for this job.')

            } else {
                setErrorMessage('Unable to upload photos at this time.')
            }
        } 
    }

    return (
        <AnimatedPage>
            <>
            {errorMessage && errorMessage === 'You do not have permission to view this job.' ? 
                <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>
            :
            (
            <>
                <div className="mt-8">
                    <ImageUploading
                        multiple
                        acceptType={['jpg', 'gif', 'png']}
                        value={interiorImages}
                        onChange={onChangeInterior}
                        maxNumber={maxNumberInterior}
                        dataURLKey="data_url">
                        {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                            errors
                        }) => (
                        <>
                            <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed
                                border-gray-300 px-6 pt-5 pb-6 m-auto">
                                <div className="space-y-1 text-center">
                                    <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true">
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4
                                        4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    </svg>
                                    <div className="font-semibold">INTERIOR</div>
                                    <div className="flex text-sm text-gray-600" onClick={onImageUpload} {...dragProps}>
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-medium text-red-600
                                                    focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500
                                                    focus-within:ring-offset-2 hover:text-red-500"
                                        >
                                            <span>Upload a file</span>
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>

                            {errors && <div className="text-gray-500 mt-6 m-auto text-center text-sm">
                                {errors.maxNumber && <span>You can only upload up to 20 photos</span>}
                                {errors.acceptType && <span>Your selected file type is not allow</span>}
                                </div>
                            }

                            {interiorLoading && (
                                <>
                                <Loader />
                                <div className="text-gray-500 text-sm m-auto text-center">
                                    This might take several seconds. Please wait...
                                </div>
                                </>
                            )}

                            {!interiorLoading && imageList.length > 0 && (
                                <div className="m-auto pt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={onImageRemoveAll}
                                        className="inline-flex items-center rounded-md border border-gray-300
                                                bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
                                                hover:bg-gray-50 focus:outline-none focus:ring-2
                                                    focus:ring-red-500 focus:ring-offset-2 mr-6">
                                        Remove All
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUploadInteriorPhotos()}
                                        className="inline-flex items-center rounded-md border border-transparent
                                                bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700
                                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                        Upload All
                                    </button>
                                </div>
                            )}

                            {!interiorLoading && interiorSuccessMessage && imageList.length === 0 && (
                                <>
                                <div className="p-4 flex justify-center">
                                    <div className="flex items-start w-60 pl-6 pt-8">
                                        <div className="flex-shrink-0">
                                            <CheckCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3 w-0 flex-1 pt-0.5">
                                            <p className="text-sm font-medium text-gray-900">Successfully uploaded!</p>
                                            <p className="mt-1 text-sm text-gray-500">{interiorSuccessMessage}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex justify-center">
                                    <button 
                                        onClick={() => navigate(-1)}
                                            className="inline-flex items-center justify-center rounded-md
                                                        border border-transparent bg-red-600 px-4 py-2 text-sm
                                                        text-white shadow-sm hover:bg-red-700 focus:outline-none
                                                        focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                        Go to Photo Listing
                                    </button>
                                </div>
                                </>
                            )}

                            {!interiorLoading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}

                            {!interiorLoading && (
                                <>
                                {imageList.length > 0 && (
                                    <div className="text-gray-500 text-sm flex justify-center mt-4">{imageList.length} interior photos</div>
                                )}
                                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-1 pl-9 xl:pl-1">
                                    {imageList.map((image, index) => (
                                        <div key={index} className="py-4">
                                            <div className="flex-shrink-0 cursor-pointer">
                                                <img className="h-60 w-72 rounded-lg" src={image['data_url']} alt="" />
                                            </div>
                                            <div className="flex text-gray-500 text-sm pt-2">
                                                <PencilIcon onClick={() => onImageUpdate(index)} className="flex-shrink-0 h-4 w-4 mr-3 cursor-pointer" />
                                                <TrashIcon onClick={() => onImageRemove(index)} className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer"/>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                </>
                            )}
                        </>
                    )}
                    </ImageUploading>
                </div>
                <div className="mt-20">
                    <ImageUploading
                        multiple
                        acceptType={['jpg', 'gif', 'png']}
                        value={exteriorImages}
                        onChange={onChangeExterior}
                        maxNumber={maxNumberExterior}
                        dataURLKey="data_url">
                        {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps,
                            errors
                        }) => (
                        <>
                            <div className="flex max-w-lg justify-center rounded-md border-2 border-dashed
                                border-gray-300 px-6 pt-5 pb-6 m-auto">
                                <div className="space-y-1 text-center">
                                    <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    aria-hidden="true">
                                    <path
                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4
                                        4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    </svg>
                                    <div className="font-semibold">EXTERIOR</div>
                                    <div className="flex text-sm text-gray-600" onClick={onImageUpload} {...dragProps}>
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-medium text-red-600
                                                    focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500
                                                    focus-within:ring-offset-2 hover:text-red-500"
                                        >
                                            <span>Upload a file</span>
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                            
                            {errors && <div className="text-gray-500 mt-6 m-auto text-center text-sm">
                                {errors.maxNumber && <span>You can only upload up to 20 photos</span>}
                                {errors.acceptType && <span>Your selected file type is not allow</span>}
                                </div>
                            }

                            {exteriorLoading && (
                                <>
                                <Loader />
                                <div className="text-gray-500 text-sm m-auto text-center">
                                    This might take several seconds. Please wait...
                                </div>
                                </>
                            )}

                            {!exteriorLoading && imageList.length > 0 && (
                                <div className="m-auto pt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={onImageRemoveAll}
                                        className="inline-flex items-center rounded-md border border-gray-300
                                                bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm
                                                hover:bg-gray-50 focus:outline-none focus:ring-2
                                                    focus:ring-red-500 focus:ring-offset-2 mr-6">
                                        Remove All
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleUploadExteriorPhotos()}
                                        className="inline-flex items-center rounded-md border border-transparent
                                                bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700
                                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                        Upload All
                                    </button>
                                </div>
                            )}

                            {!exteriorLoading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}
                            
                            {!exteriorLoading && exteriorSuccessMessage && imageList.length === 0 && (
                                <>
                                <div className="p-4 flex justify-center">
                                    <div className="flex items-start w-60 pl-6 pt-8">
                                        <div className="flex-shrink-0">
                                            <CheckCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3 w-0 flex-1 pt-0.5">
                                            <p className="text-sm font-medium text-gray-900">Successfully uploaded!</p>
                                            <p className="mt-1 text-sm text-gray-500">{exteriorSuccessMessage}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 flex justify-center">
                                    <button 
                                        onClick={() => navigate(-1)}
                                            className="inline-flex items-center justify-center rounded-md
                                                        border border-transparent bg-red-600 px-4 py-2 text-sm
                                                        text-white shadow-sm hover:bg-red-700 focus:outline-none
                                                        focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                        Go to Photo Listing
                                    </button>
                                </div>
                                </>
                            )}


                            {!exteriorLoading && (
                                <>
                                {imageList.length > 0 && (
                                    <div className="text-gray-500 text-sm flex justify-center mt-4">{imageList.length} exterior photos</div>
                                )}
                                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 gap-1 pl-9 xl:pl-1">
                                    {imageList.map((image, index) => (
                                        <div key={index} className="py-4">
                                            <div className="flex-shrink-0 cursor-pointer">
                                                <img className="h-60 w-72 rounded-lg" src={image['data_url']} alt="" />
                                            </div>
                                            <div className="flex text-gray-500 text-sm pt-2">
                                                <PencilIcon onClick={() => onImageUpdate(index)} className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer" />
                                                <TrashIcon onClick={() => onImageRemove(index)} className="flex-shrink-0 h-4 w-4 mr-2 cursor-pointer"/>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                </>
                            )}
                        </>
                    )}
                    </ImageUploading>
                </div>
            </>
            )}
            </>
        </AnimatedPage>
    )
}

export default JobPhotoUpload;