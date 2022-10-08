import { useEffect, useState } from "react";
import { TrashIcon, PencilIcon } from "@heroicons/react/outline";
import ImageUploading from 'react-images-uploading';
import Loader from "../../components/loader/Loader";

const JobPhotoUpload = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null)
    const [interiorImages, setInteriorImages] = useState([]);
    const [exteriorImages, setExteriorImages] = useState([]);
    const maxNumberInterior = 20;
    const maxNumberExterior = 20

    const onChangeInterior = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setInteriorImages(imageList);
    };

    const onChangeExterior = (imageList, addUpdateIndex) => {
        // data for submit
        console.log(imageList, addUpdateIndex);
        setExteriorImages(imageList);
    };

    return (
        <>
        <div className="mt-8">
            <ImageUploading
                multiple
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
                    {imageList.length > 0 && (
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
                                className="inline-flex items-center rounded-md border border-transparent
                                        bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Upload All
                            </button>
                        </div>
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
            </ImageUploading>
        </div>
        <div className="mt-20">
            <ImageUploading
                multiple
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
                    {imageList.length > 0 && (
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
                                className="inline-flex items-center rounded-md border border-transparent
                                        bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700
                                        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                Upload All
                            </button>
                        </div>
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
            </ImageUploading>
        </div>
        </>
    )
}

export default JobPhotoUpload;