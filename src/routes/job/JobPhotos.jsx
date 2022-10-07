
import { useEffect, useState } from "react";
import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import { TrashIcon, CloudDownloadIcon, ViewListIcon } from "@heroicons/react/outline";
import ImageViewer from 'react-simple-image-viewer'

import * as api from './apiService'

const JobPhotos = () => {

    return (
        <div className="mt-8">
            <div className="grid grid-cols-2">
                <div className="text-gray-500">
                    <div className="leading-6 font-medium text-gray-600 relative top-2">Photos</div>
                </div>
                <div className="text-right flex justify-end">
                    <Link to="listing">
                        <div className="rounded-lg p-2 cursor-pointer border mr-3 hover:bg-gray-50">
                            <ViewListIcon className="h-4 w-4" />
                        </div>
                    </Link>
                    
                    <Link to="upload">
                        <button type="button" class="flex items-center justify-center rounded-full bg-red-600 p-1
                                                text-white hover:bg-red-700 focus:outline-none focus:ring-2
                                                    focus:ring-red-500 focus:ring-offset-2">
                            <svg class="h-6 w-6" x-description="Heroicon name: outline/plus"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>

            <Outlet />
            
        </div>
    )
}

export default JobPhotos;