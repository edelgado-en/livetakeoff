
import { useEffect, useState } from "react"
import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import { CheckCircleIcon, QuestionMarkCircleIcon, ArrowRightIcon } from "@heroicons/react/outline";
import * as api from './apiService'

import { Switch } from "@headlessui/react";

import Loader from "../../components/loader/Loader";
import AnimatedPage from "../../components/animatedPage/AnimatedPage";

import logo from '../../images/logo_2618936_web.png'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const SharedJob = () => {
    const { jobId } = useParams();
    const [loading, setLoading] = useState(false)
    const [jobDetails, setJobDetails] = useState({service_assignments: [], retainer_service_assignments: []})
    const [showActions, setShowActions] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    return (
        <AnimatedPage>
            {loading && <Loader />}

            {!loading && errorMessage && <div className="text-gray-500 m-auto text-center mt-20">{errorMessage}</div>}

            {!loading && errorMessage == null && (
                /* You do want to have a top bar and on the top right add a button to login and add other links that can be public like services without prices add a button says contact us. Add contact link to a contact page
                Add reviews link. Add a get started link with a link to watch video.
                Maybe use the Salient marketing template. DO Sign in and Sign up button */
                <div className="mt-8 m-auto max-w-2xl">
                    {/* Add logo and title Livetakeoff */}
                    <div className="flex justify-between">
                        <div className="text-2xl font-semibold text-gray-600 relative top-2">
                            Livetakeoff
                        </div>
                        <img
                            className="block h-12 w-auto"
                            src={logo}
                            alt="Your Company"
                        /> 
                    </div>
                    <div className="flex flex-row mt-8">
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-600">Job Details</h1>
                        </div>
                    </div>
                </div>
            )}

            
        </AnimatedPage>
    )
}

export default SharedJob;