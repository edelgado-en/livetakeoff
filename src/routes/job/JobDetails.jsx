
import { Link, useParams, Outlet, useLocation } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/outline";

const tabs = [
    { name: 'Info', href: '#', current: false },
    { name: 'Edit', href: '#', current: false },
    { name: 'Photos', href: '#', current: true },
  ]
  
function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const JobDetails = () => {
    const { jobId } = useParams();
    const location = useLocation();

    return (
        <div className="xl:px-16 px-4 m-auto max-w-7xl">
            <div className="flex">
                <div style={{ marginTop: '2px' }}>
                    <Link to="/jobs" className="text-xs leading-5 font-semibold bg-slate-400/10
                                                     rounded-full p-2 text-slate-500
                                                    flex items-center space-x-2 hover:bg-slate-400/20
                                                    dark:highlight-white/5">
                        <ArrowLeftIcon className="flex-shrink-0 h-4 w-4 cursor-pointer"/>
                    </Link>
                </div>
                <div className="ml-2 text-sm text-slate-500" style={{ marginTop: '8px' }}>
                    Job Id: {jobId}
                </div>
                <div className="flex-1 flex justify-end">
                    <div>
                        
                        <div className="">
                            <nav className="flex space-x-2" aria-label="Tabs">
                                <Link
                                    to="details"
                                    className={classNames(
                                    location.pathname.includes("details")? 'bg-red-100 text-red-700' : 'text-red-500 hover:text-red-700',
                                    'px-2 py-2 font-medium text-sm rounded-md'
                                )}
                                >
                                    Details
                                </Link>
                                <Link
                                    to="comments"
                                    className={classNames(
                                    location.pathname.includes("comments")? 'bg-red-100 text-red-700' : 'text-red-500 hover:text-red-700',
                                    'px-2 py-2 font-medium text-sm rounded-md'
                                )}
                                >
                                    Comments
                                </Link>
                                <Link
                                    to="photos"
                                    className={classNames(
                                    location.pathname.includes("photos")? 'bg-red-100 text-red-700' : 'text-red-500 hover:text-red-700',
                                    'px-2 py-2 font-medium text-sm rounded-md'
                                )}
                                >
                                    Photos
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            <Outlet />

            <div className="p-20"></div>
        </div>
    )
}

export default JobDetails;