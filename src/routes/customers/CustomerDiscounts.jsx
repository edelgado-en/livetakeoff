
import { useEffect, useState } from "react";
import { TrashIcon, PencilIcon, TagIcon } from "@heroicons/react/outline";
import { Link, useParams, Outlet, useLocation, useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";
import * as api from './apiService'

const CustomerDiscounts = () => {
    const { customerId } = useParams();

    return (
        <AnimatedPage>
            <div className="mx-auto mt-2 max-w-5xl px-4 sm:px-6 lg:px-8 lg:pr-52">
                <div className="py-2 mb-4">
                    <div className="flex flex-wrap items-center justify-end sm:flex-nowrap">
                        <div className="flex-shrink-0">
                            <Link to="add" className="flex items-center justify-center rounded-full bg-red-600 p-1
                                                    text-white hover:bg-red-700 focus:outline-none focus:ring-2
                                                        focus:ring-red-500 focus:ring-offset-2">
                                <svg className="h-6 w-6" x-description="Heroicon name: outline/plus"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                    stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

               <Outlet />

            </div>
        </AnimatedPage>
    )
}

export default CustomerDiscounts;